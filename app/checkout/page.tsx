"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, CreditCard, Truck, Shield } from "lucide-react"

interface CartItem {
  id: number
  name: string
  price: number
  size: string
  quantity: number
  image: string
}

interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  postalCode: string
  emailUpdates: boolean
  specialInstructions: string
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    emailUpdates: false,
    specialInstructions: "",
  })
  const [paymentMethod, setPaymentMethod] = useState("paystack")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]")
    setCartItems(savedCart)
  }, [])

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getShippingCost = () => {
    return getSubtotal() > 50000 ? 0 : 2500
  }

  const getTotal = () => {
    return getSubtotal() + getShippingCost()
  }

  const handleInputChange = (field: keyof CustomerInfo, value: string | boolean) => {
    setCustomerInfo((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePaystackPayment = () => {
    // Load Paystack script if not already loaded
    if (!window.PaystackPop) {
      const script = document.createElement("script")
      script.src = "https://js.paystack.co/v1/inline.js"
      script.onload = () => initializePaystack()
      document.head.appendChild(script)
    } else {
      initializePaystack()
    }
  }

  const initializePaystack = () => {
    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!, // Now using your actual key
      email: customerInfo.email,
      amount: getTotal() * 100, // Paystack expects amount in kobo
      currency: "NGN",
      ref: `xq_${Date.now()}`, // Generate unique reference
      metadata: {
        custom_fields: [
          {
            display_name: "Customer Name",
            variable_name: "customer_name",
            value: `${customerInfo.firstName} ${customerInfo.lastName}`,
          },
          {
            display_name: "Phone Number",
            variable_name: "phone_number",
            value: customerInfo.phone,
          },
        ],
      },
      callback: (response: any) => {
        // Payment successful
        console.log("Payment successful:", response)
        handleOrderSubmission(response.reference)
      },
      onClose: () => {
        console.log("Payment window closed")
        setIsSubmitting(false) // Reset submitting state if user closes payment window
      },
    })

    handler.openIframe()
  }

  const handleOrderSubmission = async (paymentReference?: string) => {
    setIsSubmitting(true)

    try {
      // Create order object
      const orderData = {
        customerInfo,
        items: cartItems,
        subtotal: getSubtotal(),
        shipping: getShippingCost(),
        total: getTotal(),
        paymentMethod: paymentMethod === "paystack" ? `paystack_${paymentReference}` : paymentMethod,
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        const result = await response.json()

        // Clear cart
        localStorage.removeItem("cart")

        // Redirect to confirmation page
        window.location.href = `/order-confirmation?orderId=${result.orderId}`
      } else {
        const error = await response.json()
        alert(`Error creating order: ${error.message}`)
      }
    } catch (error) {
      console.error("Error submitting order:", error)
      alert("There was an error processing your order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    const requiredFields = ["firstName", "lastName", "email", "phone"]
    const missingFields = requiredFields.filter((field) => !customerInfo[field as keyof CustomerInfo])

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(", ")}`)
      return
    }

    if (paymentMethod === "paystack") {
      handlePaystackPayment()
    } else {
      // Bank transfer - create order directly
      await handleOrderSubmission()
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-white">Your cart is empty</h1>
          <Link href="/shop">
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black">Continue Shopping</Button>
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
            href="/cart"
            className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Link>

          <h1 className="text-4xl font-bold text-white mb-2">Checkout</h1>
          <p className="text-gray-400">Complete your order</p>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Customer Information */}
            <div className="space-y-6">
              {/* Contact Information */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-white">
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        value={customerInfo.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="bg-black border-gray-700 text-white mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-white">
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        value={customerInfo.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="bg-black border-gray-700 text-white mt-1"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-white">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="bg-black border-gray-700 text-white mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-white">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="bg-black border-gray-700 text-white mt-1"
                      placeholder="+234 800 000 0000"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Information */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Truck className="h-5 w-5 mr-2 text-yellow-400" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address" className="text-white">
                      Address
                    </Label>
                    <Input
                      id="address"
                      value={customerInfo.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="bg-black border-gray-700 text-white mt-1"
                      placeholder="Street address"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-white">
                        City
                      </Label>
                      <Input
                        id="city"
                        value={customerInfo.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className="bg-black border-gray-700 text-white mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-white">
                        State
                      </Label>
                      <Select value={customerInfo.state} onValueChange={(value) => handleInputChange("state", value)}>
                        <SelectTrigger className="bg-black border-gray-700 text-white mt-1">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700">
                          <SelectItem value="lagos" className="text-white hover:bg-gray-800">
                            Lagos
                          </SelectItem>
                          <SelectItem value="abuja" className="text-white hover:bg-gray-800">
                            Abuja
                          </SelectItem>
                          <SelectItem value="kano" className="text-white hover:bg-gray-800">
                            Kano
                          </SelectItem>
                          <SelectItem value="port-harcourt" className="text-white hover:bg-gray-800">
                            Port Harcourt
                          </SelectItem>
                          <SelectItem value="ibadan" className="text-white hover:bg-gray-800">
                            Ibadan
                          </SelectItem>
                          <SelectItem value="other" className="text-white hover:bg-gray-800">
                            Other
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="specialInstructions" className="text-white">
                      Special Instructions
                    </Label>
                    <Textarea
                      id="specialInstructions"
                      value={customerInfo.specialInstructions}
                      onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
                      className="bg-black border-gray-700 text-white mt-1"
                      placeholder="Any special delivery instructions..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-yellow-400" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="paystack"
                        name="payment"
                        value="paystack"
                        checked={paymentMethod === "paystack"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-yellow-400"
                      />
                      <Label htmlFor="paystack" className="text-white">
                        Pay with Card/Bank (Paystack) - Recommended
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="bank-transfer"
                        name="payment"
                        value="bank-transfer"
                        checked={paymentMethod === "bank-transfer"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-yellow-400"
                      />
                      <Label htmlFor="bank-transfer" className="text-white">
                        Bank Transfer
                      </Label>
                    </div>
                  </div>

                  {paymentMethod === "paystack" && (
                    <div className="mt-4 p-4 bg-green-900/20 rounded-lg border border-green-700">
                      <p className="text-green-300 text-sm">
                        ✅ Secure payment with Paystack. Pay with your debit card, bank transfer, or USSD.
                      </p>
                    </div>
                  )}

                  {paymentMethod === "bank-transfer" && (
                    <div className="mt-4 p-4 bg-black rounded-lg border border-gray-700">
                      <p className="text-gray-300 text-sm">
                        Bank details will be provided after order confirmation. You will receive an email with payment
                        instructions.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Email Updates */}
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="emailUpdates"
                      checked={customerInfo.emailUpdates}
                      onCheckedChange={(checked) => handleInputChange("emailUpdates", checked as boolean)}
                      className="border-gray-600"
                    />
                    <Label htmlFor="emailUpdates" className="text-white">
                      Keep me updated on new arrivals and special offers
                    </Label>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">You can unsubscribe at any time.</p>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-4 lg:h-fit">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {cartItems.map((item, index) => (
                      <div key={`${item.id}-${item.size}-${index}`} className="flex items-center space-x-3">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={50}
                          height={50}
                          className="rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{item.name}</p>
                          <p className="text-gray-400 text-xs">
                            Size: {item.size} × {item.quantity}
                          </p>
                        </div>
                        <p className="text-white text-sm">₦{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-700 pt-4 space-y-2">
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

                    <div className="flex justify-between text-lg font-semibold border-t border-gray-700 pt-2">
                      <span className="text-white">Total</span>
                      <span className="text-yellow-400">₦{getTotal().toLocaleString()}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 mt-6"
                  >
                    {isSubmitting ? "Processing..." : paymentMethod === "paystack" ? "Pay Now" : "Place Order"}
                  </Button>

                  <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm mt-4">
                    <Shield className="h-4 w-4" />
                    <span>Secure checkout</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

// Extend Window interface for Paystack
declare global {
  interface Window {
    PaystackPop: any
  }
}
