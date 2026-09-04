import { useState } from 'react';
import {
  Sparkles,
  Check,
  X as CloseIcon,
  ArrowRight,
  HelpCircle,
  Award
} from 'lucide-react';
import { useSubscription, PLAN_TIERS } from '../context/SubscriptionContext';
import { useAuth } from '../context/AuthContext';
import SubscriptionCheckoutModal from '../components/SubscriptionCheckoutModal';

export default function Subscription() {
  const { currentPlan, activeTier, isPro, isEnterprise, cancelSubscription } = useSubscription();
  const { requireAuth } = useAuth();
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState('pro');

  const handleOpenCheckout = (tierId) => {
    requireAuth(() => {
      setSelectedTier(tierId);
      setIsCheckoutOpen(true);
    }, "Sign in with your Google account or Gmail/password to upgrade your subscription plan.");
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
          Choose Your <span className="gradient-text">Cloud Security</span> Plan
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '780px', margin: '0 auto 28px' }}>
          Your current package is Free. Upgrade to 1-Month, 3-Month, or 1-Year Pro protection tiers for autonomous safe remediations and 24/7 AI SecOps.
        </p>

        {/* Current Active Plan Status Banner */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            background: isPro ? 'rgba(16, 185, 129, 0.12)' : 'var(--badge-primary-bg)',
            border: isPro ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid var(--badge-primary-border)',
            padding: '10px 22px',
            borderRadius: '16px',
            marginBottom: '32px',
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
          <span style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>
            {isPro ? (
              <>
                Current Status: <strong style={{ color: 'var(--success)' }}>{activeTier.name}</strong>
                {currentPlan.expiresAt && ` (Active until ${new Date(currentPlan.expiresAt).toLocaleDateString()})`}
              </>
            ) : (
              <>
                Your current package is <strong style={{ color: 'var(--primary)' }}>Free</strong>
              </>
            )}
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
      </div>

      {/* 3 PRICING CARDS GRID */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '56px',
          alignItems: 'stretch',
        }}
      >
        {/* Tier 1: 1 Month Package ($19) */}
        <div
          className="glass-panel"
          style={{
            padding: '28px 22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: currentPlan.tierId === 'monthly' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
            background: 'var(--panel-bg-solid)',
            borderRadius: '18px',
          }}
        >
          <div>
            <div className="flex justify-between items-center" style={{ marginBottom: '14px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                1 Month Plan
              </span>
              {currentPlan.tierId === 'monthly' && (
                <span style={{ fontSize: '0.72rem', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid var(--success)', padding: '2px 8px', borderRadius: '10px', color: 'var(--success)', fontWeight: 700 }}>
                  Active ✓
                </span>
              )}
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px' }}>1 Month Pro Shield</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '18px', minHeight: '36px' }}>
              Monthly recurring defense with production auto-fixes, 24/7 AI SecOps, and real-time drift alerts.
            </p>

            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-main)' }}>$19</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}> / 1 month</span>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '10px' }}>
                Everything in Free, plus:
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
                <li className="flex items-center gap-2">
                  <Check size={14} color="var(--success)" />
                  <span>Safe Production Auto-Remediation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} color="var(--success)" />
                  <span>24/7 AI SecOps Assistant Chatbot</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} color="var(--success)" />
                  <span>Real-time Drift & Threat Alerts</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} color="var(--success)" />
                  <span>Up to 3 Multi-Cloud Accounts</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} color="var(--success)" />
                  <span>1-Click Compliance PDF Reports</span>
                </li>
              </ul>
            </div>
          </div>

          <button
            className="btn"
            onClick={() => handleOpenCheckout('monthly')}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '10px',
              background: 'var(--panel-inner-bg)',
              border: '1px solid var(--primary)',
              color: 'var(--primary)',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.85rem'
            }}
          >
            {currentPlan.tierId === 'monthly' ? 'Current Plan (Active ✓)' : 'Upgrade for $19 / mo'}
          </button>
        </div>

        {/* Tier 3: 3 Months Package ($39) - RECOMMENDED & MOST POPULAR */}
        <div
          className="glass-panel"
          style={{
            padding: '30px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '2px solid #1a73e8',
            boxShadow: 'var(--glass-shadow-hover)',
            position: 'relative',
            background: 'var(--panel-bg-solid)',
            borderRadius: '20px',
            transform: 'scale(1.02)',
          }}
        >
          {/* Most Popular Badge */}
          <div
            style={{
              position: 'absolute',
              top: '-13px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(135deg, #1a73e8, #4285F4)',
              color: 'white',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '3px 14px',
              borderRadius: '20px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              boxShadow: '0 4px 12px rgba(26, 115, 232, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              whiteSpace: 'nowrap'
            }}
          >
            <Sparkles size={13} /> RECOMMENDED • 3 MONTHS ($39)
          </div>

          <div>
            <div className="flex justify-between items-center" style={{ marginBottom: '14px', marginTop: '6px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1a73e8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Quarterly (3 Months)
              </span>
              {currentPlan.tierId === 'quarterly' && (
                <span style={{ fontSize: '0.72rem', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid var(--success)', padding: '2px 8px', borderRadius: '10px', color: 'var(--success)', fontWeight: 700 }}>
                  Active Plan ✓
                </span>
              )}
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '6px' }}>3 Months Pro Defender</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '18px', minHeight: '36px' }}>
              Best value all-inclusive package with priority auto-fixes, unlimited accounts, and risk contribution analytics.
            </p>

            <div style={{ marginBottom: '20px' }}>
              <div className="flex items-baseline gap-1">
                <span style={{ fontSize: '2.6rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>$39</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}> / 3 months ($13/mo)</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--success)', fontWeight: 700, marginTop: '2px' }}>
                Save 32% vs monthly plan • Instant Zero-Downtime Activation
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginBottom: '22px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1a73e8', marginBottom: '10px' }}>
                Everything in 1-Month, plus:
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
                <li className="flex items-center gap-2">
                  <Check size={14} color="var(--success)" />
                  <strong>Unlimited Cloud Accounts (AWS, Azure & GCP)</strong>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} color="var(--success)" />
                  <span>Priority 24/7 AI SecOps Hotline</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} color="var(--success)" />
                  <span>Deep Risk Contribution Matrix & Simulator</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} color="var(--success)" />
                  <span>Automated Rollback Safeguards</span>
                </li>
              </ul>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => handleOpenCheckout('quarterly')}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.92rem',
              background: '#1a73e8',
              borderColor: '#1a73e8',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(26, 115, 232, 0.35)'
            }}
          >
            {currentPlan.tierId === 'quarterly' ? 'Active Plan ✓' : 'Get 3 Months for $39'}
          </button>
        </div>

        {/* Tier 4: 1 Year Package ($149) */}
        <div
          className="glass-panel"
          style={{
            padding: '28px 22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: currentPlan.tierId === 'yearly' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
            background: 'var(--panel-bg-solid)',
            borderRadius: '18px',
          }}
        >
          <div>
            <div className="flex justify-between items-center" style={{ marginBottom: '14px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                1 Year Package
              </span>
              {currentPlan.tierId === 'yearly' && (
                <span style={{ fontSize: '0.72rem', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid var(--success)', padding: '2px 8px', borderRadius: '10px', color: 'var(--success)', fontWeight: 700 }}>
                  Active ✓
                </span>
              )}
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px' }}>1 Year Enterprise Fortress</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '18px', minHeight: '36px' }}>
              Maximum annual savings with dedicated compliance framework, SIEM exports, and 99.99% uptime SLA.
            </p>

            <div style={{ marginBottom: '20px' }}>
              <div className="flex items-baseline gap-1">
                <span style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-main)' }}>$149</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}> / 1 year</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--success)', fontWeight: 700, marginTop: '2px' }}>
                Only $12.41/mo • Highest Value Savings
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--success)', marginBottom: '10px' }}>
                Everything in 3-Month, plus:
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
                <li className="flex items-center gap-2">
                  <Check size={14} color="var(--success)" />
                  <span>Unlimited Cloud Accounts & VPCs</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} color="var(--success)" />
                  <span>Custom SIEM & Splunk/Datadog Feeds</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} color="var(--success)" />
                  <span>Multi-Tenant Governance & RBAC</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} color="var(--success)" />
                  <span>Dedicated Security Architect Support</span>
                </li>
              </ul>
            </div>
          </div>

          <button
            className="btn"
            onClick={() => handleOpenCheckout('yearly')}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '10px',
              background: 'var(--panel-inner-bg)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.85rem'
            }}
          >
            {currentPlan.tierId === 'yearly' ? 'Current Plan (Active ✓)' : 'Upgrade for $149 / yr'}
          </button>
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
                <th style={{ padding: '16px 12px', color: 'var(--text-muted)', fontWeight: 600 }}>Current Plan (Free)</th>
                <th style={{ padding: '16px 12px', color: 'var(--primary)', fontWeight: 800 }}>Pro Defender ($39)</th>
                <th style={{ padding: '16px 12px', color: 'var(--text-muted)', fontWeight: 600 }}>Enterprise Fortress ($149)</th>
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
