"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ShoppingCart, Heart, Star, Share2 } from "lucide-react"
import { useParams } from "next/navigation"

interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  notes: string[]
  long_description: string
  size_options: Array<{ size: string; price: number }>
  ingredients: string[]
}

export default function ProductDetailPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!params || !params.id) {
          console.error("Invalid params:", params)
          setIsLoading(false)
          return
        }

        const response = await fetch(`/api/products/${params?.id}`)
        if (response.ok) {
          const data = await response.json()
          setProduct(data)
          if (data.size_options && data.size_options.length > 0) {
            setSelectedSize(data.size_options[0].size)
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [params?.id])

  const addToCart = () => {
    if (!product) return

    const cartItem = {
      id: product.id,
      name: product.name,
      price: getCurrentPrice(),
      size: selectedSize,
      quantity,
      image: product.images[0],
    }

    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]")

    // Check if item already exists
    const existingItemIndex = existingCart.findIndex(
      (item: any) => item.id === cartItem.id && item.size === cartItem.size,
    )

    if (existingItemIndex > -1) {
      existingCart[existingItemIndex].quantity += quantity
    } else {
      existingCart.push(cartItem)
    }

    localStorage.setItem("cart", JSON.stringify(existingCart))

    // Show success message (you could use a toast library here)
    alert("Added to cart successfully!")
  }

  const getCurrentPrice = () => {
    if (!product) return 0
    const sizeOption = product.size_options.find((option) => option.size === selectedSize)
    return sizeOption ? sizeOption.price : product.price
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Product not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/shop"
            className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-lg bg-gray-900">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                width={500}
                height={600}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Thumbnail images */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-gray-900 rounded border-2 cursor-pointer transition-colors ${
                    selectedImage === index ? "border-yellow-400" : "border-transparent hover:border-yellow-400"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} view ${index + 1}`}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge className="bg-yellow-400 text-black mb-4">{product.category.toUpperCase()}</Badge>

              <h1 className="text-4xl font-bold text-white mb-4">{product.name}</h1>

              <p className="text-xl text-white/90 mb-6">{product.description}</p>

              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-white/80">(24 reviews)</span>
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Size</h3>
              <div className="grid grid-cols-3 gap-3">
                {product.size_options.map((option) => (
                  <button
                    key={option.size}
                    onClick={() => setSelectedSize(option.size)}
                    className={`p-3 border rounded-lg transition-colors ${
                      selectedSize === option.size
                        ? "border-yellow-400 bg-yellow-400/10 text-yellow-400"
                        : "border-white/20 text-white/90 hover:border-white/40"
                    }`}
                  >
                    <div className="font-semibold">{option.size}</div>
                    <div className="text-sm">₦{option.price.toLocaleString()}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Quantity</h3>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  -
                </Button>
                <span className="text-white text-lg font-semibold px-4">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  +
                </Button>
              </div>
            </div>

            {/* Price */}
            <div className="border-t border-white/10 pt-6">
              <div className="text-3xl font-bold text-yellow-400 mb-6">₦{getCurrentPrice().toLocaleString()}</div>

              <div className="flex space-x-4">
                <Button
                  onClick={addToCart}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>

                <Button
                  variant="outline"
                  className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                >
                  <Heart className="h-5 w-5" />
                </Button>

                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information Tabs */}
        <div className="mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Description */}
            <Card className="bg-black/50 border-white/10">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Description</h3>
                <p className="text-white/90 leading-relaxed">{product.long_description}</p>
              </CardContent>
            </Card>

            {/* Key Features */}
            <Card className="bg-black/50 border-white/10">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Key Features</h3>
                <div className="space-y-3">
                  {product.notes.map((note, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span className="text-white/90">{note}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ingredients */}
          <Card className="bg-black/50 border-white/10 mt-8">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Ingredients</h3>
              <p className="text-white/90">{product.ingredients.join(", ")}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
