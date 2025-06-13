export function isSpacesConfigured(): boolean {
  return !!(
    process.env.DO_SPACES_ENDPOINT &&
    process.env.DO_SPACES_ACCESS_KEY_ID &&
    process.env.DO_SPACES_SECRET_ACCESS_KEY &&
    process.env.DO_SPACES_BUCKET_NAME
  )
}

/**
 * Get Digital Ocean Spaces configuration
 */
export function getSpacesConfig() {
  return {
    endpoint: process.env.DO_SPACES_ENDPOINT,
    region: process.env.DO_SPACES_REGION || "nyc3",
    accessKeyId: process.env.DO_SPACES_ACCESS_KEY_ID,
    secretAccessKey: process.env.DO_SPACES_SECRET_ACCESS_KEY,
    bucketName: process.env.DO_SPACES_BUCKET_NAME || "roadshow-spaces",
  }
}

/**
 * Extract key from Digital Ocean Spaces URL
 */
export function extractKeyFromUrl(fileUrl: string): string {
  const urlParts = fileUrl.split("/")
  return urlParts.slice(3).join("/")
}

/**
 * Build Digital Ocean Spaces URL
 */
export function buildSpacesUrl(bucketName: string, endpoint: string, key: string): string {
  const cleanEndpoint = endpoint.replace("https://", "")
  return `https://${bucketName}.${cleanEndpoint}/${key}`
}

/**
 * Generate a unique filename for uploads
 */
export function generateUniqueFileName(originalName: string): string {
  const crypto = require("crypto")
  const fileExtension = originalName.split(".").pop()
  const randomName = crypto.randomBytes(16).toString("hex")
  return `${Date.now()}-${randomName}.${fileExtension}`
}

/**
 * Validate file type for image uploads
 */
export function isValidImageType(mimeType: string): boolean {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
  return allowedTypes.includes(mimeType)
}

/**
 * Validate file size (max 5MB)
 */
export function isValidFileSize(size: number): boolean {
  const maxSize = 5 * 1024 * 1024 // 5MB
  return size <= maxSize
}
