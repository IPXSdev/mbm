// Quick test to check database connection and table existence
const { createClient } = require('@supabase/supabase-js')

// You'll need to replace these with your actual Supabase credentials
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testDatabase() {
  try {
    console.log('Testing database connection...')
    
    // Test if sync_finalizations table exists
    const { data, error } = await supabase
      .from('sync_finalizations')
      .select('id')
      .limit(1)
    
    if (error) {
      console.error('Error accessing sync_finalizations table:', error)
      if (error.code === '42P01') {
        console.log('\n❌ Table "sync_finalizations" does not exist!')
        console.log('📋 You need to run the SQL script: scripts/create-sync-tables.sql')
        console.log('🔗 Go to your Supabase dashboard > SQL Editor and run the script')
      }
    } else {
      console.log('✅ sync_finalizations table exists and is accessible')
    }
    
    // Test auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError) {
      console.log('ℹ️  Auth test (this is expected to fail in Node.js context)')
    }
    
  } catch (err) {
    console.error('Test failed:', err)
  }
}

testDatabase()
