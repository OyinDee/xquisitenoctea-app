import { type NextRequest, NextResponse } from "next/server"
import { orderQueries, customerQueries } from "@/lib/database"

// GET all orders
export async function GET() {
  try {
    const orders = orderQueries.getAll()
    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// CREATE new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerInfo, items, subtotal, shipping, total, paymentMethod } = body

    // Validate required fields
    if (!customerInfo || !items || !total) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Generate order ID
    const orderId = Date.now().toString()

    // Create order
    orderQueries.create({
      id: orderId,
      customer_info: customerInfo,
      items: items,
      subtotal,
      shipping,
      total,
      payment_method: paymentMethod,
      status: "pending",
    })

    // Save/update customer info
    try {
      const existingCustomer = customerQueries.getByEmail(customerInfo.email)

      if (existingCustomer) {
        customerQueries.update(customerInfo.email, {
          first_name: customerInfo.firstName,
          last_name: customerInfo.lastName,
          phone: customerInfo.phone || "",
          address: customerInfo.address || "",
          city: customerInfo.city || "",
          state: customerInfo.state || "",
          email_updates: customerInfo.emailUpdates || false,
        })
      } else {
        customerQueries.create({
          first_name: customerInfo.firstName,
          last_name: customerInfo.lastName,
          email: customerInfo.email,
          phone: customerInfo.phone || "",
          address: customerInfo.address || "",
          city: customerInfo.city || "",
          state: customerInfo.state || "",
          email_updates: customerInfo.emailUpdates || false,
        })
      }
    } catch (customerError) {
      console.error("Error saving customer:", customerError)
      // Don't fail the order if customer save fails
    }

    return NextResponse.json(
      {
        message: "Order created successfully",
        orderId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
