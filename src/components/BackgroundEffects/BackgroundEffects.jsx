import React from 'react';
import AtmosphericBackground from './AtmosphericBackground';
import GradientBlobs from './GradientBlobs';
import PerspectiveGrid from './PerspectiveGrid';
import GlowOrbs from './GlowOrbs';
import PortfolioScene from '../ThreeScene/PortfolioScene';
import '../../styles/background.css';

/**
 * BackgroundEffects - Multi-layer background orchestrator:
 * Layer 1: Atmospheric Background
 * Layer 2: Gradient Blobs
 * Layer 3: Perspective Grid
 * Layer 4: Glow Orbs
 * Layer 5: Portfolio 3D Three.js Scene
 */
export function BackgroundEffects({ theme = 'dark' }) {
  return (
    <div className="bg-multi-layer-system" aria-hidden="true">
      {/* CSS Layers */}
      <AtmosphericBackground theme={theme} />
      <GradientBlobs />
      <PerspectiveGrid theme={theme} />
      <GlowOrbs />

      {/* WebGL 3D Layer */}
      <PortfolioScene theme={theme} />
    </div>
  );
}

export default BackgroundEffects;
