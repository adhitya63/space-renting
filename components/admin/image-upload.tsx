"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, Upload, X, ImageIcon, AlertCircle, Cloud, HardDrive } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void
  className?: string
}

export function ImageUpload({ onImageUploaded, className = "" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [preview, setPreview] = useState<string | null>(null)
  const [uploadType, setUploadType] = useState<"cloud" | "placeholder" | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset state
    setError("")
    setSuccess("")
    setUploadType(null)
    setIsUploading(true)

    // Create a preview
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    try {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
      if (!allowedTypes.includes(file.type)) {
        throw new Error("Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.")
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        throw new Error("File size exceeds 5MB limit.")
      }

      // Create form data
      const formData = new FormData()
      formData.append("file", file)

      console.log("Uploading file:", file.name, "Size:", file.size, "Type:", file.type)

      // Upload the file
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload image")
      }

      // Determine upload type and show appropriate message
      if (data.message && data.message.includes("Digital Ocean Spaces")) {
        setUploadType("cloud")
        setSuccess("Image uploaded successfully to Digital Ocean Spaces!")
      } else {
        setUploadType("placeholder")
        setSuccess("Image processed (using placeholder - configure Digital Ocean Spaces for cloud storage)")
      }

      // Call the callback with the image URL
      onImageUploaded(data.url)

      // Clean up preview after a delay
      setTimeout(() => {
        URL.revokeObjectURL(objectUrl)
        setPreview(null)
        setSuccess("")
        setUploadType(null)
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image")
      // Remove preview on error
      setPreview(null)
      URL.revokeObjectURL(objectUrl)
    } finally {
      setIsUploading(false)
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleCancel = () => {
    if (preview) {
      URL.revokeObjectURL(preview)
    }
    setPreview(null)
    setError("")
    setSuccess("")
    setUploadType(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className={className}>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4 border-green-200 bg-green-50 text-green-800">
          <div className="flex items-center">
            {uploadType === "cloud" ? <Cloud className="h-4 w-4 mr-2" /> : <HardDrive className="h-4 w-4 mr-2" />}
            <AlertDescription>{success}</AlertDescription>
          </div>
        </Alert>
      )}

      {preview ? (
        <Card className="relative overflow-hidden">
          <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-48 object-cover" />
          {isUploading ? (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white">
                <Loader2 className="h-8 w-8 mx-auto animate-spin mb-2" />
                <p className="text-sm">Uploading image...</p>
                <p className="text-xs opacity-75">Processing your file</p>
              </div>
            </div>
          ) : (
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleCancel}
              type="button"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </Card>
      ) : (
        <Card className="border-dashed border-2 p-4 text-center hover:border-purple-300 transition-colors cursor-pointer">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            disabled={isUploading}
          />
          <div className="py-4" onClick={() => fileInputRef.current?.click()}>
            <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Click to upload an image</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">JPEG, PNG, WebP or GIF (max 5MB)</p>
          </div>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full hover:bg-purple-50 hover:border-purple-300"
            type="button"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? "Processing..." : "Choose File"}
          </Button>
        </Card>
      )}

      {/* Configuration hint */}
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
        💡 Configure Digital Ocean Spaces environment variables for cloud storage
      </div>
    </div>
  )
}
