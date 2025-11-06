"use client"

import { useState } from "react"
import Header from "@/components/header"
import Hero from "@/components/hero"
import SearchFilters from "@/components/search-filters"
import PropertyGrid from "@/components/property-grid"
import PropertyModal from "@/components/property-modal"
import ServicesSection from "@/components/services-section"
import RealtorHelpSection from "@/components/realtor-help"
import StatsSection from "@/components/stats-section"
import Footer from "@/components/footer"
import HelpSection from "@/components/how-we-can-help"

export default function Home() {
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [filters, setFilters] = useState({
    type: "all",
    priceMin: 0,
    priceMax: 50000,
    bedrooms: "all",
    bathrooms: "all",
    furnished: "all",
    city: "all",
    sortBy: "newest",
  })

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 w-full">
        <Hero />
        <HelpSection />
        {/* <StatsSection /> */}
        {/* <SearchFilters filters={filters} setFilters={setFilters} /> */}
        <PropertyGrid filters={filters} onSelectProperty={setSelectedProperty} />
        <ServicesSection />
        
      </main>
      <Footer />
      {selectedProperty && <PropertyModal property={selectedProperty} onClose={() => setSelectedProperty(null)} />}
    </div>
  )
}
