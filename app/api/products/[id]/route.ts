import { type NextRequest, NextResponse } from "next/server"
import { productQueries } from "@/lib/database"

// GET single product
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await productQueries.getById(params.id)

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    // Convert MongoDB _id to id for frontend compatibility
    const formattedProduct = {
      ...product,
      id: product._id.toString(),
    }

    return NextResponse.json(formattedProduct)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// UPDATE product
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { 
      name, 
      description, 
      long_description, 
      price, 
      category, 
      notes, 
      stock, 
      size_options, 
      ingredients, 
      images 
    } = body

    // Validate required fields
    if (!name || !description || !price || !category) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Update product
    const success = await productQueries.update(params.id, {
      name,
      description,
      long_description: long_description || "",
      price,
      images: images || [], // Use the images array from the request
      category,
      notes: notes || [],
      stock: stock || 0,
      size_options: size_options || [],
      ingredients: ingredients || [],
    })

    if (success) {
      return NextResponse.json({ message: "Product updated successfully" })
    } else {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// DELETE product
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const success = await productQueries.delete(params.id)

    if (success) {
      return NextResponse.json({ message: "Product deleted successfully" })
    } else {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
