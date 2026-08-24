import SocialLink from '../models/SocialLink.js';

export async function getSocialLinks(req, res, next) {
  try {
    const socials = await SocialLink.find({ active: true }).sort({ order: 1 }).lean();
    res.json({ success: true, count: socials.length, data: socials });
  } catch (error) {
    next(error);
  }
}
