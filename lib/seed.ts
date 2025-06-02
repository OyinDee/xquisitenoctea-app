import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"
import 'dotenv/config'

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017"
const DB_NAME = process.env.DB_NAME || "xquisitenoctea"

// Admin credentials from environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
const ADMIN_EMAIL = process.env.ADMIN_EMAIL

if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !ADMIN_EMAIL) {
  console.error("Missing required environment variables for admin user")
  console.error("Please set ADMIN_USERNAME, ADMIN_PASSWORD, and ADMIN_EMAIL")
  process.exit(1)
}

export async function seedAdmin() {
  let client: MongoClient | null = null

  try {
    console.log("Connecting to MongoDB...")
    client = new MongoClient(MONGODB_URI)
    await client.connect()
    const db = client.db(DB_NAME)
    console.log("Connected to MongoDB")

    // Check if admin already exists
    const adminCollection = db.collection("admins")
    const existingAdmin = await adminCollection.findOne({ username: ADMIN_USERNAME })

    if (existingAdmin) {
      console.log("Admin user already exists, updating password...")
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD as string, 12)
      await adminCollection.updateOne(
        { username: ADMIN_USERNAME },
        {
          $set: {
            password: hashedPassword,
            email: ADMIN_EMAIL,
            updated_at: new Date()
          }
        }
      )
      console.log("Admin user updated successfully")
    } else {
      console.log("Creating new admin user...")
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD as string, 12)
      await adminCollection.insertOne({
        username: ADMIN_USERNAME,
        password: hashedPassword,
        email: ADMIN_EMAIL,
        name: "Xquisitenoctea Administrator",
        role: "admin",
        created_at: new Date(),
        last_login: null
      })
      console.log("Admin user created successfully")
    }

    // Verify admin was created/updated
    const verifyAdmin = await adminCollection.findOne({ username: ADMIN_USERNAME })
    if (verifyAdmin) {
      console.log("Admin user verified in database")
      console.log("Username:", verifyAdmin.username)
      console.log("Email:", verifyAdmin.email)
      console.log("Role:", verifyAdmin.role)
    } else {
      console.error("Failed to verify admin user")
    }

  } catch (error) {
    console.error("Error seeding admin user:", error)
    process.exit(1)
  } finally {
    if (client) {
      await client.close()
      console.log("MongoDB connection closed")
    }
  }
}

// Run the seed function
seedAdmin()
  .then(() => {
    console.log("Seed completed successfully")
    process.exit(0)
  })
  .catch((error) => {
    console.error("Seed failed:", error)
    process.exit(1)
  }) 