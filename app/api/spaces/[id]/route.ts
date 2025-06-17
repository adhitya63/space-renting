import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

type Params = {
  id: string,
};


export async function GET(request: NextRequest, context: any) {
  const id = context.params.id


  try {
    const supabase = await createServerClient()

    const { data: space, error } = await supabase.from("spaces").select("*").eq("id", id).single()

    if (error || !space) {
      return NextResponse.json({ error: error?.message || "Not found" }, { status: 404 })
    }

    const transformedSpace = {
      id: space.id,
      name: space.name,
      location: space.location,
      address: space.address,
      capacity: space.capacity,
      price: `$${space.price_per_day * 7}/week`,
      price_per_day: space.price_per_day,
      images: space.images || [],
      description: space.description,
      detailedDescription: space.detailed_description,
      amenities: space.amenities || [],
      date_availability: space.date_availability || [],
      features: space.features || [],
      detailedAmenities: space.detailed_amenities || {},
      floorPlan: space.floor_plan_url,
      policies: space.policies || {},
      contact: space.contact_info || {},
      isActive: space.is_active,
      createdAt: space.created_at,
      updatedAt: space.updated_at,
      event_space_length: space.event_space_length || 0,
      event_space_width: space.event_space_width || 0,
      staff_capacity_min: space.staff_capacity_min || 0,
      staff_capacity_max: space.staff_capacity_max || 0,
    }
    console.log("Transformed Space:", transformedSpace)
    return NextResponse.json({ space: transformedSpace })
  } catch (error) {
    console.error("Error fetching space:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, context: any) {
  const id = context.params.id

  try {
    const supabase = await createServerClient()

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
    console.log("Space Data to Update:", spaceData)
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
        date_availability: spaceData.date_availability,
        features: spaceData.features,
        detailed_amenities: spaceData.detailed_amenities,
        images: spaceData.images,
        floor_plan_url: spaceData.floor_plan_url,
        policies: spaceData.policies,
        contact_info: spaceData.contact_info,
        is_active: spaceData.is_active,
        event_space_length: spaceData.event_space_length,
        event_space_width: spaceData.event_space_width,
        staff_capacity_min: spaceData.staff_capacity_min,
        staff_capacity_max: spaceData.staff_capacity_max,
      })
      .eq("id", id)
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

export async function DELETE(request: NextRequest, context: any) {
  const id = context.params.id

  try {
    const supabase = await createServerClient()

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

    const { error } = await supabase.from("spaces").delete().eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: "Space deleted successfully" })
  } catch (error) {
    console.error("Error deleting space:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
