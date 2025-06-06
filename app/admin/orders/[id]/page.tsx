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
        method: 'PUT',
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
        const errorData = await response.json()
        setError(errorData.error || 'Failed to update order status')
        console.error('Failed to update order status:', errorData)
      }
    } catch (error) {
      setError('Error updating order status')
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
      <div class="p-8 max-w-md mx-auto">
        <div class="text-center mb-6">
          <h1 class="text-2xl font-bold mb-2">Xquisite Noctea</h1>
          <p class="text-sm">Order Receipt</p>
        </div>
        
        <div class="mb-6">
          <p class="font-medium">Order #${order.id}</p>
          <p class="text-sm">Date: ${formatDate(order.created_at)}</p>
        </div>
        
        <div class="mb-6">
          <h2 class="font-medium mb-2">Customer Information</h2>
          <p>${order.customer_info.firstName} ${order.customer_info.lastName}</p>
          <p>${order.customer_info.email}</p>
          <p>${order.customer_info.phone}</p>
          <p>${order.customer_info.address}</p>
          <p>${order.customer_info.city}, ${order.customer_info.state}</p>
        </div>
        
        <div class="mb-6">
          <h2 class="font-medium mb-2">Order Items</h2>
          <table class="w-full mb-4">
            <thead>
              <tr class="border-b">
                <th class="text-left py-2">Item</th>
                <th class="text-right py-2">Price</th>
                <th class="text-right py-2">Qty</th>
                <th class="text-right py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr class="border-b">
                  <td class="py-2">${item.name} (${item.size})</td>
                  <td class="text-right py-2">₦${formatCurrency(item.price)}</td>
                  <td class="text-right py-2">${item.quantity}</td>
                  <td class="text-right py-2">₦${formatCurrency(item.price * item.quantity)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="text-right">
            <p>Subtotal: ₦${formatCurrency(order.subtotal)}</p>
            <p>Shipping: ₦${formatCurrency(order.shipping)}</p>
            <p class="font-bold">Total: ₦${formatCurrency(order.total)}</p>
          </div>
        </div>
        
        <div class="mb-6">
          <h2 class="font-medium mb-2">Payment Information</h2>
          <p>Method: ${order.payment_method}</p>
          <p>Status: ${order.payment_status || 'pending'}</p>
        </div>
        
        <div class="text-center text-sm mt-8">
          <p>Thank you for your purchase!</p>
          <p>For any questions, please contact us at:</p>
          <p>Email: support@xquisitenoctea.com</p>
          <p>Phone: +234 802 345 6789</p>
        </div>
      </div>
    `
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Order Receipt - ${order.id}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #000;
              }
              .print-only {
                padding: 20px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                padding: 8px;
                text-align: left;
              }
              .text-right {
                text-align: right;
              }
              .text-center {
                text-align: center;
              }
              .font-bold {
                font-weight: bold;
              }
              .font-medium {
                font-weight: 500;
              }
              .mb-2 {
                margin-bottom: 0.5rem;
              }
              .mb-4 {
                margin-bottom: 1rem;
              }
              .mb-6 {
                margin-bottom: 1.5rem;
              }
              .mt-8 {
                margin-top: 2rem;
              }
              .py-2 {
                padding-top: 0.5rem;
                padding-bottom: 0.5rem;
              }
              .border-b {
                border-bottom: 1px solid #ddd;
              }
            </style>
          </head>
          <body>
            ${printContent.outerHTML}
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.focus()
      
      // Wait for images to load before printing
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
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
