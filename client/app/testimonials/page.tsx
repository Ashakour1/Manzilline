"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { Star } from "lucide-react"

export default function TestimonialsPage() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "First-time Renter",
      image: "/woman-profile.jpg",
      text: "PropertyHub made finding my dream apartment so easy. The platform is intuitive and the team was incredibly helpful throughout the process.",
      rating: 5,
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Landlord",
      image: "/man-profile.jpg",
      text: "As a landlord, I appreciate how PropertyHub connects me with qualified tenants efficiently. It saves me time and hassle.",
      rating: 5,
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Property Manager",
      image: "/professional-woman.png",
      text: "The management tools are fantastic. I can handle multiple properties without any stress. Highly recommended!",
      rating: 5,
    },
    {
      id: 4,
      name: "David Park",
      role: "Young Professional",
      image: "/man-young-professional.jpg",
      text: "Found a beautiful apartment in just two days. The filtering options are exactly what I needed.",
      rating: 5,
    },
    {
      id: 5,
      name: "Lisa Thompson",
      role: "Relocating Professional",
      image: "/woman-relocating.jpg",
      text: "Moving to a new city was overwhelming, but PropertyHub simplified the entire search process.",
      rating: 5,
    },
    {
      id: 6,
      name: "James Wilson",
      role: "Real Estate Agent",
      image: "/man-realtor.jpg",
      text: "Great platform for showcasing properties. My clients love the detailed listings and high-quality images.",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 w-full">
        <div className="bg-card border-b border-border py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">What Our Users Say</h1>
            <p className="text-muted-foreground">
              Real stories from satisfied renters, landlords, and property managers
            </p>
          </div>
        </div>

        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-card border border-border rounded-lg p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-foreground mb-6">{testimonial.text}</p>
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
