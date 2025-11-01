"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-card to-background py-20 md:py-32 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              Find Your Perfect <span className="text-primary">Property</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Explore thousands of rental properties, apartments, and homes. Connect directly with landlords and find
              your dream home today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 gap-2">
                Start Browsing
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-border bg-transparent">
                List Your Property
              </Button>
            </div>
          </div>
          <div className="bg-background rounded-xl h-80 border border-border flex items-center justify-center">
            <img
              src="/modern-property-lifestyle.jpg"
              alt="Hero property showcase"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
