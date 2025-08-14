const { MongoClient } = require('mongodb')

async function testLessonCreation() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/training-center'
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log('✅ Connected to MongoDB')

    const db = client.db()
    const lessonsCollection = db.collection('lessons')
    const coursesCollection = db.collection('courses')

    // Find a test course or create one
    let testCourse = await coursesCollection.findOne({ title: { $regex: /test/i } })
    
    if (!testCourse) {
      console.log('📚 Creating test course...')
      testCourse = await coursesCollection.insertOne({
        title: 'Test Course for Video URL Testing',
        description: 'This course is for testing video URL saving',
        thumbnail: '/placeholder.svg',
        price: 0,
        duration: 30,
        category: 'other',
        level: 'beginner',
        language: 'mongolian',
        instructor: 'Test Instructor',
        requirements: ['Basic knowledge'],
        whatYouWillLearn: ['Testing video URLs'],
        published: true,
        status: 'active',
        studentsCount: 0,
        rating: 0,
        lessons: [],
        createdAt: new Date(),
        updatedAt: new Date()
      })
      console.log('✅ Test course created:', testCourse.insertedId)
    } else {
      console.log('📚 Found existing test course:', testCourse._id)
    }

    // Create a test lesson with a video URL
    console.log('🎥 Creating test lesson with video URL...')
    const testLesson = await lessonsCollection.insertOne({
      title: 'Test Lesson with Video URL',
      description: 'This lesson tests if video URLs are saved correctly',
      videoUrl: 'bunny:test-video-456',
      duration: 15,
      order: 1,
      course: testCourse._id || testCourse.insertedId,
      preview: true,
      createdAt: new Date()
    })

    console.log('✅ Test lesson created:', testLesson.insertedId)

    // Verify the lesson was saved with video URL
    const savedLesson = await lessonsCollection.findOne({ _id: testLesson.insertedId })
    console.log('💾 Saved lesson data:', {
      id: savedLesson._id,
      title: savedLesson.title,
      videoUrl: savedLesson.videoUrl,
      course: savedLesson.course
    })

    // Update the lesson to test update functionality
    console.log('🔄 Testing lesson update...')
    const updateResult = await lessonsCollection.updateOne(
      { _id: testLesson.insertedId },
      { 
        $set: { 
          videoUrl: 'bunny:updated-video-789',
          description: 'Updated description for testing'
        } 
      }
    )

    if (updateResult.modifiedCount > 0) {
      console.log('✅ Lesson updated successfully')
      
      // Verify the update
      const updatedLesson = await lessonsCollection.findOne({ _id: testLesson.insertedId })
      console.log('💾 Updated lesson data:', {
        id: updatedLesson._id,
        title: updatedLesson.title,
        videoUrl: updatedLesson.videoUrl,
        description: updatedLesson.description
      })
    } else {
      console.log('❌ Lesson update failed')
    }

    // Add lesson to course
    await coursesCollection.updateOne(
      { _id: testCourse._id || testCourse.insertedId },
      { $push: { lessons: testLesson.insertedId } }
    )
    console.log('✅ Lesson added to course')

    console.log('\n🎯 Test completed successfully!')
    console.log('📋 Summary:')
    console.log(`   Course ID: ${testCourse._id || testCourse.insertedId}`)
    console.log(`   Lesson ID: ${testLesson.insertedId}`)
    console.log(`   Final Video URL: ${updatedLesson ? updatedLesson.videoUrl : 'N/A'}`)

  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    await client.close()
    console.log('🔌 MongoDB connection closed')
  }
}

// Run the test
testLessonCreation()
