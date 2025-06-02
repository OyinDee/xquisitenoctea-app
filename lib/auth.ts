import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-for-development"

// Add validation to ensure JWT_SECRET is set in production
if (process.env.NODE_ENV === "production" && !process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required in production")
}

export async function createToken(payload: any) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(new TextEncoder().encode(JWT_SECRET))

  return token
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
    return { success: true, payload }
  } catch (error) {
    return { success: false, message: "Invalid token" }
  }
}

export async function getSession() {
  const cookieStore = cookies()
  const token = cookieStore.get("auth_token")?.value

  if (!token) {
    return null
  }

  const { success, payload } = await verifyToken(token)

  if (!success) {
    return null
  }

  return payload
}

export async function isAuthenticated() {
  const session = await getSession()
  return session !== null
}

export function validateJWTSecret() {
  if (process.env.NODE_ENV === "production" && JWT_SECRET.length < 32) {
    console.warn("Warning: JWT_SECRET should be at least 32 characters long for production")
  }
}
