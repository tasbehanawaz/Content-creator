export const NoiseTexture = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none z-0"
    style={{ opacity: 0.13, mixBlendMode: 'overlay' }}
    width="100%" height="100%"
  >
    <filter id="noiseFilter">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noiseFilter)" />
  </svg>
);