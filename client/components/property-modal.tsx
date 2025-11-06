"use client"

import { useState } from "react"
import { X, ChevronLeft, ChevronRight, MapPin, Bed, Bath, Maximize2, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import ContactForm from "./contact-form"

interface PropertyModalProps {
  property: any
  onClose: () => void
}

export default function PropertyModal({ property, onClose }: PropertyModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showContactForm, setShowContactForm] = useState(false)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1))
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <h2 className="text-2xl font-bold text-foreground">{property.title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Image Carousel */}
          <div className="relative h-96 bg-muted rounded-lg overflow-hidden">
            <img
              src={ "/placeholder.svg"}
              alt={`${property.title} image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
            {property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {property.images.length}
                </div>
              </>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Bed className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Bedrooms</span>
              </div>
              <span className="text-2xl font-bold text-foreground">{property.bedrooms}</span>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Bath className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Bathrooms</span>
              </div>
              <span className="text-2xl font-bold text-foreground">{property.bathrooms}</span>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Maximize2 className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Size</span>
              </div>
              <span className="text-2xl font-bold text-foreground">{property.size}</span>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Status</span>
              </div>
              <span className="text-2xl font-bold text-foreground">
                {property.furnished ? "Furnished" : "Unfurnished"}
              </span>
            </div>
          </div>

          {/* Price and Description */}
          <div>
            <div className="mb-4">
              <span className="text-4xl font-bold text-primary">${property.price.toLocaleString()}</span>
              <span className="text-lg text-muted-foreground ml-2">/ {property.frequency}</span>
            </div>
            <p className="text-foreground leading-relaxed">{property.description}</p>
          </div>

          {/* Location */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Location</h3>
            </div>
            <p className="text-foreground">{property.address}</p>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {property.amenities.map((amenity: string) => (
                <div key={amenity} className="p-3 bg-muted rounded-lg text-sm text-foreground text-center">
                  {amenity}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          {showContactForm ? (
            <ContactForm property={property} />
          ) : (
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="font-semibold text-foreground mb-3">Contact Landlord</h3>
              <div className="space-y-2 mb-4">
                <p className="text-foreground">
                  <span className="font-medium">Name:</span> {property.contact.name}
                </p>
                <p className="text-foreground">
                  <span className="font-medium">Email:</span> {property.contact.email}
                </p>
                <p className="text-foreground">
                  <span className="font-medium">Phone:</span> {property.contact.phone}
                </p>
              </div>
              <Button onClick={() => setShowContactForm(true)} className="w-full bg-primary hover:bg-primary/90">
                Send Message
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
