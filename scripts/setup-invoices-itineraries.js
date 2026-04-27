/**
 * Setup Invoices and Itineraries Tables
 * Run with: node scripts/setup-invoices-itineraries.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function setupInvoicesItineraries() {
  console.log('\n🎨 Setting up Invoices & Itineraries system...\n');

  try {
    // Read SQL file
    const sqlPath = path.join(__dirname, 'setup-invoices-tables.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Split by semicolon and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📜 Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
        if (error) {
          // Try direct SQL execution via postgres
          console.log(`⚠️  Statement ${i + 1}: Could not execute (may need manual execution)`);
        } else {
          console.log(`✅ Statement ${i + 1}: Executed successfully`);
        }
      } catch (err) {
        console.log(`⚠️  Statement ${i + 1}: ${err.message}`);
      }
    }

    console.log('\n✨ Invoices & Itineraries setup complete!\n');
    console.log('⚠️  Note: If some statements failed, please manually run the SQL file:');
    console.log('   psql $DATABASE_URL -f scripts/setup-invoices-tables.sql\n');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setupInvoicesItineraries();
