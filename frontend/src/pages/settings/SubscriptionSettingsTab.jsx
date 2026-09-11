import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  ShieldCheck,
  Sparkles,
  CreditCard,
  Receipt,
  Calendar,
  Smartphone,
  Coins,
  CheckCircle2,
  XCircle,
  FileText,
  Layers,
} from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import ReceiptModal from '../../components/ReceiptModal';

export default function SubscriptionSettingsTab() {
  const { currentPlan, activeTier, isPro, invoices } = useSubscription();
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const handleOpenReceipt = (inv) => {
    setSelectedInvoice(inv);
    setIsReceiptModalOpen(true);
  };

  const formattedExpiry = currentPlan.expiresAt
    ? new Date(currentPlan.expiresAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'No expiration (Active Starter)';

  const formattedSubscribed = currentPlan.subscribedAt
    ? new Date(currentPlan.subscribedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Platform Registration Date';

  const tierFeaturesList = [
    {
      title: 'Safe Production Zero-Downtime Auto-Remediation',
      description: 'Automated atomic remediations with instant dry-run rollback guarantees',
      active: Boolean(activeTier.features?.safeProduction),
      proOnly: true,
    },
    {
      title: '24/7 Priority AI SecOps Hotline',
      description: 'Instant generative intelligence guidance for complex multi-cloud drifts',
      active: Boolean(activeTier.features?.instantHelp),
      proOnly: true,
    },
    {
      title: 'Automated CIS Benchmark Compliance Exports',
      description: 'One-click executive and auditor PDF compliance generation',
      active: Boolean(activeTier.features?.complianceReports),
      proOnly: true,
    },
    {
      title: 'Multi-Cloud Account Connections',
      description: `Active allowance: ${activeTier.features?.maxAccounts || '1 Account'}`,
      active: true,
      proOnly: false,
    },
    {
      title: 'Continuous Real-Time Drift Scanning',
      description: `Scan frequency: ${activeTier.features?.scanFrequency || 'Manual'}`,
      active: Boolean(activeTier.features?.realtimeDrift),
      proOnly: true,
    },
    {
      title: 'Risk Contribution Heatmap & Blast Radius Matrix',
      description: 'Deep dependency mapping across interconnected cloud identities',
      active: Boolean(activeTier.features?.riskContributionMatrix),
      proOnly: true,
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* 1. Main Plan Overview Card */}
      <div
        className="glass-panel"
        style={{
          padding: '28px',
          border: isPro ? '1px solid var(--success-border)' : '1px solid var(--border-color)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top background glow if active */}
        {isPro && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '280px',
              height: '140px',
              background: 'radial-gradient(ellipse at top right, rgba(16, 185, 129, 0.18), transparent 70%)',
              pointerEvents: 'none',
            }}
          />
        )}

        <div className="flex justify-between items-start flex-wrap gap-4" style={{ marginBottom: '24px' }}>
          <div className="flex items-center gap-4">
            <div
              style={{
                padding: '14px',
                borderRadius: '16px',
                background: isPro ? 'var(--success-bg)' : 'var(--badge-primary-bg)',
                border: isPro ? '1px solid var(--success-border)' : '1px solid var(--badge-primary-border)',
              }}
            >
              <Zap size={28} color={isPro ? 'var(--success)' : 'var(--primary)'} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 style={{ fontSize: '1.35rem', margin: 0, fontWeight: 800 }}>
                  {activeTier.name}
                </h3>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '12px',
                    background: isPro ? 'var(--success-bg)' : 'var(--badge-primary-bg)',
                    color: isPro ? 'var(--success)' : 'var(--primary)',
                    border: isPro ? '1px solid var(--success-border)' : '1px solid var(--badge-primary-border)',
                  }}
                >
                  {activeTier.badge}
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0', maxWidth: '580px' }}>
                {activeTier.description}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-3">
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)' }}>
                {activeTier.price === 0 ? 'Free' : `$${activeTier.price}`}
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  {activeTier.price === 0 ? ' Forever' : ` / ${activeTier.period}`}
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: isPro ? 'var(--success)' : 'var(--text-muted)', fontWeight: 600 }}>
                {isPro ? '● Auto-renewal active' : 'Starter tier'}
              </div>
            </div>

            <Link
              to="/subscription"
              className="btn btn-primary text-sm flex items-center gap-2"
              style={{
                padding: '8px 18px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: 700,
              }}
            >
              <Zap size={16} />
              {isPro ? 'Switch / Renew Plan' : 'Upgrade to Pro ($39)'}
            </Link>
          </div>
        </div>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ marginBottom: '24px' }}>
          <div
            style={{
              background: 'var(--panel-inner-bg)',
              padding: '16px',
              borderRadius: '14px',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Safe Production Status
            </div>
            <div className="flex items-center gap-2" style={{ marginTop: '6px' }}>
              <ShieldCheck size={18} color={isPro ? 'var(--success)' : 'var(--text-muted)'} />
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: isPro ? 'var(--success)' : 'var(--text-muted)' }}>
                {isPro ? 'Active & Protected' : 'Locked (Requires Pro)'}
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '4px' }}>
              {isPro ? 'Zero-downtime atomic safeguards engaged' : 'Upgrade to enable atomic dry-run rollbacks'}
            </div>
          </div>

          <div
            style={{
              background: 'var(--panel-inner-bg)',
              padding: '16px',
              borderRadius: '14px',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              AI SecOps Assistant
            </div>
            <div className="flex items-center gap-2" style={{ marginTop: '6px' }}>
              <Sparkles size={18} color={isPro ? 'var(--primary)' : 'var(--text-muted)'} />
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: isPro ? 'var(--primary)' : 'var(--text-muted)' }}>
                {isPro ? '24/7 Priority Hotline' : 'Community Mode'}
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '4px' }}>
              {isPro ? 'Unlimited automated AI remediation recipes' : 'Basic threat descriptions'}
            </div>
          </div>

          <div
            style={{
              background: 'var(--panel-inner-bg)',
              padding: '16px',
              borderRadius: '14px',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Term & Expiration
            </div>
            <div className="flex items-center gap-2" style={{ marginTop: '6px' }}>
              <Calendar size={18} color="var(--accent)" />
              <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {formattedExpiry}
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '4px' }}>
              Subscribed on: {formattedSubscribed}
            </div>
          </div>
        </div>

        {/* Payment Method Details */}
        {currentPlan.paymentMethod && (
          <div
            style={{
              background: 'var(--panel-inner-bg)',
              padding: '16px 20px',
              borderRadius: '14px',
              border: '1px solid var(--border-color)',
            }}
            className="flex justify-between items-center flex-wrap gap-3"
          >
            <div className="flex items-center gap-3">
              <div style={{ padding: '8px', borderRadius: '10px', background: 'var(--badge-primary-bg)', color: 'var(--primary)' }}>
                <CreditCard size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Active Payment Method
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {currentPlan.paymentMethod.brand || 'Card'} ending in •••• {currentPlan.paymentMethod.last4 || '4242'} | Holder: {currentPlan.paymentMethod.cardHolder || 'Authorized User'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 700 }}>
                ✓ Verified on File
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Features Safeguards Breakdown */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div className="flex items-center gap-3" style={{ marginBottom: '20px' }}>
          <div style={{ padding: '10px', borderRadius: '12px', background: 'var(--badge-primary-bg)', color: 'var(--primary)' }}>
            <Layers size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 700 }}>Active Protection Safeguards</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              Detailed entitlement list for your current active subscription tier ({activeTier.name})
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tierFeaturesList.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--panel-inner-bg)',
                padding: '16px',
                borderRadius: '14px',
                border: item.active ? '1px solid var(--border-color)' : '1px dashed var(--border-color)',
                opacity: item.active ? 1 : 0.65,
              }}
              className="flex items-start gap-3"
            >
              <div style={{ marginTop: '2px' }}>
                {item.active ? (
                  <CheckCircle2 size={18} color="var(--success)" />
                ) : (
                  <XCircle size={18} color="var(--text-muted)" />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: item.active ? 'var(--text-main)' : 'var(--text-muted)' }}>
                    {item.title}
                  </span>
                  {item.proOnly && !isPro && (
                    <span style={{ fontSize: '0.68rem', padding: '1px 6px', borderRadius: '6px', background: 'var(--badge-primary-bg)', color: 'var(--primary)', fontWeight: 800 }}>
                      PRO
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Invoices & Billing History */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div className="flex justify-between items-center flex-wrap gap-3" style={{ marginBottom: '20px' }}>
          <div className="flex items-center gap-3">
            <div style={{ padding: '10px', borderRadius: '12px', background: 'var(--badge-primary-bg)', color: 'var(--primary)' }}>
              <Receipt size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 700 }}>Invoices & Payment Records</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Official tax receipts and payment verification records issued by CloudGuard AI
              </p>
            </div>
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Entity: <strong>CloudGuard SecOps Technologies Ltd.</strong>
          </div>
        </div>

        {invoices.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '48px 20px',
              background: 'var(--panel-inner-bg)',
              borderRadius: '16px',
              border: '1px dashed var(--border-color)',
            }}
          >
            <Receipt size={40} color="var(--text-muted)" style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <h4 style={{ fontSize: '1.05rem', margin: '0 0 6px', color: 'var(--text-main)' }}>No Invoices Yet</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 18px' }}>
              When you upgrade to Pro or Enterprise, all authenticated transaction receipts and PDF tax records will appear here.
            </p>
            <Link
              to="/subscription"
              className="btn btn-primary"
              style={{
                padding: '8px 20px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Zap size={16} /> Explore Pro Plans
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {invoices.map((inv) => {
              const websiteName = inv.websiteName || 'CloudGuard AI — Cloud Security Scanner';
              const planName = inv.planName || 'Pro Security Shield';
              const amount = inv.amount || 39;
              const dateStr = inv.purchaseTimestamp || (inv.formattedDate ? `${inv.formattedDate} at ${inv.formattedTime || '12:00 PM'}` : `${inv.date}`);
              const isUpi = inv.paymentMethodType === 'upi' || inv.upiId || (inv.paymentReference && inv.paymentReference.startsWith('UTR'));
              const isCrypto = inv.paymentMethodType === 'crypto' || inv.txHash || (inv.paymentReference && inv.paymentReference.startsWith('TxHash'));

              let methodDisplay = inv.paymentMethodLabel;
              if (!methodDisplay) {
                if (isUpi) methodDisplay = `UPI (${inv.upiId ? `VPA: ${inv.upiId}` : inv.paymentReference || 'UPI Transfer'})`;
                else if (isCrypto) methodDisplay = `Crypto (${inv.network ? inv.network.replace('_', ' ') : 'USDT'})`;
                else methodDisplay = inv.paymentReference ? `Card (${inv.paymentReference})` : 'Credit Card';
              }

              return (
                <div
                  key={inv.id}
                  style={{
                    background: 'var(--panel-inner-bg)',
                    padding: '18px 20px',
                    borderRadius: '14px',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    transition: 'var(--transition)',
                  }}
                >
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <span style={{ fontSize: '0.72rem', background: 'var(--badge-primary-bg)', color: 'var(--primary)', padding: '3px 8px', borderRadius: '6px', fontWeight: 800 }}>
                        {websiteName}
                      </span>
                      <span style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                        Invoice #{inv.id}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        • {planName}
                      </span>
                    </div>
                    <span style={{ color: 'var(--success)', fontWeight: 900, fontSize: '0.95rem' }}>
                      ${amount}.00 USD Paid ✓
                    </span>
                  </div>

                  <div className="flex justify-between items-center flex-wrap gap-3" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                    <div className="flex items-center gap-2">
                      {isUpi ? <Smartphone size={14} color="#097939" /> : isCrypto ? <Coins size={14} color="#f59e0b" /> : <CreditCard size={14} color="var(--primary)" />}
                      <span>Payment Method: <strong style={{ color: 'var(--text-main)' }}>{methodDisplay}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      <span>Issued: {dateStr}</span>
                    </div>
                    <button
                      onClick={() => handleOpenReceipt(inv)}
                      style={{
                        background: 'var(--badge-primary-bg)',
                        border: '1px solid var(--badge-primary-border)',
                        color: 'var(--primary)',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Receipt size={14} /> View Tax Receipt Modal
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Printable Receipt Modal */}
      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        invoice={selectedInvoice}
      />
    </div>
  );
}
