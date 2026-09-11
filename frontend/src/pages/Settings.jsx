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
  Search
} from 'lucide-react';
import { getCloudState, saveCloudState } from '../services/api';
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

const TABS = [
  {
    id: 'subscription',
    label: 'Subscription & Details',
    shortLabel: 'Subscription',
    icon: CreditCard,
    badge: 'Pro / Tier',
    description: 'Active tier, billing history, payment methods & receipts',
  },
  {
    id: 'theme',
    label: 'Theme & Color Settings',
    shortLabel: 'Theme & Colors',
    icon: Palette,
    badge: null,
    description: 'Cyber Dark / Executive Light modes & neon accent palettes',
  },
  {
    id: 'cloud',
    label: 'Connected Cloud Accounts',
    shortLabel: 'Cloud Accounts',
    icon: Cloud,
    badge: 'AWS / Azure / GCP',
    description: 'Multi-cloud IAM credentials & live connection status',
  },
  {
    id: 'general',
    label: 'General Scanner Configuration',
    shortLabel: 'Scanner Config',
    icon: Shield,
    badge: null,
    description: 'Scan frequency, minimum severity & safe auto-remediation',
  },
  {
    id: 'notifications',
    label: 'Notification Channels',
    shortLabel: 'Notifications',
    icon: Bell,
    badge: null,
    description: 'Email digests, Slack webhooks & incident triggers',
  },
];

export default function Settings() {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Determine active tab from URL params (:section) or query params (?tab=) or fallback to 'subscription'
  const routeSection = params.section || searchParams.get('tab') || 'subscription';
  const activeTabId = TABS.some(t => t.id === routeSection) ? routeSection : 'subscription';

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

  const handleSelectTab = (tabId) => {
    navigate(`/settings/${tabId}`);
  };

  const handleSaveAll = () => {
    // If user configured cloud account id, sync to cloud state
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

  const currentTabObj = TABS.find(t => t.id === activeTabId) || TABS[0];
  const filteredTabs = TABS.filter(t =>
    t.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 animate-fade-in" style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* 1. TOP HEADER & BREADCRUMB BAR */}
      <div className="flex justify-between items-center flex-wrap gap-4 pb-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div>
          <div className="flex items-center gap-2" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
            <Link to="/dashboard" style={{ color: 'var(--text-muted)', textDecoration: 'none' }} className="hover:underline">
              Dashboard
            </Link>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Platform Settings</span>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>{currentTabObj.shortLabel}</span>
          </div>

          <h2 style={{ fontSize: '1.65rem', margin: 0, fontWeight: 800, letterSpacing: '-0.02em' }} className="flex items-center gap-2.5">
            <SettingsIcon size={26} color="var(--primary)" />
            Settings & Platform Configuration
          </h2>
        </div>

        {/* Global Save Button with Status Feedback */}
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
            {saved ? 'All Changes Saved ✓' : 'Save All Settings'}
          </button>
        </div>
      </div>

      {/* 2. MAIN SETTINGS TWO-COLUMN / SUB-PAGE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT SUB-NAVIGATION SIDEBAR (4 cols on lg) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          
          {/* Search / Filter in Settings */}
          <div
            style={{
              position: 'relative',
              background: 'var(--panel-inner-bg)',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              padding: '6px 12px',
            }}
            className="flex items-center gap-2"
          >
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search settings sections..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                outline: 'none',
                width: '100%',
              }}
            />
          </div>

          {/* Navigation Tab Links */}
          <div
            className="glass-panel"
            style={{
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            {filteredTabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTabId === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleSelectTab(tab.id)}
                  style={{
                    background: isActive ? 'var(--sidebar-active-bg)' : 'transparent',
                    border: isActive ? '1px solid var(--sidebar-active-border)' : '1px solid transparent',
                    color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                    boxShadow: isActive ? '0 4px 16px var(--primary-glow)' : 'none',
                    padding: '14px 16px',
                    borderRadius: '14px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    position: 'relative',
                  }}
                  className="hover:bg-panel-inner"
                >
                  <div className="flex items-center gap-3.5" style={{ minWidth: 0 }}>
                    <div
                      style={{
                        padding: '9px',
                        borderRadius: '10px',
                        background: isActive ? 'var(--primary)' : 'var(--panel-inner-bg)',
                        color: isActive ? '#ffffff' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <TabIcon size={18} />
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: '0.92rem', fontWeight: isActive ? 800 : 600, color: isActive ? 'var(--text-main)' : 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {tab.label}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.73rem', color: 'var(--text-muted)', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {tab.description}
                      </p>
                    </div>
                  </div>

                  <ChevronRight
                    size={16}
                    color={isActive ? 'var(--primary)' : 'var(--text-subtle)'}
                    style={{
                      transform: isActive ? 'translateX(2px)' : 'none',
                      transition: 'transform 0.2s ease',
                      flexShrink: 0,
                      marginLeft: '6px',
                    }}
                  />
                </button>
              );
            })}
          </div>

          {/* Quick Support / SecOps Help Card */}
          <div
            className="glass-panel"
            style={{
              padding: '18px',
              border: '1px solid var(--border-color)',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(6, 182, 212, 0.05))',
            }}
          >
            <div className="flex items-center gap-2.5" style={{ marginBottom: '8px' }}>
              <Sparkles size={18} color="var(--primary)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
                CloudGuard SecOps AI
              </span>
            </div>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: '0 0 12px', lineHeight: 1.4 }}>
              Need assistance provisioning IAM roles or configuring automated webhook alerts?
            </p>
            <Link
              to="/subscription"
              style={{
                fontSize: '0.75rem',
                color: 'var(--primary)',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              Open 24/7 SecOps Assistant <ChevronRight size={13} />
            </Link>
          </div>
        </div>

        {/* RIGHT MAIN SUB-PAGE CONTENT (8 cols on lg) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* TAB 1: SUBSCRIPTION & DETAILS */}
          {activeTabId === 'subscription' && (
            <SubscriptionSettingsTab />
          )}

          {/* TAB 2: THEME & COLOR SETTINGS */}
          {activeTabId === 'theme' && (
            <ThemeSettingsTab />
          )}

          {/* TAB 3: CONNECTED CLOUD ACCOUNTS */}
          {activeTabId === 'cloud' && (
            <CloudSettingsTab
              settings={settings}
              updateCloud={updateCloud}
              setSettings={setSettings}
            />
          )}

          {/* TAB 4: GENERAL SCANNER CONFIGURATION */}
          {activeTabId === 'general' && (
            <ScannerSettingsTab
              settings={settings}
              updateGeneral={updateGeneral}
            />
          )}

          {/* TAB 5: NOTIFICATIONS */}
          {activeTabId === 'notifications' && (
            <NotificationSettingsTab
              settings={settings}
              updateGeneral={updateGeneral}
            />
          )}

          {/* Bottom Save Bar on mobile / bottom of section */}
          <div className="flex justify-between items-center pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <Clock size={13} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '5px' }} />
              Last saved: {lastSavedTime}
            </span>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSaveAll}
              style={{ padding: '10px 24px', fontSize: '0.88rem', fontWeight: 700, borderRadius: '10px' }}
            >
              {saved ? 'Saved ✓' : 'Save Changes'}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
