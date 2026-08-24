import express from 'express';
import { getAchievements } from '../controllers/achievementController.js';

const router = express.Router();

router.get('/', getAchievements);

export default router;
