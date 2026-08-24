import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from '../../hooks/useReducedMotion';

function CentralCore({ theme }) {
  const meshRef = useRef();
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const isDark = theme === 'dark';

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // Smooth lerp mouse tracking
    mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
    mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

    meshRef.current.rotation.x = Math.sin(t * 0.25) * 0.12 + mouseRef.current.y * 0.12;
    meshRef.current.rotation.y = Math.cos(t * 0.18) * 0.12 + mouseRef.current.x * 0.12;
  });

  return (
    <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.6}>
      {/* Outer Distorted Glass Orb */}
      <mesh ref={meshRef} scale={1.85}>
        <icosahedronGeometry args={[1, 2]} />
        <MeshDistortMaterial
          color={isDark ? '#38bdf8' : '#2563eb'}
          transparent
          opacity={isDark ? 0.22 : 0.28}
          roughness={0.08}
          metalness={0.85}
          distort={0.22}
          speed={1.6}
        />
      </mesh>

      {/* Inner Glowing Energy Core */}
      <mesh scale={0.72}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial
          color={isDark ? '#22d3ee' : '#3b82f6'}
          emissive={isDark ? '#0284c7' : '#2563eb'}
          emissiveIntensity={isDark ? 0.8 : 0.4}
          transparent
          opacity={isDark ? 0.6 : 0.4}
          roughness={0.2}
        />
      </mesh>
    </Float>
  );
}

function OrbitalRing({ radius, speed, color, opacity = 0.35, tilt = 0.35 }) {
  const ref = useRef();
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 48; i++) {
      const angle = (i / 48) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0));
    }
    return pts;
  }, [radius]);

  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x = Math.PI * tilt + Math.sin(t * speed) * 0.1;
    ref.current.rotation.y = t * speed * 0.35;
  });

  return (
    <line ref={ref} geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </line>
  );
}

function SatelliteNode({ radius, speed, color, size = 0.07, orbitAngle = 0 }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime() * speed + orbitAngle;
    meshRef.current.position.x = Math.cos(t) * radius;
    meshRef.current.position.z = Math.sin(t) * radius;
    meshRef.current.position.y = Math.sin(t * 1.4) * 0.35;
  });

  return (
    <mesh ref={meshRef} scale={size}>
      <sphereGeometry args={[1, 10, 10]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.2}
      />
    </mesh>
  );
}

function FloatingMicroCrystals({ isDark }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.07;
  });

  return (
    <group ref={groupRef}>
      <mesh position={[2.5, 1.2, -0.8]} scale={0.16} rotation={[0.4, 0.5, 0]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={isDark ? '#38bdf8' : '#2563eb'}
          transparent
          opacity={0.65}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
      <mesh position={[-2.3, -1.3, 0.6]} scale={0.2} rotation={[0.2, 0.8, 0.3]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={isDark ? '#22d3ee' : '#0284c7'}
          transparent
          opacity={0.6}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
    </group>
  );
}

function OrbitalParticles({ count = 22, radius = 2.6, color = '#38bdf8' }) {
  const ref = useRef();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = radius + (Math.random() - 0.5) * 0.8;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 1.4;
      pos[i * 3 + 2] = Math.sin(angle) * r;
    }
    return pos;
  }, [count, radius]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.08;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.04} transparent opacity={0.65} sizeAttenuation />
    </points>
  );
}

function CSSFallback() {
  return (
    <div className="hero-orb-fallback" aria-hidden="true">
      <div className="orb-fallback-inner animate-pulse-glow" />
      <div className="orb-fallback-ring animate-rotate" />
      <div className="orb-fallback-ring orb-fallback-ring-2 animate-rotate-reverse" />
    </div>
  );
}

export default function HeroOrb({ theme = 'dark' }) {
  const prefersReduced = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);
  const isDark = theme === 'dark';

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setHasWebGL(!!gl);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (prefersReduced || isMobile || !hasWebGL) {
    return <CSSFallback />;
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
      dpr={[1, 1.25]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
      }}
    >
      <ambientLight intensity={isDark ? 0.45 : 0.8} />
      <pointLight position={[5, 5, 4]} intensity={isDark ? 1.0 : 1.3} color={isDark ? '#38bdf8' : '#2563eb'} />
      <pointLight position={[-5, -3, 3]} intensity={isDark ? 0.7 : 0.9} color={isDark ? '#22d3ee' : '#0284c7'} />

      {/* Central Glass Orb + Inner Core */}
      <CentralCore theme={theme} />

      {/* 3 Gyroscopic Orbit Rings */}
      <OrbitalRing radius={2.2} speed={0.35} color={isDark ? '#38bdf8' : '#2563eb'} opacity={isDark ? 0.35 : 0.42} tilt={0.35} />
      <OrbitalRing radius={2.7} speed={-0.28} color={isDark ? '#22d3ee' : '#0284c7'} opacity={isDark ? 0.25 : 0.35} tilt={-0.45} />
      <OrbitalRing radius={3.1} speed={0.22} color={isDark ? '#818cf8' : '#4f46e5'} opacity={isDark ? 0.2 : 0.28} tilt={0.15} />

      {/* Micro Orbiting Satellites */}
      <SatelliteNode radius={2.2} speed={0.7} color={isDark ? '#7dd3fc' : '#2563eb'} orbitAngle={0} size={0.06} />
      <SatelliteNode radius={2.7} speed={-0.5} color={isDark ? '#22d3ee' : '#0284c7'} orbitAngle={Math.PI / 2} size={0.05} />

      {/* Floating Micro Polyhedra */}
      <FloatingMicroCrystals isDark={isDark} />

      {/* Celestial Dust Particles */}
      <OrbitalParticles count={22} radius={2.6} color={isDark ? '#7dd3fc' : '#2563eb'} />
    </Canvas>
  );
}
