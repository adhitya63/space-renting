import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const supabase = await createServerClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    if (data.user) {
      // Check if user has admin privileges
      const { data: adminUser, error: adminError } = await supabase
        .from("admin_users")
        .select("*")
        .eq("user_id", data.user.id)
        .single()

      if (adminError || !adminUser) {
        // Sign out the user if they don't have admin privileges
        await supabase.auth.signOut()
        return NextResponse.json({ error: "Access denied. Admin privileges required." }, { status: 403 })
      }

      return NextResponse.json({
        user: data.user,
        session: data.session,
        admin: adminUser,
      })
    }

    return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
