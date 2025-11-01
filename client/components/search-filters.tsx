"use client"

interface SearchFiltersProps {
  filters: Record<string, any>
  setFilters: (filters: Record<string, any>) => void
}

export default function SearchFilters({ filters, setFilters }: SearchFiltersProps) {
  const updateFilter = (key: string, value: any) => {
    setFilters({ ...filters, [key]: value })
  }

  const propertyTypes = ["All", "Apartment", "House", "Office", "Condo"]
  const cities = ["All", "New York", "Los Angeles", "Chicago", "Houston"]
  const bedrooms = ["All", "1", "2", "3", "4+"]
  const bathrooms = ["All", "1", "1.5", "2", "3+"]

  return (
    <div className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Property Type */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-2">Type</label>
            <select
              value={filters.type}
              onChange={(e) => updateFilter("type", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {propertyTypes.map((type) => (
                <option key={type} value={type.toLowerCase()}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-2">Price</label>
            <input
              type="number"
              placeholder="Max price"
              value={filters.priceMax}
              onChange={(e) => updateFilter("priceMax", Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-2">Bedrooms</label>
            <select
              value={filters.bedrooms}
              onChange={(e) => updateFilter("bedrooms", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {bedrooms.map((bed) => (
                <option key={bed} value={bed.toLowerCase()}>
                  {bed}
                </option>
              ))}
            </select>
          </div>

          {/* Bathrooms */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-2">Bathrooms</label>
            <select
              value={filters.bathrooms}
              onChange={(e) => updateFilter("bathrooms", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {bathrooms.map((bath) => (
                <option key={bath} value={bath.toLowerCase()}>
                  {bath}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-2">City</label>
            <select
              value={filters.city}
              onChange={(e) => updateFilter("city", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {cities.map((city) => (
                <option key={city} value={city.toLowerCase()}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-2">Sort By</label>
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilter("sortBy", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
