import mongoose from 'mongoose';
import dns from 'dns';

// Ensure Google Public DNS is used for reliable Atlas SRV lookups on Windows
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch {
  // Ignore in environments where setting servers is restricted
}

let gridFSBucket = null;

/**
 * Connects to MongoDB Atlas securely.
 * Reuses connection if already connected.
 */
export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.warn('⚠️ [MongoDB Atlas] MONGODB_URI is not defined in environment variables. Running in offline/fallback mode.');
    return null;
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
      autoIndex: true,
    });

    console.log('✅ MongoDB connected successfully to database:', conn.connection.name);

    // Initialize GridFS Bucket for media/files
    gridFSBucket = new mongoose.mongo.GridFSBucket(conn.connection.db, {
      bucketName: 'uploads',
    });

    return conn.connection;
  } catch (error) {
    console.error('❌ [MongoDB Atlas] Connection failed:', error.message);
    return null;
  }
}

/**
 * Returns the active GridFSBucket instance.
 */
export function getGridFSBucket() {
  if (!gridFSBucket && mongoose.connection.readyState === 1) {
    gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads',
    });
  }
  return gridFSBucket;
}

/**
 * Checks if the database is connected.
 */
export function isDBConnected() {
  return mongoose.connection.readyState === 1;
}
