import dotenv from 'dotenv';
import dns from 'dns';
try { dns.setServers(['8.8.8.8', '8.8.4.4']); } catch {}
dotenv.config();
import { connectDB, getGridFSBucket } from '../src/config/database.js';
import FileMeta from '../src/models/FileMeta.js';
import Profile from '../src/models/Profile.js';
import mongoose from 'mongoose';

async function inspect() {
  await connectDB();
  const bucket = getGridFSBucket();
  console.log('=== GridFS Files (bucket: uploads) ===');
  const files = await bucket.find().toArray();
  files.forEach(f => console.log(JSON.stringify({
    id: f._id,
    filename: f.filename,
    contentType: f.contentType,
    length: f.length,
    uploadDate: f.uploadDate,
    metadata: f.metadata
  })));

  console.log('=== FileMeta Documents ===');
  const metas = await FileMeta.find().lean();
  metas.forEach(m => console.log(JSON.stringify({
    id: m._id,
    filename: m.filename,
    originalName: m.originalName,
    category: m.category,
    contentType: m.contentType,
    gridFSId: m.gridFSId,
    createdAt: m.createdAt
  })));

  console.log('=== Profile Document ===');
  const profile = await Profile.findOne().lean();
  if (profile) {
    console.log(JSON.stringify({
      id: profile._id,
      name: profile.name,
      resumeFileId: profile.resumeFileId,
      profileImageId: profile.profileImageId
    }));
  }

  await mongoose.disconnect();
}

inspect().catch(err => {
  console.error(err);
  process.exit(1);
});
