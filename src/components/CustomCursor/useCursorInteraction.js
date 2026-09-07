import { useEffect, useRef } from 'react';
import {
  CURSOR_STATES,
  STATE_CONFIG,
  MAGNETIC_CONFIG,
  SELECTORS,
} from './cursorConfig';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * useCursorInteraction
 * High-performance hook managing all cursor state, velocity, magnetic attraction,
 * and user interactions with ZERO React re-renders during mouse movement.
 */
export function useCursorInteraction() {
  const prefersReduced = useReducedMotion();

  // Mouse & coordinates
  const mouseRef = useRef({
    x: -200,
    y: -200,
    targetX: -200,
    targetY: -200,
    vx: 0,
    vy: 0,
    speed: 0,
    lastTime: performance.now(),
    isVisible: false,
    isCoarse: false,
  });

  // Cursor state
  const stateRef = useRef({
    current: CURSOR_STATES.DEFAULT,
    previous: CURSOR_STATES.DEFAULT,
    isDown: false,
    isHovered: false,
    activeBadge: '',
    temporaryTimeout: null,
  });

  // Magnetic attraction state
  const magneticRef = useRef({
    element: null,
    rect: null,
    centerX: 0,
    centerY: 0,
    pullX: 0,
    pullY: 0,
    active: false,
  });

  // Event queues for visual bursts
  const rippleQueueRef = useRef([]);
  const sparkQueueRef = useRef([]);

  useEffect(() => {
    // Coarse pointer detection (touch screens / mobile)
    const coarseQuery = window.matchMedia('(pointer: coarse)');
    mouseRef.current.isCoarse = coarseQuery.matches;

    const onCoarseChange = (e) => {
      mouseRef.current.isCoarse = e.matches;
    };
    coarseQuery.addEventListener('change', onCoarseChange);

    if (prefersReduced || mouseRef.current.isCoarse) {
      return () => {
        coarseQuery.removeEventListener('change', onCoarseChange);
      };
    }

    // Helper to evaluate cursor state from element
    const resolveStateFromElement = (element) => {
      if (!element || element === document.body || element === document.documentElement) {
        return CURSOR_STATES.DEFAULT;
      }

      // Explicit cursor override
      const explicit = element.getAttribute?.('data-cursor');
      if (explicit && CURSOR_STATES[explicit.toUpperCase()]) {
        return CURSOR_STATES[explicit.toUpperCase()];
      }

      // Check hierarchy
      const projectCard = element.closest('.project-card');
      const interactiveChild = element.closest('a, button, [role="button"]');

      if (interactiveChild) {
        if (interactiveChild.matches(SELECTORS.BUTTON)) return CURSOR_STATES.BUTTON;
        return CURSOR_STATES.LINK;
      }

      if (projectCard) {
        if (element.closest('.project-image-wrap, .project-image')) {
          return CURSOR_STATES.IMAGE;
        }
        return CURSOR_STATES.PROJECT;
      }

      if (element.closest(SELECTORS.IMAGE)) return CURSOR_STATES.IMAGE;
      if (element.closest(SELECTORS.BUTTON)) return CURSOR_STATES.BUTTON;
      if (element.closest(SELECTORS.LINK)) return CURSOR_STATES.LINK;
      if (element.closest(SELECTORS.DRAG)) return CURSOR_STATES.DRAG;

      // Selectable text detection
      if (element.closest('input, textarea')) return CURSOR_STATES.TEXT;
      if (element.closest(SELECTORS.TEXT)) {
        // If selection is allowed or hovering paragraph/heading
        return CURSOR_STATES.TEXT;
      }

      return CURSOR_STATES.DEFAULT;
    };

    // Check for magnetic element and cache its bounds
    const updateMagneticTarget = (element) => {
      if (!element || prefersReduced) {
        resetMagneticTarget();
        return;
      }

      const magneticEl = element.closest(SELECTORS.MAGNETIC);
      if (magneticEl) {
        if (magneticRef.current.element !== magneticEl) {
          // Reset previous element transform if switched
          if (magneticRef.current.element && magneticRef.current.element !== magneticEl) {
            magneticRef.current.element.style.transform = '';
          }

          const rect = magneticEl.getBoundingClientRect();
          magneticRef.current.element = magneticEl;
          magneticRef.current.rect = rect;
          magneticRef.current.centerX = rect.left + rect.width / 2;
          magneticRef.current.centerY = rect.top + rect.height / 2;
          magneticRef.current.active = true;
        }
      } else {
        resetMagneticTarget();
      }
    };

    const resetMagneticTarget = () => {
      if (magneticRef.current.element) {
        // Smoothly return element to neutral
        magneticRef.current.element.style.transform = '';
      }
      magneticRef.current.element = null;
      magneticRef.current.rect = null;
      magneticRef.current.pullX = 0;
      magneticRef.current.pullY = 0;
      magneticRef.current.active = false;
    };

    // Pointer move listener
    const handlePointerMove = (e) => {
      const now = performance.now();
      const dt = Math.max(1, now - mouseRef.current.lastTime);
      const prevTargetX = mouseRef.current.targetX;
      const prevTargetY = mouseRef.current.targetY;

      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;

      if (!mouseRef.current.isVisible) {
        mouseRef.current.isVisible = true;
        mouseRef.current.x = e.clientX;
        mouseRef.current.y = e.clientY;
      }

      // Calculate instantaneous velocity
      const vx = (e.clientX - prevTargetX) / (dt / 16.67);
      const vy = (e.clientY - prevTargetY) / (dt / 16.67);
      mouseRef.current.vx = vx;
      mouseRef.current.vy = vy;
      mouseRef.current.speed = Math.hypot(vx, vy);
      mouseRef.current.lastTime = now;

      // Magnetic attraction computation
      if (magneticRef.current.active && magneticRef.current.element) {
        const { centerX, centerY } = magneticRef.current;
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        const dist = Math.hypot(dx, dy);

        if (dist < MAGNETIC_CONFIG.maxDistance) {
          const factor = (1 - dist / MAGNETIC_CONFIG.maxDistance) * MAGNETIC_CONFIG.pullStrength;
          magneticRef.current.pullX = -dx * factor;
          magneticRef.current.pullY = -dy * factor;

          // Subtle physical element shift (max 4.5px)
          const elemFactor = (1 - dist / MAGNETIC_CONFIG.maxDistance) * MAGNETIC_CONFIG.elementPullMax;
          const shiftX = (dx / dist) * elemFactor || 0;
          const shiftY = (dy / dist) * elemFactor || 0;
          magneticRef.current.element.style.transform = `translate3d(${shiftX.toFixed(2)}px, ${shiftY.toFixed(2)}px, 0)`;
        } else {
          magneticRef.current.pullX = 0;
          magneticRef.current.pullY = 0;
          magneticRef.current.element.style.transform = '';
        }
      }
    };

    // Pointer hover listener (event delegation)
    const handlePointerOver = (e) => {
      const target = e.target;
      if (!target) return;

      updateMagneticTarget(target);

      // Don't override temporary states like loading or success
      if (
        stateRef.current.current === CURSOR_STATES.LOADING ||
        stateRef.current.current === CURSOR_STATES.SUCCESS ||
        stateRef.current.current === CURSOR_STATES.ERROR
      ) {
        return;
      }

      const newState = resolveStateFromElement(target);
      stateRef.current.current = newState;
      stateRef.current.isHovered = newState !== CURSOR_STATES.DEFAULT && newState !== CURSOR_STATES.TEXT;
      stateRef.current.activeBadge = STATE_CONFIG[newState]?.badge || '';
    };

    const handlePointerOut = (e) => {
      const related = e.relatedTarget;
      if (!related || related === document.body || related === document.documentElement) {
        resetMagneticTarget();
        if (
          stateRef.current.current !== CURSOR_STATES.LOADING &&
          stateRef.current.current !== CURSOR_STATES.SUCCESS &&
          stateRef.current.current !== CURSOR_STATES.ERROR
        ) {
          stateRef.current.current = CURSOR_STATES.DEFAULT;
          stateRef.current.isHovered = false;
          stateRef.current.activeBadge = '';
        }
      }
    };

    // Click handler for ripple and click state
    const handlePointerDown = (e) => {
      stateRef.current.isDown = true;

      // Spawn click ripple
      rippleQueueRef.current.push({
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        size: 40,
        createdAt: performance.now(),
      });

      // Spawn 8-12 micro sparkles
      const numSparks = 8 + Math.floor(Math.random() * 4);
      for (let i = 0; i < numSparks; i++) {
        const angle = (Math.PI * 2 * i) / numSparks + (Math.random() - 0.5) * 0.4;
        const speed = 2.5 + Math.random() * 3.5;
        sparkQueueRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 1.5 + Math.random() * 1.5,
          life: 1.0,
          decay: 0.035 + Math.random() * 0.02,
        });
      }
    };

    const handlePointerUp = () => {
      stateRef.current.isDown = false;
    };

    // Double-click handler for dual-ripple pulse
    const handleDblClick = (e) => {
      rippleQueueRef.current.push({
        id: Date.now() + 1,
        x: e.clientX,
        y: e.clientY,
        size: 55,
        createdAt: performance.now(),
      });
      setTimeout(() => {
        rippleQueueRef.current.push({
          id: Date.now() + 2,
          x: e.clientX,
          y: e.clientY,
          size: 70,
          createdAt: performance.now(),
        });
      }, 70);
    };

    const handleMouseLeave = () => {
      mouseRef.current.isVisible = false;
      resetMagneticTarget();
    };

    const handleMouseEnter = () => {
      mouseRef.current.isVisible = true;
    };

    // Custom event listener for external state triggers:
    // window.dispatchEvent(new CustomEvent('portfolio-cursor', { detail: { state: 'loading', duration: 1500 } }))
    const handleCustomCursorEvent = (e) => {
      const { state, duration = 2000, badge = '' } = e.detail || {};
      if (state && CURSOR_STATES[state.toUpperCase()]) {
        if (stateRef.current.temporaryTimeout) {
          clearTimeout(stateRef.current.temporaryTimeout);
        }

        const upperState = state.toUpperCase();
        stateRef.current.previous = stateRef.current.current;
        stateRef.current.current = upperState;
        stateRef.current.activeBadge = badge || STATE_CONFIG[upperState]?.badge || '';

        if (duration > 0) {
          stateRef.current.temporaryTimeout = setTimeout(() => {
            stateRef.current.current = stateRef.current.previous || CURSOR_STATES.DEFAULT;
            stateRef.current.activeBadge = STATE_CONFIG[stateRef.current.current]?.badge || '';
            stateRef.current.temporaryTimeout = null;
          }, duration);
        }
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerover', handlePointerOver, { passive: true });
    window.addEventListener('pointerout', handlePointerOut, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    window.addEventListener('dblclick', handleDblClick, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('portfolio-cursor', handleCustomCursorEvent);

    return () => {
      coarseQuery.removeEventListener('change', onCoarseChange);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerover', handlePointerOver);
      window.removeEventListener('pointerout', handlePointerOut);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('dblclick', handleDblClick);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('portfolio-cursor', handleCustomCursorEvent);
      resetMagneticTarget();
      if (stateRef.current.temporaryTimeout) {
        clearTimeout(stateRef.current.temporaryTimeout);
      }
    };
  }, [prefersReduced]);

  return {
    mouseRef,
    stateRef,
    magneticRef,
    rippleQueueRef,
    sparkQueueRef,
    prefersReduced,
  };
}
