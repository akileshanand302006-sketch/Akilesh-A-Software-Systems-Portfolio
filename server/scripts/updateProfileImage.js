import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';

try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch {}

dotenv.config();

import { connectDB, getGridFSBucket } from '../src/config/database.js';
import FileMeta from '../src/models/FileMeta.js';
import Profile from '../src/models/Profile.js';

const imageSource = 'C:/My Projects/PortFolio/dist/profile.png';

function validatePng(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File does not exist: ${filePath}`);
  }
  const buffer = fs.readFileSync(filePath);
  const header = buffer.slice(0, 8).toString('hex');
  if (header !== '89504e470d0a1a0a') {
    throw new Error(`Invalid PNG header: ${header}`);
  }
  return buffer;
}

async function uploadImageToGridFS({ bucket, buffer, filename, originalName }) {
  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: 'image/png',
      metadata: {
        category: 'PROFILE_IMAGE',
        originalName,
      },
    });

    const gridFSId = uploadStream.id;

    uploadStream.on('error', (err) => reject(err));

    uploadStream.on('finish', async () => {
      try {
        const fileMeta = await FileMeta.create({
          filename,
          originalName,
          contentType: 'image/png',
          size: buffer.length,
          category: 'PROFILE_IMAGE',
          gridFSId,
        });
        resolve({ fileMeta, gridFSId });
      } catch (err) {
        reject(err);
      }
    });

    uploadStream.end(buffer);
  });
}

async function run() {
  console.log('🚀 [Profile Image Migration] Starting online profile image update in MongoDB Atlas / GridFS...');

  console.log('1. Validating new PNG image...');
  const imgBuffer = validatePng(imageSource);
  console.log(`✅ Profile image valid PNG (${imgBuffer.length} bytes): ${imageSource}`);

  console.log('2. Connecting to MongoDB Atlas...');
  const conn = await connectDB();
  if (!conn) {
    throw new Error('Could not connect to MongoDB Atlas');
  }
  console.log(`✅ Connected to DB: ${conn.name}`);

  const bucket = getGridFSBucket();

  // 3. Documenting existing records for backup
  console.log('3. Backing up existing profile image references...');
  const existingImageMetas = await FileMeta.find({ category: 'PROFILE_IMAGE' }).lean();
  console.log('Existing FileMeta PROFILE_IMAGE records:');
  existingImageMetas.forEach(m => {
    console.log(`   - ID: ${m._id} | filename: ${m.filename} | gridFSId: ${m.gridFSId} | size: ${m.size}`);
  });

  const currentProfile = await Profile.findOne().lean();
  console.log(`Current Profile profileImageId: ${currentProfile?.profileImageId}`);

  // 4. Upload new Profile PNG
  console.log('4. Uploading new Profile PNG to GridFS...');
  const imgUpload = await uploadImageToGridFS({
    bucket,
    buffer: imgBuffer,
    filename: 'profile.png',
    originalName: 'profile.png',
  });
  console.log(`✅ Profile image uploaded: GridFS ID = ${imgUpload.gridFSId}, FileMeta ID = ${imgUpload.fileMeta._id}`);

  // 5. Update Profile
  console.log('5. Updating Profile in MongoDB Atlas...');
  await Profile.updateOne({}, {
    $set: {
      profileImageId: imgUpload.fileMeta._id,
    }
  });
  console.log('✅ Profile document updated with new profileImageId');

  // 6. Verify uploaded file in GridFS
  console.log('6. Verifying uploaded GridFS file...');
  const verifyFiles = await bucket.find({ _id: imgUpload.gridFSId }).toArray();
  for (const f of verifyFiles) {
    console.log(`   - Found GridFS file: ${f.filename} | ID: ${f._id} | Content-Type: ${f.contentType} | Length: ${f.length} bytes`);
    if (f.contentType !== 'image/png') {
      throw new Error(`Verification failed: Content-Type is ${f.contentType}, expected image/png`);
    }
  }

  // 7. Safely remove old profile images from GridFS
  console.log('7. Cleaning up old superseded profile image in GridFS...');
  for (const oldMeta of existingImageMetas) {
    if (oldMeta.gridFSId && !oldMeta.gridFSId.equals(imgUpload.gridFSId)) {
      try {
        await bucket.delete(oldMeta.gridFSId);
        console.log(`   - Deleted old GridFS file: ${oldMeta.gridFSId} (${oldMeta.filename})`);
      } catch (err) {
        console.warn(`   - Could not delete old GridFS file ${oldMeta.gridFSId}: ${err.message}`);
      }
      await FileMeta.deleteOne({ _id: oldMeta._id });
      console.log(`   - Deleted old FileMeta record: ${oldMeta._id}`);
    }
  }

  console.log('🎉 [Success] MongoDB Atlas / GridFS updated with ONLY the new profile image!');
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(err => {
  console.error('❌ Error during profile image update:', err);
  process.exit(1);
});
