import Experience from '../models/Experience.js';

export async function getExperience(req, res, next) {
  try {
    const experience = await Experience.find({ active: true }).sort({ order: 1 }).lean();
    res.json({ success: true, count: experience.length, data: experience });
  } catch (error) {
    next(error);
  }
}
