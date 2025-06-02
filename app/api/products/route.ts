import { type NextRequest, NextResponse } from "next/server"
import { productQueries } from "@/lib/database"

// GET all products
export async function GET() {
  try {
    const products = await productQueries.getAll()

    // Convert MongoDB _id to id for frontend compatibility
    const formattedProducts = products.map((product) => ({
      ...product,
      id: product._id.toString(),
    }))

    return NextResponse.json(formattedProducts)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// CREATE new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, long_description, price, category, notes, stock, size_options, ingredients, image } =
      body

    // Validate required fields
    if (!name || !description || !price || !category) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Create product
    const result = await productQueries.create({
      name,
      description,
      long_description: long_description || "",
      price,
      image: image || "/placeholder.svg?height=500&width=400", // Use provided image or fallback
      category,
      notes: notes || [],
      stock: stock || 0,
      size_options: size_options || [],
      ingredients: ingredients || [],
    })

    return NextResponse.json(
      {
        message: "Product created successfully",
        id: result.insertedId.toString(),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
