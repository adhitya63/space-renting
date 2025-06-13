-- Insert a sample admin user (you'll need to create this user in Supabase Auth first)
-- Replace 'your-user-id-here' with the actual UUID from auth.users table

INSERT INTO admin_users (user_id, name, role) 
VALUES (
  '9e2a6330-30d9-47be-bb7c-775a416578b3', -- Replace with actual user ID from Supabase Auth
  'Admin User',
  'super_admin'
) ON CONFLICT (user_id) DO NOTHING;

-- Insert some sample enquiries for testing
INSERT INTO space_enquiries (
  name, email, phone, company, space_id, space_name, 
  event_type, event_date, duration, expected_attendees, 
  budget_range, requirements, status
) VALUES 
(
  'John Smith', 'john@company.com', '+1 (555) 123-4567', 'Tech Corp',
  1, 'Grand Convention Center', 'Corporate Event', '2024-02-15',
  'full-day', 250, '2500-5000', 'Need AV equipment and catering', 'pending'
),
(
  'Sarah Johnson', 'sarah@startup.com', '+1 (555) 234-5678', 'Innovation Labs',
  2, 'Modern Exhibition Hall', 'Product Launch', '2024-02-20',
  'half-day', 150, '1000-2500', 'Require LED wall displays', 'confirmed'
),
(
  'Michael Chen', 'michael@techcorp.com', '+1 (555) 345-6789', 'Future Systems',
  4, 'Skyline Conference Center', 'Conference', '2024-03-01',
  '2-days', 300, '5000-10000', 'Multi-day conference with breakout rooms', 'pending'
);
