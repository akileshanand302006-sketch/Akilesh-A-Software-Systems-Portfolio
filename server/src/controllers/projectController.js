import Project from '../models/Project.js';

export async function getProjects(req, res, next) {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: 1 }).lean();
    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    next(error);
  }
}

export async function getProjectBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    const project = await Project.findOne({ slug }).lean();
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
}

export async function getFeaturedProjects(req, res, next) {
  try {
    const projects = await Project.find({ featured: true }).sort({ order: 1 }).lean();
    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    next(error);
  }
}
