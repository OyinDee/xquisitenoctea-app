"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, ShoppingCart, Heart, User, Search } from "lucide-react"

export default function Header() {
  const [cartItemCount, setCartItemCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]")
      const itemCount = cart.reduce((total: number, item: any) => total + item.quantity, 0)
      setCartItemCount(itemCount)
    }

    updateCartCount()

    // Listen for storage changes
    window.addEventListener("storage", updateCartCount)

    // Listen for custom cart update events
    window.addEventListener("cartUpdated", updateCartCount)

    return () => {
      window.removeEventListener("storage", updateCartCount)
      window.removeEventListener("cartUpdated", updateCartCount)
    }
  }, [])

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.jpg"
              alt="Xquisitenoctéa"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-white font-bold text-xl">Xquisitenoctéa</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white/90 hover:text-yellow-400 transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-white/90 hover:text-yellow-400 hover:bg-transparent">
              <Search className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="sm" className="text-white/90 hover:text-yellow-400 hover:bg-transparent">
              <Heart className="h-5 w-5" />
            </Button>

            <Link href="/cart">
              <Button
                variant="ghost"
                size="sm"
                className="text-white/90 hover:text-yellow-400 hover:bg-transparent relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs h-5 w-5 rounded-full flex items-center justify-center p-0">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <Link href="/admin/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-white/90 hover:text-yellow-400 hover:bg-transparent transform hover:scale-110 transition-all duration-300"
              >
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center space-x-2">
            <Link href="/cart">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-yellow-400 hover:bg-transparent relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs h-5 w-5 rounded-full flex items-center justify-center p-0">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-yellow-400 hover:bg-transparent">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="bg-black border-gray-800 w-72">
                <div className="flex flex-col space-y-6 mt-6">
                  {/* Logo */}
                  <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                    <Image
                      src="/logo.jpg"
                      alt="Xquisitenoctéa"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <span className="text-white font-bold text-xl">Xquisitenoctéa</span>
                  </Link>

                  {/* Navigation */}
                  <nav className="flex flex-col space-y-4">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="text-gray-300 hover:text-yellow-400 transition-colors text-lg font-medium"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>

                  {/* Actions */}
                  <div className="flex flex-col space-y-4 pt-6 border-t border-gray-800">
                    <Link href="/admin/login" onClick={() => setIsOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 justify-start transform hover:scale-105 transition-all duration-300"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Admin Panel
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
