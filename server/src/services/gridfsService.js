import mongoose from 'mongoose';
import { getGridFSBucket } from '../config/database.js';
import FileMeta from '../models/FileMeta.js';

/**
 * Uploads a buffer to GridFS and creates a FileMeta entry.
 */
export async function uploadBufferToGridFS({ buffer, filename, originalName, contentType, category }) {
  const bucket = getGridFSBucket();
  if (!bucket) {
    throw new Error('GridFS bucket is not available');
  }

  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, {
      contentType,
      metadata: { category, originalName },
    });

    const fileId = uploadStream.id;

    uploadStream.on('error', (err) => reject(err));

    uploadStream.on('finish', async () => {
      try {
        const fileMeta = await FileMeta.create({
          filename,
          originalName,
          contentType,
          size: buffer.length,
          category,
          gridFSId: fileId,
        });
        resolve(fileMeta);
      } catch (err) {
        reject(err);
      }
    });

    uploadStream.end(buffer);
  });
}

/**
 * Streams a file from GridFS by ID or FileMeta ID to an Express Response.
 */
export async function streamFileFromGridFS(fileId, res, asDownload = false) {
  const bucket = getGridFSBucket();
  if (!bucket) {
    return res.status(503).json({ success: false, message: 'File storage unavailable' });
  }

  try {
    let objectId;
    try {
      objectId = new mongoose.Types.ObjectId(fileId);
    } catch {
      return res.status(400).json({ success: false, message: 'Invalid file ID' });
    }

    // Try finding by FileMeta ID or GridFS ID
    let fileMeta = await FileMeta.findById(objectId);
    let gridFSId = fileMeta ? fileMeta.gridFSId : objectId;

    const files = await bucket.find({ _id: gridFSId }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    const file = files[0];

    // Set Response Headers
    res.setHeader('Content-Type', file.contentType || 'application/octet-stream');
    res.setHeader('Content-Length', file.length);
    res.setHeader('Cache-Control', 'public, max-age=86400'); // 1-day cache for static assets

    if (asDownload) {
      res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
    } else {
      res.setHeader('Content-Disposition', `inline; filename="${file.filename}"`);
    }

    const downloadStream = bucket.openDownloadStream(gridFSId);
    downloadStream.on('error', () => {
      if (!res.headersSent) {
        res.status(500).json({ success: false, message: 'Error streaming file' });
      }
    });

    downloadStream.pipe(res);
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Error retrieving file' });
    }
  }
}
