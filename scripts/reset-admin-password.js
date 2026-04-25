// Reset admin password using Supabase Management API
// Run with: node scripts/reset-admin-password.js

const SUPABASE_URL = 'https://zjskswendtlgxpkfavko.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpqc2tzd2VuZHRsZ3hwa2ZhdmtvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjI3NzI0NSwiZXhwIjoyMDkxODUzMjQ1fQ.I5Yu_U0NiRBKvNopR5MW29X45tR9W_hmXJjaiOKEQLU';

const ADMIN_EMAIL = 'admin@himalayanmarvels.com';
const NEW_PASSWORD = 'Admin@123';

async function resetPassword() {
  try {
    // Get user by email
    const getUsersResponse = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY
      }
    });

    const usersData = await getUsersResponse.json();
    console.log('Users response:', JSON.stringify(usersData, null, 2));

    // Handle different response formats
    const users = usersData.users || usersData || [];
    const adminUser = users.find(u => u.email === ADMIN_EMAIL);

    if (!adminUser) {
      console.log('User not found. Creating new user...');

      // Create user
      const createResponse = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'apikey': SERVICE_ROLE_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: ADMIN_EMAIL,
          password: NEW_PASSWORD,
          email_confirm: true,
          user_metadata: { role: 'admin' },
          app_metadata: { role: 'admin' }
        })
      });

      if (createResponse.ok) {
        console.log('✓ User created successfully!');
        console.log(`  Email: ${ADMIN_EMAIL}`);
        console.log(`  Password: ${NEW_PASSWORD}`);
      } else {
        const error = await createResponse.text();
        console.error('Failed to create user:', error);
      }
    } else {
      console.log('User found. Updating password and confirming email...');

      // Update user
      const updateResponse = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${adminUser.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'apikey': SERVICE_ROLE_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email_confirm: true,
          password: NEW_PASSWORD,
          app_metadata: { role: 'admin' }
        })
      });

      if (updateResponse.ok) {
        console.log('✓ User updated successfully!');
        console.log(`  Email: ${ADMIN_EMAIL}`);
        console.log(`  Password: ${NEW_PASSWORD}`);
      } else {
        const error = await updateResponse.text();
        console.error('Failed to update user:', error);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

resetPassword();
