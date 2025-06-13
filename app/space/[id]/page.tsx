import { notFound } from "next/navigation"
import { SpaceDetail } from "@/components/space-detail"
import { use } from "react"

interface PageProps {
  params: {
    id: string
  }
}

async function getSpace(id: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/spaces/${id}`, {
      cache: "no-store", // Ensure fresh data
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.space
  } catch (error) {
    console.error("Error fetching space:", error)
    return null
  }
}

export default async function SpacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const space = await getSpace(id)

  if (!space) {
    notFound()
  }

  return <SpaceDetail space={space} />
}
