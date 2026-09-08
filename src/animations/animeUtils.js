import anime, { safeAnime, cleanupAnime, isReducedMotion, isTouchDevice } from './animeConfig';
import { DURATION, EASING } from './animeTokens';

/**
 * Smoothly interpolates numeric values from startVal to endVal.
 * Used for statistics counters in About section.
 *
 * @param {Object} target - Mutable object with value property, e.g. { val: 0 }
 * @param {number} endVal - Target number
 * @param {Function} onUpdate - Callback invoked on each step with Math.floor(target.val)
 * @param {Object} options - Optional overrides (duration, easing)
 * @returns {Object} Anime instance
 */
export function animateCountUp(target, endVal, onUpdate, options = {}) {
  if (isReducedMotion()) {
    target.val = endVal;
    if (onUpdate) onUpdate(endVal);
    return null;
  }

  return safeAnime({
    targets: target,
    val: endVal,
    round: 1,
    duration: options.duration || 1400,
    easing: options.easing || EASING.DECEL,
    update: () => {
      if (onUpdate) onUpdate(Math.floor(target.val));
    },
    complete: () => {
      if (onUpdate) onUpdate(endVal);
    }
  });
}

/**
 * Attaches a magnetic cursor pull micro-interaction to a button on desktop.
 * Bypasses immediately on mobile/touch devices or if reduced-motion is active.
 *
 * @param {HTMLElement} element - The DOM button element
 * @param {number} maxDistance - Maximum pixel deflection (default 4px)
 * @returns {Function} Cleanup function to remove event listeners
 */
export function createMagneticButton(element, maxDistance = 5) {
  if (!element || isTouchDevice() || isReducedMotion()) {
    return () => {};
  }

  let rafId = null;

  const handleMouseMove = (e) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    // Constrain to subtle deflection
    const moveX = Math.max(-maxDistance, Math.min(maxDistance, deltaX * 0.18));
    const moveY = Math.max(-maxDistance, Math.min(maxDistance, deltaY * 0.18));

    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      safeAnime({
        targets: element,
        translateX: moveX,
        translateY: moveY,
        duration: DURATION.MICRO,
        easing: EASING.DECEL,
      });
    });
  };

  const handleMouseLeave = () => {
    if (rafId) cancelAnimationFrame(rafId);
    safeAnime({
      targets: element,
      translateX: 0,
      translateY: 0,
      duration: DURATION.STANDARD,
      easing: EASING.SPRING_SUBTLE,
    });
  };

  element.addEventListener('mousemove', handleMouseMove, { passive: true });
  element.addEventListener('mouseleave', handleMouseLeave, { passive: true });

  return () => {
    if (rafId) cancelAnimationFrame(rafId);
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
    cleanupAnime(element);
  };
}

/**
 * Animates a soft diagonal liquid glass reflection sheen across a card or surface.
 * Creates an ephemeral sheen highlight that sweeps across and dissolves.
 *
 * @param {HTMLElement} element - The card container
 */
export function createGlassSheen(element) {
  if (!element || isReducedMotion()) return;

  let sheen = element.querySelector('.liquid-glass-sheen-sweep');
  if (!sheen) {
    sheen = document.createElement('span');
    sheen.className = 'liquid-glass-sheen-sweep';
    sheen.style.cssText = `
      position: absolute;
      top: -50%;
      left: -60%;
      width: 40%;
      height: 200%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.18),
        rgba(56, 189, 248, 0.22),
        transparent
      );
      transform: rotate(25deg);
      pointer-events: none;
      z-index: 15;
      opacity: 0;
    `;
    element.appendChild(sheen);
  }

  cleanupAnime(sheen);

  safeAnime({
    targets: sheen,
    left: ['-60%', '160%'],
    opacity: [
      { value: 0, duration: 0 },
      { value: 0.85, duration: 150 },
      { value: 0, duration: 350, delay: 100 }
    ],
    duration: 550,
    easing: EASING.DECEL,
  });
}

/**
 * Produces a subtle translucent glass ripple feedback on button click.
 *
 * @param {HTMLElement} element - The button clicked
 * @param {MouseEvent} event - Click event
 */
export function createGlassRipple(element, event) {
  if (!element || isReducedMotion()) return;

  const rect = element.getBoundingClientRect();
  const ripple = document.createElement('span');
  const size = Math.max(rect.width, rect.height) * 1.4;
  const x = (event.clientX || rect.left + rect.width / 2) - rect.left - size / 2;
  const y = (event.clientY || rect.top + rect.height / 2) - rect.top - size / 2;

  ripple.className = 'liquid-glass-ripple-disk';
  ripple.style.cssText = `
    position: absolute;
    top: ${y}px;
    left: ${x}px;
    width: ${size}px;
    height: ${size}px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(56, 189, 248, 0.35) 0%, rgba(22, 119, 255, 0.15) 50%, transparent 70%);
    pointer-events: none;
    z-index: 16;
    transform: scale(0);
    opacity: 0.8;
  `;

  element.style.position = element.style.position || 'relative';
  element.style.overflow = 'hidden';
  element.appendChild(ripple);

  safeAnime({
    targets: ripple,
    scale: [0, 1.2],
    opacity: [0.8, 0],
    duration: DURATION.STANDARD,
    easing: EASING.DECEL,
    complete: () => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }
  });
}

/**
 * Smooth progressive reveal for SVG or DOM timeline path line.
 *
 * @param {HTMLElement} lineElement
 * @param {number} duration
 */
export function animateTimelineProgress(lineElement, duration = 800) {
  if (!lineElement || isReducedMotion()) return;

  cleanupAnime(lineElement);

  safeAnime({
    targets: lineElement,
    scaleY: [0, 1],
    transformOrigin: 'top center',
    opacity: [0, 1],
    duration: duration,
    easing: EASING.DECEL,
  });
}
