"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle, ArrowRight, MessageCircle, Mail } from "lucide-react"
import { useSearchParams } from "next/navigation"

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const [orderData, setOrderData] = useState<any>(null)

  useEffect(() => {
    // In a real app, you would fetch order data from your backend using the orderId
    // For now, we'll create mock data
    setOrderData({
      id: orderId,
      status: "confirmed",
      estimatedDelivery: "3-5 business days",
    })
  }, [orderId])

  const whatsappMessage = encodeURIComponent(
    `Hello Xquisitenoctéa! I just placed order #${orderId} and wanted to confirm the details.`,
  )

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-8">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center space-y-8">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="h-16 w-16 text-white" />
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white">Order Confirmed!</h1>
            <p className="text-xl text-gray-300">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>
          </div>

          {/* Order Details */}
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-8 text-left">
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
                  <p className="text-white font-semibold">3-5 business days</p>
                </div>

                <div>
                  <span className="text-gray-400">Order Date:</span>
                  <p className="text-white font-semibold">{new Date().toLocaleDateString()}</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-black rounded-lg border border-gray-700">
                <h3 className="text-white font-semibold mb-2">What happens next?</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• We will contact you shortly via WhatsApp to confirm your order</li>
                  <li>• You'll receive payment instructions if you selected bank transfer</li>
                  <li>• Your order will be prepared and shipped within 24-48 hours</li>
                  <li>• You'll receive tracking information once your order ships</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-gray-900 border-gray-800">
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3">
                Continue Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            <Button
              variant="outline"
              className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-8 py-3"
              onClick={() => window.print()}
            >
              Print Receipt
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
