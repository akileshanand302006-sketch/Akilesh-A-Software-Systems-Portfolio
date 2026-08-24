import Achievement from '../models/Achievement.js';

export async function getAchievements(req, res, next) {
  try {
    const achievements = await Achievement.find().sort({ order: 1 }).lean();
    res.json({ success: true, count: achievements.length, data: achievements });
  } catch (error) {
    next(error);
  }
}
