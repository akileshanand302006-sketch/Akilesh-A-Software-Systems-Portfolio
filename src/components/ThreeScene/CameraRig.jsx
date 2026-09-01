import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * CameraRig - Smooth lerped camera motion tied to mouse coordinates and scroll depth.
 */
export function CameraRig({ mouseRef, prefersReducedMotion = false }) {
  const currentPos = useRef(new THREE.Vector3(0, 0, 8));
  const targetPos = useRef(new THREE.Vector3(0, 0, 8));

  useFrame((state, delta) => {
    if (prefersReducedMotion) return;

    const mouseX = mouseRef?.current?.targetX || state.pointer.x || 0;
    const mouseY = mouseRef?.current?.targetY || state.pointer.y || 0;

    // Subtle parallax offset
    targetPos.current.x = mouseX * 0.55;
    targetPos.current.y = mouseY * 0.35;
    targetPos.current.z = 8 + Math.sin(state.clock.elapsedTime * 0.35) * 0.12;

    const factor = Math.min(delta * 2.5, 1);
    currentPos.current.lerp(targetPos.current, factor);

    state.camera.position.x = currentPos.current.x;
    state.camera.position.y = currentPos.current.y;
    state.camera.position.z = currentPos.current.z;

    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

export default CameraRig;
