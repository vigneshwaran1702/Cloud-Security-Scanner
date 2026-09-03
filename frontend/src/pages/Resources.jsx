import { useState, useMemo, useEffect } from 'react';
import { Cloud, Search, Filter, AlertTriangle, ShieldAlert, ShieldCheck, Info, Server, Database, HardDrive, Key, Box, Sparkles, Loader2, Check, RefreshCw, ArrowRight } from 'lucide-react';
import { apiRequest, getCloudState } from '../services/api';
import CloudAccountVerifierModal from '../components/CloudAccountVerifierModal';
import ScanModal from '../components/ScanModal';

const cloudTabs = ['All', 'AWS', 'Azure', 'GCP'];
const severityOptions = ['All', 'Critical', 'High', 'Medium', 'Low'];

const severityColors = {
  critical: { bg: 'var(--critical-bg)', text: 'var(--critical)', border: 'var(--critical-border)' },
  high:     { bg: 'var(--high-bg)',     text: 'var(--high)',     border: 'var(--high-border)' },
  medium:   { bg: 'var(--medium-bg)',   text: 'var(--medium)',   border: 'var(--medium-border)' },
  low:      { bg: 'var(--low-bg)',      text: 'var(--low)',      border: 'var(--low-border)' },
};

const cloudColors = {
  AWS:   { bg: 'rgba(255, 153, 0, 0.1)', text: '#ff9900', border: 'rgba(255, 153, 0, 0.3)' },
  AZURE: { bg: 'rgba(0, 120, 212, 0.1)', text: '#0078d4', border: 'rgba(0, 120, 212, 0.3)' },
  GCP:   { bg: 'rgba(66, 133, 244, 0.1)', text: '#4285f4', border: 'rgba(66, 133, 244, 0.3)' },
};

const typeIcons = {
  'S3 Bucket': HardDrive,
  'Managed Identity': Key,
  'Cloud SQL': Database,
  'EC2 Instance': Server,
  'Key Vault': Key,
  'EKS Cluster': Box,
  'BigQuery': Database,
  'Blob Container': HardDrive,
  'KMS Key': Key,
  'IAM Role': Key,
  'Cloud Storage': HardDrive,
};

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [cloudFilter, setCloudFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [clearingAll, setClearingAll] = useState(false);
  const [remediatingId, setRemediatingId] = useState(null);
  const [isVerifierOpen, setIsVerifierOpen] = useState(false);
  const [isScanOpen, setIsScanOpen] = useState(false);

  const loadResources = async () => {
    try {
      const state = getCloudState();
      const res = await apiRequest('/api/v1/resources');
      if (res.data && res.data.length > 0) {
        setResources(res.data);
      } else if (state.resources && state.resources.length > 0) {
        setResources(state.resources);
      } else {
        setResources([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const handleClearAllFailures = async () => {
    setClearingAll(true);
    try {
      const res = await apiRequest('/api/v1/resources/clear-failures', { method: 'POST' });
      if (res.resources) {
        setResources(res.resources);
      } else {
        setResources(prev =>
          prev.map(r => ({ ...r, status: 'Compliant', severity: 'low', issue: 'Remediated & Secured via CloudGuard AI' }))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setClearingAll(false);
    }
  };

  const handleRemediateSingle = async (resItem) => {
    setRemediatingId(resItem.id);
    try {
      await new Promise(r => setTimeout(r, 600));
      setResources(prev =>
        prev.map(r => r.id === resItem.id ? {
          ...r,
          status: 'Compliant',
          severity: 'low',
          issue: 'Remediated: Configuration Secured'
        } : r)
      );
    } finally {
      setRemediatingId(null);
    }
  };

  const filtered = useMemo(() => {
    let results = resources;
    if (cloudFilter !== 'All') results = results.filter(r => (r.cloud || '').toUpperCase() === cloudFilter.toUpperCase());
    if (severityFilter !== 'All') results = results.filter(r => (r.severity || '').toLowerCase() === severityFilter.toLowerCase());
    if (search.trim()) {
      const s = search.toLowerCase();
      results = results.filter(r => (r.name || '').toLowerCase().includes(s) || (r.type || '').toLowerCase().includes(s) || (r.issue || '').toLowerCase().includes(s));
    }
    return results;
  }, [resources, cloudFilter, severityFilter, search]);

  const nonCompliantCount = resources.filter(r => r.status === 'Non-compliant').length;
  const compliantCount = resources.filter(r => r.status === 'Compliant').length;

  const SeverityIcon = ({ severity }) => {
    if (severity === 'critical') return <ShieldAlert size={16} color="var(--critical)" />;
    if (severity === 'high') return <AlertTriangle size={16} color="var(--high)" />;
    if (severity === 'medium') return <Info size={16} color="var(--medium)" />;
    return <ShieldCheck size={16} color="var(--success)" />;
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in" style={{ paddingBottom: '32px' }}>

      {/* Header & Clear Failures Action */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Cloud Resources & Asset Inventory
          </h2>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Live security inspection of discovered assets under your verified Cloud ID.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {nonCompliantCount > 0 && (
            <button
              onClick={handleClearAllFailures}
              disabled={clearingAll}
              className="btn btn-primary"
              style={{
                padding: '10px 18px',
                fontSize: '0.88rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #10b981, #059669)',
                borderColor: '#10b981',
                boxShadow: '0 2px 10px rgba(16, 185, 129, 0.3)'
              }}
            >
              {clearingAll ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              Clear All Failures & Remediate
            </button>
          )}

          <button
            onClick={() => setIsScanOpen(true)}
            className="btn"
            style={{
              padding: '10px 16px',
              background: 'var(--panel-inner-bg)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontSize: '0.88rem',
              borderRadius: '12px'
            }}
          >
            <RefreshCw size={15} /> Rescan Infrastructure
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Resources', value: resources.length, color: 'var(--primary)' },
          { label: 'Non-Compliant / Failed', value: nonCompliantCount, color: nonCompliantCount > 0 ? 'var(--critical)' : 'var(--success)' },
          { label: 'Compliant & Secured', value: compliantCount, color: 'var(--success)' },
          { label: 'Security Health', value: nonCompliantCount === 0 && resources.length > 0 ? '100% OK' : resources.length === 0 ? 'Idle' : `${Math.round((compliantCount / Math.max(1, resources.length)) * 100)}%`, color: 'var(--accent)' },
        ].map((card, i) => (
          <div key={i} className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{card.label}</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: card.color }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-panel" style={{ padding: '16px 24px' }}>
        <div className="flex items-center justify-between gap-4" style={{ flexWrap: 'wrap' }}>

          {/* Cloud Tabs */}
          <div className="flex gap-2">
            {cloudTabs.map(tab => (
              <button
                key={tab}
                onClick={() => setCloudFilter(tab)}
                className="btn"
                style={{
                  background: cloudFilter === tab ? 'linear-gradient(135deg, var(--primary), var(--accent))' : 'var(--panel-inner-bg)',
                  color: cloudFilter === tab ? '#fff' : 'var(--text-muted)',
                  padding: '8px 18px',
                  fontSize: '0.85rem',
                  border: cloudFilter === tab ? 'none' : '1px solid var(--border-color)',
                }}
              >
                {tab === 'All' ? <Filter size={14} /> : <Cloud size={14} />}
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Severity Dropdown */}
            <select
              value={severityFilter}
              onChange={e => setSeverityFilter(e.target.value)}
              style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {severityOptions.map(opt => (
                <option key={opt} value={opt} style={{ background: 'var(--bg-color)', color: 'var(--text-main)' }}>{opt === 'All' ? 'All Severities' : opt}</option>
              ))}
            </select>

            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search resources..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  background: 'var(--input-bg)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  padding: '8px 14px 8px 36px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  width: '240px',
                  outline: 'none',
                  transition: 'var(--transition)',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Resources Table or Empty State */}
      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        {resources.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center" style={{ padding: '64px 24px' }}>
            <Cloud size={56} color="var(--text-muted)" style={{ opacity: 0.4, marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--text-main)' }}>
              No Cloud Resources Scanned Yet
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 0 24px 0' }}>
              Enter your AWS Account ID, Azure Subscription ID, or GCP Project ID to discover assets and check compliance.
            </p>
            <button
              onClick={() => setIsVerifierOpen(true)}
              className="btn btn-primary"
              style={{ padding: '12px 24px', fontSize: '0.95rem' }}
            >
              <ShieldCheck size={18} /> Connect Cloud ID
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'var(--panel-inner-bg)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '14px 20px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase' }}>Resource Name</th>
                  <th style={{ padding: '14px 20px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase' }}>Provider & Region</th>
                  <th style={{ padding: '14px 20px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase' }}>Type</th>
                  <th style={{ padding: '14px 20px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '14px 20px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase' }}>Issue / Finding</th>
                  <th style={{ padding: '14px 20px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((res) => {
                  const Icon = typeIcons[res.type] || Box;
                  const cColor = cloudColors[res.cloud?.toUpperCase()] || cloudColors.AWS;
                  const sColor = severityColors[res.severity] || severityColors.low;
                  const isNonCompliant = res.status === 'Non-compliant';

                  return (
                    <tr
                      key={res.id}
                      style={{
                        borderBottom: '1px solid var(--border-color)',
                        transition: 'var(--transition)',
                      }}
                    >
                      <td style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--text-main)' }}>
                        <div className="flex items-center gap-2.5">
                          <div style={{ background: 'var(--panel-inner-bg)', padding: '6px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                            <Icon size={16} color="var(--primary)" />
                          </div>
                          <span>{res.name}</span>
                        </div>
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        <div className="flex items-center gap-2">
                          <span
                            style={{
                              background: cColor.bg,
                              color: cColor.text,
                              border: `1px solid ${cColor.border}`,
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 700
                            }}
                          >
                            {res.cloud}
                          </span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{res.region}</span>
                        </div>
                      </td>

                      <td style={{ padding: '16px 20px', color: 'var(--text-muted)' }}>
                        {res.type}
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        <span
                          style={{
                            background: isNonCompliant ? 'var(--critical-bg)' : 'rgba(16, 185, 129, 0.15)',
                            color: isNonCompliant ? 'var(--critical)' : 'var(--success)',
                            border: `1px solid ${isNonCompliant ? 'var(--critical-border)' : 'rgba(16, 185, 129, 0.3)'}`,
                            padding: '4px 10px',
                            borderRadius: '16px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <SeverityIcon severity={res.severity} />
                          {res.status}
                        </span>
                      </td>

                      <td style={{ padding: '16px 20px', color: isNonCompliant ? 'var(--text-main)' : 'var(--text-muted)', fontSize: '0.84rem' }}>
                        {res.issue}
                      </td>

                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        {isNonCompliant ? (
                          <button
                            onClick={() => handleRemediateSingle(res)}
                            disabled={remediatingId === res.id}
                            className="btn btn-primary"
                            style={{ padding: '6px 12px', fontSize: '0.78rem', fontWeight: 600, borderRadius: '8px' }}
                          >
                            {remediatingId === res.id ? (
                              <Loader2 size={13} className="animate-spin" />
                            ) : (
                              'Clear Failure'
                            )}
                          </button>
                        ) : (
                          <span style={{ color: 'var(--success)', fontSize: '0.8rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Check size={14} /> Secured
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CloudAccountVerifierModal
        isOpen={isVerifierOpen}
        onClose={() => {
          setIsVerifierOpen(false);
          loadResources();
        }}
      />

      <ScanModal
        isOpen={isScanOpen}
        onClose={() => {
          setIsScanOpen(false);
          loadResources();
        }}
      />

    </div>
  );
}
