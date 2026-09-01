import React from 'react';

export function AtmosphericBackground({ theme = 'dark' }) {
  return <div className="bg-atmospheric-layer" data-theme={theme} />;
}

export default AtmosphericBackground;
