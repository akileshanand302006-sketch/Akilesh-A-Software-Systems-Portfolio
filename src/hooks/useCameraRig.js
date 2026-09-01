import { useRef, useEffect } from 'react';
import * as THREE from 'three';

/**
 * useCameraRig - Hook for calculating smooth damped camera trajectories.
 */
export function useCameraRig(sensitivity = { x: 0.5, y: 0.35, z: 0.15 }) {
  const target = useRef(new THREE.Vector3(0, 0, 8));
  const current = useRef(new THREE.Vector3(0, 0, 8));

  const update = (mouseX, mouseY, elapsedTime, delta) => {
    target.current.x = mouseX * sensitivity.x;
    target.current.y = mouseY * sensitivity.y;
    target.current.z = 8 + Math.sin(elapsedTime * 0.4) * sensitivity.z;

    const factor = Math.min(delta * 2.8, 1);
    current.current.lerp(target.current, factor);

    return current.current;
  };

  return { current, target, update };
}

export default useCameraRig;
