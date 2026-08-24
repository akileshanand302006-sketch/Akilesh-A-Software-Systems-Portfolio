import CodingProfile from '../models/CodingProfile.js';

export async function getCodingProfiles(req, res, next) {
  try {
    const profiles = await CodingProfile.find({ active: true }).sort({ order: 1 }).lean();
    res.json({ success: true, count: profiles.length, data: profiles });
  } catch (error) {
    next(error);
  }
}
