import { useRef, useCallback } from 'react';
import { isReducedMotion, isTouchDevice } from '../animations';

/**
 * Applies a subtle 3D tilt effect (max 3 degrees) to an element on mouse hover on desktop.
 * Automatically disabled on touch devices and if prefers-reduced-motion is active.
 */
export function useTilt(maxTilt = 3.5) {
  const ref = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (isTouchDevice() || isReducedMotion()) return;

    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const rotateX = (0.5 - y) * maxTilt;
    const rotateY = (x - 0.5) * maxTilt;

    el.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
    el.style.transition = 'transform 0.12s ease-out';
  }, [maxTilt]);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
  }, []);

  return { ref, handleMouseMove, handleMouseLeave };
}

