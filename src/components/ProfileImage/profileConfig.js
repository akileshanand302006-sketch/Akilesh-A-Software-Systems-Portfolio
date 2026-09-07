/**
 * profileConfig.js
 * Geometry and animation configuration for the 3D Profile Image Experience.
 */

export const PROFILE_CONFIG = {
  sizes: {
    desktop: 256,
    tablet: 225,
    mobile: 190,
  },
  parallax: {
    maxTiltX: 5.0, // degrees
    maxTiltY: 7.0, // degrees
    lerp: 0.08,    // smooth damping
  },
  orbits: [
    {
      id: 'equatorial',
      sizeMultiplier: 1.28,
      tiltX: 68,
      tiltZ: 14,
      duration: 24,
      reverse: false,
      hasSatellite: true,
      satelliteSize: 7,
      dashed: false,
      opacity: 0.8,
    },
    {
      id: 'diagonal-polar',
      sizeMultiplier: 1.42,
      tiltX: 50,
      tiltZ: -42,
      duration: 18,
      reverse: true,
      hasSatellite: true,
      satelliteSize: 6,
      dashed: true,
      opacity: 0.7,
    },
    {
      id: 'vertical-halo',
      sizeMultiplier: 1.20,
      tiltX: 25,
      tiltZ: 75,
      duration: 30,
      reverse: false,
      hasSatellite: false,
      dashed: true,
      opacity: 0.5,
    },
    {
      id: 'outer-tech-arc',
      sizeMultiplier: 1.55,
      tiltX: 62,
      tiltZ: -12,
      duration: 38,
      reverse: true,
      hasSatellite: false,
      dashed: true,
      opacity: 0.4,
    },
  ],
  accents: [
    { id: 'acc-1', x: 135, y: -108, size: 5, pulse: 2.6, label: 'SYS_01' },
    { id: 'acc-2', x: -140, y: 104, size: 4, pulse: 3.2, label: 'CORE_I/O' },
    { id: 'acc-3', x: -132, y: -98, size: 3.5, pulse: 2.9, label: 'CIT_M.SC' },
    { id: 'acc-4', x: 130, y: 114, size: 4.5, pulse: 3.6, label: 'JAVA_SYS' },
  ],
};
