import { type NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

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

    // Convert File to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64String = buffer.toString("base64")
    const dataURI = `data:${file.type};base64,${base64String}`

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        dataURI,
        {
          folder: "xquisitenoctea",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Upload route error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      details: error
    })
    return NextResponse.json(
      { error: "Upload failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
