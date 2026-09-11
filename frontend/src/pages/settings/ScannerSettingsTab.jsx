import React, { useState } from 'react';
import {
  Shield,
  Clock,
  AlertTriangle,
  FileCheck,
  CheckSquare,
  Square,
  Sliders,
  Sparkles,
  Zap,
  Lock,
  Cpu,
  RefreshCw,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';

const scanFrequencies = [
  'Every 15 Minutes (Pro/Enterprise)',
  'Every 1 Hour',
  'Every 6 Hours',
  'Every 12 Hours',
  'Daily',
  'Weekly'
];

const severityLevels = [
  { level: 'Low', color: 'var(--low)', desc: 'Informational & low priority best practice drifts' },
  { level: 'Medium', color: 'var(--medium)', desc: 'Misconfigurations that should be remediated within 30 days' },
  { level: 'High', color: 'var(--high)', desc: 'Significant security risks requiring immediate attention' },
  { level: 'Critical', color: 'var(--critical)', desc: 'Active exploits, public S3 buckets, exposed root keys' },
];

const complianceFrameworks = [
  { id: 'cis', name: 'CIS Multi-Cloud Benchmark v3.0', tag: 'Core Standard', enabled: true },
  { id: 'soc2', name: 'SOC 2 Type II Security & Confidentiality', tag: 'Auditing', enabled: true },
  { id: 'hipaa', name: 'HIPAA Security Rule (45 CFR Part 160/164)', tag: 'Healthcare', enabled: true },
  { id: 'pci', name: 'PCI-DSS v4.0 (Payment Card Industry)', tag: 'FinTech', enabled: false },
  { id: 'nist', name: 'NIST SP 800-53 Rev. 5 High Impact', tag: 'Federal', enabled: false },
  { id: 'iso', name: 'ISO/IEC 27001:2022 ISMS Controls', tag: 'Enterprise', enabled: false },
];

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

export default function ScannerSettingsTab({ settings, updateGeneral }) {
  const { isPro } = useSubscription();
  const [frameworks, setFrameworks] = useState(complianceFrameworks);
  const [parallelThreads, setParallelThreads] = useState(16);
  const [rulesetUpdated, setRulesetUpdated] = useState(false);

  const toggleFramework = (id) => {
    setFrameworks(prev =>
      prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f)
    );
  };

  const handleUpdateRuleset = () => {
    setRulesetUpdated(true);
    setTimeout(() => setRulesetUpdated(false), 2500);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* 1. Scan Schedule & Severity Filters */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div className="flex items-center gap-3" style={{ marginBottom: '22px' }}>
          <div style={{ padding: '10px', borderRadius: '12px', background: 'var(--badge-primary-bg)', color: 'var(--primary)' }}>
            <Shield size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 700 }}>General Scanner Configuration</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              Configure autonomous detection cadence, minimum reporting severity, and resource quotas
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ marginBottom: '24px' }}>
          {/* Scan Frequency */}
          <div className="flex flex-col gap-2">
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Automated Scan Cadence
            </label>
            <select
              value={settings.general.scan_frequency}
              onChange={e => updateGeneral('scan_frequency', e.target.value)}
              style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                padding: '12px 14px',
                borderRadius: '12px',
                fontSize: '0.9rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {scanFrequencies.map(f => (
                <option key={f} value={f} style={{ background: 'var(--bg-color)', color: 'var(--text-main)' }}>
                  {f}
                </option>
              ))}
            </select>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Controls how often background crawler audits IAM roles, S3 storage, and firewall rule tables.
            </span>
          </div>

          {/* Minimum Severity */}
          <div className="flex flex-col gap-2">
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Minimum Severity Threshold
            </label>
            <select
              value={settings.general.min_severity}
              onChange={e => updateGeneral('min_severity', e.target.value)}
              style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                padding: '12px 14px',
                borderRadius: '12px',
                fontSize: '0.9rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {severityLevels.map(s => (
                <option key={s.level} value={s.level} style={{ background: 'var(--bg-color)', color: 'var(--text-main)' }}>
                  {s.level} — {s.desc}
                </option>
              ))}
            </select>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Findings below this severity tier will be muted from urgent dashboard alerts.
            </span>
          </div>
        </div>

        {/* Safe Production Auto-Remediation */}
        <div
          style={{
            background: 'var(--panel-inner-bg)',
            padding: '20px',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
          }}
          className="flex flex-col gap-3"
        >
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <Zap size={20} color="var(--primary)" />
              <div>
                <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>Safe Production Zero-Downtime Auto-Remediation</span>
                <span style={{ fontSize: '0.7rem', marginLeft: '8px', padding: '2px 8px', borderRadius: '6px', background: isPro ? 'var(--success-bg)' : 'var(--badge-primary-bg)', color: isPro ? 'var(--success)' : 'var(--primary)', fontWeight: 800 }}>
                  {isPro ? 'PRO UNLOCKED' : 'PRO FEATURE'}
                </span>
              </div>
            </div>
            <Toggle
              value={settings.general.auto_remediation}
              onChange={v => updateGeneral('auto_remediation', v)}
              label={settings.general.auto_remediation ? 'Enabled' : 'Disabled'}
            />
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
            When enabled, CloudGuard AI will automatically resolve open S3 bucket access, unencrypted database snapshots, and unrestricted SSH (0.0.0.0/0) security group rules using certified atomic dry-runs and automated rollback checkpoints.
          </p>

          {settings.general.auto_remediation && (
            <div
              style={{
                padding: '12px 16px',
                background: 'rgba(234, 179, 8, 0.08)',
                border: '1px solid rgba(234, 179, 8, 0.25)',
                borderRadius: '12px',
                fontSize: '0.82rem',
                color: 'var(--medium)',
              }}
              className="flex items-center gap-3 animate-fade-in"
            >
              <AlertTriangle size={18} style={{ flexShrink: 0 }} />
              <span>Atomic Pre-flight Check Active: Fixes will execute with pre-flight dry-run snapshot guarantees before applying modifications.</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Active Compliance Frameworks */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div className="flex items-center gap-3" style={{ marginBottom: '20px' }}>
          <div style={{ padding: '10px', borderRadius: '12px', background: 'var(--badge-primary-bg)', color: 'var(--primary)' }}>
            <FileCheck size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 700 }}>Security Compliance Frameworks</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              Select industry standard frameworks to map against findings for audit readiness
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {frameworks.map(fw => (
            <div
              key={fw.id}
              onClick={() => toggleFramework(fw.id)}
              style={{
                background: fw.enabled ? 'var(--badge-primary-bg)' : 'var(--panel-inner-bg)',
                border: fw.enabled ? '1px solid var(--badge-primary-border)' : '1px solid var(--border-color)',
                padding: '14px 18px',
                borderRadius: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'var(--transition)',
              }}
            >
              <div className="flex items-center gap-3">
                {fw.enabled ? (
                  <CheckSquare size={18} color="var(--primary)" />
                ) : (
                  <Square size={18} color="var(--text-muted)" />
                )}
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: fw.enabled ? 'var(--text-main)' : 'var(--text-muted)' }}>
                    {fw.name}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Auditor Category: {fw.tag}
                  </span>
                </div>
              </div>

              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: fw.enabled ? 'var(--primary)' : 'rgba(255,255,255,0.08)',
                  color: '#ffffff',
                }}
              >
                {fw.enabled ? 'ACTIVE' : 'MUTED'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Scanner Engine & Performance Quota */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div style={{ padding: '8px', borderRadius: '10px', background: 'var(--panel-inner-bg)', color: 'var(--accent)' }}>
              <Cpu size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', margin: 0, fontWeight: 700 }}>CloudGuard Detection Core Engine</h4>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Active Ruleset: <strong>v4.18.2-enterprise</strong> (1,840+ threat signatures)
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleUpdateRuleset}
            className="btn btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.8rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {rulesetUpdated ? <CheckCircle2 size={15} color="var(--success)" /> : <RefreshCw size={15} />}
            {rulesetUpdated ? 'Signatures Up to Date ✓' : 'Check for Ruleset Updates'}
          </button>
        </div>
      </div>
    </div>
  );
}
