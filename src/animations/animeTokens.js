/**
 * Central Animation Tokens for Anime.js Motion Engine
 * Standardizes durations, easings, and stagger intervals across the portfolio.
 */

// Timing durations (in milliseconds)
export const DURATION = {
  FAST: 150,       // Micro-interactions, ripples, fast hover states
  MICRO: 220,      // Button presses, small badge transitions, icon shifts
  STANDARD: 380,   // Card reveals, modal transitions, dropdowns
  EXPANDED: 550,   // Section reveals, timeline node sequences
  CINEMATIC: 800,  // Hero entrance, loading screen dissolution
  HERO_PULSE: 2400 // Slow ambient pulse loop
};

// Premium Easing Curves
export const EASING = {
  // Snappy decelerations (ideal for entrances and hover states)
  DECEL: 'easeOutCubic',
  DECEL_STRONG: 'easeOutQuart',
  DECEL_EXPO: 'easeOutExpo',

  // Smooth bidirectional (for modals and toggles)
  SMOOTH: 'easeInOutCubic',
  SMOOTH_STRONG: 'easeInOutQuart',

  // Elastic / Spring-like (subtle overshoot without cartoon bounce)
  SPRING_SUBTLE: 'spring(1, 80, 12, 0)',
  SPRING_POP: 'spring(1, 90, 10, 0)',

  // Linear (for ambient sheens and continuous rotations)
  LINEAR: 'linear'
};

// Stagger intervals (in milliseconds)
export const STAGGER = {
  FAST: 40,        // Dense lists, tech pills
  STANDARD: 80,    // Nav links, stat cards, profile cards
  CINEMATIC: 120   // Hero items, project cards, timeline items
};
