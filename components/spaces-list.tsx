"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { MapPin, Users, Wifi, Car, Coffee, Mic, Loader2, Search, Filter, X, SlidersHorizontal, Expand } from "lucide-react"
import { EnquiryModal } from "@/components/enquiry-modal"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"

interface Space {
  id: number
  name: string
  location: string
  address: string
  capacity: number
  price: string
  price_per_day: number
  image: string
  images: string[]
  description: string
  detailedDescription: string
  amenities: string[]
  date_availability: string[]
  features: string[]
  event_space_length: string,
  event_space_width: string,
  staff_capacity_min: number,
  staff_capacity_max: number,
  detailedAmenities: {
    [category: string]: string[]
  }
  floorPlan: string
  policies: {
    cancellation: string
    setup: string
    catering: string
    alcohol: string
    smoking: string
  }
  contact: {
    manager: string
    phone: string
    email: string
  }
}



interface FilterState {
  search: string
  minCapacity: string
  maxCapacity: string
  priceRange: string
  selectedAmenities: string[]
  selectedFeatures: string[]
  location: string
}

export function SpacesList() {
  const [spaces, setSpaces] = useState<Space[]>([])
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null)
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    minCapacity: "",
    maxCapacity: "",
    priceRange: "",
    selectedAmenities: [],
    selectedFeatures: [],
    location: "",
  })

  useEffect(() => {
    fetchSpaces()
  }, [])

  const fetchSpaces = async () => {
    try {
      const response = await fetch("/api/spaces")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch spaces")
      }

      setSpaces(data.spaces)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load spaces")
    } finally {
      setIsLoading(false)
    }
  }

  // Get unique amenities and features for filter options
  const { uniqueAmenities, uniqueFeatures, uniqueLocations } = useMemo(() => {
    const amenitiesSet = new Set<string>()
    const featuresSet = new Set<string>()
    const locationsSet = new Set<string>()

    spaces.forEach((space) => {
      space.amenities.forEach((amenity) => amenitiesSet.add(amenity))
      space.features.forEach((feature) => featuresSet.add(feature))
      locationsSet.add(space.location)
    })

    return {
      uniqueAmenities: Array.from(amenitiesSet).sort(),
      uniqueFeatures: Array.from(featuresSet).sort(),
      uniqueLocations: Array.from(locationsSet).sort(),
    }
  }, [spaces])

  // Filter spaces based on current filters
  const filteredSpaces = useMemo(() => {
    return spaces.filter((space) => {
      // Search filter (name, location, description)
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        const matchesSearch =
          space.name.toLowerCase().includes(searchTerm) ||
          space.location.toLowerCase().includes(searchTerm) ||
          space.description.toLowerCase().includes(searchTerm)
        if (!matchesSearch) return false
      }

      // Location filter
      if (filters.location && space.location !== filters.location) {
        return false
      }

      // Capacity filters
      if (filters.minCapacity && space.capacity < Number.parseInt(filters.minCapacity)) {
        return false
      }
      if (filters.maxCapacity && space.capacity > Number.parseInt(filters.maxCapacity)) {
        return false
      }

      // Price range filter
      if (filters.priceRange) {
        const price = space.price_per_day
        switch (filters.priceRange) {
          case "under-1000":
            if (price >= 1000) return false
            break
          case "1000-2000":
            if (price < 1000 || price >= 2000) return false
            break
          case "2000-3000":
            if (price < 2000 || price >= 3000) return false
            break
          case "over-3000":
            if (price < 3000) return false
            break
        }
      }

      // Amenities filter
      if (filters.selectedAmenities.length > 0) {
        const hasAllAmenities = filters.selectedAmenities.every((amenity) => space.amenities.includes(amenity))
        if (!hasAllAmenities) return false
      }

      // Features filter
      if (filters.selectedFeatures.length > 0) {
        const hasAllFeatures = filters.selectedFeatures.every((feature) => space.features.includes(feature))
        if (!hasAllFeatures) return false
      }

      return true
    })
  }, [spaces, filters])

  const handleEnquiry = (space: Space) => {
    setSelectedSpace(space)
    setIsEnquiryOpen(true)
  }

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const toggleAmenity = (amenity: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedAmenities: prev.selectedAmenities.includes(amenity)
        ? prev.selectedAmenities.filter((a) => a !== amenity)
        : [...prev.selectedAmenities, amenity],
    }))
  }

  const toggleFeature = (feature: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedFeatures: prev.selectedFeatures.includes(feature)
        ? prev.selectedFeatures.filter((f) => f !== feature)
        : [...prev.selectedFeatures, feature],
    }))
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      minCapacity: "",
      maxCapacity: "",
      priceRange: "",
      selectedAmenities: [],
      selectedFeatures: [],
      location: "",
    })
  }

  const hasActiveFilters = Object.values(filters).some((value) =>
    Array.isArray(value) ? value.length > 0 : value !== "",
  )

  if (isLoading) {
    return (
      <section id="spaces" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Available Spaces</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Choose from our curated selection of premium venues, each designed to elevate your roadshow experience.
            </p>
          </div>
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#00405a]" />
            <span className="ml-2 text-gray-600 dark:text-gray-300">Loading spaces...</span>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="spaces" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <Button onClick={fetchSpaces} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="spaces" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Available Spaces</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose from our curated selection of premium venues, each designed to elevate your roadshow experience.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, location, or description..."
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                  !
                </Badge>
              )}
            </Button>
            {hasActiveFilters && (
              <Button variant="ghost" onClick={clearFilters} className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Clear All
              </Button>
            )}
          </div>

          {/* Advanced Filters */}
          <Collapsible open={showFilters} onOpenChange={setShowFilters}>
            <CollapsibleContent className="space-y-4">
              <Card className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Location Filter */}
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Select value={filters.location} onValueChange={(value) => updateFilter("location", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any location</SelectItem>
                        {uniqueLocations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Capacity Range */}
                  <div className="space-y-2">
                    <Label>Capacity Range</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Min"
                        type="number"
                        value={filters.minCapacity}
                        onChange={(e) => updateFilter("minCapacity", e.target.value)}
                      />
                      <Input
                        placeholder="Max"
                        type="number"
                        value={filters.maxCapacity}
                        onChange={(e) => updateFilter("maxCapacity", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-2">
                    <Label>Price Range (per day)</Label>
                    <Select value={filters.priceRange} onValueChange={(value) => updateFilter("priceRange", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any price" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any price</SelectItem>
                        <SelectItem value="under-1000">Under $1,000</SelectItem>
                        <SelectItem value="1000-2000">$1,000 - $2,000</SelectItem>
                        <SelectItem value="2000-3000">$2,000 - $3,000</SelectItem>
                        <SelectItem value="over-3000">Over $3,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Quick Filters */}
                  <div className="space-y-2">
                    <Label>Quick Filters</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="wifi"
                          checked={
                            filters.selectedAmenities.includes("High-speed WiFi") ||
                            filters.selectedAmenities.includes("WiFi")
                          }
                          onCheckedChange={(checked) => {
                            if (checked) {
                              toggleAmenity("WiFi")
                            } else {
                              setFilters((prev) => ({
                                ...prev,
                                selectedAmenities: prev.selectedAmenities.filter((a) => !a.includes("WiFi")),
                              }))
                            }
                          }}
                        />
                        <Label htmlFor="wifi" className="text-sm">
                          WiFi Available
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="parking"
                          checked={filters.selectedAmenities.includes("Parking")}
                          onCheckedChange={(checked) => checked && toggleAmenity("Parking")}
                        />
                        <Label htmlFor="parking" className="text-sm">
                          Parking Available
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Amenities Filter */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Amenities</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {uniqueAmenities.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox
                          id={`amenity-${amenity}`}
                          checked={filters.selectedAmenities.includes(amenity)}
                          onCheckedChange={() => toggleAmenity(amenity)}
                        />
                        <Label htmlFor={`amenity-${amenity}`} className="text-sm">
                          {amenity}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Features Filter */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Key Features</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {uniqueFeatures.map((feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <Checkbox
                          id={`feature-${feature}`}
                          checked={filters.selectedFeatures.includes(feature)}
                          onCheckedChange={() => toggleFeature(feature)}
                        />
                        <Label htmlFor={`feature-${feature}`} className="text-sm">
                          {feature}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Results Summary */}
        <div className="mb-6 flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Showing {filteredSpaces.length} of {spaces.length} spaces
            {hasActiveFilters && (
              <span className="ml-2">
                <Badge variant="outline" className="text-xs">
                  Filtered
                </Badge>
              </span>
            )}
          </div>
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: "{filters.search}"
                  <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter("search", "")} />
                </Badge>
              )}
              {filters.location && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Location: {filters.location}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter("location", "")} />
                </Badge>
              )}
              {(filters.minCapacity || filters.maxCapacity) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Capacity: {filters.minCapacity || "0"}-{filters.maxCapacity || "∞"}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => {
                      updateFilter("minCapacity", "")
                      updateFilter("maxCapacity", "")
                    }}
                  />
                </Badge>
              )}
              {filters.selectedAmenities.map((amenity) => (
                <Badge key={amenity} variant="secondary" className="flex items-center gap-1">
                  {amenity}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => toggleAmenity(amenity)} />
                </Badge>
              ))}
              {filters.selectedFeatures.map((feature) => (
                <Badge key={feature} variant="secondary" className="flex items-center gap-1">
                  {feature}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => toggleFeature(feature)} />
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Spaces Grid */}
        {filteredSpaces.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No spaces found</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {hasActiveFilters
                  ? "Try adjusting your filters to see more results"
                  : "No spaces are currently available"}
              </p>
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant="outline">
                  Clear All Filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSpaces.map((space) => (
              <Card key={space.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img src={space.image || "/placeholder.svg"} alt={space.name} className="w-full h-48 object-cover" />
                  <Badge className="absolute top-3 right-3" style={{ backgroundColor: "#005687" }}>
                    {space.price}</Badge>
                </div>

                <CardHeader>
                  <CardTitle className="text-xl">{space.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {space.location}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300">{space.description}</p>

                  {space.event_space_length && space.event_space_width ? (
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Expand className="h-4 w-4" style={{ color: "#005687" }} />
                        <span>size event space : {space.event_space_length} X {space.event_space_width} cm</span>
                      </div>
                    </div>
                  ): <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Expand className="h-4 w-4" style={{ color: "#005687" }} />
                        <span>size event space : TBC</span>
                      </div>
                    </div>}

                  {space.staff_capacity_min && space.staff_capacity_max ? (
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" style={{ color: "#005687" }} />
                        <span>Number Of Pax: {space.staff_capacity_min} - {space.staff_capacity_max}</span>
                      </div>
                    </div>
                  ): <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" style={{ color: "#005687" }} />
                        <span>Number Of Pax: TBC</span>
                      </div>
                    </div>}

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" style={{ color: "#005687" }} />
                      <span>{space.capacity} capacity</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Date Availability:</h4>
                    {space.date_availability.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {space.date_availability.slice(0, 3).map((date) => (
                          <Badge key={date} variant="secondary" className="text-xs">
                            {date}
                          </Badge>
                        ))}
                        {space.date_availability.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{space.date_availability.length - 3} more
                          </Badge>
                        )}
                      </div>
                    ) : ("To Be Suggested")}
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Key Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {space.features.slice(0, 3).map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {space.features.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{space.features.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Amenities:</h4>
                    <div className="grid grid-cols-2 gap-1 text-xs text-gray-600 dark:text-gray-300">
                      {space.amenities.slice(0, 4).map((amenity) => (
                        <div key={amenity} className="flex items-center gap-1">
                          {amenity.includes("WiFi") && <Wifi className="h-3 w-3" />}
                          {amenity.includes("Parking") && <Car className="h-3 w-3" />}
                          {amenity.includes("Coffee") && <Coffee className="h-3 w-3" />}
                          {amenity.includes("AV") && <Mic className="h-3 w-3" />}
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => (window.location.href = `/space/${space.id}`)}
                  >
                    View Details
                  </Button>
                  <Button
                    className="flex-1"
                    style={{ backgroundColor: "#005687", color: "#fff" }}
                    onClick={() => handleEnquiry(space)}
                  >
                    Quick Enquiry
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      <EnquiryModal space={selectedSpace} isOpen={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} />
    </section>
  )
}
