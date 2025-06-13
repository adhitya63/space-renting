import { notFound } from "next/navigation"
import { SpaceDetail } from "@/components/space-detail"

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

export default async function SpacePage({ params }: PageProps) {
  const space = await getSpace(params.id)

  if (!space) {
    notFound()
  }

  return <SpaceDetail space={space} />
}
