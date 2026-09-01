import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, PresentationControls, ContactShadows } from '@react-three/drei';

export function HeroScene({ theme = 'dark', isMobile = false }) {
  const outerSphere = useRef();
  const innerCore = useRef();
  const ring1 = useRef();
  const ring2 = useRef();
  const isLight = theme === 'light';

  const primaryColor = isLight ? '#0284c7' : '#38bdf8';
  const secondaryColor = isLight ? '#0891b2' : '#22d3ee';
  const glassOpacity = isLight ? 0.32 : 0.22;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (innerCore.current) {
      innerCore.current.rotation.x = t * 0.25;
      innerCore.current.rotation.y = t * 0.35;
    }
    if (ring1.current) {
      ring1.current.rotation.z = t * 0.3;
      ring1.current.rotation.x = t * 0.18;
    }
    if (ring2.current) {
      ring2.current.rotation.y = -t * 0.35;
      ring2.current.rotation.z = t * 0.22;
    }
  });

  return (
    <group name="HeroScene">
      <PresentationControls
        global={false}
        cursor={true}
        snap={{ mass: 2, tension: 350 }}
        speed={1.6}
        zoom={1}
        polar={[-Math.PI / 6, Math.PI / 6]}
        azimuth={[-Math.PI / 4, Math.PI / 4]}
        config={{ mass: 1, tension: 170, friction: 26 }}
      >
        <Float speed={2.2} rotationIntensity={0.25} floatIntensity={0.45}>
          <group scale={isMobile ? 0.95 : 1.28}>
            <mesh ref={outerSphere}>
              <sphereGeometry args={[1.4, 48, 48]} />
              <meshPhysicalMaterial
                color={primaryColor}
                transparent
                opacity={glassOpacity}
                roughness={0.06}
                metalness={0.15}
                transmission={0.88}
                ior={1.45}
                thickness={0.7}
              />
            </mesh>

            <mesh ref={innerCore} scale={0.7}>
              <icosahedronGeometry args={[1, 1]} />
              <meshStandardMaterial
                color={primaryColor}
                emissive={primaryColor}
                emissiveIntensity={isLight ? 1.4 : 2.2}
                wireframe
              />
            </mesh>

            <mesh ref={ring1} rotation={[Math.PI / 4, 0, 0]}>
              <torusGeometry args={[1.75, 0.022, 16, 64]} />
              <meshStandardMaterial
                color={primaryColor}
                metalness={0.8}
                roughness={0.2}
                emissive={primaryColor}
                emissiveIntensity={isLight ? 0.5 : 1.1}
              />
            </mesh>

            <mesh ref={ring2} rotation={[-Math.PI / 3, Math.PI / 6, 0]}>
              <torusGeometry args={[1.62, 0.018, 16, 64]} />
              <meshStandardMaterial
                color={secondaryColor}
                metalness={0.8}
                roughness={0.2}
                emissive={secondaryColor}
                emissiveIntensity={isLight ? 0.4 : 0.9}
              />
            </mesh>

            <mesh position={[1.75, 0, 0]}>
              <sphereGeometry args={[0.065, 16, 16]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh position={[-1.62, 0.4, 0]}>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshBasicMaterial color={secondaryColor} />
            </mesh>
          </group>
        </Float>
      </PresentationControls>

      <ContactShadows
        position={[0, -2.2, 0]}
        opacity={isLight ? 0.35 : 0.5}
        scale={6}
        blur={2.4}
        far={4.5}
        color={isLight ? '#0284c7' : '#0369a1'}
      />
    </group>
  );
}

export default HeroScene;
