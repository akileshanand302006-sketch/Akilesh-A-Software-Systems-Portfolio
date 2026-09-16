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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sdeSource = 'C:/My Projects/PortFolio/dist/resumes/Akilesh A SDE Resume.pdf';
const dataSource = 'C:/My Projects/PortFolio/dist/resumes/Akilesh A Data Resume.pdf';

function validatePdf(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File does not exist: ${filePath}`);
  }
  const ext = path.extname(filePath).toLowerCase();
  if (ext !== '.pdf') {
    throw new Error(`Invalid extension '${ext}' for file ${filePath}. Expected .pdf`);
  }
  const buffer = fs.readFileSync(filePath);
  const header = buffer.slice(0, 5).toString('utf8');
  if (header !== '%PDF-') {
    throw new Error(`Invalid PDF header '${header}' for file ${filePath}. Must be %PDF-`);
  }
  return buffer;
}

async function uploadPdfToGridFS({ bucket, buffer, filename, originalName, resumeType }) {
  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: 'application/pdf',
      metadata: {
        category: 'RESUME',
        resumeType,
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
          contentType: 'application/pdf',
          size: buffer.length,
          category: 'RESUME',
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
  console.log('🚀 [Resume Migration] Starting online resume update in MongoDB Atlas / GridFS...');

  console.log('1. Validating new PDF files...');
  const sdeBuffer = validatePdf(sdeSource);
  console.log(`✅ SDE Resume valid PDF (${sdeBuffer.length} bytes): ${sdeSource}`);

  const dataBuffer = validatePdf(dataSource);
  console.log(`✅ Data Resume valid PDF (${dataBuffer.length} bytes): ${dataSource}`);

  console.log('2. Connecting to MongoDB Atlas...');
  const conn = await connectDB();
  if (!conn) {
    throw new Error('Could not connect to MongoDB Atlas');
  }
  console.log(`✅ Connected to DB: ${conn.name}`);

  const bucket = getGridFSBucket();

  // 3. Documenting existing records for backup
  console.log('3. Backing up existing resume references...');
  const existingResumeMetas = await FileMeta.find({ category: 'RESUME' }).lean();
  console.log('Existing FileMeta RESUME records:');
  existingResumeMetas.forEach(m => {
    console.log(`   - ID: ${m._id} | filename: ${m.filename} | gridFSId: ${m.gridFSId} | created: ${m.createdAt}`);
  });

  const currentProfile = await Profile.findOne().lean();
  console.log(`Current Profile resumeFileId: ${currentProfile?.resumeFileId}`);

  // 4. Upload SDE Resume PDF
  console.log('4. Uploading new SDE Resume PDF to GridFS...');
  const sdeUpload = await uploadPdfToGridFS({
    bucket,
    buffer: sdeBuffer,
    filename: 'Akilesh_A_SDE_Resume.pdf',
    originalName: 'Akilesh A SDE Resume.pdf',
    resumeType: 'sde',
  });
  console.log(`✅ SDE Resume uploaded: GridFS ID = ${sdeUpload.gridFSId}, FileMeta ID = ${sdeUpload.fileMeta._id}`);

  // 5. Upload Data Resume PDF
  console.log('5. Uploading new Data Resume PDF to GridFS...');
  const dataUpload = await uploadPdfToGridFS({
    bucket,
    buffer: dataBuffer,
    filename: 'Akilesh_A_Data_Resume.pdf',
    originalName: 'Akilesh A Data Resume.pdf',
    resumeType: 'data',
  });
  console.log(`✅ Data Resume uploaded: GridFS ID = ${dataUpload.gridFSId}, FileMeta ID = ${dataUpload.fileMeta._id}`);

  // 6. Update Profile
  console.log('6. Updating Profile in MongoDB Atlas...');
  await Profile.updateOne({}, {
    $set: {
      resumeFileId: sdeUpload.fileMeta._id,
      dataResumeFileId: dataUpload.fileMeta._id,
    }
  });
  console.log('✅ Profile document updated with new resume IDs');

  // 7. Verification of uploaded files in GridFS
  console.log('7. Verifying uploaded GridFS files...');
  const verifyFiles = await bucket.find({ _id: { $in: [sdeUpload.gridFSId, dataUpload.gridFSId] } }).toArray();
  for (const f of verifyFiles) {
    console.log(`   - Found GridFS file: ${f.filename} | ID: ${f._id} | Content-Type: ${f.contentType} | Length: ${f.length} bytes`);
    if (f.contentType !== 'application/pdf') {
      throw new Error(`Verification failed: Content-Type is ${f.contentType}, expected application/pdf`);
    }
  }

  // 8. Safely remove old SDE resume files if no longer needed
  console.log('8. Cleaning up old superseded SDE resume in GridFS...');
  for (const oldMeta of existingResumeMetas) {
    if (oldMeta.gridFSId && !oldMeta.gridFSId.equals(sdeUpload.gridFSId) && !oldMeta.gridFSId.equals(dataUpload.gridFSId)) {
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

  console.log('🎉 [Success] MongoDB Atlas / GridFS updated with ONLY the new PDF resumes!');
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(err => {
  console.error('❌ Error during resume update:', err);
  process.exit(1);
});
