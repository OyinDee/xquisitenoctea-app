import { type NextRequest, NextResponse } from "next/server"
import { orderQueries, customerQueries } from "@/lib/database"

// GET all orders
export async function GET() {
  try {
    console.log("Fetching all orders...")
    const orders = await orderQueries.getAll()
    console.log(`Found ${orders.length} orders`)
    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { message: "Failed to fetch orders. Please check database connection." },
      { status: 500 }
    )
  }
}

// CREATE new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Received order data:", body)
    const { customerInfo, items, subtotal, shipping, total, paymentMethod } = body

    // Validate required fields
    if (!customerInfo || !items || !total) {
      console.error("Missing required fields:", { customerInfo, items, total })
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Generate order ID
    const orderId = Date.now().toString()
    console.log("Generated order ID:", orderId)

    // Create order
    const orderData = {
      id: orderId,
      customer_info: customerInfo,
      items: items,
      subtotal,
      shipping,
      total,
      payment_method: paymentMethod,
      status: "pending",
      created_at: new Date(),
      updated_at: new Date(),
    }
    console.log("Creating order with data:", orderData)

    const result = await orderQueries.create(orderData)
    console.log("Order created successfully:", result)

    // Save/update customer info
    try {
      const existingCustomer = await customerQueries.getByEmail(customerInfo.email)
      console.log("Existing customer check:", existingCustomer ? "Found" : "Not found")

      if (existingCustomer) {
        await customerQueries.update(customerInfo.email, {
          first_name: customerInfo.firstName,
          last_name: customerInfo.lastName,
          phone: customerInfo.phone || "",
          address: customerInfo.address || "",
          city: customerInfo.city || "",
          state: customerInfo.state || "",
          email_updates: customerInfo.emailUpdates || false,
        })
        console.log("Customer info updated")
      } else {
        await customerQueries.create({
          first_name: customerInfo.firstName,
          last_name: customerInfo.lastName,
          email: customerInfo.email,
          phone: customerInfo.phone || "",
          address: customerInfo.address || "",
          city: customerInfo.city || "",
          state: customerInfo.state || "",
          email_updates: customerInfo.emailUpdates || false,
        })
        console.log("New customer created")
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
    return NextResponse.json(
      { message: "Failed to create order. Please check database connection." },
      { status: 500 }
    )
  }
}
