/**
 * Check current database status
 */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStatus() {
  try {
    console.log('🔍 Checking current database status...\n');

    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'tour_categories')
      .single();

    if (error) {
      console.error('Error:', error);
      return;
    }

    console.log('Current value in database:');
    console.log('Title 1:', data.value[0]?.title);
    console.log('Title 2:', data.value[1]?.title);
    console.log('Title 3:', data.value[2]?.title);
    console.log('\nFull record:', JSON.stringify(data, null, 2));

  } catch (error) {
    console.error('Error:', error);
  }
}

checkStatus();
