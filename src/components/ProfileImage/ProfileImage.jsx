import { useState, useEffect } from 'react';
import profile from '../../data/profile';
import { portfolioService } from '../../services/portfolioService';
import './ProfileImage.css';

const BASE = import.meta.env.BASE_URL || '/';
const cleanBase = BASE.endsWith('/') ? BASE : `${BASE}/`;
const fallbackImage = `${cleanBase}profile.jpg`;

export default function ProfileImage() {
  const [imgSrc, setImgSrc] = useState(fallbackImage);

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

  return (
    <div className="profile-image-container">
      <div className="profile-image-wrapper glass-card">
        {/* Glow halo */}
        <div className="profile-image-glow" />

        {/* Profile Image with Automatic Fallback */}
        <img
          src={imgSrc}
          alt={profile.name || 'Akilesh A'}
          className="profile-img"
          loading="eager"
          onError={(e) => {
            if (e.target.src !== fallbackImage) {
              e.target.src = fallbackImage;
            }
          }}
        />

        {/* Ambient Ring */}
        <div className="profile-ring" />
      </div>
    </div>
  );
}
