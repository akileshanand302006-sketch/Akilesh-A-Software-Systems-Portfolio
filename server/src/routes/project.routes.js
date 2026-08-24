import express from 'express';
import { getProjects, getProjectBySlug, getFeaturedProjects } from '../controllers/projectController.js';

const router = express.Router();

router.get('/', getProjects);
router.get('/featured', getFeaturedProjects);
router.get('/:slug', getProjectBySlug);

export default router;
