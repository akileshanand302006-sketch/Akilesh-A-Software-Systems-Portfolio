import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingScene from './LoadingScene';
import profile from '../../data/profile';
import {
  animateLoadingScreenEntrance,
  animateLoadingScreenExit,
  safeAnime,
  cleanupAnime,
  EASING,
} from '../../animations';
import './LoadingScreen.css';

const STATUS_STAGES = [
  { threshold: 0, text: 'INITIALIZING SYSTEM...' },
  { threshold: 28, text: 'CALIBRATING 3D CORE...' },
  { threshold: 62, text: 'SYNCHRONIZING COMPONENTS...' },
  { threshold: 92, text: 'SYSTEM READY' },
];

function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

export default function LoadingScreen({ theme = 'dark', onComplete }) {
  const [progress, setProgress] = useState(0);
  const [webglSupported, setWebglSupported] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const isCompleteRef = useRef(false);

  // DOM element refs for Anime.js animation coordination
  const telemetryRef = useRef(null);
  const hudPanelRef = useRef(null);
  const brandRef = useRef(null);
  const subtitleRef = useRef(null);
  const statusWrapRef = useRef(null);
  const statusTextRef = useRef(null);
  const progressCapsuleRef = useRef(null);

  // Check initial WebGL support
  useEffect(() => {
    if (!isWebGLAvailable()) {
      setWebglSupported(false);
    }
  }, []);

  // Coordinated Anime.js entrance sequence on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      animateLoadingScreenEntrance({
        telemetry: telemetryRef.current,
        brand: brandRef.current,
        subtitle: subtitleRef.current,
        statusWrap: statusWrapRef.current,
        progressCapsule: progressCapsuleRef.current,
      });
    }, 50);

    return () => {
      clearTimeout(timer);
      cleanupAnime([
        telemetryRef.current,
        brandRef.current,
        subtitleRef.current,
        statusWrapRef.current,
        progressCapsuleRef.current,
      ]);
    };
  }, []);

  // Smooth progress ramp (~1.25 seconds total initialization)
  useEffect(() => {
    const startTime = performance.now();
    const duration = 1250; // 1.25s duration

    let frameId;
    const updateProgress = (currentTime) => {
      const elapsed = currentTime - startTime;
      const rawProgress = Math.min(100, Math.floor((elapsed / duration) * 100));

      setProgress(rawProgress);

      if (rawProgress < 100) {
        frameId = requestAnimationFrame(updateProgress);
      } else {
        // Reached 100% -> Trigger coordinated Anime.js exit animation
        if (!isCompleteRef.current) {
          isCompleteRef.current = true;
          setTimeout(() => {
            animateLoadingScreenExit(hudPanelRef.current, () => {
              setIsExiting(true);
            });
          }, 180);
        }
      }
    };

    frameId = requestAnimationFrame(updateProgress);

    return () => cancelAnimationFrame(frameId);
  }, []);

  // Compute current initialization text
  const currentStatusText = useMemo(() => {
    for (let i = STATUS_STAGES.length - 1; i >= 0; i--) {
      if (progress >= STATUS_STAGES[i].threshold) {
        return STATUS_STAGES[i].text;
      }
    }
    return STATUS_STAGES[0].text;
  }, [progress]);

  // Anime.js smooth micro-transition on status text change
  useEffect(() => {
    if (statusTextRef.current) {
      safeAnime({
        targets: statusTextRef.current,
        opacity: [0.35, 1],
        translateY: [4, 0],
        duration: 200,
        easing: EASING.DECEL,
      });
    }
  }, [currentStatusText]);

  const isLight = theme === 'light';

  return (
    <AnimatePresence
      onExitComplete={() => {
        onComplete?.();
      }}
    >
      {!isExiting && (
        <motion.aside
          className={`loading-screen-portal ${isLight ? 'light-mode' : 'dark-mode'}`}
          data-theme={theme}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.02,
            filter: 'blur(6px)',
            transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] }
          }}
          transition={{ duration: 0.35 }}
          role="status"
          aria-live="polite"
          aria-label="Akilesh A Software Systems Portfolio is initializing"
        >
          {/* ── Ambient Radial Glow Layers ── */}
          <div className="loading-ambient-glow primary-glow" />
          <div className="loading-ambient-glow secondary-glow" />
          <div className="loading-grid-overlay" />

          {/* ── Top Diagnostic Telemetry Strip ── */}
          <div className="loading-telemetry-header" ref={telemetryRef}>
            <div className="telemetry-pill">
              <span className="telemetry-dot live" />
              <span className="telemetry-text">SYS_BOOT: 0x884F</span>
            </div>
            <div className="telemetry-pill telemetry-right">
              <span className="telemetry-text">
                {webglSupported ? '3D_CORE: ONLINE' : 'CSS_ENGINE: ACTIVE'}
              </span>
            </div>
          </div>

          {/* ── Central Stage (3D Canvas or CSS Fallback) ── */}
          <div className="loading-stage-center">
            {webglSupported ? (
              <LoadingScene
                theme={theme}
                onError={() => setWebglSupported(false)}
              />
            ) : (
              /* Graceful CSS 3D Fallback */
              <div className="loading-css-fallback-core" aria-hidden="true">
                <div className="css-core-orb">
                  <div className="css-core-nucleus" />
                </div>
                <div className="css-ring ring-x" />
                <div className="css-ring ring-y" />
                <div className="css-ring ring-z" />
                <div className="css-scan-line" />
              </div>
            )}
          </div>

          {/* ── Liquid Glass Central HUD & Branding ── */}
          <div className="loading-hud-panel glass-panel" ref={hudPanelRef}>
            {/* Logo */}
            <div
              className="loading-brand"
              ref={brandRef}
            >
              <span className="loading-bracket">&lt;</span>
              <span className="loading-name">{profile.firstName || 'Akilesh'}</span>
              <span className="loading-bracket">/&gt;</span>
            </div>

            {/* Subtitle */}
            <div
              className="loading-subtitle"
              ref={subtitleRef}
            >
              SOFTWARE SYSTEMS PORTFOLIO
            </div>

            {/* Status sequence with cursor */}
            <div className="loading-status-wrap" ref={statusWrapRef}>
              <span className="loading-status-text" ref={statusTextRef}>
                {currentStatusText}
              </span>
              <span className="loading-status-cursor">_</span>
            </div>

            {/* Luminous Progress Indicator Capsule */}
            <div className="loading-progress-capsule" ref={progressCapsuleRef}>
              <div className="loading-progress-track">
                <div
                  className="loading-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="loading-progress-meta">
                <span className="loading-progress-label">INIT_SEQUENCE</span>
                <span className="loading-progress-val">{progress}%</span>
              </div>
            </div>

            {/* Secondary technical tags */}
            <div className="loading-hud-footer">
              <span className="hud-tag">CIT COIMBATORE</span>
              <span className="hud-sep">•</span>
              <span className="hud-tag">FULL-STACK & SYSTEMS</span>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
