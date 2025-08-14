# Video URL Saving Fix - README

## 🚨 Problem Identified

**Issue**: When creating or updating lessons through the admin panel, video URLs were not being saved to MongoDB properly. This caused lessons to appear without video content, making them unwatchable.

## 🔍 Root Cause Analysis

### 1. **Lesson Update Logic Missing videoUrl**
- In `components/admin/lesson-management.tsx`, the `handleUpdateLesson` function was using `...newLesson` spread operator
- This was missing the `videoUrl` field during updates, causing it to be lost
- The API was receiving incomplete data

### 2. **Insufficient Debugging**
- No logging to track what data was being sent/received
- Difficult to identify where the videoUrl was getting lost
- No validation that videoUrl was being saved to database

## ✅ Fixes Implemented

### 1. **Fixed Lesson Update Logic**
```typescript
// BEFORE (problematic):
body: JSON.stringify({
  ...newLesson,
  duration: Number(newLesson.duration),
  order: Number(newLesson.order)
})

// AFTER (fixed):
body: JSON.stringify({
  title: newLesson.title,
  description: newLesson.description,
  videoUrl: newLesson.videoUrl, // Explicitly include videoUrl
  duration: Number(newLesson.duration),
  order: Number(newLesson.order),
  preview: newLesson.preview
})
```

### 2. **Enhanced API Debugging**
- Added comprehensive logging to `/api/lessons/route.ts` (creation)
- Added comprehensive logging to `/api/lessons/[id]/route.ts` (updates)
- Shows exactly what data is received and saved

### 3. **Created Test Script**
- `scripts/test-lesson-creation.js` - Tests lesson creation and updates
- Verifies video URLs are saved correctly
- Tests both creation and update operations

## 🧪 Testing the Fix

### **Option 1: Run Test Script**
```bash
npm run test-lesson
```

This will:
- Create a test course
- Create a test lesson with video URL
- Update the lesson with a new video URL
- Verify all data is saved correctly

### **Option 2: Test Through Admin Panel**
1. Go to `/admin/courses`
2. Create a new course or edit existing
3. Add a lesson with video URL (e.g., `bunny:test-video-123`)
4. Save and verify the video URL is preserved
5. Edit the lesson and change the video URL
6. Verify the update works correctly

### **Option 3: Check Console Logs**
When creating/updating lessons, you'll now see detailed logs:
```
📝 Creating lesson with data: { title: "...", videoUrl: "bunny:..." }
🎥 Video URL for new lesson: bunny:test-video-123
💾 Saving lesson data to database: { ... }
✅ Lesson saved to database: { videoUrl: "bunny:test-video-123" }
```

## 🔧 How to Use

### **Creating Lessons with Video URLs**
1. **Format**: Use `bunny:video-id` format for Bunny.net videos
2. **Example**: `bunny:test-video-123`, `bunny:course-lesson-456`
3. **Required**: All fields including `videoUrl` must be filled

### **Updating Lessons**
1. **Edit**: Click edit on any lesson
2. **Modify**: Change title, description, video URL, etc.
3. **Save**: All fields including `videoUrl` will be preserved

### **Verifying Data**
1. **Check Console**: Look for the detailed logging
2. **Database**: Verify in MongoDB that `videoUrl` field exists
3. **Frontend**: Lesson should display with video player

## 🐛 Troubleshooting

### **Video URL Still Not Saving**
1. **Check Console**: Look for error messages in browser console
2. **Check Network**: Verify API calls are successful
3. **Check Database**: Directly query MongoDB to see what's saved
4. **Run Test Script**: Use `npm run test-lesson` to verify functionality

### **Common Issues**
- **Missing videoUrl**: Ensure the field is filled in the form
- **Invalid Format**: Use `bunny:video-id` format
- **Permission Error**: Ensure you're logged in as admin
- **Database Error**: Check MongoDB connection and logs

### **Debug Commands**
```bash
# Test lesson creation and updates
npm run test-lesson

# Test user enrollment
npm run test-enroll

# Check MongoDB directly
mongosh "your-connection-string"
use training-center
db.lessons.find({}).pretty()
```

## 📋 Files Modified

1. **`components/admin/lesson-management.tsx`**
   - Fixed `handleUpdateLesson` to explicitly include `videoUrl`
   - Added proper field mapping for updates

2. **`app/api/lessons/route.ts`**
   - Added comprehensive logging for lesson creation
   - Shows exactly what data is received and saved

3. **`app/api/lessons/[id]/route.ts`**
   - Added comprehensive logging for lesson updates
   - Shows update data and final saved state

4. **`scripts/test-lesson-creation.js`** (New)
   - Tests lesson creation and update functionality
   - Verifies video URLs are saved correctly

5. **`package.json`**
   - Added `test-lesson` script for easy testing

## 🎯 Expected Results

After implementing these fixes:

✅ **Video URLs are preserved** during lesson creation and updates  
✅ **Comprehensive logging** shows exactly what's happening  
✅ **Test script** verifies functionality works correctly  
✅ **Admin panel** properly saves all lesson data  
✅ **Lessons are watchable** with proper video content  

## 🚀 Next Steps

1. **Test the fix** using the admin panel
2. **Run the test script** to verify functionality
3. **Check console logs** for detailed debugging info
4. **Create real lessons** with actual video URLs
5. **Monitor for any remaining issues**

## 📞 Support

If you continue to experience issues:
1. Check the console logs for detailed error messages
2. Run the test script to isolate the problem
3. Verify MongoDB connection and permissions
4. Check that all required fields are filled in forms

The enhanced logging should make it much easier to identify and resolve any remaining issues!
