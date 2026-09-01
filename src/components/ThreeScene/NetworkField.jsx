import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function NetworkField({ theme = 'dark', isMobile = false }) {
  const pointsRef = useRef();
  const linesRef = useRef();
  const isLight = theme === 'light';

  const count = isMobile ? 28 : 55;
  const maxDistance = 3.8;

  const [pointsGeo, linesGeo] = useMemo(() => {
    const coords = [];
    for (let i = 0; i < count; i++) {
      coords.push(
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 6 - 2
      );
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.Float32BufferAttribute(coords, 3));

    const linePositions = [];
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = coords[i * 3] - coords[j * 3];
        const dy = coords[i * 3 + 1] - coords[j * 3 + 1];
        const dz = coords[i * 3 + 2] - coords[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < maxDistance) {
          linePositions.push(
            coords[i * 3], coords[i * 3 + 1], coords[i * 3 + 2],
            coords[j * 3], coords[j * 3 + 1], coords[j * 3 + 2]
          );
        }
      }
    }

    const lGeo = new THREE.BufferGeometry();
    lGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

    return [pGeo, lGeo];
  }, [count]);

  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.04;
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.5;
      pointsRef.current.rotation.x = Math.sin(t) * 0.08;
    }
    if (linesRef.current) {
      linesRef.current.rotation.y = t * 0.5;
      linesRef.current.rotation.x = Math.sin(t) * 0.08;
    }
  });

  const nodeColor = isLight ? '#0284c7' : '#38bdf8';
  const lineColor = isLight ? '#bae6fd' : '#0369a1';

  return (
    <group name="NetworkField">
      <points ref={pointsRef} geometry={pointsGeo}>
        <pointsMaterial
          size={isMobile ? 0.07 : 0.11}
          color={nodeColor}
          transparent
          opacity={isLight ? 0.6 : 0.8}
          sizeAttenuation
        />
      </points>

      <lineSegments ref={linesRef} geometry={linesGeo}>
        <lineBasicMaterial
          color={lineColor}
          transparent
          opacity={isLight ? 0.18 : 0.28}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

export default NetworkField;
