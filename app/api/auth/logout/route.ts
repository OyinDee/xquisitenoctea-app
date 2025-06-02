import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  // Clear auth token cookie
  cookies().set({
    name: "auth_token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0, // Expire immediately
    path: "/",
    sameSite: "strict",
  })

  return NextResponse.json({ message: "Logged out successfully" })
}
