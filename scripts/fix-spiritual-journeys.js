/**
 * Simple script to update tour_categories in database
 * Run with: node scripts/fix-spiritual-journeys.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Connecting to Supabase...');
console.log('URL:', supabaseUrl ? '✓ Found' : '✗ Missing');
console.log('Key:', supabaseKey ? '✓ Found' : '✗ Missing');

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ Error: Missing Supabase credentials in .env.local');
  console.log('Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixTourCategories() {
  try {
    // First, fetch current data
    console.log('\n📥 Fetching current tour_categories from database...');
    const { data: currentData, error: fetchError } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'tour_categories')
      .single();

    if (fetchError) {
      console.error('Error fetching:', fetchError);
      process.exit(1);
    }

    console.log('Current data found:');
    console.log(JSON.stringify(currentData, null, 2));

    // Update the second item's title
    const updatedValue = currentData.value;
    if (updatedValue && updatedValue[1]) {
      console.log(`\n🔄 Updating: "${updatedValue[1].title}" → "Spiritual Journeys"`);
      updatedValue[1].title = 'Spiritual Journeys';

      // Update in database
      console.log('\n📤 Updating database...');
      const { data: updateData, error: updateError } = await supabase
        .from('settings')
        .update({
          value: updatedValue,
          updated_at: new Date().toISOString()
        })
        .eq('key', 'tour_categories')
        .select();

      if (updateError) {
        console.error('Error updating:', updateError);
        process.exit(1);
      }

      console.log('✅ Successfully updated!');
      console.log('\nUpdated tour categories:');
      updatedValue.forEach((cat, i) => {
        console.log(`  ${i + 1}. ${cat.title}`);
      });
      console.log('\n🎉 The frontend should now show "Spiritual Journeys"');
    } else {
      console.log('⚠️  No data found at index 1');
    }

  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

fixTourCategories();
