const { MongoClient } = require('mongodb');

// MongoDB connection string - replace with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/training-center';

async function testEnrollment() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const users = db.collection('users');
    const courses = db.collection('courses');
    
    // Find the user k2naysaa@gmail.com
    const user = await users.findOne({ email: 'k2naysaa@gmail.com' });
    if (!user) {
      console.log('User k2naysaa@gmail.com not found');
      return;
    }
    console.log('Found user:', user.name, user.email);
    
    // Find a test course (you can modify this to find a specific course)
    let testCourse = await courses.findOne({ 
      $or: [
        { title: { $regex: /test/i } },
        { title: { $regex: /тест/i } },
        { price: 0 } // Free courses
      ]
    });
    
    if (!testCourse) {
      console.log('No test course found. Creating a simple test course...');
      
      // Create a simple test course
      const testCourseData = {
        title: 'Тест хичээл - Test Course',
        description: 'Энэ бол тестийн зорилгоор үүсгэгдсэн хичээл юм. This is a test course created for testing purposes.',
        thumbnail: '/placeholder.svg',
        price: 0, // Free
        duration: 30, // 30 minutes
        category: 'other',
        level: 'beginner',
        language: 'mongolian',
        instructor: 'Test Instructor',
        requirements: ['Баз мэдлэг Basic knowledge'],
        whatYouWillLearn: ['Тестийн зорилгоор сурах Learn for testing purposes'],
        published: true,
        status: 'active',
        studentsCount: 0,
        rating: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await courses.insertOne(testCourseData);
      testCourse = { ...testCourseData, _id: result.insertedId };
      console.log('Created test course:', testCourse.title);
    } else {
      console.log('Found test course:', testCourse.title);
    }
    
    // Check if user is already enrolled
    const isEnrolled = user.enrolledCourses && 
      user.enrolledCourses.some(id => id.toString() === testCourse._id.toString());
    
    if (isEnrolled) {
      console.log('User is already enrolled in this course');
      return;
    }
    
    // Enroll user in the course
    await users.updateOne(
      { _id: user._id },
      { $addToSet: { enrolledCourses: testCourse._id } }
    );
    
    // Increment course studentsCount
    await courses.updateOne(
      { _id: testCourse._id },
      { $inc: { studentsCount: 1 } }
    );
    
    console.log(`Successfully enrolled ${user.email} in course: ${testCourse.title}`);
    console.log('Course ID:', testCourse._id.toString());
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the test enrollment
testEnrollment().catch(console.error);
