  import { createServerClient } from "@/lib/supabase/server"
  import { type NextRequest, NextResponse } from "next/server"

  export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

      const { data: enquiry, error } = await supabase.from("space_enquiries").select("*").eq("id", params.id).single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 404 })
      }

      return NextResponse.json({ enquiry })
    } catch (error) {
      console.error("Error fetching enquiry:", error)
      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
  }

  export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

      const updateData = await request.json()

      const { data: enquiry, error } = await supabase
        .from("space_enquiries")
        .update({
          status: updateData.status,
          // Add other fields that can be updated
        })
        .eq("id", params.id)
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
