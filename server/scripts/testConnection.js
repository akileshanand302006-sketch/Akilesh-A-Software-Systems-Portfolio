import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';

// Fix for Windows DNS SRV lookup on local networks
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  console.log('🔄 Attempting connection to MongoDB Atlas...');

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log('✅ Connection successful!');
    console.log('Database name:', conn.connection.name);
    console.log('Host:', conn.connection.host);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection error message:', error.message);
    process.exit(1);
  }
}

testConnection();
