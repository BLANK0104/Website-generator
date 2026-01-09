// Script to reset the GeneratedWebsite collection schema
require('dotenv').config();
const mongoose = require('mongoose');

async function resetSchema() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/website-generator');
    console.log('✅ Connected to MongoDB');

    // Drop the generatedwebsites collection
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionExists = collections.some(col => col.name === 'generatedwebsites');
    
    if (collectionExists) {
      console.log('Dropping old generatedwebsites collection...');
      await mongoose.connection.db.dropCollection('generatedwebsites');
      console.log('✅ Collection dropped');
    } else {
      console.log('Collection does not exist, nothing to drop');
    }

    console.log('✅ Schema reset complete! You can now restart your server.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

resetSchema();
