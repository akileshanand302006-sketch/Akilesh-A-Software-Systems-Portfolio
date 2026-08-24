import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import profile from '../../data/profile';
import { portfolioService } from '../../services/portfolioService';
import './ProfileImage.css';

// Direct asset URL for 100% reliable Vite bundling
const BASE = import.meta.env.BASE_URL || '/';
const cleanBase = BASE.endsWith('/') ? BASE : `${BASE}/`;
const defaultPhoto = `${cleanBase}profile.jpg`;

export default function ProfileImage() {
  const containerRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(defaultPhoto);

  useEffect(() => {
    let isMounted = true;
    portfolioService.getProfile().then((data) => {
      if (isMounted && data?.profileImage) {
        setImgSrc(data.profileImage);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleMouseMove = (e) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
  };

  const handleMouseLeave = () => {
    const el = containerRef.current;
    if (el) {
      el.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg)';
      el.style.transition = 'transform 0.5s ease';
    }
  };

  return (
    <motion.div
      className="profile-image-container"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
    >
      {/* Outer glow ring */}
      <div className="profile-glow-ring animate-pulse-glow" />

      {/* Rotating border ring */}
      <div className="profile-orbit-ring animate-rotate" />

      {/* Image frame */}
      <div className="profile-frame">
        <img
          src={imgSrc}
          alt={profile.name || 'Akilesh A'}
          className="profile-img"
          loading="eager"
          onError={(e) => {
            if (e.target.src !== defaultPhoto) {
              e.target.src = defaultPhoto;
            }
          }}
        />
      </div>
    </motion.div>
  );
}
