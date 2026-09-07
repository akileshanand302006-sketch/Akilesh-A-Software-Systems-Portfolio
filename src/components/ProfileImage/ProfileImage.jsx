import React, { useState, useEffect, useRef } from 'react';
import profile from '../../data/profile';
import { portfolioService } from '../../services/portfolioService';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import OrbitalRings from './OrbitalRings';
import FloatingAccents from './FloatingAccents';
import { PROFILE_CONFIG } from './profileConfig';
import './ProfileImage.css';

const BASE = import.meta.env.BASE_URL || '/';
const cleanBase = BASE.endsWith('/') ? BASE : `${BASE}/`;
const defaultPhoto = `${cleanBase}profile.jpg`;

/**
 * ProfileImage
 * Premium 3D circular portrait lens experience.
 * Features a crystal-clear, razor-sharp circular portrait with outer glass rim,
 * traveling specular light sweep, 3D orbital rings, and smooth mouse parallax.
 */
export default function ProfileImage() {
  const sceneRef = useRef(null);
  const rigRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(defaultPhoto);
  const prefersReduced = useReducedMotion();

  const mouseCoords = useRef({ targetX: 0, targetY: 0, currentX: 0, currentY: 0 });
  const rafId = useRef(null);

  useEffect(() => {
    let isMounted = true;
    portfolioService.getProfile().then((data) => {
      if (isMounted && data?.profileImage) {
        setImgSrc(data.profileImage);
      }
    });
    return () => { isMounted = false; };
  }, []);

  // Smooth RAF Mouse Parallax
  useEffect(() => {
    if (prefersReduced) return;
    const rig = rigRef.current;
    if (!rig) return;

    const { parallax } = PROFILE_CONFIG;

    const updateParallax = () => {
      const coords = mouseCoords.current;
      coords.currentX += (coords.targetX - coords.currentX) * parallax.lerp;
      coords.currentY += (coords.targetY - coords.currentY) * parallax.lerp;

      const tiltY = coords.currentX * parallax.maxTiltY;
      const tiltX = -coords.currentY * parallax.maxTiltX;

      rig.style.transform = `rotateY(${tiltY.toFixed(2)}deg) rotateX(${tiltX.toFixed(2)}deg)`;
      rafId.current = requestAnimationFrame(updateParallax);
    };

    rafId.current = requestAnimationFrame(updateParallax);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [prefersReduced]);

  const handleMouseMove = (e) => {
    if (prefersReduced) return;
    const scene = sceneRef.current;
    if (!scene) return;

    const rect = scene.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;

    mouseCoords.current.targetX = Math.max(-1, Math.min(1, x));
    mouseCoords.current.targetY = Math.max(-1, Math.min(1, y));
  };

  const handleMouseLeave = () => {
    mouseCoords.current.targetX = 0;
    mouseCoords.current.targetY = 0;
  };

  const handleClick = () => {
    window.dispatchEvent(
      new CustomEvent('portfolio-cursor', {
        detail: { state: 'success', duration: 1200, badge: 'EXPLORE' },
      })
    );
  };

  return (
    <div
      className="profile-3d-scene"
      ref={sceneRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor="image"
      data-cursor-badge="VIEW PROFILE"
    >
      {/* Floating 3D Rig */}
      <div className="profile-floating-rig" ref={rigRef}>
        {/* Layer 1: Ambient Volumetric Backlight (Behind photo) */}
        <div className="profile-ambient-glow" aria-hidden="true" />
        <div className="profile-rim-halo" aria-hidden="true" />

        {/* Layer 2: 3D Orbital Rings System (Behind photo lens) */}
        <OrbitalRings />

        {/* Layer 3: Main Circular Portrait Lens (Foreground) */}
        <div className="profile-lens-wrapper" onClick={handleClick}>
          {/* Outer Traveling Specular Beam (Circling outer perimeter) */}
          <div className="profile-specular-ring" aria-hidden="true" />

          {/* Outer Glass Rim (Annular frame around photo) */}
          <div className="profile-glass-rim" aria-hidden="true" />

          {/* Clean, Sharp, 100% Unblurred Circular Photograph */}
          <div className="profile-photo-aperture">
            <img
              src={imgSrc}
              alt={profile.name || 'Akilesh A'}
              className="profile-circular-photo"
              loading="eager"
              onError={(e) => {
                if (e.target.src !== defaultPhoto) {
                  e.target.src = defaultPhoto;
                }
              }}
            />
          </div>
        </div>

        {/* Layer 4: Micro Tech Accents (Outside photo) */}
        <FloatingAccents />
      </div>
    </div>
  );
}
