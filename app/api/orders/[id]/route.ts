import { type NextRequest, NextResponse } from "next/server"
import { orderQueries } from "@/lib/database"

// GET single order
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const order = orderQueries.getById(params.id)

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// UPDATE order status
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json({ message: "Status is required" }, { status: 400 })
    }

    // Check if order exists
    const existingOrder = orderQueries.getById(params.id)
    if (!existingOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    // Update order status
    orderQueries.updateStatus(params.id, status)

    return NextResponse.json({ message: "Order status updated successfully" })
  } catch (error) {
    console.error("Error updating order status:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
