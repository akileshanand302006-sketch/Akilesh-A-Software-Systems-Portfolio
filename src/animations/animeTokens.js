/**
 * Central Animation Tokens for Anime.js Motion Engine
 * Standardizes snappy durations, easings, and stagger intervals across the portfolio.
 */

// Timing durations (in milliseconds) - tuned for ultra-responsive buttery smooth UI
export const DURATION = {
  FAST: 90,        // Micro-interactions, ripples, fast hover states
  MICRO: 140,      // Button presses, small badge transitions, icon shifts
  STANDARD: 220,   // Card reveals, modal transitions, dropdowns
  EXPANDED: 300,   // Section reveals, timeline node sequences
  CINEMATIC: 420,  // Hero entrance, loading screen dissolution
  HERO_PULSE: 2000 // Ambient pulse loop
};

// Premium Easing Curves
export const EASING = {
  DECEL: 'easeOutCubic',
  DECEL_STRONG: 'easeOutQuart',
  DECEL_EXPO: 'easeOutExpo',
  SMOOTH: 'easeInOutCubic',
  SMOOTH_STRONG: 'easeInOutQuart',
  SPRING_SUBTLE: 'spring(1, 90, 14, 0)',
  SPRING_POP: 'spring(1, 100, 12, 0)',
  LINEAR: 'linear'
};

// Stagger intervals (in milliseconds)
export const STAGGER = {
  FAST: 20,        // Dense lists, tech pills
  STANDARD: 40,    // Nav links, stat cards, profile cards
  CINEMATIC: 55    // Hero items, project cards, timeline items
};
