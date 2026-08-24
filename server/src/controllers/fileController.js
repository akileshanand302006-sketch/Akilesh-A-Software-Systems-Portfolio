import { streamFileFromGridFS, uploadBufferToGridFS } from '../services/gridfsService.js';
import Profile from '../models/Profile.js';
import FileMeta from '../models/FileMeta.js';

export async function getFileById(req, res, next) {
  try {
    const { id } = req.params;
    const download = req.query.download === 'true';
    await streamFileFromGridFS(id, res, download);
  } catch (error) {
    next(error);
  }
}

export async function getResume(req, res, next) {
  try {
    const download = req.query.download === 'true';

    // Check if a resume is linked in the Profile model
    const profile = await Profile.findOne().lean();
    if (profile && profile.resumeFileId) {
      return await streamFileFromGridFS(profile.resumeFileId, res, download);
    }

    // Fallback: search for latest uploaded RESUME in FileMeta
    const resumeMeta = await FileMeta.findOne({ category: 'RESUME' }).sort({ createdAt: -1 }).lean();
    if (resumeMeta) {
      return await streamFileFromGridFS(resumeMeta._id, res, download);
    }

    res.status(404).json({ success: false, message: 'Resume not found' });
  } catch (error) {
    next(error);
  }
}

export async function uploadFile(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { category = 'OTHER' } = req.body;

    const fileMeta = await uploadBufferToGridFS({
      buffer: req.file.buffer,
      filename: `${Date.now()}-${req.file.originalname.replace(/\s+/g, '_')}`,
      originalName: req.file.originalname,
      contentType: req.file.mimetype,
      category,
    });

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: fileMeta,
    });
  } catch (error) {
    next(error);
  }
}
