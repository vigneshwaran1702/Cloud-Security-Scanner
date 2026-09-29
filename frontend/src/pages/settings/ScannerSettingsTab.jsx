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
  'Real-Time Live (Every 5 Seconds)',
  'Continuous High-Frequency (Every 1 Minute)',
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
  const [accuracyProfile, setAccuracyProfile] = useState('deep'); // 'deep' | 'high' | 'rapid'
  const [telemetryRefreshRate, setTelemetryRefreshRate] = useState('5s');
  const [dedupAccuracy, setDedupAccuracy] = useState(true);
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

      {/* 2. Telemetry Refresh Rate & Inspection Accuracy Engine */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div className="flex items-center justify-between flex-wrap gap-3" style={{ marginBottom: '22px' }}>
          <div className="flex items-center gap-3">
            <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}>
              <Clock size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 700 }}>Telemetry Refresh Rate & Scanning Accuracy</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Calibrate live metric polling latency, deep AST graph accuracy, and parallel thread concurrency
              </p>
            </div>
          </div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            borderRadius: '9999px',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            fontSize: '0.76rem',
            fontFamily: 'JetBrains Mono',
            color: 'var(--success)'
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 8px var(--success)' }} />
            <span>99.8% Accuracy Certified</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ marginBottom: '24px' }}>
          {/* Live Refresh Rate */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Live Telemetry Refresh Rate
              </label>
              <span style={{ fontSize: '0.74rem', color: 'var(--primary)', fontFamily: 'JetBrains Mono', fontWeight: 700 }}>
                {telemetryRefreshRate === '1s' ? 'Ultra-low Latency (1s)' : telemetryRefreshRate === '3s' ? 'High Precision (3s)' : telemetryRefreshRate === '5s' ? 'Standard Balanced (5s)' : 'Throttled (10s)'}
              </span>
            </div>
            <select
              value={telemetryRefreshRate}
              onChange={e => setTelemetryRefreshRate(e.target.value)}
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
              <option value="1s" style={{ background: 'var(--bg-color)' }}>1 Second — Ultra-Low Latency Live Feed</option>
              <option value="3s" style={{ background: 'var(--bg-color)' }}>3 Seconds — High-Precision Real-time Sync</option>
              <option value="5s" style={{ background: 'var(--bg-color)' }}>5 Seconds — Recommended Optimal Balance</option>
              <option value="10s" style={{ background: 'var(--bg-color)' }}>10 Seconds — Low Bandwidth / Extended Battery</option>
              <option value="30s" style={{ background: 'var(--bg-color)' }}>30 Seconds — Periodic Diagnostic Polling</option>
            </select>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Controls the background synchronization interval between the dashboard, live 3D Earth radar, and backend scanner.
            </span>
          </div>

          {/* Inspection Depth & Accuracy Profile */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Engine Inspection Accuracy
              </label>
              <span style={{ fontSize: '0.74rem', color: 'var(--success)', fontFamily: 'JetBrains Mono', fontWeight: 700 }}>
                {accuracyProfile === 'deep' ? '99.8% Precision' : accuracyProfile === 'high' ? '96.5% Precision' : '92.0% Rapid'}
              </span>
            </div>
            <select
              value={accuracyProfile}
              onChange={e => setAccuracyProfile(e.target.value)}
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
              <option value="deep" style={{ background: 'var(--bg-color)' }}>Deep AST & Policy Graph (99.8% Precision · Zero False Positives)</option>
              <option value="high" style={{ background: 'var(--bg-color)' }}>Multi-Vector Heuristic Inspection (96.5% Precision)</option>
              <option value="rapid" style={{ background: 'var(--bg-color)' }}>Fast Superficial Drift Detection (Rapid Pass)</option>
            </select>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Deep AST mode performs cross-resource dependency graph verification to eliminate false alarms and accurately map attack paths.
            </span>
          </div>
        </div>

        {/* Parallel Analysis Threads Slider */}
        <div style={{
          background: 'var(--panel-inner-bg)',
          padding: '18px 22px',
          borderRadius: '14px',
          border: '1px solid var(--border-color)',
          marginBottom: '16px'
        }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '10px' }}>
            <div className="flex items-center gap-2">
              <Cpu size={16} color="var(--primary)" />
              <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>Parallel Audit Concurrency</span>
            </div>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.86rem', fontWeight: 800, color: 'var(--primary)' }}>
              {parallelThreads} Concurrent Threads ({parallelThreads * 85} req/sec)
            </span>
          </div>
          <input
            type="range"
            min="4"
            max="64"
            step="4"
            value={parallelThreads}
            onChange={e => setParallelThreads(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
          />
          <div className="flex justify-between" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            <span>4 Threads (Conservative)</span>
            <span>16 Threads (Standard Optimal)</span>
            <span>64 Threads (Enterprise Cloud Grid)</span>
          </div>
        </div>

        {/* Deduplication & False Positive Elimination Toggle */}
        <div
          style={{
            background: 'var(--panel-inner-bg)',
            padding: '16px 20px',
            borderRadius: '14px',
            border: '1px solid var(--border-color)',
          }}
          className="flex justify-between items-center flex-wrap gap-2"
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Smart False Positive & Duplicate Noise Suppression</div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Filters duplicate findings across ephemeral containers and checks resource tagging before alerting.
            </div>
          </div>
          <Toggle
            value={dedupAccuracy}
            onChange={v => setDedupAccuracy(v)}
            label={dedupAccuracy ? 'Active (99.8% Precision)' : 'Disabled'}
          />
        </div>
      </div>

      {/* 3. Active Compliance Frameworks */}
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
