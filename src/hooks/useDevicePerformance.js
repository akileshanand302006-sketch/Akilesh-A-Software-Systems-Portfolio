import { useState, useEffect } from 'react';

/**
 * useDevicePerformance - Detects device tier, mobile displays, and reduced motion.
 */
export function useDevicePerformance() {
  const [deviceTier, setDeviceTier] = useState('desktop'); // 'mobile' | 'tablet' | 'desktop'
  const [isMobile, setIsMobile] = useState(false);
  const [dpr, setDpr] = useState([1, 1.5]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      const mobileRegex = /Mobi|Android|iPhone/i.test(navigator.userAgent);

      if (w <= 640 || mobileRegex) {
        setDeviceTier('mobile');
        setIsMobile(true);
        setDpr([1, 1.25]);
      } else if (w <= 1024) {
        setDeviceTier('tablet');
        setIsMobile(false);
        setDpr([1, 1.35]);
      } else {
        setDeviceTier('desktop');
        setIsMobile(false);
        setDpr([1, 1.5]);
      }
    };

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const onMotion = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', onMotion);

    check();
    window.addEventListener('resize', check);

    return () => {
      window.removeEventListener('resize', check);
      mediaQuery.removeEventListener('change', onMotion);
    };
  }, []);

  return { deviceTier, isMobile, dpr, prefersReducedMotion };
}

export default useDevicePerformance;
