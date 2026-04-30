-- Run this in Supabase SQL Editor to check your user
SELECT 
  u.id,
  u.email,
  up.role,
  up.full_name
FROM auth.users u
LEFT JOIN user_profiles up ON u.id = up.id
ORDER BY u.created_at DESC
LIMIT 10;
