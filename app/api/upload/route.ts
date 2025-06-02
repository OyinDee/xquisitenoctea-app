import { type NextRequest, NextResponse } from "next/server"
import { uploadImage } from "@/lib/cloudinary"

export async function POST(request: NextRequest) {
  try {
    console.log("Starting file upload process...")
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      console.error("No file provided in request")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log("File received:", {
      name: file.name,
      type: file.type,
      size: file.size
    })

    // Validate file type
    if (!file.type.startsWith("image/")) {
      console.error("Invalid file type:", file.type)
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      console.error("File too large:", file.size)
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 })
    }

    // Upload to Cloudinary
    try {
      console.log("Attempting to upload to Cloudinary...")
      const imageUrl = await uploadImage(file)
      console.log("Upload successful:", imageUrl)
      return NextResponse.json({ url: imageUrl })
    } catch (uploadError) {
      console.error("Cloudinary upload error:", {
        message: uploadError.message,
        stack: uploadError.stack,
        details: uploadError
      })
      return NextResponse.json(
        { error: "Failed to upload image to Cloudinary", details: uploadError.message },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Upload route error:", {
      message: error.message,
      stack: error.stack,
      details: error
    })
    return NextResponse.json(
      { error: "Upload failed", details: error.message },
      { status: 500 }
    )
  }
}
