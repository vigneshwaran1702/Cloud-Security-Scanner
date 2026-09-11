import { createPortal } from 'react-dom';
import {
  ShieldCheck,
  X,
  Printer,
  Download,
  CheckCircle2,
  Calendar,
  CreditCard,
  Smartphone,
  Coins,
  FileText,
  Zap,
  Lock,
  Award
} from 'lucide-react';

export default function ReceiptModal({ isOpen, onClose, invoice }) {
  if (!isOpen || !invoice) return null;

  const websiteName = invoice.websiteName || 'CloudGuard AI — Cloud Security Scanner';
  const companyName = invoice.companyName || 'CloudGuard SecOps Technologies Ltd.';
  const planName = invoice.planName || 'Pro Security Shield';
  const amount = invoice.amount || 39;
  const formattedDate = invoice.formattedDate || invoice.date || new Date().toISOString().split('T')[0];
  const purchaseTime = invoice.formattedTime || invoice.purchaseTimestamp || '12:00 PM';
  const purchaseDateFull = invoice.purchaseTimestamp || `${formattedDate} at ${purchaseTime}`;

  // Normalize payment method info
  let methodIcon = <CreditCard size={18} color="var(--primary)" />;
  let methodTitle = 'Credit / Debit Card';
  let methodDetails = invoice.paymentReference || 'Card ending in 4242';

  if (invoice.paymentMethodType === 'upi' || invoice.upiId || invoice.utr) {
    methodIcon = <Smartphone size={18} color="#097939" />;
    methodTitle = 'UPI / Instant Bank Transfer';
    methodDetails = invoice.upiId
      ? `VPA: ${invoice.upiId} ${invoice.utr ? `• UTR: ${invoice.utr}` : ''}`
      : invoice.paymentReference || 'UPI Confirmed';
  } else if (invoice.paymentMethodType === 'crypto' || invoice.txHash || invoice.network) {
    methodIcon = <Coins size={18} color="#f59e0b" />;
    methodTitle = `Crypto (${invoice.network ? invoice.network.replace('_', ' ') : 'USDT'})`;
    methodDetails = invoice.txHash ? `TxHash: ${invoice.txHash}` : invoice.paymentReference || 'On-Chain Ledger';
  } else if (invoice.paymentMethodLabel) {
    methodDetails = invoice.paymentMethodLabel;
  }

  const features = invoice.planFeatures || [
    'Safe Production Zero-Downtime Auto-Remediation',
    '24/7 Instant AI SecOps Assistant',
    'Real-time Infrastructure Drift & Threat Alerts',
    'Multi-Cloud Account Connections (AWS / Azure / GCP)',
    '1-Click Automated Compliance PDF Reports'
  ];

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(3, 7, 18, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease',
        overflowY: 'auto',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '92vh',
          overflowY: 'auto',
          margin: 'auto',
          padding: '32px',
          borderRadius: '24px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
          position: 'relative',
          background: 'var(--panel-bg-solid)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'var(--panel-inner-bg)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-muted)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-main)';
            e.currentTarget.style.background = 'var(--badge-primary-bg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)';
            e.currentTarget.style.background = 'var(--panel-inner-bg)';
          }}
        >
          <X size={18} />
        </button>

        {/* Header: Brand & Invoice Meta */}
        <div className="flex justify-between items-start" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', marginBottom: '22px' }}>
          <div>
            <div className="flex items-center gap-2" style={{ marginBottom: '6px' }}>
              <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', padding: '6px', borderRadius: '10px' }}>
                <ShieldCheck size={20} color="white" />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {websiteName}
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {companyName}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                background: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--success)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '3px 10px',
                borderRadius: '8px',
                textTransform: 'uppercase',
              }}
            >
              Official Receipt ✓
            </span>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '6px' }}>
              {invoice.id}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
              Txn: {invoice.transactionId || invoice.id}
            </div>
          </div>
        </div>

        {/* 2-Column Overview */}
        <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '20px' }}>
          {/* Box 1: Package & Details */}
          <div style={{ background: 'var(--panel-inner-bg)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
              Subscribed Package
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
              {planName}
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 10px', lineHeight: 1.4 }}>
              {invoice.planDescription || 'Full autonomous cloud security & compliance defense.'}
            </p>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '6px' }}>
                Included Safeguards:
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.75rem', color: 'var(--text-main)' }}>
                {features.slice(0, 3).map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} color="var(--success)" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Box 2: Payment Method & Purchase Date */}
          <div style={{ background: 'var(--panel-inner-bg)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
                Payment Method Used
              </div>
              <div className="flex items-center gap-2" style={{ marginBottom: '4px' }}>
                {methodIcon}
                <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {methodTitle}
                </span>
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontFamily: 'monospace', wordBreak: 'break-all', marginBottom: '12px' }}>
                {methodDetails}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
                Date & Time of Purchase
              </div>
              <div className="flex items-center gap-1.5" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                <Calendar size={14} color="var(--primary)" />
                <span>{purchaseDateFull}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Summary Line Items */}
        <div style={{ background: 'var(--panel-inner-bg)', padding: '18px 20px', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '8px', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Package Rate ({planName}):</span>
            <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>${amount}.00 USD</span>
          </div>
          <div className="flex justify-between items-center" style={{ marginBottom: '8px', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Taxes & Cloud Compliance Surcharge:</span>
            <span style={{ color: 'var(--success)', fontWeight: 600 }}>$0.00 (Included)</span>
          </div>
          <div className="flex justify-between items-center" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '10px' }}>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>Total Amount Paid:</span>
            <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary)' }}>${amount}.00 USD</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <Lock size={13} />
            <span>Cryptographically Verified Receipt • 256-Bit TLS</span>
          </div>

          <div className="flex gap-2">
            <button
              className="btn btn-primary"
              onClick={() => window.print()}
              style={{
                padding: '10px 22px',
                fontSize: '0.88rem',
                fontWeight: 700,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              <Printer size={16} /> Print / Save PDF Receipt
            </button>
            <button
              className="btn"
              onClick={onClose}
              style={{
                background: 'var(--panel-inner-bg)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                padding: '10px 18px',
                borderRadius: '10px',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
