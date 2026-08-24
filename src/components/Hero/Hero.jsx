import { motion } from 'framer-motion';
import { Send, FolderOpen, Circle, MapPin, GraduationCap, FileText } from 'lucide-react';
import ProfileImage from '../ProfileImage/ProfileImage';
import HeroOrb from './HeroOrb';
import profile from '../../data/profile';
import './Hero.css';

export default function Hero() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="hero-section">
      <div className="container-custom hero-container">
        {/* Left Content */}
        <div className="hero-content">
          <motion.div
            className="availability-badge"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Circle size={8} fill="currentColor" className="availability-dot" />
            <span>{profile.availability}</span>
          </motion.div>

          <motion.p
            className="hero-greeting"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04, duration: 0.35 }}
          >
            Hi, I'm
          </motion.p>

          <motion.h1
            className="hero-name"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.35 }}
          >
            <span className="gradient-text">{profile.name}</span>
          </motion.h1>

          <motion.div
            className="hero-academic-pill"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.35 }}
          >
            <GraduationCap size={16} className="hap-icon" />
            <span>M.Sc Software Systems (3rd Year) • Coimbatore Institute of Technology</span>
          </motion.div>

          <motion.p
            className="hero-intro"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.35 }}
          >
            Turning real-world engineering problems into practical, high-performance software — from low-level systems and Java architectures to geospatial and modern full-stack web platforms.
          </motion.p>

          <motion.div
            className="hero-cta"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.35 }}
          >
            <button
              className="glass-button glass-button-primary"
              onClick={() => scrollTo('projects')}
            >
              <FolderOpen size={16} />
              <span>View Projects</span>
            </button>
            <button
              className="glass-button"
              onClick={() => scrollTo('contact')}
            >
              <Send size={16} />
              <span>Get In Touch</span>
            </button>
            <button
              className="glass-button"
              onClick={() => scrollTo('resume')}
            >
              <FileText size={16} />
              <span>Resumes (SDE & Data)</span>
            </button>
          </motion.div>

          <motion.div
            className="hero-quick-meta"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.35 }}
          >
            <div className="hq-item">
              <MapPin size={14} />
              <span>Coimbatore, Tamil Nadu, India</span>
            </div>
          </motion.div>
        </div>

        {/* Right Visual */}
        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <div className="hero-orb-wrapper">
            <HeroOrb />
          </div>
          <div className="hero-profile-wrapper">
            <ProfileImage />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
