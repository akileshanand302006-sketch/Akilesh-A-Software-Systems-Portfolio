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
          value: isDark
            ? ['#38bdf8', '#60a5fa', '#22d3ee']
            : ['#1677ff', '#00c8ff', '#7c5cff', '#ffffff'],
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
          color: isDark ? '#38bdf8' : '#1677ff',
          opacity: 0.10,
          width: 1,
        },
      },
      interactivity: {
        events: {
          onHover: {
            enable: !isMobile,
            mode: ['grab', 'bubble'],
          },
          onClick: {
            enable: false,
          },
          resize: true,
        },
        modes: {
          grab: {
            distance: 140,
            links: {
              opacity: 0.35,
              color: isDark ? '#38bdf8' : '#2563eb',
            },
          },
          bubble: {
            distance: 140,
            size: 3.5,
            duration: 0.4,
            opacity: 0.6,
          },
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
