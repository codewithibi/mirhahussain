# Supabase Authentication Setup Guide

This guide will walk you through setting up authentication for your Ninja Portfolio website with Supabase.

## Prerequisites

1. A Supabase account and project created
2. Your Supabase project URL and anon key

## Step 1: Run the SQL Setup Scripts

1. Log in to your Supabase dashboard at [app.supabase.com](https://app.supabase.com)
2. Navigate to the SQL Editor in your project
3. Run the `setup_auth.sql` file to set up authentication, user profiles, and contact messages table

## Step 2: Configure Email Authentication

1. In your Supabase dashboard, go to Authentication > Providers
2. Make sure Email provider is enabled
3. Configure the following settings:
   - Enable "Confirm email" if you want users to verify their email
   - Set up redirect URLs (e.g., `https://yourdomain.com/auth.html` or `http://localhost:3000/auth.html` for local development)
   - You can customize email templates if desired

## Step 3: Configure Social Authentication (Optional)

If you want to enable social login with Google or GitHub:

1. Go to Authentication > Providers in your Supabase dashboard
2. Configure the desired providers:
   
   ### Google:
   - Create a Google OAuth app in the [Google Cloud Console](https://console.cloud.google.com/)
   - Set up authorized redirect URIs (e.g., `https://[YOUR_PROJECT_REF].supabase.co/auth/v1/callback`)
   - Copy the Client ID and Client Secret to your Supabase settings

   ### GitHub:
   - Create a GitHub OAuth app in [GitHub Developer Settings](https://github.com/settings/developers)
   - Set the Authorization callback URL to `https://[YOUR_PROJECT_REF].supabase.co/auth/v1/callback`
   - Copy the Client ID and Client Secret to your Supabase settings

## Step 4: Update JavaScript Files

Make sure all your JavaScript files have the correct Supabase URL and anon key:

1. Open the following files and update the Supabase configuration:
   - `js/main.js`
   - `auth.html`
   - `dashboard.html`
   - `admin.html`

2. Replace the existing configuration with your own:
   ```javascript
   const supabaseUrl = 'https://YOUR_PROJECT_REF.supabase.co';
   const supabaseKey = 'YOUR_ANON_KEY';
   ```

## Step 5: User Registration and Authentication

The website now includes the following authentication features:

1. **User Registration**: Users can create accounts on the `auth.html` page
2. **User Login**: Users can sign in with email/password or social providers
3. **User Dashboard**: After login, users are redirected to their dashboard
4. **Profile Management**: Users can update their profile information
5. **Password Reset**: Users can reset their password if forgotten

## Step 6: Create an Admin User

There are two ways to create an admin user:

### Option 1: Using the auth.html page (recommended)

1. Open your website and navigate to the auth.html page
2. Sign up with your email and password
3. After signing up and confirming your email, promote the user to admin using SQL (see Step 7)

### Option 2: Using the setup_admin.js script

1. Open your website and navigate to the admin.html page
2. Open your browser's developer console (F12 or right-click > Inspect > Console)
3. Copy and paste the contents of `setup_admin.js` into the console and press Enter
4. Follow the prompts to create a new user
5. Check your email for a confirmation link from Supabase
6. Click the confirmation link to verify your email

## Step 7: Promote User to Admin

After creating a user, you need to promote them to admin:

1. Go to the SQL Editor in your Supabase dashboard
2. Run the following SQL command, replacing the email with your user's email:
   ```sql
   SELECT promote_to_admin('your-email@example.com');
   ```
3. You should see a result message: "User promoted to admin"

## Step 8: Test Authentication System

1. Test user registration and login on the auth.html page
2. Test the user dashboard functionality
3. Test admin access on the admin.html page

## Troubleshooting

### If users can't register or log in:

1. Check your Supabase configuration in the JavaScript files
2. Make sure email authentication is enabled in your Supabase dashboard
3. Check the browser console for any error messages

### If social login doesn't work:

1. Make sure you've configured the social providers correctly
2. Check that the redirect URLs are set up properly
3. Verify that your OAuth app credentials are correct

### If you can't access the admin panel:

1. Make sure you've promoted your user to admin using the SQL command
2. Check the profiles table to ensure your user has the 'admin' role:
   ```sql
   SELECT * FROM profiles WHERE email = 'your-email@example.com';
   ```

## Security Notes

- Never share your Supabase service_role key (only use the anon key in client code)
- Set up proper Row Level Security (RLS) policies for all tables
- Consider adding additional security measures like rate limiting for login attempts
- Regularly review access logs in your Supabase dashboard 