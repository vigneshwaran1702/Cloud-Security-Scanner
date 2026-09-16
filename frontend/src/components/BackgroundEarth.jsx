import { useEarthPortal } from '../context/EarthPortalContext';
import ParticleEarth from './ParticleEarth';
import { Globe, RefreshCw } from 'lucide-react';

export default function BackgroundEarth() {
  const { isEntered, resetPortal } = useEarthPortal();

  if (!isEntered) return null;

  return (
    <>
      {/* Fixed Ambient Background Earth across all pages */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          opacity: 0.38,
          transition: 'opacity 1s ease'
        }}
        aria-hidden="true"
      >
        <ParticleEarth stage="background" />
      </div>

      {/* Discrete Corner Reset Control so user can re-open centered earth anytime */}
      <div
        style={{
          position: 'fixed',
          bottom: '16px',
          left: '16px',
          zIndex: 40,
          pointerEvents: 'auto'
        }}
      >
        <button
          onClick={resetPortal}
          type="button"
          title="Re-open Centered Particle Earth Opening Screen"
          style={{
            background: 'rgba(23, 23, 23, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            color: 'var(--text-muted)',
            padding: '6px 12px',
            borderRadius: '9999px',
            fontSize: '0.72rem',
            fontFamily: 'JetBrains Mono, monospace',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'var(--transition)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--primary)';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
        >
          <Globe size={13} color="var(--primary)" />
          <span>✦ Earth Center Mode</span>
        </button>
      </div>
    </>
  );
}
