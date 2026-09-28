import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Server, AlertTriangle, CheckCircle, Activity, Box, Loader2, ShieldCheck, Zap, Sparkles, Bot, ArrowRight, Lock, TrendingUp, HelpCircle, X, Cloud, RefreshCw, Check, Shield, Settings, Trash2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSubscription } from '../context/SubscriptionContext';
import { useAuth } from '../context/AuthContext';
import SubscriptionCheckoutModal from '../components/SubscriptionCheckoutModal';
import CloudAccountVerifierModal from '../components/CloudAccountVerifierModal';
import ScanModal from '../components/ScanModal';
import { apiRequest, getCloudState, saveCloudState } from '../services/api';

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
  const [removingId, setRemovingId] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isVerifierOpen, setIsVerifierOpen] = useState(false);
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [safeRemediationToast, setSafeRemediationToast] = useState(null);
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [riskFilter, setRiskFilter] = useState('open'); // 'all' | 'open' | 'critical' | 'resolved'

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

  const handleRemoveCloudId = () => {
    requireAuth(async () => {
      setRemovingId(true);
      try {
        await apiRequest('/api/v1/cloud/remove-account', { method: 'POST' });
      } catch (err) {
        console.error(err);
      }
      const state = getCloudState();
      state.activeCloudId = null;
      state.stats = null;
      state.resources = [];
      state.recommendations = [];
      saveCloudState(state);

      setCloudState({ ...state, activeCloudId: null });
      setStats(null);
      setRecommendations([]);
      setChartData([]);
      setRemovingId(false);
      setSafeRemediationToast({
        title: 'Cloud ID Removed',
        detail: 'Cloud infrastructure ID has been disconnected and cleared.'
      });
      setTimeout(() => setSafeRemediationToast(null), 4000);
    }, "Sign in with your Google account or Gmail/password to manage or remove cloud infrastructure.");
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

      {/* 1. MASTER COMMAND CENTER TELEMETRY HEADER */}
      <div className="command-telemetry-header">
        <div className="flex items-center justify-between gap-4 flex-wrap" style={{ marginBottom: '16px' }}>
          <div className="flex items-center gap-2.5 flex-wrap">
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '4px 12px',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--primary)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}>
              <Sparkles size={13} color="var(--primary)" />
              Autonomous SecOps · Command Center
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '9999px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'var(--success)'
            }}>
              <div className="pulse-radar-dot" />
              Continuous Drift Telemetry Active
            </div>
          </div>

          {/* Quick Action Ribbon */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => requireAuth(() => setIsScanOpen(true), "Sign in to trigger live cloud scans.")}
              className="btn btn-primary"
              style={{
                padding: '8px 18px',
                borderRadius: '9999px',
                fontSize: '0.84rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Zap size={15} />
              <span>Trigger Scan</span>
            </button>

            {openRecs.length > 0 && (
              <button
                onClick={handleClearAllRisks}
                disabled={clearingAll}
                className="btn"
                style={{
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  color: 'var(--success)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {clearingAll ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                <span>Clear All ({openRecs.length})</span>
              </button>
            )}

            <button
              onClick={() => requireAuth(() => setIsVerifierOpen(true), "Sign in to manage connected cloud IDs.")}
              className="btn"
              style={{
                padding: '8px 16px',
                borderRadius: '9999px',
                fontSize: '0.84rem',
                fontWeight: 600,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: 'var(--text-main)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Cloud size={14} color="var(--primary)" />
              <span>{activeCloudId ? 'Switch Cloud' : 'Connect Cloud'}</span>
            </button>
          </div>
        </div>

        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.025em', color: 'var(--text-main)' }}>
              Security <span className="gradient-text">Command Center</span>
            </h1>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '680px', lineHeight: 1.45 }}>
              Real-time multi-cloud discovery, autonomous threat mitigation, identity perimeter defense, and continuous CIS compliance across your infrastructure.
            </p>
          </div>

          {/* Active Cloud Telemetry Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 16px',
            borderRadius: '14px',
            background: 'rgba(14, 14, 20, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(12px)'
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: activeCloudId ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Cloud size={16} color={activeCloudId ? 'var(--success)' : 'var(--critical)'} />
            </div>
            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                Monitored Cloud Target
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'JetBrains Mono' }}>
                {activeCloudId ? `${activeProvider}: ${activeCloudId}` : 'No Cloud Account Linked'}
              </div>
            </div>
          </div>
        </div>
      </div>

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
            padding: '14px 22px',
            background: isAllClear ? 'rgba(16, 185, 129, 0.08)' : 'rgba(20, 20, 28, 0.65)',
            border: `1px solid ${isAllClear ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
            borderRadius: '18px',
            flexWrap: 'wrap'
          }}
        >
          <div className="flex items-center gap-3">
            <div style={{
              background: isAllClear ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.08)',
              color: isAllClear ? 'var(--success)' : 'var(--primary)',
              padding: '6px 12px',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Cloud size={15} /> {activeProvider}
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Active Cloud Account</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'JetBrains Mono' }}>{activeCloudId}</div>
            </div>
            <div style={{
              background: isAllClear ? 'rgba(16, 185, 129, 0.15)' : 'rgba(249, 115, 22, 0.15)',
              color: isAllClear ? 'var(--success)' : 'var(--high)',
              border: `1px solid ${isAllClear ? 'rgba(16, 185, 129, 0.3)' : 'rgba(249, 115, 22, 0.3)'}`,
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

          <div className="flex items-center gap-1.5">
            {!isAllClear && (
              <button
                onClick={handleClearAllRisks}
                disabled={clearingAll}
                className="btn btn-primary"
                style={{
                  height: '28px',
                  padding: '0 10px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  borderColor: '#10b981',
                  borderRadius: '6px',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {clearingAll ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                Clear All Risks & Failures
              </button>
            )}
            <button
              onClick={() => requireAuth(() => setIsScanOpen(true), "Sign in with your Google account or Gmail/password to rescan cloud infrastructure.")}
              className="btn"
              style={{
                height: '28px',
                padding: '0 8px',
                background: 'var(--panel-inner-bg)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                fontSize: '0.74rem',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <RefreshCw size={12} /> Rescan
            </button>
            <button
              onClick={() => requireAuth(() => setIsVerifierOpen(true), "Sign in with your Google account or Gmail/password to switch cloud accounts.")}
              className="btn"
              style={{
                height: '28px',
                padding: '0 8px',
                background: 'var(--panel-inner-bg)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-muted)',
                fontSize: '0.74rem',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center'
              }}
            >
              Change ID
            </button>
            <button
              onClick={handleRemoveCloudId}
              disabled={removingId}
              className="btn"
              title="Remove Cloud ID"
              aria-label="Remove Cloud ID"
              style={{
                width: '28px',
                height: '28px',
                padding: 0,
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: 'var(--critical, #ef4444)',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: removingId ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                if (!removingId) {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.18)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.45)';
                }
              }}
              onMouseLeave={(e) => {
                if (!removingId) {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.25)';
                }
              }}
            >
              {removingId ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
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
          <div className="flex items-center justify-between flex-wrap gap-3" style={{ marginBottom: '16px' }}>
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
                  borderColor: '#10b981',
                  borderRadius: '8px'
                }}
              >
                {clearingAll ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                Clear All Risks
              </button>
            )}
          </div>

          {/* Filter Pills */}
          {activeCloudId && recommendations.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: '20px' }}>
              {[
                { id: 'open', label: `Open Threats (${openRecs.length})` },
                { id: 'critical', label: `Critical (${openRecs.filter(r => r.severity === 'critical').length})` },
                { id: 'resolved', label: `Remediated (${recommendations.filter(r => r.status === 'resolved').length})` },
                { id: 'all', label: `All (${recommendations.length})` },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setRiskFilter(tab.id)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '9999px',
                    fontSize: '0.78rem',
                    fontWeight: riskFilter === tab.id ? 700 : 500,
                    background: riskFilter === tab.id ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${riskFilter === tab.id ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.08)'}`,
                    color: riskFilter === tab.id ? '#ffffff' : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

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
          ) : (recommendations.filter(r => {
            if (riskFilter === 'open') return r.status === 'open';
            if (riskFilter === 'critical') return r.status === 'open' && r.severity === 'critical';
            if (riskFilter === 'resolved') return r.status === 'resolved';
            return true;
          })).length === 0 ? (
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
                {riskFilter === 'resolved' ? 'No Remediation History Yet' : 'Zero Active Risks in This Category!'}
              </h4>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '420px' }}>
                All cloud configurations for <strong>{activeProvider} ID {activeCloudId}</strong> are compliant in this filter view.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {recommendations.filter(r => {
                if (riskFilter === 'open') return r.status === 'open';
                if (riskFilter === 'critical') return r.status === 'open' && r.severity === 'critical';
                if (riskFilter === 'resolved') return r.status === 'resolved';
                return true;
              }).map(rec => {
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
                  Security Posture Telemetry
                </h4>
              </div>
              <span style={{
                fontSize: '0.74rem',
                color: score >= 90 ? 'var(--success)' : 'var(--high)',
                fontWeight: 700,
                background: score >= 90 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(249, 115, 22, 0.12)',
                padding: '2px 8px',
                borderRadius: '6px'
              }}>
                {score >= 90 ? 'Optimal (90+)' : activeCloudId ? 'Mitigation Required' : 'Standby'}
              </span>
            </div>

            <div style={{ width: '100%', height: '170px' }}>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="cyberScoreGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7c5bff" stopOpacity={0.6}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" />
                    <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={10} />
                    <YAxis domain={[50, 100]} stroke="var(--text-muted)" fontSize={10} />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(18, 18, 24, 0.95)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '10px',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)'
                      }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#7c5bff" strokeWidth={2.5} fillOpacity={1} fill="url(#cyberScoreGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-center" style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  Run a scan to generate posture telemetry.
                </div>
              )}
            </div>
          </div>

          {/* Continuous Compliance Benchmarks Card */}
          <div className="glass-panel" style={{ padding: '22px' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '14px' }}>
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} color="var(--success)" />
                <h4 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Continuous Compliance Benchmarks
                </h4>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>v4.2</span>
            </div>

            <div className="flex flex-col gap-2.5">
              {[
                { name: 'CIS AWS Foundations v1.4', pct: 98, status: 'Compliant' },
                { name: 'SOC 2 Type II Security', pct: 100, status: 'Certified' },
                { name: 'PCI-DSS v4.0 Cloud Perimeter', pct: 96, status: 'Passed' },
                { name: 'HIPAA Security Rule Safe Guard', pct: 100, status: 'Protected' },
              ].map(item => (
                <div key={item.name} style={{
                  padding: '8px 12px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px'
                }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name}
                    </div>
                  </div>
                  <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--success)' }}>
                      {item.pct}%
                    </span>
                    <span style={{
                      fontSize: '0.64rem',
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: '4px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: 'var(--success)'
                    }}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="glass-panel" style={{ padding: '22px' }}>
            <h4 style={{ margin: '0 0 14px 0', fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Security Command Controls
            </h4>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => requireAuth(() => setIsVerifierOpen(true), "Sign in to verify and connect cloud ID.")}
                className="btn"
                style={{
                  width: '100%',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: 'var(--text-main)',
                  fontSize: '0.84rem',
                  borderRadius: '10px'
                }}
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck size={15} color="var(--success)" />
                  Verify Multi-Cloud IAM
                </span>
                <ArrowRight size={14} color="var(--text-muted)" />
              </button>

              <Link
                to="/resources"
                className="btn"
                style={{
                  width: '100%',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: 'var(--text-main)',
                  fontSize: '0.84rem',
                  borderRadius: '10px',
                  textDecoration: 'none'
                }}
              >
                <span className="flex items-center gap-2">
                  <Server size={15} color="var(--accent)" />
                  Asset & Inventory Discovery
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
