import Profile from '../models/Profile.js';

export async function getProfile(req, res, next) {
  try {
    const profile = await Profile.findOne().lean();
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }
    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
}
