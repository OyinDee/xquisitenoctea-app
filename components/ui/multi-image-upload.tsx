"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { Upload, X, Loader2 } from "lucide-react"

interface MultiImageUploadProps {
  value: string[]
  onChange: (url: string) => void
  onRemove: (url: string) => void
  disabled?: boolean
  multiple?: boolean
}

export default function MultiImageUpload({ 
  value, 
  onChange, 
  onRemove, 
  disabled,
  multiple = false 
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files?.length) return

    // Reset error state
    setUploadError(null)

    setIsUploading(true)

    try {
      for (const file of Array.from(files)) {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          setUploadError("Please select an image file")
          continue
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setUploadError("Image size should be less than 5MB")
          continue
        }

        const formData = new FormData()
        formData.append("file", file)

        // Add timeout to prevent hanging
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.details || "Upload failed")
        }

        const data = await response.json()
        onChange(data.url)

        // If not multiple, break after first upload
        if (!multiple) break
      }
    } catch (error: unknown) {
      console.error("Upload error:", error)
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          setUploadError("Upload timed out. Please try again.")
        } else {
          setUploadError(error.message || "Failed to upload image. Please try again.")
        }
      } else {
        setUploadError("Failed to upload image. Please try again.")
      }
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <div className="space-y-4">
      <Label>Product Images</Label>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {value.map((url) => (
          <div key={url} className="relative aspect-square">
            <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={url}
                alt="Product image"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
            </div>
            <Button
              type="button"
              onClick={() => onRemove(url)}
              disabled={disabled || isUploading}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 h-auto"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}

        <div className="relative aspect-square">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center h-full flex flex-col items-center justify-center">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-2">Click to upload</p>
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isUploading}
              variant="outline"
              size="sm"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Image
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={disabled || isUploading}
        className="hidden"
        multiple={multiple}
      />

      {uploadError && (
        <p className="text-sm text-red-500 mt-2">{uploadError}</p>
      )}

      <p className="text-xs text-gray-500">
        Supported formats: JPG, PNG, WebP. Max size: 5MB. Recommended: 800x800px
      </p>
    </div>
  )
} 