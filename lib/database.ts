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
      client = new MongoClient(MONGODB_URI)
      await client.connect()
      db = client.db(DB_NAME)
      console.log("Connected to MongoDB successfully")
      
      // Verify connection
      await db.command({ ping: 1 })
      console.log("Database connection verified")
    } catch (error) {
      console.error("MongoDB connection error:", error)
      throw error
    }
  }
  return { client, db }
}

// Initialize database with sample data
export async function initializeDatabase() {
  try {
    console.log("Starting database initialization...")
    const { db } = await connectToDatabase()
    if (!db) throw new Error("Database connection failed")

    // Check if products exist
    const productsCollection = db.collection("products")
    const productCount = await productsCollection.countDocuments()

    if (productCount === 0) {
      const sampleProducts = [
        {
          name: "Midnight Mystique",
          description: "An intoxicating blend of jasmine and sandalwood that captures the essence of mysterious nights",
          long_description:
            "Midnight Mystique is a captivating fragrance that embodies the allure of the night. This sophisticated scent opens with the intoxicating sweetness of jasmine, creating an immediate sense of mystery and elegance. The heart reveals warm sandalwood that adds depth and sensuality, while vanilla provides a creamy sweetness that lingers beautifully on the skin.",
          price: 25000,
          image: "/placeholder.svg?height=500&width=400",
          category: "floral",
          notes: ["Jasmine", "Sandalwood", "Vanilla", "White Musk", "Bergamot"],
          stock: 15,
          size_options: [
            { size: "30ml", price: 25000 },
            { size: "50ml", price: 35000 },
            { size: "100ml", price: 50000 },
          ],
          ingredients: ["Alcohol Denat", "Parfum", "Aqua", "Limonene", "Linalool", "Citronellol", "Geraniol"],
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Golden Enchantment",
          description: "Luxurious oud with hints of amber and rose, perfect for special occasions",
          long_description:
            "Golden Enchantment is a luxurious oriental fragrance that captures the essence of opulence and sophistication. Rich oud forms the heart of this composition, complemented by warm amber and delicate rose petals.",
          price: 30000,
          image: "/placeholder.svg?height=500&width=400",
          category: "oriental",
          notes: ["Oud", "Amber", "Rose", "Saffron", "Patchouli"],
          stock: 8,
          size_options: [
            { size: "30ml", price: 30000 },
            { size: "50ml", price: 42000 },
            { size: "100ml", price: 60000 },
          ],
          ingredients: ["Alcohol Denat", "Parfum", "Aqua", "Eugenol", "Geraniol", "Citronellol"],
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Velvet Shadows",
          description: "Deep vanilla and musk for the mysterious soul seeking sophisticated allure",
          long_description:
            "Velvet Shadows is an enigmatic fragrance that speaks to the mysterious soul. Deep vanilla creates a warm, comforting base while musk adds an animalic sensuality that is both alluring and sophisticated.",
          price: 28000,
          image: "/placeholder.svg?height=500&width=400",
          category: "woody",
          notes: ["Vanilla", "Musk", "Cedar", "Tonka Bean", "Amber"],
          stock: 12,
          size_options: [
            { size: "30ml", price: 28000 },
            { size: "50ml", price: 38000 },
            { size: "100ml", price: 55000 },
          ],
          ingredients: ["Alcohol Denat", "Parfum", "Aqua", "Coumarin", "Vanillin", "Linalool"],
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]

      await productsCollection.insertMany(sampleProducts)
      console.log("Sample products created")
    }
  } catch (error) {
    console.error("Database initialization error:", error)
    throw error
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
    const { db } = await connectToDatabase()
    return await db.collection("orders").find({}).sort({ created_at: -1 }).toArray()
  },

  async getById(id: string) {
    const { db } = await connectToDatabase()
    return await db.collection("orders").findOne({ id })
  },

  async create(orderData: any) {
    const { db } = await connectToDatabase()
    const result = await db.collection("orders").insertOne({
      ...orderData,
      created_at: new Date(),
      updated_at: new Date(),
    })
    return result.insertedId
  },

  async updateStatus(id: string, status: string) {
    const { db } = await connectToDatabase()
    const result = await db.collection("orders").updateOne(
      { id },
      {
        $set: {
          status,
          updated_at: new Date(),
        },
      },
    )
    return result.modifiedCount > 0
  },

  async getByStatus(status: string) {
    const { db } = await connectToDatabase()
    return await db.collection("orders").find({ status }).sort({ created_at: -1 }).toArray()
  },
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
