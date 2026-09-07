import React, { useEffect, useRef } from 'react';
import { useCursorInteraction } from './useCursorInteraction';
import {
  CURSOR_STATES,
  STATE_CONFIG,
  LERP_FACTORS,
  TRAIL_CONFIG,
} from './cursorConfig';
import './CustomCursor.css';

/**
 * CustomCursor
 * Premium Liquid Glass interactive cursor with multi-tier glow effect,
 * specular refraction, delayed kinetic tracking ring, and silky 60-120+ FPS movement.
 */
export default function CustomCursor() {
  const {
    mouseRef,
    stateRef,
    magneticRef,
    rippleQueueRef,
    sparkQueueRef,
    prefersReduced,
  } = useCursorInteraction();

  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const delayedRingRef = useRef(null);
  const auraRef = useRef(null);
  const badgeRef = useRef(null);
  const badgeTextRef = useRef(null);
  const canvasRef = useRef(null);
  const rippleContainerRef = useRef(null);

  useEffect(() => {
    if (prefersReduced || mouseRef.current.isCoarse) {
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    const delayedRing = delayedRingRef.current;
    const aura = auraRef.current;
    const badge = badgeRef.current;
    const badgeText = badgeTextRef.current;
    const canvas = canvasRef.current;
    const rippleContainer = rippleContainerRef.current;

    if (!dot || !ring || !delayedRing || !aura || !canvas) return;

    // Setup Canvas
    const ctx = canvas.getContext('2d', { alpha: true });
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Smooth coordinates for multi-tier lerp
    const coords = {
      dotX: -200,
      dotY: -200,
      ringX: -200,
      ringY: -200,
      delayedX: -200,
      delayedY: -200,
      auraX: -200,
      auraY: -200,
    };

    // Trail buffer
    const trail = [];
    const sparks = [];
    let lastRenderState = '';
    let isVisible = false;
    let rafId = null;

    // Primary 60-120+ FPS RAF Loop
    const renderLoop = () => {
      const mouse = mouseRef.current;
      const state = stateRef.current;
      const magnetic = magneticRef.current;

      // Visibility transitions
      if (mouse.isVisible && !isVisible) {
        isVisible = true;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
        delayedRing.style.opacity = '1';
        aura.style.opacity = '1';
        canvas.style.opacity = '1';
      } else if (!mouse.isVisible && isVisible) {
        isVisible = false;
        dot.style.opacity = '0';
        ring.style.opacity = '0';
        delayedRing.style.opacity = '0';
        aura.style.opacity = '0';
        canvas.style.opacity = '0';
      }

      if (isVisible) {
        // Target coordinates with magnetic pull
        const targetX = mouse.targetX;
        const targetY = mouse.targetY;
        const ringTargetX = targetX + (magnetic.active ? magnetic.pullX : 0);
        const ringTargetY = targetY + (magnetic.active ? magnetic.pullY : 0);

        // Multi-tier smooth interpolation
        coords.dotX += (targetX - coords.dotX) * LERP_FACTORS.DOT;
        coords.dotY += (targetY - coords.dotY) * LERP_FACTORS.DOT;

        coords.ringX += (ringTargetX - coords.ringX) * LERP_FACTORS.RING;
        coords.ringY += (ringTargetY - coords.ringY) * LERP_FACTORS.RING;

        coords.delayedX += (ringTargetX - coords.delayedX) * LERP_FACTORS.DELAYED_RING;
        coords.delayedY += (ringTargetY - coords.delayedY) * LERP_FACTORS.DELAYED_RING;

        coords.auraX += (targetX - coords.auraX) * LERP_FACTORS.AURA;
        coords.auraY += (targetY - coords.auraY) * LERP_FACTORS.AURA;

        // Current active config
        const currentConfig = STATE_CONFIG[state.current] || STATE_CONFIG.DEFAULT;
        const isClick = state.isDown;
        const effectiveConfig = isClick ? STATE_CONFIG.CLICK : currentConfig;

        // State classes and badge synchronization
        if (lastRenderState !== state.current || state.activeBadge !== (badgeText?.textContent || '')) {
          lastRenderState = state.current;

          ring.className = 'cursor-ring ' + (effectiveConfig.className || 'state-default');
          delayedRing.className = 'cursor-delayed-ring ' + (effectiveConfig.className || 'state-default');
          dot.className = 'cursor-dot ' + (effectiveConfig.className || 'state-default');
          aura.className = 'cursor-aura ' + (effectiveConfig.className || 'state-default');

          if (effectiveConfig.badge) {
            badge.style.display = 'block';
            badgeText.textContent = effectiveConfig.badge;
          } else {
            badge.style.display = 'none';
            badgeText.textContent = '';
          }
        }

        // Apply click modifier
        if (isClick) {
          ring.classList.add('is-down');
          delayedRing.classList.add('is-down');
          dot.classList.add('is-down');
        } else {
          ring.classList.remove('is-down');
          delayedRing.classList.remove('is-down');
          dot.classList.remove('is-down');
        }

        // Apply GPU transform matrices: translate3d
        const ringSize = effectiveConfig.ringSize;
        const delayedSize = effectiveConfig.delayedSize;
        const dotSize = effectiveConfig.dotSize;
        const auraSize = effectiveConfig.auraSize;

        dot.style.transform = `translate3d(${(coords.dotX - dotSize / 2).toFixed(1)}px, ${(coords.dotY - dotSize / 2).toFixed(1)}px, 0)`;
        ring.style.transform = `translate3d(${(coords.ringX - ringSize / 2).toFixed(1)}px, ${(coords.ringY - ringSize / 2).toFixed(1)}px, 0)`;
        delayedRing.style.transform = `translate3d(${(coords.delayedX - delayedSize / 2).toFixed(1)}px, ${(coords.delayedY - delayedSize / 2).toFixed(1)}px, 0)`;
        aura.style.transform = `translate3d(${(coords.auraX - auraSize / 2).toFixed(1)}px, ${(coords.auraY - auraSize / 2).toFixed(1)}px, 0)`;

        // Canvas Motion Trail & Sparks
        const now = performance.now();

        if (mouse.speed >= TRAIL_CONFIG.minVelocity) {
          trail.push({
            x: coords.dotX,
            y: coords.dotY,
            time: now,
            speed: mouse.speed,
          });
        }

        if (mouse.speed >= TRAIL_CONFIG.sparkThreshold) {
          const angle = Math.random() * Math.PI * 2;
          const spd = 1.0 + Math.random() * 2.2;
          sparks.push({
            x: coords.dotX,
            y: coords.dotY,
            vx: Math.cos(angle) * spd,
            vy: Math.sin(angle) * spd,
            size: 1.2 + Math.random() * 1.0,
            life: 0.85,
            decay: 0.05,
          });
        }

        if (sparkQueueRef.current.length > 0) {
          while (sparkQueueRef.current.length > 0) {
            sparks.push(sparkQueueRef.current.shift());
          }
        }

        // Drain ripple queue and spawn DOM liquid shockwaves
        if (rippleQueueRef.current.length > 0 && rippleContainer) {
          while (rippleQueueRef.current.length > 0) {
            const r = rippleQueueRef.current.shift();
            const rippleEl = document.createElement('div');
            rippleEl.className = 'cursor-ripple';
            rippleEl.style.left = `${r.x}px`;
            rippleEl.style.top = `${r.y}px`;
            rippleEl.style.width = `${r.size}px`;
            rippleEl.style.height = `${r.size}px`;
            rippleContainer.appendChild(rippleEl);

            setTimeout(() => {
              rippleEl.remove();
            }, 440);
          }
        }

        // Clean expired trail points
        while (trail.length > 0 && now - trail[0].time > TRAIL_CONFIG.fadeTimeMs) {
          trail.shift();
        }

        // Render Canvas Trail & Sparks
        ctx.clearRect(0, 0, width, height);

        if (trail.length > 1) {
          for (let i = 1; i < trail.length; i++) {
            const p1 = trail[i - 1];
            const p2 = trail[i];
            const ageRatio = 1 - (now - p2.time) / TRAIL_CONFIG.fadeTimeMs;
            if (ageRatio <= 0) continue;

            const alpha = Math.max(0, Math.min(1, ageRatio * 0.45));
            const lineWidth = Math.max(1, (i / trail.length) * 3.2);

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha.toFixed(2)})`;
            ctx.lineWidth = lineWidth;
            ctx.lineCap = 'round';
            ctx.stroke();
          }
        }

        // Render sparks
        for (let i = sparks.length - 1; i >= 0; i--) {
          const sp = sparks[i];
          sp.x += sp.vx;
          sp.y += sp.vy;
          sp.life -= sp.decay;

          if (sp.life <= 0) {
            sparks.splice(i, 1);
            continue;
          }

          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.size * sp.life, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(34, 211, 238, ${(sp.life * 0.85).toFixed(2)})`;
          ctx.shadowBlur = 4;
          ctx.shadowColor = '#38bdf8';
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      rafId = requestAnimationFrame(renderLoop);
    };

    rafId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [prefersReduced]);

  if (prefersReduced) return null;

  return (
    <div className="custom-cursor-root" aria-hidden="true">
      {/* Layer 5: Digital Light Trail & Sparkle Canvas */}
      <canvas ref={canvasRef} className="cursor-trail-canvas" />

      {/* Layer 4: Atmospheric Cyan Aurora Halo */}
      <div ref={auraRef} className="cursor-aura state-default" />

      {/* Layer 3: Secondary Trailing Kinetic Glass Ring */}
      <div ref={delayedRingRef} className="cursor-delayed-ring state-default" />

      {/* Layer 2: Main Liquid Glass Tracking Bubble */}
      <div ref={ringRef} className="cursor-ring state-default">
        {/* Specular curved reflection glint */}
        <div className="glass-lens-reflection" />
        {/* Prismatic border glow rim */}
        <div className="glass-lens-rim" />
        {/* Inner volumetric light glow */}
        <div className="glass-lens-glow" />
        {/* Centered label badge */}
        <div ref={badgeRef} className="cursor-badge" style={{ display: 'none' }}>
          <span ref={badgeTextRef} className="cursor-badge-text" />
        </div>
      </div>

      {/* Layer 1: Central Luminous Core Dot */}
      <div ref={dotRef} className="cursor-dot state-default">
        <div className="cursor-dot-inner" />
      </div>

      {/* Layer 6: Click Ripple Shockwaves */}
      <div ref={rippleContainerRef} className="cursor-ripples" />
    </div>
  );
}
