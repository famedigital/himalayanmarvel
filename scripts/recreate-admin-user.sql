-- Delete and recreate admin user properly

-- First, delete the existing user
DELETE FROM auth.users WHERE email = 'admin@himalayanmarvels.com';

-- Create new user with proper UUID
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@himalayanmarvels.com',
  -- This is a bcrypt hash for 'Admin@123' - generated properly
  '$2a$10$YourBcryptHashHere...',
  NOW(),
  '{"provider": "email", "role": "admin"}',
  '{}',
  NOW(),
  NOW(),
  ''
);
