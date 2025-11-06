import Header from "@/components/header"
import Footer from "@/components/footer"
import { fetchPropertyById } from "@/services/properties.service"

interface PropertyDetailPageProps {
  params: { id: string }
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const property = await fetchPropertyById(params.id)

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 w-full">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-2xl font-semibold text-foreground">Property not found</h1>
            <p className="text-muted-foreground mt-2">The property you are looking for does not exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 w-full">
        <div className="bg-card border-border py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-foreground">{property.title}</h1>
            <p className="text-muted-foreground mt-1">{property.location}</p>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="w-full h-80 bg-muted rounded-lg overflow-hidden">
              <img
                src={property.image || "/placeholder.svg"}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">${property.price?.toLocaleString?.() || property.price}</span>
                {property.frequency && (
                  <span className="text-sm text-muted-foreground">/ {property.frequency}</span>
                )}
              </div>
              <p className="text-foreground mt-4">{property.description}</p>
              <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
                {typeof property.bedrooms !== "undefined" && (
                  <div className="bg-card border border-border rounded-md p-3">
                    <div className="text-muted-foreground">Bedrooms</div>
                    <div className="font-semibold text-foreground">{property.bedrooms}</div>
                  </div>
                )}
                {typeof property.bathrooms !== "undefined" && (
                  <div className="bg-card border border-border rounded-md p-3">
                    <div className="text-muted-foreground">Bathrooms</div>
                    <div className="font-semibold text-foreground">{property.bathrooms}</div>
                  </div>
                )}
                {typeof property.size !== "undefined" && (
                  <div className="bg-card border border-border rounded-md p-3">
                    <div className="text-muted-foreground">Size</div>
                    <div className="font-semibold text-foreground">{property.size} sqft</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}


