import { NextRequest, NextResponse } from "next/server"
import { orderQueries } from "@/lib/database"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const order = await orderQueries.getById(id)
    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }
    return NextResponse.json(order)
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { status } = await request.json()
    const success = await orderQueries.updateStatus(id, status)
    
    if (!success) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const success = await orderQueries.delete(id)
    
    if (!success) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting order:", error)
    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 }
    )
  }
}





