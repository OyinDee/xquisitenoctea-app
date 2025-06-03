import { NextRequest, NextResponse } from "next/server"
import { productQueries } from "@/lib/database"

// GET single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await productQueries.getById(id)
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }
    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    )
  }
}

// UPDATE product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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
    const success = await productQueries.update(id, {
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
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const success = await productQueries.delete(id)
    
    if (!success) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    )
  }
}
