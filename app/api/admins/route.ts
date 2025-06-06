import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/database"
import bcrypt from "bcryptjs"

// GET all admins
export async function GET() {
  try {
    const { db } = await connectToDatabase()
    if (!db) throw new Error("Database connection failed")

    const admins = await db.collection("admins").find({}).toArray()
    return NextResponse.json(admins)
  } catch (error) {
    console.error("Error fetching admins:", error)
    return NextResponse.json(
      { error: "Failed to fetch admins" },
      { status: 500 }
    )
  }
}

// CREATE new admin
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    if (!db) throw new Error("Database connection failed")

    const { email, name, password } = await request.json()

    // Validate required fields
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if admin already exists
    const existingAdmin = await db.collection("admins").findOne({ email })
    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create admin
    const result = await db.collection("admins").insertOne({
      email,
      name,
      password: hashedPassword,
      role: "admin",
      created_at: new Date(),
      updated_at: new Date(),
    })

    // Return admin without password
    const admin = await db.collection("admins").findOne(
      { _id: result.insertedId },
      { projection: { password: 0 } }
    )

    return NextResponse.json(admin, { status: 201 })
  } catch (error) {
    console.error("Error creating admin:", error)
    return NextResponse.json(
      { error: "Failed to create admin" },
      { status: 500 }
    )
  }
} 