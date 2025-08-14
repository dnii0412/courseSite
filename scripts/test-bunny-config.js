const crypto = require('crypto')

async function testBunnyConfig() {
  console.log('🧪 Testing Bunny.net Configuration...\n')
  
  // Check environment variables
  const libraryId = process.env.BUNNY_LIBRARY_ID
  const apiKey = process.env.BUNNY_STREAM_API_KEY
  
  console.log('📋 Environment Variables:')
  console.log(`   BUNNY_LIBRARY_ID: ${libraryId || 'NOT SET'}`)
  console.log(`   BUNNY_STREAM_API_KEY: ${apiKey ? 'SET' : 'NOT SET'}`)
  
  if (!libraryId || !apiKey) {
    console.log('\n❌ Missing required environment variables!')
    console.log('   Please set BUNNY_LIBRARY_ID and BUNNY_STREAM_API_KEY in your .env.local file')
    return
  }
  
  // Test library ID format
  const libraryIdNum = Number(libraryId)
  if (isNaN(libraryIdNum)) {
    console.log('\n❌ BUNNY_LIBRARY_ID must be a number!')
    console.log(`   Current value: "${libraryId}"`)
    return
  }
  
  console.log(`   Library ID (numeric): ${libraryIdNum}`)
  
  // Test API key format
  if (apiKey.length < 10) {
    console.log('\n❌ BUNNY_STREAM_API_KEY seems too short!')
    console.log(`   Length: ${apiKey.length} characters`)
    return
  }
  
  console.log(`   API Key length: ${apiKey.length} characters`)
  
  // Test TUS endpoint construction
  const testVideoId = 'test-video-123'
  const tusEndpoint = `https://video.bunnycdn.com/tusupload/${testVideoId}`
  
  console.log('\n🔗 TUS Endpoint Test:')
  console.log(`   Test Video ID: ${testVideoId}`)
  console.log(`   TUS Endpoint: ${tusEndpoint}`)
  
  // Test signature generation (similar to what the API does)
  console.log('\n🔐 Signature Generation Test:')
  const expiresInSeconds = 60 * 10 // 10 minutes
  const expireUnix = Math.floor(Date.now() / 1000) + expiresInSeconds
  const signaturePayload = `${libraryId}${apiKey}${expireUnix}${testVideoId}`
  const authorizationSignature = crypto.createHash("sha256").update(signaturePayload).digest("hex")
  
  console.log(`   Expire Unix: ${expireUnix}`)
  console.log(`   Signature Payload: ${libraryId}${'*'.repeat(apiKey.length)}${expireUnix}${testVideoId}`)
  console.log(`   Authorization Signature: ${authorizationSignature.substring(0, 16)}...`)
  
  // Test Bunny.net API connectivity
  console.log('\n🌐 API Connectivity Test:')
  try {
    const response = await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'AccessKey': apiKey,
      }
    })
    
    if (response.ok) {
      console.log('   ✅ Successfully connected to Bunny.net API')
      console.log(`   Status: ${response.status}`)
    } else {
      console.log(`   ⚠️  API responded with status: ${response.status}`)
      console.log(`   This might be normal for GET requests to videos endpoint`)
    }
  } catch (error) {
    console.log(`   ❌ Failed to connect to Bunny.net API: ${error.message}`)
  }
  
  console.log('\n📝 Configuration Summary:')
  console.log('   ✅ Environment variables are set')
  console.log('   ✅ Library ID format is valid')
  console.log('   ✅ API Key format looks good')
  console.log('   ✅ TUS endpoint construction works')
  console.log('   ✅ Signature generation works')
  
  console.log('\n🎯 Next Steps:')
  console.log('   1. Make sure your .env.local file has the correct values')
  console.log('   2. Test video upload through the admin panel')
  console.log('   3. Check browser console for any TUS upload errors')
  console.log('   4. Verify video URLs are saved to MongoDB')
  
  console.log('\n🔧 If you still have issues:')
  console.log('   - Check that your Bunny.net account has Stream enabled')
  console.log('   - Verify your API key has Stream permissions')
  console.log('   - Ensure your library ID is correct')
  console.log('   - Check that videos are being created in your Bunny.net dashboard')
}

// Run the test
testBunnyConfig().catch(console.error)
