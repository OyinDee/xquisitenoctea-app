import Link from "next/link"
import Image from "next/image"
import { MessageCircle, Mail, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-black border-t border-yellow-400/20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-6">
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
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Born of night, made for allure. Discover exquisite fragrances that capture the mystery and elegance of
              sophisticated scent.
            </p>
            <div className="flex space-x-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-yellow-400 font-medium mb-6">Navigation</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/shop" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                    Shop All
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-yellow-400 font-medium mb-6">Categories</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/shop?category=floral" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                    Floral
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=oriental" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                    Oriental
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=woody" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                    Woody
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h3 className="text-yellow-400 font-medium">Contact Us</h3>
            <div className="space-y-4">
              <a
                href="https://wa.me/2348000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-gray-400 hover:text-yellow-400 transition-colors text-sm"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp</span>
              </a>
              <a
                href="mailto:hello@xquisitenoctea.com"
                className="flex items-center space-x-3 text-gray-400 hover:text-yellow-400 transition-colors text-sm"
              >
                <Mail className="h-4 w-4" />
                <span>hello@xquisitenoctea.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-yellow-400/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">© {currentYear} Xquisitenoctéa. All rights reserved.</p>
            <div className="flex space-x-8">
              <Link href="/privacy" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
