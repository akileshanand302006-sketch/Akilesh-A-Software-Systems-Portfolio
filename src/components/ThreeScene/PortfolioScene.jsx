import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import SceneLighting from './SceneLighting';
import CameraRig from './CameraRig';
import FloatingObjects from './FloatingObjects';
import TechnologyNodes from './TechnologyNodes';
import OrbitalSystem from './OrbitalSystem';
import NetworkField from './NetworkField';
import ScenePostProcessing from './ScenePostProcessing';
import { useDevicePerformance } from '../../hooks/useDevicePerformance';
import { useMouseParallax } from '../../hooks/useMouseParallax';
import '../../styles/3d-scene.css';

export function PortfolioScene({ theme = 'dark' }) {
  const { isMobile, prefersReducedMotion, dpr } = useDevicePerformance();
  const mouseRef = useMouseParallax();

  return (
    <div className="portfolio-3d-canvas-container" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45, near: 0.1, far: 100 }}
        dpr={dpr}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
      >
        <Suspense fallback={null}>
          <SceneLighting theme={theme} />
          <CameraRig mouseRef={mouseRef} prefersReducedMotion={prefersReducedMotion} />
          <NetworkField theme={theme} isMobile={isMobile} />
          <TechnologyNodes theme={theme} isMobile={isMobile} />
          <FloatingObjects theme={theme} isMobile={isMobile} />
          <OrbitalSystem theme={theme} isMobile={isMobile} />
          <ScenePostProcessing
            theme={theme}
            isMobile={isMobile}
            prefersReducedMotion={prefersReducedMotion}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default PortfolioScene;
