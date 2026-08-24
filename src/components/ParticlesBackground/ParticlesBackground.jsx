import { useCallback, useMemo } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function ParticlesBackground({ theme }) {
  const prefersReduced = useReducedMotion();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const options = useMemo(() => {
    if (prefersReduced) return null;

    const isDark = theme === 'dark';
    const particleCount = isMobile ? 10 : 22;

    return {
      fullScreen: {
        enable: true,
        zIndex: 0,
      },
      fpsLimit: 60,
      particles: {
        number: {
          value: particleCount,
          density: { enable: true, area: 1400 },
        },
        color: {
          value: isDark ? ['#38bdf8', '#60a5fa', '#22d3ee'] : ['#2563eb', '#38bdf8', '#0891b2'],
        },
        opacity: {
          value: { min: 0.12, max: 0.35 },
          animation: { enable: true, speed: 0.3, minimumValue: 0.08 },
        },
        size: {
          value: { min: 1, max: 2.5 },
        },
        move: {
          enable: true,
          speed: 0.4,
          direction: 'none',
          random: true,
          straight: false,
          outModes: { default: 'bounce' },
        },
        links: {
          enable: true,
          distance: 120,
          color: isDark ? '#38bdf8' : '#2563eb',
          opacity: 0.09,
          width: 1,
        },
      },
      interactivity: {
        events: {
          onHover: { enable: false },
          onClick: { enable: false },
          resize: true,
        },
      },
      detectRetina: false, // Prevents 4K retina canvas overdraw
    };
  }, [theme, prefersReduced, isMobile]);

  if (prefersReduced || !options) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={options}
        className="particles-container"
      />
    </div>
  );
}
