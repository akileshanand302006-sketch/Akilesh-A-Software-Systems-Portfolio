import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

export function TechnologyNodes({ theme = 'dark', isMobile = false }) {
  const groupRef = useRef();
  const isLight = theme === 'light';

  const nodes = useMemo(() => [
    { label: 'Frontend', pos: [-1.8, 1.2, 0], color: '#38bdf8' },
    { label: 'API',      pos: [-0.6, 0.4, 0.4], color: '#22d3ee' },
    { label: 'Backend',  pos: [0.6, 0.8, -0.3], color: '#3b82f6' },
    { label: 'Database', pos: [1.6, -0.6, 0.2], color: '#06b6d4' },
    { label: 'Cloud',    pos: [0.2, -1.2, -0.4], color: '#818cf8' },
  ], []);

  const linePositions = useMemo(() => {
    const coords = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      coords.push(...nodes[i].pos, ...nodes[i + 1].pos);
    }
    coords.push(...nodes[4].pos, ...nodes[2].pos);
    coords.push(...nodes[4].pos, ...nodes[3].pos);
    return new Float32Array(coords);
  }, [nodes]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.08;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5} position={[-4.5, -1.5, -2.5]}>
      <group ref={groupRef} scale={isMobile ? 0.75 : 1.0}>
        {nodes.map((node, i) => (
          <group key={i} position={node.pos}>
            <mesh>
              <sphereGeometry args={[0.18, 16, 16]} />
              <meshStandardMaterial
                color={node.color}
                emissive={node.color}
                emissiveIntensity={isLight ? 1.0 : 1.8}
                roughness={0.2}
                metalness={0.5}
              />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.28, 16, 16]} />
              <meshPhysicalMaterial
                color={node.color}
                transparent
                opacity={isLight ? 0.35 : 0.25}
                transmission={0.8}
                roughness={0.1}
              />
            </mesh>
          </group>
        ))}

        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={linePositions.length / 3}
              array={linePositions}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={isLight ? '#1677ff' : '#38bdf8'}
            transparent
            opacity={isLight ? 0.45 : 0.55}
            depthWrite={false}
          />
        </lineSegments>
      </group>
    </Float>
  );
}

export default TechnologyNodes;
