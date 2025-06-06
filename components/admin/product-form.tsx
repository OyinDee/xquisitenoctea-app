"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ImageUpload from "@/components/ui/image-upload"
import { X, Plus } from "lucide-react"

interface SizeOption {
  size: string
  price: number
}

interface ProductFormProps {
  initialData?: {
    name: string
    description: string
    long_description?: string
    price: number
    category: string
    notes: string[]
    stock: number
    images: string[]
    size_options: SizeOption[]
    ingredients?: string[]
  }
  onSubmit: (data: any) => void
  isSubmitting: boolean
}

export default function ProductForm({ initialData, onSubmit, isSubmitting }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    long_description: initialData?.long_description || "",
    price: initialData?.price || 0,
    category: initialData?.category || "",
    notes: Array.isArray(initialData?.notes) ? initialData.notes.join(", ") : "",
    stock: initialData?.stock || 0,
    images: initialData?.images || [""],
    size_options: initialData?.size_options || [
      { size: "30ml", price: initialData?.price || 0 },
      { size: "50ml", price: Math.round((initialData?.price || 0) * 1.4) },
      { size: "100ml", price: Math.round((initialData?.price || 0) * 2) },
    ],
    ingredients: initialData?.ingredients || ["Alcohol Denat", "Parfum", "Aqua"],
  })

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSizeOptionChange = (index: number, field: "size" | "price", value: string | number) => {
    const newSizeOptions = [...formData.size_options]
    newSizeOptions[index] = { ...newSizeOptions[index], [field]: value }
    setFormData((prev) => ({ ...prev, size_options: newSizeOptions }))
  }

  const addSizeOption = () => {
    setFormData((prev) => ({
      ...prev,
      size_options: [...prev.size_options, { size: "", price: 0 }],
    }))
  }

  const removeSizeOption = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      size_options: prev.size_options.filter((_, i) => i !== index),
    }))
  }

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images]
    newImages[index] = value
    setFormData((prev) => ({ ...prev, images: newImages }))
  }

  const addImageField = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ""] }))
  }

  const removeImageField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Filter out empty image URLs
    const filteredImages = formData.images.filter(url => url.trim() !== "")
    
    // If no images are provided, use a placeholder
    const finalImages = filteredImages.length > 0 ? filteredImages : ["/placeholder.svg?height=500&width=400"]
    
    onSubmit({
      ...formData,
      images: finalImages
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Short Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="long_description">Long Description</Label>
            <Textarea
              id="long_description"
              value={formData.long_description}
              onChange={(e) => handleChange("long_description", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="perfumes">Perfumes</SelectItem>
                <SelectItem value="body-care">Body Care</SelectItem>
                <SelectItem value="hair-care">Hair Care</SelectItem>
                <SelectItem value="feminine-essentials">Feminine Essentials</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="price">Base Price</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => handleChange("price", Number(e.target.value))}
              required
            />
          </div>

          <div>
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              type="number"
              value={formData.stock}
              onChange={(e) => handleChange("stock", Number(e.target.value))}
              required
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes (comma-separated)</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="e.g., vanilla, jasmine, musk"
            />
          </div>
        </div>
      </div>

      {/* Size Options */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Size Options</Label>
          <Button type="button" variant="outline" size="sm" onClick={addSizeOption}>
            <Plus className="h-4 w-4 mr-2" />
            Add Size
          </Button>
        </div>
        <div className="space-y-4">
          {formData.size_options.map((option, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="flex-1">
                <Label>Size</Label>
                <Input
                  value={option.size}
                  onChange={(e) => handleSizeOptionChange(index, "size", e.target.value)}
                  placeholder="e.g., 30ml"
                />
              </div>
              <div className="flex-1">
                <Label>Price</Label>
                <Input
                  type="number"
                  value={option.price}
                  onChange={(e) => handleSizeOptionChange(index, "price", Number(e.target.value))}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mt-8"
                onClick={() => removeSizeOption(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Images */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Product Images</Label>
          <Button type="button" variant="outline" size="sm" onClick={addImageField}>
            <Plus className="h-4 w-4 mr-2" />
            Add Image
          </Button>
        </div>
        <div className="space-y-4">
          {formData.images.map((image, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="flex-1">
                <ImageUpload
                  value={image}
                  onChange={(value) => handleImageChange(index, value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Product"}
        </Button>
      </div>
    </form>
  )
} 