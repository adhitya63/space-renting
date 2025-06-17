"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Building,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Users,
  DollarSign,
  Loader2,
  Save,
  X,
  Eye,
  EyeOff,
  ImageIcon,
} from "lucide-react"
import { ImageUpload } from "@/components/admin/image-upload"

interface Space {
  id: string
  name: string
  location: string
  address: string
  capacity: number
  price_per_day: number
  peak_price: number
  description: string
  detailed_description: string
  amenities: string[]
  features: string[]
  detailed_amenities: Record<string, string[]>
  images: string[]
  policies: Record<string, string>
  contact_info: Record<string, string>
  isActive: boolean
  created_at: string
  updated_at: string
  event_space_length: string,
  event_space_width: string,
  staff_capacity_min: number,
  staff_capacity_max: number,
}

export function SpacesManagement() {
  const [spaces, setSpaces] = useState<Space[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSpace, setEditingSpace] = useState<Space | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [activeTab, setActiveTab] = useState("basic")
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
  const [currentImages, setCurrentImages] = useState<string[]>([])

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    address: "",
    capacity: 0,
    price_per_day: 0,
    peak_price: 0,
    description: "",
    detailed_description: "",
    event_space_length: "",
    event_space_width: "",
    staff_capacity_min: 0,
    staff_capacity_max: 0,
    amenities: [] as string[],
    date_availability: [] as string[],
    features: [] as string[],
    detailed_amenities: {} as Record<string, string[]>,
    images: [] as string[],
    policies: {} as Record<string, string>,
    contact_info: {} as Record<string, string>,
    isActive: true,
  })

  useEffect(() => {
    fetchSpaces()
    console.log("SpacesManagement component mounted")
  }, [])

  useEffect(() => {
    console.log("Spaces updated:", spaces)
  }, [spaces])

  const fetchSpaces = async () => {
    try {
      const response = await fetch("/api/spaces?include_inactive=true")
      const data = await response.json()
      console.log("Fetched spaces:", data)
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

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      address: "",
      capacity: 0,
      price_per_day: 0,
      peak_price: 0,
      description: "",
      event_space_length: "",
      event_space_width: "",
      staff_capacity_min: 0,
      staff_capacity_max: 0,
      detailed_description: "",
      amenities: [],
      features: [],
      detailed_amenities: {},
      images: [],
      policies: {},
      contact_info: {},
      isActive: true,
      date_availability: []
    })
    setEditingSpace(null)
    setActiveTab("basic")
  }

  const openAddDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const openEditDialog = (space: Space) => {
    setFormData({
      name: space.name,
      location: space.location,
      address: space.address,
      capacity: space.capacity,
      price_per_day: space.price_per_day,
      peak_price: space.peak_price,
      description: space.description,
      detailed_description: space.detailed_description,
      amenities: space.amenities,
      features: space.features,
      detailed_amenities: space.detailed_amenities,
      images: space.images,
      policies: space.policies,
      contact_info: space.contact_info,
      isActive: space.isActive,
      event_space_length: space.event_space_length,
      event_space_width: space.event_space_width,
      staff_capacity_min: space.staff_capacity_min || 0,
      staff_capacity_max: space.staff_capacity_max || 0,
      date_availability: []
    })
    setEditingSpace(space)
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError("")
    setSuccess("")

    try {
      const url = editingSpace ? `/api/spaces/${editingSpace.id}` : "/api/spaces"
      const method = editingSpace ? "PUT" : "POST"
      console.log("Saving space with data:", formData)
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to save space")
      }

      setSuccess(editingSpace ? "Space updated successfully!" : "Space created successfully!")
      setIsDialogOpen(false)
      resetForm()
      fetchSpaces()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save space")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (spaceId: string) => {
    if (!confirm("Are you sure you want to delete this space? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/spaces/${spaceId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete space")
      }

      setSuccess("Space deleted successfully!")
      fetchSpaces()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete space")
    }
  }

  const toggleSpaceStatus = async (space: Space) => {
    try {
      const response = await fetch(`/api/spaces/${space.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...space,
          isActive: !space.isActive,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update space status")
      }

      fetchSpaces()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update space status")
    }
  }

  const openImageManager = (space: Space) => {
    setCurrentImages(space.images || [])
    setEditingSpace(space)
    setIsImageDialogOpen(true)
  }

  const handleImageUploaded = (imageUrl: string) => {
    // Add the new image to the form data
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, imageUrl],
    }))
  }

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleImageManagerSave = async () => {
    if (!editingSpace) return

    setIsSaving(true)
    setError("")

    try {
      const response = await fetch(`/api/spaces/${editingSpace.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editingSpace,
          images: currentImages,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update images")
      }

      setSuccess("Images updated successfully!")
      setIsImageDialogOpen(false)
      fetchSpaces()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update images")
    } finally {
      setIsSaving(false)
    }
  }

  const handleImageManagerUpload = (imageUrl: string) => {
    setCurrentImages((prev) => [...prev, imageUrl])
  }

  const handleImageManagerRemove = (index: number) => {
    setCurrentImages((prev) => prev.filter((_, i) => i !== index))
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#00405a]" />
        <span className="ml-2">Loading spaces...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Spaces Management</h2>
          <p className="text-gray-600 dark:text-gray-300">Manage your venue spaces and their details</p>
        </div>
        <Button onClick={openAddDialog} className="bg-[#005687] hover:bg-[#00405a]">
          <Plus className="h-4 w-4 mr-2" />
          Add New Space
        </Button>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Spaces Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {spaces.map((space) => (
          <Card key={space.id} className={`${space.isActive == false ? "opacity-60" : ""}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{space.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {space.location}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={space.isActive ? "default" : "secondary"}>
                    {space.isActive == true ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#00405a]" />
                  <span>{space.capacity} capacity</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-[#00405a]" />
                  <span>${space.price_per_day}</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{space.description}</p>

              <div className="flex items-center justify-between pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSpaceStatus(space)}
                  className="flex items-center gap-2"
                >
                  {space.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {space.isActive ? "Deactivate" : "Activate"}
                </Button>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openImageManager(space)}>
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(space)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(space.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {spaces.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Spaces Found</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Get started by adding your first venue space</p>
            <Button onClick={openAddDialog} className="bg-[#005687] hover:bg-[#00405a]">
              <Plus className="h-4 w-4 mr-2" />
              Add New Space
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-4xl h-[90vh] sm:h-auto overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingSpace ? "Edit Space" : "Add New Space"}</DialogTitle>
            <DialogDescription>
              {editingSpace ? "Update the space details below" : "Fill in the details for the new space"}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="amenities">Amenities</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Space Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter space name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Downtown Business District"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Full Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter complete address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_availability">Date Availability</Label>
                <Input
                  id="date_availability"
                  value={formData.date_availability.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      date_availability: e.target.value.split(",").map((a) => a.trim()),
                    })
                  }
                  placeholder="2 - 8 jun, 9 - 15 jun, 16 - 22 jun"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Space Length</Label>
                  <Input
                    id="capacity"
                    type="text"
                    value={formData.event_space_length}
                    onChange={(e) => {
                      // Replace comma with dot
                      const value = e.target.value.replace(',', '.');
                      // Allow only numbers and one dot
                      if (/^[0-9]*\.?[0-9]*$/.test(value) || value === "") {
                        setFormData({ ...formData, event_space_length: value });
                      }
                    }}
                    placeholder="Space Width"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Space Width</Label>
                  <Input
                    id="capacity"
                    type="text"
                    value={formData.event_space_width}
                    onChange={(e) => {
                      // Replace comma with dot
                      const value = e.target.value.replace(',', '.');
                      // Allow only numbers and one dot
                      if (/^[0-9]*\.?[0-9]*$/.test(value) || value === "") {
                        setFormData({ ...formData, event_space_width: value });
                      }
                    }}
                    placeholder="Space Length"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Staff Capacity Min</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.staff_capacity_min}
                    onChange={(e) => setFormData({ ...formData, staff_capacity_min: Number.parseInt(e.target.value) })}
                    placeholder="Maximum attendees"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Staff Capacity Max</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.staff_capacity_max}
                    onChange={(e) => setFormData({ ...formData, staff_capacity_max: Number.parseInt(e.target.value) })}
                    placeholder="Maximum attendees"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Visitor Capacity *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number.parseInt(e.target.value) })}
                    placeholder="Maximum attendees"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price Per Week ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price_per_day}
                    onChange={(e) => setFormData({ ...formData, price_per_day: Number.parseFloat(e.target.value) })}
                    placeholder="Daily rental price"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Peak Price ($) *</Label>
                  <Input
                    id="peak_price"
                    type="number"
                    step="0.01"
                    value={formData.peak_price}
                    onChange={(e) => setFormData({ ...formData, peak_price: Number.parseFloat(e.target.value) })}
                    placeholder="Daily rental price"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="active">Space is active and available for booking</Label>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Short Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the space"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="detailed_description">Detailed Description</Label>
                <Textarea
                  id="detailed_description"
                  value={formData.detailed_description}
                  onChange={(e) => setFormData({ ...formData, detailed_description: e.target.value })}
                  placeholder="Comprehensive description with unique features and selling points"
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="features">Key Features (comma-separated)</Label>
                <Input
                  id="features"
                  value={formData.features.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      features: e.target.value.split(",").map((f) => f.trim()),
                    })
                  }
                  placeholder="e.g., Stage, Sound System, Lighting, Green Rooms"
                />
              </div>
            </TabsContent>

            <TabsContent value="images" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Space Images</Label>
                  <span className="text-sm text-gray-500">
                    {formData.images.length} image{formData.images.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <ImageUpload onImageUploaded={handleImageUploaded} className="mb-4" />

                {formData.images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.images.map((image, index) => (
                      <Card key={index} className="relative overflow-hidden">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Space image ${index + 1}`}
                          className="w-full h-32 object-cover"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        {index === 0 && <Badge className="absolute bottom-2 left-2 bg-[#005687]">Primary Image</Badge>}
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border rounded-lg border-dashed">
                    <ImageIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">No images uploaded yet</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="amenities" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amenities">Basic Amenities (comma-separated)</Label>
                <Input
                  id="amenities"
                  value={formData.amenities.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      amenities: e.target.value.split(",").map((a) => a.trim()),
                    })
                  }
                  placeholder="e.g., High-speed WiFi, Parking, Catering, AV Equipment"
                />
              </div>

              <div className="space-y-4">
                <Label>Detailed Amenities by Category</Label>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Add detailed amenities organized by categories (Technology, Comfort, Services, Facilities)
                </p>
                <Textarea
                  placeholder='{"Technology": ["Fiber internet", "AV system"], "Comfort": ["Climate control", "Ergonomic seating"]}'
                  value={JSON.stringify(formData.detailed_amenities, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value)
                      setFormData({ ...formData, detailed_amenities: parsed })
                    } catch {
                      // Invalid JSON, ignore
                    }
                  }}
                  rows={8}
                />
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <div className="space-y-4">
                <Label>Contact Information</Label>
                <Textarea
                  placeholder='{"manager": "John Doe", "phone": "+1 (555) 123-4567", "email": "john@venue.com"}'
                  value={JSON.stringify(formData.contact_info, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value)
                      setFormData({ ...formData, contact_info: parsed })
                    } catch {
                      // Invalid JSON, ignore
                    }
                  }}
                  rows={4}
                />
              </div>

              <div className="space-y-4">
                <Label>Policiess</Label>
                <Textarea
                  placeholder='{"cancellation": "48 hours notice required", "setup": "2 hours before event", "catering": "External catering allowed"}'
                  value={JSON.stringify(formData.policies, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value)
                      setFormData({ ...formData, policies: parsed })
                    } catch {
                      // Invalid JSON, ignore
                    }
                  }}
                  rows={6}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between gap-4 pt-4">
            <div className="flex gap-2">
              {activeTab !== "basic" && (
                <Button
                  variant="outline"
                  onClick={() => {
                    const tabs = ["basic", "details", "images", "amenities", "contact"]
                    const currentIndex = tabs.indexOf(activeTab)
                    if (currentIndex > 0) {
                      setActiveTab(tabs[currentIndex - 1])
                    }
                  }}
                >
                  Previous
                </Button>
              )}
              {activeTab !== "contact" && (
                <Button
                  variant="outline"
                  onClick={() => {
                    const tabs = ["basic", "details", "images", "amenities", "contact"]
                    const currentIndex = tabs.indexOf(activeTab)
                    if (currentIndex < tabs.length - 1) {
                      setActiveTab(tabs[currentIndex + 1])
                    }
                  }}
                >
                  Next
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving} className="bg-[#005687] hover:bg-[#00405a]">
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {editingSpace ? "Update Space" : "Create Space"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Manager Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Images for {editingSpace?.name}</DialogTitle>
            <DialogDescription>Upload, arrange, and delete images for this space</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <ImageUpload onImageUploaded={handleImageManagerUpload} className="mb-4" />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Current Images</Label>
                <span className="text-sm text-gray-500">
                  {currentImages.length} image{currentImages.length !== 1 ? "s" : ""}
                </span>
              </div>

              {currentImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {currentImages.map((image, index) => (
                    <Card key={index} className="relative overflow-hidden">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Space image ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => handleImageManagerRemove(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      {index === 0 && <Badge className="absolute bottom-2 left-2 bg-[#005687]">Primary Image</Badge>}
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border rounded-lg border-dashed">
                  <ImageIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">No images uploaded yet</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button variant="outline" onClick={() => setIsImageDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleImageManagerSave}
                disabled={isSaving}
                className="bg-[#005687] hover:bg-[#00405a]"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Images"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
