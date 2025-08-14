# OAuth Setup Guide

This guide will help you set up Google and Facebook OAuth authentication for your course site.

## Required Environment Variables

Add these environment variables to your `.env.local` file:

```bash
# NextAuth Configuration
NEXTAUTH_SECRET=your-nextauth-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Facebook OAuth
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy the Client ID and Client Secret to your `.env.local` file

## Facebook OAuth Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or select an existing one
3. Add Facebook Login product to your app
4. Go to "Facebook Login" → "Settings"
5. Add Valid OAuth Redirect URIs:
   - `http://localhost:3000/api/auth/callback/facebook` (development)
   - `https://yourdomain.com/api/auth/callback/facebook` (production)
6. Copy the App ID and App Secret to your `.env.local` file

## Features

- **Google OAuth**: Sign in/up with Google account
- **Facebook OAuth**: Sign in/up with Facebook account
- **Traditional Login**: Email/password authentication
- **Automatic User Creation**: OAuth users are automatically created in your database
- **Role Assignment**: OAuth users get the 'USER' role by default
- **Session Management**: Secure JWT-based sessions with NextAuth

## How It Works

1. Users can choose between traditional email/password or OAuth providers
2. OAuth users are automatically registered if they don't exist
3. All users (OAuth and traditional) are stored in your MongoDB database
4. Sessions are managed securely with NextAuth
5. Users can access both login and register forms with OAuth options

## Security Features

- Secure session management
- JWT token validation
- OAuth provider verification
- Automatic user role assignment
- Secure password hashing for traditional users
