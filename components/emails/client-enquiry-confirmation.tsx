import { Body, Container, Head, Heading, Html, Preview, Section, Text, Hr, Row, Column } from "@react-email/components"

// Define additional services mapping for display
const additionalServicesMap: Record<string, string> = {
  logistics: "Logistics Support",
  manpower: "Manpower Solutions",
  "av-equipment": "AV Equipment",
  catering: "Catering Services",
  marketing: "Marketing Support",
}

interface ClientEnquiryConfirmationProps {
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
    additional_services?: string[]
    created_at: string
  }
  space?: any
}

export function ClientEnquiryConfirmation({ enquiry, space }: ClientEnquiryConfirmationProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Html>
      <Head />
      <Preview>Your enquiry for {enquiry.space_name} has been received</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>✅ Enquiry Confirmation</Heading>

          <Text style={text}>Dear {enquiry.name},</Text>

          <Text style={text}>
            Thank you for your enquiry regarding <strong>{enquiry.space_name}</strong>. We have received your request
            and our team will review it shortly.
          </Text>

          <Section style={section}>
            <Heading style={h2}>Your Enquiry Details</Heading>
            <Row>
              <Column>
                <Text style={label}>Space:</Text>
                <Text style={value}>{enquiry.space_name}</Text>
              </Column>
              <Column>
                <Text style={label}>Event Type:</Text>
                <Text style={value}>{enquiry.event_type}</Text>
              </Column>
            </Row>
            <Row>
              <Column>
                <Text style={label}>Expected Attendees:</Text>
                <Text style={value}>{enquiry.expected_attendees}</Text>
              </Column>
              <Column>
                <Text style={label}>Event Date:</Text>
                <Text style={value}>{enquiry.event_date ? formatDate(enquiry.event_date) : "Not specified"}</Text>
              </Column>
            </Row>
            {enquiry.duration && (
              <Row>
                <Column>
                  <Text style={label}>Duration:</Text>
                  <Text style={value}>{enquiry.duration}</Text>
                </Column>
                <Column>
                  <Text style={label}>Budget Range:</Text>
                  <Text style={value}>{enquiry.budget_range || "Not specified"}</Text>
                </Column>
              </Row>
            )}
          </Section>

          {/* Additional Services Section */}
          {enquiry.additional_services && enquiry.additional_services.length > 0 && (
            <>
              <Hr style={hr} />
              <Section style={section}>
                <Heading style={h2}>Additional Services Requested</Heading>
                <Text style={value}>
                  You've expressed interest in the following additional services:
                  {enquiry.additional_services.map((serviceId) => (
                    <div key={serviceId} style={{ marginBottom: "8px", marginTop: "8px" }}>
                      • {additionalServicesMap[serviceId] || serviceId}
                    </div>
                  ))}
                </Text>
                <Text style={text}>Our team will include information about these services in our proposal to you.</Text>
              </Section>
            </>
          )}

          {enquiry.requirements && (
            <>
              <Hr style={hr} />
              <Section style={section}>
                <Heading style={h2}>Your Requirements</Heading>
                <Text style={value}>{enquiry.requirements}</Text>
              </Section>
            </>
          )}

          <Hr style={hr} />

          <Section style={section}>
            <Heading style={h2}>What Happens Next?</Heading>
            <Text style={text}>
              • Our team will review your enquiry within <strong>2 hours</strong> during business hours
              <br />• We'll check availability for your preferred date
              <br />• You'll receive a detailed proposal with pricing and terms
              <br />• We'll schedule a call to discuss your specific requirements
            </Text>
          </Section>

          <Section style={section}>
            <Heading style={h2}>Need Immediate Assistance?</Heading>
            <Text style={text}>
              If you have urgent questions or need to speak with someone immediately, please contact us:
            </Text>
            <Text style={text}>
              📞 <strong>Phone:</strong> +1 (555) 123-4567
              <br />📧 <strong>Email:</strong> info@roadshowspaces.com
              <br />🕒 <strong>Business Hours:</strong> Monday - Friday, 9AM - 6PM
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Text style={text}>
              <strong>Enquiry Reference:</strong> #{enquiry.id.slice(0, 8).toUpperCase()}
              <br />
              <strong>Submitted:</strong> {formatDate(enquiry.created_at)}
            </Text>
          </Section>

          <Text style={text}>
            Thank you for choosing Roadshow Spaces. We look forward to helping you create an exceptional event!
          </Text>

          <Text style={text}>
            Best regards,
            <br />
            The Roadshow Spaces Team
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
}

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
  textAlign: "center" as const,
}

const h2 = {
  color: "#333",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "30px 0 15px",
}

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "16px 0",
}

const label = {
  color: "#666",
  fontSize: "14px",
  fontWeight: "bold",
  margin: "0 0 4px",
}

const value = {
  color: "#333",
  fontSize: "16px",
  margin: "0 0 16px",
}

const section = {
  padding: "24px",
  border: "solid 1px #dedede",
  borderRadius: "5px",
  margin: "20px 0",
}

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
}
