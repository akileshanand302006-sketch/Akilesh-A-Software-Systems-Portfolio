import { useState, useEffect, useRef } from 'react';

/**
 * useSceneVisibility - Disables or throttles 3D rendering when the target container is off-screen.
 */
export function useSceneVisibility(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(true);
  const elementRef = useRef(null);

  useEffect(() => {
    if (!elementRef.current || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold }
    );

    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [elementRef, isVisible];
}

export default useSceneVisibility;
