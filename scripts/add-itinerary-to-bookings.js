// Run this script with: node scripts/add-itinerary-to-bookings.js
const { createClient } = require('@supabase/supabase-js');

// Load env vars manually
const fs = require('fs');
const envContent = fs.readFileSync('.env.local', 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.SUPABASE_SERVICE_ROLE_KEY
);

async function runMigration() {
  try {
    console.log('Adding itinerary_id column to bookings table...');

    // First, let's try a direct SQL approach using the client
    const { data, error } = await supabase
      .from('bookings')
      .select('id')
      .limit(1);

    if (error) {
      throw error;
    }

    console.log('Connected to database successfully!');
    console.log('\n⚠️  Please run this SQL manually in Supabase SQL Editor:');
    console.log(`
      ALTER TABLE bookings
      ADD COLUMN IF NOT EXISTS itinerary_id UUID REFERENCES itineraries(id) ON DELETE SET NULL;

      CREATE INDEX IF NOT EXISTS idx_bookings_itinerary_id ON bookings(itinerary_id);
    `);
    console.log('\nGo to: https://supabase.com/dashboard/project/zjskswendtlgxpkfavko/sql');

  } catch (err) {
    console.error('Error:', err.message);
  }
}

runMigration();
