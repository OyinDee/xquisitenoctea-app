"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { use } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Printer, Send, Truck } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image?: string;
}

interface Order {
  _id: string;
  id: string;
  customer_info: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
    state?: string;
  };
  items: OrderItem[];
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  subtotal: number;
  shipping: number;
  total: number;
  payment_method: string;
  payment_status?: "paid" | "pending" | "failed";
  notes?: string;
  created_at: string;
  updated_at: string;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  processing: "bg-blue-100 text-blue-800 border-blue-200",
  shipped: "bg-purple-100 text-purple-800 border-purple-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200"
};

const paymentStatusColors = {
  paid: "bg-green-100 text-green-800 border-green-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  failed: "bg-red-100 text-red-800 border-red-200"
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const resolvedParams = use(params)
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [currentStatus, setCurrentStatus] = useState<string>("")
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchOrder()
  }, [resolvedParams.id])

  const fetchOrder = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/orders/${resolvedParams.id}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data)
        setCurrentStatus(data.status)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to fetch order')
        console.error('Failed to fetch order:', errorData)
      }
    } catch (error) {
      setError('Error fetching order')
      console.error('Error fetching order:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateOrderStatus = async (newStatus: string) => {
    if (!order) return

    setIsUpdating(true)
    setError(null)
    try {
      const response = await fetch(`/api/orders/${resolvedParams.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        await fetchOrder() // Refresh order data
        setCurrentStatus(newStatus)
        setStatusUpdateSuccess(true)
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setStatusUpdateSuccess(false)
        }, 3000)
      } else {
        let errorMessage = 'Failed to update order status'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (e) {
          console.error('Error parsing error response:', e)
        }
        setError(errorMessage)
        console.error('Failed to update order status:', errorMessage)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error updating order status'
      setError(errorMessage)
      console.error('Error updating order status:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const printOrder = () => {
    if (!order) return

    const printContent = document.createElement('div')
    printContent.className = 'print-only'
    
    // Create receipt content
    printContent.innerHTML = `
      <div class="receipt">
        <div class="receipt-header">
          <div class="logo">
            <img src="/logo.jpg" alt="Xquisite Noctea" class="logo-img" />
          </div>
          <h1 class="store-name">Xquisite Noctea</h1>
          <p class="store-tagline">Luxury Fragrances & Body Care</p>
        </div>
        
        <div class="receipt-info">
          <div class="order-number">
            <span class="label">Order #</span>
            <span class="value">${order.id}</span>
          </div>
          <div class="order-date">
            <span class="label">Date</span>
            <span class="value">${formatDate(order.created_at)}</span>
          </div>
        </div>
        
        <div class="receipt-section">
          <h2>Customer Information</h2>
          <div class="customer-info">
            <p class="name">${order.customer_info.firstName} ${order.customer_info.lastName}</p>
            <p class="contact">${order.customer_info.email}</p>
            <p class="contact">${order.customer_info.phone}</p>
            <p class="address">${order.customer_info.address}</p>
            <p class="address">${order.customer_info.city}, ${order.customer_info.state}</p>
          </div>
        </div>
        
        <div class="receipt-section">
          <h2>Order Items</h2>
          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td class="item-name">${item.name} <span class="item-size">(${item.size})</span></td>
                  <td class="item-price">₦${formatCurrency(item.price)}</td>
                  <td class="item-quantity">${item.quantity}</td>
                  <td class="item-total">₦${formatCurrency(item.price * item.quantity)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="order-summary">
            <div class="summary-row">
              <span class="label">Subtotal</span>
              <span class="value">₦${formatCurrency(order.subtotal)}</span>
            </div>
            <div class="summary-row">
              <span class="label">Shipping</span>
              <span class="value">₦${formatCurrency(order.shipping)}</span>
            </div>
            <div class="summary-row total">
              <span class="label">Total</span>
              <span class="value">₦${formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>
        
        <div class="receipt-section">
          <h2>Payment Information</h2>
          <div class="payment-info">
            <div class="payment-row">
              <span class="label">Method</span>
              <span class="value">${order.payment_method}</span>
            </div>
            <div class="payment-row">
              <span class="label">Status</span>
              <span class="value status ${order.payment_status || 'pending'}">${order.payment_status || 'pending'}</span>
            </div>
          </div>
        </div>
        
        <div class="receipt-footer">
          <p class="thank-you">Thank you for your purchase!</p>
          <div class="contact-info">
            <p>For any questions, please contact us at:</p>
            <p>Email: support@xquisitenoctea.com</p>
            <p>Phone: +234 802 345 6789</p>
          </div>
          <div class="barcode">
            <img src="/barcode.png" alt="Order Barcode" class="barcode-img" />
          </div>
        </div>
      </div>
    `
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Order Receipt - ${order.id}</title>
            <meta charset="utf-8">
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
              
              body {
                font-family: 'Inter', sans-serif;
                line-height: 1.6;
                color: #1a1a1a;
                margin: 0;
                padding: 0;
                background: #fff;
              }
              
              .receipt {
                max-width: 800px;
                margin: 0 auto;
                padding: 40px;
                background: #fff;
              }
              
              .receipt-header {
                text-align: center;
                margin-bottom: 40px;
                padding-bottom: 20px;
                border-bottom: 2px solid #f0f0f0;
              }
              
              .logo {
                margin-bottom: 20px;
              }
              
              .logo-img {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                object-fit: cover;
              }
              
              .store-name {
                font-size: 28px;
                font-weight: 700;
                color: #1a1a1a;
                margin: 0 0 8px;
              }
              
              .store-tagline {
                font-size: 16px;
                color: #666;
                margin: 0;
              }
              
              .receipt-info {
                display: flex;
                justify-content: space-between;
                margin-bottom: 30px;
                padding: 20px;
                background: #f8f8f8;
                border-radius: 8px;
              }
              
              .order-number, .order-date {
                display: flex;
                flex-direction: column;
              }
              
              .label {
                font-size: 14px;
                color: #666;
                margin-bottom: 4px;
              }
              
              .value {
                font-size: 16px;
                font-weight: 600;
                color: #1a1a1a;
              }
              
              .receipt-section {
                margin-bottom: 30px;
                padding: 20px;
                background: #fff;
                border: 1px solid #f0f0f0;
                border-radius: 8px;
              }
              
              .receipt-section h2 {
                font-size: 18px;
                font-weight: 600;
                color: #1a1a1a;
                margin: 0 0 20px;
                padding-bottom: 10px;
                border-bottom: 1px solid #f0f0f0;
              }
              
              .customer-info {
                display: grid;
                gap: 8px;
              }
              
              .customer-info .name {
                font-weight: 600;
                font-size: 16px;
                margin: 0;
              }
              
              .customer-info .contact,
              .customer-info .address {
                color: #666;
                margin: 0;
              }
              
              .items-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
              }
              
              .items-table th {
                text-align: left;
                padding: 12px;
                font-weight: 600;
                color: #666;
                border-bottom: 2px solid #f0f0f0;
              }
              
              .items-table td {
                padding: 12px;
                border-bottom: 1px solid #f0f0f0;
              }
              
              .item-name {
                font-weight: 500;
              }
              
              .item-size {
                color: #666;
                font-size: 14px;
              }
              
              .item-price,
              .item-quantity,
              .item-total {
                text-align: right;
              }
              
              .order-summary {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 2px solid #f0f0f0;
              }
              
              .summary-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
              }
              
              .summary-row.total {
                margin-top: 12px;
                padding-top: 12px;
                border-top: 1px solid #f0f0f0;
                font-weight: 700;
                font-size: 18px;
              }
              
              .payment-info {
                display: grid;
                gap: 12px;
              }
              
              .payment-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
              }
              
              .status {
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 500;
              }
              
              .status.paid {
                background: #e6f4ea;
                color: #1e7e34;
              }
              
              .status.pending {
                background: #fff3cd;
                color: #856404;
              }
              
              .status.failed {
                background: #f8d7da;
                color: #721c24;
              }
              
              .receipt-footer {
                text-align: center;
                margin-top: 40px;
                padding-top: 30px;
                border-top: 2px solid #f0f0f0;
              }
              
              .thank-you {
                font-size: 18px;
                font-weight: 600;
                color: #1a1a1a;
                margin: 0 0 20px;
              }
              
              .contact-info {
                color: #666;
                margin-bottom: 30px;
              }
              
              .contact-info p {
                margin: 4px 0;
              }
              
              .barcode {
                margin-top: 30px;
              }
              
              .barcode-img {
                max-width: 200px;
                height: auto;
              }
              
              @media print {
                body {
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
                
                .receipt {
                  padding: 0;
                }
                
                .receipt-section {
                  break-inside: avoid;
                }
              }
            </style>
          </head>
          <body>
            ${printContent.outerHTML}
          </body>
        </html>
      `)
      
      // Wait for content to load before printing
      printWindow.document.close()
      printWindow.focus()
      
      // Add a small delay to ensure content is loaded
      setTimeout(() => {
        printWindow.print()
        // Close the window after printing
        setTimeout(() => {
          printWindow.close()
        }, 1000)
      }, 500)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">{error}</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Order not found</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="ml-4">
            <h1 className="text-2xl font-bold flex items-center gap-3">
              Order {order.id}
              <Badge className={statusColors[order.status]}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </h1>
            <p className="text-muted-foreground">
              Placed on {formatDate(order.created_at)}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={printOrder}>
            <Printer className="mr-2 h-4 w-4" />
            Print Order
          </Button>
          <Button variant="outline" size="sm">
            <Send className="mr-2 h-4 w-4" />
            Email Receipt
          </Button>
        </div>
      </div>
      
      {error && (
        <Alert className="mb-6 bg-red-50 border-red-200">
          <AlertTitle className="text-red-600">Error</AlertTitle>
          <AlertDescription className="text-red-600">
            {error}
          </AlertDescription>
        </Alert>
      )}
      
      {statusUpdateSuccess && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <AlertTitle className="text-green-600">Success</AlertTitle>
          <AlertDescription className="text-green-600">
            Order status has been updated successfully.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:block">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {item.image && (
                            <div className="relative h-12 w-12 overflow-hidden rounded border">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <span className="font-medium">{item.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>₦{formatCurrency(item.price)}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        ₦{formatCurrency(item.price * item.quantity)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="mt-6 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₦{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>₦{formatCurrency(order.shipping)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>₦{formatCurrency(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative pl-6 border-l space-y-6">
                <div className="relative">
                  <div className="absolute -left-[25px] h-4 w-4 rounded-full bg-primary"></div>
                  <p className="font-medium">Order Placed</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(order.created_at)}
                  </p>
                </div>
                
                {order.status === "processing" || order.status === "shipped" || order.status === "delivered" ? (
                  <div className="relative">
                    <div className="absolute -left-[25px] h-4 w-4 rounded-full bg-primary"></div>
                    <p className="font-medium">Processing</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.updated_at)}
                    </p>
                  </div>
                ) : null}
                
                {order.status === "shipped" || order.status === "delivered" ? (
                  <div className="relative">
                    <div className="absolute -left-[25px] h-4 w-4 rounded-full bg-primary"></div>
                    <p className="font-medium">Shipped</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(new Date().toISOString())}
                    </p>
                  </div>
                ) : null}
                
                {order.status === "delivered" ? (
                  <div className="relative">
                    <div className="absolute -left-[25px] h-4 w-4 rounded-full bg-primary"></div>
                    <p className="font-medium">Delivered</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(new Date().toISOString())}
                    </p>
                  </div>
                ) : null}
                
                {order.status === "cancelled" ? (
                  <div className="relative">
                    <div className="absolute -left-[25px] h-4 w-4 rounded-full bg-destructive"></div>
                    <p className="font-medium">Cancelled</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.updated_at)}
                    </p>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
          
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Order Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Order Number</h3>
                <p>{order.id}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Payment Method</h3>
                <p>{order.payment_method}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Payment Status</h3>
                <Badge className={paymentStatusColors[order.payment_status || 'pending']}>
                  {(order.payment_status || 'pending').charAt(0).toUpperCase() + (order.payment_status || 'pending').slice(1)}
                </Badge>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Order Status</h3>
                <div className="flex items-center gap-3 mt-1">
                  <Select
                    value={currentStatus}
                    onValueChange={updateOrderStatus}
                    disabled={isUpdating}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {isUpdating && <span className="text-sm">Updating...</span>}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Customer Information</h3>
                <p className="font-medium mt-1">{order.customer_info.firstName} {order.customer_info.lastName}</p>
                <p className="text-sm">{order.customer_info.email}</p>
                <p className="text-sm">{order.customer_info.phone}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Shipping Address</h3>
                <p className="text-sm whitespace-pre-line">{order.customer_info.address}, {order.customer_info.city}, {order.customer_info.state}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled={order.status === "shipped"} variant="outline">
                <Truck className="mr-2 h-4 w-4" />
                {order.status === "shipped" ? "Tracking Information Sent" : "Send Tracking Information"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
