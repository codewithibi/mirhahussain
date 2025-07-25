// This script helps you create an admin user in Supabase
// Run this in your browser console while on the admin.html page

async function setupAdminUser() {
  // Check if Supabase client is available
  if (!window.supabase) {
    console.error('Supabase client not found. Make sure you are running this on the admin.html page.');
    return;
  }
  
  // Get Supabase client from the page
  const supabaseUrl = 'https://ywlxsnsxolmaymjqhbjx.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3bHhzbnN4b2xtYXltanFoYmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MTgyMzEsImV4cCI6MjA2ODk5NDIzMX0.tY4TocIZWHrCwaW1thX-76VvJzY3Qv3Gf-s-_p7wCp4';
  const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
  
  // Prompt for email and password
  const email = prompt('Enter admin email:');
  if (!email) {
    console.log('Setup cancelled.');
    return;
  }
  
  const password = prompt('Enter admin password (minimum 6 characters):');
  if (!password || password.length < 6) {
    console.log('Password must be at least 6 characters. Setup cancelled.');
    return;
  }
  
  try {
    console.log('Creating admin user...');
    
    // Sign up the user
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      throw error;
    }
    
    console.log('Admin user created successfully!');
    console.log('Important: Check your email to confirm your account.');
    console.log('After confirming your email, you can log in to the admin panel.');
    
    // Additional instructions
    console.log('\nAdditional steps required in Supabase dashboard:');
    console.log('1. Go to your Supabase dashboard: https://app.supabase.com/');
    console.log('2. Select your project');
    console.log('3. Go to Authentication > Users');
    console.log('4. Find your user and click on the three dots');
    console.log('5. Select "Make admin user"');
    
  } catch (error) {
    console.error('Error creating admin user:', error.message);
  }
}

// Run the setup function
setupAdminUser(); 