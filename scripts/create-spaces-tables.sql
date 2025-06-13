-- Create spaces table for storing venue information
CREATE TABLE IF NOT EXISTS spaces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  price_per_day DECIMAL(10,2) NOT NULL,
  description TEXT,
  detailed_description TEXT,
  amenities JSONB DEFAULT '[]',
  features JSONB DEFAULT '[]',
  detailed_amenities JSONB DEFAULT '{}',
  images JSONB DEFAULT '[]',
  floor_plan_url TEXT,
  policies JSONB DEFAULT '{}',
  contact_info JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create spaces_images table for managing space images
CREATE TABLE IF NOT EXISTS spaces_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  space_id UUID REFERENCES spaces(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text VARCHAR(255),
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_spaces_is_active ON spaces(is_active);
CREATE INDEX IF NOT EXISTS idx_spaces_capacity ON spaces(capacity);
CREATE INDEX IF NOT EXISTS idx_spaces_price ON spaces(price_per_day);
CREATE INDEX IF NOT EXISTS idx_spaces_images_space_id ON spaces_images(space_id);
CREATE INDEX IF NOT EXISTS idx_spaces_images_primary ON spaces_images(is_primary);

-- Enable Row Level Security
ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE spaces_images ENABLE ROW LEVEL SECURITY;

-- Create policies for spaces table
CREATE POLICY "Anyone can view active spaces" ON spaces
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can view all spaces" ON spaces
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can insert spaces" ON spaces
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update spaces" ON spaces
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete spaces" ON spaces
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- Create policies for spaces_images table
CREATE POLICY "Anyone can view space images" ON spaces_images
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage space images" ON spaces_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_spaces_updated_at 
    BEFORE UPDATE ON spaces 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
