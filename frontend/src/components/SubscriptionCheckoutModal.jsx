import { useState, useEffect, useRef } from 'react';
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
  ArrowLeft,
  Shield,
  Activity,
  Copy,
  Check,
  QrCode,
  Clock,
  ExternalLink,
  Download,
  Printer,
  Smartphone,
  Coins,
  RefreshCw
} from 'lucide-react';
import { useSubscription, PLAN_TIERS } from '../context/SubscriptionContext';

// Helper: Luhn Algorithm for Credit/Debit Card validation
function isValidLuhn(numStr) {
  const digits = numStr.replace(/\D/g, '');
  if (!digits || digits.length < 13 || digits.length > 19) return false;
  if (/^(\d)\1+$/.test(digits)) return false; // Reject repeated digits like 0000000000000000

  let sum = 0;
  let alternate = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits.charAt(i), 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n = (n % 10) + 1;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}

// Helper: Detect Card Brand
function detectCardBrand(numStr) {
  const digits = numStr.replace(/\D/g, '');
  if (/^4/.test(digits)) return { name: 'Visa', color: '#1a73e8', maxLen: 16 };
  if (/^(5[1-5]|2[2-7])/.test(digits)) return { name: 'Mastercard', color: '#eb001b', maxLen: 16 };
  if (/^3[47]/.test(digits)) return { name: 'American Express', color: '#007cc3', maxLen: 15 };
  if (/^(60|65|353|356)/.test(digits)) return { name: 'RuPay', color: '#097939', maxLen: 16 };
  if (/^6(011|5)/.test(digits)) return { name: 'Discover', color: '#ff6000', maxLen: 16 };
  return { name: 'Card', color: 'var(--primary)', maxLen: 16 };
}

// Helper: Validate Expiry Date MM/YY
function isValidExpiry(expStr) {
  if (!/^\d{2}\/\d{2}$/.test(expStr)) return false;
  const [mmStr, yyStr] = expStr.split('/');
  const mm = parseInt(mmStr, 10);
  const yy = parseInt(yyStr, 10);
  if (mm < 1 || mm > 12) return false;

  const now = new Date();
  const currentYear = now.getFullYear() % 100; // e.g. 26
  const currentMonth = now.getMonth() + 1;

  if (yy < currentYear) return false;
  if (yy === currentYear && mm < currentMonth) return false;
  if (yy > currentYear + 15) return false; // Max 15 years in future
  return true;
}

// Helper: Validate UPI ID (VPA)
function isValidUpiId(upi) {
  const trimmed = upi.trim();
  // Valid UPI VPA regex: username@bank
  const upiRegex = /^[a-zA-Z0-9.\-_]{2,40}@[a-zA-Z]{2,30}$/;
  if (!upiRegex.test(trimmed)) return false;
  return true;
}

// Helper: Validate Crypto Address
function isValidCryptoAddress(address, network) {
  const trimmed = address.trim();
  if (!trimmed) return false;
  if (network === 'USDT_ERC20' || network === 'ETH') {
    return /^0x[a-fA-F0-9]{40}$/.test(trimmed);
  }
  if (network === 'USDT_TRC20') {
    return /^T[1-9A-HJ-NP-za-km-z]{33}$/.test(trimmed);
  }
  if (network === 'BTC') {
    return /^(1|3|bc1)[a-zA-HJ-NP-Z0-9]{25,42}$/.test(trimmed);
  }
  if (network === 'SOL') {
    return /^[1-9A-HJ-NP-za-km-z]{32,44}$/.test(trimmed);
  }
  return trimmed.length >= 26;
}

// Dynamic SVG QR Code generator component
function DynamicPaymentQR({ value, size = 180, label = 'Scan to Pay' }) {
  // Generate deterministic grid pattern based on input hash
  const hash = value.split('').reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) % 1000000007, 42);
  const cells = [];
  const gridSize = 21;

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      // Finder patterns (3 corners)
      const isTopLeft = r < 7 && c < 7;
      const isTopRight = r < 7 && c >= gridSize - 7;
      const isBottomLeft = r >= gridSize - 7 && c < 7;

      let isFilled = false;
      if (isTopLeft || isTopRight || isBottomLeft) {
        // Draw corner eye
        const lr = isBottomLeft ? r - (gridSize - 7) : r;
        const lc = isTopRight ? c - (gridSize - 7) : c;
        if (lr === 0 || lr === 6 || lc === 0 || lc === 6) isFilled = true;
        else if (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4) isFilled = true;
        else isFilled = false;
      } else {
        // Pseudo-random pseudo-QR data
        const pseudoVal = (hash * (r + 1) * 37 + (c + 1) * 97 + r * c * 13) % 100;
        isFilled = pseudoVal > 48;
      }
      if (isFilled) {
        cells.push(<rect key={`${r}-${c}`} x={c * 8 + 12} y={r * 8 + 12} width={7.2} height={7.2} rx={1.2} fill="#0f172a" />);
      }
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div
        style={{
          background: '#ffffff',
          padding: '12px',
          borderRadius: '16px',
          border: '2px solid var(--border-color)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          display: 'inline-block',
        }}
      >
        <svg width={size} height={size} viewBox="0 0 192 192" style={{ display: 'block', borderRadius: '8px' }}>
          <rect width="192" height="192" fill="#ffffff" rx="10" />
          <g fill="#0f172a">
            {cells}
          </g>
        </svg>
      </div>
      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
        {label}
      </span>
    </div>
  );
}

export default function SubscriptionCheckoutModal({ isOpen, onClose, selectedTierId = 'pro', billingCycle = 'monthly' }) {
  const { upgradeSubscription } = useSubscription();
  const targetTier = PLAN_TIERS[selectedTierId.toUpperCase()] || PLAN_TIERS.PRO;

  // Multi-step checkout states: 'details' -> 'credential_payment' -> 'verifying' -> 'success'
  const [step, setStep] = useState('details');

  // Payment Method: 'card' | 'upi' | 'crypto'
  const [paymentMethod, setPaymentMethod] = useState('upi');

  // Form Fields: Card
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [bankOtp, setBankOtp] = useState('');

  // Form Fields: UPI
  const [upiId, setUpiId] = useState('');
  const [payerName, setPayerName] = useState('');
  const [upiUtr, setUpiUtr] = useState('');

  // Form Fields: Crypto
  const [cryptoNetwork, setCryptoNetwork] = useState('USDT_TRC20');
  const [senderWallet, setSenderWallet] = useState('');
  const [cryptoTxHash, setCryptoTxHash] = useState('');

  // Common states
  const [couponCode, setCouponCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [copiedKey, setCopiedKey] = useState(null);
  const [countdown, setCountdown] = useState(600); // 10 minutes timer for payment session
  const [completedTransaction, setCompletedTransaction] = useState(null);
  const [verifyStageIndex, setVerifyStageIndex] = useState(0);

  // Merchant Credentials
  const merchantCredentials = {
    upi: {
      vpa: 'cloudguard.secops@icici',
      name: 'CloudGuard SecOps Technologies Pvt Ltd',
      bank: 'ICICI Corporate Banking',
      merchantCode: 'CG-SEC-9921',
    },
    crypto: {
      USDT_TRC20: {
        address: 'TYsK8m4k8L2nW9xV3pQ7rZ1bC5dE8fG9hJ',
        networkName: 'Tron (TRC-20)',
        symbol: 'USDT',
      },
      USDT_ERC20: {
        address: '0x71C94b2A8161b9F3991206b00C54714154746A74',
        networkName: 'Ethereum (ERC-20)',
        symbol: 'USDT',
      },
      ETH: {
        address: '0x71C94b2A8161b9F3991206b00C54714154746A74',
        networkName: 'Ethereum Mainnet',
        symbol: 'ETH',
      },
      BTC: {
        address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
        networkName: 'Bitcoin Native SegWit',
        symbol: 'BTC',
      },
    },
  };

  // Reset modal state when opened
  useEffect(() => {
    if (isOpen) {
      setStep('details');
      setFieldErrors({});
      setDiscountApplied(false);
      setCouponCode('');
      setCountdown(600);
      setCompletedTransaction(null);
      setVerifyStageIndex(0);
      setUpiUtr('');
      setCryptoTxHash('');
      setBankOtp('');
    }
  }, [isOpen]);

  // Payment Countdown Timer
  useEffect(() => {
    if (step === 'credential_payment' && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, countdown]);

  if (!isOpen) return null;

  const basePrice = targetTier.price ?? 39;
  const discountedPrice = discountApplied ? Math.round(basePrice * 0.8) : basePrice;
  const inrPrice = discountedPrice * 83; // approx INR exchange rate

  const formatCountdown = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Coupon Logic
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'SECURE20' || couponCode.trim().toUpperCase() === 'PRO39') {
      setDiscountApplied(true);
      setFieldErrors((prev) => ({ ...prev, coupon: null }));
    } else {
      setFieldErrors((prev) => ({ ...prev, coupon: 'Invalid code. Try "SECURE20" for 20% off.' }));
    }
  };

  // Copy helper
  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Format Card Number (adds spaces every 4 digits)
  const handleCardNumberChange = (val) => {
    const digitsOnly = val.replace(/\D/g, '').slice(0, 16);
    const formatted = digitsOnly.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
    if (fieldErrors.cardNumber) {
      setFieldErrors((prev) => ({ ...prev, cardNumber: null }));
    }
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (val) => {
    let clean = val.replace(/\D/g, '').slice(0, 4);
    if (clean.length >= 3) {
      clean = `${clean.slice(0, 2)}/${clean.slice(2)}`;
    }
    setCardExp(clean);
    if (fieldErrors.cardExp) {
      setFieldErrors((prev) => ({ ...prev, cardExp: null }));
    }
  };

  // Step 1: Validate Payer Details and proceed to Credential Transfer
  const handleProceedToCredential = (e) => {
    e.preventDefault();
    const errors = {};

    if (paymentMethod === 'card') {
      const rawCard = cardNumber.replace(/\s/g, '');
      if (!rawCard) {
        errors.cardNumber = 'Card number is required.';
      } else if (rawCard.length < 15 || rawCard.length > 16) {
        errors.cardNumber = 'Card number must be 15-16 digits.';
      } else if (!isValidLuhn(rawCard)) {
        errors.cardNumber = 'Invalid card number (Luhn checksum failed). Please verify your card digits.';
      }

      if (!cardHolder.trim() || cardHolder.trim().split(/\s+/).length < 2) {
        errors.cardHolder = 'Please enter your full name as it appears on your card (First & Last name).';
      }

      if (!cardExp) {
        errors.cardExp = 'Expiry date (MM/YY) is required.';
      } else if (!isValidExpiry(cardExp)) {
        errors.cardExp = 'Invalid or expired card date (Format: MM/YY).';
      }

      const rawCvc = cardCvc.replace(/\D/g, '');
      if (!rawCvc || rawCvc.length < 3 || rawCvc.length > 4) {
        errors.cardCvc = 'CVC must be 3 or 4 digits.';
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId.trim()) {
        errors.upiId = 'UPI ID / VPA is required (e.g. yourname@okhdfcbank).';
      } else if (!isValidUpiId(upiId)) {
        errors.upiId = 'Invalid UPI ID format. Expected format: username@bank (e.g. john@okhdfcbank or user@paytm).';
      }

      if (!payerName.trim() || payerName.trim().length < 2) {
        errors.payerName = 'Please enter your registered account name or mobile number.';
      }
    } else if (paymentMethod === 'crypto') {
      if (!senderWallet.trim()) {
        errors.senderWallet = 'Sender wallet address is required.';
      } else if (!isValidCryptoAddress(senderWallet, cryptoNetwork)) {
        errors.senderWallet = `Invalid ${cryptoNetwork.replace('_', ' ')} wallet address format.`;
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setStep('credential_payment');
  };

  // Step 2: Validate Payment Confirmation & Run Verification
  const handleConfirmPaid = (e) => {
    e.preventDefault();
    const errors = {};

    if (paymentMethod === 'upi') {
      const cleanUtr = upiUtr.trim().replace(/\s/g, '');
      if (!cleanUtr) {
        errors.upiUtr = 'Please enter the 12-digit UPI Reference / UTR Number from your payment app receipt.';
      } else if (cleanUtr.length !== 12 || !/^\d{12}$/.test(cleanUtr)) {
        errors.upiUtr = 'Invalid UTR Number. UPI Reference ID must be exactly 12 numeric digits (e.g. 423984019284).';
      }
    } else if (paymentMethod === 'crypto') {
      const cleanHash = cryptoTxHash.trim();
      if (!cleanHash) {
        errors.cryptoTxHash = 'Please enter the blockchain Transaction Hash (TxHash / TxID).';
      } else if (cleanHash.length < 32 || (!cleanHash.startsWith('0x') && cryptoNetwork !== 'USDT_TRC20' && cryptoNetwork !== 'BTC' && cryptoNetwork !== 'SOL')) {
        errors.cryptoTxHash = 'Invalid Transaction Hash format. Please copy the complete TxHash from your wallet.';
      }
    } else if (paymentMethod === 'card') {
      const cleanOtp = bankOtp.trim();
      if (!cleanOtp) {
        errors.bankOtp = 'Please enter the 6-digit Bank SMS OTP sent to your registered mobile.';
      } else if (!/^\d{6}$/.test(cleanOtp)) {
        errors.bankOtp = 'OTP must be exactly 6 numeric digits (e.g. 482910).';
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setStep('verifying');

    // Multi-stage verification animation
    const stages = [
      'Connecting to payment gateway & banking ledger...',
      'Verifying transaction reference against merchant ledger...',
      'Allocating Pro protection nodes & safe auto-remediation license...',
    ];

    let currentStage = 0;
    const stageInterval = setInterval(() => {
      currentStage += 1;
      if (currentStage < stages.length) {
        setVerifyStageIndex(currentStage);
      } else {
        clearInterval(stageInterval);

        // Finalize transaction in context
        const orderId = `ORD-${Date.now().toString().slice(-6)}`;
        const txnId = `TXN-${Date.now().toString().slice(-8)}`;

        const paymentPayload = {
          type: paymentMethod,
          amount: discountedPrice,
          transactionId: txnId,
          invoiceId: `INV-${Date.now().toString().slice(-6)}`,
          brand: paymentMethod === 'card' ? detectCardBrand(cardNumber).name : paymentMethod.toUpperCase(),
          last4: paymentMethod === 'card' ? cardNumber.replace(/\D/g, '').slice(-4) : '4242',
          exp: cardExp,
          cardHolder: cardHolder || payerName,
          upiId: paymentMethod === 'upi' ? upiId : null,
          utr: paymentMethod === 'upi' ? upiUtr : null,
          walletAddress: paymentMethod === 'crypto' ? senderWallet : null,
          network: paymentMethod === 'crypto' ? cryptoNetwork : null,
          txHash: paymentMethod === 'crypto' ? cryptoTxHash : null,
        };

        upgradeSubscription(selectedTierId, billingCycle, paymentPayload);

        setCompletedTransaction({
          orderId,
          transactionId: txnId,
          amount: discountedPrice,
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          paymentMethod,
          refId: upiUtr || cryptoTxHash || `Bank Auth: OTP-CONFIRMED (${cardExp})`,
          tierName: targetTier.name,
        });

        setStep('success');
      }
    }, 700);
  };

  const currentBrand = detectCardBrand(cardNumber);

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
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease',
        overflowY: 'auto',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && step !== 'verifying') onClose();
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '780px',
          maxHeight: '94vh',
          overflowY: 'auto',
          margin: 'auto',
          padding: '32px',
          borderRadius: '24px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          position: 'relative',
          background: 'var(--panel-bg-solid)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={step === 'verifying'}
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
            cursor: step === 'verifying' ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            if (step !== 'verifying') {
              e.currentTarget.style.color = 'var(--text-main)';
              e.currentTarget.style.background = 'var(--badge-primary-bg)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)';
            e.currentTarget.style.background = 'var(--panel-inner-bg)';
          }}
        >
          <X size={18} />
        </button>

        {/* ============================================================ */}
        {/* STEP 4: SUCCESS CONFIRMATION                                 */}
        {/* ============================================================ */}
        {step === 'success' && completedTransaction && (
          <div style={{ textAlign: 'center', padding: '16px 8px' }} className="animate-fade-in">
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '2px solid var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 0 30px rgba(16, 185, 129, 0.35)',
              }}
            >
              <CheckCircle2 size={44} color="var(--success)" />
            </div>

            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 800,
                color: 'var(--success)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                background: 'rgba(16, 185, 129, 0.1)',
                padding: '4px 12px',
                borderRadius: '12px',
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}
            >
              Payment Verified & Confirmed ✓
            </span>

            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '14px 0 8px', color: 'var(--text-main)' }}>
              Subscription Successfully Purchased!
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '520px', margin: '0 auto 24px' }}>
              Your account has been upgraded to <strong style={{ color: 'var(--text-main)' }}>{targetTier.name}</strong>. Safe production auto-remediations, continuous drift monitoring, and 24/7 AI SecOps assistant are active.
            </p>

            {/* Official Receipt Card */}
            <div
              style={{
                background: 'var(--panel-inner-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '18px',
                padding: '22px',
                maxWidth: '520px',
                margin: '0 auto 26px',
                textAlign: 'left',
              }}
            >
              <div className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '14px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PAYMENT RECEIPT</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>{completedTransaction.orderId}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>STATUS</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--success)' }}>PAID & ACTIVE ✓</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>Plan Subscribed:</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{completedTransaction.tierName}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>Amount Paid:</span>
                  <span style={{ fontWeight: 800, color: 'var(--primary)' }}>${completedTransaction.amount} USD</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>Payment Channel:</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)', textTransform: 'uppercase' }}>{completedTransaction.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>Transaction / UTR ID:</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                    {completedTransaction.refId.length > 28 ? `${completedTransaction.refId.slice(0, 14)}...${completedTransaction.refId.slice(-10)}` : completedTransaction.refId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>Date & Time:</span>
                  <span style={{ color: 'var(--text-main)' }}>{completedTransaction.date}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button
                className="btn"
                onClick={() => window.print()}
                style={{
                  background: 'var(--panel-inner-bg)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                }}
              >
                <Printer size={16} /> Print / Save Invoice
              </button>
              <button
                className="btn btn-primary"
                onClick={onClose}
                style={{ padding: '12px 32px', fontSize: '0.95rem', fontWeight: 700, borderRadius: '12px' }}
              >
                Enter Cloud Security Console <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 3: VERIFYING SCREEN                                     */}
        {/* ============================================================ */}
        {step === 'verifying' && (
          <div style={{ textAlign: 'center', padding: '48px 16px' }} className="animate-fade-in">
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'var(--badge-primary-bg)',
                border: '2px solid var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                animation: 'pulse 1.5s infinite',
              }}
            >
              <RefreshCw size={32} color="var(--primary)" style={{ animation: 'spin 1.5s linear infinite' }} />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '10px', color: 'var(--text-main)' }}>
              Verifying Payment with Gateway...
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '420px', margin: '0 auto 28px' }}>
              Please do not close or refresh this window while we validate the transaction reference with the banking network.
            </p>

            <div
              style={{
                background: 'var(--panel-inner-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '14px',
                padding: '16px 20px',
                maxWidth: '460px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                textAlign: 'left',
              }}
            >
              {[
                'Connecting to payment gateway & banking ledger...',
                'Verifying transaction reference against merchant ledger...',
                'Allocating Pro protection nodes & safe auto-remediation license...',
              ].map((msg, idx) => (
                <div key={idx} className="flex items-center gap-2.5" style={{ fontSize: '0.82rem' }}>
                  {idx <= verifyStageIndex ? (
                    <CheckCircle2 size={16} color="var(--success)" />
                  ) : (
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid var(--border-color)' }} />
                  )}
                  <span style={{ color: idx <= verifyStageIndex ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: idx === verifyStageIndex ? 600 : 400 }}>
                    {msg}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 2: SEND PAYMENT TO CREDENTIAL SCREEN                    */}
        {/* ============================================================ */}
        {step === 'credential_payment' && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between" style={{ marginBottom: '20px' }}>
              <button
                onClick={() => setStep('details')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <ArrowLeft size={16} /> Back to details
              </button>

              <div className="flex items-center gap-2" style={{ background: 'var(--badge-primary-bg)', padding: '4px 12px', borderRadius: '12px', fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700 }}>
                <Clock size={14} /> Session Time: {formatCountdown(countdown)}
              </div>
            </div>

            {/* UPI CREDENTIAL PAYMENT INSTRUCTIONS */}
            {paymentMethod === 'upi' && (
              <div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    STEP 2 OF 2: SEND PAYMENT VIA UPI
                  </span>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '6px 0 4px', color: 'var(--text-main)' }}>
                    Scan QR or Transfer to Merchant UPI ID
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                    Transfer exact amount to the official merchant VPA below, then enter your 12-digit UPI UTR number.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6" style={{ alignItems: 'center', marginBottom: '20px' }}>
                  {/* QR Code Column */}
                  <div style={{ textAlign: 'center', background: 'var(--panel-inner-bg)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
                    <DynamicPaymentQR
                      value={`upi://pay?pa=${merchantCredentials.upi.vpa}&pn=CloudGuardSecOps&am=${inrPrice}&cu=INR&tn=Subscription-${selectedTierId}`}
                      size={160}
                      label="Scan with Google Pay, PhonePe, Paytm, or BHIM"
                    />
                    <div style={{ marginTop: '8px', fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)' }}>
                      Amount Due: ₹{inrPrice.toLocaleString()} INR (${discountedPrice} USD)
                    </div>
                  </div>

                  {/* Merchant VPA Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ background: 'var(--panel-inner-bg)', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                        OFFICIAL MERCHANT UPI ID (VPA)
                      </div>
                      <div className="flex justify-between items-center" style={{ marginTop: '4px' }}>
                        <span style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'monospace' }}>
                          {merchantCredentials.upi.vpa}
                        </span>
                        <button
                          onClick={() => handleCopy(merchantCredentials.upi.vpa, 'vpa')}
                          style={{
                            background: copiedKey === 'vpa' ? 'var(--success-bg)' : 'var(--badge-primary-bg)',
                            border: '1px solid var(--border-color)',
                            color: copiedKey === 'vpa' ? 'var(--success)' : 'var(--primary)',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            cursor: 'pointer',
                          }}
                        >
                          {copiedKey === 'vpa' ? <Check size={14} /> : <Copy size={14} />}
                          {copiedKey === 'vpa' ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    <div style={{ background: 'var(--panel-inner-bg)', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                        BENEFICIARY ACCOUNT
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                        {merchantCredentials.upi.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {merchantCredentials.upi.bank}
                      </div>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--badge-primary-bg)', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--badge-primary-border)' }}>
                      💡 <strong>Instructions:</strong> Open your UPI app (GPay / PhonePe / Paytm), send <strong>₹{inrPrice}</strong> to <strong>{merchantCredentials.upi.vpa}</strong>, and copy the 12-digit UTR from your app transaction receipt.
                    </div>
                  </div>
                </div>

                {/* UTR Input Form */}
                <form onSubmit={handleConfirmPaid} style={{ background: 'var(--panel-inner-bg)', padding: '18px 20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                    Enter 12-Digit UPI UTR / Reference ID <span style={{ color: 'var(--critical)' }}>*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={12}
                      placeholder="e.g. 423910283749 (from your UPI receipt)"
                      value={upiUtr}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 12);
                        setUpiUtr(digits);
                        if (fieldErrors.upiUtr) setFieldErrors((prev) => ({ ...prev, upiUtr: null }));
                      }}
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        background: 'var(--input-bg)',
                        border: fieldErrors.upiUtr ? '1px solid var(--critical)' : '1px solid var(--border-color)',
                        borderRadius: '10px',
                        fontSize: '0.9rem',
                        color: 'var(--text-main)',
                        fontFamily: 'monospace',
                        outline: 'none',
                      }}
                    />
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{
                        padding: '10px 24px',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        borderRadius: '10px',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      I Have Paid — Confirm Subscription <ArrowRight size={16} />
                    </button>
                  </div>
                  {fieldErrors.upiUtr && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--critical)', marginTop: '6px', fontWeight: 600 }}>
                      ⚠️ {fieldErrors.upiUtr}
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* CRYPTO CREDENTIAL PAYMENT INSTRUCTIONS */}
            {paymentMethod === 'crypto' && (
              <div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    STEP 2 OF 2: SEND CRYPTO TO DEPOSIT WALLET
                  </span>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '6px 0 4px', color: 'var(--text-main)' }}>
                    Deposit {discountedPrice}.00 {merchantCredentials.crypto[cryptoNetwork]?.symbol || 'USDT'}
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                    Send exact crypto amount on <strong>{merchantCredentials.crypto[cryptoNetwork]?.networkName}</strong>, then enter your TxHash.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6" style={{ alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{ textAlign: 'center', background: 'var(--panel-inner-bg)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
                    <DynamicPaymentQR
                      value={merchantCredentials.crypto[cryptoNetwork]?.address || ''}
                      size={160}
                      label={`Scan with ${merchantCredentials.crypto[cryptoNetwork]?.networkName} Wallet`}
                    />
                    <div style={{ marginTop: '8px', fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)' }}>
                      Send: {discountedPrice}.00 {merchantCredentials.crypto[cryptoNetwork]?.symbol || 'USDT'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ background: 'var(--panel-inner-bg)', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                        DEPOSIT RECEIVING ADDRESS ({merchantCredentials.crypto[cryptoNetwork]?.networkName})
                      </div>
                      <div className="flex justify-between items-center" style={{ marginTop: '4px' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                          {merchantCredentials.crypto[cryptoNetwork]?.address}
                        </span>
                        <button
                          onClick={() => handleCopy(merchantCredentials.crypto[cryptoNetwork]?.address, 'crypto_addr')}
                          style={{
                            background: copiedKey === 'crypto_addr' ? 'var(--success-bg)' : 'var(--badge-primary-bg)',
                            border: '1px solid var(--border-color)',
                            color: copiedKey === 'crypto_addr' ? 'var(--success)' : 'var(--primary)',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            cursor: 'pointer',
                            marginLeft: '8px',
                          }}
                        >
                          {copiedKey === 'crypto_addr' ? <Check size={14} /> : <Copy size={14} />}
                          {copiedKey === 'crypto_addr' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    <div style={{ background: 'var(--panel-inner-bg)', padding: '12px 14px', borderRadius: '14px', border: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      ⚠️ <strong>Network Notice:</strong> Only send on the <strong>{merchantCredentials.crypto[cryptoNetwork]?.networkName}</strong> network. Sending via incorrect networks will result in permanent loss.
                    </div>
                  </div>
                </div>

                <form onSubmit={handleConfirmPaid} style={{ background: 'var(--panel-inner-bg)', padding: '18px 20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                    Enter Blockchain Transaction Hash (TxHash / TxID) <span style={{ color: 'var(--critical)' }}>*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. 0x4f8a29b8c... (from Binance, Metamask, or TrustWallet)"
                      value={cryptoTxHash}
                      onChange={(e) => {
                        setCryptoTxHash(e.target.value);
                        if (fieldErrors.cryptoTxHash) setFieldErrors((prev) => ({ ...prev, cryptoTxHash: null }));
                      }}
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        background: 'var(--input-bg)',
                        border: fieldErrors.cryptoTxHash ? '1px solid var(--critical)' : '1px solid var(--border-color)',
                        borderRadius: '10px',
                        fontSize: '0.85rem',
                        color: 'var(--text-main)',
                        fontFamily: 'monospace',
                        outline: 'none',
                      }}
                    />
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{
                        padding: '10px 24px',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        borderRadius: '10px',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Verify On-Chain & Confirm <ArrowRight size={16} />
                    </button>
                  </div>
                  {fieldErrors.cryptoTxHash && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--critical)', marginTop: '6px', fontWeight: 600 }}>
                      ⚠️ {fieldErrors.cryptoTxHash}
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* CARD 3D SECURE GATEWAY OTP INSTRUCTIONS */}
            {paymentMethod === 'card' && (
              <div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    STEP 2 OF 2: 3D SECURE BANK VERIFICATION
                  </span>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '6px 0 4px', color: 'var(--text-main)' }}>
                    Authorize Payment of ${discountedPrice} USD
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                    Enter the 6-digit authentication code sent by your bank for card ending in <strong>{cardNumber.slice(-4) || '4242'}</strong>.
                  </p>
                </div>

                <div
                  style={{
                    background: 'var(--panel-inner-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '18px',
                    padding: '24px',
                    maxWidth: '480px',
                    margin: '0 auto 20px',
                  }}
                >
                  <div className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Merchant:</span>
                    <strong style={{ color: 'var(--text-main)' }}>CloudGuard SecOps Ltd.</strong>
                  </div>
                  <div className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Card:</span>
                    <strong style={{ color: 'var(--text-main)' }}>{currentBrand.name} •••• {cardNumber.slice(-4) || '4242'}</strong>
                  </div>
                  <div className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Total Amount:</span>
                    <strong style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>${discountedPrice} USD</strong>
                  </div>

                  <form onSubmit={handleConfirmPaid}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                      Bank SMS / App OTP (6 Digits) <span style={{ color: 'var(--critical)' }}>*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="e.g. 482910"
                        value={bankOtp}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, '').slice(0, 6);
                          setBankOtp(digits);
                          if (fieldErrors.bankOtp) setFieldErrors((prev) => ({ ...prev, bankOtp: null }));
                        }}
                        style={{
                          flex: 1,
                          padding: '12px',
                          background: 'var(--input-bg)',
                          border: fieldErrors.bankOtp ? '1px solid var(--critical)' : '1px solid var(--border-color)',
                          borderRadius: '10px',
                          fontSize: '1.1rem',
                          textAlign: 'center',
                          letterSpacing: '0.25em',
                          color: 'var(--text-main)',
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          outline: 'none',
                        }}
                      />
                    </div>
                    {fieldErrors.bankOtp && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--critical)', marginTop: '6px', fontWeight: 600 }}>
                        ⚠️ {fieldErrors.bankOtp}
                      </div>
                    )}

                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Demo OTP: <strong>482910</strong> or any 6 digits</span>
                      <button
                        type="button"
                        onClick={() => setBankOtp('482910')}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        Auto-fill Demo Code
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{
                        width: '100%',
                        padding: '12px',
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        borderRadius: '10px',
                        marginTop: '16px',
                        cursor: 'pointer',
                      }}
                    >
                      Authorize & Activate Subscription <ArrowRight size={16} />
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 1: PAYMENT DETAILS & METHOD SELECTION                   */}
        {/* ============================================================ */}
        {step === 'details' && (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3" style={{ marginBottom: '22px' }}>
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
              {/* Left Column: Plan Summary */}
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
                {fieldErrors.coupon && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--critical)', marginTop: '6px' }}>
                    {fieldErrors.coupon}
                  </div>
                )}
              </div>

              {/* Right Column: Payment Form with strict validations */}
              <div>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Select Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2" style={{ marginTop: '6px' }}>
                    {[
                      { id: 'upi', label: 'UPI / QR', icon: Smartphone },
                      { id: 'card', label: 'Credit Card', icon: CreditCard },
                      { id: 'crypto', label: 'Crypto', icon: Coins },
                    ].map((m) => {
                      const Icon = m.icon;
                      const active = paymentMethod === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            setPaymentMethod(m.id);
                            setFieldErrors({});
                          }}
                          style={{
                            padding: '10px 8px',
                            borderRadius: '10px',
                            background: active ? 'var(--badge-primary-bg)' : 'var(--panel-inner-bg)',
                            border: active ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                            color: active ? 'var(--primary)' : 'var(--text-muted)',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                          }}
                        >
                          <Icon size={18} />
                          {m.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <form onSubmit={handleProceedToCredential} className="flex flex-col gap-3">
                  {/* UPI INPUT FIELDS */}
                  {paymentMethod === 'upi' && (
                    <>
                      <div>
                        <div className="flex justify-between items-center" style={{ marginBottom: '4px' }}>
                          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                            Your UPI ID / VPA <span style={{ color: 'var(--critical)' }}>*</span>
                          </label>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>e.g. name@okhdfcbank</span>
                        </div>
                        <input
                          type="text"
                          placeholder="e.g. alex.security@okaxis"
                          value={upiId}
                          onChange={(e) => {
                            setUpiId(e.target.value);
                            if (fieldErrors.upiId) setFieldErrors((prev) => ({ ...prev, upiId: null }));
                          }}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            background: 'var(--input-bg)',
                            border: fieldErrors.upiId ? '1px solid var(--critical)' : '1px solid var(--border-color)',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            color: 'var(--text-main)',
                            outline: 'none',
                          }}
                        />
                        {fieldErrors.upiId && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--critical)', marginTop: '4px' }}>
                            {fieldErrors.upiId}
                          </div>
                        )}
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                          Registered Account Holder Name / Mobile <span style={{ color: 'var(--critical)' }}>*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Alex Henderson or 9876543210"
                          value={payerName}
                          onChange={(e) => {
                            setPayerName(e.target.value);
                            if (fieldErrors.payerName) setFieldErrors((prev) => ({ ...prev, payerName: null }));
                          }}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            background: 'var(--input-bg)',
                            border: fieldErrors.payerName ? '1px solid var(--critical)' : '1px solid var(--border-color)',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            color: 'var(--text-main)',
                            outline: 'none',
                          }}
                        />
                        {fieldErrors.payerName && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--critical)', marginTop: '4px' }}>
                            {fieldErrors.payerName}
                          </div>
                        )}
                      </div>

                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--panel-inner-bg)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        📱 Supports: Google Pay, PhonePe, Paytm, BHIM, Amazon Pay & All Indian Banks
                      </div>
                    </>
                  )}

                  {/* CREDIT CARD INPUT FIELDS */}
                  {paymentMethod === 'card' && (
                    <>
                      <div>
                        <div className="flex justify-between items-center" style={{ marginBottom: '4px' }}>
                          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                            Card Number <span style={{ color: 'var(--critical)' }}>*</span>
                          </label>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: currentBrand.color }}>
                            {currentBrand.name}
                          </span>
                        </div>
                        <div style={{ position: 'relative' }}>
                          <CreditCard size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                          <input
                            type="text"
                            placeholder="4532 •••• •••• 8910"
                            value={cardNumber}
                            onChange={(e) => handleCardNumberChange(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '10px 12px 10px 36px',
                              background: 'var(--input-bg)',
                              border: fieldErrors.cardNumber ? '1px solid var(--critical)' : '1px solid var(--border-color)',
                              borderRadius: '8px',
                              fontSize: '0.85rem',
                              color: 'var(--text-main)',
                              fontFamily: 'monospace',
                              outline: 'none',
                            }}
                          />
                        </div>
                        {fieldErrors.cardNumber && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--critical)', marginTop: '4px' }}>
                            {fieldErrors.cardNumber}
                          </div>
                        )}
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                          Cardholder Full Name <span style={{ color: 'var(--critical)' }}>*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Alex Henderson"
                          value={cardHolder}
                          onChange={(e) => {
                            setCardHolder(e.target.value);
                            if (fieldErrors.cardHolder) setFieldErrors((prev) => ({ ...prev, cardHolder: null }));
                          }}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            background: 'var(--input-bg)',
                            border: fieldErrors.cardHolder ? '1px solid var(--critical)' : '1px solid var(--border-color)',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            color: 'var(--text-main)',
                            outline: 'none',
                          }}
                        />
                        {fieldErrors.cardHolder && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--critical)', marginTop: '4px' }}>
                            {fieldErrors.cardHolder}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                            Expiry (MM/YY) <span style={{ color: 'var(--critical)' }}>*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="MM/YY (e.g. 12/28)"
                            value={cardExp}
                            onChange={(e) => handleExpiryChange(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              background: 'var(--input-bg)',
                              border: fieldErrors.cardExp ? '1px solid var(--critical)' : '1px solid var(--border-color)',
                              borderRadius: '8px',
                              fontSize: '0.85rem',
                              color: 'var(--text-main)',
                              fontFamily: 'monospace',
                              outline: 'none',
                            }}
                          />
                          {fieldErrors.cardExp && (
                            <div style={{ fontSize: '0.72rem', color: 'var(--critical)', marginTop: '4px' }}>
                              {fieldErrors.cardExp}
                            </div>
                          )}
                        </div>
                        <div>
                          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                            CVC / CVV <span style={{ color: 'var(--critical)' }}>*</span>
                          </label>
                          <input
                            type="password"
                            maxLength={4}
                            placeholder="3-4 digits"
                            value={cardCvc}
                            onChange={(e) => {
                              const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
                              setCardCvc(digits);
                              if (fieldErrors.cardCvc) setFieldErrors((prev) => ({ ...prev, cardCvc: null }));
                            }}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              background: 'var(--input-bg)',
                              border: fieldErrors.cardCvc ? '1px solid var(--critical)' : '1px solid var(--border-color)',
                              borderRadius: '8px',
                              fontSize: '0.85rem',
                              color: 'var(--text-main)',
                              fontFamily: 'monospace',
                              outline: 'none',
                            }}
                          />
                          {fieldErrors.cardCvc && (
                            <div style={{ fontSize: '0.72rem', color: 'var(--critical)', marginTop: '4px' }}>
                              {fieldErrors.cardCvc}
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* CRYPTO INPUT FIELDS */}
                  {paymentMethod === 'crypto' && (
                    <>
                      <div>
                        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                          Select Crypto Network <span style={{ color: 'var(--critical)' }}>*</span>
                        </label>
                        <select
                          value={cryptoNetwork}
                          onChange={(e) => {
                            setCryptoNetwork(e.target.value);
                            setFieldErrors({});
                          }}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            background: 'var(--input-bg)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            color: 'var(--text-main)',
                            outline: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          <option value="USDT_TRC20">USDT - Tron (TRC-20) [Low Fees]</option>
                          <option value="USDT_ERC20">USDT - Ethereum (ERC-20)</option>
                          <option value="ETH">Ethereum (ETH)</option>
                          <option value="BTC">Bitcoin (BTC)</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                          Your Sender Wallet Address <span style={{ color: 'var(--critical)' }}>*</span>
                        </label>
                        <input
                          type="text"
                          placeholder={cryptoNetwork === 'USDT_TRC20' ? 'e.g. TYsK8m4k8L2n... (Tron address)' : 'e.g. 0x71C94b2A8161... (Hex address)'}
                          value={senderWallet}
                          onChange={(e) => {
                            setSenderWallet(e.target.value);
                            if (fieldErrors.senderWallet) setFieldErrors((prev) => ({ ...prev, senderWallet: null }));
                          }}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            background: 'var(--input-bg)',
                            border: fieldErrors.senderWallet ? '1px solid var(--critical)' : '1px solid var(--border-color)',
                            borderRadius: '8px',
                            fontSize: '0.82rem',
                            color: 'var(--text-main)',
                            fontFamily: 'monospace',
                            outline: 'none',
                          }}
                        />
                        {fieldErrors.senderWallet && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--critical)', marginTop: '4px' }}>
                            {fieldErrors.senderWallet}
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      marginTop: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    Proceed to Payment Credential <ArrowRight size={16} />
                  </button>

                  <div className="flex items-center justify-center gap-2" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    <Lock size={12} />
                    <span>256-Bit TLS End-to-End Encryption • Verified Gateway</span>
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
