const { createClient } = require('@supabase/supabase-js');

require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Check your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addImagesColumn() {
  try {
    console.log('Adding images column to itinerary_days table...');

    // Use raw SQL to add the column
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE itinerary_days ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT \'{}\';'
    });

    if (error) {
      console.error('Error adding column:', error);
      console.log('\nNote: You may need to run this SQL manually in the Supabase SQL Editor:');
      console.log('ALTER TABLE itinerary_days ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT \'{}\';');
    } else {
      console.log('✅ Images column added successfully!');
    }
  } catch (error) {
    console.error('Error:', error.message);
    console.log('\nNote: You may need to run this SQL manually in the Supabase SQL Editor:');
    console.log('ALTER TABLE itinerary_days ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT \'{}\';');
  }
}

addImagesColumn();
