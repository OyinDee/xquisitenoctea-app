"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle, ArrowRight, MessageCircle, Mail, Printer } from "lucide-react"
import { useSearchParams } from "next/navigation"
import Receipt from "@/components/ui/receipt"

interface OrderData {
  id: string
  status: string
  estimatedDelivery: string
  items: Array<{
    id: string | number
    name: string
    price: number
    quantity: number
  }>
  subtotal: number
  shipping: number
  total: number
  customer: {
    name: string
    email: string
    address: string
  }
  createdAt: string
}

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        setError("No order ID provided")
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/orders/${orderId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch order")
        }
        const data = await response.json()
        setOrderData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error || !orderData) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="text-center">
                <h2 className="text-xl text-red-400 mb-4">Error</h2>
                <p className="text-gray-300">{error || "Order not found"}</p>
                <Link href="/shop">
                  <Button className="mt-6">Return to Shop</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6">
        {/* Order Success Card */}
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardContent className="p-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white mb-2">Order Confirmed!</h1>
              <p className="text-gray-300 mb-6">
                Thank you for your order. We'll send you a confirmation email shortly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="secondary">
                  <Link href="/shop">
                    Continue Shopping
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print Receipt
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Receipt Card - Only visible in print mode */}
        <div className="print:block hidden">
          <Receipt order={orderData} />
        </div>

        {/* Order Details Card - Hidden in print mode */}
        <Card className="bg-gray-900 border-gray-800 no-print">
          <CardContent className="p-6">
            <div className="grid gap-6">
              <div>
                <h2 className="text-lg font-semibold text-white mb-4">Order Details</h2>
                <div className="space-y-2">
                  <p className="text-gray-300">Order number: {orderData.id}</p>
                  <p className="text-gray-300">Status: {orderData.status}</p>
                  <p className="text-gray-300">Estimated delivery: {orderData.estimatedDelivery}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Items</h3>
                <div className="space-y-4">
                  {orderData.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div className="text-gray-300">
                        {item.name} x {item.quantity}
                      </div>
                      <div className="text-gray-300">₦{item.price * item.quantity}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Shipping Information</h3>
                <div className="text-gray-300">
                  <p>{orderData.customer.name}</p>
                  <p>{orderData.customer.address}</p>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal:</span>
                    <span>₦{orderData.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Shipping:</span>
                    <span>₦{orderData.shipping}</span>
                  </div>
                  <div className="flex justify-between text-xl font-semibold text-white">
                    <span>Total:</span>
                    <span>₦{orderData.total}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Card */}
        <Card className="bg-gray-900 border-gray-800 mt-8 no-print">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Need Help?</h3>
            <p className="text-gray-300 mb-4">If you have any questions about your order, feel free to contact us:</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`https://wa.me/2349131281389?text=${encodeURIComponent("Hello! I have a question about my order #" + orderData.id)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp Us
              </a>
              <a
                href={`mailto:xquisite001@outlook.com?subject=Order%20${orderData.id}%20Question`}
                className="inline-flex items-center justify-center px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg transition-colors"
              >
                <Mail className="h-4 w-4 mr-2" />
                Email Us
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
