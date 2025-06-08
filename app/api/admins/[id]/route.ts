import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/database"
import { ObjectId } from "mongodb"

// DELETE admin
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { db } = await connectToDatabase()
    if (!db) throw new Error("Database connection failed")

    const { id } = await params

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid admin ID" },
        { status: 400 }
      )
    }

    // Delete admin
    const result = await db.collection("admins").deleteOne({
      _id: new ObjectId(id)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Admin not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: "Admin deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error deleting admin:", error)
    return NextResponse.json(
      { error: "Failed to delete admin" },
      { status: 500 }
    )
  }
} 