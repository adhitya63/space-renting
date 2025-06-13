import { Body, Container, Head, Heading, Html, Preview, Section, Text, Hr, Row, Column } from "@react-email/components"

// Define additional services mapping for display
const additionalServicesMap: Record<string, string> = {
  logistics: "Logistics Support",
  manpower: "Manpower Solutions",
  "av-equipment": "AV Equipment",
  catering: "Catering Services",
  marketing: "Marketing Support",
}

interface AdminEnquiryNotificationProps {
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

export function AdminEnquiryNotification({ enquiry, space }: AdminEnquiryNotificationProps) {
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
      <Preview>
        New enquiry for {enquiry.space_name} from {enquiry.name}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>🏢 New Space Enquiry</Heading>

          <Text style={text}>
            You have received a new enquiry for <strong>{enquiry.space_name}</strong>.
          </Text>

          <Section style={section}>
            <Heading style={h2}>Contact Information</Heading>
            <Row>
              <Column>
                <Text style={label}>Name:</Text>
                <Text style={value}>{enquiry.name}</Text>
              </Column>
              <Column>
                <Text style={label}>Email:</Text>
                <Text style={value}>{enquiry.email}</Text>
              </Column>
            </Row>
            <Row>
              <Column>
                <Text style={label}>Phone:</Text>
                <Text style={value}>{enquiry.phone}</Text>
              </Column>
              <Column>
                <Text style={label}>Company:</Text>
                <Text style={value}>{enquiry.company || "Not provided"}</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Heading style={h2}>Event Details</Heading>
            <Row>
              <Column>
                <Text style={label}>Event Type:</Text>
                <Text style={value}>{enquiry.event_type}</Text>
              </Column>
              <Column>
                <Text style={label}>Expected Attendees:</Text>
                <Text style={value}>{enquiry.expected_attendees}</Text>
              </Column>
            </Row>
            <Row>
              <Column>
                <Text style={label}>Event Date:</Text>
                <Text style={value}>{enquiry.event_date ? formatDate(enquiry.event_date) : "Not specified"}</Text>
              </Column>
              <Column>
                <Text style={label}>Duration:</Text>
                <Text style={value}>{enquiry.duration || "Not specified"}</Text>
              </Column>
            </Row>
            <Row>
              <Column>
                <Text style={label}>Budget Range:</Text>
                <Text style={value}>{enquiry.budget_range || "Not specified"}</Text>
              </Column>
            </Row>
          </Section>

          {/* Additional Services Section */}
          {enquiry.additional_services && enquiry.additional_services.length > 0 && (
            <>
              <Hr style={hr} />
              <Section style={section}>
                <Heading style={h2}>Additional Services Requested</Heading>
                <Text style={value}>
                  {enquiry.additional_services.map((serviceId) => (
                    <div key={serviceId} style={{ marginBottom: "8px" }}>
                      • {additionalServicesMap[serviceId] || serviceId}
                    </div>
                  ))}
                </Text>
              </Section>
            </>
          )}

          {enquiry.requirements && (
            <>
              <Hr style={hr} />
              <Section style={section}>
                <Heading style={h2}>Special Requirements</Heading>
                <Text style={value}>{enquiry.requirements}</Text>
              </Section>
            </>
          )}

          <Hr style={hr} />

          <Section style={section}>
            <Text style={text}>
              <strong>Enquiry ID:</strong> {enquiry.id}
              <br />
              <strong>Submitted:</strong> {formatDate(enquiry.created_at)}
            </Text>
          </Section>

          <Section style={section}>
            <Text style={text}>
              Please respond to this enquiry within 24 hours to maintain our excellent customer service standards.
            </Text>
          </Section>
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
