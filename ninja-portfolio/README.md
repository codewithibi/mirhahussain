# Ninja Portfolio

A modern portfolio website with a contact form that uses Supabase for data storage.

## Features

- Responsive design
- Modern UI with animations
- Contact form with Supabase integration
- Smooth scrolling navigation
- Secure authentication system for users and admins
- User dashboard with profile management
- Admin panel for managing contact form submissions

## Supabase Setup

To set up the contact form with Supabase:

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to the SQL Editor in your Supabase dashboard
4. Run the SQL commands from the `setup_auth.sql` file to create the necessary tables and policies
5. Get your Supabase URL and anon key from the API settings
6. Update the `supabaseUrl` and `supabaseKey` variables in all JavaScript files with your own values

## Authentication Setup

For detailed instructions on setting up authentication, see [AUTH_SETUP.md](AUTH_SETUP.md)

Quick steps:
1. Run the SQL commands in `setup_auth.sql` in your Supabase SQL Editor
2. Configure email authentication in your Supabase dashboard
3. Enable social providers (Google, GitHub) if desired
4. Set up redirect URLs for authentication

## User Authentication System

The website includes a complete user authentication system:

1. **User Registration**: Users can sign up with email/password or social providers
2. **User Login**: Secure login with email/password or social providers
3. **Password Reset**: Users can reset their password if forgotten
4. **User Dashboard**: Authenticated users can access their dashboard
5. **Profile Management**: Users can update their profile information

## Admin Panel Setup

To set up the admin panel for managing contact form submissions:

1. Create a user account through the auth.html page
2. Promote the user to admin using the SQL command in your Supabase SQL Editor:
   - `SELECT promote_to_admin('your-email@example.com');`
3. Access the admin panel by navigating to `admin.html` in your browser

## Testing Supabase Integration

To test if your Supabase integration is working correctly:

1. Open your website in a browser
2. Open the browser console (F12)
3. Copy and paste the contents of `test_supabase.js` into the console
4. Check the console for test results and troubleshooting information

## Local Development

To run the project locally:

1. Clone the repository
2. Open `index.html` in your browser

Note: For the contact form and authentication to work correctly, you'll need to serve the files using a local server due to CORS restrictions.

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Supabase (for backend and authentication)
- Font Awesome (for icons)
- Google Fonts 