"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import Image from "next/image"
import { Search, Filter, Heart, Loader2 } from "lucide-react"
import { useFavorites } from "@/lib/context/favorites"

interface Product {
  id: number
  name: string
  description: string
  price: number
  images: string[]
  category: string
  notes: string[]
  stock: number
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [filterBy, setFilterBy] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()

  // Fetch products from API
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
        setFilteredProducts(data)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.notes.some((note) => note.toLowerCase().includes(searchTerm.toLowerCase())),
    )

    if (filterBy !== "all") {
      filtered = filtered.filter((product) => product.category === filterBy)
    }

    // Sort products
    filtered.sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price
      if (sortBy === "price-high") return b.price - a.price
      return a.name.localeCompare(b.name)
    })

    setFilteredProducts(filtered)
  }, [searchTerm, sortBy, filterBy, products])

  const handleFavoriteClick = (productId: number) => {
    if (isFavorite(productId)) {
      removeFromFavorites(productId)
    } else {
      addToFavorites(productId)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex items-center space-x-2 text-white">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading products...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Collection</h1>
          <div className="w-24 h-1 bg-yellow-400 mx-auto mb-6"></div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover fragrances that embody the perfect balance of mystery and allure
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8 p-6 bg-gray-900 rounded-lg border border-gray-800">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search perfumes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black border-gray-700 text-white placeholder-gray-400"
            />
          </div>

          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="perfumes">Perfumes</SelectItem>
              <SelectItem value="body-care">Body Care</SelectItem>
              <SelectItem value="hair-care">Hair Care</SelectItem>
              <SelectItem value="feminine-essentials">Feminine Essentials</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full lg:w-48 bg-black border-gray-700 text-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="name" className="text-white hover:bg-gray-800">
                Name
              </SelectItem>
              <SelectItem value="price-low" className="text-white hover:bg-gray-800">
                Price: Low to High
              </SelectItem>
              <SelectItem value="price-high" className="text-white hover:bg-gray-800">
                Price: High to Low
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-xl mb-4">
              {products.length === 0 ? "No products available yet." : "No products found matching your criteria."}
            </div>
            {products.length === 0 && (
              <p className="text-gray-500">Products will appear here once they are added by the admin.</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="bg-gray-900 border-gray-800 hover:border-yellow-400 transition-all duration-300 transform hover:scale-105 overflow-hidden group"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={product.images && product.images.length > 0 ? product.images[0] : "/placeholder.svg"}
                    alt={product.name}
                    width={250}
                    height={300}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      size="sm"
                      variant="outline"
                      className={`border-yellow-400 ${
                        isFavorite(product.id) ? "bg-yellow-400 text-black" : "text-yellow-400"
                      } hover:bg-yellow-400 hover:text-black`}
                      onClick={() => handleFavoriteClick(product.id)}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <CardContent className="p-6">
                  <div className="mb-2">
                    <span className="text-xs text-yellow-400 uppercase tracking-wide font-semibold">
                      {product.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-2">{product.name}</h3>

                  <p className="text-gray-400 mb-3 text-sm line-clamp-2">{product.description}</p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {product.notes.slice(0, 3).map((note, index) => (
                      <span key={index} className="text-xs bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded">
                        {note}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-yellow-400">₦{product.price.toLocaleString()}</span>
                    <div className="flex space-x-2">
                      <Link href={`/product/${product.id}`}>
                        <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
