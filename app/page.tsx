"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Sparkles, Star, Heart, ArrowRight } from "lucide-react"

interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        if (response.ok) {
          const products = await response.json()
          // Randomize and take first 3 products
          const randomized = [...products]
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
          setFeaturedProducts(randomized)
        }
      } catch (error) {
        console.error('Error fetching featured products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <div className="absolute inset-0 bg-[url('/second.jpg')] bg-cover bg-center opacity-20" />

        {/* Animated background particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full opacity-30 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-4 sm:mb-6 lg:mb-8">
            <div className="animate-bounce">
              <Sparkles className="h-8 w-8 sm:h-12 sm:w-12 lg:h-16 lg:w-16 text-yellow-400 animate-pulse" />
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white tracking-tight leading-tight animate-fade-in-up">
              <span className="block">Xquisitenoctéa</span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-yellow-400 font-light italic animate-fade-in-up animation-delay-300">
              born of night made for allure
            </p>

            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-xs sm:max-w-md md:max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-600 px-4">
            Discover our exclusive collection of luxury perfumes, handmade skincare, body care and feminine essentials, crafted with intention and love for those  who embrace the mystery of the night,  the power of allure and elevate one self-care ritual.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center pt-4 sm:pt-6 lg:pt-8 animate-fade-in-up animation-delay-900">
              <Link href="/shop">
                <Button className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/25">
                  Explore Collection
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>

              <Link href="/about">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/25"
                >
                  Discover Our Story
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Elements - Hidden on small screens */}
        <div className="hidden md:block absolute top-1/4 left-4 lg:left-10 animate-float">
          <Star className="h-6 w-6 lg:h-8 lg:w-8 text-yellow-400 opacity-60" />
        </div>
        <div className="hidden md:block absolute top-1/3 right-8 lg:right-16 animate-float animation-delay-1000">
          <Heart className="h-4 w-4 lg:h-6 lg:w-6 text-yellow-400 opacity-40" />
        </div>
        <div className="hidden lg:block absolute bottom-1/4 left-1/4 animate-float animation-delay-2000">
          <Sparkles className="h-8 w-8 lg:h-10 lg:w-10 text-yellow-400 opacity-30" />
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">Featured Collection</h2>
            <div className="w-16 sm:w-24 h-1 bg-yellow-400 mx-auto mb-4 sm:mb-6"></div>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-4">
              Curated selection of luxury perfumes, body care, hair treatments, and feminine essentials for all
            </p>
          </div>

          {isLoading ? (
            <div className="text-center text-white">Loading featured products...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {featuredProducts.map((product, index) => (
                <Card
                  key={product.id}
                  className="bg-gray-900 border-gray-800 hover:border-yellow-400 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 overflow-hidden group animate-fade-in-up"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <Image
                      src={product.images && product.images.length > 0 ? product.images[0] : "/placeholder.svg"}
                      alt={product.name}
                      width={250}
                      height={300}
                      className="w-full h-48 sm:h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-yellow-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  <CardContent className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 group-hover:text-yellow-400 transition-colors duration-300">
                      {product.name}
                    </h3>
                    <p className="text-gray-400 mb-4 text-sm">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl sm:text-2xl font-bold text-yellow-400 animate-pulse">
                        ₦{product.price.toLocaleString()}
                      </span>
                      <Link href={`/product/${product.id}`}>
                        <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-8 sm:mt-12 animate-fade-in-up animation-delay-600">
            <Link href="/shop">
              <Button
                variant="outline"
                className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-6 sm:px-8 py-3 text-base sm:text-lg transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/25"
              >
                View All Products
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-900 to-black">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                The Art of
                <span className="text-yellow-400 block">Luxury Self-Care</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Each Xquisitenoctéa product is meticulously crafted to elevate your self-care ritual. From perfumes to body care, 
                hair treatments to feminine essentials, we create products that speak to your soul and enhance your natural beauty.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-black" />
                  </div>
                  <span className="text-white font-medium">Premium Ingredients</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Heart className="h-6 w-6 text-black" />
                  </div>
                  <span className="text-white font-medium">Handcrafted Excellence</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <Image
                  src="/heroimage.jpg?height=500&width=400"
                  alt="Luxury perfume bottle"
                  width={400}
                  height={500}
                  className="w-full max-w-md mx-auto rounded-lg shadow-2xl"
                />
              </div>
              <div className="absolute inset-0 bg-yellow-400 rounded-lg transform rotate-6 opacity-20 blur-sm"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
