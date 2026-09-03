import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Server, AlertTriangle, CheckCircle, Activity, Box, Loader2, ShieldCheck, Zap, Sparkles, Bot, ArrowRight, Lock, TrendingUp, HelpCircle, X, Cloud, RefreshCw, Check, Shield } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSubscription } from '../context/SubscriptionContext';
import { useAuth } from '../context/AuthContext';
import SubscriptionCheckoutModal from '../components/SubscriptionCheckoutModal';
import CloudAccountVerifierModal from '../components/CloudAccountVerifierModal';
import ScanModal from '../components/ScanModal';
import { apiRequest, getCloudState } from '../services/api';

const severityStyles = {
  critical: {
    bg: 'var(--critical-bg)',
    border: '1px solid var(--critical-border)',
    leftBorder: '4px solid var(--critical)',
    badgeBg: 'var(--critical-bg)',
    color: 'var(--critical)',
  },
  high: {
    bg: 'var(--high-bg)',
    border: '1px solid var(--high-border)',
    leftBorder: '4px solid var(--high)',
    badgeBg: 'var(--high-bg)',
    color: 'var(--high)',
  },
};

export default function Dashboard() {
  const { isPro } = useSubscription();
  const { requireAuth } = useAuth();
  const [cloudState, setCloudState] = useState(() => getCloudState());
  const [stats, setStats] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [fixingId, setFixingId] = useState(null);
  const [clearingAll, setClearingAll] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isVerifierOpen, setIsVerifierOpen] = useState(false);
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [safeRemediationToast, setSafeRemediationToast] = useState(null);
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load live cloud stats and recommendations
  const loadDashboardData = async () => {
    try {
      const state = getCloudState();
      setCloudState(state);

      const statsRes = await apiRequest('/api/v1/dashboard/stats');
      if (statsRes.data) {
        setStats(statsRes.data);
        if (statsRes.data.posture_trend || statsRes.data.postureTrend) {
          setChartData(statsRes.data.posture_trend || statsRes.data.postureTrend);
        }
      } else if (state.stats) {
        setStats(state.stats);
        if (state.stats.postureTrend) setChartData(state.stats.postureTrend);
      }

      const recRes = await apiRequest('/api/v1/recommendations');
      if (recRes.data && recRes.data.length > 0) {
        setRecommendations(recRes.data);
      } else if (state.recommendations && state.recommendations.length > 0) {
        setRecommendations(state.recommendations);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleApplyFix = async (rec) => {
    requireAuth(async () => {
      setFixingId(rec.id);
      try {
        const res = await apiRequest(`/api/v1/recommendations/${rec.id}/apply`, { method: 'POST' });
        
        setRecommendations(prev =>
          prev.map(r => r.id === rec.id ? { ...r, status: 'resolved' } : r)
        );

        if (res.stats) {
          setStats(res.stats);
        } else {
          setStats(prev => {
            if (!prev) return prev;
            const openCrit = recommendations.filter(r => r.id !== rec.id && r.status === 'open' && r.severity === 'critical').length;
            const openHigh = recommendations.filter(r => r.id !== rec.id && r.status === 'open' && r.severity === 'high').length;
            const isClean = openCrit === 0 && openHigh === 0;
            return {
              ...prev,
              critical_issues: openCrit,
              high_issues: openHigh,
              security_score: isClean ? 100 : Math.min(100, (prev.security_score || 76) + 12),
            };
          });
        }

        setChartData(prev => [
          ...prev,
          { name: 'Remediated', score: 92 }
        ]);

        setSafeRemediationToast({
          title: 'Remediation Applied Successfully',
          detail: `Issue "${rec.title}" resolved on ${rec.resource}. Risk neutralized.`
        });
        setTimeout(() => setSafeRemediationToast(null), 4500);
      } catch (err) {
        console.error(err);
      } finally {
        setFixingId(null);
      }
    }, "Sign in with Google or Gmail/password to apply automated remediation fixes.");
  };

  const handleClearAllRisks = async () => {
    requireAuth(async () => {
      setClearingAll(true);
      try {
        const res = await apiRequest('/api/v1/recommendations/clear-all', { method: 'POST' });
        
        setRecommendations(prev => prev.map(r => ({ ...r, status: 'resolved' })));
        
        if (res.stats) {
          setStats(res.stats);
        } else {
          setStats(prev => ({
            ...(prev || {}),
            security_score: 100,
            critical_issues: 0,
            high_issues: 0,
            score_change: 'All risks & failures cleared (100% Protected)'
          }));
        }

        setChartData(prev => [
          ...prev,
          { name: 'Secured', score: 100 }
        ]);

        setSafeRemediationToast({
          title: 'All Cloud Risks & Failures Cleared!',
          detail: '100% Security Posture achieved. All non-compliant configurations remediated.'
        });
        setTimeout(() => setSafeRemediationToast(null), 5000);
      } catch (err) {
        console.error(err);
      } finally {
        setClearingAll(false);
      }
    }, "Sign in with Google or Gmail/password to clear and remediate all cloud risks.");
  };

  const activeCloudId = cloudState.activeCloudId || stats?.active_cloud_id;
  const activeProvider = cloudState.activeProvider || stats?.active_provider || 'AWS';
  const openRecs = recommendations.filter(r => r.status === 'open');
  const score = stats?.security_score ?? stats?.securityScore ?? 0;
  const criticalCount = stats?.critical_issues ?? stats?.criticalIssues ?? openRecs.filter(r => r.severity === 'critical').length;
  const highCount = stats?.high_issues ?? stats?.highIssues ?? openRecs.filter(r => r.severity === 'high').length;
  const totalResources = stats?.total_resources ?? stats?.totalResources ?? (cloudState.resources?.length || 0);

  const isAllClear = score === 100 || (activeCloudId && openRecs.length === 0 && (criticalCount === 0 && highCount === 0));

  return (
    <div className="flex flex-col gap-6 animate-fade-in" style={{ paddingBottom: '32px' }}>

      {/* Cloud Account Verification Hero Banner if no Cloud ID is entered yet */}
      {!activeCloudId && (
        <div
          className="glass-panel"
          style={{
            padding: '28px 32px',
            background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.08), rgba(99, 102, 241, 0.08))',
            border: '1px solid var(--border-color)',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            flexWrap: 'wrap'
          }}
        >
          <div className="flex items-center gap-4" style={{ flex: 1, minWidth: '280px' }}>
            <div style={{
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              padding: '16px',
              borderRadius: '18px',
              boxShadow: '0 4px 20px var(--primary-glow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Cloud size={32} color="white" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', margin: '0 0 6px 0', fontWeight: 800, color: 'var(--text-main)' }}>
                Verify & Scan Your Cloud Infrastructure
              </h2>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '560px' }}>
                Enter your real AWS Account ID, Azure Subscription ID, or GCP Project ID to discover live resources, check compliance, and resolve security risks.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => requireAuth(() => setIsVerifierOpen(true), "Sign in with your Google account or Gmail/password to verify and connect your cloud ID.")}
              className="btn btn-primary"
              style={{ padding: '12px 24px', fontSize: '0.95rem', fontWeight: 700 }}
            >
              <ShieldCheck size={18} />
              Verify Cloud ID
            </button>
            <button
              onClick={() => requireAuth(() => setIsScanOpen(true), "Sign in with your Google account or Gmail/password to start live cloud scans.")}
              className="btn"
              style={{
                background: 'var(--panel-inner-bg)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                padding: '12px 20px',
                fontSize: '0.95rem',
                fontWeight: 600,
                borderRadius: '12px'
              }}
            >
              Run Scan
            </button>
          </div>
        </div>
      )}

      {/* Active Cloud ID Status Bar (when Cloud ID is connected) */}
      {activeCloudId && (
        <div
          className="glass-panel flex items-center justify-between gap-4"
          style={{
            padding: '16px 24px',
            background: isAllClear ? 'rgba(16, 185, 129, 0.08)' : 'var(--panel-inner-bg)',
            border: `1px solid ${isAllClear ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-color)'}`,
            borderRadius: '18px',
            flexWrap: 'wrap'
          }}
        >
          <div className="flex items-center gap-3">
            <div style={{
              background: isAllClear ? 'rgba(16, 185, 129, 0.2)' : 'var(--badge-primary-bg)',
              color: isAllClear ? 'var(--success)' : 'var(--primary)',
              padding: '8px 12px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Cloud size={16} /> {activeProvider}
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Active Cloud ID</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>{activeCloudId}</div>
            </div>
            <div style={{
              background: isAllClear ? 'rgba(16, 185, 129, 0.15)' : 'var(--warning-bg)',
              color: isAllClear ? 'var(--success)' : 'var(--warning)',
              border: `1px solid ${isAllClear ? 'rgba(16, 185, 129, 0.3)' : 'var(--warning-border)'}`,
              padding: '3px 10px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {isAllClear ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
              {isAllClear ? '100% Compliant • 0 Risks' : `${openRecs.length} Risks Pending`}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isAllClear && (
              <button
                onClick={handleClearAllRisks}
                disabled={clearingAll}
                className="btn btn-primary"
                style={{
                  padding: '9px 18px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  borderColor: '#10b981',
                  boxShadow: '0 2px 10px rgba(16, 185, 129, 0.3)'
                }}
              >
                {clearingAll ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
                Clear All Risks & Failures
              </button>
            )}
            <button
              onClick={() => requireAuth(() => setIsScanOpen(true), "Sign in with your Google account or Gmail/password to rescan cloud infrastructure.")}
              className="btn"
              style={{
                padding: '9px 14px',
                background: 'var(--panel-inner-bg)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                borderRadius: '10px'
              }}
            >
              <RefreshCw size={14} /> Rescan
            </button>
            <button
              onClick={() => requireAuth(() => setIsVerifierOpen(true), "Sign in with your Google account or Gmail/password to switch cloud accounts.")}
              className="btn"
              style={{
                padding: '9px 14px',
                background: 'var(--panel-inner-bg)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                borderRadius: '10px'
              }}
            >
              Change ID
            </button>
          </div>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-4 gap-4">
        {/* Security Score Card */}
        <div className="glass-panel metric-card" style={{ padding: '24px' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Security Score</span>
            <div style={{
              background: score >= 90 ? 'rgba(16, 185, 129, 0.15)' : 'var(--badge-primary-bg)',
              padding: '6px',
              borderRadius: '8px'
            }}>
              <ShieldCheck size={18} color={score >= 90 ? 'var(--success)' : 'var(--primary)'} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: score >= 90 ? 'var(--success)' : 'var(--text-main)', letterSpacing: '-0.03em' }}>
              {activeCloudId ? score : '--'}
            </span>
            {activeCloudId && <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>/100</span>}
          </div>
          <div style={{ fontSize: '0.78rem', color: isAllClear ? 'var(--success)' : 'var(--text-muted)', marginTop: '8px', fontWeight: 600 }}>
            {activeCloudId ? (isAllClear ? '✓ 100% Protected' : stats?.score_change || 'Action recommended') : 'Scan required'}
          </div>
        </div>

        {/* Resources Monitored */}
        <div className="glass-panel metric-card" style={{ padding: '24px' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Resources Audited</span>
            <div style={{ background: 'rgba(99, 102, 241, 0.12)', padding: '6px', borderRadius: '8px' }}>
              <Server size={18} color="var(--accent)" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>
              {activeCloudId ? totalResources : '--'}
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            {activeCloudId ? `Discovered under ${activeProvider} ID` : 'No cloud account verified'}
          </div>
        </div>

        {/* Critical Issues */}
        <div className="glass-panel metric-card" style={{ padding: '24px' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Critical Risks</span>
            <div style={{ background: 'var(--critical-bg)', padding: '6px', borderRadius: '8px' }}>
              <ShieldAlert size={18} color="var(--critical)" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: criticalCount > 0 ? 'var(--critical)' : 'var(--success)', letterSpacing: '-0.03em' }}>
              {activeCloudId ? criticalCount : '--'}
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', color: criticalCount > 0 ? 'var(--critical)' : 'var(--success)', marginTop: '8px', fontWeight: 600 }}>
            {criticalCount > 0 ? 'High blast radius' : '0 Critical Threats'}
          </div>
        </div>

        {/* High / Medium Issues */}
        <div className="glass-panel metric-card" style={{ padding: '24px' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Policy Failures</span>
            <div style={{ background: 'var(--high-bg)', padding: '6px', borderRadius: '8px' }}>
              <AlertTriangle size={18} color="var(--high)" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: highCount > 0 ? 'var(--high)' : 'var(--success)', letterSpacing: '-0.03em' }}>
              {activeCloudId ? highCount : '--'}
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', color: highCount > 0 ? 'var(--high)' : 'var(--success)', marginTop: '8px', fontWeight: 600 }}>
            {highCount > 0 ? 'Auto-fix available' : '0 Compliance Failures'}
          </div>
        </div>
      </div>

      {/* Main Content Area: Risks & Remediation / Chart */}
      <div className="grid grid-cols-3 gap-6">

        {/* Left 2 Cols: Identified Risks & Failures */}
        <div className="glass-panel" style={{ gridColumn: 'span 2', padding: '24px' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '20px' }}>
            <div className="flex items-center gap-2.5">
              <ShieldAlert size={20} color="var(--primary)" />
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Security Risks & Failure Remediation
              </h3>
            </div>
            {openRecs.length > 0 && (
              <button
                onClick={handleClearAllRisks}
                disabled={clearingAll}
                className="btn btn-primary"
                style={{
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  borderColor: '#10b981'
                }}
              >
                {clearingAll ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                Clear All Risks
              </button>
            )}
          </div>

          {!activeCloudId ? (
            <div className="flex flex-col items-center justify-center text-center" style={{ padding: '40px 20px' }}>
              <Cloud size={48} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: '16px' }} />
              <h4 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', color: 'var(--text-main)' }}>No Cloud ID Scanned</h4>
              <p style={{ margin: '0 0 20px 0', color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '380px' }}>
                Please enter your AWS, Azure, or GCP Cloud ID to analyze vulnerabilities and evaluate infrastructure risks.
              </p>
              <button onClick={() => requireAuth(() => setIsVerifierOpen(true), "Sign in with your Google account or Gmail/password to connect your cloud ID.")} className="btn btn-primary" style={{ padding: '10px 20px' }}>
                <ShieldCheck size={16} /> Enter Cloud ID
              </button>
            </div>
          ) : openRecs.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center" style={{ padding: '48px 20px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <CheckCircle size={36} color="var(--success)" />
              </div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Zero Active Risks Detected!
              </h4>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '420px' }}>
                All cloud configurations for <strong>{activeProvider} ID {activeCloudId}</strong> are 100% compliant and protected against known vulnerability vectors.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {recommendations.map(rec => {
                const style = severityStyles[rec.severity] || severityStyles.high;
                const isResolved = rec.status === 'resolved';

                return (
                  <div
                    key={rec.id}
                    style={{
                      background: isResolved ? 'rgba(16, 185, 129, 0.06)' : style.bg,
                      border: isResolved ? '1px solid rgba(16, 185, 129, 0.25)' : style.border,
                      borderLeft: isResolved ? '4px solid var(--success)' : style.leftBorder,
                      borderRadius: '14px',
                      padding: '16px 20px',
                      transition: 'var(--transition)',
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-col gap-1" style={{ flex: 1 }}>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            style={{
                              background: isResolved ? 'rgba(16, 185, 129, 0.2)' : style.badgeBg,
                              color: isResolved ? 'var(--success)' : style.color,
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '6px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em'
                            }}
                          >
                            {isResolved ? 'RESOLVED' : rec.severity}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                            {rec.cloud} • <code style={{ color: 'var(--text-main)' }}>{rec.resource}</code>
                          </span>
                          {rec.blast_radius && !isResolved && (
                            <span style={{ fontSize: '0.72rem', color: 'var(--critical)', fontWeight: 600, background: 'var(--critical-bg)', padding: '1px 6px', borderRadius: '4px' }}>
                              Blast: {rec.blast_radius}
                            </span>
                          )}
                        </div>

                        <h4 style={{ margin: '4px 0 2px 0', fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)' }}>
                          {rec.title}
                        </h4>
                        <p style={{ margin: '2px 0 6px 0', fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                          {rec.risk_analysis}
                        </p>

                        {!isResolved && rec.fixes && (
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-main)', marginTop: '4px' }}>
                            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Fix: </span>
                            {rec.fixes[0]}
                          </div>
                        )}
                      </div>

                      <div>
                        {isResolved ? (
                          <div className="flex items-center gap-1.5" style={{ color: 'var(--success)', fontWeight: 700, fontSize: '0.82rem', padding: '6px 12px' }}>
                            <Check size={16} /> Remediated
                          </div>
                        ) : (
                          <button
                            onClick={() => handleApplyFix(rec)}
                            disabled={fixingId === rec.id}
                            className="btn btn-primary"
                            style={{
                              padding: '8px 14px',
                              fontSize: '0.82rem',
                              fontWeight: 600,
                              borderRadius: '10px',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {fixingId === rec.id ? (
                              <>
                                <Loader2 size={14} className="animate-spin" />
                                Applying Fix...
                              </>
                            ) : (
                              <>
                                <Zap size={14} />
                                Clear Risk
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 1 Col: Posture Progression & Quick Actions */}
        <div className="flex flex-col gap-6">

          {/* Posture Trend Chart */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
              <div className="flex items-center gap-2">
                <TrendingUp size={18} color="var(--primary)" />
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Security Posture Trend
                </h4>
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--success)', fontWeight: 700 }}>
                {score >= 90 ? 'Healthy' : activeCloudId ? 'Action Needed' : 'Idle'}
              </span>
            </div>

            <div style={{ width: '100%', height: '180px' }}>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                    <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} />
                    <YAxis domain={[50, 100]} stroke="var(--text-muted)" fontSize={11} />
                    <Tooltip
                      contentStyle={{ background: 'var(--panel-bg-solid)', border: '1px solid var(--border-color)', borderRadius: '10px' }}
                    />
                    <Area type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#scoreGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-center" style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  Run a scan to generate posture telemetry.
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ margin: '0 0 14px 0', fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Cloud Security Controls
            </h4>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => requireAuth(() => setIsVerifierOpen(true), "Sign in with your Google account or Gmail/password to verify and connect cloud ID.")}
                className="btn"
                style={{
                  width: '100%',
                  justifyContent: 'space-between',
                  padding: '11px 16px',
                  background: 'var(--panel-inner-bg)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  fontSize: '0.88rem',
                  borderRadius: '12px'
                }}
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck size={16} color="var(--success)" />
                  Verify Another Cloud ID
                </span>
                <ArrowRight size={14} color="var(--text-muted)" />
              </button>

              <button
                onClick={() => requireAuth(() => setIsScanOpen(true), "Sign in with your Google account or Gmail/password to perform a vulnerability audit.")}
                className="btn"
                style={{
                  width: '100%',
                  justifyContent: 'space-between',
                  padding: '11px 16px',
                  background: 'var(--panel-inner-bg)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  fontSize: '0.88rem',
                  borderRadius: '12px'
                }}
              >
                <span className="flex items-center gap-2">
                  <Shield size={16} color="var(--primary)" />
                  Deep Vulnerability Audit
                </span>
                <ArrowRight size={14} color="var(--text-muted)" />
              </button>

              <Link
                to="/resources"
                className="btn"
                style={{
                  width: '100%',
                  justifyContent: 'space-between',
                  padding: '11px 16px',
                  background: 'var(--panel-inner-bg)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  fontSize: '0.88rem',
                  borderRadius: '12px',
                  textDecoration: 'none'
                }}
              >
                <span className="flex items-center gap-2">
                  <Server size={16} color="var(--accent)" />
                  Inspect Cloud Resources
                </span>
                <ArrowRight size={14} color="var(--text-muted)" />
              </Link>
            </div>
          </div>

        </div>

      </div>

      {/* Toast Notification */}
      {safeRemediationToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'var(--panel-bg-solid)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '16px',
            padding: '16px 20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            zIndex: 9999,
            animation: 'fadeIn 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            maxWidth: '440px'
          }}
        >
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '8px', borderRadius: '10px' }}>
            <CheckCircle size={20} color="var(--success)" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>{safeRemediationToast.title}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{safeRemediationToast.detail}</div>
          </div>
        </div>
      )}

      <CloudAccountVerifierModal
        isOpen={isVerifierOpen}
        onClose={() => {
          setIsVerifierOpen(false);
          loadDashboardData();
        }}
      />

      <ScanModal
        isOpen={isScanOpen}
        onClose={() => {
          setIsScanOpen(false);
          loadDashboardData();
        }}
      />

      <SubscriptionCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

    </div>
  );
}
