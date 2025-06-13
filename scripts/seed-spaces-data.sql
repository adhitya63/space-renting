-- Insert sample spaces data
INSERT INTO spaces (
  name, location, address, capacity, price_per_day, description, detailed_description,
  amenities, features, detailed_amenities, images, policies, contact_info
) VALUES 
(
  'Grand Convention Center',
  'Downtown Business District',
  '123 Convention Ave, Downtown District, City 12345',
  500,
  2500.00,
  'A premium convention center perfect for large-scale roadshows and corporate events.',
  'The Grand Convention Center stands as the premier venue for high-profile corporate events and roadshows. With its soaring ceilings, natural light, and flexible layout options, this space can be configured to meet your exact specifications.',
  '["High-speed WiFi", "Parking", "Catering", "AV Equipment", "Air Conditioning"]',
  '["Stage", "Sound System", "Lighting", "Green Rooms"]',
  '{
    "Technology": ["Fiber optic internet (1GB)", "Built-in AV system", "LED lighting controls", "Wireless presentation system", "Live streaming capability"],
    "Comfort": ["Climate control", "Ergonomic seating", "Natural lighting", "Sound insulation", "Air purification"],
    "Services": ["On-site catering", "Event coordination", "Security service", "Cleaning service", "Technical support"],
    "Facilities": ["Green rooms", "Storage areas", "Loading dock", "Coat check", "Reception area"]
  }',
  '["/placeholder.svg?height=600&width=800", "/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"]',
  '{
    "cancellation": "48 hours advance notice required for cancellation",
    "setup": "Setup available 2 hours before event start",
    "catering": "External catering allowed with prior approval",
    "alcohol": "Licensed bar service available",
    "smoking": "No smoking policy throughout the venue"
  }',
  '{
    "manager": "Sarah Johnson",
    "phone": "+1 (555) 123-4567",
    "email": "sarah@grandconvention.com"
  }'
),
(
  'Modern Exhibition Hall',
  'Tech Park Avenue',
  '456 Innovation Blvd, Tech Park, City 12346',
  300,
  1800.00,
  'Contemporary space with cutting-edge technology for innovative presentations.',
  'Located in the heart of the tech district, this modern exhibition hall represents the future of event spaces. With its minimalist design and advanced technology integration, it''s the perfect venue for product launches.',
  '["Ultra-fast WiFi", "Valet Parking", "Coffee Bar", "AV Support"]',
  '["LED Walls", "Wireless Mics", "Climate Control", "Breakout Rooms"]',
  '{
    "Technology": ["10GB fiber internet", "4K LED wall displays", "Wireless charging stations", "Smart lighting system", "IoT integration"],
    "Comfort": ["Precision climate control", "Modern furniture", "Acoustic panels", "Natural ventilation", "Ambient lighting"],
    "Services": ["Valet parking", "Concierge service", "Tech support", "Barista service", "Event planning"],
    "Facilities": ["Multiple breakout rooms", "Innovation lab", "Networking lounge", "Exhibition space", "Demo areas"]
  }',
  '["/placeholder.svg?height=600&width=800", "/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"]',
  '{
    "cancellation": "72 hours advance notice required",
    "setup": "Setup available 3 hours before event",
    "catering": "Preferred catering partners available",
    "alcohol": "Full bar service with sommelier",
    "smoking": "Designated outdoor smoking area"
  }',
  '{
    "manager": "Michael Chen",
    "phone": "+1 (555) 234-5678",
    "email": "michael@modernexhibition.com"
  }'
),
(
  'Heritage Auditorium',
  'Cultural Quarter',
  '789 Heritage St, Cultural Quarter, City 12347',
  200,
  1200.00,
  'Elegant historic venue combining classic architecture with modern facilities.',
  'Step into a piece of history at the Heritage Auditorium, where classical elegance meets modern functionality. This beautifully restored venue offers a unique atmosphere.',
  '["WiFi", "Street Parking", "Basic Catering", "Standard AV"]',
  '["Acoustic Design", "Traditional Stage", "Vintage Charm", "Photo Opportunities"]',
  '{
    "Technology": ["Standard WiFi", "Basic AV system", "Traditional lighting", "Sound reinforcement", "Microphone system"],
    "Comfort": ["Historic charm", "Original architecture", "Natural acoustics", "Period furnishings", "Classic ambiance"],
    "Services": ["Basic catering", "Event assistance", "Historical tours", "Photography services", "Parking coordination"],
    "Facilities": ["Traditional stage", "Balcony seating", "Foyer space", "Coat room", "Historic displays"]
  }',
  '["/placeholder.svg?height=600&width=800", "/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"]',
  '{
    "cancellation": "7 days advance notice required",
    "setup": "Limited setup time due to historic preservation",
    "catering": "Heritage-approved catering only",
    "alcohol": "Wine and champagne service available",
    "smoking": "No smoking - historic building"
  }',
  '{
    "manager": "Elizabeth Harper",
    "phone": "+1 (555) 345-6789",
    "email": "elizabeth@heritageauditorium.com"
  }'
);

-- Update space_enquiries to reference the new spaces table
ALTER TABLE space_enquiries 
ADD COLUMN IF NOT EXISTS space_uuid UUID REFERENCES spaces(id);

-- Update existing enquiries to link to spaces (optional, for existing data)
UPDATE space_enquiries 
SET space_uuid = (
  SELECT id FROM spaces 
  WHERE spaces.name = space_enquiries.space_name 
  LIMIT 1
)
WHERE space_uuid IS NULL;
