import { useEarthPortal } from '../context/EarthPortalContext';
import ParticleEarth from './ParticleEarth';
import { Globe, RefreshCw } from 'lucide-react';

export default function BackgroundEarth() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        opacity: 0.56,
        transition: 'opacity 1s ease'
      }}
      aria-hidden="true"
    >
      <ParticleEarth stage="background" />
      {/* Subtle vignette overlay to ensure text over cards has perfect contrast */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 40%, rgba(15, 15, 20, 0.25) 0%, rgba(10, 10, 14, 0.72) 100%)',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}
