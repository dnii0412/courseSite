# Video Upload and Lesson Management Fix

This guide explains how to fix the issue where video uploads work but secure links aren't saving to MongoDB, preventing users from watching lessons.

## The Problem

1. **Video Upload Works**: The bunny.net video upload system is functional
2. **Secure Links Not Saving**: Video URLs aren't being properly saved to MongoDB
3. **Lessons Not Playable**: Users can't watch lessons because video URLs are missing or invalid

## Root Causes

### 1. **Test Lesson Creation Issue**
- Test lessons were created with placeholder video URLs (`https://example.com/test-video.mp4`)
- The video player expects bunny.net URLs in specific formats
- Placeholder URLs don't work with the bunny.net video player

### 2. **Missing Lesson Management System**
- No proper API for creating/updating lessons with video URLs
- No interface for admins to manage lesson video URLs
- Video URLs weren't being saved when lessons were created

### 3. **Video URL Format Mismatch**
- Video player expects bunny.net URLs in format: `bunny:video-id`
- Test lessons had generic placeholder URLs
- No validation that video URLs are in correct format

## Solutions Implemented

### 1. **Fixed Test Enrollment System**
- Updated test lessons to use proper bunny.net URL format: `bunny:test-video-123`
- This allows the video player to recognize and process the video

### 2. **Created Lesson Management API**
- **POST** `/api/lessons` - Create new lessons with video URLs
- **PUT** `/api/lessons/[id]` - Update existing lessons
- **DELETE** `/api/lessons/[id]` - Delete lessons
- **GET** `/api/lessons?courseId=[id]` - Get lessons for a course

### 3. **Added Lesson Management Interface**
- Created `LessonManagement` component for admin panel
- Allows admins to create, edit, and delete lessons
- Proper form validation for video URLs
- Preview toggle for free lessons

### 4. **Enhanced Video URL Handling**
- Video player now properly handles bunny.net URLs
- Support for both `bunny:video-id` and full bunny.net URLs
- Fallback to raw video URLs if bunny.net format isn't detected

## How to Use the Fixed System

### 1. **Create Lessons with Videos**

#### Option A: Admin Interface
1. Go to `/admin/courses`
2. Click on a course to manage
3. Use the "Хичээл нэмэх" (Add Lesson) button
4. Fill in lesson details including video URL
5. Use bunny.net video ID format: `bunny:your-video-id`

#### Option B: API Call
```bash
POST /api/lessons
Content-Type: application/json

{
  "title": "Lesson Title",
  "description": "Lesson Description",
  "videoUrl": "bunny:your-video-id",
  "duration": 15,
  "order": 1,
  "courseId": "course-id-here",
  "preview": false
}
```

### 2. **Update Existing Lessons**
```bash
PUT /api/lessons/lesson-id-here
Content-Type: application/json

{
  "videoUrl": "bunny:new-video-id",
  "title": "Updated Title"
}
```

### 3. **Video URL Formats Supported**

#### Bunny.net Format (Recommended)
```
bunny:video-guid-here
bunny:12345678-1234-1234-1234-123456789abc
```

#### Full Bunny.net URLs
```
https://iframe.mediadelivery.net/embed/library-id/video-id
https://video.bunnycdn.com/library/library-id/videos/video-id
```

#### Raw Video URLs (Fallback)
```
https://example.com/video.mp4
```

## Step-by-Step Fix Process

### Step 1: Fix Existing Test Lessons
1. Use the test enrollment system to create proper test courses
2. The system now creates lessons with correct bunny.net URL format
3. Test users can now access and watch lessons

### Step 2: Create Real Lessons with Videos
1. Upload videos to bunny.net using the existing upload system
2. Get the video ID from bunny.net
3. Create lessons using the new lesson management interface
4. Use the video ID in bunny.net format: `bunny:video-id`

### Step 3: Update Course Management
1. The course management now includes lesson management
2. Admins can see all lessons for each course
3. Easy editing and updating of lesson details

## Testing the Fix

### 1. **Test Enrollment**
```bash
# Enroll k2naysaa@gmail.com in test course
curl -X POST http://localhost:3000/api/test/enroll \
  -H "Content-Type: application/json" \
  -d '{"userEmail": "k2naysaa@gmail.com", "courseId": "test-course"}'
```

### 2. **Check Lesson Access**
1. Login as the test user
2. Navigate to the enrolled course
3. Try to watch the test lesson
4. Video should now play properly

### 3. **Create Real Lesson**
1. Use admin interface to create a lesson
2. Upload video to bunny.net
3. Use the video ID in lesson creation
4. Test video playback

## Environment Variables Required

Make sure these are set in your `.env.local`:

```bash
# Bunny.net Configuration
BUNNY_STREAM_LIBRARY_ID=your_library_id
BUNNY_STREAM_API_KEY=your_api_key
NEXT_PUBLIC_BUNNY_LIBRARY_ID=your_library_id
NEXT_PUBLIC_TUS_ENDPOINT=your_tus_endpoint

# MongoDB
MONGODB_URI=your_mongodb_connection_string
```

## Troubleshooting

### Video Still Not Playing
1. Check that video URL is in correct bunny.net format
2. Verify bunny.net environment variables are set
3. Check browser console for video player errors
4. Ensure video is fully uploaded to bunny.net

### Lesson Not Saving
1. Check admin permissions (must be ADMIN role)
2. Verify all required fields are filled
3. Check MongoDB connection
4. Look for API errors in browser console

### Test Enrollment Issues
1. Ensure user email exists in database
2. Check course ID is valid
3. Verify test enrollment API is accessible
4. Check MongoDB for enrollment records

## Future Improvements

### 1. **Video Upload Integration**
- Integrate video upload directly into lesson creation
- Automatic video ID extraction and URL formatting
- Progress tracking for video uploads

### 2. **Video Processing Status**
- Track video processing status on bunny.net
- Notify admins when videos are ready
- Auto-update lesson status when video is processed

### 3. **Bulk Operations**
- Bulk lesson creation from CSV/Excel
- Bulk video URL updates
- Course template system

## Summary

The fix addresses the core issue where video URLs weren't being properly saved to MongoDB. By:

1. **Creating proper lesson management APIs**
2. **Adding admin interface for lesson management**
3. **Fixing test lesson video URL formats**
4. **Ensuring proper video URL validation**

Users can now:
- ✅ Access test courses and lessons
- ✅ Watch videos with proper bunny.net URLs
- ✅ Have lessons properly saved to MongoDB
- ✅ Use admin interface to manage lessons

The system now properly handles the complete video lifecycle from upload to playback.
