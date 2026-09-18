import dotenv from 'dotenv';
import dns from 'dns';
try { dns.setServers(['8.8.8.8', '8.8.4.4']); } catch {}
dotenv.config();

import { connectDB } from '../src/config/database.js';
import ContactMessage from '../src/models/ContactMessage.js';
import mongoose from 'mongoose';

async function check() {
  await connectDB();
  const messages = await ContactMessage.find().sort({ createdAt: -1 }).limit(5).lean();
  console.log('Recent contact messages:');
  messages.forEach(m => {
    console.log(JSON.stringify({
      id: m._id,
      name: m.name,
      email: m.email,
      subject: m.subject,
      emailStatus: m.emailStatus,
      errorMessage: m.errorMessage,
      createdAt: m.createdAt
    }, null, 2));
  });
  await mongoose.disconnect();
}
check().catch(console.error);
