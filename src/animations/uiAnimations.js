import anime, { safeAnime, createSafeTimeline, cleanupAnime, isReducedMotion } from './animeConfig';
import { DURATION, EASING, STAGGER } from './animeTokens';

/**
 * Coordinated initial entrance for the floating Navbar.
 */
export function animateNavbarEntrance(navbarEl) {
  if (!navbarEl || isReducedMotion()) return;

  cleanupAnime(navbarEl);

  safeAnime({
    targets: navbarEl,
    translateY: [-24, 0],
    opacity: [0, 1],
    scale: [0.97, 1],
    duration: DURATION.EXPANDED,
    easing: EASING.DECEL,
  });
}

/**
 * Theme toggle button animation on switch.
 * Rotates 360 degrees and performs a subtle pulse.
 */
export function animateThemeToggle(iconEl) {
  if (!iconEl || isReducedMotion()) return;

  cleanupAnime(iconEl);

  safeAnime({
    targets: iconEl,
    rotate: [0, 360],
    scale: [
      { value: 0.85, duration: 120, easing: EASING.DECEL },
      { value: 1.15, duration: 140, easing: EASING.DECEL },
      { value: 1, duration: 180, easing: EASING.SPRING_SUBTLE }
    ],
    duration: 440,
    easing: EASING.SMOOTH,
  });
}

/**
 * Coordinated entrance for Hero text and CTA elements.
 *
 * @param {Object} elements - Map of element references: { badge, greeting, name, academic, intro, buttons }
 */
export function animateHeroEntrance(elements = {}) {
  if (isReducedMotion()) return;

  const targets = [
    elements.badge,
    elements.greeting,
    elements.name,
    elements.academic,
    elements.intro,
    elements.buttons,
  ].filter(Boolean);

  if (targets.length === 0) return;

  cleanupAnime(targets);

  safeAnime({
    targets,
    translateY: [18, 0],
    opacity: [0, 1],
    delay: anime.stagger(STAGGER.CINEMATIC, { start: 100 }),
    duration: DURATION.EXPANDED,
    easing: EASING.DECEL,
  });
}

/**
 * Coordinated entrance for the Loading Screen HUD elements.
 *
 * @param {Object} elements - { brand, subtitle, statusWrap, progressCapsule, telemetry }
 */
export function animateLoadingScreenEntrance(elements = {}) {
  if (isReducedMotion()) return;

  const timeline = createSafeTimeline();

  if (elements.telemetry) {
    timeline.add({
      targets: elements.telemetry,
      opacity: [0, 1],
      translateY: [-10, 0],
      duration: 350,
      easing: EASING.DECEL,
    });
  }

  if (elements.brand) {
    timeline.add(
      {
        targets: elements.brand,
        opacity: [0, 1],
        scale: [0.94, 1],
        translateY: [16, 0],
        duration: 450,
        easing: EASING.DECEL,
      },
      '-=150'
    );
  }

  if (elements.subtitle) {
    timeline.add(
      {
        targets: elements.subtitle,
        opacity: [0, 1],
        translateY: [10, 0],
        duration: 350,
        easing: EASING.DECEL,
      },
      '-=200'
    );
  }

  if (elements.statusWrap) {
    timeline.add(
      {
        targets: elements.statusWrap,
        opacity: [0, 1],
        duration: 300,
        easing: EASING.DECEL,
      },
      '-=150'
    );
  }

  if (elements.progressCapsule) {
    timeline.add(
      {
        targets: elements.progressCapsule,
        opacity: [0, 1],
        scaleX: [0.96, 1],
        duration: 350,
        easing: EASING.DECEL,
      },
      '-=200'
    );
  }

  return timeline;
}

/**
 * Coordinated dissolution of the Loading Screen DOM elements before complete unmount.
 *
 * @param {HTMLElement} hudPanel
 * @param {Function} onComplete
 */
export function animateLoadingScreenExit(hudPanel, onComplete) {
  if (isReducedMotion() || !hudPanel) {
    if (onComplete) onComplete();
    return;
  }

  safeAnime({
    targets: hudPanel,
    opacity: [1, 0],
    scale: [1, 0.96],
    translateY: [0, -12],
    duration: 380,
    easing: EASING.DECEL_STRONG,
    complete: () => {
      if (onComplete) onComplete();
    }
  });
}

/**
 * Smooth input focus transition: illuminates the glass container with a subtle glow.
 *
 * @param {HTMLElement} inputContainer
 * @param {boolean} isFocused
 */
export function animateInputFocus(inputContainer, isFocused) {
  if (!inputContainer || isReducedMotion()) return;

  cleanupAnime(inputContainer);

  safeAnime({
    targets: inputContainer,
    scale: isFocused ? [1, 1.006] : [1.006, 1],
    duration: DURATION.MICRO,
    easing: EASING.DECEL,
  });
}

/**
 * Success modal checkmark reveal and luminous scale entrance.
 *
 * @param {HTMLElement} iconEl
 * @param {HTMLElement} modalEl
 */
export function animateContactSuccess(iconEl, modalEl) {
  if (isReducedMotion()) return;

  if (modalEl) {
    safeAnime({
      targets: modalEl,
      scale: [0.94, 1],
      opacity: [0, 1],
      duration: DURATION.STANDARD,
      easing: EASING.DECEL,
    });
  }

  if (iconEl) {
    safeAnime({
      targets: iconEl,
      scale: [0.65, 1.1, 1],
      rotate: [-15, 0],
      duration: 480,
      delay: 100,
      easing: EASING.SPRING_SUBTLE,
    });
  }
}
