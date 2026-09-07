import React from 'react';
import { PROFILE_CONFIG } from './profileConfig';

/**
 * FloatingAccents
 * Micro holographic tech accents positioned cleanly outside the photo radius.
 */
export default function FloatingAccents() {
  const { accents } = PROFILE_CONFIG;

  return (
    <div className="profile-accents-field" aria-hidden="true">
      {accents.map((acc) => {
        const style = {
          '--acc-x': `${acc.x}px`,
          '--acc-y': `${acc.y}px`,
          '--acc-size': `${acc.size}px`,
          '--acc-pulse': `${acc.pulse}s`,
        };

        return (
          <div key={acc.id} className="profile-accent-node" style={style}>
            <div className="profile-accent-dot" />
            <span className="profile-accent-label">{acc.label}</span>
          </div>
        );
      })}
    </div>
  );
}
