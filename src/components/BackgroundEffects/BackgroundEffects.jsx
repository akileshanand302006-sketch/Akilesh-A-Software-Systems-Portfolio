import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import './BackgroundEffects.css';

/* ── 3D Multi-Layer Constellation Network ── */
function ConstellationNetwork({ isDark }) {
  const pointsRef = useRef();
  const linesRef = useRef();
  const count = 40;

  const [positions, connections] = useMemo(() => {
    const pos = [];
    for (let i = 0; i < count; i++) {
      pos.push(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 26,
        (Math.random() - 0.5) * 8 - 2
      );
    }
    const lines = [];
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 4.2) {
          lines.push(
            pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2],
            pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]
          );
        }
      }
    }
    return [new Float32Array(pos), new Float32Array(lines)];
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = t * 0.012;
    pointsRef.current.rotation.x = Math.sin(t * 0.01) * 0.03;
    if (linesRef.current) {
      linesRef.current.rotation.y = t * 0.012;
      linesRef.current.rotation.x = Math.sin(t * 0.01) * 0.03;
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={positions}
            count={count}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={isDark ? '#38bdf8' : '#2563eb'}
          size={0.075}
          transparent
          opacity={isDark ? 0.6 : 0.4}
          sizeAttenuation
        />
      </points>

      {connections.length > 0 && (
        <lineSegments ref={linesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={connections}
              count={connections.length / 3}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={isDark ? '#0284c7' : '#3b82f6'}
            transparent
            opacity={isDark ? 0.14 : 0.1}
          />
        </lineSegments>
      )}
    </group>
  );
}

/* ── Full-Page Spatial 3D Scene with Scroll & Mouse Parallax ── */
function FullPageSpatialScene({ theme }) {
  const groupRef = useRef();
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollRef = useRef({ y: 0, targetY: 0 });
  const isDark = theme === 'dark';

  const primaryColor = isDark ? '#38bdf8' : '#2563eb';
  const cyanColor = isDark ? '#22d3ee' : '#0284c7';
  const violetColor = isDark ? '#818cf8' : '#4f46e5';

  useEffect(() => {
    let ticking = false;

    const handleMouseMove = (e) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
          scrollRef.current.targetY = (window.scrollY / maxScroll) * 10;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Smooth inertia interpolation
    mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.035;
    mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.035;
    scrollRef.current.y += (scrollRef.current.targetY - scrollRef.current.y) * 0.045;

    // Spatial translation & gentle tilt
    groupRef.current.position.y = scrollRef.current.y * 0.5;
    groupRef.current.rotation.x = Math.sin(t * 0.08) * 0.03 + mouseRef.current.y * 0.06;
    groupRef.current.rotation.y = t * 0.02 + mouseRef.current.x * 0.09;
  });

  return (
    <group ref={groupRef}>
      {/* 3D Dynamic Constellation Network */}
      <ConstellationNetwork isDark={isDark} />

      {/* 1. Hero Region: Floating Translucent Torus Knot (Upper Left) */}
      <Float speed={1.2} rotationIntensity={0.35} floatIntensity={0.5}>
        <mesh position={[-6, 4, -4]} rotation={[0.4, 0.6, 0.2]} scale={1.1}>
          <torusKnotGeometry args={[1.1, 0.14, 48, 12, 2, 3]} />
          <meshStandardMaterial
            color={primaryColor}
            transparent
            opacity={isDark ? 0.26 : 0.32}
            roughness={0.15}
            metalness={0.8}
            wireframe={false}
          />
        </mesh>
      </Float>

      {/* 2. About Region: Wireframe Icosahedron (Mid-Upper Right) */}
      <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.6}>
        <mesh position={[6.5, 0.5, -4]} scale={1.5}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial
            color={cyanColor}
            transparent
            opacity={isDark ? 0.3 : 0.38}
            roughness={0.2}
            metalness={0.7}
            wireframe={true}
          />
        </mesh>
      </Float>

      {/* 3. Skills Region: Floating Octahedron Crystal (Mid-Left) */}
      <Float speed={1.1} rotationIntensity={0.3} floatIntensity={0.5}>
        <group position={[-5.8, -3.5, -3.5]} scale={1.2}>
          <mesh>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color={violetColor}
              transparent
              opacity={isDark ? 0.25 : 0.32}
              roughness={0.1}
              metalness={0.9}
              wireframe={true}
            />
          </mesh>
          <mesh scale={0.35}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial
              color={primaryColor}
              emissive={primaryColor}
              emissiveIntensity={isDark ? 0.8 : 0.4}
            />
          </mesh>
        </group>
      </Float>

      {/* 4. Projects Region: Translucent Dual Torus Ring (Lower Center) */}
      <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.4}>
        <mesh position={[0, -7.5, -7]} rotation={[Math.PI / 3, Math.PI / 4, 0]} scale={2.6}>
          <torusGeometry args={[2, 0.04, 12, 36]} />
          <meshStandardMaterial
            color={primaryColor}
            transparent
            opacity={isDark ? 0.2 : 0.25}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      </Float>

      {/* 5. Experience / Contact Region: Floating Glass Sphere (Deep Lower Right) */}
      <Float speed={1.3} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh position={[5.5, -11, -4.5]} scale={0.8}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshStandardMaterial
            color={cyanColor}
            transparent
            opacity={isDark ? 0.32 : 0.4}
            roughness={0.08}
            metalness={0.9}
          />
        </mesh>
      </Float>

      {/* 6. Footer Region: Deep Ambient Gyroscope Ring (Lowest Plane) */}
      <Float speed={0.9} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh position={[-4, -15, -6]} rotation={[0.6, 0.3, 0.2]} scale={2}>
          <torusGeometry args={[1.8, 0.035, 12, 36]} />
          <meshStandardMaterial
            color={violetColor}
            transparent
            opacity={isDark ? 0.18 : 0.22}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      </Float>
    </group>
  );
}

function ThreeBackgroundCanvas({ theme }) {
  const prefersReduced = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

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

  if (prefersReduced || isMobile || !hasWebGL) return null;

  return (
    <div className="bg-3d-canvas-wrapper" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 48 }}
        style={{ width: '100vw', height: '100vh', pointerEvents: 'none' }}
        dpr={[1, 1.25]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
      >
        <ambientLight intensity={theme === 'dark' ? 0.45 : 0.8} />
        <pointLight position={[10, 10, 8]} intensity={theme === 'dark' ? 0.9 : 1.2} color="#38bdf8" />
        <pointLight position={[-10, -8, 5]} intensity={theme === 'dark' ? 0.7 : 0.9} color="#22d3ee" />
        <FullPageSpatialScene theme={theme} />
      </Canvas>
    </div>
  );
}

export default function BackgroundEffects({ theme = 'dark' }) {
  return (
    <div className="bg-effects" aria-hidden="true">
      {/* Layer 1: Base Atmospheric Gradient */}
      <div className="bg-gradient" />

      {/* Layer 2, 3, 4: Slow Moving Ambient Light Orbs */}
      <div className="bg-blob bg-blob-blue" />
      <div className="bg-blob bg-blob-cyan" />
      <div className="bg-blob bg-blob-violet" />

      {/* Layer 5: Full-Page 3D Animated Graphical Scene (Three.js) */}
      <ThreeBackgroundCanvas theme={theme} />

      {/* Layer 6: Technical UI Decorative Crosshairs */}
      <div className="bg-tech-decorations">
        <span className="tech-crosshair tech-ch-tl">+</span>
        <span className="tech-crosshair tech-ch-tr">+</span>
        <span className="tech-crosshair tech-ch-bl">+</span>
        <span className="tech-crosshair tech-ch-br">+</span>
      </div>

      {/* Layer 7: Subtle Spatial Grid Overlay with Radial Fade */}
      <div className="bg-grid" />

      {/* Layer 8: Micro Film Grain Noise */}
      <div className="bg-noise" />
    </div>
  );
}
