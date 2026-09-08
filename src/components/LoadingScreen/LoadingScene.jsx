import React, { Suspense, useRef, Component } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import LoadingCore from './LoadingCore';
import { useDevicePerformance } from '../../hooks/useDevicePerformance';

class SceneErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('LoadingScene WebGL encountered an issue, falling back to CSS:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError();
    }
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

function LoadingCameraRig({ prefersReducedMotion }) {
  useFrame((state) => {
    if (prefersReducedMotion) return;
    const { pointer, camera } = state;
    // Extremely subtle, smooth parallax tilt
    const targetX = pointer.x * 0.35;
    const targetY = pointer.y * 0.25;
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function LoadingScene({
  theme = 'dark',
  onError
}) {
  const { isMobile, dpr, prefersReducedMotion } = useDevicePerformance();
  const isLight = theme === 'light';

  return (
    <div className="loading-scene-canvas-wrap" aria-hidden="true">
      <SceneErrorBoundary onError={onError}>
        <Canvas
          camera={{ position: [0, 0, 6.8], fov: 42, near: 0.1, far: 50 }}
          dpr={dpr}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
          }}
          onCreated={({ gl }) => {
            if (!gl) {
              onError?.();
            }
          }}
        >
          <Suspense fallback={null}>
            <ambientLight
              intensity={isLight ? 0.9 : 0.45}
              color={isLight ? '#f0f9ff' : '#0a192f'}
            />
            <directionalLight
              position={[4, 5, 5]}
              intensity={isLight ? 1.6 : 1.2}
              color={isLight ? '#38bdf8' : '#38bdf8'}
            />
            <pointLight
              position={[0, 0, 0]}
              intensity={isLight ? 1.8 : 2.5}
              distance={8}
              color={isLight ? '#0284c7' : '#22d3ee'}
            />
            <pointLight
              position={[-4, -3, -2]}
              intensity={isLight ? 1.0 : 1.5}
              distance={10}
              color={isLight ? '#818cf8' : '#a78bfa'}
            />

            <LoadingCameraRig prefersReducedMotion={prefersReducedMotion || isMobile} />

            <LoadingCore
              theme={theme}
              isMobile={isMobile}
              prefersReducedMotion={prefersReducedMotion}
            />
          </Suspense>
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
}
