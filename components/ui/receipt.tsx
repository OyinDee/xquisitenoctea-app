"use client"

import { Phone, Mail, Store } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"

interface ReceiptProps {
  order: {
    id: string
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
    createdAt: string | Date
  }
}

export default function Receipt({ order }: ReceiptProps) {
  return (
    <div className="w-full max-w-[400px] mx-auto bg-white text-black p-6 print:p-4 print:max-w-full print:mx-0 print:shadow-none">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Xquisitenoctéa</h2>
        <p className="text-sm text-gray-600">Premium Perfumes</p>
      </div>

      <Separator className="my-4" />

      {/* Order Info */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span>Order #:</span>
          <span className="font-medium">{order.id}</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span>Date:</span>
          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Items */}
      <div className="mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Item</th>
              <th className="text-center py-2">Qty</th>
              <th className="text-right py-2">Price</th>
              <th className="text-right py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-2">{item.name}</td>
                <td className="text-center py-2">{item.quantity}</td>
                <td className="text-right py-2">{formatPrice(item.price)}</td>
                <td className="text-right py-2">{formatPrice(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-sm">
          <span>Subtotal:</span>
          <span>{formatPrice(order.subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Shipping:</span>
          <span>{formatPrice(order.shipping)}</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-600 space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Phone className="h-4 w-4" />
          <span>+234 913 128 1389</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Mail className="h-4 w-4" />
          <span>xquisite001@outlook.com</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Store className="h-4 w-4" />
          <span>www.xquisitenoctea.com</span>
        </div>
      </div>
    </div>
  )
}
