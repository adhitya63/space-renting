"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  MapPin,
  Users,
  DollarSign,
  Phone,
  Mail,
  Calendar,
  Clock,
  CheckCircle,
  ImageIcon,
} from "lucide-react"
import { EnquiryModal } from "@/components/enquiry-modal"
import { ImageGallery } from "@/components/image-gallery"

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

interface SpaceDetailProps {
  space: Space
}

export function SpaceDetail({ space }: SpaceDetailProps) {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)

  const handleBackClick = () => {
    window.history.back()
  }

  const openGallery = (index: number) => {
    setSelectedImageIndex(index)
    setIsGalleryOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBackClick}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Spaces
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{space.name}</h1>
              <p className="text-gray-600 dark:text-gray-300 flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {space.location}
              </p>
            </div>
            {/* <div className="text-right">
              <div className="text-2xl font-bold" style={{ color: "#005687" }}>{space.price}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">per week</div>
            </div> */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery Preview */}
            <Card>
              <CardContent className="p-0">
                <div className="grid grid-cols-4 gap-2 p-4">
                  <div className="col-span-2 row-span-2">
                    <img
                      src={space.images[0] || "/placeholder.svg"}
                      alt={`${space.name} main view`}
                      className="w-full h-64 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => openGallery(0)}
                    />
                  </div>
                  {space.images.slice(1, 5).map((image, index) => (
                    <img
                      key={index}
                      src={image || "/placeholder.svg"}
                      alt={`${space.name} view ${index + 2}`}
                      className="w-full h-[calc(8rem-0.25rem)] object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => openGallery(index + 1)}
                    />
                  ))}
                </div>
                {space.images.length > 5 && (
                  <div className="px-4 pb-4">
                    <Button variant="outline" onClick={() => openGallery(0)} className="w-full">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      View All {space.images.length} Photos
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Space</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">{space.description}</p>
                <p className="text-gray-700 dark:text-gray-200">{space.detailedDescription}</p>
              </CardContent>
            </Card>

            {/* Detailed Information Tabs */}
            <Card>
                <CardContent className="p-0">
                <Tabs defaultValue="policies" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="policies">Policies</TabsTrigger>
                  <TabsTrigger value="amenities">Amenities</TabsTrigger>
                  <TabsTrigger value="floorplan">Floor Plan</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                  </TabsList>

                  <TabsContent value="amenities" className="p-6">
                  <div className="space-y-6">
                    {Object.entries(space.detailedAmenities).map(([category, items]) => (
                    <div key={category}>
                      <h4 className="font-semibold mb-3" style={{ color: "#005687" }}>{category}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {items.map((item) => (
                        <div key={item} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                        </div>
                      ))}
                      </div>
                    </div>
                    ))}
                  </div>
                  </TabsContent>

                  <TabsContent value="policies" className="p-6">
                  <div className="space-y-4">
                    {Object.entries(space.policies).map(([key, value]) => (
                    <div key={key}>
                      <h4
                      className="font-semibold capitalize mb-2"
                      style={{ color: "#005687" }}
                      >
                      {key.replace(/([A-Z])/g, " $1").trim()}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{value}</p>
                    </div>
                    ))}
                  </div>
                  </TabsContent>

                  <TabsContent value="floorplan" className="p-6">
                  <div className="text-center">
                    <img
                    src={space.floorPlan || "/placeholder.svg"}
                    alt={`${space.name} floor plan`}
                    className="max-w-full h-auto mx-auto rounded-lg border"
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">
                    Floor plan showing layout and capacity for {space.capacity} attendees
                    </p>
                  </div>
                  </TabsContent>

                  <TabsContent value="contact" className="p-6">
                  <div className="space-y-4">
                    <div>
                    <h4 className="font-semibold mb-2" style={{ color: "#005687" }}>
                      Venue Manager
                    </h4>
                    <p className="text-lg">{space.contact.manager}</p>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5" style={{ color: "#005687" }} />
                      <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{space.contact.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5" style={{ color: "#005687" }} />
                      <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{space.contact.email}</p>
                      </div>
                    </div>
                    </div>
                    <Separator />
                    <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 mt-1" style={{ color: "#005687" }} />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{space.address}</p>
                    </div>
                    </div>
                  </div>
                  </TabsContent>
                </Tabs>
                </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Info</CardTitle>
              </CardHeader>
                <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" style={{ color: "#005687" }} />
                  <span className="text-sm">Capacity</span>
                  </div>
                  <span className="font-semibold">{space.staff_capacity_min} - {space.staff_capacity_max} people</span>
                </div>
                {/* <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" style={{ color: "#005687" }} />
                  <span className="text-sm">Rate</span>
                  </div>
                  <span className="font-semibold">{space.price}</span>
                </div> */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" style={{ color: "#005687" }} />
                  <span className="text-sm">Location</span>
                  </div>
                  <span className="font-semibold text-right text-sm">{space.location}</span>
                </div>
                </CardContent>
            </Card>

            {/* Key Features */}
            <Card>
              <CardHeader>
                <CardTitle>Key Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {space.features.map((feature) => (
                    <Badge key={feature} variant="secondary">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
                <Button
                className="w-full text-white"
                style={{ backgroundColor: "#005687" }}
                size="lg"
                onClick={() => setIsEnquiryOpen(true)}
                >
                <Calendar className="h-4 w-4 mr-2" />
                Make Enquiry
                </Button>
              <Button variant="outline" className="w-full" size="lg">
                <Phone className="h-4 w-4 mr-2" />
                Call {space.contact.phone}
              </Button>
            </div>

            {/* Availability Notice */}
            <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5" style={{ color: "#005687" }} />
                  <div>
                  <p className="font-semibold" style={{ color: "#005687" }}>Quick Response</p>
                  <p className="text-sm" style={{ color: "#3381a3" }}>
                    We typically respond to enquiries within 2 hours during business hours.
                  </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EnquiryModal space={space} isOpen={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} />

      <ImageGallery
        images={space.images}
        spaceName={space.name}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        initialIndex={selectedImageIndex}
      />
    </div>
  )
}
