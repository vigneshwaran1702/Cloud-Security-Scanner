import { useState, useRef, useEffect } from 'react';
import { apiRequest, getCloudState } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Cloud, ShieldCheck, CheckCircle2, X, Loader2, RefreshCw, ArrowRight, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CloudAccountVerifierModal({ isOpen, onClose }) {
  const { user, openAuthModal } = useAuth();
  const [provider, setProvider] = useState('AWS');
  const [accountId, setAccountId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [, setScanInitiated] = useState(false);
  const modalContentRef = useRef(null);
  const navigate = useNavigate();

  // Load existing active cloud ID if user already entered one
  useEffect(() => {
    if (isOpen) {
      const state = getCloudState();
      if (state.activeCloudId) {
        setAccountId(state.activeCloudId);
        if (state.activeProvider) setProvider(state.activeProvider);
      }
      setError('');
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleVerify = async (e) => {
    e?.preventDefault();

    if (!user) {
      openAuthModal({
        title: 'Create Account or Log In',
        subtitle: 'Please create an account or sign in first to enter and verify your Cloud ID.',
        onSuccess: () => {
          handleVerify();
        }
      });
      return;
    }

    const cleanId = accountId.trim();
    if (!cleanId) {
      setError('Please enter your Cloud Account ID / Subscription ID.');
      return;
    }

    // Provider format validation
    if (provider === 'AWS' && cleanId.length < 5) {
      setError('Please enter a valid AWS Account ID (e.g. 12-digit number or identifier).');
      return;
    }
    if (provider === 'AZURE' && cleanId.length < 5) {
      setError('Please enter a valid Azure Subscription ID or Tenant UUID.');
      return;
    }
    if (provider === 'GCP' && cleanId.length < 3) {
      setError('Please enter a valid GCP Project ID.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await apiRequest('/api/v1/cloud/verify-account', {
        method: 'POST',
        body: JSON.stringify({ provider, account_id: cleanId }),
      });
      setResult(data.account_status);

      // Automatically scan to prepare live dashboard
      await apiRequest('/api/v1/scan/start', {
        method: 'POST',
        body: JSON.stringify({ provider, account_id: cleanId }),
      });
      setScanInitiated(true);
    } catch (err) {
      setError(err.message || 'Failed to verify cloud account status.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearRisksDirectly = async () => {
    try {
      setLoading(true);
      await apiRequest('/api/v1/recommendations/clear-all', { method: 'POST' });
      onClose();
      window.location.reload();
    } catch (err) {
      setError('Failed to clear risks: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getPlaceholder = () => {
    if (provider === 'AWS') return 'Enter 12-digit AWS Account ID (e.g., 492019381029)';
    if (provider === 'AZURE') return 'Enter Azure Subscription ID / Tenant ID';
    return 'Enter GCP Project ID (e.g., my-cloud-project-prod)';
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(3, 7, 18, 0.75)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2500,
        padding: '20px',
        animation: 'fadeIn 0.25s ease',
        overflowY: 'auto',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div
        ref={modalContentRef}
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '32px',
          borderRadius: '24px',
          position: 'relative',
          boxShadow: 'var(--glass-shadow-hover)',
          background: 'var(--panel-bg-solid)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-main)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'var(--panel-inner-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'var(--transition)',
          }}
          title="Close Modal"
        >
          <X size={20} />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3" style={{ marginBottom: '20px', paddingRight: '36px' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              padding: '12px',
              borderRadius: '16px',
              boxShadow: '0 2px 8px var(--primary-glow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={26} color="white" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)' }}>Verify Your Cloud ID</h2>
            <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Connect your AWS Account ID, Azure Subscription ID, or GCP Project ID to verify & scan live posture.
            </p>
          </div>
        </div>

        {/* Account requirement banner if guest */}
        {!user && (
          <div style={{
            background: 'rgba(26, 115, 232, 0.08)',
            border: '1px solid rgba(26, 115, 232, 0.25)',
            borderRadius: '14px',
            padding: '14px 16px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <div className="flex items-center gap-2.5">
              <Lock size={18} color="#1a73e8" />
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Account Required to Connect Cloud ID
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Please create an account or sign in to enter and connect your cloud ID.
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => openAuthModal({ title: 'Create Account', subtitle: 'Create an account to connect and verify your cloud infrastructure.' })}
              className="btn btn-primary"
              style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '8px', background: '#1a73e8', borderColor: '#1a73e8' }}
            >
              Create Account / Login
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Select Cloud Provider
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: 'AWS', color: '#ff9900' },
                { name: 'Azure', color: '#0078d4' },
                { name: 'GCP', color: '#4285f4' }
              ].map(p => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => {
                    setProvider(p.name);
                    setError('');
                  }}
                  style={{
                    background: provider === p.name ? `${p.color}20` : 'var(--panel-inner-bg)',
                    border: `1.5px solid ${provider === p.name ? p.color : 'var(--border-color)'}`,
                    borderRadius: '12px',
                    padding: '10px',
                    color: 'var(--text-main)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'var(--transition)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: provider === p.name ? `0 0 12px ${p.color}30` : 'none',
                  }}
                >
                  <Cloud size={16} color={p.color} />
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Your {provider} Account ID / Subscription / Project ID
            </label>
            <input
              type="text"
              required
              value={accountId}
              onChange={(e) => {
                setAccountId(e.target.value);
                setError('');
              }}
              placeholder={getPlaceholder()}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'var(--input-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                color: 'var(--text-main)',
                fontSize: '0.95rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {loading ? (
              <>
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                Verifying Cloud Account...
              </>
            ) : (
              <>
                <RefreshCw size={18} />
                Verify & Inspect Security Status
              </>
            )}
          </button>
        </form>

        {error && (
          <div style={{ marginTop: '16px', padding: '12px', background: 'var(--critical-bg)', border: '1px solid var(--critical-border)', borderRadius: '12px', color: 'var(--critical)', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        {/* Verification Result Display */}
        {result && (
          <div style={{
            marginTop: '20px',
            background: 'var(--panel-inner-bg)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '16px',
            padding: '20px',
            animation: 'fadeIn 0.3s ease',
          }}>
            <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={20} color="var(--success)" />
                <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>
                  {result.provider} ID: {result.account_id} Verified
                </span>
              </div>
              <span style={{
                background: 'rgba(16, 185, 129, 0.2)',
                color: 'var(--success)',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '0.78rem',
                fontWeight: 700
              }}>
                {result.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3" style={{ marginBottom: '16px' }}>
              <div style={{ background: 'var(--panel-bg-solid)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Initial Score</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent)' }}>{result.security_score}/100</div>
              </div>
              <div style={{ background: 'var(--panel-bg-solid)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Discovered Resources</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)' }}>{result.total_resources}</div>
              </div>
              <div style={{ background: 'var(--panel-bg-solid)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active Region</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--primary)', marginTop: '4px' }}>{result.region}</div>
              </div>
            </div>

            <div className="flex gap-3" style={{ marginTop: '16px' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  onClose();
                  navigate('/');
                  window.location.reload();
                }}
                style={{ flex: 1, padding: '12px', fontSize: '0.92rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                Go To Live Dashboard <ArrowRight size={16} />
              </button>
              <button
                type="button"
                className="btn"
                onClick={handleClearRisksDirectly}
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: 'var(--success)',
                  padding: '12px 18px',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  borderRadius: '12px'
                }}
              >
                Clear All Risks
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
