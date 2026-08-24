import express from 'express';
import { getFileById, getResume, uploadFile } from '../controllers/fileController.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

router.get('/resume', getResume);
router.get('/:id', getFileById);
router.post('/upload', upload.single('file'), uploadFile);

export default router;
