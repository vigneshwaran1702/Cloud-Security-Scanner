import { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  Zap,
  Sparkles,
  Bot,
  Activity,
  Check,
  X as CloseIcon,
  Layers,
  Flame,
  Clock,
  FileText,
  Bell,
  Lock,
  ArrowRight,
  TrendingDown,
  Server,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sliders,
  Send,
  HelpCircle,
  Award
} from 'lucide-react';
import { useSubscription, PLAN_TIERS } from '../context/SubscriptionContext';
import SubscriptionCheckoutModal from '../components/SubscriptionCheckoutModal';

export default function Subscription() {
  const { currentPlan, activeTier, isPro, isEnterprise, cancelSubscription } = useSubscription();
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState('pro');

  // Interactive Demo States
  // 1. Safe Production Auto-Fix Demo
  const [safeFixStep, setSafeFixStep] = useState(0); // 0: initial, 1: dry-run checking, 2: applying, 3: completed
  const [safeFixLog, setSafeFixLog] = useState([
    'Waiting for trigger: Safe Production Auto-Fix ready...',
  ]);

  // 2. Instant Help Live Triage Demo
  const [instantHelpPrompt, setInstantHelpPrompt] = useState('Help! Unauthorized IAM role modification detected on AWS prod cluster.');
  const [instantHelpResponse, setInstantHelpResponse] = useState(null);
  const [isHelpGenerating, setIsHelpGenerating] = useState(false);

  // 3. Risk Contribution interactive weights
  const [riskItems, setRiskItems] = useState([
    { id: 1, name: 'S3 Public Data Bucket (AWS)', riskScore: 88, weight: 38, impact: 'Critical (Data Exfiltration)' },
    { id: 2, name: 'Overprivileged Subscription Owner (Azure)', riskScore: 76, weight: 29, impact: 'High (Privilege Escalation)' },
    { id: 3, name: 'Unencrypted Cloud SQL Database (GCP)', riskScore: 68, weight: 21, impact: 'High (Regulatory Non-Compliance)' },
    { id: 4, name: 'Open Inbound SSH Port 0.0.0.0/0 (AWS)', riskScore: 54, weight: 12, impact: 'Medium (Brute-Force Risk)' },
  ]);

  const handleOpenCheckout = (tierId) => {
    setSelectedTier(tierId);
    setIsCheckoutOpen(true);
  };

  // Safe Production Simulation
  const runSafeProductionDemo = () => {
    setSafeFixStep(1);
    setSafeFixLog(['[0.0s] 🔍 Pre-flight Dry-Run: Validating dependency graph across AWS & Azure...']);

    setTimeout(() => {
      setSafeFixStep(2);
      setSafeFixLog(prev => [
        ...prev,
        '[0.8s] 🛡️ Guardrail Check: Zero downtime guarantee validated. Creating automated rollback snapshot...',
        '[1.4s] ⚡ Applying Least-Privilege IAM Boundary & S3 Public Access Block...'
      ]);
    }, 1200);

    setTimeout(() => {
      setSafeFixStep(3);
      setSafeFixLog(prev => [
        ...prev,
        '[2.1s] ✅ Production Safe Fix Applied successfully with 0 dropped packets and 100% compliance restored!'
      ]);
    }, 2400);
  };

  // Instant Help Simulation
  const runInstantHelpDemo = () => {
    setIsHelpGenerating(true);
    setInstantHelpResponse(null);

    setTimeout(() => {
      setInstantHelpResponse({
        timeTaken: '0.42s response time',
        incidentSeverity: 'P1 - High Security Alert',
        summary: 'CloudGuard SecOps AI detected an unauthorized AssumeRole call from unrecognized IP `198.51.100.24`.',
        actionPlan: [
          'Immediate Revocation: Session token revoked via AWS STS.',
          'Blast Radius Isolation: Security group sg-prod-isolated applied.',
          'Audit Log Snapshot: CloudTrail trail logs captured for forensic retention.'
        ],
        architectNote: 'Our 24/7 dedicated SecOps AI has placed your session in the priority triage queue.'
      });
      setIsHelpGenerating(false);
    }, 1000);
  };

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '16px 8px 48px' }}>
      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px', position: 'relative' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '24px',
            background: 'var(--badge-primary-bg)',
            border: '1px solid var(--badge-primary-border)',
            color: 'var(--primary)',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          <Sparkles size={16} color="var(--primary)" />
          Autonomous Cloud Security & Upgrades
        </div>

        <h1 style={{ fontSize: '2.8rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '16px', color: 'var(--text-main)' }}>
          Upgrade to <span className="gradient-text">Pro Cloud Defender</span> for <span style={{ color: 'var(--primary)' }}>$39</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '780px', margin: '0 auto 28px' }}>
          Protect production infrastructure automatically, get instant 24/7 AI SecOps help, deep risk contribution analytics, and continuous multi-cloud automated remediation.
        </p>

        {/* Current Active Plan Status Banner */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            background: isPro ? 'rgba(16, 185, 129, 0.12)' : 'var(--badge-primary-bg)',
            border: isPro ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid var(--badge-primary-border)',
            padding: '10px 20px',
            borderRadius: '16px',
            marginBottom: '28px',
          }}
        >
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: isPro ? 'var(--success)' : 'var(--primary)',
              boxShadow: isPro ? '0 0 10px var(--success)' : '0 0 10px var(--primary)',
            }}
          />
          <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
            Current Plan: <strong style={{ color: isPro ? 'var(--success)' : 'var(--primary)' }}>{activeTier.name}</strong>
            {currentPlan.expiresAt && ` (Renews ${new Date(currentPlan.expiresAt).toLocaleDateString()})`}
          </span>
          {isPro && (
            <button
              onClick={cancelSubscription}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.78rem',
                textDecoration: 'underline',
                cursor: 'pointer',
                marginLeft: '8px',
              }}
            >
              Downgrade to Free
            </button>
          )}
        </div>

        {/* Billing Cycle Switcher */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'var(--panel-inner-bg)',
            padding: '4px',
            borderRadius: '14px',
            border: '1px solid var(--border-color)',
          }}
        >
          <button
            onClick={() => setBillingCycle('monthly')}
            style={{
              background: billingCycle === 'monthly' ? 'var(--primary)' : 'transparent',
              color: billingCycle === 'monthly' ? '#fff' : 'var(--text-muted)',
              border: 'none',
              padding: '8px 20px',
              borderRadius: '10px',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'var(--transition)',
            }}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            style={{
              background: billingCycle === 'yearly' ? 'var(--primary)' : 'transparent',
              color: billingCycle === 'yearly' ? '#fff' : 'var(--text-muted)',
              border: 'none',
              padding: '8px 20px',
              borderRadius: '10px',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'var(--transition)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            Yearly Billing
            <span
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff',
                fontSize: '0.7rem',
                padding: '2px 8px',
                borderRadius: '10px',
                fontWeight: 700,
              }}
            >
              Save 2 Months
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '56px',
          alignItems: 'stretch',
        }}
      >
        {/* Tier 1: Free Starter */}
        <div
          className="glass-panel"
          style={{
            padding: '32px 28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: currentPlan.tierId === 'free' ? '1px solid var(--primary)' : '1px solid var(--border-color)',
            background: 'var(--panel-bg-solid)',
          }}
        >
          <div>
            <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Starter
              </span>
              {currentPlan.tierId === 'free' && (
                <span style={{ fontSize: '0.75rem', background: 'var(--badge-primary-bg)', padding: '3px 10px', borderRadius: '12px', color: 'var(--primary)', fontWeight: 700 }}>
                  Active
                </span>
              )}
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>Starter Cloud Shield</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px', minHeight: '40px' }}>
              Essential multi-cloud posture checks and manual vulnerability reviews for developers.
            </p>

            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--text-main)' }}>$0</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}> / forever</span>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginBottom: '24px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '12px' }}>
                Included in Free:
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                <li className="flex items-center gap-2">
                  <Check size={16} color="var(--success)" />
                  <span>1 Cloud Account (AWS or Azure)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} color="var(--success)" />
                  <span>Standard Risk Vulnerability Scanning</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} color="var(--success)" />
                  <span>Manual Remediation Guides</span>
                </li>
                <li className="flex items-center gap-2" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
                  <CloseIcon size={16} />
                  <span>No Safe Production Auto-Fixes</span>
                </li>
                <li className="flex items-center gap-2" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
                  <CloseIcon size={16} />
                  <span>No 24/7 Instant AI SecOps Hotline</span>
                </li>
                <li className="flex items-center gap-2" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
                  <CloseIcon size={16} />
                  <span>No Risk Contribution Simulator</span>
                </li>
              </ul>
            </div>
          </div>

          <button
            className="btn"
            disabled={currentPlan.tierId === 'free'}
            onClick={() => cancelSubscription()}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              background: 'var(--panel-inner-bg)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              cursor: currentPlan.tierId === 'free' ? 'default' : 'pointer',
              fontWeight: 600,
            }}
          >
            {currentPlan.tierId === 'free' ? 'Current Plan' : 'Select Free'}
          </button>
        </div>

        {/* Tier 2: $39 Pro Defender (PROMINENT HIGHLIGHT) */}
        <div
          className="glass-panel"
          style={{
            padding: '36px 30px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '2px solid var(--primary)',
            boxShadow: 'var(--glass-shadow-hover)',
            position: 'relative',
            background: 'var(--panel-bg-solid)',
            transform: 'scale(1.02)',
          }}
        >
          {/* Most Popular Badge */}
          <div
            style={{
              position: 'absolute',
              top: '-14px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              color: 'white',
              fontSize: '0.78rem',
              fontWeight: 800,
              padding: '4px 18px',
              borderRadius: '20px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Sparkles size={14} /> RECOMMENDED & MOST POPULAR
          </div>

          <div>
            <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Pro Tier
              </span>
              {currentPlan.tierId === 'pro' && (
                <span style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid var(--success)', padding: '3px 10px', borderRadius: '12px', color: 'var(--success)', fontWeight: 700 }}>
                  Active Plan ✓
                </span>
              )}
            </div>

            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>Pro Cloud Defender</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '24px', minHeight: '40px' }}>
              Autonomous multi-cloud security with automated safe production fixes, 24/7 instant AI SecOps help, and deep risk contribution analytics.
            </p>

            <div style={{ marginBottom: '24px' }}>
              <div className="flex items-baseline gap-1">
                <span style={{ fontSize: '3.4rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>$39</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
                  /{billingCycle === 'yearly' ? 'mo (billed $390/yr)' : 'month'}
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--success)', fontWeight: 600, marginTop: '2px' }}>
                Instant Activation • 30-Day Money-Back Guarantee
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginBottom: '28px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '12px' }}>
                Everything in Free, plus:
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem' }}>
                <li className="flex items-start gap-2.5">
                  <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '2px', borderRadius: '50%', marginTop: '2px' }}>
                    <Check size={14} color="var(--success)" />
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text-main)' }}>Safe Production Automatically</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Zero-downtime automated fixes with pre-flight dry-run guardrails</div>
                  </div>
                </li>

                <li className="flex items-start gap-2.5">
                  <div style={{ background: 'var(--badge-primary-bg)', padding: '2px', borderRadius: '50%', marginTop: '2px' }}>
                    <Check size={14} color="var(--primary)" />
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text-main)' }}>24/7 Instant Help AI SecOps Hotline</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sub-minute incident triage & live AI cloud architect hotline</div>
                  </div>
                </li>

                <li className="flex items-start gap-2.5">
                  <div style={{ background: 'var(--badge-primary-bg)', padding: '2px', borderRadius: '50%', marginTop: '2px' }}>
                    <Check size={14} color="var(--primary)" />
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text-main)' }}>Advanced Risk Contribution Matrix</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Deep blast-radius mapping & asset vulnerability impact simulator</div>
                  </div>
                </li>

                <li className="flex items-center gap-2">
                  <Check size={16} color="var(--success)" />
                  <span>Unlimited Cloud Accounts (AWS, Azure & GCP)</span>
                </li>

                <li className="flex items-center gap-2">
                  <Check size={16} color="var(--success)" />
                  <span>1-Click Compliance Reporting (SOC2, CIS, HIPAA)</span>
                </li>
              </ul>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => handleOpenCheckout('pro')}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            {currentPlan.tierId === 'pro' ? 'Current Plan (Active ✓)' : 'Upgrade to Pro for $39'}
          </button>
        </div>

        {/* Tier 3: Enterprise Fortress */}
        <div
          className="glass-panel"
          style={{
            padding: '32px 28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: currentPlan.tierId === 'enterprise' ? '1px solid var(--primary)' : '1px solid var(--border-color)',
            background: 'var(--panel-bg-solid)',
          }}
        >
          <div>
            <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Enterprise
              </span>
              {currentPlan.tierId === 'enterprise' && (
                <span style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid var(--success)', padding: '3px 10px', borderRadius: '12px', color: 'var(--success)', fontWeight: 700 }}>
                  Active
                </span>
              )}
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>Enterprise Fortress</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px', minHeight: '40px' }}>
              Custom security governance, dedicated security architect, SIEM pipelines, and enterprise-grade SLAs.
            </p>

            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--text-main)' }}>$99</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}> / month</span>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginBottom: '24px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '12px' }}>
                Everything in Pro, plus:
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                <li className="flex items-center gap-2">
                  <Check size={16} color="var(--success)" />
                  <span>Dedicated Technical Account Manager (TAM)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} color="var(--success)" />
                  <span>Custom SIEM & Splunk/Datadog Pipelines</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} color="var(--success)" />
                  <span>Multi-Tenant RBAC Governance</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} color="var(--success)" />
                  <span>99.99% Production Uptime SLA Guarantee</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} color="var(--success)" />
                  <span>Custom Compliance Frameworks</span>
                </li>
              </ul>
            </div>
          </div>

          <button
            className="btn"
            onClick={() => handleOpenCheckout('enterprise')}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              background: 'var(--panel-inner-bg)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            {currentPlan.tierId === 'enterprise' ? 'Current Plan' : 'Upgrade to Enterprise ($99)'}
          </button>
        </div>
      </div>

      {/* 4 CORE FEATURE SHOWCASES SECTION */}
      <div style={{ marginBottom: '56px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-main)' }}>
            4 Breakthrough Capabilities Unlocked With <span className="gradient-text">$39 Pro</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Experience the next generation of autonomous cloud protection designed for high-scale teams.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* 1. Safe Production Automatically */}
          <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
              <div className="flex items-center gap-3">
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '10px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <ShieldCheck size={24} color="var(--success)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Safe Production Automatically</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>Zero-Downtime Auto-Remediation Engine</span>
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', background: 'var(--badge-primary-bg)', color: 'var(--badge-primary-color)', border: '1px solid var(--badge-primary-border)', padding: '3px 8px', borderRadius: '8px', fontWeight: 700 }}>
                $39 PRO
              </span>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Never worry about broken dependencies or downtime. Our engine performs pre-flight dry-run validation, verifies traffic health, and creates instant rollback checkpoints before touching production.
            </p>

            {/* Interactive Live Demo */}
            <div style={{ background: 'var(--panel-inner-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
              <div className="flex justify-between items-center" style={{ marginBottom: '10px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                  Live Safety Guardrail Simulator
                </span>
                <button
                  onClick={runSafeProductionDemo}
                  disabled={safeFixStep === 1 || safeFixStep === 2}
                  className="btn"
                  style={{
                    background: 'var(--badge-primary-bg)',
                    border: '1px solid var(--badge-primary-border)',
                    color: 'var(--badge-primary-color)',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Play size={12} /> Test Auto-Fix Execution
                </button>
              </div>

              {/* Progress Stepper */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                {['Dry-Run Check', 'Rollback Point', 'Safe Production Fix'].map((stepName, idx) => {
                  const isDone = safeFixStep > idx;
                  const isCurrent = safeFixStep === idx + 1;
                  return (
                    <div
                      key={stepName}
                      style={{
                        flex: 1,
                        padding: '6px',
                        background: isDone ? 'rgba(16, 185, 129, 0.15)' : isCurrent ? 'var(--badge-primary-bg)' : 'var(--panel-inner-bg)',
                        border: isDone ? '1px solid var(--success)' : isCurrent ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        textAlign: 'center',
                        color: isDone ? 'var(--success)' : isCurrent ? 'var(--primary)' : 'var(--text-muted)',
                        fontWeight: 600,
                      }}
                    >
                      {stepName}
                    </div>
                  );
                })}
              </div>

              {/* Console log */}
              <div style={{ background: 'var(--code-bg)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.72rem', color: 'var(--code-text)', minHeight: '60px' }}>
                {safeFixLog.map((line, i) => (
                  <div key={i} style={{ marginBottom: '3px' }}>{line}</div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Instant Help (24/7 AI SecOps Hotline) */}
          <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
              <div className="flex items-center gap-3">
                <div style={{ background: 'var(--badge-primary-bg)', padding: '10px', borderRadius: '12px', border: '1px solid var(--badge-primary-border)' }}>
                  <Bot size={24} color="var(--primary)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Instant Help 24/7</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>Priority AI SecOps Hotline & Triage</span>
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', background: 'var(--badge-primary-bg)', color: 'var(--badge-primary-color)', border: '1px solid var(--badge-primary-border)', padding: '3px 8px', borderRadius: '8px', fontWeight: 700 }}>
                $39 PRO
              </span>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Get sub-second incident triage during security emergencies. Instant runbooks, step-by-step containment instructions, and live cloud architect consultation directly in your browser.
            </p>

            {/* Interactive Live Triage Demo */}
            <div style={{ background: 'var(--panel-inner-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
              <div className="flex gap-2" style={{ marginBottom: '10px' }}>
                <input
                  type="text"
                  value={instantHelpPrompt}
                  onChange={(e) => setInstantHelpPrompt(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'var(--input-bg)',
                    border: '1px solid var(--border-color)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    color: 'var(--text-main)',
                    fontSize: '0.8rem',
                    outline: 'none',
                  }}
                />
                <button
                  onClick={runInstantHelpDemo}
                  disabled={isHelpGenerating}
                  className="btn btn-primary"
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Send size={14} /> Instant Help
                </button>
              </div>

              {instantHelpResponse ? (
                <div style={{ background: 'var(--code-bg)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '8px', fontSize: '0.78rem' }}>
                  <div className="flex justify-between items-center" style={{ marginBottom: '6px' }}>
                    <span style={{ color: 'var(--critical)', fontWeight: 700 }}>● {instantHelpResponse.incidentSeverity}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>⚡ {instantHelpResponse.timeTaken}</span>
                  </div>
                  <p style={{ color: 'var(--text-main)', marginBottom: '8px', fontSize: '0.75rem' }}>{instantHelpResponse.summary}</p>
                  <div style={{ color: 'var(--code-text)', fontSize: '0.72rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {instantHelpResponse.actionPlan.map((step, idx) => (
                      <div key={idx}>▸ {step}</div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '12px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  Click "Instant Help" to trigger sub-second live SecOps triage demo.
                </div>
              )}
            </div>
          </div>

          {/* 3. More Risk Contribution & Blast Radius Breakdown */}
          <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
              <div className="flex items-center gap-3">
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '10px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <Activity size={24} color="var(--success)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Risk Contribution Matrix</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>Multi-Cloud Attack Surface & Blast Radius</span>
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', background: 'var(--badge-primary-bg)', color: 'var(--badge-primary-color)', border: '1px solid var(--badge-primary-border)', padding: '3px 8px', borderRadius: '8px', fontWeight: 700 }}>
                $39 PRO
              </span>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Understand exactly which vulnerabilities contribute the most to your cloud's attack surface. Prioritize high-impact fixes before adversaries exploit chained multi-cloud paths.
            </p>

            {/* Interactive Risk Weight Breakdown */}
            <div style={{ background: 'var(--panel-inner-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
                Vulnerability Risk Contribution (%)
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {riskItems.map((item) => (
                  <div key={item.id}>
                    <div className="flex justify-between items-center" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{item.name}</span>
                      <span style={{ color: item.weight > 30 ? 'var(--critical)' : item.weight > 20 ? 'var(--high)' : 'var(--primary)', fontWeight: 700 }}>
                        {item.weight}% Risk Impact
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${item.weight}%`,
                          height: '100%',
                          background: item.weight > 30 ? 'linear-gradient(90deg, #ef4444, #f87171)' : item.weight > 20 ? 'linear-gradient(90deg, #f97316, #fb923c)' : 'linear-gradient(90deg, var(--primary), var(--accent))',
                          borderRadius: '4px',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Many Upgrades & Power Capabilities Grid */}
          <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
              <div className="flex items-center gap-3">
                <div style={{ background: 'rgba(234, 179, 8, 0.15)', padding: '10px', borderRadius: '12px', border: '1px solid rgba(234, 179, 8, 0.3)' }}>
                  <Layers size={24} color="var(--medium)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Many Upgrades Included</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--medium)', fontWeight: 600 }}>Enterprise-Grade Tooling Suite</span>
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', background: 'var(--badge-primary-bg)', color: 'var(--badge-primary-color)', border: '1px solid var(--badge-primary-border)', padding: '3px 8px', borderRadius: '8px', fontWeight: 700 }}>
                $39 PRO
              </span>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Unlock the entire arsenal of cloud defense tools in one single $39 subscription:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ background: 'var(--panel-inner-bg)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '10px' }}>
                <div className="flex items-center gap-1.5" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '2px' }}>
                  <Bell size={14} color="var(--primary)" /> Real-time Drift Alerts
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Slack, Discord & Webhook pushes</div>
              </div>

              <div style={{ background: 'var(--panel-inner-bg)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '10px' }}>
                <div className="flex items-center gap-1.5" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '2px' }}>
                  <Cloud size={14} color="var(--primary)" /> Unlimited Accounts
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>AWS, Azure, GCP & K8s</div>
              </div>

              <div style={{ background: 'var(--panel-inner-bg)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '10px' }}>
                <div className="flex items-center gap-1.5" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '2px' }}>
                  <FileText size={14} color="var(--success)" /> 1-Click SOC2 Reports
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Audit-ready PDF/JSON exports</div>
              </div>

              <div style={{ background: 'var(--panel-inner-bg)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '10px' }}>
                <div className="flex items-center gap-1.5" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '2px' }}>
                  <Lock size={14} color="var(--medium)" /> Least-Privilege IAM
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Automatic policy synthesizer</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FULL FEATURE COMPARISON TABLE */}
      <div className="glass-panel" style={{ padding: '36px', borderRadius: '24px', marginBottom: '56px' }}>
        <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '24px', textAlign: 'center', color: 'var(--text-main)' }}>
          Detailed Plan Feature Comparison
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', background: 'var(--panel-inner-bg)' }}>
                <th style={{ padding: '16px 12px', color: 'var(--text-muted)', fontWeight: 600 }}>Security Feature</th>
                <th style={{ padding: '16px 12px', color: 'var(--text-muted)', fontWeight: 600 }}>Starter (Free)</th>
                <th style={{ padding: '16px 12px', color: 'var(--primary)', fontWeight: 800 }}>Pro Defender ($39)</th>
                <th style={{ padding: '16px 12px', color: 'var(--text-muted)', fontWeight: 600 }}>Enterprise ($99)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: 'Safe Production Auto-Remediation', free: false, pro: true, ent: true },
                { feature: '24/7 Instant Help AI SecOps Hotline', free: false, pro: true, ent: true },
                { feature: 'Risk Contribution & Blast Radius Simulator', free: false, pro: true, ent: true },
                { feature: 'Multi-Cloud Account Connections', free: '1 Account', pro: 'Unlimited', ent: 'Unlimited + Dedicated VPC' },
                { feature: 'Automated CIS / SOC2 Compliance Reports', free: false, pro: true, ent: true },
                { feature: 'Real-time Infrastructure Drift Detection', free: false, pro: true, ent: true },
                { feature: 'Automated Rollback Checkpoint System', free: false, pro: true, ent: true },
                { feature: 'Slack / PagerDuty / Teams Webhooks', free: false, pro: true, ent: true },
                { feature: 'Continuous Threat Intelligence Feeds', free: 'Daily', pro: 'Real-time', ent: 'Sub-second Continuous' },
                { feature: 'Dedicated Security Architect & TAM', free: false, pro: false, ent: true },
              ].map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}>
                  <td style={{ padding: '14px 12px', fontWeight: 500, color: 'var(--text-main)' }}>{row.feature}</td>
                  <td style={{ padding: '14px 12px', color: 'var(--text-muted)' }}>
                    {typeof row.free === 'boolean' ? (
                      row.free ? <Check size={18} color="var(--success)" /> : <CloseIcon size={18} opacity={0.4} />
                    ) : (
                      row.free
                    )}
                  </td>
                  <td style={{ padding: '14px 12px', color: 'var(--primary)', fontWeight: 600, background: 'var(--badge-primary-bg)' }}>
                    {typeof row.pro === 'boolean' ? (
                      row.pro ? <Check size={18} color="var(--success)" /> : <CloseIcon size={18} opacity={0.4} />
                    ) : (
                      row.pro
                    )}
                  </td>
                  <td style={{ padding: '14px 12px', color: 'var(--text-main)' }}>
                    {typeof row.ent === 'boolean' ? (
                      row.ent ? <Check size={18} color="var(--success)" /> : <CloseIcon size={18} opacity={0.4} />
                    ) : (
                      row.ent
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CTA below table */}
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <button
            className="btn btn-primary"
            onClick={() => handleOpenCheckout('pro')}
            style={{
              padding: '14px 32px',
              fontSize: '1.05rem',
              fontWeight: 700,
              borderRadius: '12px',
              cursor: 'pointer',
            }}
          >
            Unlock Everything for $39 / month <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* FAQ & Guarantees */}
      <div className="grid grid-cols-2 gap-6" style={{ marginBottom: '24px' }}>
        <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px' }}>
          <div className="flex items-center gap-2" style={{ marginBottom: '16px', color: 'var(--primary)' }}>
            <Award size={20} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>30-Day Money-Back Guarantee</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            If CloudGuard AI Pro does not eliminate your production cloud security bottlenecks or save your team dozens of hours of manual remediations, we will refund 100% of your $39 subscription with no questions asked.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px' }}>
          <div className="flex items-center gap-2" style={{ marginBottom: '16px', color: 'var(--accent)' }}>
            <HelpCircle size={20} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Can I switch plans or cancel anytime?</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Yes! You can upgrade, downgrade, or cancel your subscription at any time with a single click from the Subscription page or Settings. No locked contracts.
          </p>
        </div>
      </div>

      {/* Checkout Modal */}
      <SubscriptionCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedTierId={selectedTier}
        billingCycle={billingCycle}
      />
    </div>
  );
}
