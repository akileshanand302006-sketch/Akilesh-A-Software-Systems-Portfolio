import { useRef, useCallback } from 'react';

/**
 * Applies a subtle 3D tilt effect to an element on mouse hover.
 * Returns ref to attach and event handlers.
 */
export function useTilt(maxTilt = 8) {
  const ref = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const rotateX = (0.5 - y) * maxTilt;
    const rotateY = (x - 0.5) * maxTilt;

    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    el.style.transition = 'transform 0.1s ease';
  }, [maxTilt]);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    el.style.transition = 'transform 0.5s ease';
  }, []);

  return { ref, handleMouseMove, handleMouseLeave };
}
