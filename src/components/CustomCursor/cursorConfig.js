/**
 * cursorConfig.js
 * Configuration tokens and state definitions for the Premium Liquid Glass Cursor.
 */

export const CURSOR_STATES = {
  DEFAULT: 'DEFAULT',
  HOVER: 'HOVER',
  LINK: 'LINK',
  BUTTON: 'BUTTON',
  CLICK: 'CLICK',
  TEXT: 'TEXT',
  IMAGE: 'IMAGE',
  PROJECT: 'PROJECT',
  DRAG: 'DRAG',
};

export const LERP_FACTORS = {
  DOT: 0.75,          // Crisp, instant center dot
  RING: 0.20,         // Silky floating liquid glass bubble
  DELAYED_RING: 0.12, // Secondary trailing glass ring
  AURA: 0.06,         // Atmospheric delayed glow halo
  MAGNETIC: 0.26,     // Tactile magnetic suction
};

export const STATE_CONFIG = {
  DEFAULT: {
    dotSize: 7,
    ringSize: 38,
    delayedSize: 46,
    auraSize: 58,
    badge: '',
    className: 'state-default',
  },
  HOVER: {
    dotSize: 5,
    ringSize: 52,
    delayedSize: 62,
    auraSize: 74,
    badge: '',
    className: 'state-hover',
  },
  LINK: {
    dotSize: 5,
    ringSize: 52,
    delayedSize: 62,
    auraSize: 74,
    badge: '',
    className: 'state-link',
  },
  BUTTON: {
    dotSize: 4,
    ringSize: 56,
    delayedSize: 66,
    auraSize: 78,
    badge: '',
    className: 'state-button',
  },
  CLICK: {
    dotSize: 10,
    ringSize: 30,
    delayedSize: 42,
    auraSize: 46,
    badge: '',
    className: 'state-click',
  },
  TEXT: {
    dotSize: 0,
    ringSize: 0,
    delayedSize: 0,
    auraSize: 0,
    badge: '',
    className: 'state-text',
  },
  IMAGE: {
    dotSize: 0,
    ringSize: 68,
    delayedSize: 78,
    auraSize: 88,
    badge: 'VIEW',
    className: 'state-image',
  },
  PROJECT: {
    dotSize: 0,
    ringSize: 76,
    delayedSize: 88,
    auraSize: 98,
    badge: 'EXPLORE',
    className: 'state-project',
  },
  DRAG: {
    dotSize: 0,
    ringSize: 60,
    delayedSize: 70,
    auraSize: 80,
    badge: 'DRAG',
    className: 'state-drag',
  },
};

export const MAGNETIC_CONFIG = {
  maxDistance: 75,       // Attraction radius (px)
  pullStrength: 0.32,    // Cursor pull towards element center
  elementPullMax: 4.5,   // Maximum physical shift for the target element (px)
};

export const TRAIL_CONFIG = {
  maxPoints: 14,         // Number of trailing points in canvas
  fadeTimeMs: 220,       // Lifetime of each trail particle
  minVelocity: 1.2,      // Minimum speed (px/frame) to emit trail points
  sparkThreshold: 14,    // Speed to trigger micro-orbital fragments
};

export const SELECTORS = {
  BUTTON: 'button, .cta-button, .cta-buttons a, .resume-btn, .resume-button, .contact-btn, .theme-toggle, .mobile-toggle, [role="button"]',
  LINK: 'a:not(.project-card):not(.cta-button), .nav-link, .social-link',
  PROJECT: '.project-card, [data-cursor="project"]',
  IMAGE: '.project-image, .project-image-wrap, .profile-portrait-wrap, [data-cursor="image"]',
  TEXT: 'p, h1, h2, h3, h4, h5, h6, blockquote, .section-title, .hero-bio, input[type="text"], textarea, [data-cursor="text"]',
  DRAG: '[data-cursor="drag"], .carousel-track, canvas.drag-target',
  MAGNETIC: '.nav-link, .cta-button, .cta-buttons a, .social-link, .resume-btn, .resume-button, .contact-btn, .theme-toggle, .project-link-btn, [data-cursor-magnetic]',
};
