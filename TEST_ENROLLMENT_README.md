# Test Enrollment System

This system allows administrators to easily enroll users in test courses for testing purposes.

## How to Use

### 1. Access the Test Enrollment Page

1. Go to `/admin/test-enrollment` in your admin panel
2. You'll see a form with two fields:
   - User Email: The email of the user to enroll
   - Course ID: The ID of the course to enroll them in

### 2. Quick Test Enrollment

For the user `k2naysaa@gmail.com`, you can use the "Тест бүртгэл (k2naysaa@gmail.com)" button which will:
1. Create a test course if one doesn't exist
2. Create a test lesson for that course
3. Enroll the user automatically

### 3. Manual Enrollment

1. Enter the user's email address
2. Enter the course ID (or use 'test-course' to create a new test course)
3. Click "Бүртгэх" (Enroll)

### 4. API Usage

You can also use the API directly:

```bash
# Using curl
curl -X POST http://localhost:3000/api/test/enroll \
  -H "Content-Type: application/json" \
  -d '{
    "userEmail": "k2naysaa@gmail.com",
    "courseId": "test-course"
  }'

# Or using the npm script
npm run test-enroll
```

## Quick Test Commands

```bash
# Test enrollment via API
curl -X POST http://localhost:3000/api/test/enroll \
  -H "Content-Type: application/json" \
  -d '{"userEmail": "k2naysaa@gmail.com", "courseId": "test-course"}'

# Check if user has access (after enrollment)
curl http://localhost:3000/api/enrollments/check/[COURSE_ID] \
  -H "Cookie: [your-auth-cookie]"
```

## What Happens

1. **User Verification**: The system checks if the user exists
2. **Course Creation**: If `courseId` is 'test-course', it creates a new test course with:
   - Title: "Тест хичээл - Test Course"
   - Price: 0 (Free)
   - Duration: 30 minutes
   - A test lesson with preview enabled
3. **Enrollment**: The user is added to the course's enrolled users
4. **Access Granted**: The user can now access the course and lessons without payment

## Test Course Details

- **Title**: Тест хичээл - Test Course
- **Description**: Энэ бол тестийн зорилгоор үүсгэгдсэн хичээл юм
- **Price**: Free (0 MNT)
- **Category**: Other
- **Level**: Beginner
- **Language**: Mongolian
- **Instructor**: Test Instructor

## Test Lesson Details

- **Title**: Тест хичээл 1 - Test Lesson 1
- **Duration**: 15 minutes
- **Preview**: Enabled (can be viewed without full enrollment)
- **Video URL**: Placeholder URL (https://example.com/test-video.mp4)

## Troubleshooting

### User Not Found
- Make sure the user email exists in the database
- Check for typos in the email address

### Course Not Found
- Use 'test-course' as courseId to automatically create a test course
- Or provide a valid existing course ID

### Already Enrolled
- The system will show a message if the user is already enrolled
- No duplicate enrollments are created

## Security Notes

- This system is for testing purposes only
- Test courses are marked as free (price: 0)
- Test lessons have preview enabled
- Only administrators should have access to this page

## Database Changes

The system modifies:
- `users.enrolledCourses` array
- `courses.studentsCount` field
- Creates new courses and lessons if needed

## Access Control

The `hasCourseAccess` function checks the user's `enrolledCourses` array to determine access. Once enrolled, users can:
- View the course overview
- Access all lessons in the course
- Complete lessons and track progress
