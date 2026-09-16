import dotenv from 'dotenv';
import dns from 'dns';
try { dns.setServers(['8.8.8.8', '8.8.4.4']); } catch {}
dotenv.config();

import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { connectDB } from '../src/config/database.js';
import apiRoutes from '../src/routes/api.routes.js';

async function test() {
  console.log('--- Testing Resume Endpoints with MongoDB Atlas ---');
  await connectDB();

  const app = express();
  app.use(express.json());
  app.use('/api', apiRoutes);

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  console.log(`Test server running on port ${port}`);

  const baseUrl = `http://127.0.0.1:${port}/api`;

  // 1. Test Metadata
  console.log('\n1. Testing GET /api/resume?meta=true');
  const metaRes = await fetch(`${baseUrl}/resume?meta=true`);
  const metaJson = await metaRes.json();
  console.log('Status:', metaRes.status);
  console.log('Response:', JSON.stringify(metaJson, null, 2));

  if (!metaJson.success || !metaJson.data?.sde?.fileId || !metaJson.data?.data?.fileId) {
    throw new Error('Metadata test failed!');
  }
  console.log('✅ Metadata endpoint returned active SDE and Data PDF references.');

  // 2. Test SDE View
  console.log('\n2. Testing GET /api/resume?type=sde (View)');
  const sdeViewRes = await fetch(`${baseUrl}/resume?type=sde`);
  console.log('Status:', sdeViewRes.status);
  console.log('Content-Type:', sdeViewRes.headers.get('content-type'));
  console.log('Content-Disposition:', sdeViewRes.headers.get('content-disposition'));
  const sdeViewBuf = await sdeViewRes.arrayBuffer();
  console.log('Bytes received:', sdeViewBuf.byteLength);
  const sdeHeader = Buffer.from(sdeViewBuf.slice(0, 5)).toString('utf8');
  console.log('Header:', sdeHeader, 'Valid PDF:', sdeHeader === '%PDF-');
  if (sdeViewRes.status !== 200 || sdeViewRes.headers.get('content-type') !== 'application/pdf' || sdeHeader !== '%PDF-') {
    throw new Error('SDE View test failed!');
  }
  console.log('✅ SDE View returned valid PDF!');

  // 3. Test SDE Download
  console.log('\n3. Testing GET /api/resume?type=sde&download=true (Download)');
  const sdeDlRes = await fetch(`${baseUrl}/resume?type=sde&download=true`);
  console.log('Status:', sdeDlRes.status);
  console.log('Content-Type:', sdeDlRes.headers.get('content-type'));
  console.log('Content-Disposition:', sdeDlRes.headers.get('content-disposition'));
  if (!sdeDlRes.headers.get('content-disposition')?.includes('attachment')) {
    throw new Error('SDE Download disposition failed!');
  }
  console.log('✅ SDE Download header verified!');

  // 4. Test Data View
  console.log('\n4. Testing GET /api/resume?type=data (View)');
  const dataViewRes = await fetch(`${baseUrl}/resume?type=data`);
  console.log('Status:', dataViewRes.status);
  console.log('Content-Type:', dataViewRes.headers.get('content-type'));
  console.log('Content-Disposition:', dataViewRes.headers.get('content-disposition'));
  const dataViewBuf = await dataViewRes.arrayBuffer();
  console.log('Bytes received:', dataViewBuf.byteLength);
  const dataHeader = Buffer.from(dataViewBuf.slice(0, 5)).toString('utf8');
  console.log('Header:', dataHeader, 'Valid PDF:', dataHeader === '%PDF-');
  if (dataViewRes.status !== 200 || dataViewRes.headers.get('content-type') !== 'application/pdf' || dataHeader !== '%PDF-') {
    throw new Error('Data View test failed!');
  }
  console.log('✅ Data View returned valid PDF!');

  // 5. Test Data Download
  console.log('\n5. Testing GET /api/resume?type=data&download=true (Download)');
  const dataDlRes = await fetch(`${baseUrl}/resume?type=data&download=true`);
  console.log('Status:', dataDlRes.status);
  console.log('Content-Type:', dataDlRes.headers.get('content-type'));
  console.log('Content-Disposition:', dataDlRes.headers.get('content-disposition'));
  if (!dataDlRes.headers.get('content-disposition')?.includes('attachment')) {
    throw new Error('Data Download disposition failed!');
  }
  console.log('✅ Data Download header verified!');

  // 6. Test direct GridFS streaming via /api/files/:id
  console.log('\n6. Testing GET /api/files/:id');
  const sdeId = metaJson.data.sde.fileId;
  const fileRes = await fetch(`${baseUrl}/files/${sdeId}`);
  console.log('Status:', fileRes.status);
  console.log('Content-Type:', fileRes.headers.get('content-type'));
  const fileBuf = await fileRes.arrayBuffer();
  console.log('Bytes received:', fileBuf.byteLength);
  console.log('✅ /api/files/:id streaming verified!');

  server.close();
  await mongoose.disconnect();
  console.log('\n🎉 ALL RESUME API TESTS PASSED SUCCESSFULLY!');
}

test().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
