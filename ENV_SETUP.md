# Environment Variables Setup

Create a `.env.local` file in your project root with the following variables:

## Required Variables

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/your-database-name
# or for MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/database-name

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

# Byl Configuration
BYL_API_URL=https://api.byl.mn/v2
BYL_ACCESS_TOKEN=your_byl_access_token_here

# App URL (for callbacks)
NEXT_PUBLIC_APP_URL=http://localhost:3000
# In production: https://your-domain.com
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

1. **Get Byl Merchant Account**: Sign up at [Byl Merchant Portal](https://merchant.byl.mn)

2. **Get API Credentials**:
   - Access Token: From your Byl merchant dashboard (this is your API key)
   - API URL: Usually `https://api.byl.mn/v2`

3. **Configure Callback URL**: 
   - Set your callback URL in Byl dashboard to: `https://your-domain.com/api/payments/byl/callback`
   - For development: `http://localhost:3000/api/payments/byl/callback`

## Testing OAuth

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Go to login page**: `http://localhost:3000/auth/login`

3. **Test Google OAuth**: Click "Continue with Google" button
4. **Test Facebook OAuth**: Click "Continue with Facebook" button

5. **Check console logs** for OAuth flow debugging

## Troubleshooting OAuth

- **"Invalid client" error**: Check your OAuth client IDs and secrets
- **"Redirect URI mismatch"**: Verify redirect URIs in Google/Facebook developer consoles
- **"OAuth sign in error"**: Check MongoDB connection and User model
- **"405 Method Not Allowed"**: Ensure NextAuth route is properly configured

## Payment Flow

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
