# Ninja Portfolio

A modern portfolio site with a Groq-powered AI chatbot.

## Features

- Responsive design with cyberpunk ninja theme
- Interactive sections: Home, About, Contact
- AI Chatbot powered by Groq API
- Contact form with Web3Forms integration

## Deployment Instructions

### Local Development

1. Clone the repository
2. Navigate to the project folder
3. Open `index.html` in your browser

### Deploying to Vercel

1. Fork or clone this repository to your GitHub account
2. Sign up for a [Vercel](https://vercel.com) account if you don't have one
3. Connect your GitHub account to Vercel
4. Import the repository as a new project
5. Add your Groq API key as an environment variable:
   - Go to Project Settings → Environment Variables
   - Add variable: `VITE_GROQ_API_KEY` with your Groq API key as the value
6. Deploy the project

### Using the Chatbot

The chatbot uses Groq's powerful AI models. There are two ways to provide your API key:

1. **Environment variable (recommended for production)**
   - Add your Groq API key to Vercel environment variables as described above

2. **Client-side entry**
   - Open the chatbot page and type `/key YOUR_API_KEY` in the chat
   - Your key will be stored in browser session storage and not sent to any server

> **Note**: The API key is required to use the chatbot. Get your API key from [Groq Console](https://console.groq.com/keys).

## Troubleshooting

If you encounter a 404 error on Vercel deployment:
1. Make sure the repository structure is maintained
2. Verify that the main page is named `index.html` and in the root directory
3. Check that Vercel's build settings are correctly configured to the root directory

## Security

- Never commit API keys to your repository
- Use environment variables for sensitive information
- The chatbot stores API keys in session storage for convenience, which is cleared when the browser is closed 