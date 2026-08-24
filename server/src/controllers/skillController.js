import Skill from '../models/Skill.js';

export async function getSkills(req, res, next) {
  try {
    const skills = await Skill.find().sort({ order: 1 }).lean();
    res.json({ success: true, count: skills.length, data: skills });
  } catch (error) {
    next(error);
  }
}
