import React, { useState } from 'react';
import {
  Palette,
  Sun,
  Moon,
  Check,
  Sparkles,
  Sliders,
  Monitor,
  Eye,
  Shield,
  Zap,
  AlertTriangle,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { useTheme, ACCENT_PALETTES } from '../../context/ThemeContext';

export default function ThemeSettingsTab() {
  const { theme, setTheme, accent, setAccent, isDark } = useTheme();
  const [glassEffect, setGlassEffect] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const currentAccentObj = ACCENT_PALETTES.find(p => p.id === accent) || ACCENT_PALETTES[0];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* 1. Display Mode (Dark / Light) */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div className="flex items-center gap-3" style={{ marginBottom: '20px' }}>
          <div style={{ padding: '10px', borderRadius: '12px', background: 'var(--badge-primary-bg)', color: 'var(--primary)' }}>
            <Monitor size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 700 }}>Display & Appearance Mode</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              Choose between immersive high-contrast Cyber Dark or clean Executive Light workspace
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Cyber Dark Option Card */}
          <div
            onClick={() => setTheme('dark')}
            style={{
              padding: '22px',
              borderRadius: '16px',
              cursor: 'pointer',
              background: theme === 'dark' ? 'var(--sidebar-active-bg)' : 'var(--panel-inner-bg)',
              border: theme === 'dark' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
              boxShadow: theme === 'dark' ? '0 10px 30px var(--primary-glow)' : 'none',
              transition: 'var(--transition)',
              position: 'relative',
            }}
          >
            {theme === 'dark' && (
              <span
                style={{
                  position: 'absolute',
                  top: '14px',
                  right: '14px',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '8px',
                  background: 'var(--primary)',
                  color: '#ffffff',
                }}
              >
                CURRENT ACTIVE
              </span>
            )}

            <div className="flex items-center gap-3" style={{ marginBottom: '14px' }}>
              <div style={{ padding: '10px', borderRadius: '12px', background: '#6366f1', color: '#ffffff', display: 'flex' }}>
                <Moon size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700, color: 'var(--text-main)' }}>
                  Cyber Dark
                </h4>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Obsidian base, glass layers & neon cyber glow
                </span>
              </div>
            </div>

            {/* Visual Palette Preview Bar */}
            <div className="flex gap-2" style={{ marginTop: '16px' }}>
              <div style={{ flex: 1, height: '26px', borderRadius: '8px', background: '#07090e', border: '1px solid rgba(255,255,255,0.15)' }} title="Obsidian Base #07090e" />
              <div style={{ flex: 1, height: '26px', borderRadius: '8px', background: '#0d111a', border: '1px solid rgba(255,255,255,0.1)' }} title="Surface Slate #0d111a" />
              <div style={{ flex: 1, height: '26px', borderRadius: '8px', background: currentAccentObj.primary }} title="Primary Accent" />
              <div style={{ flex: 1, height: '26px', borderRadius: '8px', background: '#f8fafc' }} title="Pure Crisp Text #f8fafc" />
            </div>
          </div>

          {/* Executive Light Option Card */}
          <div
            onClick={() => setTheme('light')}
            style={{
              padding: '22px',
              borderRadius: '16px',
              cursor: 'pointer',
              background: theme === 'light' ? 'var(--sidebar-active-bg)' : 'var(--panel-inner-bg)',
              border: theme === 'light' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
              boxShadow: theme === 'light' ? '0 10px 30px var(--primary-glow)' : 'none',
              transition: 'var(--transition)',
              position: 'relative',
            }}
          >
            {theme === 'light' && (
              <span
                style={{
                  position: 'absolute',
                  top: '14px',
                  right: '14px',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '8px',
                  background: 'var(--primary)',
                  color: '#ffffff',
                }}
              >
                CURRENT ACTIVE
              </span>
            )}

            <div className="flex items-center gap-3" style={{ marginBottom: '14px' }}>
              <div style={{ padding: '10px', borderRadius: '12px', background: '#f59e0b', color: '#ffffff', display: 'flex' }}>
                <Sun size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700, color: 'var(--text-main)' }}>
                  Executive Light
                </h4>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Clean slate background with high-legibility enterprise contrast
                </span>
              </div>
            </div>

            {/* Visual Palette Preview Bar */}
            <div className="flex gap-2" style={{ marginTop: '16px' }}>
              <div style={{ flex: 1, height: '26px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #cbd5e1' }} title="Off-White Base #f8fafc" />
              <div style={{ flex: 1, height: '26px', borderRadius: '8px', background: '#ffffff', border: '1px solid #cbd5e1' }} title="Card White #ffffff" />
              <div style={{ flex: 1, height: '26px', borderRadius: '8px', background: currentAccentObj.primary }} title="Primary Accent" />
              <div style={{ flex: 1, height: '26px', borderRadius: '8px', background: '#0f172a' }} title="Deep Charcoal Text #0f172a" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Color Settings & Accent Palette Switcher */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div className="flex items-center gap-3" style={{ marginBottom: '20px' }}>
          <div style={{ padding: '10px', borderRadius: '12px', background: 'var(--badge-primary-bg)', color: 'var(--primary)' }}>
            <Palette size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 700 }}>Accent Color Settings</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              Choose your brand identity palette for buttons, glows, metrics, and radar charts
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4" style={{ marginBottom: '28px' }}>
          {ACCENT_PALETTES.map((p) => {
            const isSelected = accent === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setAccent(p.id)}
                style={{
                  padding: '16px 14px',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  background: isSelected ? 'var(--badge-primary-bg)' : 'var(--panel-inner-bg)',
                  border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  boxShadow: isSelected ? `0 6px 20px ${p.primary}33` : 'none',
                  transition: 'var(--transition)',
                  textAlign: 'center',
                  position: 'relative',
                }}
              >
                {/* Two Dual Swatch Dots */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '10px' }}>
                  <div
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: p.primary,
                      boxShadow: `0 3px 8px ${p.primary}88`,
                    }}
                  />
                  <div
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: p.accent,
                      boxShadow: `0 3px 8px ${p.accent}88`,
                    }}
                  />
                </div>

                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '3px' }}>
                  {p.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: '1.2' }}>
                  {p.desc}
                </div>

                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: 'var(--primary)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.65rem',
                      fontWeight: 900,
                    }}
                  >
                    ✓
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 3. Live Interactive Color Preview Playground */}
        <div
          style={{
            background: 'var(--panel-inner-bg)',
            padding: '22px',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
          }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: '14px' }}>
            <div className="flex items-center gap-2">
              <Sparkles size={16} color="var(--primary)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Live Palette & Interface Preview ({currentAccentObj.name})
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Hex: <code>{currentAccentObj.primary}</code> / <code>{currentAccentObj.accent}</code>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Sample Button */}
            <div className="flex flex-col gap-2">
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Action Button Preview</label>
              <button
                type="button"
                className="btn btn-primary"
                style={{ padding: '10px 16px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Shield size={16} /> Run Security Scan
              </button>
            </div>

            {/* Sample Badge */}
            <div className="flex flex-col gap-2">
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Security Status Tag</label>
              <div
                style={{
                  background: 'var(--badge-primary-bg)',
                  border: '1px solid var(--badge-primary-border)',
                  color: 'var(--primary)',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <CheckCircle2 size={16} /> 100% CIS Compliant
              </div>
            </div>

            {/* Sample Glow Card */}
            <div className="flex flex-col gap-2">
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Highlight Glow</label>
              <div
                style={{
                  background: 'var(--sidebar-active-bg)',
                  border: '1px solid var(--sidebar-active-border)',
                  color: 'var(--text-main)',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>Zero-Drift Safe</span>
                <span style={{ fontSize: '0.72rem', background: 'var(--primary)', color: '#ffffff', padding: '2px 6px', borderRadius: '6px' }}>PRO</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
