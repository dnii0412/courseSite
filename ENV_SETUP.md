# Environment Variables Setup

Create a `.env.local` file in your project root with the following variables:

## Required Variables

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/your-database-name
# or for MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/database-name

# JWT Secret (for authentication)
JWT_SECRET=your_super_secret_jwt_key_here

# Byl Configuration
BYL_API_URL=https://api.byl.mn/v2
BYL_ACCESS_TOKEN=your_byl_access_token_here

# App URL (for callbacks)
NEXT_PUBLIC_APP_URL=http://localhost:3000
# In production: https://your-domain.com
```

## Byl Setup Instructions

1. **Get Byl Merchant Account**: Sign up at [Byl Merchant Portal](https://merchant.byl.mn)

2. **Get API Credentials**:
   - Access Token: From your Byl merchant dashboard (this is your API key)
   - API URL: Usually `https://api.byl.mn/v2`

3. **Configure Callback URL**: 
   - Set your callback URL in Byl dashboard to: `https://your-domain.com/api/payments/byl/callback`
   - For development: `http://localhost:3000/api/payments/byl/callback`

## Testing the Payment System

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Create a test course** in the admin panel

3. **Click "Худалдан авах" (Buy)** on any course card

4. **The payment modal will**:
   - Check if user is logged in
   - Create a Byl invoice
   - Show QR code for payment
   - Poll for payment status every 5 seconds
   - Redirect to course after successful payment

## Payment Flow

1. User clicks "Buy" → Payment modal opens
2. If not logged in → Redirect to login page
3. If logged in → Create Byl invoice
4. Show QR code → User scans with Byl app
5. Byl sends callback → Update order status
6. Create enrollment → Increment course studentsCount
7. Redirect to course learning page

## Troubleshooting

- **"JWT_SECRET not defined"**: Add JWT_SECRET to .env.local
- **"Byl API error"**: Check BYL_ACCESS_TOKEN
- **"MongoDB connection failed"**: Check MONGODB_URI format
- **Payment not completing**: Check callback URL in Byl dashboard
