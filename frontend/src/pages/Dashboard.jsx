import { useState } from 'react';
import { ShieldAlert, Server, AlertTriangle, CheckCircle, Activity, Box, Loader2, ShieldCheck } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const initialChartData = [
  { name: 'Mon', score: 72 },
  { name: 'Tue', score: 75 },
  { name: 'Wed', score: 71 },
  { name: 'Thu', score: 78 },
  { name: 'Fri', score: 82 },
  { name: 'Sat', score: 84 },
  { name: 'Sun', score: 84 },
];

const initialRecommendations = [
  {
    id: 'rec-1',
    title: 'Public S3 Bucket Detected',
    severity: 'critical',
    resource: 'customer-data-prod',
    cloud: 'AWS',
    risk_analysis: 'The S3 Bucket `customer-data-prod` is publicly accessible. Anyone on the internet can read confidential files.',
    impacts: ['Customer data leakage', 'Financial penalties & Compliance violations'],
    fixes: [
      'Disable public access block at account level',
      'Enable default KMS encryption',
      'Restrict bucket policy to VPC only',
    ],
    status: 'open',
  },
  {
    id: 'rec-2',
    title: 'Overprivileged Azure Managed Identity',
    severity: 'high',
    resource: 'app-service-identity-prod',
    cloud: 'Azure',
    risk_analysis: 'Managed Identity has Subscription Owner permissions which allows arbitrary resource modifications.',
    impacts: ['Privilege escalation', 'Unintended deletion of cloud infrastructure'],
    fixes: [
      'Demote to Contributor role on specific resource group',
      'Apply principle of least privilege RBAC permissions',
    ],
    status: 'open',
  },
  {
    id: 'rec-3',
    title: 'Unencrypted GCP Cloud SQL Database',
    severity: 'critical',
    resource: 'user-db-instance-gcp',
    cloud: 'GCP',
    risk_analysis: 'Cloud SQL database instance lacks Customer-Managed Encryption Key (CMEK) protection.',
    impacts: ['Regulatory non-compliance', 'Data compromise if storage disks are exposed'],
    fixes: [
      'Enable Cloud KMS CMEK encryption on instance',
      'Enforce SSL connection requirement',
    ],
    status: 'open',
  },
  {
    id: 'rec-4',
    title: 'Open SSH Port (0.0.0.0/0) on EC2 Instance',
    severity: 'high',
    resource: 'i-09f8231a44c9d',
    cloud: 'AWS',
    risk_analysis: 'Security group sg-0198a allows inbound traffic on TCP port 22 from any IPv4 address.',
    impacts: ['Brute-force SSH attacks', 'Unauthorized remote command execution'],
    fixes: [
      'Update security group rule to restrict port 22 to VPN CIDR',
      'Enable AWS Systems Manager Session Manager',
    ],
    status: 'open',
  },
];

const severityStyles = {
  critical: {
    bg: 'rgba(239, 68, 68, 0.05)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    leftBorder: '4px solid var(--critical)',
    badgeBg: 'rgba(239, 68, 68, 0.1)',
    color: 'var(--critical)',
  },
  high: {
    bg: 'rgba(249, 115, 22, 0.05)',
    border: '1px solid rgba(249, 115, 22, 0.2)',
    leftBorder: '4px solid var(--high)',
    badgeBg: 'rgba(249, 115, 22, 0.1)',
    color: 'var(--high)',
  },
};

export default function Dashboard() {
  const [stats, setStats] = useState({
    securityScore: 84,
    totalResources: 356,
    criticalIssues: 5,
    highIssues: 12,
  });
  const [recommendations, setRecommendations] = useState(initialRecommendations);
  const [fixingId, setFixingId] = useState(null);
  const [chartData, setChartData] = useState(initialChartData);

  const handleApplyFix = async (rec) => {
    setFixingId(rec.id);

    // Simulate remediation delay
    await new Promise(resolve => setTimeout(resolve, 1800));

    // Update recommendation status
    setRecommendations(prev =>
      prev.map(r => r.id === rec.id ? { ...r, status: 'resolved' } : r)
    );

    // Update stats
    setStats(prev => {
      const newStats = { ...prev };
      if (rec.severity === 'critical' && newStats.criticalIssues > 0) {
        newStats.criticalIssues -= 1;
        newStats.securityScore = Math.min(100, newStats.securityScore + 3);
      } else if (rec.severity === 'high' && newStats.highIssues > 0) {
        newStats.highIssues -= 1;
        newStats.securityScore = Math.min(100, newStats.securityScore + 2);
      }
      return newStats;
    });

    // Update chart - bump the latest score
    setChartData(prev => {
      const updated = [...prev];
      const bump = rec.severity === 'critical' ? 3 : 2;
      updated[updated.length - 1] = {
        ...updated[updated.length - 1],
        score: Math.min(100, updated[updated.length - 1].score + bump),
      };
      return updated;
    });

    setFixingId(null);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="glass-panel flex flex-col justify-between" style={{ padding: '24px' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Security Score</span>
            <Activity size={20} color="var(--success)" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--success)', transition: 'all 0.5s ease' }}>{stats.securityScore}<span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>/100</span></div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>+4% since last scan</div>
        </div>

        <div className="glass-panel flex flex-col justify-between" style={{ padding: '24px' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Total Resources</span>
            <Server size={20} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{stats.totalResources}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>Across 3 clouds</div>
        </div>

        <div className="glass-panel flex flex-col justify-between" style={{ padding: '24px' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Critical Issues</span>
            <ShieldAlert size={20} color="var(--critical)" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--critical)', transition: 'all 0.5s ease' }}>{stats.criticalIssues}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--critical)', marginTop: '8px' }}>
            {stats.criticalIssues > 0 ? 'Requires immediate action' : 'All clear!'}
          </div>
        </div>

        <div className="glass-panel flex flex-col justify-between" style={{ padding: '24px' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>High Issues</span>
            <AlertTriangle size={20} color="var(--high)" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--high)', transition: 'all 0.5s ease' }}>{stats.highIssues}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>Schedule for next sprint</div>
        </div>
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: '2fr 1fr' }}>

        {/* Chart Area */}
        <div className="glass-panel" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '24px', fontSize: '1.2rem' }}>Security Posture Trend</h3>
          <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} axisLine={false} tickLine={false} domain={[50, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-main)' }}
                />
                <Area type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Compliance Area */}
        <div className="glass-panel">
          <h3 style={{ marginBottom: '24px', fontSize: '1.2rem' }}>Compliance Check</h3>

          <div className="flex flex-col gap-4">
            {[
              { name: 'CIS', score: 85, color: 'var(--medium)' },
              { name: 'PCI DSS', score: 91, color: 'var(--success)' },
              { name: 'NIST', score: 88, color: 'var(--success)' },
              { name: 'HIPAA', score: 94, color: 'var(--success)' },
            ].map(item => (
              <div key={item.name} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex justify-between items-center" style={{ marginBottom: '12px' }}>
                  <span style={{ fontWeight: 600 }}>{item.name}</span>
                  <span style={{ color: item.color, fontWeight: 600 }}>{item.score}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${item.score}%`, height: '100%', background: item.color, transition: 'width 0.5s ease' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="glass-panel" style={{ marginTop: '8px' }}>
        <h3 className="gradient-text" style={{ marginBottom: '24px', fontSize: '1.4rem' }}>AI Security Recommendations</h3>

        <div className="flex flex-col gap-4">
          {recommendations.map(rec => {
            const sev = severityStyles[rec.severity] || severityStyles.high;
            const isFixing = fixingId === rec.id;
            const isResolved = rec.status === 'resolved';

            return (
              <div
                key={rec.id}
                style={{
                  background: isResolved ? 'rgba(16, 185, 129, 0.05)' : sev.bg,
                  border: isResolved ? '1px solid rgba(16, 185, 129, 0.2)' : sev.border,
                  padding: '24px',
                  borderRadius: '16px',
                  borderLeft: isResolved ? '4px solid var(--success)' : sev.leftBorder,
                  transition: 'all 0.5s ease',
                  opacity: isResolved ? 0.75 : 1,
                }}
              >
                <div className="flex justify-between items-start" style={{ marginBottom: '16px' }}>
                  <div className="flex items-center gap-3">
                    {isResolved
                      ? <ShieldCheck color="var(--success)" size={24} />
                      : <Box color={sev.color} size={24} />
                    }
                    <h4 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-main)', textDecoration: isResolved ? 'line-through' : 'none' }}>
                      {rec.title}
                    </h4>
                    {isResolved && (
                      <span style={{
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: 'var(--success)',
                        padding: '3px 10px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}>
                        RESOLVED
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 500 }}>
                      {rec.cloud}
                    </span>
                    <span style={{ background: isResolved ? 'rgba(16,185,129,0.1)' : sev.badgeBg, color: isResolved ? 'var(--success)' : sev.color, padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>
                      {isResolved ? 'Fixed' : rec.severity.charAt(0).toUpperCase() + rec.severity.slice(1)}
                    </span>
                  </div>
                </div>

                {!isResolved && (
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Risk Analysis</p>
                      <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                        {rec.risk_analysis}
                      </p>
                      <ul style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '12px', paddingLeft: '20px', lineHeight: 1.6 }}>
                        {rec.impacts.map((impact, i) => (
                          <li key={i}>{impact}</li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px' }}>
                      <p style={{ color: 'var(--text-muted)', marginBottom: '12px', fontSize: '0.9rem', fontWeight: 600 }}>Recommended Fix</p>
                      <div className="flex flex-col gap-3">
                        {rec.fixes.map((fix, i) => (
                          <div key={i} className="flex items-center gap-3" style={{ fontSize: '0.9rem' }}>
                            <CheckCircle size={16} color="var(--primary)" /> <span>{fix}</span>
                          </div>
                        ))}
                      </div>
                      <button
                        className="btn btn-primary"
                        disabled={isFixing}
                        onClick={() => handleApplyFix(rec)}
                        style={{
                          marginTop: '16px',
                          width: '100%',
                          opacity: isFixing ? 0.7 : 1,
                          cursor: isFixing ? 'wait' : 'pointer',
                        }}
                      >
                        {isFixing ? (
                          <>
                            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                            Applying Fix...
                          </>
                        ) : (
                          'Apply Fix Automatically'
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
