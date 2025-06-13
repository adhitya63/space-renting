-- Create admin_users table for managing admin access
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create space_enquiries table for storing enquiry data
CREATE TABLE IF NOT EXISTS space_enquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  space_id INTEGER NOT NULL,
  space_name VARCHAR(255) NOT NULL,
  event_type VARCHAR(100),
  event_date DATE,
  duration VARCHAR(50),
  expected_attendees INTEGER,
  budget_range VARCHAR(50),
  requirements TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE admin_users
ADD CONSTRAINT unique_user_id UNIQUE (user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_space_enquiries_status ON space_enquiries(status);
CREATE INDEX IF NOT EXISTS idx_space_enquiries_created_at ON space_enquiries(created_at);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE space_enquiries ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_users table
CREATE POLICY "Admin users can view their own record" ON admin_users
  FOR SELECT USING (auth.uid() = user_id);

-- Create policies for space_enquiries table
CREATE POLICY "Admins can view all enquiries" ON space_enquiries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert enquiries" ON space_enquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update enquiries" ON space_enquiries
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid()
    )
  );
