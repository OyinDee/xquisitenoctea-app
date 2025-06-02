"use client"

import { MessageCircle } from "lucide-react"

export default function WhatsAppFloat() {
  const whatsappNumber = "2348000000000"
  const whatsappMessage = encodeURIComponent("Hello Xquisitenoctéa! I'm interested in your perfumes.")

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="w-14 h-14 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center shadow-2xl hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-110 animate-bounce">
          <MessageCircle className="h-6 w-6 text-white" />
        </div>
      </a>
    </div>
  )
}
