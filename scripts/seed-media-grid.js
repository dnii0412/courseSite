const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

async function seedMediaGrid() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI environment variable is required');
    process.exit(1);
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    
    // Clear existing data
    await db.collection('media').deleteMany({});
    await db.collection('layouts').deleteMany({});
    console.log('Cleared existing data');

    // Sample media data (using reliable placeholder services)
    const sampleMedia = [
      {
        type: 'image',
        cloudinaryPublicId: 'sample-image-1',
        url: 'https://picsum.photos/800/600?random=1',
        alt: 'Student studying with laptop',
        width: 800,
        height: 600,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'image',
        cloudinaryPublicId: 'sample-image-2',
        url: 'https://picsum.photos/800/600?random=2',
        alt: 'Group of students collaborating',
        width: 800,
        height: 600,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'image',
        cloudinaryPublicId: 'sample-image-3',
        url: 'https://picsum.photos/800/600?random=3',
        alt: 'Online learning platform',
        width: 800,
        height: 600,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'video',
        cloudinaryPublicId: 'sample-video-1',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        posterUrl: 'https://picsum.photos/400/300?random=4',
        alt: 'Introduction to online learning',
        width: 1280,
        height: 720,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Insert media
    const mediaResult = await db.collection('media').insertMany(sampleMedia);
    console.log(`Inserted ${mediaResult.insertedCount} media items`);

    // Get the inserted media IDs
    const mediaIds = Object.values(mediaResult.insertedIds);

    // Sample layout data
    const sampleLayout = {
      slug: 'home-hero',
      items: [
        {
          id: 'item_1',
          mediaId: mediaIds[0], // First image
          startCol: 1,
          startRow: 1,
          colSpan: 3,
          rowSpan: 2,
          linkHref: '/courses',
          ariaLabel: 'Featured course content'
        },
        {
          id: 'item_2',
          mediaId: mediaIds[1], // Second image
          startCol: 4,
          startRow: 1,
          colSpan: 3,
          rowSpan: 2,
          linkHref: '/auth/register',
          ariaLabel: 'Join our learning community'
        },
        {
          id: 'item_3',
          mediaId: mediaIds[2], // Third image
          startCol: 1,
          startRow: 3,
          colSpan: 2,
          rowSpan: 2,
          linkHref: '/learn',
          ariaLabel: 'Start learning today'
        },
        {
          id: 'item_4',
          mediaId: mediaIds[3], // Video
          startCol: 3,
          startRow: 3,
          colSpan: 4,
          rowSpan: 2,
          linkHref: '/about',
          ariaLabel: 'Learn more about our platform'
        }
      ],
      breakpoints: {
        sm: [
          {
            id: 'item_1_sm',
            mediaId: mediaIds[0],
            startCol: 1,
            startRow: 1,
            colSpan: 2,
            rowSpan: 3,
            linkHref: '/courses',
            ariaLabel: 'Featured course content'
          },
          {
            id: 'item_2_sm',
            mediaId: mediaIds[1],
            startCol: 3,
            startRow: 1,
            colSpan: 2,
            rowSpan: 3,
            linkHref: '/auth/register',
            ariaLabel: 'Join our learning community'
          },
          {
            id: 'item_3_sm',
            mediaId: mediaIds[2],
            startCol: 5,
            startRow: 1,
            colSpan: 2,
            rowSpan: 3,
            linkHref: '/learn',
            ariaLabel: 'Start learning today'
          },
          {
            id: 'item_4_sm',
            mediaId: mediaIds[3],
            startCol: 1,
            startRow: 4,
            colSpan: 6,
            rowSpan: 1,
            linkHref: '/about',
            ariaLabel: 'Learn more about our platform'
          }
        ],
        md: [
          {
            id: 'item_1_md',
            mediaId: mediaIds[0],
            startCol: 1,
            startRow: 1,
            colSpan: 2,
            rowSpan: 2,
            linkHref: '/courses',
            ariaLabel: 'Featured course content'
          },
          {
            id: 'item_2_md',
            mediaId: mediaIds[1],
            startCol: 3,
            startRow: 1,
            colSpan: 2,
            rowSpan: 2,
            linkHref: '/auth/register',
            ariaLabel: 'Join our learning community'
          },
          {
            id: 'item_3_md',
            mediaId: mediaIds[2],
            startCol: 5,
            startRow: 1,
            colSpan: 2,
            rowSpan: 2,
            linkHref: '/learn',
            ariaLabel: 'Start learning today'
          },
          {
            id: 'item_4_md',
            mediaId: mediaIds[3],
            startCol: 1,
            startRow: 3,
            colSpan: 6,
            rowSpan: 2,
            linkHref: '/about',
            ariaLabel: 'Learn more about our platform'
          }
        ]
      },
      published: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert layout
    const layoutResult = await db.collection('layouts').insertOne(sampleLayout);
    console.log(`Inserted layout: ${layoutResult.insertedId}`);

    console.log('✅ Media grid seeding completed successfully!');
    console.log('\nSample data created:');
    console.log(`- ${sampleMedia.length} media items`);
    console.log('- 1 layout (home-hero) with responsive breakpoints');
    console.log('- Layout is published and ready for public viewing');
    console.log('\nYou can now:');
    console.log('1. Visit /media-grid/home-hero to see the public grid');
    console.log('2. Go to /admin/media-grid to manage layouts');
    console.log('3. Upload real media through the admin interface');

  } catch (error) {
    console.error('Error seeding media grid:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

seedMediaGrid();
