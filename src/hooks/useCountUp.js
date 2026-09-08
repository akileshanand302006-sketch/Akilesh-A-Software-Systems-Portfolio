import { useState, useEffect, useRef } from 'react';
import { isReducedMotion } from '../animations';

/**
 * Animated counter that smoothly counts up to target when element enters viewport.
 * - Handles 2026 by displaying directly with a clean reveal (no counting from 0).
 * - Animates 0 -> target for numerical stats (4, 16, 150) using ease-out cubic.
 * - Safe in React StrictMode & does not cancel itself on state update.
 * - Respects prefers-reduced-motion.
 */
export function useCountUp(target, duration = 1400) {
  const numericTarget = Number(target) || 0;
  const isDirectDisplay = numericTarget === 2026 || isReducedMotion();

  const [count, setCount] = useState(() => (isDirectDisplay ? numericTarget : 0));
  const ref = useRef(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || hasAnimatedRef.current) return;

    if (isDirectDisplay) {
      setCount(numericTarget);
      hasAnimatedRef.current = true;
      return;
    }

    let frameId = null;

    const startAnimation = () => {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;

      const startTime = performance.now();
      const startVal = 0;
      const endVal = numericTarget;

      const step = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // ease-out cubic: 1 - (1 - t)^3
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(startVal + (endVal - startVal) * eased);

        setCount(current);

        if (progress < 1) {
          frameId = requestAnimationFrame(step);
        } else {
          setCount(endVal);
        }
      };

      frameId = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          startAnimation();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [numericTarget, duration, isDirectDisplay]);

  return { count, ref };
}


