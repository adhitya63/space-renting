import { Resend } from "resend"
import { AdminEnquiryNotification } from "@/components/emails/admin-enquiry-notification"
import { ClientEnquiryConfirmation } from "@/components/emails/client-enquiry-confirmation"

// Initialize Resend (you'll add the API key later)
const resend = new Resend(process.env.RESEND_API_KEY || "")

interface EnquiryEmailData {
  enquiry: {
    id: string
    name: string
    email: string
    phone: string
    company?: string
    space_name: string
    event_type: string
    event_date?: string
    duration?: string
    expected_attendees: number
    budget_range?: string
    requirements?: string
    created_at: string
    space_details?: any
  }
  space?: any
}

export async function sendEnquiryEmails({ enquiry, space }: EnquiryEmailData) {
  const results = {
    adminEmail: null as any,
    clientEmail: null as any,
    errors: [] as string[],
  }

  // Check if Resend is configured
  if (!process.env.RESEND_API_KEY) {
    console.log("📧 Email functionality disabled - RESEND_API_KEY not configured")
    console.log("📧 Would send emails for enquiry:", enquiry.id)
    return results
  }

  try {
    // Send admin notification email
    const adminEmail = await resend.emails.send({
      from: process.env.FROM_EMAIL || "noreply@roadshowspaces.com",
      to: [process.env.ADMIN_EMAIL || "admin@roadshowspaces.com"],
      subject: `New Space Enquiry - ${enquiry.space_name}`,
      react: AdminEnquiryNotification({ enquiry, space }),
    })


    results.adminEmail = adminEmail

    // Send client confirmation email
    const clientEmail = await resend.emails.send({
      from: process.env.FROM_EMAIL || "noreply@roadshowspaces.com",
      to: [enquiry.email],
      subject: `Enquiry Confirmation - ${enquiry.space_name}`,
      react: ClientEnquiryConfirmation({ enquiry, space }),
    })

    console.log("Admin email response:", adminEmail);
    console.log("Client email response:", clientEmail);
    
    results.clientEmail = clientEmail

    console.log("📧 Emails sent successfully:", {
      adminEmailId: adminEmail.data?.id,
      clientEmailId: clientEmail.data?.id,
    })
  } catch (error) {
    console.error("📧 Email sending failed:", error)
    results.errors.push(error instanceof Error ? error.message : "Unknown email error")
    throw error
  }

  return results
}

// Fallback function for when email service is not configured
export function logEnquiryDetails(enquiry: any) {
  console.log("📧 EMAIL FUNCTIONALITY NOT CONFIGURED")
  console.log("📧 Add RESEND_API_KEY to environment variables to enable emails")
  console.log("📧 Enquiry details that would be emailed:")
  console.log("📧 =====================================")
  console.log(`📧 Name: ${enquiry.name}`)
  console.log(`📧 Email: ${enquiry.email}`)
  console.log(`📧 Phone: ${enquiry.phone}`)
  console.log(`📧 Space: ${enquiry.space_name}`)
  console.log(`📧 Event Type: ${enquiry.event_type}`)
  console.log(`📧 Attendees: ${enquiry.expected_attendees}`)
  console.log(`📧 Date: ${enquiry.event_date || "Not specified"}`)
  console.log("📧 =====================================")
}
