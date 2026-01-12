"use client"

import { Star } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    title: "Great Work",
    quote: "Manzilini made finding my apartment so easy! The verified listings gave me confidence, and I found my perfect home in just a few days. Highly recommend their platform.",
    rating: 5,
    name: "Ali Tufan",
    role: "Marketing",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  },
  {
    title: "Good Job",
    quote: "As a landlord, Manzilini has been a game-changer. I've been able to list my properties easily and connect with genuine tenants. The platform is user-friendly and reliable.",
    rating: 4,
    name: "Albert Flores",
    role: "Designer",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  },
  {
    title: "Perfect",
    quote: "The transparency and security features on Manzilini are excellent. I felt safe throughout the entire rental process, and the support team was always available when I needed help.",
    rating: 5,
    name: "Robert Fox",
    role: "Developer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  {
    title: "Work Hard",
    quote: "I love how Manzilini brings everything together - property search, home services, and secure communication. It's truly an all-in-one platform that simplifies real estate.",
    rating: 3,
    name: "Marvin McKinney",
    role: "Marketing",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-20 md:py-28 bg-pink-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">People Love Living with Manzilini</h2>
          <p className="text-muted-foreground">See what our community of tenants, landlords, and homeowners have to say about their experience with Manzilini.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-all duration-300"
            >
              <h3 className="text-lg font-bold text-foreground mb-3">{testimonial.title}</h3>
              <p className="text-foreground mb-4 leading-relaxed text-sm">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-none text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
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
  )
}

