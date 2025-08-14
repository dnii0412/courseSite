# Environment Setup Guide

## Required Environment Variables

Add these to your `.env.local` file:

```bash
# MongoDB Atlas Programmatic API
ATLAS_PUBLIC_KEY=your_public_key_here
ATLAS_PRIVATE_KEY=your_private_key_here
ATLAS_PROJECT_ID=your_project_id_here
ATLAS_ORG_ID=your_organization_id_here

# Bunny.net Video Streaming
BUNNY_LIBRARY_ID=your_library_id_here
BUNNY_STREAM_API_KEY=your_stream_api_key_here

# Public links for quick navigation (optional)
NEXT_PUBLIC_ATLAS_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_ATLAS_ORG_ID=your_organization_id_here
```

## Optional Environment Variables

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

## Security Notes

- **Never commit** `.env.local` to version control
- **ATLAS_PRIVATE_KEY** and **BUNNY_STREAM_API_KEY** are server-only and will never be exposed to the client
- **NEXT_PUBLIC_*** variables are safe to expose to the client
- **CRON_SECRET** should be a random string for additional security

## Testing

1. Set up the environment variables
2. Visit `/admin/billing` to see the Cost Guard dashboard
3. The system will automatically check billing daily at 9 AM UTC
4. Alerts are created when spending reaches 80% and 100% of your budget
5. Test video uploads in the course lessons section
