# TUS Upload 404 Error Fix - README

## 🚨 Problem Identified

**Error**: `uploader.ts:90 HEAD https://video.bunnycdn.com/tusupload/f70fdcac44164f2d8e3aae112e1266c8 404 (Not Found)`

**Issue**: The TUS upload endpoint was returning a 404 error, preventing video uploads from working properly.

## 🔍 Root Cause Analysis

### 1. **Incorrect TUS Endpoint Configuration**
- The code was trying to read `NEXT_PUBLIC_TUS_ENDPOINT` from environment variables
- This variable was not set, causing the TUS upload to fail
- The correct TUS endpoint for Bunny.net should be: `https://video.bunnycdn.com/tusupload/{videoId}`

### 2. **Environment Variable Mismatch**
- Code was using `BUNNY_STREAM_LIBRARY_ID` but documentation showed `BUNNY_LIBRARY_ID`
- Inconsistent naming caused configuration issues

### 3. **Missing TUS Endpoint Documentation**
- No clear documentation on what the TUS endpoint should be
- No validation that the endpoint is correctly constructed

## ✅ Fixes Implemented

### 1. **Fixed TUS Endpoint Construction**
```typescript
// BEFORE (problematic):
endpoint: process.env.NEXT_PUBLIC_TUS_ENDPOINT,

// AFTER (fixed):
endpoint: `https://video.bunnycdn.com/tusupload/${videoId}`,
```

### 2. **Standardized Environment Variables**
```typescript
// BEFORE (inconsistent):
const libraryId = process.env.BUNNY_STREAM_LIBRARY_ID!

// AFTER (consistent):
const libraryId = process.env.BUNNY_LIBRARY_ID!
```

### 3. **Enhanced Debugging and Logging**
- Added comprehensive logging to track TUS configuration
- Shows endpoint, video ID, library ID, and API key status
- Helps troubleshoot any remaining configuration issues

### 4. **Created Configuration Test Script**
- `scripts/test-bunny-config.js` - Tests Bunny.net configuration
- Validates environment variables, API connectivity, and TUS endpoint construction
- Easy way to verify setup is correct

## 🧪 Testing the Fix

### **Option 1: Run Configuration Test**
```bash
npm run test-bunny
```

This will:
- Check environment variables are set correctly
- Validate library ID and API key formats
- Test TUS endpoint construction
- Verify API connectivity to Bunny.net
- Show detailed configuration summary

### **Option 2: Test Video Upload**
1. Go to admin panel and try to upload a video
2. Check browser console for detailed logging
3. Verify TUS endpoint is constructed correctly
4. Check that video appears in Bunny.net dashboard

### **Option 3: Check API Logs**
When uploading, you'll now see detailed logs:
```
Creating video with: { title: "...", libraryId: "123", hasApiKey: true }
Video created successfully: abc123-def456
Generated TUS config: { 
  endpoint: "https://video.bunnycdn.com/tusupload/abc123-def456",
  videoId: "abc123-def456",
  expiresIn: 600,
  hasSignature: true,
  libraryId: "123",
  hasApiKey: true
}
```

## 🔧 Required Environment Variables

Make sure your `.env.local` file has:

```bash
# Bunny.net Video Streaming
BUNNY_LIBRARY_ID=your_library_id_here
BUNNY_STREAM_API_KEY=your_stream_api_key_here
```

**Important Notes**:
- `BUNNY_LIBRARY_ID` must be a number (e.g., `12345`)
- `BUNNY_STREAM_API_KEY` must be a valid API key with Stream permissions
- No need to set `NEXT_PUBLIC_TUS_ENDPOINT` - it's now constructed automatically

## 🐛 Troubleshooting

### **Still Getting 404 Errors**
1. **Run the test script**: `npm run test-bunny`
2. **Check environment variables**: Ensure both are set correctly
3. **Verify API key permissions**: Must have Stream access
4. **Check library ID**: Must be a valid numeric ID
5. **Verify account status**: Ensure Bunny.net Stream is enabled

### **Common Issues**
- **Missing environment variables**: Set both `BUNNY_LIBRARY_ID` and `BUNNY_STREAM_API_KEY`
- **Invalid library ID**: Must be a number, not a string
- **API key permissions**: Must have Stream permissions enabled
- **Account status**: Ensure your Bunny.net account has Stream enabled

### **Debug Commands**
```bash
# Test Bunny.net configuration
npm run test-bunny

# Test lesson creation
npm run test-lesson

# Check environment variables
echo "BUNNY_LIBRARY_ID: $BUNNY_LIBRARY_ID"
echo "BUNNY_STREAM_API_KEY: ${BUNNY_STREAM_API_KEY:0:10}..."
```

## 📋 Files Modified

1. **`app/api/bunny/create-upload/route.ts`**
   - Fixed TUS endpoint construction
   - Standardized environment variable names
   - Enhanced debugging and logging

2. **`scripts/test-bunny-config.js`** (New)
   - Comprehensive Bunny.net configuration testing
   - Validates environment variables and API connectivity
   - Tests TUS endpoint construction

3. **`package.json`**
   - Added `test-bunny` script for easy testing

## 🎯 Expected Results

After implementing these fixes:

✅ **TUS uploads work correctly** without 404 errors  
✅ **Video URLs are properly constructed** for Bunny.net  
✅ **Environment variables are consistent** and well-documented  
✅ **Comprehensive logging** shows exactly what's happening  
✅ **Configuration testing** helps identify any remaining issues  

## 🚀 How TUS Upload Works Now

### **Step 1: Create Video Object**
- API calls Bunny.net to create a video object
- Returns a unique video ID (GUID)

### **Step 2: Generate TUS Endpoint**
- Constructs TUS endpoint: `https://video.bunnycdn.com/tusupload/{videoId}`
- Generates authorization signature and headers

### **Step 3: Start TUS Upload**
- Client starts TUS upload to the correct endpoint
- Video data is uploaded directly to Bunny.net
- Progress is tracked and reported

### **Step 4: Video Processing**
- Bunny.net processes the uploaded video
- Video becomes available for streaming
- URL format: `bunny:{videoId}`

## 🎯 Next Steps

1. **Test the configuration**: Run `npm run test-bunny`
2. **Verify environment variables**: Ensure both are set correctly
3. **Test video upload**: Try uploading a video through admin panel
4. **Check logs**: Monitor console for detailed upload information
5. **Verify video URLs**: Ensure they're saved to MongoDB correctly

## 📞 Support

If you continue to experience issues:
1. Run `npm run test-bunny` to check configuration
2. Verify environment variables in `.env.local`
3. Check browser console for detailed error messages
4. Ensure Bunny.net account has Stream enabled
5. Verify API key has correct permissions

The enhanced logging and configuration testing should make it much easier to identify and resolve any remaining TUS upload issues!
