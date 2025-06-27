// Load environment variables
require('dotenv').config({ path: '.env.local' });

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/treasury-simulator';

async function checkMongoConnection() {
  try {
    console.log('Checking MongoDB connection...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB is running and accessible!');
    console.log(`Connected to: ${MONGODB_URI}`);
    
    // Test database operations
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`Database contains ${collections.length} collections`);
    
    await mongoose.disconnect();
    console.log('Connection test completed successfully.');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('\n📋 Troubleshooting steps:');
    console.log('1. Make sure MongoDB is installed and running');
    console.log('2. Start MongoDB with: sudo systemctl start mongod (Linux) or brew services start mongodb-community (macOS)');
    console.log('3. Or run MongoDB locally with: mongod');
    console.log('4. Check if the connection string is correct');
    console.log('5. Ensure MongoDB is listening on the default port 27017');
  }
}

if (require.main === module) {
  checkMongoConnection();
}

module.exports = { checkMongoConnection }; 