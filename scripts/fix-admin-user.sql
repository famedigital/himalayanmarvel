-- Check admin user status
SELECT
  id,
  email,
  email_confirmed_at,
  raw_app_meta_data,
  created_at,
  updated_at,
  is_active
FROM auth.users
WHERE email = 'admin@himalayanmarvels.com';

-- If email is not confirmed, confirm it
UPDATE auth.users
SET
  email_confirmed_at = NOW(),
  is_active = true,
  raw_app_meta_data = '{"role": "admin"}'
WHERE email = 'admin@himalayanmarvels.com';

-- Reset password to Admin@123
UPDATE auth.users
SET
  encrypted_password = crypt('Admin@123', gen_salt('bf')),
  updated_at = NOW()
WHERE email = 'admin@himalayanmarvels.com';

-- Verify the update
SELECT
  email,
  email_confirmed_at,
  is_active,
  raw_app_meta_data
FROM auth.users
WHERE email = 'admin@himalayanmarvels.com';
