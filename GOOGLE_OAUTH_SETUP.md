# Google OAuth Setup Guide

To enable Google login functionality, you need to set up Google OAuth credentials.

## Steps:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Create a new project or select an existing one

2. **Enable Google+ API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"

4. **Configure OAuth Consent Screen**
   - Add your app name and user support email
   - Add authorized domains (localhost for development)

5. **Set Authorized Redirect URIs**
   - Add: `http://localhost:3000/api/auth/google/callback`
   - For production: `https://yourdomain.com/api/auth/google/callback`

6. **Get Your Credentials**
   - Copy the Client ID and Client Secret

7. **Add to Environment Variables**
   Create a `.env.local` file in your project root:
   ```
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

## Testing:
- Click "Continue with Google" button on login/register pages
- You should be redirected to Google's OAuth consent screen
- After authorization, you'll be redirected back to the dashboard

## Security Notes:
- Never commit your `.env.local` file to version control
- Use different credentials for development and production
- Regularly rotate your OAuth credentials
