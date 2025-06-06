export interface OrderDetailPageProps {
  params: {
    id: string
  }
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  subtotal: number;
  shippingFee: number;
  shippingAddress: string;
  paymentMethod: string;
  paymentStatus: "paid" | "pending" | "failed";
  notes?: string;
  createdAt: string;
  updatedAt: string;
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

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [currentStatus, setCurrentStatus] = useState<string>("")
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState(false)

  useEffect(() => {
    fetchOrder()
  }, [params.id])

  const fetchOrder = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/orders/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data)
        setCurrentStatus(data.status)
      } else {
        console.error('Failed to fetch order')
      }
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateOrderStatus = async (newStatus: string) => {
    if (!order) return

    setIsUpdating(true)
    try {
      const response = await fetch(`/api/orders/${params.id}`, {
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
        console.error('Failed to update order status')
      }
    } catch (error) {
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
    window.print()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
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
              Order {order.orderNumber}
              <Badge className={statusColors[order.status]}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </h1>
            <p className="text-muted-foreground">
              Placed on {formatDate(order.createdAt)}
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
                    <TableRow key={item.productId}>
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
                  <span>₦{formatCurrency(order.shippingFee)}</span>
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
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                
                {order.status === "processing" || order.status === "shipped" || order.status === "delivered" ? (
                  <div className="relative">
                    <div className="absolute -left-[25px] h-4 w-4 rounded-full bg-primary"></div>
                    <p className="font-medium">Processing</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.updatedAt)}
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
                      {formatDate(order.updatedAt)}
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
                <p>{order.orderNumber}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Payment Method</h3>
                <p>{order.paymentMethod}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Payment Status</h3>
                <Badge className={paymentStatusColors[order.paymentStatus]}>
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
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
                <p className="font-medium mt-1">{order.customerName}</p>
                <p className="text-sm">{order.customerEmail}</p>
                <p className="text-sm">{order.customerPhone}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Shipping Address</h3>
                <p className="text-sm whitespace-pre-line">{order.shippingAddress}</p>
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
