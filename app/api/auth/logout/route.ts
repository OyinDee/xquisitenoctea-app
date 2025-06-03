import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Clear auth token cookie
    const cookieStore = await cookies()
    cookieStore.set({
      name: "auth_token",
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0, // Expire immediately
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json(
      { error: "Failed to logout" },
      { status: 500 }
    )
  }
}
