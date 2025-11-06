"use client"

import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import SearchFilters from "@/components/search-filters"
import PropertyGrid from "@/components/property-grid"
import PropertyModal from "@/components/property-modal"

export default function PropertiesPage() {
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
        <div className="bg-card  border-border py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">All Properties</h1>
            <p className="text-muted-foreground">Browse our complete collection of available properties</p>
          </div>
        </div>
        <SearchFilters filters={filters} setFilters={setFilters} />
        <PropertyGrid filters={filters} onSelectProperty={setSelectedProperty} />
      </main>
      <Footer />
      {selectedProperty && <PropertyModal property={selectedProperty} onClose={() => setSelectedProperty(null)} />}
    </div>
  )
}
