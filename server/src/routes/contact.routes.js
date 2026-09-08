import express from 'express';
import { submitContactMessage, getContactHealth } from '../controllers/contactController.js';
import { contactLimiter } from '../middleware/rateLimiter.middleware.js';

const router = express.Router();

// Health check endpoint indicating if mail service is available
router.get('/health', getContactHealth);

// Contact message submission
router.post('/', contactLimiter, submitContactMessage);

export default router;
