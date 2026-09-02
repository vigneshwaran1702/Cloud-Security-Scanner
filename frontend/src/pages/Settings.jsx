import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cloud, Shield, Key, Bell, Clock, AlertTriangle, Save, ToggleLeft, ToggleRight, Mail, MessageSquare, Zap, CreditCard, Sparkles, ArrowRight, ShieldCheck, Sun, Moon, Palette } from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';
import { useTheme } from '../context/ThemeContext';

const initialSettings = {
  aws: {
    enabled: true,
    access_key_id: 'AKIA************',
    secret_access_key: '********************************',
    region: 'us-east-1',
  },
  azure: {
    enabled: true,
    tenant_id: '72f988bf-86f1-41af-91ab-2d7cd011db47',
    client_id: '3b290918-a402-4a02-a16f-998811aabbcc',
    subscription_id: '00000000-0000-0000-0000-000000000000',
  },
  gcp: {
    enabled: true,
    project_id: 'cloud-sec-scanner-prod',
    service_account_email: 'scanner-sa@cloud-sec-scanner-prod.iam.gserviceaccount.com',
  },
  general: {
    auto_remediation: false,
    scan_frequency: 'Every 6 Hours',
    min_severity: 'Medium',
    email_notifications: true,
    slack_webhook: 'https://hooks.slack.com/services/T00/B00/XXXXX',
  },
};

const awsRegions = ['us-east-1', 'us-east-2', 'us-west-1', 'us-west-2', 'eu-west-1', 'eu-central-1', 'ap-southeast-1'];
const scanFrequencies = ['Every 1 Hour', 'Every 6 Hours', 'Every 12 Hours', 'Daily', 'Weekly'];
const severityLevels = ['Low', 'Medium', 'High', 'Critical'];

function Toggle({ value, onChange, label }) {
  return (
    <div
      className="flex items-center gap-3"
      style={{ cursor: 'pointer' }}
      onClick={() => onChange(!value)}
    >
      {value
        ? <ToggleRight size={28} color="var(--success)" />
        : <ToggleLeft size={28} color="var(--text-muted)" />}
      {label && <span style={{ fontSize: '0.9rem', fontWeight: 500, color: value ? 'var(--text-main)' : 'var(--text-muted)' }}>{label}</span>}
    </div>
  );
}

function SettingsInput({ label, value, onChange, type = 'text', placeholder }) {
  return (
    <div className="flex flex-col" style={{ gap: '6px' }}>
      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          background: 'var(--input-bg)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-main)',
          padding: '10px 14px',
          borderRadius: '10px',
          fontSize: '0.9rem',
          outline: 'none',
          transition: 'var(--transition)',
          width: '100%',
        }}
      />
    </div>
  );
}

function SettingsSelect({ label, value, onChange, options }) {
  return (
    <div className="flex flex-col" style={{ gap: '6px' }}>
      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          background: 'var(--input-bg)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-main)',
          padding: '10px 14px',
          borderRadius: '10px',
          fontSize: '0.9rem',
          outline: 'none',
          cursor: 'pointer',
        }}
      >
        {options.map(opt => (
          <option key={opt} value={opt} style={{ background: 'var(--bg-color)', color: 'var(--text-main)' }}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

export default function Settings() {
  const { currentPlan, activeTier, isPro, invoices } = useSubscription();
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState(initialSettings);
  const [saved, setSaved] = useState(false);

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

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const cloudProviders = [
    {
      key: 'aws',
      name: 'Amazon Web Services',
      icon: <Cloud size={22} color="#ff9900" />,
      color: '#ff9900',
      fields: (
        <div className="grid grid-cols-2 gap-4" style={{ marginTop: '16px' }}>
          <SettingsInput label="Access Key ID" value={settings.aws.access_key_id} onChange={v => updateCloud('aws', 'access_key_id', v)} />
          <SettingsInput label="Secret Access Key" value={settings.aws.secret_access_key} onChange={v => updateCloud('aws', 'secret_access_key', v)} type="password" />
          <SettingsSelect label="Default Region" value={settings.aws.region} onChange={v => updateCloud('aws', 'region', v)} options={awsRegions} />
        </div>
      ),
    },
    {
      key: 'azure',
      name: 'Microsoft Azure',
      icon: <Cloud size={22} color="#0078d4" />,
      color: '#0078d4',
      fields: (
        <div className="grid grid-cols-2 gap-4" style={{ marginTop: '16px' }}>
          <SettingsInput label="Tenant ID" value={settings.azure.tenant_id} onChange={v => updateCloud('azure', 'tenant_id', v)} />
          <SettingsInput label="Client ID" value={settings.azure.client_id} onChange={v => updateCloud('azure', 'client_id', v)} />
          <SettingsInput label="Subscription ID" value={settings.azure.subscription_id} onChange={v => updateCloud('azure', 'subscription_id', v)} />
        </div>
      ),
    },
    {
      key: 'gcp',
      name: 'Google Cloud Platform',
      icon: <Cloud size={22} color="#4285f4" />,
      color: '#4285f4',
      fields: (
        <div className="grid grid-cols-2 gap-4" style={{ marginTop: '16px' }}>
          <SettingsInput label="Project ID" value={settings.gcp.project_id} onChange={v => updateCloud('gcp', 'project_id', v)} />
          <SettingsInput label="Service Account Email" value={settings.gcp.service_account_email} onChange={v => updateCloud('gcp', 'service_account_email', v)} />
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '32px' }}>
      
      {/* Appearance & Theme Selector */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div className="flex items-center gap-3" style={{ marginBottom: '20px' }}>
          <div style={{ padding: '10px', borderRadius: '12px', background: 'var(--badge-primary-bg)', border: '1px solid var(--badge-primary-border)' }}>
            <Palette size={22} color="var(--primary)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Appearance & Color Palette</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              Choose between Light (White & Red) or Dark (Black) theme for your security portal
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Light Theme Option Card */}
          <div
            onClick={() => setTheme('light')}
            style={{
              padding: '20px',
              borderRadius: '16px',
              cursor: 'pointer',
              background: theme === 'light' ? 'rgba(220, 38, 38, 0.08)' : 'var(--panel-inner-bg)',
              border: theme === 'light' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
              boxShadow: theme === 'light' ? '0 8px 24px rgba(220, 38, 38, 0.18)' : 'none',
              transition: 'var(--transition)',
              position: 'relative',
            }}
          >
            {theme === 'light' && (
              <span style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '8px',
                background: 'var(--primary)',
                color: '#fff',
              }}>
                ACTIVE
              </span>
            )}
            <div className="flex items-center gap-3" style={{ marginBottom: '12px' }}>
              <div style={{ padding: '8px', borderRadius: '10px', background: '#dc2626', color: '#fff' }}>
                <Sun size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--text-main)' }}>Light Theme</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>White & Red Color Palette</span>
              </div>
            </div>

            {/* Visual Palette Preview */}
            <div className="flex gap-2" style={{ marginTop: '14px' }}>
              <div style={{ flex: 1, height: '24px', borderRadius: '6px', background: '#ffffff', border: '1px solid #e2e8f0' }} title="Pure White Background" />
              <div style={{ flex: 1, height: '24px', borderRadius: '6px', background: '#dc2626' }} title="Crimson Red Accent" />
              <div style={{ flex: 1, height: '24px', borderRadius: '6px', background: '#e11d48' }} title="Rose Gradient" />
              <div style={{ flex: 1, height: '24px', borderRadius: '6px', background: '#0f172a' }} title="Charcoal Text" />
            </div>
          </div>

          {/* Dark Theme Option Card */}
          <div
            onClick={() => setTheme('dark')}
            style={{
              padding: '20px',
              borderRadius: '16px',
              cursor: 'pointer',
              background: theme === 'dark' ? 'rgba(239, 68, 68, 0.14)' : 'var(--panel-inner-bg)',
              border: theme === 'dark' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
              boxShadow: theme === 'dark' ? '0 8px 24px rgba(239, 68, 68, 0.25)' : 'none',
              transition: 'var(--transition)',
              position: 'relative',
            }}
          >
            {theme === 'dark' && (
              <span style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '8px',
                background: 'var(--primary)',
                color: '#fff',
              }}>
                ACTIVE
              </span>
            )}
            <div className="flex items-center gap-3" style={{ marginBottom: '12px' }}>
              <div style={{ padding: '8px', borderRadius: '10px', background: '#ef4444', color: '#fff' }}>
                <Moon size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--text-main)' }}>Dark Theme</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pure Black & Red Glow</span>
              </div>
            </div>

            {/* Visual Palette Preview */}
            <div className="flex gap-2" style={{ marginTop: '14px' }}>
              <div style={{ flex: 1, height: '24px', borderRadius: '6px', background: '#030712', border: '1px solid rgba(255,255,255,0.2)' }} title="Pitch Black Background" />
              <div style={{ flex: 1, height: '24px', borderRadius: '6px', background: '#ef4444' }} title="Cyber Red" />
              <div style={{ flex: 1, height: '24px', borderRadius: '6px', background: '#e11d48' }} title="Ruby Accent" />
              <div style={{ flex: 1, height: '24px', borderRadius: '6px', background: '#f8fafc' }} title="Pure White Text" />
            </div>
          </div>
        </div>
      </div>

      {/* Subscription & Billing Management */}
      <div className="glass-panel" style={{ padding: '28px', border: isPro ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-color)' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: '20px' }}>
          <div className="flex items-center gap-3">
            <div style={{ padding: '10px', borderRadius: '12px', background: isPro ? 'rgba(16, 185, 129, 0.15)' : 'var(--badge-primary-bg)' }}>
              <Zap size={22} color={isPro ? 'var(--success)' : 'var(--primary)'} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Subscription & Plan Management</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Manage your cloud protection tier, active safeguards, and billing
              </p>
            </div>
          </div>
          <Link
            to="/subscription"
            className="btn btn-primary"
            style={{
              padding: '8px 16px',
              fontSize: '0.85rem',
              fontWeight: 700,
              textDecoration: 'none',
              borderRadius: '10px',
            }}
          >
            {isPro ? 'Manage Subscription' : 'Upgrade to Pro ($39)'}
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4" style={{ marginBottom: '16px' }}>
          <div style={{ background: 'var(--panel-inner-bg)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Active Plan</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }} className="flex items-center gap-2">
              {activeTier.name}
              <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '8px', background: isPro ? 'rgba(16,185,129,0.2)' : 'var(--badge-primary-bg)', color: isPro ? 'var(--success)' : 'var(--primary)' }}>
                {activeTier.badge}
              </span>
            </div>
          </div>

          <div style={{ background: 'var(--panel-inner-bg)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Safe Production Status</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: isPro ? 'var(--success)' : 'var(--text-muted)' }} className="flex items-center gap-1.5">
              <ShieldCheck size={16} color={isPro ? 'var(--success)' : 'var(--text-muted)'} />
              {isPro ? 'Unlocked & Active' : 'Upgrade to Unlock ($39)'}
            </div>
          </div>

          <div style={{ background: 'var(--panel-inner-bg)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>24/7 Instant Help Hotline</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: isPro ? 'var(--primary)' : 'var(--text-muted)' }} className="flex items-center gap-1.5">
              <Sparkles size={16} color={isPro ? 'var(--primary)' : 'var(--text-muted)'} />
              {isPro ? 'Priority AI SecOps' : 'Community Mode'}
            </div>
          </div>
        </div>

        {invoices.length > 0 && (
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '8px' }}>Recent Billing Invoices</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {invoices.map(inv => (
                <div key={inv.id} className="flex justify-between items-center" style={{ fontSize: '0.8rem', background: 'var(--panel-inner-bg)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <span>{inv.id} • {inv.date} ({inv.planName})</span>
                  <span style={{ color: 'var(--success)', fontWeight: 700 }}>${inv.amount} Paid ✓</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cloud Accounts Config */}
      <div className="flex flex-col gap-4">
        <h3 style={{ fontSize: '1.2rem', margin: '8px 0 0' }}>Connected Cloud Accounts</h3>
        {cloudProviders.map(provider => (
          <div key={provider.key} className="glass-panel" style={{ padding: '24px' }}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div style={{ padding: '8px', borderRadius: '10px', background: 'var(--panel-inner-bg)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center' }}>
                  {provider.icon}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', margin: 0 }}>{provider.name}</h4>
                  <span style={{ fontSize: '0.8rem', color: settings[provider.key].enabled ? 'var(--success)' : 'var(--text-muted)' }}>
                    {settings[provider.key].enabled ? 'Connected & Monitored' : 'Disabled'}
                  </span>
                </div>
              </div>
              <Toggle
                value={settings[provider.key].enabled}
                onChange={v => updateCloud(provider.key, 'enabled', v)}
                label=""
              />
            </div>
            {settings[provider.key].enabled && provider.fields}
          </div>
        ))}
      </div>

      {/* General Scanner Configuration */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div className="flex items-center gap-4" style={{ marginBottom: '24px' }}>
          <div style={{ padding: '10px', borderRadius: '12px', background: 'var(--badge-primary-bg)', border: '1px solid var(--badge-primary-border)' }}>
            <Shield size={22} color="var(--primary)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>General Scanner Configuration</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Configure scanning frequency and automated action policies</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <SettingsSelect
            label="Scan Frequency"
            value={settings.general.scan_frequency}
            onChange={v => updateGeneral('scan_frequency', v)}
            options={scanFrequencies}
          />
          <SettingsSelect
            label="Minimum Severity to Report"
            value={settings.general.min_severity}
            onChange={v => updateGeneral('min_severity', v)}
            options={severityLevels}
          />

          <div className="flex flex-col gap-2" style={{ gridColumn: 'span 2' }}>
            <Toggle
              value={settings.general.auto_remediation}
              onChange={v => updateGeneral('auto_remediation', v)}
              label="Safe Production Auto-Remediation"
            />
            {settings.general.auto_remediation && (
              <div style={{ padding: '12px 16px', background: 'rgba(234, 179, 8, 0.08)', border: '1px solid rgba(234, 179, 8, 0.25)', borderRadius: '10px', fontSize: '0.85rem', color: 'var(--medium)' }} className="flex items-center gap-3">
                <AlertTriangle size={16} />
                <span>Auto-remediation will automatically apply security fixes with pre-flight dry-run and rollback snapshots.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div className="flex items-center gap-4" style={{ marginBottom: '24px' }}>
          <div style={{ padding: '10px', borderRadius: '12px', background: 'var(--badge-primary-bg)', border: '1px solid var(--badge-primary-border)' }}>
            <Bell size={22} color="var(--primary)" />
          </div>
          <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Notifications</h3>
        </div>

        <div className="flex flex-col gap-4">
          <div style={{ padding: '16px 20px', borderRadius: '12px', background: 'var(--panel-inner-bg)', border: '1px solid var(--border-color)' }} className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Mail size={18} color="var(--text-muted)" />
              <span style={{ fontWeight: 500 }}>Email Notifications</span>
            </div>
            <Toggle
              value={settings.general.email_notifications}
              onChange={v => updateGeneral('email_notifications', v)}
              label=""
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3" style={{ marginBottom: '4px' }}>
              <MessageSquare size={16} color="var(--text-muted)" />
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Slack Webhook URL
              </label>
            </div>
            <input
              type="text"
              value={settings.general.slack_webhook}
              onChange={e => updateGeneral('slack_webhook', e.target.value)}
              style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                padding: '10px 14px',
                borderRadius: '10px',
                fontSize: '0.9rem',
                outline: 'none',
                width: '100%',
              }}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-between items-center" style={{ padding: '8px 0' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <Clock size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '6px' }} />
          Last saved: Just now
        </span>
        <button
          className="btn btn-primary"
          onClick={handleSave}
          style={{ padding: '12px 32px', fontSize: '1rem' }}
        >
          <Save size={18} />
          {saved ? 'Saved ✓' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
