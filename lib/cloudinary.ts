import { v2 as cloudinary } from "cloudinary"
import sharp from "sharp"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary

// Helper function to upload image
export async function uploadImage(file: File): Promise<string> {
  try {
    console.log("Starting Cloudinary upload process...")
    
    // Validate environment variables
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error("Missing Cloudinary configuration:", {
        cloud_name: !!process.env.CLOUDINARY_CLOUD_NAME,
        api_key: !!process.env.CLOUDINARY_API_KEY,
        api_secret: !!process.env.CLOUDINARY_API_SECRET
      })
      throw new Error("Cloudinary configuration is incomplete")
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Compress image before upload
    console.log("Compressing image...")
    const compressedBuffer = await sharp(buffer)
      .resize(800, 800, { // Resize to max dimensions
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
      .toBuffer()

    console.log("Image compressed, new size:", compressedBuffer.length)

    // Convert to base64 for direct upload
    const base64Image = compressedBuffer.toString('base64')
    const dataURI = `data:image/jpeg;base64,${base64Image}`

    // Upload with increased timeout
    const result = await Promise.race([
      cloudinary.uploader.upload(dataURI, {
        folder: "xquisitenoctea/products",
        resource_type: "image",
        transformation: [
          { width: 500, height: 600, crop: "fill", quality: "auto" },
          { fetch_format: "auto" }
        ],
        timeout: 60000, // 60 second timeout
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Upload timed out')), 60000)
      )
    ])

    console.log("Cloudinary upload successful:", result.secure_url)
    return result.secure_url
  } catch (error) {
    console.error('Cloudinary upload error:', {
      message: error.message,
      stack: error.stack,
      details: error
    })
    throw new Error(error.message || 'Failed to upload image')
  }
}

// Helper function to delete image
export async function deleteImage(imageUrl: string): Promise<boolean> {
  try {
    // Extract public_id from Cloudinary URL
    const publicId = imageUrl.split("/").slice(-2).join("/").split(".")[0]
    const result = await cloudinary.uploader.destroy(`xquisitenoctea/products/${publicId}`)
    return result.result === "ok"
  } catch (error) {
    console.error("Error deleting image:", error)
    return false
  }
}
