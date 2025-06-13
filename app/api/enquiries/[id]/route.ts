import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, context: any) {
  const id = context.params.id

  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!adminUser) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 })
  }

  const { data: enquiry, error } = await supabase
    .from("space_enquiries")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  return NextResponse.json({ enquiry })
}
