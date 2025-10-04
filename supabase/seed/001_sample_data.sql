-- Sample data for development and demo purposes

-- Insert sample users (real estate agents)
INSERT INTO users (id, email, full_name, phone, company_name, license_number) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'sarah.johnson@example.com', 'Sarah Johnson', '+1-555-0101', 'Premier Realty Group', 'CA-123456'),
  ('550e8400-e29b-41d4-a716-446655440002', 'mike.chen@example.com', 'Mike Chen', '+1-555-0102', 'Elite Properties', 'CA-789012'),
  ('550e8400-e29b-41d4-a716-446655440003', 'jessica.martinez@example.com', 'Jessica Martinez', '+1-555-0103', 'Sunset Real Estate', 'CA-345678');

-- Insert sample properties
INSERT INTO properties (user_id, title, description, address, city, state, zip_code, price, property_type, bedrooms, bathrooms, square_feet, year_built, features) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Modern Downtown Condo', 'Beautiful modern condo in the heart of downtown with city views and premium amenities.', '123 Main St, Unit 4B', 'San Francisco', 'CA', '94102', 850000.00, 'condo'::property_type, 2, 2.0, 1200, 2020, ARRAY['City Views', 'Modern Kitchen', 'In-Unit Laundry', 'Concierge', 'Gym']),
  ('550e8400-e29b-41d4-a716-446655440001', 'Family Home with Garden', 'Spacious family home with a beautiful garden, perfect for families with children.', '456 Oak Avenue', 'San Francisco', 'CA', '94110', 1200000.00, 'single_family'::property_type, 4, 3.0, 2500, 2015, ARRAY['Large Garden', 'Updated Kitchen', 'Hardwood Floors', 'Two-Car Garage', 'Near Schools']),
  ('550e8400-e29b-41d4-a716-446655440002', 'Luxury Penthouse', 'Stunning penthouse with panoramic ocean views and premium finishes throughout.', '789 Ocean Drive, Penthouse', 'Los Angeles', 'CA', '90210', 2500000.00, 'condo'::property_type, 3, 3.5, 2800, 2022, ARRAY['Ocean Views', 'Private Terrace', 'Wine Cellar', 'Smart Home', 'Valet Parking']),
  ('550e8400-e29b-41d4-a716-446655440002', 'Charming Townhouse', 'Beautiful townhouse in a quiet neighborhood with modern updates and great location.', '321 Pine Street', 'Los Angeles', 'CA', '90028', 750000.00, 'townhouse'::property_type, 3, 2.5, 1800, 2018, ARRAY['Modern Updates', 'Private Patio', 'Near Metro', 'Updated Bathrooms', 'Open Floor Plan']),
  ('550e8400-e29b-41d4-a716-446655440003', 'Beachfront Villa', 'Exclusive beachfront villa with direct beach access and luxury amenities.', '555 Beach Road', 'Malibu', 'CA', '90265', 4500000.00, 'single_family'::property_type, 5, 4.5, 4000, 2021, ARRAY['Beach Access', 'Infinity Pool', 'Home Theater', 'Chef Kitchen', 'Guest House']);

-- Insert sample leads with specific IDs
INSERT INTO leads (id, user_id, first_name, last_name, email, phone, budget_min, budget_max, preferred_locations, property_types, transaction_type, bedrooms_min, bedrooms_max, bathrooms_min, bathrooms_max, move_in_date, status, source) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'John', 'Smith', 'john.smith@email.com', '+1-555-1001', 800000.00, 1000000.00, ARRAY['San Francisco', 'Oakland'], ARRAY['condo'::property_type, 'single_family'::property_type], 'buy'::transaction_type, 2, 3, 2.0, 3.0, '2024-06-01', 'new'::lead_status, 'website_chat'::lead_source),
  ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Emily', 'Davis', 'emily.davis@email.com', '+1-555-1002', 3000.00, 4000.00, ARRAY['San Francisco'], ARRAY['condo'::property_type, 'apartment'::property_type], 'rent'::transaction_type, 1, 2, 1.0, 2.0, '2024-04-15', 'contacted'::lead_status, 'whatsapp'::lead_source),
  ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Robert', 'Wilson', 'robert.wilson@email.com', '+1-555-1003', 2000000.00, 3000000.00, ARRAY['Los Angeles', 'Beverly Hills'], ARRAY['single_family'::property_type, 'condo'::property_type], 'buy'::transaction_type, 3, 5, 3.0, 4.0, '2024-08-01', 'qualified'::lead_status, 'phone'::lead_source),
  ('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'Lisa', 'Brown', 'lisa.brown@email.com', '+1-555-1004', 5000.00, 7000.00, ARRAY['Los Angeles'], ARRAY['condo'::property_type, 'townhouse'::property_type], 'rent'::transaction_type, 2, 3, 2.0, 3.0, '2024-05-01', 'site_visit'::lead_status, 'email'::lead_source),
  ('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440003', 'David', 'Miller', 'david.miller@email.com', '+1-555-1005', 4000000.00, 5000000.00, ARRAY['Malibu', 'Santa Monica'], ARRAY['single_family'::property_type], 'buy'::transaction_type, 4, 6, 4.0, 5.0, '2024-09-01', 'negotiation'::lead_status, 'referral'::lead_source);

-- Insert sample lead interactions
INSERT INTO lead_interactions (lead_id, user_id, interaction_type, content, direction) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'chat', 'Hi! I''m looking for a condo in San Francisco with a budget around $800k-$1M. I need at least 2 bedrooms and 2 bathrooms.', 'inbound'),
  ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'chat', 'Great! I have some excellent options for you. Let me show you a few properties that match your criteria.', 'outbound'),
  ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'whatsapp', 'Hi Sarah, I saw your listing for the downtown condo. Is it still available?', 'inbound'),
  ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'whatsapp', 'Yes! It''s still available. Would you like to schedule a viewing?', 'outbound'),
  ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'call', 'Discussed luxury property requirements and budget. Client is very interested in penthouse options.', 'outbound');

-- Insert sample follow-ups
INSERT INTO lead_follow_ups (lead_id, user_id, scheduled_at, follow_up_type, notes) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '2024-03-15 10:00:00+00', 'call', 'Follow up on condo viewing interest'),
  ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '2024-03-16 14:00:00+00', 'site_visit', 'Property viewing at downtown condo'),
  ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '2024-03-17 11:00:00+00', 'email', 'Send luxury property portfolio'),
  ('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', '2024-03-18 15:30:00+00', 'call', 'Discuss rental application process'),
  ('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440003', '2024-03-19 09:00:00+00', 'site_visit', 'Beachfront villa private showing');
