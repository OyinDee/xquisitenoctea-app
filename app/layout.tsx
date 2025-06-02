"use client"

import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { FavoritesProvider } from "@/lib/context/favorites"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <FavoritesProvider>
            {!isAdminRoute && <Header />}
            <main>{children}</main>
            {!isAdminRoute && <Footer />}
          </FavoritesProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
