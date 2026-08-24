import express from 'express';
import { getSocialLinks } from '../controllers/socialLinkController.js';

const router = express.Router();

router.get('/', getSocialLinks);

export default router;
