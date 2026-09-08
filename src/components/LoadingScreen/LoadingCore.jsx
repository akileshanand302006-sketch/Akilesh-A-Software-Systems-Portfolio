import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function LoadingCore({
  theme = 'dark',
  isMobile = false,
  prefersReducedMotion = false,
}) {
  const groupRef = useRef();
  const outerGlassRef = useRef();
  const innerNucleusRef = useRef();
  const innerPulseRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  const scanRingRef = useRef();
  const node1Ref = useRef();
  const node2Ref = useRef();
  const node3Ref = useRef();
  const particlesRef = useRef();

  const isLight = theme === 'light';

  // Theme-tailored palette
  const primaryColor = useMemo(() => (isLight ? '#0284c7' : '#38bdf8'), [isLight]);
  const secondaryColor = useMemo(() => (isLight ? '#00c8ff' : '#22d3ee'), [isLight]);
  const accentColor = useMemo(() => (isLight ? '#7c5cff' : '#818cf8'), [isLight]);
  const particleColor = useMemo(() => (isLight ? '#0284c7' : '#67e8f9'), [isLight]);

  // Particle positions
  const particleCount = isMobile ? 18 : 36;
  const particlesData = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const speeds = [];
    const radii = [];
    const angles = [];
    const heights = [];

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.6 + Math.random() * 1.8;
      const angle = Math.random() * Math.PI * 2;
      const speed = (0.3 + Math.random() * 0.6) * (Math.random() > 0.5 ? 1 : -1);
      const height = (Math.random() - 0.5) * 2.2;

      radii.push(radius);
      angles.push(angle);
      speeds.push(speed);
      heights.push(height);

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }

    return { positions, speeds, radii, angles, heights };
  }, [particleCount]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const speedMult = prefersReducedMotion ? 0.2 : 1.0;

    // Outer subtle floating
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 1.2 * speedMult) * 0.08;
    }

    // Outer glass rotation
    if (outerGlassRef.current) {
      outerGlassRef.current.rotation.y += delta * 0.25 * speedMult;
      outerGlassRef.current.rotation.x += delta * 0.12 * speedMult;
    }

    // Inner wireframe nucleus rotation & breathing
    if (innerNucleusRef.current) {
      innerNucleusRef.current.rotation.y -= delta * 0.45 * speedMult;
      innerNucleusRef.current.rotation.z += delta * 0.3 * speedMult;
      const breath = 1 + Math.sin(t * 2.5 * speedMult) * 0.06;
      innerNucleusRef.current.scale.set(breath, breath, breath);
    }

    // Inner pulse sphere breathing glow
    if (innerPulseRef.current) {
      const pulse = 1 + Math.sin(t * 3.5 * speedMult) * 0.12;
      innerPulseRef.current.scale.set(pulse, pulse, pulse);
    }

    // Multi-axis orbital rings
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.4 * speedMult;
      ring1Ref.current.rotation.x += delta * 0.15 * speedMult;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 0.35 * speedMult;
      ring2Ref.current.rotation.z -= delta * 0.2 * speedMult;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x += delta * 0.3 * speedMult;
      ring3Ref.current.rotation.y += delta * 0.25 * speedMult;
    }

    // Orbiting satellite nodes on rings
    if (node1Ref.current) {
      const r1 = 1.7;
      const a1 = t * 0.9 * speedMult;
      node1Ref.current.position.x = Math.cos(a1) * r1;
      node1Ref.current.position.y = Math.sin(a1) * r1 * 0.5;
      node1Ref.current.position.z = Math.sin(a1) * r1 * 0.86;
    }
    if (node2Ref.current) {
      const r2 = 1.5;
      const a2 = -t * 1.1 * speedMult;
      node2Ref.current.position.x = Math.cos(a2) * r2 * 0.8;
      node2Ref.current.position.y = Math.cos(a2) * r2 * 0.6;
      node2Ref.current.position.z = Math.sin(a2) * r2;
    }
    if (node3Ref.current) {
      const r3 = 2.0;
      const a3 = t * 0.7 * speedMult;
      node3Ref.current.position.x = Math.sin(a3) * r3 * 0.7;
      node3Ref.current.position.y = Math.sin(a3) * r3 * 0.7;
      node3Ref.current.position.z = Math.cos(a3) * r3;
    }

    // Scanning ring diagnostic sweep (up and down)
    if (scanRingRef.current) {
      scanRingRef.current.position.y = Math.sin(t * 1.8 * speedMult) * 0.95;
      scanRingRef.current.rotation.y += delta * 0.5 * speedMult;
    }

    // Orbiting particle field
    if (particlesRef.current && !prefersReducedMotion) {
      const posAttr = particlesRef.current.geometry.attributes.position;
      const posArr = posAttr.array;

      for (let i = 0; i < particleCount; i++) {
        particlesData.angles[i] += particlesData.speeds[i] * delta * 0.8;
        const currentAngle = particlesData.angles[i];
        const r = particlesData.radii[i];

        posArr[i * 3] = Math.cos(currentAngle) * r;
        posArr[i * 3 + 1] = particlesData.heights[i] + Math.sin(t * 1.5 + i) * 0.1;
        posArr[i * 3 + 2] = Math.sin(currentAngle) * r;
      }
      posAttr.needsUpdate = true;
    }
  });

  const overallScale = isMobile ? 0.82 : 1.05;

  return (
    <group ref={groupRef} scale={overallScale}>
      {/* ── Central Translucent Glass Orb ── */}
      <mesh ref={outerGlassRef}>
        <sphereGeometry args={[1.2, 40, 40]} />
        <meshPhysicalMaterial
          color={primaryColor}
          transparent
          opacity={isLight ? 0.32 : 0.22}
          roughness={0.06}
          metalness={0.16}
          transmission={0.88}
          ior={1.46}
          thickness={0.72}
          clearcoat={0.8}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* ── Inner Glowing Wireframe Nucleus (System Core) ── */}
      <mesh ref={innerNucleusRef} scale={0.65}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color={primaryColor}
          emissive={primaryColor}
          emissiveIntensity={isLight ? 1.5 : 2.3}
          wireframe
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* ── Inner Glowing Core Center Pulse ── */}
      <mesh ref={innerPulseRef} scale={0.32}>
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial
          color={isLight ? '#0284c7' : '#a5f3fc'}
          wireframe={false}
        />
      </mesh>

      {/* ── Ring 1: Primary Orbital Torus (Cyan/Blue) ── */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[1.7, 0.02, 16, 72]} />
        <meshStandardMaterial
          color={primaryColor}
          metalness={0.85}
          roughness={0.15}
          emissive={primaryColor}
          emissiveIntensity={isLight ? 0.5 : 1.2}
        />
      </mesh>

      {/* ── Ring 2: Secondary Orbital Torus (Cyan) ── */}
      <mesh ref={ring2Ref} rotation={[-Math.PI / 3, Math.PI / 6, 0]}>
        <torusGeometry args={[1.5, 0.016, 16, 64]} />
        <meshStandardMaterial
          color={secondaryColor}
          metalness={0.85}
          roughness={0.18}
          emissive={secondaryColor}
          emissiveIntensity={isLight ? 0.45 : 1.0}
        />
      </mesh>

      {/* ── Ring 3: Tertiary Orbital Torus (Violet Accent) ── */}
      {!isMobile && (
        <mesh ref={ring3Ref} rotation={[Math.PI / 6, -Math.PI / 4, Math.PI / 3]}>
          <torusGeometry args={[2.0, 0.014, 16, 64]} />
          <meshStandardMaterial
            color={accentColor}
            metalness={0.8}
            roughness={0.2}
            emissive={accentColor}
            emissiveIntensity={isLight ? 0.4 : 0.85}
          />
        </mesh>
      )}

      {/* ── Diagnostic Scanning Ring (passes vertically) ── */}
      <mesh ref={scanRingRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.28, 0.01, 16, 48]} />
        <meshStandardMaterial
          color={secondaryColor}
          emissive={secondaryColor}
          emissiveIntensity={isLight ? 0.8 : 1.5}
          transparent
          opacity={0.65}
        />
      </mesh>

      {/* ── Orbiting Satellite Data Nodes ── */}
      <mesh ref={node1Ref}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      <mesh ref={node2Ref}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color={secondaryColor} />
      </mesh>

      {!isMobile && (
        <mesh ref={node3Ref}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshBasicMaterial color={accentColor} />
        </mesh>
      )}

      {/* ── Floating Luminous Particle Field ── */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particlesData.positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isMobile ? 0.04 : 0.05}
          color={particleColor}
          transparent
          opacity={isLight ? 0.75 : 0.85}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* ── Subtle Secondary Floating Micro-Nodes ── */}
      <group>
        <mesh position={[1.4, 0.9, -0.6]} scale={0.06}>
          <octahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color={primaryColor} wireframe />
        </mesh>
        <mesh position={[-1.3, -0.8, 0.5]} scale={0.05}>
          <octahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color={secondaryColor} wireframe />
        </mesh>
        {!isMobile && (
          <mesh position={[0.7, -1.2, -0.8]} scale={0.05}>
            <octahedronGeometry args={[1, 0]} />
            <meshBasicMaterial color={accentColor} wireframe />
          </mesh>
        )}
      </group>
    </group>
  );
}
