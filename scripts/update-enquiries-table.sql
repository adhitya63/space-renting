-- Add additional_services column to space_enquiries table
ALTER TABLE space_enquiries 
ADD COLUMN IF NOT EXISTS additional_services TEXT[] DEFAULT '{}';

-- Create index for better performance when querying by additional services
CREATE INDEX IF NOT EXISTS idx_space_enquiries_additional_services ON space_enquiries USING GIN (additional_services);

-- Comment on the column to document its purpose
COMMENT ON COLUMN space_enquiries.additional_services IS 'Array of additional service IDs requested by the client';
