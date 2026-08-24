import express from 'express';
import { recordAnalytics } from '../controllers/analyticsController.js';

const router = express.Router();

router.post('/', recordAnalytics);

export default router;
