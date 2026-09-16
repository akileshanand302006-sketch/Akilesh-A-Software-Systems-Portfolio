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
    const type = (req.query.type || req.params.type || 'sde').toLowerCase();
    const meta = req.query.meta === 'true' || req.query.info === 'true';

    // If metadata requested
    if (meta) {
      const sdeMeta = await FileMeta.findOne({
        category: 'RESUME',
        $or: [{ filename: /sde/i }, { originalName: /sde/i }]
      }).sort({ createdAt: -1 }).lean();

      const dataMeta = await FileMeta.findOne({
        category: 'RESUME',
        $or: [{ filename: /data/i }, { originalName: /data/i }]
      }).sort({ createdAt: -1 }).lean();

      return res.json({
        success: true,
        data: {
          sde: sdeMeta ? {
            fileId: sdeMeta.gridFSId || sdeMeta._id,
            metaId: sdeMeta._id,
            filename: sdeMeta.filename,
            contentType: sdeMeta.contentType || 'application/pdf',
          } : null,
          data: dataMeta ? {
            fileId: dataMeta.gridFSId || dataMeta._id,
            metaId: dataMeta._id,
            filename: dataMeta.filename,
            contentType: dataMeta.contentType || 'application/pdf',
          } : null,
        }
      });
    }

    // Serve Data Resume
    if (type === 'data') {
      const profile = await Profile.findOne().lean();
      if (profile && profile.dataResumeFileId) {
        return await streamFileFromGridFS(profile.dataResumeFileId, res, download);
      }
      const dataMeta = await FileMeta.findOne({
        category: 'RESUME',
        $or: [{ filename: /data/i }, { originalName: /data/i }]
      }).sort({ createdAt: -1 }).lean();

      if (dataMeta) {
        return await streamFileFromGridFS(dataMeta._id, res, download);
      }
    }

    // Serve SDE Resume (Default)
    const profile = await Profile.findOne().lean();
    if (profile && profile.resumeFileId) {
      return await streamFileFromGridFS(profile.resumeFileId, res, download);
    }
    const sdeMeta = await FileMeta.findOne({
      category: 'RESUME',
      $or: [{ filename: /sde/i }, { originalName: /sde/i }]
    }).sort({ createdAt: -1 }).lean();

    if (sdeMeta) {
      return await streamFileFromGridFS(sdeMeta._id, res, download);
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
      filename: Date.now() + '-' + req.file.originalname.replace(/\s+/g, '_'),
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
