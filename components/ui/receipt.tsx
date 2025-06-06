"use client"

import { Phone, Mail, Store, MapPin, Instagram } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import Image from "next/image"

interface ReceiptProps {
  order: {
    id: string
    items: Array<{
      id: string | number
      name: string
      price: number
      quantity: number
      size?: string
    }>
    subtotal: number
    shipping: number
    total: number
    customer: {
      name: string
      email: string
      address: string
      phone?: string
    }
    createdAt: string | Date
    paymentMethod: string
    status: string
  }
}

export default function Receipt({ order }: ReceiptProps) {
  return (
    <div className="w-full max-w-[400px] mx-auto bg-white text-black p-8 print:p-4 print:max-w-full print:mx-0 print:shadow-none">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="relative w-32 h-32 mx-auto mb-4">
          <Image
            src="/logo.png"
            alt="Xquisitenoctéa"
            fill
            className="object-contain"
          />
        </div>
        <h2 className="text-2xl font-bold mb-2">Xquisitenoctéa</h2>
        <p className="text-sm text-gray-600">Luxury Self-Care Products</p>
      </div>

      <div className="border-t border-b border-gray-200 py-4 mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Order #:</span>
          <span className="font-medium">{order.id}</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Date:</span>
          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Status:</span>
          <span className="font-medium capitalize">{order.status}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Payment Method:</span>
          <span className="font-medium capitalize">{order.paymentMethod}</span>
        </div>
      </div>

      {/* Customer Info */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-2">Customer Information</h3>
        <div className="text-sm space-y-1">
          <p>{order.customer.name}</p>
          <p>{order.customer.email}</p>
          {order.customer.phone && <p>{order.customer.phone}</p>}
          <p className="text-gray-600">{order.customer.address}</p>
        </div>
      </div>

      {/* Items */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-3">Order Items</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2">Item</th>
              <th className="text-center py-2">Qty</th>
              <th className="text-right py-2">Price</th>
              <th className="text-right py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="py-2">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    {item.size && (
                      <p className="text-xs text-gray-500">Size: {item.size}</p>
                    )}
                  </div>
                </td>
                <td className="text-center py-2">{item.quantity}</td>
                <td className="text-right py-2">{formatPrice(item.price)}</td>
                <td className="text-right py-2">{formatPrice(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="border-t border-gray-200 pt-4 mb-8">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Subtotal:</span>
          <span>{formatPrice(order.subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Shipping:</span>
          <span>{formatPrice(order.shipping)}</span>
        </div>
        <div className="flex justify-between font-bold text-base mt-4 pt-4 border-t border-gray-200">
          <span>Total:</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-600 space-y-3">
        <p className="font-medium">Thank you for your purchase!</p>
        <div className="flex items-center justify-center gap-2">
          <Phone className="h-4 w-4" />
          <span>+234 913 128 1389</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Mail className="h-4 w-4" />
          <span>xquisite001@outlook.com</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>Agege, Lagos, Nigeria</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Instagram className="h-4 w-4" />
          <a 
            href="https://www.instagram.com/xquisitenoctea?igsh=OHlqOGo1d3dqZjBt" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-yellow-400 transition-colors"
          >
            @xquisitenoctea
          </a>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Store className="h-4 w-4" />
          <span>www.xquisitenoctea.com</span>
        </div>
        <p className="text-xs mt-4">
          This receipt serves as proof of purchase. Please keep it for your records.
        </p>
      </div>
    </div>
  )
}
