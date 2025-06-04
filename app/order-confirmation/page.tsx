"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle, ArrowRight, MessageCircle, Mail, Printer } from "lucide-react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const [orderData, setOrderData] = useState<any>(null)
  const [currentDate] = useState(new Date())

  useEffect(() => {
    // In a real app, you would fetch order data from your backend using the orderId
    // For now, we'll create mock data
    setOrderData({
      id: orderId,
      status: "confirmed",
      estimatedDelivery: "3-5 business days",
      items: [
        { id: 1, name: "Premium Tea Blend", price: 4500, quantity: 2 },
        { id: 2, name: "Herbal Infusion", price: 3800, quantity: 1 },
      ],
      subtotal: 12800,
      shipping: 1500,
      total: 14300,
      customer: {
        name: "Customer Name",
        email: "customer@example.com",
        phone: "+234 XXX XXX XXXX",
        address: "Sample Address, Lagos, Nigeria"
      },
      paymentMethod: "Bank Transfer"
    })
  }, [orderId])

  const whatsappMessage = encodeURIComponent(
    `Hello Xquisitenoctéa! I just placed order #${orderId} and wanted to confirm the details.`,
  )

  // Format currency in Naira
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  }

  // Print receipt function
  const printReceipt = () => {
    window.print();
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-xl">Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-8">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center space-y-8">
          {/* Success Icon - No Print */}
          <div className="flex justify-center no-print">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="h-16 w-16 text-white" />
            </div>
          </div>

          {/* Success Message - No Print */}
          <div className="space-y-4 no-print">
            <h1 className="text-4xl font-bold text-white">Order Confirmed!</h1>
            <p className="text-xl text-gray-300">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>
          </div>

          {/* Order Details - Styled for both screen and print */}
          <Card className="bg-gray-900 border-gray-800 print-receipt">
            <CardContent className="p-8 text-left">
              {/* Print-only header */}
              <div className="hidden print-only print-receipt-header">
                <Image 
                  src="/logo.jpg" 
                  alt="Xquisitenoctéa" 
                  width={150} 
                  height={80} 
                  className="print-receipt-logo" 
                />
                <h1 className="text-2xl font-bold">Xquisitenoctéa</h1>
                <p>Premium Tea & Infusions</p>
                <p>Order Receipt</p>
              </div>

              <h2 className="text-xl font-semibold text-white mb-6">Order Details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Order Number:</span>
                  <p className="text-white font-semibold">#{orderId}</p>
                </div>

                <div>
                  <span className="text-gray-400">Status:</span>
                  <p className="text-green-400 font-semibold capitalize">Confirmed</p>
                </div>

                <div>
                  <span className="text-gray-400">Estimated Delivery:</span>
                  <p className="text-white font-semibold">{orderData.estimatedDelivery}</p>
                </div>

                <div>
                  <span className="text-gray-400">Order Date:</span>
                  <p className="text-white font-semibold">{currentDate.toLocaleDateString()}</p>
                </div>
              </div>

              {/* Customer Information */}
              <div className="mt-6 border-t border-gray-800 pt-6">
                <h3 className="text-white font-semibold mb-3">Customer Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Name:</span>
                    <p className="text-white">{orderData.customer.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Email:</span>
                    <p className="text-white">{orderData.customer.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Phone:</span>
                    <p className="text-white">{orderData.customer.phone}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Address:</span>
                    <p className="text-white">{orderData.customer.address}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mt-6 border-t border-gray-800 pt-6">
                <h3 className="text-white font-semibold mb-3">Order Items</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-2 text-gray-400">Item</th>
                      <th className="text-center py-2 text-gray-400">Qty</th>
                      <th className="text-right py-2 text-gray-400">Price</th>
                      <th className="text-right py-2 text-gray-400">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderData.items.map((item: any) => (
                      <tr key={item.id} className="border-b border-gray-800">
                        <td className="py-2 text-white">{item.name}</td>
                        <td className="py-2 text-white text-center">{item.quantity}</td>
                        <td className="py-2 text-white text-right">{formatCurrency(item.price)}</td>
                        <td className="py-2 text-white text-right">{formatCurrency(item.price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Order Summary */}
              <div className="mt-6 border-t border-gray-800 pt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Subtotal:</span>
                  <span className="text-white">{formatCurrency(orderData.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Shipping:</span>
                  <span className="text-white">{formatCurrency(orderData.shipping)}</span>
                </div>
                <div className="flex justify-between font-semibold mt-4 pt-4 border-t border-gray-800">
                  <span className="text-white">Total:</span>
                  <span className="text-yellow-400">{formatCurrency(orderData.total)}</span>
                </div>
                <div className="mt-4 text-sm">
                  <span className="text-gray-400">Payment Method:</span>
                  <span className="text-white ml-2">{orderData.paymentMethod}</span>
                </div>
              </div>

              {/* What happens next - No Print */}
              <div className="mt-6 p-4 bg-black rounded-lg border border-gray-700 no-print">
                <h3 className="text-white font-semibold mb-2">What happens next?</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• We will contact you shortly via WhatsApp to confirm your order</li>
                  <li>• You'll receive payment instructions if you selected bank transfer</li>
                  <li>• Your order will be prepared and shipped within 24-48 hours</li>
                  <li>• You'll receive tracking information once your order ships</li>
                </ul>
              </div>

              {/* Print-only footer */}
              <div className="hidden print-only print-receipt-footer">
                <p>Thank you for your purchase!</p>
                <p>Xquisitenoctéa - Premium Tea & Infusions</p>
                <p>Phone: +234 XXX XXX XXXX | Email: hello@xquisitenoctea.com</p>
                <p>Visit us online at www.xquisitenoctea.com</p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information - No Print */}
          <Card className="bg-gray-900 border-gray-800 no-print">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Need Help?</h3>
              <p className="text-gray-300 mb-4">If you have any questions about your order, feel free to contact us:</p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={`https://wa.me/2348000000000?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp Us
                </a>

                <a
                  href="mailto:hello@xquisitenoctea.com"
                  className="inline-flex items-center justify-center px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg transition-colors"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email Us
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons - No Print */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center no-print">
            <Link href="/shop">
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3">
                Continue Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            <Button
              variant="outline"
              className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-8 py-3"
              onClick={printReceipt}
            >
              <Printer className="mr-2 h-4 w-4" />
              Print Receipt
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
