import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

// Force this API route to use Node.js runtime
export const runtime = "nodejs"

// Create AWS Signature Version 4 for Digital Ocean Spaces
function createSignature(
  method: string,
  url: string,
  headers: Record<string, string>,
  payload: Buffer,
  accessKey: string,
  secretKey: string,
  region: string,
) {
  const algorithm = "AWS4-HMAC-SHA256"
  const service = "s3"
  const date = new Date().toISOString().replace(/[:-]|\.\d{3}/g, "")
  const dateStamp = date.substr(0, 8)

  // Create canonical request
  const canonicalUri = new URL(url).pathname
  const canonicalQuerystring = ""
  const canonicalHeaders = Object.keys(headers)
    .sort()
    .map((key) => `${key.toLowerCase()}:${headers[key]}\n`)
    .join("")
  const signedHeaders = Object.keys(headers)
    .sort()
    .map((key) => key.toLowerCase())
    .join(";")

  const payloadHash = crypto.createHash("sha256").update(payload).digest("hex")

  const canonicalRequest = [
    method,
    canonicalUri,
    canonicalQuerystring,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n")

  // Create string to sign
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`
  const stringToSign = [
    algorithm,
    date,
    credentialScope,
    crypto.createHash("sha256").update(canonicalRequest).digest("hex"),
  ].join("\n")

  // Create signing key
  const kDate = crypto.createHmac("sha256", `AWS4${secretKey}`).update(dateStamp).digest()
  const kRegion = crypto.createHmac("sha256", kDate).update(region).digest()
  const kService = crypto.createHmac("sha256", kRegion).update(service).digest()
  const kSigning = crypto.createHmac("sha256", kService).update("aws4_request").digest()

  // Create signature
  const signature = crypto.createHmac("sha256", kSigning).update(stringToSign).digest("hex")

  // Create authorization header
  const authorization = `${algorithm} Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`

  return {
    authorization,
    date,
    payloadHash,
  }
}

async function uploadToDigitalOceanSpaces(
  buffer: Buffer,
  fileName: string,
  contentType: string,
): Promise<string | null> {
  const endpoint = process.env.DO_SPACES_ENDPOINT
  const region = process.env.DO_SPACES_REGION || "nyc3"
  const accessKeyId = process.env.DO_SPACES_ACCESS_KEY_ID
  const secretAccessKey = process.env.DO_SPACES_SECRET_ACCESS_KEY
  const bucketName = process.env.DO_SPACES_BUCKET_NAME || "roadshow-spaces"

  // Check if credentials are configured
  if (!endpoint || !accessKeyId || !secretAccessKey) {
    console.log("Digital Ocean Spaces credentials not configured")
    return null
  }

  try {
    const key = `spaces/${fileName}`
    const url = `${endpoint}/${bucketName}/${key}`

    // Prepare headers
    const headers: Record<string, string> = {
      "Content-Type": contentType,
      "Content-Length": buffer.length.toString(),
      "x-amz-acl": "public-read",
      Host: new URL(url).host,
    }

    // Create AWS signature
    const { authorization, date, payloadHash } = createSignature(
      "PUT",
      url,
      headers,
      buffer,
      accessKeyId,
      secretAccessKey,
      region,
    )

    // Add auth headers
    headers["Authorization"] = authorization
    headers["X-Amz-Date"] = date
    headers["X-Amz-Content-Sha256"] = payloadHash

    console.log("Uploading to:", url)

    // Make the HTTP request
    const response = await fetch(url, {
      method: "PUT",
      headers,
      body: buffer,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Upload failed:", response.status, errorText)
      return null
    }

    console.log("Upload successful to Digital Ocean Spaces")
    return url
  } catch (error) {
    console.error("Error uploading to Digital Ocean Spaces:", error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    // Check if user is admin
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: adminUser } = await supabase.from("admin_users").select("*").eq("user_id", user.id).single()

    if (!adminUser) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    // Parse the multipart form data
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed" },
        { status: 400 },
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size exceeds 5MB limit" }, { status: 400 })
    }

    // Generate a unique filename
    const fileExtension = file.name.split(".").pop()
    const randomName = crypto.randomBytes(16).toString("hex")
    const fileName = `${Date.now()}-${randomName}.${fileExtension}`

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    console.log("Processing file upload:", fileName, "Size:", buffer.length, "Type:", file.type)

    // Try to upload to Digital Ocean Spaces
    const fileUrl = await uploadToDigitalOceanSpaces(buffer, fileName, file.type)

    if (!fileUrl) {
      console.log("Digital Ocean Spaces upload failed or not configured, using placeholder")
      return NextResponse.json(
        {
          success: true,
          url: "/placeholder.svg?height=600&width=800",
          message: "Digital Ocean Spaces not configured - using placeholder",
        },
        { status: 200 },
      )
    }

    console.log("Upload successful:", fileUrl)

    return NextResponse.json({
      success: true,
      url: fileUrl,
      message: "File uploaded successfully to Digital Ocean Spaces",
    })
  } catch (error) {
    console.error("Error in upload API:", error)

    // Return placeholder on any error
    return NextResponse.json(
      {
        success: true,
        url: "/placeholder.svg?height=600&width=800",
        message: "Upload error - using placeholder",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 200 },
    )
  }
}
