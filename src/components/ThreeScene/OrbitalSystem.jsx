import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

export function OrbitalSystem({ theme = 'dark', isMobile = false }) {
  const ring1 = useRef();
  const ring2 = useRef();
  const ring3 = useRef();
  const node1 = useRef();
  const node2 = useRef();

  const isLight = theme === 'light';
  const primaryColor = isLight ? '#0284c7' : '#38bdf8';
  const secondaryColor = isLight ? '#0891b2' : '#22d3ee';
  const accentColor = isLight ? '#4f46e5' : '#818cf8';

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ring1.current) ring1.current.rotation.z = t * 0.25;
    if (ring2.current) ring2.current.rotation.y = -t * 0.3;
    if (ring3.current) ring3.current.rotation.x = t * 0.2;

    if (node1.current) {
      const radius = 2.4;
      node1.current.position.x = Math.cos(t * 0.8) * radius;
      node1.current.position.y = Math.sin(t * 0.8) * radius;
    }

    if (node2.current) {
      const radius = 1.8;
      node2.current.position.x = Math.cos(-t * 0.6) * radius;
      node2.current.position.z = Math.sin(-t * 0.6) * radius;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4} position={[4.5, -2.5, -3]}>
      <group scale={isMobile ? 0.7 : 0.95}>
        <mesh ref={ring1}>
          <torusGeometry args={[2.4, 0.025, 16, 64]} />
          <meshStandardMaterial
            color={primaryColor}
            emissive={primaryColor}
            emissiveIntensity={isLight ? 0.4 : 1.0}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        <mesh ref={node1} position={[2.4, 0, 0]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        <mesh ref={ring2} rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[1.8, 0.02, 16, 64]} />
          <meshStandardMaterial
            color={secondaryColor}
            emissive={secondaryColor}
            emissiveIntensity={isLight ? 0.3 : 0.8}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        <mesh ref={node2} position={[1.8, 0, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color={secondaryColor} />
        </mesh>

        {!isMobile && (
          <mesh ref={ring3} rotation={[-Math.PI / 4, Math.PI / 4, 0]}>
            <torusGeometry args={[1.3, 0.018, 16, 64]} />
            <meshStandardMaterial
              color={accentColor}
              emissive={accentColor}
              emissiveIntensity={isLight ? 0.3 : 0.7}
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
        )}
      </group>
    </Float>
  );
}

export default OrbitalSystem;
