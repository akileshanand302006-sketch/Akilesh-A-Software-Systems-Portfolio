import { useRef } from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import profile from '../../data/profile';
import './ProfileImage.css';

export default function ProfileImage() {
  const containerRef = useRef(null);

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
      transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
    >
      {/* Outer glow ring */}
      <div className="profile-glow-ring animate-pulse-glow" />
      
      {/* Rotating border ring */}
      <div className="profile-orbit-ring animate-rotate" />
      
      {/* Image frame */}
      <div className="profile-frame">
        {profile.profileImage ? (
          <img
            src={profile.profileImage}
            alt={`${profile.name} profile photo`}
            className="profile-img"
            loading="eager"
          />
        ) : (
          <div className="profile-placeholder">
            <User size={48} strokeWidth={1.5} />
            <span>Your Photo</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
