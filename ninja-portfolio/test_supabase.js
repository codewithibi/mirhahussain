// This script helps you test the Supabase integration
// Run this in your browser console while on the index.html page

async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  
  // Check if Supabase client is available
  if (!window.supabase) {
    console.error('Supabase client not found. Make sure you are running this on a page with Supabase loaded.');
    return;
  }
  
  // Get Supabase client from the page
  const supabaseUrl = 'https://ywlxsnsxolmaymjqhbjx.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3bHhzbnN4b2xtYXltanFoYmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MTgyMzEsImV4cCI6MjA2ODk5NDIzMX0.tY4TocIZWHrCwaW1thX-76VvJzY3Qv3Gf-s-_p7wCp4';
  const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
  
  try {
    // Test connection by getting the server timestamp
    const { data, error } = await supabaseClient.rpc('get_server_time');
    
    if (error) {
      throw error;
    }
    
    console.log('✅ Supabase connection successful!');
    console.log('Server time:', data);
    
    // Test if the contact_messages table exists
    console.log('Testing contact_messages table...');
    
    try {
      const { data: tableTest, error: tableError } = await supabaseClient
        .from('contact_messages')
        .select('count()')
        .limit(1);
      
      if (tableError) {
        throw tableError;
      }
      
      console.log('✅ contact_messages table exists and is accessible');
      console.log('Table count result:', tableTest);
      
      // Test inserting a test message
      const testMessage = {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Message',
        message: 'This is a test message from the Supabase test script.',
        created_at: new Date().toISOString()
      };
      
      console.log('Testing message insertion...');
      const { data: insertData, error: insertError } = await supabaseClient
        .from('contact_messages')
        .insert([testMessage]);
      
      if (insertError) {
        throw insertError;
      }
      
      console.log('✅ Test message inserted successfully!');
      
      // Retrieve the test message to confirm it was saved
      const { data: messages, error: selectError } = await supabaseClient
        .from('contact_messages')
        .select('*')
        .eq('email', 'test@example.com')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (selectError) {
        throw selectError;
      }
      
      if (messages && messages.length > 0) {
        console.log('✅ Test message retrieved successfully!');
        console.log('Retrieved message:', messages[0]);
        
        // Delete the test message
        const { error: deleteError } = await supabaseClient
          .from('contact_messages')
          .delete()
          .eq('id', messages[0].id);
        
        if (deleteError) {
          throw deleteError;
        }
        
        console.log('✅ Test message deleted successfully!');
      } else {
        console.warn('⚠️ Test message was not found after insertion.');
      }
      
    } catch (tableErr) {
      console.error('❌ Error testing contact_messages table:', tableErr.message);
      console.log('Make sure you have created the contact_messages table using the SQL in supabase_schema.sql');
    }
    
  } catch (err) {
    console.error('❌ Supabase connection error:', err.message);
    console.log('Please check your Supabase URL and API key.');
  }
}

// Add a custom RPC function to get server time
// You need to run this SQL in your Supabase SQL editor:
/*
create or replace function get_server_time()
returns timestamptz as $$
  select now();
$$ language sql;
*/

// Run the test function
testSupabaseConnection(); 