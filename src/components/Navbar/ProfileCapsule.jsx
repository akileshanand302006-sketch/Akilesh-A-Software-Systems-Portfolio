import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, FileText, Send, Github, Linkedin, ExternalLink, Sparkles } from 'lucide-react';
import profile from '../../data/profile';
import { portfolioService } from '../../services/portfolioService';
import './ProfileCapsule.css';

const BASE = import.meta.env.BASE_URL || '/';
const cleanBase = BASE.endsWith('/') ? BASE : `${BASE}/`;
const defaultPhoto = `${cleanBase}profile.jpg`;

export default function ProfileCapsule({ theme = 'dark', isMobile = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState(defaultPhoto);
  const [positionStyle, setPositionStyle] = useState({});
  const capsuleRef = useRef(null);
  const panelRef = useRef(null);

  // Dynamic MongoDB GridFS Profile Image streaming with local fallback
  useEffect(() => {
    let isMounted = true;
    portfolioService.getProfile().then((data) => {
      if (isMounted && data?.profileImage) {
        setImgSrc(data.profileImage);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Smart Viewport Positioning calculation
  // Ensures the dropdown always remains strictly within viewport boundaries [safeMargin, viewportWidth - safeMargin]
  const updatePosition = useCallback(() => {
    if (!capsuleRef.current) return;
    const capsuleRect = capsuleRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const safeMargin = 14; // 14px safe margin from viewport edge

    // Maximum width the panel can occupy on the screen
    const maxAllowedWidth = Math.min(285, viewportWidth - safeMargin * 2);

    // Preferred behavior: align dropdown right edge with capsule right edge (CSS right: 0)
    // Capsule's screen right is capsuleRect.right
    // Projected dropdown screen right = capsuleRect.right
    // Projected dropdown screen left = capsuleRect.right - maxAllowedWidth
    let shiftX = 0; // horizontal offset: negative = shift left, positive = shift right

    // 1. Right boundary check: if capsule right edge is closer to right screen edge than safeMargin
    if (capsuleRect.right > viewportWidth - safeMargin) {
      shiftX = (viewportWidth - safeMargin) - capsuleRect.right;
    }

    // 2. Left boundary check: if projected left edge overflows viewport left safe margin
    const projectedLeft = capsuleRect.right + shiftX - maxAllowedWidth;
    if (projectedLeft < safeMargin) {
      shiftX += (safeMargin - projectedLeft);
    }

    // Convert shiftX to CSS right offset relative to capsule container:
    // CSS right: 0 aligns with capsule right edge.
    // Shifting right by shiftX decreases CSS right: right = -shiftX
    const cssRight = -Math.round(shiftX);

    setPositionStyle({
      right: `${cssRight}px`,
      maxWidth: `${maxAllowedWidth}px`,
      width: `${maxAllowedWidth}px`,
    });
  }, []);

  // Update position on open and view resize/scroll
  useEffect(() => {
    if (!isOpen) return;

    updatePosition();

    let rafId = null;
    const handleResize = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updatePosition);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('scroll', handleResize, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, [isOpen, updatePosition]);

  // Close on outside click or Escape key
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (capsuleRef.current && !capsuleRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleNavClick = (sectionId) => {
    setIsOpen(false);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`profile-capsule-wrapper ${isMobile ? 'capsule-mobile-view' : ''}`}
      ref={capsuleRef}
    >
      {/* ── Main Liquid Glass Trigger Capsule ── */}
      <button
        type="button"
        className={`profile-capsule-trigger ${isOpen ? 'capsule-active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label="Profile menu for Akilesh A"
      >
        {/* Subtle Ambient Shimmer Sweep */}
        <span className="capsule-shimmer-sweep" aria-hidden="true" />

        {/* 1. Multi-Layer Profile Image Frame */}
        <div className="capsule-avatar-frame">
          <span className="avatar-ambient-glow" aria-hidden="true" />
          <div className="avatar-glass-ring">
            <img
              src={imgSrc}
              alt={profile.name || 'Akilesh A'}
              className="avatar-core-image"
              onError={(e) => {
                if (e.target.src !== defaultPhoto) {
                  e.target.src = defaultPhoto;
                }
              }}
            />
            <span className="avatar-specular-highlight" aria-hidden="true" />
          </div>
          {/* Subtle pulsating availability indicator */}
          <span className="avatar-status-dot" title="Available for opportunities">
            <span className="status-pulse-ring" />
          </span>
        </div>

        {/* 2. Identity Information (Akilesh A + Status) */}
        <div className="capsule-identity-block">
          <span className="capsule-name-text">{profile.name || 'Akilesh A'}</span>
          <span className="capsule-status-badge">
            <span className="status-live-beacon" />
            <span className="status-label">Available</span>
          </span>
        </div>

        {/* 3. Dropdown Chevron Action Area */}
        <div className="capsule-chevron-container">
          <motion.span
            className="capsule-chevron-icon"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <ChevronDown size={13} strokeWidth={2.4} />
          </motion.span>
        </div>
      </button>

      {/* ── Floating Liquid Glass Dropdown Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            className="profile-dropdown-panel"
            style={positionStyle}
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -6 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-label="Profile Details"
          >
            {/* Header Identity Card */}
            <div className="dropdown-header-card">
              <div className="dropdown-avatar-wrap">
                <img
                  src={imgSrc}
                  alt={profile.name || 'Akilesh A'}
                  className="dropdown-avatar-photo"
                  onError={(e) => {
                    if (e.target.src !== defaultPhoto) {
                      e.target.src = defaultPhoto;
                    }
                  }}
                />
                <span className="dropdown-online-indicator" />
              </div>
              <div className="dropdown-identity-meta">
                <div className="dropdown-name-row">
                  <h4 className="dropdown-fullname">{profile.name || 'Akilesh A'}</h4>
                  <span className="dropdown-college-tag">CIT</span>
                </div>
                <p className="dropdown-degree-text">M.Sc Software Systems</p>
                <div className="dropdown-status-pill">
                  <Sparkles size={11} className="badge-sparkle-glyph" />
                  <span>Open to Opportunities</span>
                </div>
              </div>
            </div>

            {/* Quick Navigation Items */}
            <div className="dropdown-menu-list">
              <button
                type="button"
                className="dropdown-action-item"
                onClick={() => handleNavClick('resume')}
              >
                <div className="action-icon-box">
                  <FileText size={15} />
                </div>
                <div className="action-meta-box">
                  <span className="action-title">View Resume</span>
                  <span className="action-desc">PDF & Word documents</span>
                </div>
              </button>

              <button
                type="button"
                className="dropdown-action-item"
                onClick={() => handleNavClick('projects')}
              >
                <div className="action-icon-box">
                  <ExternalLink size={15} />
                </div>
                <div className="action-meta-box">
                  <span className="action-title">Explore Projects</span>
                  <span className="action-desc">FinvisIQ, RouteVeda & more</span>
                </div>
              </button>

              <button
                type="button"
                className="dropdown-action-item"
                onClick={() => handleNavClick('contact')}
              >
                <div className="action-icon-box">
                  <Send size={15} />
                </div>
                <div className="action-meta-box">
                  <span className="action-title">Get In Touch</span>
                  <span className="action-desc">Direct email & inquiry</span>
                </div>
              </button>
            </div>

            {/* Social Links Footer */}
            <div className="dropdown-footer-row">
              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dropdown-social-btn"
                  aria-label="GitHub Profile"
                >
                  <Github size={15} />
                  <span>GitHub</span>
                </a>
              )}
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dropdown-social-btn"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin size={15} />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
