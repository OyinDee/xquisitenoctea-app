import Image from "next/image"
import { Sparkles, Heart, Star, Award } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <div className="absolute inset-0 bg-[url('/second.jpg')] bg-cover bg-center opacity-20" />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Our Story
          </h1>
          <p className="text-lg md:text-xl text-yellow-400 font-light italic">
            Born of night, made for allure
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-6">
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
                The Art of <span className="text-yellow-400">Sophisticated Scent</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                At Xquisitenoctéa, we believe that fragrance is more than just a scent—it's an expression of identity, 
                a whisper of mystery, and a touch of elegance. Our journey began with a simple yet profound vision: 
                to create perfumes that capture the essence of night's allure and the sophistication of timeless beauty.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed">
                Each creation is meticulously crafted, combining rare ingredients with innovative techniques to produce 
                fragrances that are as unique as the individuals who wear them. We don't just make perfumes; we create 
                experiences that linger in memory and stir the soul.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-900 to-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
            Our <span className="text-yellow-400">Values</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-white">Excellence</h3>
              <p className="text-gray-400">
                We pursue perfection in every detail, from ingredient selection to final presentation.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto">
                <Heart className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-white">Passion</h3>
              <p className="text-gray-400">
                Our love for fragrance drives us to create unique and memorable experiences.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto">
                <Star className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-white">Innovation</h3>
              <p className="text-gray-400">
                We constantly explore new possibilities in scent creation and presentation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
            Meet Our <span className="text-yellow-400">Master Perfumers</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="group">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <Image
                  src="/second.jpg"
                  alt="Master Perfumer"
                  width={400}
                  height={500}
                  className="w-full h-[400px] object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Sarah Chen</h3>
              <p className="text-yellow-400 mb-2">Master Perfumer</p>
              <p className="text-gray-400">
                With over 15 years of experience in luxury fragrance creation, Sarah brings her unique vision to every Xquisitenoctéa creation.
              </p>
            </div>
            
            <div className="group">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <Image
                  src="/second.jpg"
                  alt="Master Perfumer"
                  width={400}
                  height={500}
                  className="w-full h-[400px] object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Marcus Laurent</h3>
              <p className="text-yellow-400 mb-2">Creative Director</p>
              <p className="text-gray-400">
                Marcus's passion for storytelling through scent has shaped the unique identity of our brand.
              </p>
            </div>
            
            <div className="group">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <Image
                  src="/second.jpg"
                  alt="Master Perfumer"
                  width={400}
                  height={500}
                  className="w-full h-[400px] object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Isabella Rossi</h3>
              <p className="text-yellow-400 mb-2">Fragrance Expert</p>
              <p className="text-gray-400">
                Isabella's expertise in rare ingredients and traditional techniques adds depth to our modern creations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 bg-gradient-to-br from-black to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Experience the <span className="text-yellow-400">Art of Fragrance</span>
          </h2>
          <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
            Discover our collection of exquisite fragrances, each telling its own unique story of elegance and allure.
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