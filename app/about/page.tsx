import Image from "next/image"
import Link from "next/link"
import { Sparkles, Heart, Star, Award, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <div className="absolute inset-0 bg-[url('/second.jpg')] bg-cover bg-center opacity-20" />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Discover Our Story
          </h1>
          <p className="text-lg md:text-xl text-yellow-400 font-light italic mb-8">
            Discover our exclusive collection of luxury perfumes, handmade skincare, body care and feminine essentials, crafted with intention and love for those who embrace the mystery of the night, the power of allure and elevate one self-care ritual.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105">
                Explore Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#story">
              <Button variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105">
                Read More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section id="story" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="relative z-10">
                <Image
                  src="/second.jpg"
                  alt="Luxury perfume creation"
                  width={600}
                  height={800}
                  className="rounded-lg shadow-2xl"
                />
              </div>
              <div className="absolute inset-0 bg-yellow-400 rounded-lg transform rotate-6 opacity-20 blur-sm"></div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Discover Our <span className="text-yellow-400">Story</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                At Xquisitenoctéa, our story begins in the stillness of the night, where confidence awakens, beauty deepens, and individuality shines.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed">
                We envisioned more than just products. We envisioned an experience: rich in scent, soaked in intention, and created for every body — male, female, and beyond.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed">
                We craft luxury perfumes, bodycare, and wellness essentials that speak to your soul and scent your skin with purpose. Every item is handmade with love, merging nature's finest ingredients with the power of allure, care, and confidence.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed">
                Whether you're stepping into the day or owning the night, our collection invites you to indulge in self-expression, elevate your glow, and feel as exquisite as you are.
              </p>
              <p className="text-yellow-400 text-lg leading-relaxed font-medium">
                ✨ You don't just wear Xquisitenoctéa. You become her. Bold. Alluring. Magnetic.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed">
                Welcome to your glow era. This is more than beauty, it's allure, redefined.
              </p>
              <div className="space-y-2">
                <p className="text-yellow-400">✨ Step into your essence.</p>
                <p className="text-yellow-400">✨ Command the room.</p>
                <p className="text-yellow-400">✨ Smell like allure.</p>
                <p className="text-yellow-400">✨ Be unforgettable.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
            Our <span className="text-yellow-400">Values</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-white">Innovation</h3>
              <p className="text-gray-400">
                We push boundaries to create products that feel as good as they look and perform even better. We blend traditional self-care rituals with modern formulations, ensuring each product is both luxuriously effective and intentionally designed to fit seamlessly into your lifestyle.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto">
                <Heart className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-white">Passion</h3>
              <p className="text-gray-400">
                We are deeply committed to crafting products that ignite confidence, awaken sensuality, and elevate everyday rituals. Our love for rich, unforgettable scents, nourishing bodycare, and intimate wellness drives everything we do.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto">
                <Star className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-white">Excellence</h3>
              <p className="text-gray-400">
                Every formula, every fragrance, every finish is carefully crafted to deliver luxury without compromise. From ingredient sourcing to packaging, we pay attention to detail so you can feel the difference from the first touch to the final impression.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 bg-gradient-to-br from-black to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Experience <span className="text-yellow-400">Luxury Self-Care</span>
          </h2>
          <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
            Discover our curated collection of luxury perfumes, nourishing body care, transformative hair treatments, and essential feminine wellness products. Each creation is crafted to elevate your daily rituals and enhance your natural beauty.
          </p>
          <a
            href="/shop"
            className="inline-block bg-yellow-400 text-black font-semibold px-8 py-4 rounded-lg hover:bg-yellow-300 transition-colors duration-300 transform hover:scale-105"
          >
            Explore Our Collection
          </a>
        </div>
      </section>
    </div>
  )
} 