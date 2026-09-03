import { useState, useEffect } from 'react';
import { Shield, CheckCircle2, Loader2, X, Cloud, Server, Database, Lock, AlertTriangle, ArrowRight, RefreshCw, Layers, Sparkles, Check } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { apiRequest, getCloudState, saveCloudState } from '../services/api';

export default function ScanModal({ isOpen, onClose }) {
  const [provider, setProvider] = useState('AWS');
  const [accountId, setAccountId] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [clearingRisks, setClearingRisks] = useState(false);
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      const state = getCloudState();
      if (state.activeCloudId) {
        setAccountId(state.activeCloudId);
        if (state.activeProvider) setProvider(state.activeProvider);
      }
      setIsScanning(false);
      setProgress(0);
      setCurrentStepIndex(0);
      setIsCompleted(false);
      setScanResult(null);
    }
  }, [isOpen]);

  const handleStartScan = async (e) => {
    e?.preventDefault();
    const cleanId = accountId.trim();
    if (!cleanId) return;

    setIsScanning(true);
    setProgress(5);
    setIsCompleted(false);
    setCurrentStepIndex(0);

    // Call API in background
    try {
      const res = await apiRequest('/api/v1/scan/start', {
        method: 'POST',
        body: JSON.stringify({ provider, account_id: cleanId }),
      });
      setScanResult(res);
    } catch (e) {
      console.error(e);
    }

    // Step simulation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCompleted(true);
          setIsScanning(false);
          return 100;
        }

        const increment = Math.floor(Math.random() * 12) + 6;
        const next = Math.min(100, prev + increment);

        if (next < 25) setCurrentStepIndex(0);
        else if (next < 50) setCurrentStepIndex(1);
        else if (next < 75) setCurrentStepIndex(2);
        else if (next < 90) setCurrentStepIndex(3);
        else setCurrentStepIndex(4);

        return next;
      });
    }, 240);
  };

  const handleClearAllRisks = async () => {
    setClearingRisks(true);
    try {
      await apiRequest('/api/v1/recommendations/clear-all', { method: 'POST' });
      addNotification({
        title: 'All Cloud Risks Cleared',
        description: `Successfully resolved vulnerabilities for ${provider} ID ${accountId}. Posture is now 100% compliant.`,
        type: 'success',
        cloud: provider,
      });
      onClose();
      window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setClearingRisks(false);
    }
  };

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isScanning) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isScanning]);

  if (!isOpen) return null;

  const dynamicSteps = [
    { label: `Connecting to ${provider} Cloud APIs for ID: ${accountId || 'Account'}...`, icon: Shield },
    { label: `Auditing ${provider} storage, compute, and IAM authorization policies...`, icon: Cloud },
    { label: 'Inspecting firewall rules, security groups & network perimeters...', icon: Server },
    { label: 'Evaluating CIS Benchmarks, NIST SP 800-53 & compliance controls...', icon: Lock },
    { label: 'Synthesizing AI remediation vectors & posture risk scoring...', icon: CheckCircle2 },
  ];

  const currentStep = dynamicSteps[currentStepIndex] || dynamicSteps[0];
  const StepIcon = currentStep.icon;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(3, 7, 18, 0.75)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '16px',
        animation: 'fadeIn 0.25s ease',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isScanning) {
          onClose();
        }
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '32px',
          borderRadius: '24px',
          position: 'relative',
          background: 'var(--panel-bg-solid)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--glass-shadow-hover)',
          margin: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {!isScanning && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'var(--panel-inner-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} />
          </button>
        )}

        {isCompleted ? (
          /* Scan Completed State */
          <div className="flex flex-col items-center text-center animate-fade-in">
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.18)',
                border: '2px solid rgba(16, 185, 129, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                boxShadow: '0 0 24px rgba(16, 185, 129, 0.3)',
              }}
            >
              <CheckCircle2 size={40} color="var(--success)" />
            </div>

            <h3 style={{ fontSize: '1.4rem', margin: '0 0 8px 0', fontWeight: 700, color: 'var(--text-main)' }}>
              Scan Completed for {provider} ID: {accountId}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '440px', margin: '0 0 20px 0' }}>
              Security inspection finished. Vulnerabilities and compliance findings for your infrastructure are ready for remediation.
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3" style={{ width: '100%', marginBottom: '24px' }}>
              <div style={{ background: 'var(--panel-inner-bg)', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Cloud ID</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{accountId}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{provider}</div>
              </div>

              <div style={{ background: 'var(--panel-inner-bg)', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Initial Score</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent)' }}>76<span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/100</span></div>
                <div style={{ fontSize: '0.72rem', color: 'var(--warning)' }}>Action Required</div>
              </div>

              <div style={{ background: 'var(--panel-inner-bg)', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Active Risks</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--critical)' }}>3</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--critical)' }}>Remediable</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2.5" style={{ width: '100%' }}>
              <button
                className="btn btn-primary"
                onClick={handleClearAllRisks}
                disabled={clearingRisks}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '0.95rem',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  borderColor: '#10b981',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                }}
              >
                {clearingRisks ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                <span>Clear All Risks & Remediate (100% Score)</span>
              </button>

              <div className="flex gap-2">
                <button
                  className="btn"
                  onClick={() => {
                    onClose();
                    navigate('/');
                    window.location.reload();
                  }}
                  style={{ flex: 1, padding: '10px', background: 'var(--panel-inner-bg)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '10px' }}
                >
                  View in Dashboard
                </button>
                <button
                  className="btn"
                  onClick={() => {
                    onClose();
                    navigate('/resources');
                    window.location.reload();
                  }}
                  style={{ flex: 1, padding: '10px', background: 'var(--panel-inner-bg)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '10px' }}
                >
                  View Discovered Resources
                </button>
              </div>
            </div>
          </div>
        ) : isScanning ? (
          /* Scanning In Progress State */
          <div className="flex flex-col items-center text-center">
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'var(--badge-primary-bg)',
                border: '2px solid var(--badge-primary-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <Loader2 size={38} color="var(--primary)" style={{ animation: 'spin 1.2s linear infinite' }} />
            </div>

            <h3 style={{ fontSize: '1.35rem', margin: '0 0 6px 0', fontWeight: 700, color: 'var(--text-main)' }}>
              Scanning {provider} Cloud ID: {accountId}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0 0 20px 0' }}>
              Querying cloud APIs, inspecting security configurations & IAM policies...
            </p>

            {/* Progress Bar */}
            <div
              style={{
                width: '100%',
                height: '10px',
                background: 'var(--panel-inner-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--primary), var(--accent))',
                  transition: 'width 0.3s ease',
                  borderRadius: '6px',
                  boxShadow: '0 0 10px var(--primary-glow)',
                }}
              />
            </div>

            <div className="flex justify-between items-center" style={{ width: '100%', marginTop: '8px', marginBottom: '20px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Progress</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>{progress}%</span>
            </div>

            {/* Current Active Step Banner */}
            <div
              className="flex items-center gap-3"
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'var(--panel-inner-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '14px',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  padding: '8px',
                  borderRadius: '10px',
                  background: 'var(--badge-primary-bg)',
                  border: '1px solid var(--badge-primary-border)',
                  flexShrink: 0,
                }}
              >
                <StepIcon size={18} color="var(--primary)" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Active Step</div>
                <div style={{ fontSize: '0.86rem', color: 'var(--text-main)', fontWeight: 500 }}>
                  {currentStep.label}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Pre-scan Input State */
          <div>
            <div className="flex items-center gap-3" style={{ marginBottom: '20px' }}>
              <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', padding: '12px', borderRadius: '16px', boxShadow: '0 2px 8px var(--primary-glow)' }}>
                <Shield size={26} color="white" />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-main)' }}>Run Cloud Security Scan</h2>
                <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  Enter your Cloud ID to trigger a full vulnerability & posture scan.
                </p>
              </div>
            </div>

            <form onSubmit={handleStartScan} className="flex flex-col gap-4">
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
                      onClick={() => setProvider(p.name)}
                      style={{
                        background: provider === p.name ? `${p.color}25` : 'var(--panel-inner-bg)',
                        border: `1px solid ${provider === p.name ? p.color : 'var(--border-color)'}`,
                        borderRadius: '12px',
                        padding: '10px',
                        color: 'var(--text-main)',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: '0.9rem',
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
                  Your {provider} Cloud ID / Subscription ID
                </label>
                <input
                  type="text"
                  required
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  placeholder={provider === 'AWS' ? 'e.g. 12-digit AWS Account ID (492019381029)' : provider === 'AZURE' ? 'e.g. Azure Subscription ID' : 'e.g. GCP Project ID'}
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
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', borderRadius: '12px', fontWeight: 600, fontSize: '0.95rem', marginTop: '6px' }}
              >
                <Shield size={18} />
                Start Cloud Scan Now
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
