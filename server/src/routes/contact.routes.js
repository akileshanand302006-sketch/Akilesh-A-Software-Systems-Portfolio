import express from 'express';
import { submitContactMessage } from '../controllers/contactController.js';
import { contactLimiter } from '../middleware/rateLimiter.middleware.js';

const router = express.Router();

router.post('/', contactLimiter, submitContactMessage);

export default router;
