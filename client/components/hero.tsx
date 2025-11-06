"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play, CheckCircle2, Star } from "lucide-react"
import Image from "next/image"

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-card to-background py-20 md:py-28 ">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
              </span>
              New: Zero-fee listings this month
            </div>
            <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
              Find your next
              <span className="ml-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">dream home</span>
            </h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
              Browse verified rentals, apartments, and homes. Message landlords directly and secure your place with
              confidence.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="gap-2">
                Explore listings
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Play className="w-4 h-4" />
                Watch demo
              </Button>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <div className="text-sm text-muted-foreground"><span className="text-foreground font-medium">4.9/5</span> rating</div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <div className="text-sm text-muted-foreground"><span className="text-foreground font-medium">10k+</span> listings</div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <div className="text-sm text-muted-foreground"><span className="text-foreground font-medium">24/7</span> support</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-background rounded-2xl h-80 md:h-[420px] border border-border relative overflow-hidden shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-primary/5" />
              <Image
                src="/modern-property-lifestyle.jpg"
                alt="Modern property lifestyle showcase"
                fill
                priority
                sizes="(min-width: 1024px) 42rem, (min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-border/50" />
            </div>
            <div className="absolute -bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:w-64 rounded-xl border border-border bg-background/90 backdrop-blur p-4 shadow-md">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Manzil Verified</p>
                  <p className="text-xs text-muted-foreground">Listings reviewed for quality and safety</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
