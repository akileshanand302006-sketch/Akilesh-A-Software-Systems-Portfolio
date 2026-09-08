import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, FolderOpen, Circle, GraduationCap, FileText } from 'lucide-react';
import ProfileImage from '../ProfileImage/ProfileImage';
import profile from '../../data/profile';
import {
  animateHeroEntrance,
  createMagneticButton,
  createGlassRipple,
  cleanupAnime,
} from '../../animations';
import './Hero.css';

export default function Hero() {
  const badgeRef = useRef(null);
  const greetingRef = useRef(null);
  const nameRef = useRef(null);
  const academicRef = useRef(null);
  const introRef = useRef(null);
  const ctaGroupRef = useRef(null);
  const primaryCtaRef = useRef(null);
  const contactCtaRef = useRef(null);

  // Coordinated Anime.js Hero Entrance
  useEffect(() => {
    animateHeroEntrance({
      badge: badgeRef.current,
      greeting: greetingRef.current,
      name: nameRef.current,
      academic: academicRef.current,
      intro: introRef.current,
      buttons: ctaGroupRef.current,
    });

    return () => {
      cleanupAnime([
        badgeRef.current,
        greetingRef.current,
        nameRef.current,
        academicRef.current,
        introRef.current,
        ctaGroupRef.current,
      ]);
    };
  }, []);

  // Attach magnetic cursor micro-interaction to primary CTA buttons on desktop
  useEffect(() => {
    const cleanupMagneticPrimary = createMagneticButton(primaryCtaRef.current, 5);
    const cleanupMagneticContact = createMagneticButton(contactCtaRef.current, 4);

    return () => {
      cleanupMagneticPrimary();
      cleanupMagneticContact();
    };
  }, []);

  const scrollTo = (id, event) => {
    if (event && event.currentTarget) {
      createGlassRipple(event.currentTarget, event);
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="hero-section">
      <div className="container-custom hero-container">
        {/* Left Content */}
        <div className="hero-content">
          <div ref={badgeRef} className="availability-badge">
            <Circle size={8} fill="currentColor" className="availability-dot" />
            <span>{profile.availability}</span>
          </div>

          <p ref={greetingRef} className="hero-greeting">
            Hi, I'm
          </p>

          <h1 ref={nameRef} className="hero-name">
            <span className="gradient-text">{profile.name}</span>
          </h1>

          <div ref={academicRef} className="hero-academic-pill">
            <GraduationCap size={16} className="hap-icon" />
            <span>M.Sc Software Systems (3rd Year) • Coimbatore Institute of Technology</span>
          </div>

          <p ref={introRef} className="hero-intro">
            Turning real-world engineering problems into practical, high-performance software — from low-level systems and Java architectures to geospatial and modern full-stack web platforms.
          </p>

          <div ref={ctaGroupRef} className="hero-cta">
            <button
              ref={primaryCtaRef}
              className="glass-button glass-button-primary"
              onClick={(e) => scrollTo('projects', e)}
            >
              <FolderOpen size={16} />
              <span>View Projects</span>
            </button>
            <button
              ref={contactCtaRef}
              className="glass-button"
              onClick={(e) => scrollTo('contact', e)}
            >
              <Send size={16} />
              <span>Get In Touch</span>
            </button>
            <button
              className="glass-button"
              onClick={(e) => scrollTo('resume', e)}
            >
              <FileText size={16} />
              <span>Resumes (SDE & Data)</span>
            </button>
          </div>

          {/* 📍 High-Contrast Liquid Glass Location Indicator */}
          <div className="hero-quick-meta">
            <div className="hero-location-pill">
              <span className="hlp-dot">◉</span>
              <span className="hlp-text">Coimbatore, Tamil Nadu, India</span>
            </div>
          </div>
        </div>

        {/* Right Visual ── Unified 3D Profile Showcase */}
        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <div className="hero-profile-wrapper">
            <ProfileImage />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
