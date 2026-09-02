import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Server, AlertTriangle, CheckCircle, Activity, Box, Loader2, ShieldCheck, Zap, Sparkles, Bot, ArrowRight, Lock, TrendingUp, HelpCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSubscription } from '../context/SubscriptionContext';
import SubscriptionCheckoutModal from '../components/SubscriptionCheckoutModal';

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
    risk_contribution: 38,
    blast_radius: 'Account-Wide Data Exposure',
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
    risk_contribution: 29,
    blast_radius: 'Subscription-Level Privilege Escalation',
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
    risk_contribution: 21,
    blast_radius: 'Data at Rest Non-Compliance',
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
    risk_contribution: 12,
    blast_radius: 'Direct Remote Ingress',
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
    bg: 'rgba(239, 68, 68, 0.06)',
    border: '1px solid rgba(239, 68, 68, 0.25)',
    leftBorder: '4px solid var(--critical)',
    badgeBg: 'rgba(239, 68, 68, 0.12)',
    color: 'var(--critical)',
  },
  high: {
    bg: 'rgba(249, 115, 22, 0.06)',
    border: '1px solid rgba(249, 115, 22, 0.25)',
    leftBorder: '4px solid var(--high)',
    badgeBg: 'rgba(249, 115, 22, 0.12)',
    color: 'var(--high)',
  },
};

export default function Dashboard() {
  const { isPro } = useSubscription();
  const [stats, setStats] = useState({
    securityScore: 84,
    totalResources: 356,
    criticalIssues: 5,
    highIssues: 12,
  });
  const [recommendations, setRecommendations] = useState(initialRecommendations);
  const [fixingId, setFixingId] = useState(null);
  const [chartData, setChartData] = useState(initialChartData);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [safeRemediationToast, setSafeRemediationToast] = useState(null);

  const handleApplyFix = async (rec) => {
    setFixingId(rec.id);

    // Simulate safe production auto-remediation delay
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
    setSafeRemediationToast(`✓ Safe Production fix successfully applied to ${rec.resource} with zero downtime!`);
    setTimeout(() => setSafeRemediationToast(null), 4500);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Toast Notification */}
      {safeRemediationToast && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.95), rgba(5, 150, 105, 0.95))',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} />
            <span>{safeRemediationToast}</span>
          </div>
          <button
            onClick={() => setSafeRemediationToast(null)}
            style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.1rem' }}
          >
            ×
          </button>
        </div>
      )}

      {/* Pro Callout Banner if not subscribed */}
      {!isPro && (
        <div
          className="glass-panel flex justify-between items-center"
          style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(225, 29, 72, 0.1))',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            padding: '16px 24px',
            borderRadius: '20px',
          }}
        >
          <div className="flex items-center gap-4">
            <div
              style={{
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                padding: '10px',
                borderRadius: '12px',
                boxShadow: '0 4px 14px rgba(220, 38, 38, 0.35)',
              }}
            >
              <Sparkles size={22} color="white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--text-main)' }}>
                  Upgrade to Pro Cloud Defender for <span style={{ color: 'var(--primary)', fontWeight: 800 }}>$39 / mo</span>
                </h4>
                <span style={{ fontSize: '0.7rem', background: 'var(--badge-primary-bg)', color: 'var(--badge-primary-color)', border: '1px solid var(--badge-primary-border)', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
                  PRO FEATURES
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Unlock Safe Production Auto-Fixes, 24/7 Instant AI SecOps Help, and Risk Contribution matrix.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="btn btn-primary"
              style={{
                padding: '9px 18px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Zap size={16} /> Upgrade for $39
            </button>
            <Link
              to="/subscription"
              style={{
                color: 'var(--primary)',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              View Plan <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}

      {/* Top Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="glass-panel flex flex-col justify-between" style={{ padding: '24px' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Security Score</span>
            <Activity size={20} color="var(--success)" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--success)', transition: 'all 0.5s ease' }}>
            {stats.securityScore}<span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>/100</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>+4% since last scan</div>
        </div>

        <div className="glass-panel flex flex-col justify-between" style={{ padding: '24px' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Total Resources</span>
            <Server size={20} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-main)' }}>{stats.totalResources}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>Across 3 clouds</div>
        </div>

        <div className="glass-panel flex flex-col justify-between" style={{ padding: '24px' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Critical Issues</span>
            <ShieldAlert size={20} color="var(--critical)" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--critical)', transition: 'all 0.5s ease' }}>
            {stats.criticalIssues}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--critical)', marginTop: '8px' }}>
            {stats.criticalIssues > 0 ? 'Requires immediate action' : 'All clear!'}
          </div>
        </div>

        <div className="glass-panel flex flex-col justify-between" style={{ padding: '24px' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>High Issues</span>
            <AlertTriangle size={20} color="var(--high)" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--high)', transition: 'all 0.5s ease' }}>
            {stats.highIssues}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>Schedule for safe auto-fix</div>
        </div>
      </div>

      {/* Middle Grid: Trend Chart & Risk Contribution Matrix */}
      <div className="grid gap-6" style={{ gridTemplateColumns: '1.8fr 1.2fr' }}>
        {/* Chart Area */}
        <div className="glass-panel" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Security Posture Trend</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Continuous 7-Day Velocity</span>
          </div>
          <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} axisLine={false} tickLine={false} domain={[50, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--panel-bg-solid)', border: '1px solid var(--border-color)', borderRadius: '10px', boxShadow: 'var(--glass-shadow)', color: 'var(--text-main)' }}
                  itemStyle={{ color: 'var(--text-main)' }}
                />
                <Area type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Contribution Matrix Widget */}
        <div className="glass-panel" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
            <div className="flex items-center gap-2">
              <Activity size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Risk Contribution Matrix</h3>
            </div>
            <Link
              to="/subscription"
              style={{
                fontSize: '0.72rem',
                color: isPro ? 'var(--success)' : 'var(--primary)',
                textDecoration: 'none',
                fontWeight: 700,
                background: isPro ? 'rgba(16, 185, 129, 0.15)' : 'var(--badge-primary-bg)',
                border: isPro ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--badge-primary-border)',
                padding: '3px 8px',
                borderRadius: '8px',
              }}
            >
              {isPro ? 'PRO UNLOCKED' : 'PRO $39'}
            </Link>
          </div>

          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Relative blast-radius and attack surface contribution by cloud vulnerability:
          </p>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
            {recommendations.map(rec => {
              const isResolved = rec.status === 'resolved';
              const weight = isResolved ? 0 : rec.risk_contribution || 20;

              return (
                <div
                  key={rec.id}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'var(--panel-inner-bg)',
                    border: '1px solid var(--border-color)',
                    opacity: isResolved ? 0.5 : 1,
                  }}
                >
                  <div className="flex justify-between items-center" style={{ fontSize: '0.8rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                      {rec.resource}
                    </span>
                    <span style={{ fontWeight: 700, color: isResolved ? 'var(--success)' : (weight > 30 ? 'var(--critical)' : 'var(--high)') }}>
                      {isResolved ? '0% (Neutralized)' : `${weight}% contribution`}
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '5px', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${weight}%`,
                        height: '100%',
                        background: isResolved ? 'var(--success)' : (weight > 30 ? 'var(--critical)' : 'var(--high)'),
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {rec.blast_radius || rec.title} ({rec.cloud})
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Security Recommendations */}
      <div className="glass-panel" style={{ marginTop: '8px' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: '24px' }}>
          <div>
            <h3 className="gradient-text" style={{ fontSize: '1.4rem', margin: 0 }}>AI Security Recommendations</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
              Autonomous threat mitigation with Safe Production zero-downtime rollback protection.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              style={{
                fontSize: '0.78rem',
                padding: '4px 10px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: 'var(--success)',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <ShieldCheck size={14} /> Safe Production Guardrails Active
            </span>
          </div>
        </div>

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
                        RESOLVED (ZERO DOWNTIME)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span style={{ background: 'var(--panel-inner-bg)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 500 }}>
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
                      <p style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Risk Analysis & Blast Radius</p>
                      <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                        {rec.risk_analysis}
                      </p>
                      <ul style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '12px', paddingLeft: '20px', lineHeight: 1.6 }}>
                        {rec.impacts.map((impact, i) => (
                          <li key={i}>{impact}</li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ background: 'var(--panel-inner-bg)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '12px' }}>
                      <div className="flex justify-between items-center" style={{ marginBottom: '12px' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>
                          Safe Production Remediation
                        </p>
                        <span style={{ fontSize: '0.72rem', color: 'var(--success)', fontWeight: 600 }}>
                          🛡️ Rollback Protected
                        </span>
                      </div>

                      <div className="flex flex-col gap-3">
                        {rec.fixes.map((fix, i) => (
                          <div key={i} className="flex items-center gap-3" style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
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
                          fontWeight: 700,
                        }}
                      >
                        {isFixing ? (
                          <>
                            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                            Applying Safe Production Fix (Dry-run & Verify)...
                          </>
                        ) : (
                          'Safe Production Auto-Remediate'
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

      {/* Subscription Checkout Modal */}
      <SubscriptionCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedTierId="pro"
        billingCycle="monthly"
      />
    </div>
  );
}
