/**
 * Force update tour_categories with detailed error reporting
 */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Using key type:', supabaseKey.startsWith('eyJ') ? 'Anon key' : 'Service role');

const supabase = createClient(supabaseUrl, supabaseKey);

async function forceUpdate() {
  try {
    // Step 1: Fetch current data
    console.log('\n📥 Step 1: Fetching current data...');
    const { data: currentData, error: fetchError } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'tour_categories')
      .single();

    if (fetchError) {
      console.error('❌ Fetch error:', fetchError);
      return;
    }

    console.log('✓ Fetched successfully');
    console.log('  Current title:', currentData.value[1]?.title);

    // Step 2: Modify the data
    console.log('\n📝 Step 2: Modifying data...');
    const newValue = [...currentData.value];
    newValue[1] = {
      ...newValue[1],
      title: 'Spiritual Journeys'
    };
    console.log('  New title:', newValue[1]?.title);

    // Step 3: Update using the record ID
    console.log('\n💾 Step 3: Updating database by ID...');
    console.log('  Record ID:', currentData.id);

    const { data: updateData, error: updateError } = await supabase
      .from('settings')
      .update({
        value: newValue,
        updated_at: new Date().toISOString()
      })
      .eq('id', currentData.id)  // Use ID instead of key for more specific update
      .select();

    if (updateError) {
      console.error('❌ Update error:', JSON.stringify(updateError, null, 2));
      console.error('\nError details:', {
        message: updateError.message,
        details: updateError.details,
        hint: updateError.hint,
        code: updateError.code
      });
      return;
    }

    console.log('✓ Update successful!');
    console.log('  Updated record:', JSON.stringify(updateData, null, 2));

    // Step 4: Verify the update
    console.log('\n🔍 Step 4: Verifying update...');
    const { data: verifyData } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'tour_categories')
      .single();

    console.log('  Current title in DB:', verifyData.value[1]?.title);

    if (verifyData.value[1]?.title === 'Spiritual Journeys') {
      console.log('\n✅ SUCCESS! Database updated correctly!');
      console.log('🔄 Please refresh your browser to see changes');
    } else {
      console.log('\n⚠️  Update did not persist. This might be a caching or permissions issue.');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

forceUpdate();
