import anime from 'animejs';

/**
 * Checks if the user prefers reduced motion.
 * If true, large transforms and long timelines should be bypassed.
 */
export function isReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Checks if the client is using a touch/coarse pointer device.
 * Magnetic cursor pull and fine mouse hover tilt should be disabled on touch.
 */
export function isTouchDevice() {
  if (typeof window === 'undefined') return false;
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(pointer: coarse)').matches
  );
}

/**
 * StrictMode-safe wrapper around anime().
 * Automatically respects prefers-reduced-motion by short-circuiting to instant values.
 *
 * @param {Object} options - Standard anime.js animation parameters
 * @returns {Object|null} The anime instance or a dummy controller
 */
export function safeAnime(options = {}) {
  if (isReducedMotion()) {
    // If reduced motion is requested, instantly set end states if targets exist
    if (options.targets) {
      try {
        const instantOptions = { ...options, duration: 0, delay: 0 };
        return anime(instantOptions);
      } catch (err) {
        return null;
      }
    }
    return null;
  }

  try {
    return anime(options);
  } catch (err) {
    console.warn('[Anime.js safeAnime error]', err);
    return null;
  }
}

/**
 * Creates a safe Anime timeline.
 * If reduced motion is active, durations/delays are minimized.
 *
 * @param {Object} options - Standard anime timeline options
 * @returns {Object} Anime timeline instance
 */
export function createSafeTimeline(options = {}) {
  if (isReducedMotion()) {
    return anime.timeline({ ...options, duration: 0 });
  }
  return anime.timeline(options);
}

/**
 * Removes active Anime.js animations on specified targets.
 * Call this during React useEffect cleanup to avoid memory leaks and duplicate runs in StrictMode.
 *
 * @param {HTMLElement|Array|String} targets
 */
export function cleanupAnime(targets) {
  if (!targets) return;
  try {
    anime.remove(targets);
  } catch (e) {
    // Ignore cleanup errors on unmounted elements
  }
}

export default anime;
