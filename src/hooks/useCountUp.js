import { useState, useEffect, useRef } from 'react';
import { animateCountUp, cleanupAnime } from '../animations';

/**
 * Animated counter powered by Anime.js that counts up when element enters viewport.
 * Respects prefers-reduced-motion and is safe in React StrictMode.
 */
export function useCountUp(target, duration = 1500) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);
  const counterObj = useRef({ val: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element || hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          animateCountUp(
            counterObj.current,
            target,
            (val) => setCount(val),
            { duration }
          );
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      cleanupAnime(counterObj.current);
    };
  }, [target, duration, hasAnimated]);

  return { count, ref };
}

