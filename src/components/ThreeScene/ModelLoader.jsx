import React, { Suspense } from 'react';
import { useGLTF } from '@react-three/drei';

/**
 * ModelLoader - Safely loads GLTF/GLB models with procedural fallback.
 */
export function ModelLoader({ url, fallbackScale = 1, ...props }) {
  if (!url) {
    return (
      <mesh {...props} scale={fallbackScale}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color=#38bdf8 wireframe />
      </mesh>
    );
  }

  return (
    <Suspense
      fallback={
        <mesh {...props} scale={fallbackScale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color=#0284c7 wireframe />
        </mesh>
      }
    >
      <LoadedModel url={url} {...props} />
    </Suspense>
  );
}

function LoadedModel({ url, ...props }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene.clone()} {...props} />;
}

export default ModelLoader;
