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
        opacity: 0.42,
        transition: 'opacity 1s ease'
      }}
      aria-hidden="true"
    >
      <ParticleEarth stage="background" />
    </div>
  );
}
