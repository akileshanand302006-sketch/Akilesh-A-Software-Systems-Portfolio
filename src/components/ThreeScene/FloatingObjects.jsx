import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

export function FloatingObjects({ theme = 'dark', isMobile = false }) {
  const dbGroupRef = useRef();
  const codeCubeRef = useRef();
  const octaRef = useRef();
  const isLight = theme === 'light';

  const primaryColor = isLight ? '#0284c7' : '#38bdf8';
  const secondaryColor = isLight ? '#0891b2' : '#22d3ee';
  const glassOpacity = isLight ? 0.35 : 0.22;
  const wireOpacity = isLight ? 0.6 : 0.75;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (dbGroupRef.current) {
      dbGroupRef.current.rotation.y = t * 0.2;
      dbGroupRef.current.rotation.x = Math.sin(t * 0.25) * 0.08;
    }
    if (codeCubeRef.current) {
      codeCubeRef.current.rotation.x = t * 0.18;
      codeCubeRef.current.rotation.y = t * 0.26;
    }
    if (octaRef.current) {
      octaRef.current.rotation.y = t * 0.3;
      octaRef.current.rotation.z = t * 0.15;
    }
  });

  return (
    <group name="FloatingObjects">
      {!isMobile && (
        <Float speed={1.5} rotationIntensity={0.25} floatIntensity={0.5} position={[5.2, 2.8, -3.5]}>
          <group ref={dbGroupRef} scale={0.72}>
            <mesh position={[0, 0.6, 0]}>
              <cylinderGeometry args={[0.9, 0.9, 0.35, 32]} />
              <meshPhysicalMaterial
                color={primaryColor}
                transparent
                opacity={glassOpacity}
                roughness={0.1}
                metalness={0.2}
                transmission={0.6}
                ior={1.4}
              />
            </mesh>
            <mesh position={[0, 0.6, 0]}>
              <torusGeometry args={[0.92, 0.02, 16, 48]} />
              <meshBasicMaterial color={primaryColor} transparent opacity={wireOpacity} />
            </mesh>

            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.9, 0.9, 0.35, 32]} />
              <meshPhysicalMaterial
                color={secondaryColor}
                transparent
                opacity={glassOpacity}
                roughness={0.1}
                metalness={0.2}
                transmission={0.6}
                ior={1.4}
              />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <torusGeometry args={[0.92, 0.02, 16, 48]} />
              <meshBasicMaterial color={secondaryColor} transparent opacity={wireOpacity} />
            </mesh>

            <mesh position={[0, -0.6, 0]}>
              <cylinderGeometry args={[0.9, 0.9, 0.35, 32]} />
              <meshPhysicalMaterial
                color={primaryColor}
                transparent
                opacity={glassOpacity}
                roughness={0.1}
                metalness={0.2}
                transmission={0.6}
                ior={1.4}
              />
            </mesh>
            <mesh position={[0, -0.6, 0]}>
              <torusGeometry args={[0.92, 0.02, 16, 48]} />
              <meshBasicMaterial color={primaryColor} transparent opacity={wireOpacity} />
            </mesh>
          </group>
        </Float>
      )}

      <Float speed={1.8} rotationIntensity={0.35} floatIntensity={0.7} position={[-5.2, 0.8, -3]}>
        <group ref={codeCubeRef} scale={isMobile ? 0.65 : 0.82}>
          <mesh>
            <boxGeometry args={[1.4, 1.4, 1.4]} />
            <meshPhysicalMaterial
              color={secondaryColor}
              transparent
              opacity={glassOpacity + 0.08}
              roughness={0.12}
              transmission={0.75}
              ior={1.5}
            />
          </mesh>
          <mesh scale={0.45}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color={primaryColor}
              emissive={primaryColor}
              emissiveIntensity={isLight ? 1.2 : 2.0}
              wireframe
            />
          </mesh>
          <mesh>
            <boxGeometry args={[1.41, 1.41, 1.41]} />
            <meshBasicMaterial color={primaryColor} wireframe transparent opacity={wireOpacity * 0.5} />
          </mesh>
        </group>
      </Float>

      <Float speed={2.0} rotationIntensity={0.4} floatIntensity={0.6} position={[-3.8, 3.6, -4]}>
        <mesh ref={octaRef} scale={isMobile ? 0.55 : 0.75}>
          <octahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial
            color={primaryColor}
            transparent
            opacity={glassOpacity}
            roughness={0.08}
            metalness={0.1}
            transmission={0.8}
            ior={1.6}
          />
        </mesh>
      </Float>
    </group>
  );
}

export default FloatingObjects;
