# Authentication Setup Guide

This project uses NextAuth.js v4 with MongoDB adapter for authentication. The setup includes Google OAuth, Facebook OAuth, and email/password authentication.

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/your-database-name

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Facebook OAuth
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
```

## OAuth App Configuration

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client IDs
5. Set Application Type to "Web application"
6. Add Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
7. Copy Client ID and Client Secret to your `.env.local`

### Facebook OAuth Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Go to Settings → Basic
5. Copy App ID and App Secret to your `.env.local`
6. Add Valid OAuth Redirect URIs:
   - `http://localhost:3000/api/auth/callback/facebook` (for development)
   - `https://yourdomain.com/api/auth/callback/facebook` (for production)

## Authentication Flow

### Registration Flow
- **Email/Password Registration**: User fills form → password hashed → user created → auto-signin → redirect to `/onboarding?from=register`
- **OAuth Registration**: User clicks OAuth button → OAuth consent → user created → redirect to `/onboarding?from=register`

### Login Flow
- **Email/Password Login**: User fills form → credentials verified → redirect to `/courses` or `returnUrl`
- **OAuth Login**: User clicks OAuth button → OAuth consent → redirect to `/courses` or `returnUrl`

### Redirect Rules
- Successful registration (any method) → `/onboarding?from=register`
- Successful login (any method) → `/courses` or `returnUrl` if present
- OAuth from register page → `/onboarding?from=register`

## Database Schema

The authentication system uses the following MongoDB collections (managed by NextAuth.js):

- `users`: User accounts with name, email, password hash, role, OAuth info
- `accounts`: OAuth account links
- `sessions`: User sessions
- `verification_tokens`: Email verification tokens

## Security Features

- Password hashing with bcrypt (12 salt rounds)
- JWT session strategy
- HTTP-only cookies
- CSRF protection
- Secure redirect handling

## Testing the Setup

1. Start your development server: `npm run dev`
2. Visit `/auth/register` to test registration
3. Visit `/auth/login` to test login
4. Test OAuth flows with Google and Facebook
5. Verify redirects work correctly

## Troubleshooting

### Common Issues

1. **OAuth redirect URI mismatch**: Ensure redirect URIs in OAuth apps exactly match your environment
2. **Database connection**: Verify MongoDB is running and connection string is correct
3. **Environment variables**: Check all required variables are set in `.env.local`
4. **NextAuth secret**: Generate a strong random string for NEXTAUTH_SECRET

### Debug Mode

To enable debug mode, add to your `.env.local`:
```bash
NEXTAUTH_DEBUG=true
```

This will show detailed logs in the console for debugging authentication issues.
