import { NextResponse } from "next/server"
import { adminQueries } from "@/lib/database"
import bcrypt from "bcryptjs"
import { createToken } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    console.log("Login attempt received")
    const { username, password } = await request.json()
    console.log("Login attempt for username:", username)

    if (!username || !password) {
      console.log("Missing username or password")
      return NextResponse.json(
        { success: false, message: "Username and password are required" },
        { status: 400 }
      )
    }

    try {
      // Find user by username (case-insensitive)
      console.log("Looking up admin user...")
      const user = await adminQueries.getByUsername(username.trim())

      if (!user) {
        console.log("Admin user not found")
        return NextResponse.json(
          { success: false, message: "Invalid username or password" },
          { status: 401 }
        )
      }

      console.log("Admin user found with fields:", Object.keys(user))
      console.log("Verifying password...")

      // Verify password
      const passwordMatch = await bcrypt.compare(password.trim(), user.password)

      if (!passwordMatch) {
        console.log("Password verification failed")
        return NextResponse.json(
          { success: false, message: "Invalid username or password" },
          { status: 401 }
        )
      }

      console.log("Password verified, updating last login...")
      // Update last login time
      await adminQueries.updateLastLogin(user._id.toString())

      console.log("Creating JWT token...")
      // Create JWT token
      const token = await createToken({
        id: user._id.toString(),
        username: user.username,
        role: user.role,
      })

      console.log("Login successful, setting up response...")
      // Set the token in a cookie
      const response = NextResponse.json({
        success: true,
        user: {
          id: user._id.toString(),
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      })

      response.cookies.set("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
      })

      console.log("Login process completed successfully")
      return response
    } catch (error) {
      console.error("Database operation error:", error)
      return NextResponse.json(
        { success: false, message: "Database connection error" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}
