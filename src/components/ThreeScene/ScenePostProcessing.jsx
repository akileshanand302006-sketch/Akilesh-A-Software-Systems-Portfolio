import React from 'react';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

/**
 * ScenePostProcessing - Cinematic bloom and subtle vignette.
 * Dynamically throttled/disabled on mobile devices to preserve 60 FPS.
 */
export function ScenePostProcessing({ theme = 'dark', isMobile = false, prefersReducedMotion = false }) {
  if (isMobile || prefersReducedMotion) {
    return null;
  }

  const isLight = theme === 'light';

  return (
    <EffectComposer multisampling={0} disableNormalPass>
      <Bloom
        intensity={isLight ? 0.35 : 0.65}
        luminanceThreshold={isLight ? 0.85 : 0.6}
        luminanceSmoothing={0.4}
        mipmapBlur
      />
      <Vignette
        offset={0.3}
        darkness={isLight ? 0.15 : 0.45}
        eskil={false}
      />
    </EffectComposer>
  );
}

export default ScenePostProcessing;
