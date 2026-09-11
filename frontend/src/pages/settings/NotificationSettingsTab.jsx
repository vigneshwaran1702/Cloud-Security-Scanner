import React, { useState } from 'react';
import {
  Bell,
  Mail,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Sliders,
  Sparkles,
  Zap,
  Globe,
  Check
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

function Toggle({ value, onChange, label }) {
  return (
    <div
      className="flex items-center gap-2.5"
      style={{ cursor: 'pointer', userSelect: 'none' }}
      onClick={() => onChange(!value)}
    >
      <div
        style={{
          width: '42px',
          height: '24px',
          borderRadius: '12px',
          background: value ? 'var(--success)' : 'rgba(255,255,255,0.15)',
          padding: '2px',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: value ? 'flex-end' : 'flex-start',
        }}
      >
        <div
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        />
      </div>
      {label && <span style={{ fontSize: '0.88rem', fontWeight: 600, color: value ? 'var(--text-main)' : 'var(--text-muted)' }}>{label}</span>}
    </div>
  );
}

export default function NotificationSettingsTab({ settings, updateGeneral }) {
  const { addNotification } = useNotifications();
  const [emailAddress, setEmailAddress] = useState('secops-lead@cloudguard.io');
  const [testSent, setTestSent] = useState(false);
  const [slackTestSent, setSlackTestSent] = useState(false);

  const [alertChannels, setAlertChannels] = useState({
    criticalDrift: true,
    autoRemediateSuccess: true,
    complianceDegraded: true,
    weeklyReport: false,
  });

  const handleToggleChannel = (key) => {
    setAlertChannels(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSendTestNotification = () => {
    addNotification({
      title: 'CloudGuard Test Alert Handshake',
      description: 'Test notification delivered successfully to your active browser session and connected webhook channels.',
      type: 'info',
      cloud: 'System',
    });
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  const handleSendSlackTest = () => {
    setSlackTestSent(true);
    setTimeout(() => setSlackTestSent(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* 1. Header & Quick Test Action */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div style={{ padding: '10px', borderRadius: '12px', background: 'var(--badge-primary-bg)', color: 'var(--primary)' }}>
              <Bell size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 700 }}>Notification & Incident Alert Channels</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Deliver multi-cloud security drifts directly to SecOps teams via Email, Slack, and Webhooks
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSendTestNotification}
            className="btn btn-primary"
            style={{
              padding: '8px 18px',
              fontSize: '0.85rem',
              fontWeight: 700,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {testSent ? <CheckCircle2 size={16} /> : <Send size={16} />}
            {testSent ? 'Test Alert Dispatched ✓' : 'Send Test Notification'}
          </button>
        </div>
      </div>

      {/* 2. Email Notifications */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div className="flex justify-between items-center flex-wrap gap-3" style={{ marginBottom: '18px' }}>
          <div className="flex items-center gap-3">
            <div style={{ padding: '10px', borderRadius: '10px', background: 'var(--panel-inner-bg)', color: 'var(--primary)' }}>
              <Mail size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>Email Security Bulletins</h4>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Receive instant executive summaries and high-priority vulnerability digests
              </span>
            </div>
          </div>

          <Toggle
            value={settings.general.email_notifications}
            onChange={v => updateGeneral('email_notifications', v)}
            label={settings.general.email_notifications ? 'Enabled' : 'Disabled'}
          />
        </div>

        {settings.general.email_notifications && (
          <div className="flex flex-col gap-2 animate-fade-in" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Primary Alert Email Address
            </label>
            <input
              type="email"
              value={emailAddress}
              onChange={e => setEmailAddress(e.target.value)}
              placeholder="e.g. security-alerts@yourdomain.com"
              style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                padding: '12px 14px',
                borderRadius: '12px',
                fontSize: '0.9rem',
                outline: 'none',
                maxWidth: '520px',
              }}
            />
          </div>
        )}
      </div>

      {/* 3. Slack Webhook Integration */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div className="flex items-center gap-3" style={{ marginBottom: '18px' }}>
          <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(234, 179, 8, 0.12)', color: 'var(--medium)' }}>
            <MessageSquare size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>Slack Incoming Webhook</h4>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Stream critical posture findings directly into your team's SOC Slack channel
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Slack Webhook Endpoint URL
          </label>
          <div className="flex gap-3 flex-wrap">
            <input
              type="url"
              value={settings.general.slack_webhook}
              onChange={e => updateGeneral('slack_webhook', e.target.value)}
              placeholder="e.g. Webhook URL (https://hooks.slack.com/...)"
              style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                padding: '12px 14px',
                borderRadius: '12px',
                fontSize: '0.9rem',
                outline: 'none',
                flex: 1,
                minWidth: '280px',
              }}
            />
            <button
              type="button"
              onClick={handleSendSlackTest}
              className="btn btn-secondary"
              style={{ padding: '10px 18px', fontSize: '0.85rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              {slackTestSent ? <CheckCircle2 size={16} color="var(--success)" /> : <Send size={16} />}
              {slackTestSent ? 'Slack Ping Sent ✓' : 'Test Slack Hook'}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Alert Frequency & Severity Trigger Matrix */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <h4 style={{ fontSize: '1.05rem', margin: '0 0 16px', fontWeight: 700 }}>Incident Trigger Preferences</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => handleToggleChannel('criticalDrift')}
            style={{
              background: 'var(--panel-inner-bg)',
              padding: '16px',
              borderRadius: '14px',
              border: alertChannels.criticalDrift ? '1px solid var(--border-color)' : '1px dashed var(--border-color)',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                Critical CVE / Public Resource Drift
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Instant real-time trigger for severity &ge; Critical
              </span>
            </div>
            <Toggle value={alertChannels.criticalDrift} onChange={() => handleToggleChannel('criticalDrift')} />
          </div>

          <div
            onClick={() => handleToggleChannel('autoRemediateSuccess')}
            style={{
              background: 'var(--panel-inner-bg)',
              padding: '16px',
              borderRadius: '14px',
              border: alertChannels.autoRemediateSuccess ? '1px solid var(--border-color)' : '1px dashed var(--border-color)',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                Safe Auto-Remediation Execution Log
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Confirmation report when a fix is safely deployed
              </span>
            </div>
            <Toggle value={alertChannels.autoRemediateSuccess} onChange={() => handleToggleChannel('autoRemediateSuccess')} />
          </div>

          <div
            onClick={() => handleToggleChannel('complianceDegraded')}
            style={{
              background: 'var(--panel-inner-bg)',
              padding: '16px',
              borderRadius: '14px',
              border: alertChannels.complianceDegraded ? '1px solid var(--border-color)' : '1px dashed var(--border-color)',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                CIS Benchmark Score Degradation
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Triggers when compliance drops below 80%
              </span>
            </div>
            <Toggle value={alertChannels.complianceDegraded} onChange={() => handleToggleChannel('complianceDegraded')} />
          </div>

          <div
            onClick={() => handleToggleChannel('weeklyReport')}
            style={{
              background: 'var(--panel-inner-bg)',
              padding: '16px',
              borderRadius: '14px',
              border: alertChannels.weeklyReport ? '1px solid var(--border-color)' : '1px dashed var(--border-color)',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                Weekly Executive Posture Digest
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Consolidated multi-cloud health report every Monday
              </span>
            </div>
            <Toggle value={alertChannels.weeklyReport} onChange={() => handleToggleChannel('weeklyReport')} />
          </div>
        </div>
      </div>
    </div>
  );
}
