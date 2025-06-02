"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react"

interface CartItem {
  id: number
  name: string
  price: number
  size: string
  quantity: number
  image: string
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]")
    setCartItems(savedCart)
  }, [])

  const updateCartInStorage = (newCart: CartItem[]) => {
    setCartItems(newCart)
    localStorage.setItem("cart", JSON.stringify(newCart))
  }

  const updateQuantity = (id: number, size: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id, size)
      return
    }

    const updatedCart = cartItems.map((item) =>
      item.id === id && item.size === size ? { ...item, quantity: newQuantity } : item,
    )
    updateCartInStorage(updatedCart)
  }

  const removeItem = (id: number, size: string) => {
    const updatedCart = cartItems.filter((item) => !(item.id === id && item.size === size))
    updateCartInStorage(updatedCart)
  }

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotal = () => {
    const subtotal = getSubtotal()
    const shipping = subtotal > 50000 ? 0 : 2500 // Free shipping over ₦50,000
    return subtotal + shipping
  }

  const getShippingCost = () => {
    return getSubtotal() > 50000 ? 0 : 2500
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="text-center space-y-6">
          <ShoppingBag className="h-24 w-24 text-gray-600 mx-auto" />
          <h1 className="text-3xl font-bold text-white">Your cart is empty</h1>
          <p className="text-gray-400 text-lg">Discover our exquisite collection of perfumes</p>
          <Link href="/shop">
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/shop"
            className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>

          <h1 className="text-4xl font-bold text-white mb-2">Shopping Cart</h1>
          <p className="text-gray-400">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <Card key={`${item.id}-${item.size}-${index}`} className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white mb-1">{item.name}</h3>
                      <p className="text-gray-400 text-sm mb-2">Size: {item.size}</p>
                      <p className="text-yellow-400 font-semibold">₦{item.price.toLocaleString()}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                        className="border-gray-700 text-white hover:bg-gray-800 h-8 w-8 p-0"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>

                      <span className="text-white font-semibold min-w-[2rem] text-center">{item.quantity}</span>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        className="border-gray-700 text-white hover:bg-gray-800 h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <p className="text-lg font-semibold text-white">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(item.id, item.size)}
                      className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-900 border-gray-800 sticky top-4">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white">₦{getSubtotal().toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">Shipping</span>
                    <span className="text-white">
                      {getShippingCost() === 0 ? "Free" : `₦${getShippingCost().toLocaleString()}`}
                    </span>
                  </div>

                  {getShippingCost() === 0 && (
                    <p className="text-green-400 text-sm">🎉 You qualify for free shipping!</p>
                  )}

                  <div className="border-t border-gray-700 pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-white">Total</span>
                      <span className="text-yellow-400">₦{getTotal().toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Link href="/checkout" className="block w-full mt-6">
                  <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3">
                    Proceed to Checkout
                  </Button>
                </Link>

                <div className="mt-4 text-center">
                  <Link href="/shop" className="text-yellow-400 hover:text-yellow-300 text-sm">
                    Continue Shopping
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
