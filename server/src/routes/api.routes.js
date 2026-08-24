import express from 'express';
import profileRoutes from './profile.routes.js';
import projectRoutes from './project.routes.js';
import skillRoutes from './skill.routes.js';
import experienceRoutes from './experience.routes.js';
import codingProfileRoutes from './codingProfile.routes.js';
import socialLinkRoutes from './socialLink.routes.js';
import achievementRoutes from './achievement.routes.js';
import contactRoutes from './contact.routes.js';
import fileRoutes from './file.routes.js';
import analyticsRoutes from './analytics.routes.js';
import { isDBConnected } from '../config/database.js';

const router = express.Router();

// Health Check Endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'online',
    database: isDBConnected() ? 'connected' : 'fallback',
    timestamp: new Date().toISOString(),
  });
});

// Resume shortcut route
router.use('/resume', (req, res, next) => {
  req.url = '/resume' + (req.url === '/' ? '' : req.url);
  fileRoutes(req, res, next);
});

// Domain Routes
router.use('/profile', profileRoutes);
router.use('/projects', projectRoutes);
router.use('/skills', skillRoutes);
router.use('/experience', experienceRoutes);
router.use('/coding-profiles', codingProfileRoutes);
router.use('/social-links', socialLinkRoutes);
router.use('/achievements', achievementRoutes);
router.use('/contact', contactRoutes);
router.use('/files', fileRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
