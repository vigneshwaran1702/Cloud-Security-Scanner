import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  CreditCard,
  Palette,
  Cloud,
  Shield,
  Bell,
  Save,
  Clock,
  CheckCircle2,
  ChevronRight,
  Sliders,
  Sparkles,
  Zap,
  ArrowLeft,
  Settings as SettingsIcon,
  Search,
  Check,
  Smartphone,
  Layers,
  ChevronLeft
} from 'lucide-react';
import { getCloudState, saveCloudState } from '../services/api';
import { useSubscription } from '../context/SubscriptionContext';
import { useTheme, ACCENT_PALETTES } from '../context/ThemeContext';
import SubscriptionSettingsTab from './settings/SubscriptionSettingsTab';
import ThemeSettingsTab from './settings/ThemeSettingsTab';
import CloudSettingsTab from './settings/CloudSettingsTab';
import ScannerSettingsTab from './settings/ScannerSettingsTab';
import NotificationSettingsTab from './settings/NotificationSettingsTab';

const initialSettings = {
  aws: {
    enabled: true,
    account_id: '492019381029',
    access_key_id: '',
    secret_access_key: '',
    region: 'us-east-1',
  },
  azure: {
    enabled: false,
    tenant_id: '',
    client_id: '',
    subscription_id: '',
  },
  gcp: {
    enabled: false,
    project_id: '',
    service_account_email: '',
  },
  general: {
    auto_remediation: true,
    scan_frequency: 'Every 6 Hours',
    min_severity: 'Medium',
    email_notifications: true,
    slack_webhook: '',
  },
};

const SETTINGS_SECTIONS = [
  {
    id: 'subscription',
    label: 'Subscription & Details',
    shortLabel: 'Subscription',
    icon: CreditCard,
    description: 'Active tier, billing history, payment methods & receipts',
    color: '#6366f1',
  },
  {
    id: 'theme',
    label: 'Theme & Color Settings',
    shortLabel: 'Theme & Colors',
    icon: Palette,
    description: 'Cyber Dark / Executive Light modes & neon accent palettes',
    color: '#06b6d4',
  },
  {
    id: 'cloud',
    label: 'Connected Cloud Accounts',
    shortLabel: 'Cloud Accounts',
    icon: Cloud,
    description: 'Multi-cloud IAM credentials & live connection status',
    color: '#ff9900',
  },
  {
    id: 'general',
    label: 'General Scanner Configuration',
    shortLabel: 'Scanner Config',
    icon: Shield,
    description: 'Scan frequency, minimum severity & safe auto-remediation',
    color: '#10b981',
  },
  {
    id: 'notifications',
    label: 'Notification Channels',
    shortLabel: 'Notifications',
    icon: Bell,
    description: 'Email digests, Slack webhooks & incident triggers',
    color: '#f59e0b',
  },
];

export default function Settings() {
  const { section } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { activeTier, isPro, invoices } = useSubscription();
  const { theme, accent } = useTheme();

  // If URL has /settings/:section or ?tab=, show that sub-page; otherwise show the Main Hub Directory
  const activeSectionId = section || searchParams.get('tab');
  const isSubPage = Boolean(activeSectionId && SETTINGS_SECTIONS.some(s => s.id === activeSectionId));

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('cloudguard_scanner_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialSettings;
  });

  const [saved, setSaved] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState('Recently');
  const [searchQuery, setSearchQuery] = useState('');

  // Persist settings changes
  useEffect(() => {
    try {
      localStorage.setItem('cloudguard_scanner_settings', JSON.stringify(settings));
    } catch (e) {}
  }, [settings]);

  const updateCloud = (cloud, field, value) => {
    setSettings(prev => ({
      ...prev,
      [cloud]: { ...prev[cloud], [field]: value },
    }));
  };

  const updateGeneral = (field, value) => {
    setSettings(prev => ({
      ...prev,
      general: { ...prev.general, [field]: value },
    }));
  };

  const handleOpenSection = (sectionId) => {
    navigate(`/settings/${sectionId}`);
  };

  const handleBackToHub = () => {
    navigate('/settings');
  };

  const handleSaveAll = () => {
    const activeId = settings.aws.account_id || settings.azure.subscription_id || settings.gcp.project_id;
    const activeProv = settings.aws.account_id ? 'AWS' : settings.azure.subscription_id ? 'AZURE' : settings.gcp.project_id ? 'GCP' : null;
    if (activeId) {
      const state = getCloudState();
      state.activeCloudId = activeId;
      if (activeProv) state.activeProvider = activeProv;
      saveCloudState(state);
    }

    try {
      localStorage.setItem('cloudguard_scanner_settings', JSON.stringify(settings));
    } catch (e) {}

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLastSavedTime(`Today at ${nowStr}`);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const currentSectionObj = SETTINGS_SECTIONS.find(s => s.id === activeSectionId) || SETTINGS_SECTIONS[0];
  const filteredSections = SETTINGS_SECTIONS.filter(s =>
    s.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSectionStatusBadge = (secId) => {
    if (secId === 'subscription') {
      return {
        text: isPro ? `${activeTier.badge} ✓` : 'Starter (Free)',
        color: isPro ? 'var(--success)' : 'var(--primary)',
        bg: isPro ? 'var(--success-bg)' : 'var(--badge-primary-bg)',
      };
    }
    if (secId === 'theme') {
      return {
        text: theme === 'dark' ? 'Cyber Dark' : 'Executive Light',
        color: 'var(--accent)',
        bg: 'rgba(6, 182, 212, 0.12)',
      };
    }
    if (secId === 'cloud') {
      const activeCount = (settings.aws.enabled ? 1 : 0) + (settings.azure.enabled ? 1 : 0) + (settings.gcp.enabled ? 1 : 0);
      return {
        text: activeCount > 0 ? `${activeCount} Cloud Connected` : 'Disconnected',
        color: activeCount > 0 ? '#ff9900' : 'var(--text-muted)',
        bg: activeCount > 0 ? 'rgba(255, 153, 0, 0.12)' : 'var(--panel-inner-bg)',
      };
    }
    if (secId === 'general') {
      return {
        text: settings.general.auto_remediation ? 'Safe Auto-Fix ON' : 'Scan Only',
        color: 'var(--success)',
        bg: 'var(--success-bg)',
      };
    }
    if (secId === 'notifications') {
      return {
        text: settings.general.email_notifications ? 'Email Alert Active' : 'Muted',
        color: 'var(--primary)',
        bg: 'var(--badge-primary-bg)',
      };
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in" style={{ maxWidth: '1180px', margin: '0 auto', paddingBottom: '48px' }}>
      
      {/* ========================================================================= */}
      {/* 1. FIRST OPENING PAGE: SETTINGS HUB DIRECTORY (when at /settings)       */}
      {/* ========================================================================= */}
      {!isSubPage ? (
        <div className="flex flex-col gap-6 animate-fade-in">
          
          {/* Header & Save Bar */}
          <div className="flex justify-between items-center flex-wrap gap-4 pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <div>
              <div className="flex items-center gap-2" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                <Link to="/dashboard" style={{ color: 'var(--text-muted)', textDecoration: 'none' }} className="hover:underline">
                  Dashboard
                </Link>
                <ChevronRight size={14} />
                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Platform Settings</span>
              </div>

              <h2 style={{ fontSize: '1.75rem', margin: 0, fontWeight: 800, letterSpacing: '-0.02em' }} className="flex items-center gap-3">
                <div style={{ padding: '8px', borderRadius: '12px', background: 'var(--badge-primary-bg)', color: 'var(--primary)', display: 'flex' }}>
                  <SettingsIcon size={24} />
                </div>
                Settings & Platform Configuration
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                Select a settings category below to manage subscriptions, themes, connected clouds, scanner cadence, and alerts.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }} className="hidden sm:inline-flex items-center gap-1.5">
                <Clock size={14} />
                <span>Saved: {lastSavedTime}</span>
              </span>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveAll}
                style={{
                  padding: '10px 22px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px var(--primary-glow)',
                }}
              >
                {saved ? <CheckCircle2 size={18} /> : <Save size={18} />}
                {saved ? 'All Settings Saved ✓' : 'Save All Settings'}
              </button>
            </div>
          </div>

          {/* Search Filter input */}
          <div
            style={{
              position: 'relative',
              background: 'var(--panel-inner-bg)',
              borderRadius: '14px',
              border: '1px solid var(--border-color)',
              padding: '10px 16px',
            }}
            className="flex items-center gap-3"
          >
            <Search size={18} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search settings sections (e.g., subscription, theme, aws, notifications)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-main)',
                fontSize: '0.92rem',
                outline: 'none',
                width: '100%',
              }}
            />
          </div>

          {/* Main List of Settings Options Cards (Matching user screenshot design) */}
          <div
            className="glass-panel"
            style={{
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {filteredSections.map((sec) => {
              const SecIcon = sec.icon;
              const badgeInfo = getSectionStatusBadge(sec.id);

              return (
                <div
                  key={sec.id}
                  onClick={() => handleOpenSection(sec.id)}
                  style={{
                    background: 'var(--panel-inner-bg)',
                    border: '1px solid var(--border-color)',
                    padding: '18px 22px',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                  }}
                  className="hover:border-primary hover:shadow-lg hover:translate-x-1"
                >
                  <div className="flex items-center gap-4" style={{ minWidth: 0 }}>
                    <div
                      style={{
                        padding: '12px',
                        borderRadius: '14px',
                        background: 'var(--badge-primary-bg)',
                        color: sec.color || 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <SecIcon size={24} />
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700, color: 'var(--text-main)' }}>
                          {sec.label}
                        </h3>
                        {badgeInfo && (
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              padding: '3px 9px',
                              borderRadius: '8px',
                              background: badgeInfo.bg,
                              color: badgeInfo.color,
                            }}
                          >
                            {badgeInfo.text}
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                        {sec.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 700 }} className="hidden sm:inline">
                      Open Settings
                    </span>
                    <div
                      style={{
                        padding: '8px',
                        borderRadius: '10px',
                        background: 'var(--panel-bg-solid)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-muted)',
                      }}
                    >
                      <ChevronRight size={18} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Quick Help Card */}
          <div
            className="glass-panel"
            style={{
              padding: '20px 24px',
              border: '1px solid var(--border-color)',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(6, 182, 212, 0.05))',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div className="flex items-center gap-3.5">
              <div style={{ padding: '10px', borderRadius: '12px', background: 'var(--badge-primary-bg)', color: 'var(--primary)' }}>
                <Sparkles size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', margin: 0, fontWeight: 700 }}>24/7 AI Cloud SecOps Assistant</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                  Need automated help fixing open security groups, IAM roles, or configuring webhooks?
                </p>
              </div>
            </div>

            <Link
              to="/subscription"
              className="btn btn-primary"
              style={{
                padding: '8px 18px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Open SecOps Assistant
            </Link>
          </div>

        </div>
      ) : (
        /* ========================================================================= */
        /* 2. SECOND PAGE: DEDICATED SETTINGS SECTION PAGE (e.g. /settings/theme)    */
        /* ========================================================================= */
        <div className="flex flex-col gap-6 animate-fade-in">
          
          {/* Header with "Back to All Settings" button */}
          <div className="flex justify-between items-center flex-wrap gap-4 pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <div>
              {/* Back Button & Breadcrumbs */}
              <div className="flex items-center gap-2" style={{ fontSize: '0.82rem', marginBottom: '8px' }}>
                <button
                  type="button"
                  onClick={handleBackToHub}
                  style={{
                    background: 'var(--panel-inner-bg)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--primary)',
                    padding: '5px 12px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'var(--transition)',
                  }}
                  className="hover:border-primary"
                >
                  <ArrowLeft size={14} /> Back to All Settings
                </button>
                <span style={{ color: 'var(--text-subtle)' }}>/</span>
                <span style={{ color: 'var(--text-muted)' }}>Platform Settings</span>
                <span style={{ color: 'var(--text-subtle)' }}>/</span>
                <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>{currentSectionObj.label}</span>
              </div>

              <h2 style={{ fontSize: '1.65rem', margin: 0, fontWeight: 800, letterSpacing: '-0.02em' }} className="flex items-center gap-3">
                <div style={{ padding: '8px', borderRadius: '12px', background: 'var(--badge-primary-bg)', color: currentSectionObj.color || 'var(--primary)', display: 'flex' }}>
                  <currentSectionObj.icon size={22} />
                </div>
                {currentSectionObj.label}
              </h2>
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-3">
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }} className="hidden sm:inline-flex items-center gap-1.5">
                <Clock size={14} />
                <span>Saved: {lastSavedTime}</span>
              </span>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveAll}
                style={{
                  padding: '10px 22px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {saved ? <CheckCircle2 size={18} /> : <Save size={18} />}
                {saved ? 'Saved ✓' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Quick Top Category Switcher Bar */}
          <div
            className="flex items-center gap-2 overflow-x-auto pb-1"
            style={{
              scrollbarWidth: 'none',
            }}
          >
            {SETTINGS_SECTIONS.map((sec) => {
              const SecIcon = sec.icon;
              const isSelected = sec.id === activeSectionId;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => handleOpenSection(sec.id)}
                  style={{
                    background: isSelected ? 'var(--primary)' : 'var(--panel-inner-bg)',
                    color: isSelected ? '#ffffff' : 'var(--text-muted)',
                    border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    whiteSpace: 'nowrap',
                    transition: 'var(--transition)',
                  }}
                >
                  <SecIcon size={16} />
                  {sec.shortLabel}
                </button>
              );
            })}
          </div>

          {/* Render the Active Sub-Page Component */}
          <div className="flex flex-col gap-6 animate-fade-in">
            {activeSectionId === 'subscription' && (
              <SubscriptionSettingsTab />
            )}

            {activeSectionId === 'theme' && (
              <ThemeSettingsTab />
            )}

            {activeSectionId === 'cloud' && (
              <CloudSettingsTab
                settings={settings}
                updateCloud={updateCloud}
                setSettings={setSettings}
              />
            )}

            {activeSectionId === 'general' && (
              <ScannerSettingsTab
                settings={settings}
                updateGeneral={updateGeneral}
              />
            )}

            {activeSectionId === 'notifications' && (
              <NotificationSettingsTab
                settings={settings}
                updateGeneral={updateGeneral}
              />
            )}
          </div>

          {/* Bottom Save & Back navigation */}
          <div className="flex justify-between items-center pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <button
              type="button"
              onClick={handleBackToHub}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
              className="hover:text-primary"
            >
              <ArrowLeft size={16} /> Back to All Settings
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSaveAll}
              style={{ padding: '10px 24px', fontSize: '0.88rem', fontWeight: 700, borderRadius: '10px' }}
            >
              {saved ? 'Saved ✓' : 'Save Settings'}
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
