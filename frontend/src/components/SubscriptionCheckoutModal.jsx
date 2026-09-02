import { useState } from 'react';
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

  const basePrice = billingCycle === 'yearly' ? targetTier.priceYearly : targetTier.priceMonthly;
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

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(10, 15, 29, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.25s ease forwards',
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
          padding: '32px',
          borderRadius: '24px',
          border: '1px solid rgba(139, 92, 246, 0.4)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(139, 92, 246, 0.2)',
          position: 'relative',
          background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
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
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
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
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
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
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(59, 130, 246, 0.25))',
                border: '2px solid var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)',
                animation: 'fadeIn 0.5s ease',
              }}
            >
              <ShieldCheck size={44} color="var(--success)" />
            </div>

            <div style={{
              display: 'inline-block',
              padding: '4px 14px',
              borderRadius: '20px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34d399',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Subscription Active & Verified
            </div>

            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px', color: '#fff' }}>
              Welcome to <span className="gradient-text">{targetTier.name}</span>!
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto 28px' }}>
              Your account has been upgraded. All premium safeguards including <strong style={{ color: '#fff' }}>Safe Production Auto-Remediation</strong>, <strong style={{ color: '#fff' }}>24/7 Instant AI SecOps Help</strong>, and <strong style={{ color: '#fff' }}>Risk Contribution Analytics</strong> are now fully unlocked.
            </p>

            {/* Unlocked Features Highlights */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '12px',
                marginBottom: '28px',
                textAlign: 'left',
              }}
            >
              <div style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '14px', borderRadius: '12px' }}>
                <div className="flex items-center gap-2" style={{ color: '#60a5fa', fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px' }}>
                  <ShieldCheck size={16} /> Safe Production
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Automated rollback-safe remediation activated.</div>
              </div>

              <div style={{ background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.2)', padding: '14px', borderRadius: '12px' }}>
                <div className="flex items-center gap-2" style={{ color: '#c084fc', fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px' }}>
                  <Bot size={16} /> 24/7 Instant Help
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Priority SecOps AI hotline ready in chat drawer.</div>
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '14px', borderRadius: '12px' }}>
                <div className="flex items-center gap-2" style={{ color: '#34d399', fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px' }}>
                  <Activity size={16} /> Risk Contribution
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Deep blast-radius matrix fully available.</div>
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={onClose}
              style={{
                width: '100%',
                maxWidth: '320px',
                padding: '14px 24px',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '12px',
                cursor: 'pointer',
              }}
            >
              Start Exploring Pro Features <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3" style={{ marginBottom: '20px' }}>
              <div
                style={{
                  background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                  padding: '10px',
                  borderRadius: '14px',
                  boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)',
                }}
              >
                <Zap size={22} color="white" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>
                  Upgrade to <span className="gradient-text">{targetTier.name}</span>
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                  Instant activation • Safe Production protection • 24/7 Instant Help
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6" style={{ alignItems: 'start' }}>
              {/* Left Column: Order Summary */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '20px',
                }}
              >
                <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>Selected Plan:</span>
                  <span
                    style={{
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))',
                      border: '1px solid rgba(139, 92, 246, 0.4)',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: '#c084fc',
                    }}
                  >
                    ${targetTier.price}/mo
                  </span>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>{targetTier.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Billed {billingCycle === 'yearly' ? 'annually ($390/yr - save 2 months)' : 'monthly ($39/mo)'}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '10px' }}>
                    What's instantly unlocked:
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={16} color="var(--success)" />
                      <strong style={{ color: '#fff' }}>Safe Production Auto-Fixes</strong> (zero downtime)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={16} color="var(--success)" />
                      <strong style={{ color: '#fff' }}>Instant Help 24/7</strong> AI SecOps Hotline
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={16} color="var(--success)" />
                      <strong style={{ color: '#fff' }}>Risk Contribution Matrix</strong> & blast radius
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={16} color="var(--success)" />
                      <span>Continuous Real-Time Multi-Cloud Drift Detection</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={16} color="var(--success)" />
                      <span>Unlimited Cloud Accounts (AWS, Azure, GCP)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={16} color="var(--success)" />
                      <span>1-Click SOC2 & CIS Compliance PDF Reports</span>
                    </li>
                  </ul>
                </div>

                {/* Coupon Input */}
                <form onSubmit={handleApplyCoupon} style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Promo code (e.g. SECURE20)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    style={{
                      flex: 1,
                      background: 'rgba(0, 0, 0, 0.25)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.8rem',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="submit"
                    className="btn"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                    }}
                  >
                    Apply
                  </button>
                </form>

                {discountApplied && (
                  <div style={{ marginTop: '8px', fontSize: '0.78rem', color: 'var(--success)', fontWeight: 600 }}>
                    ✓ 20% Security Discount Applied!
                  </div>
                )}
                {errorMsg && (
                  <div style={{ marginTop: '8px', fontSize: '0.78rem', color: 'var(--critical)', fontWeight: 500 }}>
                    {errorMsg}
                  </div>
                )}

                {/* Total Line */}
                <div
                  className="flex justify-between items-center"
                  style={{
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    marginTop: '16px',
                    paddingTop: '14px',
                  }}
                >
                  <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-muted)' }}>Due Today:</span>
                  <div style={{ textAlign: 'right' }}>
                    {discountApplied && (
                      <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.85rem', marginRight: '6px' }}>
                        ${basePrice}
                      </span>
                    )}
                    <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
                      ${discountedPrice}
                      <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-muted)' }}>
                        /{billingCycle === 'yearly' ? 'yr' : 'mo'}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Payment Form */}
              <form onSubmit={handleProcessPayment} className="flex flex-col gap-4">
                {/* Method selector */}
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                    Payment Method
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {[
                      { id: 'card', label: 'Credit Card', icon: CreditCard },
                      { id: 'paypal', label: 'PayPal / UPI', icon: Zap },
                      { id: 'crypto', label: 'Corporate Inv.', icon: Shield },
                    ].map(method => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        style={{
                          background: paymentMethod === method.id ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                          border: paymentMethod === method.id ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                          color: paymentMethod === method.id ? '#60a5fa' : 'var(--text-muted)',
                          padding: '10px 8px',
                          borderRadius: '10px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        <method.icon size={16} />
                        {method.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Card Inputs */}
                <div className="flex flex-col gap-3">
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      required
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Jane Doe"
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border-color)',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '0.85rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
                      Card Number
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4242 4242 4242 4242"
                        style={{
                          width: '100%',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border-color)',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '0.85rem',
                          outline: 'none',
                          letterSpacing: '0.05em',
                        }}
                      />
                      <CreditCard size={18} color="var(--text-muted)" style={{ position: 'absolute', right: '12px', top: '11px' }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
                        Expiration
                      </label>
                      <input
                        type="text"
                        required
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value)}
                        placeholder="MM/YY"
                        style={{
                          width: '100%',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border-color)',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '0.85rem',
                          outline: 'none',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
                        CVC / CVV
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="•••"
                        style={{
                          width: '100%',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border-color)',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '0.85rem',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* 256-bit encryption guarantee */}
                <div className="flex items-center gap-2" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <Lock size={14} color="var(--success)" />
                  <span>256-bit SSL encrypted • Instant access & cancel anytime</span>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="btn btn-primary"
                  style={{
                    padding: '14px 20px',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    width: '100%',
                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                    marginTop: '8px',
                    boxShadow: '0 8px 25px rgba(59, 130, 246, 0.5)',
                  }}
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <Sparkles size={18} style={{ animation: 'spin 1s linear infinite' }} />
                      Activating $39 Pro Subscription...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Confirm & Upgrade (${discountedPrice}) <ArrowRight size={18} />
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
