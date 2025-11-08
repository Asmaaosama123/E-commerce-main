const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use either DATABASE_URI or MONGO_URI, with fallback
    const uri = process.env.DATABASE_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce-store';
    
    console.log('🔗 Attempting to connect to MongoDB...');
    console.log('🔗 Using URI:', uri.replace(/mongodb:\/\/([^:]+):([^@]+)@/, 'mongodb://***:***@'));
    
    if (!uri || typeof uri !== 'string') {
      throw new Error(`Invalid database URI: ${uri}`);
    }

    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    console.log('💡 Make sure MongoDB is running:');
    console.log('   - Run "mongod" in a separate terminal');
    console.log('   - Or run "net start MongoDB" on Windows');
  }
};

module.exports = connectDB;