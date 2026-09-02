import { useState, useRef, useEffect } from 'react';
import { apiRequest } from '../services/api';
import { Cloud, ShieldCheck, CheckCircle2, AlertTriangle, X, Loader2, RefreshCw, Server, Activity, ShieldAlert } from 'lucide-react';

export default function CloudAccountVerifierModal({ isOpen, onClose, triggerRef }) {
  const [provider, setProvider] = useState('AWS');
  const [accountId, setAccountId] = useState('891230912401');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const popoverRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        (!triggerRef?.current || !triggerRef.current.contains(event.target))
      ) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

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
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await apiRequest('/api/v1/cloud/verify-account', {
        method: 'POST',
        body: JSON.stringify({ provider, account_id: accountId }),
      });
      setResult(data.account_status);
    } catch (err) {
      setError(err.message || 'Failed to verify cloud account status.');
    } finally {
      setLoading(false);
    }
  };

  // Render as anchored popover dropdown if triggerRef is provided
  if (triggerRef) {
    return (
      <div
        ref={popoverRef}
        style={{
          position: 'absolute',
          top: 'calc(100% + 12px)',
          left: 0,
          width: '500px',
          maxWidth: 'calc(100vw - 32px)',
          zIndex: 9999,
          background: 'var(--panel-bg-solid)',
          border: '1px solid var(--border-color)',
          borderRadius: '20px',
          boxShadow: 'var(--glass-shadow-hover)',
          padding: '24px',
          animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          color: 'var(--text-main)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          title="Close"
        >
          <X size={20} />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3" style={{ marginBottom: '18px' }}>
          <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', padding: '10px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)' }}>
            <ShieldCheck size={22} color="white" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>Cloud Status Verification</h3>
            <p style={{ margin: '2px 0 0 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              Verify cloud connection credentials & live score.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleVerify} className="flex flex-col gap-3">
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
              Cloud Provider
            </label>
            <div className="grid grid-cols-3 gap-2">
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
                    if (p.name === 'AWS') setAccountId('891230912401');
                    if (p.name === 'Azure') setAccountId('sub-89123-az-4019');
                    if (p.name === 'GCP') setAccountId('cloudguard-sec-prod');
                  }}
                  style={{
                    background: provider === p.name ? `${p.color}25` : 'var(--panel-inner-bg)',
                    border: `1px solid ${provider === p.name ? p.color : 'var(--border-color)'}`,
                    borderRadius: '10px',
                    padding: '8px',
                    color: 'var(--text-main)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    transition: 'var(--transition)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Cloud size={14} color={p.color} />
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
              Account ID / Subscription ID
            </label>
            <input
              type="text"
              required
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              placeholder="e.g. 891230912401 or sub-89123-az"
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'var(--input-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                color: 'var(--text-main)',
                fontSize: '0.88rem',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '10px', borderRadius: '10px', fontWeight: 600, fontSize: '0.88rem', marginTop: '4px' }}
          >
            {loading ? (
              <>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                Verifying Account...
              </>
            ) : (
              <>
                <RefreshCw size={16} />
                Verify Status Now
              </>
            )}
          </button>
        </form>

        {error && (
          <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(239,68,68,0.15)', border: '1px solid var(--critical)', borderRadius: '8px', color: 'var(--critical)', fontSize: '0.8rem' }}>
            {error}
          </div>
        )}

        {/* Verification Result Display */}
        {result && (
          <div style={{
            marginTop: '16px',
            background: 'var(--panel-inner-bg)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '14px',
            padding: '14px',
            animation: 'fadeIn 0.3s ease',
          }}>
            <div className="flex justify-between items-center" style={{ marginBottom: '12px' }}>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} color="var(--success)" />
                <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                  {result.provider} Status Verified
                </span>
              </div>
              <span style={{
                background: 'rgba(16, 185, 129, 0.2)',
                color: 'var(--success)',
                padding: '3px 8px',
                borderRadius: '16px',
                fontSize: '0.72rem',
                fontWeight: 700
              }}>
                {result.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2" style={{ marginBottom: '12px' }}>
              <div style={{ background: 'var(--panel-bg-solid)', border: '1px solid var(--border-color)', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Score</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--success)' }}>{result.security_score}/100</div>
              </div>
              <div style={{ background: 'var(--panel-bg-solid)', border: '1px solid var(--border-color)', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Resources</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>{result.total_resources}</div>
              </div>
              <div style={{ background: 'var(--panel-bg-solid)', border: '1px solid var(--border-color)', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Region</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginTop: '4px' }}>{result.region}</div>
              </div>
            </div>

            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              <div><strong>Compliance:</strong> <span style={{ color: 'var(--text-main)' }}>{result.compliance_status}</span></div>
              <div><strong>Services:</strong> <span style={{ color: 'var(--text-main)' }}>{result.monitored_services?.join(', ')}</span></div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Centered Modal Mode when opened without triggerRef
  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(3, 7, 18, 0.75)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2500,
        animation: 'fadeIn 0.25s ease',
        padding: '16px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={popoverRef}
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '560px',
          padding: '32px',
          borderRadius: '24px',
          position: 'relative',
          boxShadow: 'var(--glass-shadow-hover)',
          background: 'var(--panel-bg-solid)',
          border: '1px solid var(--border-color)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          title="Close"
        >
          <X size={22} />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3" style={{ marginBottom: '20px' }}>
          <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', padding: '12px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)' }}>
            <ShieldCheck size={26} color="white" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-main)' }}>Cloud Account Status Verification</h2>
            <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Verify cloud connection status, credentials, and live security score.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
              Cloud Provider
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
                    if (p.name === 'AWS') setAccountId('891230912401');
                    if (p.name === 'Azure') setAccountId('sub-89123-az-4019');
                    if (p.name === 'GCP') setAccountId('cloudguard-sec-prod');
                  }}
                  style={{
                    background: provider === p.name ? `${p.color}25` : 'var(--panel-inner-bg)',
                    border: `1px solid ${provider === p.name ? p.color : 'var(--border-color)'}`,
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
                    gap: '8px'
                  }}
                >
                  <Cloud size={16} color={p.color} />
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
              Account ID / Subscription / Project ID
            </label>
            <input
              type="text"
              required
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              placeholder="e.g. 891230912401 or sub-89123-az"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'var(--input-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                color: 'var(--text-main)',
                fontSize: '0.95rem',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', borderRadius: '12px', fontWeight: 600, fontSize: '0.95rem' }}
          >
            {loading ? (
              <>
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                Verifying Account Status...
              </>
            ) : (
              <>
                <RefreshCw size={18} />
                Verify Cloud Account Status
              </>
            )}
          </button>
        </form>

        {error && (
          <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(239,68,68,0.15)', border: '1px solid var(--critical)', borderRadius: '10px', color: 'var(--critical)', fontSize: '0.85rem' }}>
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
                  {result.provider} Account Verified
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
              <div style={{ background: 'var(--panel-bg-solid)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Security Score</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--success)' }}>{result.security_score}/100</div>
              </div>
              <div style={{ background: 'var(--panel-bg-solid)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Monitored Resources</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)' }}>{result.total_resources}</div>
              </div>
              <div style={{ background: 'var(--panel-bg-solid)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active Region</div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary)', marginTop: '4px' }}>{result.region}</div>
              </div>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              <div><strong>Compliance:</strong> <span style={{ color: 'var(--text-main)' }}>{result.compliance_status}</span></div>
              <div><strong>Monitored Services:</strong> <span style={{ color: 'var(--text-main)' }}>{result.monitored_services?.join(', ')}</span></div>
              <div><strong>Last Verified:</strong> <span style={{ color: 'var(--text-main)' }}>{result.last_verification}</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
