import { useState } from 'react';
import { useEarthPortal } from '../context/EarthPortalContext';
import ParticleEarth from './ParticleEarth';
import { Shield, Sparkles, ArrowRight, Zap, Globe, Lock } from 'lucide-react';

export default function OpeningEarthScreen() {
  const { isEntered, isTransitioning, enterPortal } = useEarthPortal();
  const [isHovered, setIsHovered] = useState(false);

  if (isEntered && !isTransitioning) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#121214',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '36px 24px 44px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        opacity: isTransitioning ? 0 : 1,
        transform: isTransitioning ? 'scale(1.08)' : 'scale(1)',
        transition: 'opacity 1.1s cubic-bezier(0.16, 1, 0.3, 1), transform 1.1s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: isTransitioning ? 'none' : 'auto'
      }}
    >
      {/* Background Starfield / Radial Atmosphere Glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '70vw',
          height: '70vw',
          maxWidth: '850px',
          maxHeight: '850px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(228, 0, 124, 0.16) 0%, rgba(124, 91, 255, 0.08) 45%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Top Header & Identity */}
      <header
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          textAlign: 'center',
          width: '100%'
        }}
      >
        {/* Discrete Direct Entry Bypass Button */}
        <div style={{ position: 'absolute', top: '0px', right: '0px', zIndex: 10 }}>
          <button
            onClick={enterPortal}
            type="button"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              padding: '7px 14px',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              fontFamily: 'JetBrains Mono, monospace',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#e4007c';
              e.currentTarget.style.background = 'rgba(228, 0, 124, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
            }}
          >
            <span>Enter Website</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src="/logo.png"
            alt="CloudGuard Logo"
            style={{
              width: '32px',
              height: '32px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 8px rgba(228, 0, 124, 0.5))'
            }}
          />
          <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', color: '#ffffff' }}>
            CloudGuard
          </span>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.8rem', color: '#e4007c', fontWeight: 600 }}>
            . evolved
          </span>
        </div>

        <div
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.76rem',
            color: 'rgba(240, 240, 248, 0.65)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '5px 14px',
            borderRadius: '9999px'
          }}
        >
          <span style={{ color: '#e4007c' }}>✦</span>
          <span>AUTONOMOUS MULTI-CLOUD SECURITY POSTURE</span>
          <span style={{ color: '#e4007c' }}>✦</span>
        </div>
      </header>

      {/* Center 3D Particle Earth in the Dead Center */}
      <main
        onClick={enterPortal}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="button"
        tabIndex={0}
        aria-label="Click the Earth to enter the website"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') enterPortal();
        }}
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '560px',
          aspectRatio: '1 / 1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          outline: 'none'
        }}
      >
        {/* Pulsating Interaction Radar Rings */}
        <div
          style={{
            position: 'absolute',
            width: '82%',
            height: '82%',
            borderRadius: '50%',
            border: '1px dashed rgba(228, 0, 124, 0.35)',
            animation: 'spin 45s linear infinite',
            pointerEvents: 'none',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.4s ease'
          }}
        />

        <div
          style={{
            position: 'absolute',
            width: '92%',
            height: '92%',
            borderRadius: '50%',
            border: '1px solid rgba(124, 91, 255, 0.2)',
            pointerEvents: 'none'
          }}
        />

        {/* 3D Particle Earth Canvas */}
        <ParticleEarth
          stage="opening"
          onEarthClick={enterPortal}
          isTransitioning={isTransitioning}
        />

        {/* Floating Center Cursor Cue */}
        <div
          style={{
            position: 'absolute',
            pointerEvents: 'none',
            background: 'rgba(23, 23, 23, 0.88)',
            border: '1px solid rgba(228, 0, 124, 0.5)',
            backdropFilter: 'blur(12px)',
            padding: '6px 14px',
            borderRadius: '9999px',
            fontSize: '0.72rem',
            fontFamily: 'JetBrains Mono',
            color: '#ffffff',
            boxShadow: '0 4px 20px rgba(228, 0, 124, 0.35)',
            opacity: isHovered ? 1 : 0.8,
            transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
            transition: 'all 0.25s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span style={{ color: '#e4007c' }}>✦</span>
          <span>CLICK TO INITIALIZE DEFENSE</span>
        </div>
      </main>

      {/* Bottom Action Controls & Telemetry Stats */}
      <footer
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '18px',
          maxWidth: '620px',
          width: '100%',
          textAlign: 'center'
        }}
      >
        <button
          onClick={enterPortal}
          type="button"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 34px',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, #e4007c 0%, #c9006c 100%)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            fontSize: '0.94rem',
            fontWeight: 700,
            fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '0.04em',
            boxShadow: '0 6px 28px rgba(228, 0, 124, 0.55), 0 0 40px rgba(228, 0, 124, 0.3)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            transform: isHovered ? 'scale(1.04)' : 'scale(1)'
          }}
        >
          <span>✦ CLICK THE EARTH TO ENTER ✦</span>
          <ArrowRight size={17} />
        </button>

        {/* Global Telemetry Metrics */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '16px',
            fontSize: '0.78rem',
            fontFamily: 'JetBrains Mono',
            color: 'rgba(240, 240, 248, 0.65)',
            letterSpacing: '0.04em'
          }}
        >
          <span>17 COUNTRIES AUDITED</span>
          <span style={{ opacity: 0.3 }}>·</span>
          <span style={{ color: '#e4007c' }}>10 CLOUD HUBS</span>
          <span style={{ opacity: 0.3 }}>·</span>
          <span style={{ color: '#10b981' }}>SUB-SECOND TELEMETRY</span>
        </div>
      </footer>
    </div>
  );
}
