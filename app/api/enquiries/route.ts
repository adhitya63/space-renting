import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { sendEnquiryEmails } from "@/lib/email/enquiry-emails"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const enquiryData = await request.json()

    // Validate required fields
    const requiredFields = ["name", "email", "phone", "space_id", "space_name", "event_type", "expected_attendees"]
    for (const field of requiredFields) {
      if (!enquiryData[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    // Insert enquiry into database
    const { data: enquiry, error: insertError } = await supabase
      .from("space_enquiries")
      .insert([
        {
          name: enquiryData.name,
          email: enquiryData.email,
          phone: enquiryData.phone,
          company: enquiryData.company,
          space_id: enquiryData.space_id,
          space_name: enquiryData.space_name,
          event_type: enquiryData.event_type,
          event_date: enquiryData.event_date,
          duration: enquiryData.duration,
          expected_attendees: enquiryData.expected_attendees,
          budget_range: enquiryData.budget,
          requirements: enquiryData.requirements,
          additional_services: enquiryData.additional_services || [],
          status: "pending",
        },
      ])
      .select()
      .single()

    if (insertError) {
      console.error("Database insert error:", insertError)
      console.log("foo")
      console.log("Enquiry data:", insertError)
      return NextResponse.json({ error: "Failed to save enquiry" }, { status: 500 })
    }

    // Get space details for email
    const { data: space, error: spaceError } = await supabase
      .from("spaces")
      .select("*")
      .eq("id", enquiryData.space_id)
      .single()

    if (spaceError) {
      console.error("Space fetch error:", spaceError)
      // Continue without space details
    }

    // Send emails
    try {
      await sendEnquiryEmails({
        enquiry: {
          ...enquiry,
          space_details: space,
        },
        space,
      })
    } catch (emailError) {
      console.error("Email sending error:", emailError)
      // Don't fail the request if email fails, but log it
    }

    return NextResponse.json({
      success: true,
      message: "Enquiry submitted successfully",
      enquiry,
    })
  } catch (error) {
    console.error("Enquiry submission error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    let query = supabase.from("space_enquiries").select("*").order("created_at", { ascending: false }).limit(limit)

    if (status) {
      query = query.eq("status", status)
    }

    const { data: enquiries, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ enquiries })
  } catch (error) {
    console.error("Error fetching enquiries:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
