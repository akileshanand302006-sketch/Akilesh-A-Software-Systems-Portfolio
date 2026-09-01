import React from 'react';

export function SceneLighting({ theme = 'dark' }) {
  const isLight = theme === 'light';

  return (
    <group name="SceneLighting">
      <ambientLight intensity={isLight ? 1.2 : 0.45} />
      <directionalLight
        position={[8, 12, 10]}
        intensity={isLight ? 1.8 : 1.1}
        color={isLight ? '#ffffff' : '#f0f9ff'}
      />
      <pointLight
        position={[-10, -6, -5]}
        intensity={isLight ? 1.4 : 2.6}
        color={isLight ? '#0284c7' : '#38bdf8'}
        distance={28}
      />
      <pointLight
        position={[6, -8, 6]}
        intensity={isLight ? 1.1 : 2.0}
        color="#22d3ee"
        distance={22}
      />
      <pointLight
        position={[0, -10, -2]}
        intensity={isLight ? 0.7 : 1.5}
        color="#818cf8"
        distance={18}
      />
    </group>
  );
}

export default SceneLighting;
