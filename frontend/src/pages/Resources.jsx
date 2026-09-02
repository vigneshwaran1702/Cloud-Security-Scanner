import { useState, useMemo } from 'react';
import { Cloud, Search, Filter, AlertTriangle, ShieldAlert, ShieldCheck, Info, Server, Database, HardDrive, Key, Box } from 'lucide-react';

const allResources = [
  { id: 'res-101', name: 'customer-data-prod', type: 'S3 Bucket', cloud: 'AWS', region: 'us-east-1', severity: 'critical', status: 'Non-compliant', issue: 'Public Read Access Enabled' },
  { id: 'res-102', name: 'app-service-identity-prod', type: 'Managed Identity', cloud: 'Azure', region: 'eastus2', severity: 'high', status: 'Non-compliant', issue: 'Subscription Owner Role Assigned' },
  { id: 'res-103', name: 'user-db-instance-gcp', type: 'Cloud SQL', cloud: 'GCP', region: 'us-central1', severity: 'critical', status: 'Non-compliant', issue: 'Default Encryption Key Used' },
  { id: 'res-104', name: 'i-09f8231a44c9d', type: 'EC2 Instance', cloud: 'AWS', region: 'us-west-2', severity: 'high', status: 'Non-compliant', issue: 'SSH Port open to 0.0.0.0/0' },
  { id: 'res-105', name: 'payment-vault-kv', type: 'Key Vault', cloud: 'Azure', region: 'westeurope', severity: 'medium', status: 'Compliant', issue: 'Purge Protection Enabled' },
  { id: 'res-106', name: 'prod-k8s-cluster', type: 'EKS Cluster', cloud: 'AWS', region: 'us-east-1', severity: 'low', status: 'Compliant', issue: 'Private Endpoint Active' },
  { id: 'res-107', name: 'analytics-bq-dataset', type: 'BigQuery', cloud: 'GCP', region: 'us-multiregion', severity: 'medium', status: 'Non-compliant', issue: 'IAM External Sharing Enabled' },
  { id: 'res-108', name: 'logs-archive-storage', type: 'Blob Container', cloud: 'Azure', region: 'eastus', severity: 'low', status: 'Compliant', issue: 'TLS 1.2 Enforced' },
];

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
  Azure: { bg: 'rgba(0, 120, 212, 0.1)', text: '#0078d4', border: 'rgba(0, 120, 212, 0.3)' },
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
};

export default function Resources() {
  const [cloudFilter, setCloudFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let results = allResources;
    if (cloudFilter !== 'All') results = results.filter(r => r.cloud === cloudFilter);
    if (severityFilter !== 'All') results = results.filter(r => r.severity === severityFilter.toLowerCase());
    if (search.trim()) {
      const s = search.toLowerCase();
      results = results.filter(r => r.name.toLowerCase().includes(s) || r.type.toLowerCase().includes(s) || r.issue.toLowerCase().includes(s));
    }
    return results;
  }, [cloudFilter, severityFilter, search]);

  const SeverityIcon = ({ severity }) => {
    if (severity === 'critical') return <ShieldAlert size={16} color="var(--critical)" />;
    if (severity === 'high') return <AlertTriangle size={16} color="var(--high)" />;
    if (severity === 'medium') return <Info size={16} color="var(--medium)" />;
    return <ShieldCheck size={16} color="var(--low)" />;
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Resources', value: allResources.length, color: 'var(--primary)' },
          { label: 'Non-Compliant', value: allResources.filter(r => r.status === 'Non-compliant').length, color: 'var(--critical)' },
          { label: 'Compliant', value: allResources.filter(r => r.status === 'Compliant').length, color: 'var(--success)' },
          { label: 'Cloud Providers', value: 3, color: 'var(--accent)' },
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

      {/* Resources Table */}
      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--panel-inner-bg)' }}>
              {['Resource', 'Type', 'Cloud', 'Region', 'Severity', 'Status', 'Issue'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '16px 20px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                  No resources match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((res, i) => {
                const TypeIcon = typeIcons[res.type] || Server;
                const sc = severityColors[res.severity];
                const cc = cloudColors[res.cloud];
                return (
                  <tr
                    key={res.id}
                    style={{
                      borderBottom: i < filtered.length - 1 ? '1px solid var(--border-color)' : 'none',
                      transition: 'var(--transition)',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--table-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 20px' }}>
                      <div className="flex items-center gap-3">
                        <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--panel-inner-bg)', border: '1px solid var(--border-color)' }}>
                          <TypeIcon size={16} color="var(--primary)" />
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>{res.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{res.type}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ background: cc.bg, color: cc.text, border: `1px solid ${cc.border}`, padding: '4px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600 }}>
                        {res.cloud}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{res.region}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span className="flex items-center gap-2" style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`, padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600, display: 'inline-flex' }}>
                        <SeverityIcon severity={res.severity} />
                        {res.severity.charAt(0).toUpperCase() + res.severity.slice(1)}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        color: res.status === 'Compliant' ? 'var(--success)' : 'var(--critical)',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                      }}>
                        {res.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '220px' }}>{res.issue}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer info */}
      <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', padding: '8px 0' }}>
        Showing {filtered.length} of {allResources.length} resources
      </div>
    </div>
  );
}
