-- Fix admin user - confirm email and reset password

-- Confirm email and set admin role
UPDATE auth.users
SET
  email_confirmed_at = NOW(),
  raw_app_meta_data = '{"role": "admin"}',
  updated_at = NOW()
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
  raw_app_meta_data,
  updated_at
FROM auth.users
WHERE email = 'admin@himalayanmarvels.com';
