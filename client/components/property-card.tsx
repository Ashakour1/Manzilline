"use client"
import { MapPin, Bed, Bath, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PropertyCardProps {
  property: any
  onClick: () => void
}

export default function PropertyCard({ property, onClick }: PropertyCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer"
    >
      <div className="relative h-48 bg-muted overflow-hidden">
        <img
          src={property.image || "/placeholder.svg"}
          alt={property.title}
          className="w-full h-full object-cover hover:scale-105 transition"
        />
        {property.furnished && (
          <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
            Furnished
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">{property.title}</h3>

        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
          <MapPin className="w-4 h-4" />
          {property.location}
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{property.description}</p>

        <div className="flex gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4 text-primary" />
            <span className="text-foreground">{property.bedrooms} BR</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4 text-primary" />
            <span className="text-foreground">{property.bathrooms} BA</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize2 className="w-4 h-4 text-primary" />
            <span className="text-foreground">{property.size} sqft</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-primary">${property.price.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground ml-2">/ {property.frequency}</span>
          </div>
        </div>

        <Button
          onClick={(e) => {
            e.stopPropagation()
            onClick()
          }}
          className="w-full mt-4 bg-primary hover:bg-primary/90"
        >
          View Details
        </Button>
      </div>
    </div>
  )
}
