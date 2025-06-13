import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createServerClient()

    const { data: space, error } = await supabase.from("spaces").select("*").eq("id", params.id).single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    // Transform the data to match the expected format
    const transformedSpace = {
      id: space.id,
      name: space.name,
      location: space.location,
      address: space.address,
      capacity: space.capacity,
      price: `$${space.price_per_day}/day`,
      price_per_day: space.price_per_day,
      images: space.images || [],
      description: space.description,
      detailedDescription: space.detailed_description,
      amenities: space.amenities || [],
      features: space.features || [],
      detailedAmenities: space.detailed_amenities || {},
      floorPlan: space.floor_plan_url,
      policies: space.policies || {},
      contact: space.contact_info || {},
      isActive: space.is_active,
      createdAt: space.created_at,
      updatedAt: space.updated_at,
    }

    return NextResponse.json({ space: transformedSpace })
  } catch (error) {
    console.error("Error fetching space:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
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

    const spaceData = await request.json()

    const { data: space, error } = await supabase
      .from("spaces")
      .update({
        name: spaceData.name,
        location: spaceData.location,
        address: spaceData.address,
        capacity: spaceData.capacity,
        price_per_day: spaceData.price_per_day,
        description: spaceData.description,
        detailed_description: spaceData.detailed_description,
        amenities: spaceData.amenities,
        features: spaceData.features,
        detailed_amenities: spaceData.detailed_amenities,
        images: spaceData.images,
        floor_plan_url: spaceData.floor_plan_url,
        policies: spaceData.policies,
        contact_info: spaceData.contact_info,
        is_active: spaceData.is_active,
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ space })
  } catch (error) {
    console.error("Error updating space:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    const { error } = await supabase.from("spaces").delete().eq("id", params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: "Space deleted successfully" })
  } catch (error) {
    console.error("Error deleting space:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
