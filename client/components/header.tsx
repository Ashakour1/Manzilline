"use client"

import { MapPin, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
         
            <h1 className="text-2xl font-bold text-primary">
              Manzilline
            </h1>
          </div>
          <nav className="flex items-center gap-6">
            <a href="/" className="text-sm font-medium text-foreground hover:text-primary transition">
              Home
            </a>
            <a href="/properties" className="text-sm font-medium text-foreground hover:text-primary transition">
              Properties
            </a>
            <a href="/pricing" className="text-sm font-medium text-foreground hover:text-primary transition">
              Pricing
            </a>
            <a href="/testimonials" className="text-sm font-medium text-foreground hover:text-primary transition">
              Testimonials
            </a>
            <a href="/guides" className="text-sm font-medium text-foreground hover:text-primary transition">
              Guides
            </a>
            <a href="/about" className="text-sm font-medium text-foreground hover:text-primary transition">
              About
            </a>
            <a href="/contact" className="text-sm font-medium text-foreground hover:text-primary transition">
              Contact
            </a>
            <Button variant="outline" size="sm" className="ml-2 bg-transparent">
              Login
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              Sign Up
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
