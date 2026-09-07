import React from 'react';
import { PROFILE_CONFIG } from './profileConfig';

/**
 * OrbitalRings
 * Renders 3D orbital rings framing the circular portrait.
 * Kept at z-index 2 (behind the portrait lens) so it NEVER slices across the face.
 */
export default function OrbitalRings() {
  const { orbits } = PROFILE_CONFIG;

  return (
    <div className="profile-orbital-system" aria-hidden="true">
      {orbits.map((orbit) => {
        const style = {
          '--orbit-scale': orbit.sizeMultiplier,
          '--orbit-tilt-x': `${orbit.tiltX}deg`,
          '--orbit-tilt-z': `${orbit.tiltZ}deg`,
          '--orbit-duration': `${orbit.duration}s`,
          '--orbit-opacity': orbit.opacity,
        };

        const ringClasses = [
          'profile-orbit-plane',
          `orbit-${orbit.id}`,
          orbit.reverse ? 'orbit-reverse' : '',
          orbit.dashed ? 'orbit-dashed' : '',
        ].filter(Boolean).join(' ');

        return (
          <div key={orbit.id} className={ringClasses} style={style}>
            <div className="profile-orbit-ring">
              {orbit.hasSatellite && (
                <div
                  className="profile-orbit-satellite"
                  style={{ '--sat-size': `${orbit.satelliteSize}px` }}
                >
                  <div className="profile-satellite-core" />
                  <div className="profile-satellite-halo" />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
