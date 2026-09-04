import { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ShieldCheck,
  X,
  CreditCard,
  Lock,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  ArrowRight,
  Shield,
  Activity,
  Bot
} from 'lucide-react';
import { useSubscription, PLAN_TIERS } from '../context/SubscriptionContext';

export default function SubscriptionCheckoutModal({ isOpen, onClose, selectedTierId = 'pro', billingCycle = 'monthly' }) {
  const { upgradeSubscription } = useSubscription();
  const targetTier = PLAN_TIERS[selectedTierId.toUpperCase()] || PLAN_TIERS.PRO;

  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'paypal' | 'crypto'
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState('Cloud SecOps Lead');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [couponCode, setCouponCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const basePrice = targetTier.price ?? 39;
  const discountedPrice = discountApplied ? Math.round(basePrice * 0.8) : basePrice;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'SECURE20' || couponCode.trim().toUpperCase() === 'PRO39') {
      setDiscountApplied(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid code. Try "SECURE20" for 20% off.');
    }
  };

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMsg('');

    // Simulate instant secure transaction
    setTimeout(() => {
      upgradeSubscription(selectedTierId, billingCycle, {
        brand: 'Visa',
        last4: cardNumber.replace(/\D/g, '').slice(-4) || '4242',
        exp: cardExp,
      });
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1200);
  };

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
        backgroundColor: 'rgba(3, 7, 18, 0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease',
        overflowY: 'auto',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isProcessing) onClose();
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '720px',
          maxHeight: '92vh',
          overflowY: 'auto',
          margin: 'auto',
          padding: '32px',
          borderRadius: '24px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--glass-shadow-hover)',
          position: 'relative',
          background: 'var(--panel-bg-solid)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isProcessing}
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

        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '24px 12px' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.2)',
                border: '2px solid var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)',
              }}
            >
              <CheckCircle2 size={44} color="var(--success)" />
            </div>

            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-main)' }}>
              Upgrade Confirmed!
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto 24px' }}>
              Your account is now activated as <strong>{targetTier.name}</strong>. Safe production auto-remediations, 24/7 instant AI SecOps hotline, and risk contribution analytics are unlocked.
            </p>

            <div
              style={{
                background: 'var(--panel-inner-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '16px 20px',
                maxWidth: '440px',
                margin: '0 auto 28px',
                textAlign: 'left',
              }}
            >
              <div className="flex justify-between items-center" style={{ marginBottom: '8px', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                <span style={{ color: 'var(--success)', fontWeight: 700 }}>Active & Protected ✓</span>
              </div>
              <div className="flex justify-between items-center" style={{ marginBottom: '8px', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Billed Amount:</span>
                <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>${discountedPrice} USD</span>
              </div>
              <div className="flex justify-between items-center" style={{ fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Safe Production Engine:</span>
                <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Zero-Downtime Guardrails Enabled</span>
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={onClose}
              style={{ padding: '12px 36px', fontSize: '1rem', fontWeight: 700 }}
            >
              Enter Cloud Security Portal <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3" style={{ marginBottom: '24px' }}>
              <div
                style={{
                  background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                  padding: '10px',
                  borderRadius: '14px',
                  boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)',
                }}
              >
                <Zap size={22} color="white" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                  Upgrade to {targetTier.name}
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Instant zero-downtime activation • 30-day money-back guarantee
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6" style={{ alignItems: 'start' }}>
              {/* Left Column: Plan Summary & Highlights */}
              <div
                style={{
                  background: 'var(--panel-inner-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '20px',
                }}
              >
                <div className="flex justify-between items-start" style={{ marginBottom: '16px' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', background: 'var(--badge-primary-bg)', color: 'var(--badge-primary-color)', border: '1px solid var(--badge-primary-border)', padding: '2px 8px', borderRadius: '8px', fontWeight: 700 }}>
                      SELECTED PLAN
                    </span>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '6px 0 0', color: 'var(--text-main)' }}>
                      {targetTier.name}
                    </h4>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      ${discountedPrice}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      /{targetTier.period}
                    </span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '10px' }}>
                    KEY HIGHLIGHTS:
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
                    <li className="flex items-center gap-2">
                      <ShieldCheck size={14} color="var(--success)" />
                      <span>Safe Production Zero-Downtime Auto-Fixes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles size={14} color="var(--primary)" />
                      <span>24/7 Instant AI SecOps Help Hotline</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Activity size={14} color="var(--success)" />
                      <span>Risk Contribution & Blast-Radius Simulator</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Layers size={14} color="var(--primary)" />
                      <span>Continuous Multi-Cloud Scanning (AWS/Azure/GCP)</span>
                    </li>
                  </ul>
                </div>

                {/* Coupon Box */}
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon (e.g. SECURE20)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      color: 'var(--text-main)',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="submit"
                    className="btn"
                    style={{
                      background: 'var(--badge-primary-bg)',
                      border: '1px solid var(--badge-primary-border)',
                      color: 'var(--badge-primary-color)',
                      padding: '8px 12px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    Apply
                  </button>
                </form>

                {discountApplied && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '6px', fontWeight: 600 }}>
                    ✓ 20% Security Discount Applied!
                  </div>
                )}
                {errorMsg && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--critical)', marginTop: '6px' }}>
                    {errorMsg}
                  </div>
                )}
              </div>

              {/* Right Column: Payment Form */}
              <div>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2" style={{ marginTop: '6px' }}>
                    {[
                      { id: 'card', label: 'Credit Card', icon: CreditCard },
                      { id: 'paypal', label: 'PayPal', icon: Zap },
                      { id: 'crypto', label: 'Crypto', icon: Lock },
                    ].map((m) => {
                      const Icon = m.icon;
                      const active = paymentMethod === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setPaymentMethod(m.id)}
                          style={{
                            padding: '8px',
                            borderRadius: '10px',
                            background: active ? 'var(--badge-primary-bg)' : 'var(--panel-inner-bg)',
                            border: active ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                            color: active ? 'var(--primary)' : 'var(--text-muted)',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                            cursor: 'pointer',
                          }}
                        >
                          <Icon size={16} />
                          {m.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <form onSubmit={handleProcessPayment} className="flex flex-col gap-3">
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Card Number</label>
                    <div style={{ position: 'relative' }}>
                      <CreditCard size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px 10px 36px',
                          background: 'var(--input-bg)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          color: 'var(--text-main)',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Name on Card</label>
                    <input
                      type="text"
                      required
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'var(--input-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        color: 'var(--text-main)',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Expiry</label>
                      <input
                        type="text"
                        required
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          background: 'var(--input-bg)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          color: 'var(--text-main)',
                          outline: 'none',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>CVC / CVV</label>
                      <input
                        type="password"
                        required
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          background: 'var(--input-bg)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          color: 'var(--text-main)',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="btn btn-primary"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      marginTop: '8px',
                      cursor: isProcessing ? 'wait' : 'pointer',
                    }}
                  >
                    {isProcessing ? 'Securing Transaction...' : `Pay $${discountedPrice} & Activate Now`}
                  </button>

                  <div className="flex items-center justify-center gap-2" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <Lock size={12} />
                    <span>256-Bit TLS End-to-End Encryption • Cancel Anytime</span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
