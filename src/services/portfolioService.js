import api from './api';

// Local static data fallbacks
import localProfile from '../data/profile';
import localProjects from '../data/projects';
import localSkills from '../data/skills';
import localExperience from '../data/experience';
import localProfiles from '../data/profiles';
import localSocials from '../data/socials';
import localAchievements from '../data/achievements';

/**
 * Service to fetch all portfolio data with automatic fallback resilience.
 */
export const portfolioService = {
  /**
   * Get Profile information
   */
  async getProfile() {
    try {
      const res = await api.get('/profile');
      if (res?.success && res.data) {
        return res.data;
      }
    } catch {
      // Fallback
    }
    return localProfile;
  },

  /**
   * Get Projects array
   */
  async getProjects() {
    try {
      const res = await api.get('/projects');
      if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch {
      // Fallback
    }
    return localProjects;
  },

  /**
   * Get Skills categories
   */
  async getSkills() {
    try {
      const res = await api.get('/skills');
      if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch {
      // Fallback
    }
    return localSkills;
  },

  /**
   * Get Experience & Academic timeline
   */
  async getExperience() {
    try {
      const res = await api.get('/experience');
      if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch {
      // Fallback
    }
    return localExperience;
  },

  /**
   * Get Coding Profiles
   */
  async getCodingProfiles() {
    try {
      const res = await api.get('/coding-profiles');
      if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch {
      // Fallback
    }
    return localProfiles;
  },

  /**
   * Get Social links
   */
  async getSocialLinks() {
    try {
      const res = await api.get('/social-links');
      if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch {
      // Fallback
    }
    return localSocials;
  },

  /**
   * Get Achievements
   */
  async getAchievements() {
    try {
      const res = await api.get('/achievements');
      if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch {
      // Fallback
    }
    return localAchievements;
  },
};

export default portfolioService;
