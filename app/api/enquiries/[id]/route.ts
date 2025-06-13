import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

// For Next.js App Router, we need to use the correct parameter types
export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params
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

    const { data: enquiry, error } = await supabase.from("space_enquiries").select("*").eq("id", id).single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json({ enquiry })
  } catch (error) {
    console.error("Error fetching enquiry:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params
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

    const updateData = await request.json()

    const { data: enquiry, error } = await supabase
      .from("space_enquiries")
      .update({
        status: updateData.status,
        // Add other fields that can be updated
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ enquiry })
  } catch (error) {
    console.error("Error updating enquiry:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
