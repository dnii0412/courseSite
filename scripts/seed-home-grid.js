const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/newera';

async function seedHomeGrid() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    
    // Sample media data
    const sampleMedia = [
      {
        _id: new ObjectId(),
        type: 'image',
        cloudinaryPublicId: 'sample-1',
        url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop',
        alt: 'Online Learning Platform',
        width: 800,
        height: 600,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        type: 'image',
        cloudinaryPublicId: 'sample-2',
        url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
        alt: 'Students Learning',
        width: 800,
        height: 600,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        type: 'image',
        cloudinaryPublicId: 'sample-3',
        url: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=600&fit=crop',
        alt: 'Digital Education',
        width: 800,
        height: 600,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        type: 'image',
        cloudinaryPublicId: 'sample-4',
        url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop',
        alt: 'Learning Technology',
        width: 800,
        height: 600,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Insert media
    const mediaResult = await db.collection('media').insertMany(sampleMedia);
    console.log(`Inserted ${mediaResult.insertedCount} media items`);

    // Get the inserted media IDs
    const mediaIds = Object.values(mediaResult.insertedIds);

    // Sample layout data for home-hero
    const sampleLayout = {
      slug: 'home-hero',
      items: [
        {
          id: 'item_1',
          mediaId: mediaIds[0],
          startCol: 1,
          startRow: 1,
          colSpan: 3,
          rowSpan: 2,
          linkHref: '/courses',
          ariaLabel: 'Featured courses'
        },
        {
          id: 'item_2',
          mediaId: mediaIds[1],
          startCol: 4,
          startRow: 1,
          colSpan: 3,
          rowSpan: 2,
          linkHref: '/auth/register',
          ariaLabel: 'Join our platform'
        },
        {
          id: 'item_3',
          mediaId: mediaIds[2],
          startCol: 1,
          startRow: 3,
          colSpan: 2,
          rowSpan: 2,
          linkHref: '/about',
          ariaLabel: 'About our platform'
        },
        {
          id: 'item_4',
          mediaId: mediaIds[3],
          startCol: 3,
          startRow: 3,
          colSpan: 4,
          rowSpan: 2,
          linkHref: '/learn',
          ariaLabel: 'Start learning'
        }
      ],
      breakpoints: {
        sm: [
          {
            id: 'item_1_sm',
            mediaId: mediaIds[0],
            startCol: 1,
            startRow: 1,
            colSpan: 6,
            rowSpan: 2,
            linkHref: '/courses',
            ariaLabel: 'Featured courses'
          },
          {
            id: 'item_2_sm',
            mediaId: mediaIds[1],
            startCol: 1,
            startRow: 3,
            colSpan: 6,
            rowSpan: 2,
            linkHref: '/auth/register',
            ariaLabel: 'Join our platform'
          }
        ]
      },
      published: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert layout
    const layoutResult = await db.collection('layouts').insertOne(sampleLayout);
    console.log(`Inserted layout with ID: ${layoutResult.insertedId}`);

    console.log('Home grid seeding completed successfully!');
    
  } catch (error) {
    console.error('Error seeding home grid:', error);
  } finally {
    await client.close();
  }
}

seedHomeGrid();
