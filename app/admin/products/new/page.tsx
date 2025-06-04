"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ImageUpload } from "@/components/ui/image-upload"
import { ArrowLeft, Save } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Product categories for the dropdown
const productCategories = [
  "Dresses",
  "Tops",
  "Bottoms",
  "Outerwear",
  "Accessories",
  "Footwear",
  "Jewelry",
  "Bags",
  "Traditional",
  "Other"
]

export default function NewProductPage() {
  const router = useRouter()
  
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    images: [] as string[]
  })
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProduct({ ...product, [name]: value })
  }
  
  const handleSelectChange = (name: string, value: string) => {
    setProduct({ ...product, [name]: value })
  }
  
  const handleImageChange = (imageUrl: string) => {
    if (!product.images.includes(imageUrl)) {
      setProduct({ ...product, images: [...product.images, imageUrl] })
    }
  }
  
  const handleImageRemove = (imageUrl: string) => {
    setProduct({
      ...product,
      images: product.images.filter(img => img !== imageUrl)
    })
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveError(null)
    
    try {
      // Validate form
      if (!product.name || !product.price || !product.category) {
        throw new Error("Please fill in all required fields")
      }
      
      // In a real app, this would be a POST request to your API
      // For now, we'll simulate it with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect back to products page on success
      router.push("/admin/products")
    } catch (error) {
      console.error("Error saving product:", error)
      setSaveError(error instanceof Error ? error.message : "Failed to save product")
    } finally {
      setIsSaving(false)
    }
  }
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
        <h1 className="text-2xl font-bold ml-4">
          Add New Product
        </h1>
      </div>
      
      {saveError && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{saveError}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Product Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={product.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={product.description}
                    onChange={handleInputChange}
                    placeholder="Enter product description"
                    rows={5}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price">
                      Price (₦) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={product.price}
                      onChange={handleInputChange}
                      placeholder="Enter price"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="stock">
                      Stock Quantity <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      value={product.stock}
                      onChange={handleInputChange}
                      placeholder="Enter stock quantity"
                      min="0"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={product.category}
                    onValueChange={(value) => handleSelectChange("category", value)}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {productCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  value={product.images}
                  onChange={handleImageChange}
                  onRemove={handleImageRemove}
                  multiple
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Recommended size: 800x800px. Max file size: 5MB.
                </p>
              </CardContent>
            </Card>
            
            <div className="mt-6 space-y-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSaving}
              >
                {isSaving ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Product
                  </>
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => router.push("/admin/products")}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
