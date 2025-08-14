# Environment Setup Guide

## Required Environment Variables

Add these to your `.env.local` file:

```bash
# MongoDB Atlas Programmatic API
ATLAS_PUBLIC_KEY=your_public_key_here
ATLAS_PRIVATE_KEY=your_private_key_here
ATLAS_PROJECT_ID=your_project_id_here
ATLAS_ORG_ID=your_organization_id_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
AUTH_SECRET=your_super_secret_auth_key_here
NEXTAUTH_SECRET=${AUTH_SECRET}

# Google OAuth
AUTH_GOOGLE_ID=your_google_client_id_here
AUTH_GOOGLE_SECRET=your_google_client_secret_here

# Facebook OAuth
FACEBOOK_CLIENT_ID=your_facebook_client_id_here
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret_here

# Bunny.net Video Streaming
BUNNY_LIBRARY_ID=your_library_id_here
BUNNY_STREAM_API_KEY=your_stream_api_key_here

# Public links for quick navigation (optional)
NEXT_PUBLIC_ATLAS_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_ATLAS_ORG_ID=your_organization_id_here

# Email notifications via Resend
RESEND_API_KEY=your_resend_api_key_here

# Cron job security
CRON_SECRET=your_random_secret_here
```

## OAuth Setup Instructions

### Google OAuth Setup

1. **Go to Google Cloud Console**: [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. **Create a new project** or select existing one
3. **Enable Google+ API** and **Google OAuth2 API**
4. **Go to Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. **Configure OAuth consent screen**:
   - User Type: External
   - App name: Your app name
   - User support email: Your email
   - Developer contact information: Your email
6. **Create OAuth 2.0 Client ID**:
   - Application type: Web application
   - Authorized JavaScript origins: `http://localhost:3000` (dev), `https://yourdomain.com` (prod)
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google` (dev), `https://yourdomain.com/api/auth/callback/google` (prod)
7. **Copy Client ID and Client Secret** to your `.env.local`

### Facebook OAuth Setup

1. **Go to Facebook Developers**: [https://developers.facebook.com/](https://developers.facebook.com/)
2. **Create a new app** or select existing one
3. **Add Facebook Login product** to your app
4. **Configure Facebook Login**:
   - Valid OAuth Redirect URIs: `http://localhost:3000/api/auth/callback/facebook` (dev), `https://yourdomain.com/api/auth/callback/facebook` (prod)
5. **Go to App Settings** → **Basic** to get App ID and App Secret
6. **Copy App ID and App Secret** to your `.env.local`

## Byl Setup Instructions

```bash
# Email notifications via Resend
RESEND_API_KEY=your_resend_api_key_here

# Cron job security
CRON_SECRET=your_random_secret_here
```

## How to Get Atlas API Keys

1. **Go to MongoDB Atlas**: https://cloud.mongodb.com
2. **Navigate to Access Manager** → **API Keys**
3. **Create a new API Key** with the following permissions:
   - **Organization Permissions**: Read
   - **Project Permissions**: Read
4. **Copy the Public Key and Private Key**
5. **Get your Project ID** from the project URL or settings
6. **Get your Organization ID** from the organization URL or settings

## How to Get Bunny.net API Keys

1. **Go to Bunny.net**: https://bunny.net
2. **Sign in to your account**
3. **Navigate to Stream** → **Libraries**
4. **Create a new library** or use an existing one
5. **Copy the Library ID** (numeric value)
6. **Go to Account** → **API Keys**
7. **Create a new API Key** with Stream permissions
8. **Copy the API Key**

## Testing OAuth

1. **Start your development server**: `npm run dev`
2. **Go to login page**: `http://localhost:3000/auth/login`
3. **Test Google OAuth**: Click "Continue with Google" button
4. **Test Facebook OAuth**: Click "Continue with Facebook" button
5. **Check console logs** for OAuth flow debugging

## Testing

1. Set up the environment variables
2. Visit `/admin/billing` to see the Cost Guard dashboard
3. The system will automatically check billing daily at 9 AM UTC
4. Alerts are created when spending reaches 80% and 100% of your budget
5. Test video uploads in the course lessons section

## Payment Flow Testing

1. User clicks "Buy" → Payment modal opens
2. If not logged in → Redirect to login page
3. If logged in → Create Byl invoice
4. Show QR code → User scans with Byl app
5. Byl sends callback → Update order status
6. Create enrollment → Increment course studentsCount
7. Redirect to course learning page

## Troubleshooting

- **"JWT_SECRET not defined"**: Add AUTH_SECRET to .env.local
- **"Byl API error"**: Check BYL_ACCESS_TOKEN
- **"MongoDB connection failed"**: Check MONGODB_URI format
- **Payment not completing**: Check callback URL in Byl dashboard
- **OAuth not working**: Check OAuth client IDs, secrets, and redirect URIs
- **"Invalid client" error**: Check your OAuth client IDs and secrets
- **"Redirect URI mismatch"**: Verify redirect URIs in Google/Facebook developer consoles
- **"OAuth sign in error"**: Check MongoDB connection and User model
- **"405 Method Not Allowed"**: Ensure NextAuth route is properly configured

## Security Notes

- **Never commit** `.env.local` to version control
- **ATLAS_PRIVATE_KEY** and **BUNNY_STREAM_API_KEY** are server-only and will never be exposed to the client
- **NEXT_PUBLIC_*** variables are safe to expose to the client
- **CRON_SECRET** should be a random string for additional security
