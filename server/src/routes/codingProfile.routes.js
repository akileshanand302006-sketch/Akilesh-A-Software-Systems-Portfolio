import express from 'express';
import { getCodingProfiles } from '../controllers/codingProfileController.js';

const router = express.Router();

router.get('/', getCodingProfiles);

export default router;
