const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function initializeDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create collections by inserting and immediately removing a document
    console.log('Initializing collections...');
    
    // Users collection
    try {
      await mongoose.connection.db.createCollection('users');
      console.log('✓ Users collection created');
    } catch (e) {
      console.log('Users collection already exists');
    }

    // Courses collection
    try {
      await mongoose.connection.db.createCollection('courses');
      console.log('✓ Courses collection created');
    } catch (e) {
      console.log('Courses collection already exists');
    }

    // Orders collection
    try {
      await mongoose.connection.db.createCollection('orders');
      console.log('✓ Orders collection created');
    } catch (e) {
      console.log('Orders collection already exists');
    }

    // Media collection
    try {
      await mongoose.connection.db.createCollection('media');
      console.log('✓ Media collection created');
    } catch (e) {
      console.log('Media collection already exists');
    }

    // Layouts collection
    try {
      await mongoose.connection.db.createCollection('layouts');
      console.log('✓ Layouts collection created');
    } catch (e) {
      console.log('Layouts collection already exists');
    }

    // Enrollments collection
    try {
      await mongoose.connection.db.createCollection('enrollments');
      console.log('✓ Enrollments collection created');
    } catch (e) {
      console.log('Enrollments collection already exists');
    }

    // Lessons collection
    try {
      await mongoose.connection.db.createCollection('lessons');
      console.log('✓ Lessons collection created');
    } catch (e) {
      console.log('Lessons collection already exists');
    }

    // Billing collections
    try {
      await mongoose.connection.db.createCollection('billingsettings');
      console.log('✓ BillingSettings collection created');
    } catch (e) {
      console.log('BillingSettings collection already exists');
    }

    try {
      await mongoose.connection.db.createCollection('billingevents');
      console.log('✓ BillingEvents collection created');
    } catch (e) {
      console.log('BillingEvents collection already exists');
    }

    // Create indexes
    console.log('Creating indexes...');
    
    // Users index
    try {
      await mongoose.connection.db.collection('users').createIndex({ email: 1 }, { unique: true });
      console.log('✓ Users email index created');
    } catch (e) {
      console.log('Users email index already exists');
    }

    // Courses index
    try {
      await mongoose.connection.db.collection('courses').createIndex({ title: 1 });
      console.log('✓ Courses title index created');
    } catch (e) {
      console.log('Courses title index already exists');
    }

    // Media index
    try {
      await mongoose.connection.db.collection('media').createIndex({ filename: 1 });
      console.log('✓ Media filename index created');
    } catch (e) {
      console.log('Media filename index already exists');
    }

    // Layouts index
    try {
      await mongoose.connection.db.collection('layouts').createIndex({ slug: 1 }, { unique: true });
      console.log('✓ Layouts slug index created');
    } catch (e) {
      console.log('Layouts slug index already exists');
    }

    console.log('\n✅ Database initialization complete!');
    console.log('You can now start your Next.js application.');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

initializeDatabase();
