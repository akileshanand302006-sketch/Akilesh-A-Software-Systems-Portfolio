import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';

// Ensure Google Public DNS is used for reliable Atlas SRV lookups on Windows
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch {}

import { connectDB } from '../src/config/database.js';
import { uploadBufferToGridFS } from '../src/services/gridfsService.js';
import Profile from '../src/models/Profile.js';
import Project from '../src/models/Project.js';
import FileMeta from '../src/models/FileMeta.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

async function migrateFiles() {
  console.log('📦 [File Migration] Starting file migration to MongoDB GridFS...');

  const conn = await connectDB();
  if (!conn) {
    console.error('❌ Cannot migrate files: No active MongoDB connection.');
    process.exit(1);
  }

  try {
    // 1. Migrate Profile Image
    const profileImagePath = path.join(rootDir, 'public/profile.jpg');
    if (fs.existsSync(profileImagePath)) {
      console.log('📤 Uploading profile.jpg to GridFS...');
      const profileBuffer = fs.readFileSync(profileImagePath);
      const profileMeta = await uploadBufferToGridFS({
        buffer: profileBuffer,
        filename: 'profile.jpg',
        originalName: 'profile.jpg',
        contentType: 'image/jpeg',
        category: 'PROFILE_IMAGE',
      });
      await Profile.updateOne({}, { profileImageId: profileMeta._id });
      console.log(`✅ Profile image migrated (ID: ${profileMeta._id})`);
    }

    // 2. Migrate Resume PDF
    const resumePath = path.join(rootDir, 'public/resumes/SDE.pdf');
    if (fs.existsSync(resumePath)) {
      console.log('📤 Uploading SDE.pdf to GridFS...');
      const resumeBuffer = fs.readFileSync(resumePath);
      const resumeMeta = await uploadBufferToGridFS({
        buffer: resumeBuffer,
        filename: 'Akilesh_A_SDE_Resume.pdf',
        originalName: 'Akilesh_A_SDE_Resume.pdf',
        contentType: 'application/pdf',
        category: 'RESUME',
      });
      await Profile.updateOne({}, { resumeFileId: resumeMeta._id });
      console.log(`✅ Resume PDF migrated (ID: ${resumeMeta._id})`);
    }

    // 3. Migrate Project Images
    const projectImageMap = [
      { slug: 'routeveda', file: 'tripforge.png' },
      { slug: 'finvisiq', file: 'finora.png' },
      { slug: 'smart-hospital-bed-management', file: 'hospital.png' },
      { slug: 'quoteverse', file: 'quoteverse.png' },
    ];

    for (const item of projectImageMap) {
      const imgPath = path.join(rootDir, 'public/projects', item.file);
      if (fs.existsSync(imgPath)) {
        console.log(`📤 Uploading project image ${item.file} to GridFS...`);
        const imgBuffer = fs.readFileSync(imgPath);
        const imgMeta = await uploadBufferToGridFS({
          buffer: imgBuffer,
          filename: item.file,
          originalName: item.file,
          contentType: 'image/png',
          category: 'PROJECT_IMAGE',
        });
        await Project.updateOne({ slug: item.slug }, { imageFileId: imgMeta._id });
        console.log(`✅ Project image for ${item.slug} migrated (ID: ${imgMeta._id})`);
      }
    }

    console.log('🎉 [File Migration] All files migrated to GridFS successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error migrating files:', error);
    process.exit(1);
  }
}

migrateFiles();
