import { useState } from 'react';
import { useEarthPortal } from '../context/EarthPortalContext';
import ParticleEarth from './ParticleEarth';
import { ArrowRight, Shield, Globe, Lock } from 'lucide-react';

export default function OpeningEarthScreen() {
  const { isEntered, isTransitioning, enterPortal } = useEarthPortal();
  const [isHovered, setIsHovered] = useState(false);
  const [isAssembled, setIsAssembled] = useState(false);

  if (isEntered && !isTransitioning) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#0d0d0f',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'clamp(16px, 3vh, 32px) clamp(14px, 4vw, 24px) clamp(20px, 4vh, 36px)',
        boxSizing: 'border-box',
        overflow: 'hidden',
        opacity: isTransitioning ? 0 : 1,
        transform: isTransitioning ? 'scale(1.08)' : 'scale(1)',
        transition: 'opacity 1.1s cubic-bezier(0.16, 1, 0.3, 1), transform 1.1s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: isTransitioning ? 'none' : 'auto'
      }}
    >
      {/* Background Starfield / Radial White & Violet Glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '75vw',
          height: '75vw',
          maxWidth: '900px',
          maxHeight: '900px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, rgba(124, 91, 255, 0.08) 45%, rgba(0, 0, 0, 0) 70%)',
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
          gap: '10px',
          textAlign: 'center',
          width: '100%',
          maxWidth: '720px'
        }}
      >
        {/* Discrete Direct Entry Bypass Button */}
        <div style={{ position: 'absolute', top: '0px', right: '0px', zIndex: 10 }}>
          <button
            onClick={enterPortal}
            type="button"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              padding: '6px 12px',
              borderRadius: '9999px',
              fontSize: 'clamp(0.72rem, 2vw, 0.8rem)',
              fontFamily: 'JetBrains Mono, monospace',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#ffffff';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            }}
          >
            <span>Skip</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src="/logo.png"
            alt="Cloud Security Logo"
            style={{
              width: 'clamp(26px, 5vw, 32px)',
              height: 'clamp(26px, 5vw, 32px)',
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 10px rgba(255, 255, 255, 0.6))'
            }}
          />
          <span style={{ fontWeight: 800, fontSize: 'clamp(1.1rem, 3.5vw, 1.3rem)', letterSpacing: '-0.02em', color: '#ffffff' }}>
            Cloud Security
          </span>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 'clamp(0.7rem, 2vw, 0.82rem)', color: '#ffffff', opacity: 0.85, fontWeight: 600 }}>
            . evolved
          </span>
        </div>

        <div
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 'clamp(0.66rem, 1.8vw, 0.76rem)',
            color: 'rgba(240, 240, 248, 0.75)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '4px 12px',
            borderRadius: '9999px',
            maxWidth: '90%',
            textAlign: 'center'
          }}
        >
          <span style={{ color: '#ffffff' }}>✦</span>
          <span>{isAssembled ? 'DEFENSE CORE ASSEMBLED · READY' : 'FORMING DEFENSE SPHERE'}</span>
          <span style={{ color: '#ffffff' }}>✦</span>
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
          width: 'min(88vw, 55vh, 520px)',
          height: 'min(88vw, 55vh, 520px)',
          aspectRatio: '1 / 1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          outline: 'none',
          margin: 'auto 0'
        }}
      >
        {/* Pulsating Interaction Radar Rings */}
        <div
          style={{
            position: 'absolute',
            width: '84%',
            height: '84%',
            borderRadius: '50%',
            border: '1px dashed rgba(255, 255, 255, 0.35)',
            animation: 'spin 45s linear infinite',
            pointerEvents: 'none',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.4s ease'
          }}
        />

        <div
          style={{
            position: 'absolute',
            width: '94%',
            height: '94%',
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            pointerEvents: 'none'
          }}
        />

        {/* 3D Particle Earth Canvas */}
        <ParticleEarth
          stage="opening"
          onEarthClick={enterPortal}
          isTransitioning={isTransitioning}
          onAssembled={() => setIsAssembled(true)}
        />

        {/* Floating Center Cursor Cue */}
        <div
          style={{
            position: 'absolute',
            pointerEvents: 'none',
            background: 'rgba(18, 18, 20, 0.92)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            backdropFilter: 'blur(12px)',
            padding: '6px 16px',
            borderRadius: '9999px',
            fontSize: '0.74rem',
            fontFamily: 'JetBrains Mono',
            color: '#ffffff',
            boxShadow: '0 4px 20px rgba(255, 255, 255, 0.25)',
            opacity: isHovered ? 1 : 0.85,
            transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
            transition: 'all 0.25s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '7px'
          }}
        >
          <span style={{ color: '#ffffff' }}>✦</span>
          <span>{isAssembled ? 'CLICK THE EARTH TO ENTER' : 'CONVERGING PARTICLES...'}</span>
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
          gap: '12px',
          maxWidth: '620px',
          width: '100%',
          textAlign: 'center'
        }}
      >
        {/* Global Telemetry Metrics */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 'clamp(8px, 3vw, 16px)',
            fontSize: 'clamp(0.68rem, 2vw, 0.78rem)',
            fontFamily: 'JetBrains Mono',
            color: 'rgba(240, 240, 248, 0.7)',
            letterSpacing: '0.04em'
          }}
        >
          <span>17 COUNTRIES AUDITED</span>
          <span style={{ opacity: 0.3 }}>·</span>
          <span style={{ color: '#ffffff', fontWeight: 600 }}>10 CLOUD HUBS</span>
          <span style={{ opacity: 0.3 }}>·</span>
          <span style={{ color: '#10b981' }}>SUB-SECOND TELEMETRY</span>
        </div>
      </footer>
    </div>
  );
}
