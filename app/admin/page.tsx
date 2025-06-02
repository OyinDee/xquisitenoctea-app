"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { Plus, Edit, Trash2, Package, Users, TrendingUp, Eye, LogOut, Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import ImageUpload from "@/components/ui/image-upload"
import ProductForm from "@/components/admin/product-form"

interface Product {
  id: number
  name: string
  description: string
  long_description?: string
  price: number
  images: string[]
  category: string
  notes: string[]
  stock: number
  size_options: Array<{ size: string; price: number }>
  ingredients?: string[]
}

interface Order {
  id: string
  customer_info: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address?: string
    city?: string
    state?: string
  }
  items: Array<{
    id: number
    name: string
    price: number
    quantity: number
    size: string
  }>
  subtotal: number
  shipping: number
  total: number
  payment_method: string
  status: string
  created_at: string
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchProducts()
    fetchOrders()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders")
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    }
  }

  const handleAddProduct = async (formData: any) => {
    setIsSubmitting(true)

    try {
      const productData = {
        ...formData,
        notes: formData.notes
          .split(",")
          .map((note: string) => note.trim())
          .filter(Boolean),
      }

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        setIsAddingProduct(false)
        fetchProducts()
        alert("Product added successfully!")
      } else {
        const error = await response.json()
        alert(`Error adding product: ${error.message}`)
      }
    } catch (error) {
      console.error("Error adding product:", error)
      alert("Error adding product. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditProduct = async (formData: any) => {
    if (!editingProduct) return

    setIsSubmitting(true)

    try {
      const productData = {
        ...formData,
        notes: typeof formData.notes === 'string' 
          ? formData.notes.split(",").map((note: string) => note.trim()).filter(Boolean)
          : formData.notes,
        images: formData.images || [],
      }

      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        setEditingProduct(null)
        fetchProducts()
        alert("Product updated successfully!")
      } else {
        const error = await response.json()
        alert(`Error updating product: ${error.message}`)
      }
    } catch (error) {
      console.error("Error updating product:", error)
      alert("Error updating product. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchProducts()
        alert("Product deleted successfully!")
      } else {
        const error = await response.json()
        alert(`Error deleting product: ${error.message}`)
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Error deleting product. Please try again.")
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchOrders()
      } else {
        const error = await response.json()
        alert(`Error updating order status: ${error.message}`)
      }
    } catch (error) {
      console.error("Error updating order status:", error)
      alert("Error updating order status. Please try again.")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "confirmed":
        return "bg-blue-500"
      case "shipped":
        return "bg-green-500"
      case "delivered":
        return "bg-green-600"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      // Redirect to login page
      router.push("/admin/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const getTotalRevenue = () => {
    if (!Array.isArray(orders)) return 0
    return orders.reduce((sum, order) => sum + (order.total || 0), 0)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex items-center space-x-2 text-white">
          <Loader className="h-6 w-6 animate-spin" />
          <span>Loading admin dashboard...</span>
        </div>
      </div>
    )
  }

  if (isAddingProduct) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Add New Product</h1>
          <Button variant="outline" onClick={() => setIsAddingProduct(false)}>
            Cancel
          </Button>
        </div>
        <ProductForm onSubmit={handleAddProduct} isSubmitting={isSubmitting} />
      </div>
    )
  }

  if (editingProduct) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Edit Product</h1>
          <Button variant="outline" onClick={() => setEditingProduct(null)}>
            Cancel
          </Button>
        </div>
        <ProductForm
          initialData={editingProduct}
          onSubmit={handleEditProduct}
          isSubmitting={isSubmitting}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Manage your Xquisitenoctéa store</p>
          </div>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Products</p>
                  <p className="text-2xl font-bold text-white">{products.length}</p>
                </div>
                <Package className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Orders</p>
                  <p className="text-2xl font-bold text-white">{orders.length}</p>
                </div>
                <Users className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold text-white">₦{getTotalRevenue().toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="bg-gray-900 border-gray-800">
            <TabsTrigger value="products" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
              Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
              Orders
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Product Management</h2>
              <Button onClick={() => setIsAddingProduct(true)} className="bg-yellow-400 hover:bg-yellow-500 text-black">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>

            {/* Products List */}
            {products.length === 0 ? (
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-8 text-center">
                  <Package className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-white text-lg font-semibold mb-2">No products yet</h3>
                  <p className="text-gray-400 mb-4">Add your first product to get started</p>
                  <Button
                    onClick={() => setIsAddingProduct(true)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="bg-gray-900 border-gray-800">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <Image
                          src={product.images && product.images.length > 0 ? product.images[0] : "/placeholder.svg"}
                          alt={product.name}
                          width={80}
                          height={80}
                          className="rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold truncate">{product.name}</h3>
                          <p className="text-gray-400 text-sm mb-2 line-clamp-2">{product.description}</p>
                          <p className="text-yellow-400 font-bold">₦{product.price.toLocaleString()}</p>
                          <p className="text-gray-400 text-xs">Stock: {product.stock}</p>
                          <Badge className="mt-1 bg-gray-700 text-gray-300">{product.category}</Badge>

                          <div className="flex space-x-2 mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingProduct(product)}
                              className="border-gray-700 text-white hover:bg-gray-800"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteProduct(product.id)}
                              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Order Management</h2>

            {!Array.isArray(orders) || orders.length === 0 ? (
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-white text-lg font-semibold mb-2">No orders yet</h3>
                  <p className="text-gray-400">Orders will appear here when customers make purchases</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="bg-gray-900 border-gray-800">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            <h3 className="text-white font-semibold">Order #{order.id}</h3>
                            <Badge className={`${getStatusColor(order.status)} text-white`}>
                              {order.status.toUpperCase()}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">Customer:</span>
                              <p className="text-white">
                                {order.customer_info.firstName} {order.customer_info.lastName}
                              </p>
                              <p className="text-gray-400">{order.customer_info.email}</p>
                              <p className="text-gray-400">{order.customer_info.phone}</p>
                            </div>

                            <div>
                              <span className="text-gray-400">Items:</span>
                              {order.items.map((item, idx) => (
                                <p key={idx} className="text-white">
                                  {item.name} ({item.size}) × {item.quantity}
                                </p>
                              ))}
                            </div>

                            <div>
                              <span className="text-gray-400">Total:</span>
                              <p className="text-yellow-400 font-bold text-lg">₦{order.total.toLocaleString()}</p>
                              <p className="text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Select value={order.status} onValueChange={(value) => updateOrderStatus(order.id, value)}>
                            <SelectTrigger className="w-32 bg-black border-gray-700 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 border-gray-700">
                              <SelectItem value="pending" className="text-white">
                                Pending
                              </SelectItem>
                              <SelectItem value="confirmed" className="text-white">
                                Confirmed
                              </SelectItem>
                              <SelectItem value="shipped" className="text-white">
                                Shipped
                              </SelectItem>
                              <SelectItem value="delivered" className="text-white">
                                Delivered
                              </SelectItem>
                              <SelectItem value="cancelled" className="text-white">
                                Cancelled
                              </SelectItem>
                            </SelectContent>
                          </Select>

                          <Button size="sm" variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
