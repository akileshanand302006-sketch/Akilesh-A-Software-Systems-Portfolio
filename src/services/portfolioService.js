import api from './api';

// Local static data fallbacks
import localProfile from '../data/profile';
import localProjects from '../data/projects';
import localSkills from '../data/skills';
import localExperience from '../data/experience';
import localProfiles from '../data/profiles';
import localSocials from '../data/socials';
import localAchievements from '../data/achievements';

const BASE = import.meta.env.BASE_URL || '/';
const cleanBase = BASE.endsWith('/') ? BASE : `${BASE}/`;

export const portfolioService = {
  /**
   * Get Profile with resolved GridFS profile picture & resume
   */
  async getProfile() {
    try {
      const res = await api.get('/profile');
      if (res?.success && res.data) {
        const data = { ...res.data };

        data.profileImage = data.profileImageId
          ? api.getFileUrl(data.profileImageId, `${cleanBase}profile.jpg`)
          : `${cleanBase}profile.jpg`;

        data.resumePath = data.resumeFileId
          ? api.getFileUrl(data.resumeFileId, `${cleanBase}resumes/Akilesh_A_SDE_Resume.pdf`)
          : `${cleanBase}resumes/Akilesh_A_SDE_Resume.pdf`;

        return data;
      }
    } catch {
      // Fallback
    }

    return {
      ...localProfile,
      profileImage: `${cleanBase}profile.jpg`,
      resumePath: `${cleanBase}resumes/Akilesh_A_SDE_Resume.pdf`,
    };
  },

  /**
   * Get Projects with resolved GridFS screenshots
   */
  async getProjects() {
    try {
      const res = await api.get('/projects');
      if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map((proj) => {
          const fallback = proj.imageFallback
            ? `${cleanBase}${proj.imageFallback.replace(/^\//, '')}`
            : `${cleanBase}projects/tripforge.png`;

          return {
            ...proj,
            id: proj.slug || proj._id,
            image: proj.imageFileId ? api.getFileUrl(proj.imageFileId, fallback) : fallback,
          };
        });
      }
    } catch {
      // Fallback
    }

    return localProjects.map((proj) => ({
      ...proj,
      image: proj.image ? `${cleanBase}${proj.image.replace(/^\//, '')}` : `${cleanBase}projects/tripforge.png`,
    }));
  },

  async getSkills() {
    try {
      const res = await api.get('/skills');
      if (res?.success && Array.isArray(res.data)) return res.data;
    } catch { }
    return localSkills;
  },

  async getExperience() {
    try {
      const res = await api.get('/experience');
      if (res?.success && Array.isArray(res.data)) return res.data;
    } catch { }
    return localExperience;
  },

  async getCodingProfiles() {
    try {
      const res = await api.get('/coding-profiles');
      if (res?.success && Array.isArray(res.data)) return res.data;
    } catch { }
    return localProfiles;
  },

  async getSocialLinks() {
    try {
      const res = await api.get('/social-links');
      if (res?.success && Array.isArray(res.data)) return res.data;
    } catch { }
    return localSocials;
  },

  async getAchievements() {
    try {
      const res = await api.get('/achievements');
      if (res?.success && Array.isArray(res.data)) return res.data;
    } catch { }
    return localAchievements;
  },
};

export default portfolioService;
