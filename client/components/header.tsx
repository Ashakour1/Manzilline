"use client"

import { MapPin, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
         
            <h1 className="text-2xl font-bold text-primary">PropertyHub</h1>
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

        <div className="flex gap-3">
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Enter location"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button className="bg-primary hover:bg-primary/90">Search</Button>
        </div>
      </div>
    </header>
  )
}
