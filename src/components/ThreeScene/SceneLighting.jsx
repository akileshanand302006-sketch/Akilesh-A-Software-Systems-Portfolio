import React from 'react';

export function SceneLighting({ theme = 'dark' }) {
  const isLight = theme === 'light';

  return (
    <group name="SceneLighting">
      <ambientLight intensity={isLight ? 1.3 : 0.45} />
      <directionalLight
        position={[8, 12, 10]}
        intensity={isLight ? 1.9 : 1.1}
        color={isLight ? '#ffffff' : '#f0f9ff'}
      />
      <pointLight
        position={[-10, -6, -5]}
        intensity={isLight ? 1.6 : 2.6}
        color={isLight ? '#1677ff' : '#38bdf8'}
        distance={28}
      />
      <pointLight
        position={[6, -8, 6]}
        intensity={isLight ? 1.3 : 2.0}
        color={isLight ? '#00c8ff' : '#22d3ee'}
        distance={22}
      />
      <pointLight
        position={[0, -10, -2]}
        intensity={isLight ? 0.9 : 1.5}
        color={isLight ? '#7c5cff' : '#818cf8'}
        distance={18}
      />
    </group>
  );
}

export default SceneLighting;
