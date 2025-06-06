import { MongoClient, type Db } from "mongodb"
import bcrypt from "bcryptjs"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017"
const DB_NAME = process.env.DB_NAME || "xquisitenoctea"

let client: MongoClient | null = null
let db: Db | null = null

// Connect to MongoDB
async function connectToDatabase() {
  if (!client || !db) {
    console.log("Connecting to MongoDB...")
    try {
      if (!MONGODB_URI) {
        throw new Error("MONGODB_URI is not defined in environment variables")
      }

      client = new MongoClient(MONGODB_URI)
      await client.connect()
      db = client.db(DB_NAME)
      console.log("Connected to MongoDB successfully")
      
      // Verify connection
      await db.command({ ping: 1 })
      console.log("Database connection verified")
    } catch (error: any) {
      console.error("MongoDB connection error:", error)
      throw new Error(`Failed to connect to MongoDB: ${error.message}`)
    }
  }
  return { client, db }
}

// Initialize database
export async function initializeDatabase() {
  try {
    console.log("Starting database initialization...")
    const { db } = await connectToDatabase()
    if (!db) throw new Error("Database connection failed")
    console.log("Database connection verified")
  } catch (error) {
    console.error("Error initializing database:", error)
  }
}

// Product operations
export const productQueries = {
  async getAll() {
    const { db } = await connectToDatabase()
    return await db.collection("products").find({}).sort({ created_at: -1 }).toArray()
  },

  async getById(id: string) {
    const { db } = await connectToDatabase()
    const { ObjectId } = require("mongodb")
    return await db.collection("products").findOne({ _id: new ObjectId(id) })
  },

  async getByCategory(category: string) {
    const { db } = await connectToDatabase()
    return await db.collection("products").find({ category }).sort({ created_at: -1 }).toArray()
  },

  async create(productData: any) {
    const { db } = await connectToDatabase()
    const result = await db.collection("products").insertOne({
      ...productData,
      created_at: new Date(),
      updated_at: new Date(),
    })
    return { insertedId: result.insertedId }
  },

  async update(id: string, productData: any) {
    const { db } = await connectToDatabase()
    const { ObjectId } = require("mongodb")
    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...productData,
          updated_at: new Date(),
        },
      },
    )
    return result.modifiedCount > 0
  },

  async delete(id: string) {
    const { db } = await connectToDatabase()
    const { ObjectId } = require("mongodb")
    const result = await db.collection("products").deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  },
}

// Order operations
export const orderQueries = {
  async getAll() {
    try {
      const { db } = await connectToDatabase()
      if (!db) throw new Error("Database connection failed")
      
      console.log("Fetching all orders from database...")
      const orders = await db.collection("orders").find({}).sort({ created_at: -1 }).toArray()
      console.log(`Found ${orders.length} orders`)
      return orders
    } catch (error) {
      console.error("Error in getAll orders:", error)
      throw error
    }
  },

  async getById(id: string) {
    try {
      const { db } = await connectToDatabase()
      if (!db) throw new Error("Database connection failed")
      
      console.log(`Fetching order with ID: ${id}`)
      const { ObjectId } = require("mongodb")
      const order = await db.collection("orders").findOne({ _id: new ObjectId(id) })
      console.log("Order found:", order ? "Yes" : "No")
      return order
    } catch (error) {
      console.error("Error in getById order:", error)
      throw error
    }
  },

  async create(orderData: any) {
    try {
      const { db } = await connectToDatabase()
      if (!db) throw new Error("Database connection failed")
      
      console.log("Creating new order:", orderData)
      const result = await db.collection("orders").insertOne({
        ...orderData,
        created_at: new Date(),
        updated_at: new Date(),
      })
      console.log("Order created successfully:", result.insertedId)
      return result.insertedId
    } catch (error) {
      console.error("Error in create order:", error)
      throw error
    }
  },

  async updateStatus(id: string, status: string) {
    try {
      const { db } = await connectToDatabase()
      if (!db) throw new Error("Database connection failed")
      
      console.log(`Updating order ${id} status to: ${status}`)
      const { ObjectId } = require("mongodb")
      const result = await db.collection("orders").updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            status,
            updated_at: new Date(),
          },
        },
      )
      console.log("Status update result:", result.modifiedCount > 0 ? "Success" : "Failed")
      return result.modifiedCount > 0
    } catch (error) {
      console.error("Error in updateStatus order:", error)
      throw error
    }
  },

  async getByStatus(status: string) {
    try {
      const { db } = await connectToDatabase()
      if (!db) throw new Error("Database connection failed")
      
      console.log(`Fetching orders with status: ${status}`)
      const orders = await db.collection("orders").find({ status }).sort({ created_at: -1 }).toArray()
      console.log(`Found ${orders.length} orders with status ${status}`)
      return orders
    } catch (error) {
      console.error("Error in getByStatus orders:", error)
      throw error
    }
  },

  async delete(id: string) {
    try {
      const { db } = await connectToDatabase()
      if (!db) throw new Error("Database connection failed")
      
      console.log(`Deleting order with ID: ${id}`)
      const { ObjectId } = require("mongodb")
      const result = await db.collection("orders").deleteOne({ _id: new ObjectId(id) })
      console.log("Delete result:", result.deletedCount > 0 ? "Success" : "Failed")
      return result.deletedCount > 0
    } catch (error) {
      console.error("Error in delete order:", error)
      throw error
    }
  }
}

// Customer operations
export const customerQueries = {
  async getAll() {
    const { db } = await connectToDatabase()
    return await db.collection("customers").find({}).sort({ created_at: -1 }).toArray()
  },

  async getByEmail(email: string) {
    const { db } = await connectToDatabase()
    return await db.collection("customers").findOne({ email })
  },

  async create(customerData: any) {
    const { db } = await connectToDatabase()
    const result = await db.collection("customers").insertOne({
      ...customerData,
      created_at: new Date(),
    })
    return result.insertedId
  },

  async update(email: string, customerData: any) {
    const { db } = await connectToDatabase()
    const result = await db.collection("customers").updateOne({ email }, { $set: customerData })
    return result.modifiedCount > 0
  },
}

// Admin user operations
export const adminQueries = {
  async getByUsername(username: string) {
    console.log("Attempting to find admin by username:", username)
    const { db } = await connectToDatabase()
    if (!db) throw new Error("Database connection failed")
    
    // List all admins for debugging
    const allAdmins = await db.collection("admins").find({}).toArray()
    console.log("All admin users in database:", allAdmins.map(a => ({
      username: a.username,
      id: a._id,
      fields: Object.keys(a)
    })))
    
    // Try case-insensitive search
    const admin = await db.collection("admins").findOne({
      username: { $regex: new RegExp(`^${username}$`, 'i') }
    })
    
    if (admin) {
      console.log("Found admin with fields:", Object.keys(admin))
      console.log("Admin username:", admin.username)
      console.log("Admin has password:", !!admin.password)
    } else {
      console.log("No admin found with username:", username)
    }
    
    return admin
  },

  async getByEmail(email: string) {
    const { db } = await connectToDatabase()
    if (!db) throw new Error("Database connection failed")
    return await db.collection("admins").findOne({ email })
  },

  async getById(id: string) {
    const { db } = await connectToDatabase()
    if (!db) throw new Error("Database connection failed")
    const { ObjectId } = require("mongodb")
    return await db.collection("admins").findOne({ _id: new ObjectId(id) })
  },

  async create(adminData: any) {
    const { db } = await connectToDatabase()
    if (!db) throw new Error("Database connection failed")
    const result = await db.collection("admins").insertOne({
      ...adminData,
      created_at: new Date(),
      last_login: null,
    })
    return result.insertedId
  },

  async updateLastLogin(id: string) {
    const { db } = await connectToDatabase()
    if (!db) throw new Error("Database connection failed")
    const { ObjectId } = require("mongodb")
    const result = await db
      .collection("admins")
      .updateOne({ _id: new ObjectId(id) }, { $set: { last_login: new Date() } })
    return result.modifiedCount > 0
  },

  async updatePassword(id: string, password: string) {
    const { db } = await connectToDatabase()
    if (!db) throw new Error("Database connection failed")
    const { ObjectId } = require("mongodb")
    const result = await db.collection("admins").updateOne({ _id: new ObjectId(id) }, { $set: { password } })
    return result.modifiedCount > 0
  },
}

// Initialize database on import
console.log("Starting database initialization process...")
initializeDatabase()
  .then(() => {
    console.log("Database initialization completed successfully")
  })
  .catch((error) => {
    console.error("Failed to initialize database:", error)
    process.exit(1)
  })

export { connectToDatabase }
