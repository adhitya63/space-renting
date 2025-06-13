"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, CheckCircle, Loader2, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

interface Space {
  id: string
  name: string
  location: string
  capacity: number
  price: string
}

interface EnquiryModalProps {
  space: Space | null
  isOpen: boolean
  onClose: () => void
}

// Define additional services
const additionalServices = [
  {
    id: "logistics",
    label: "Logistics Support",
    description: "Transportation, equipment handling, and setup assistance",
  },
  {
    id: "manpower",
    label: "Manpower Solutions",
    description: "Event staff, technical crew, and security personnel",
  },
  {
    id: "av-equipment",
    label: "AV Equipment",
    description: "Professional audio-visual equipment and technical support",
  },
  {
    id: "catering",
    label: "Catering Services",
    description: "Food and beverage options for your event",
  },
  {
    id: "marketing",
    label: "Marketing Support",
    description: "Promotional materials, digital marketing, and audience engagement",
  },
]

export function EnquiryModal({ space, isOpen, onClose }: EnquiryModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    eventType: "",
    expectedAttendees: "",
    eventDate: undefined as Date | undefined,
    duration: "",
    requirements: "",
    budget: "",
    additionalServices: [] as string[],
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          space_id: space?.id,
          space_name: space?.name,
          event_type: formData.eventType,
          event_date: formData.eventDate?.toISOString().split("T")[0],
          duration: formData.duration,
          expected_attendees: Number.parseInt(formData.expectedAttendees),
          budget: formData.budget,
          requirements: formData.requirements,
          additional_services: formData.additionalServices,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit enquiry")
      }

      setIsSubmitted(true)

      // Reset form after 3 seconds and close modal
      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          eventType: "",
          expectedAttendees: "",
          eventDate: undefined,
          duration: "",
          requirements: "",
          budget: "",
          additionalServices: [],
        })
        onClose()
      }, 4000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit enquiry")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleAdditionalService = (serviceId: string) => {
    setFormData((prev) => {
      const isSelected = prev.additionalServices.includes(serviceId)
      return {
        ...prev,
        additionalServices: isSelected
          ? prev.additionalServices.filter((id) => id !== serviceId)
          : [...prev.additionalServices, serviceId],
      }
    })
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
      // Reset form when closing
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          eventType: "",
          expectedAttendees: "",
          eventDate: undefined,
          duration: "",
          requirements: "",
          budget: "",
          additionalServices: [],
        })
        setError("")
        setIsSubmitted(false)
      }, 300)
    }
  }

  if (!space) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enquiry for {space.name}</DialogTitle>
          <DialogDescription>
            Fill out the form below and we'll get back to you within 24 hours with availability and pricing details.
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Enquiry Submitted Successfully!</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Thank you for your interest in {space.name}. We'll contact you within 24 hours.
            </p>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-sm text-green-800 dark:text-green-200">
                📧 Confirmation emails have been sent to both you and our team.
                <br />💬 You'll receive a detailed proposal shortly.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company/Organization</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eventType">Event Type *</Label>
                <Select
                  value={formData.eventType}
                  onValueChange={(value) => handleInputChange("eventType", value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="roadshow">Roadshow</SelectItem>
                    <SelectItem value="conference">Conference</SelectItem>
                    <SelectItem value="seminar">Seminar</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="product-launch">Product Launch</SelectItem>
                    <SelectItem value="corporate-event">Corporate Event</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="attendees">Expected Attendees *</Label>
                <Input
                  id="attendees"
                  type="number"
                  value={formData.expectedAttendees}
                  onChange={(e) => handleInputChange("expectedAttendees", e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Preferred Event Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      disabled={isSubmitting}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.eventDate ? format(formData.eventDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.eventDate}
                      onSelect={(date) => setFormData((prev) => ({ ...prev, eventDate: date }))}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Event Duration</Label>
                <Select
                  value={formData.duration}
                  onValueChange={(value) => handleInputChange("duration", value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="half-day">Half Day (4 hours)</SelectItem>
                    <SelectItem value="full-day">Full Day (8 hours)</SelectItem>
                    <SelectItem value="2-days">2 Days</SelectItem>
                    <SelectItem value="3-days">3 Days</SelectItem>
                    <SelectItem value="week">1 Week</SelectItem>
                    <SelectItem value="custom">Custom Duration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget Range</Label>
              <Select
                value={formData.budget}
                onValueChange={(value) => handleInputChange("budget", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-1000">Under $1,000</SelectItem>
                  <SelectItem value="1000-2500">$1,000 - $2,500</SelectItem>
                  <SelectItem value="2500-5000">$2,500 - $5,000</SelectItem>
                  <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                  <SelectItem value="over-10000">Over $10,000</SelectItem>
                  <SelectItem value="discuss">Prefer to discuss</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Additional Services Section */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Additional Services</Label>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Select any additional services you might be interested in:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {additionalServices.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-start space-x-2 p-3 rounded-md border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Checkbox
                      id={`service-${service.id}`}
                      checked={formData.additionalServices.includes(service.id)}
                      onCheckedChange={() => toggleAdditionalService(service.id)}
                      disabled={isSubmitting}
                      className="mt-1"
                    />
                    <div>
                      <Label htmlFor={`service-${service.id}`} className="font-medium">
                        {service.label}
                      </Label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{service.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="requirements">Special Requirements or Additional Information</Label>
              <Textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) => handleInputChange("requirements", e.target.value)}
                placeholder="Please describe any specific requirements, setup needs, catering preferences, AV equipment, accessibility needs, etc."
                rows={4}
                disabled={isSubmitting}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={handleClose} className="flex-1" disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1 bg-purple-600 hover:bg-purple-700">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Enquiry"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
