import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import HeroScene from '../ThreeScene/HeroScene';
import SceneLighting from '../ThreeScene/SceneLighting';
import { useDevicePerformance } from '../../hooks/useDevicePerformance';

/**
 * HeroOrb - Interactive 3D Centerpiece in the Hero Section.
 */
export function HeroOrb({ theme = 'dark' }) {
  const { isMobile, dpr } = useDevicePerformance();

  return (
    <div className="hero-3d-centerpiece" aria-label="Interactive 3D Glass Orb">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={dpr}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <Suspense fallback={null}>
          <SceneLighting theme={theme} />
          <HeroScene theme={theme} isMobile={isMobile} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default HeroOrb;
