import { useState, useEffect } from 'react';
import { Shield, CheckCircle2, Loader2, X, Cloud, Server, Database, Lock, AlertTriangle, ArrowRight, RefreshCw, Layers } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

const scanSteps = [
  { label: 'Initializing CloudGuard Security Engine...', icon: Shield, pct: 15 },
  { label: 'Scanning AWS: 184 S3 buckets, EC2 & IAM policies...', icon: Cloud, pct: 38 },
  { label: 'Scanning Azure: 112 Managed Identities & Key Vaults...', icon: Server, pct: 62 },
  { label: 'Scanning GCP: 60 Cloud SQL databases & BigQuery...', icon: Database, pct: 82 },
  { label: 'Evaluating CIS, PCI-DSS & HIPAA compliance...', icon: Lock, pct: 94 },
  { label: 'Finalizing AI risk synthesis & remediation recommendations...', icon: CheckCircle2, pct: 100 },
];

export default function ScanModal({ isOpen, onClose }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setCurrentStepIndex(0);
      setIsCompleted(false);
      return;
    }

    // Start automated multi-step scan sequence
    setProgress(5);
    setIsCompleted(false);
    setCurrentStepIndex(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCompleted(true);
          return 100;
        }

        const increment = Math.floor(Math.random() * 8) + 4;
        const next = Math.min(100, prev + increment);

        // Update step index based on thresholds
        if (next < 25) setCurrentStepIndex(0);
        else if (next < 48) setCurrentStepIndex(1);
        else if (next < 70) setCurrentStepIndex(2);
        else if (next < 88) setCurrentStepIndex(3);
        else if (next < 98) setCurrentStepIndex(4);
        else setCurrentStepIndex(5);

        return next;
      });
    }, 280);

    return () => clearInterval(interval);
  }, [isOpen]);

  // When scan completes, push notification once
  useEffect(() => {
    if (isCompleted && isOpen) {
      addNotification({
        title: 'Full Security Scan Completed',
        description: '356 cloud resources scanned across AWS, Azure, and GCP. Security Score: 84/100.',
        type: 'success',
        cloud: 'System',
      });
    }
  }, [isCompleted, isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentStep = scanSteps[currentStepIndex] || scanSteps[0];
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
        background: 'rgba(10, 15, 29, 0.82)',
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
        if (e.target === e.currentTarget && isCompleted) {
          onClose();
        }
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '540px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '32px',
          borderRadius: '24px',
          position: 'relative',
          background: 'rgba(23, 33, 53, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.6), 0 0 30px rgba(59, 130, 246, 0.2)',
          transform: 'translateY(0)',
          margin: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: 'none',
            borderRadius: '10px',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'var(--transition)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
        >
          <X size={20} />
        </button>

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

            <h3 style={{ fontSize: '1.4rem', margin: '0 0 8px 0', fontWeight: 700 }}>
              Cloud Scan Completed
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 0 24px 0' }}>
              Multi-cloud security posture analysis has been finalized. All compliance benchmarks and vulnerability vectors evaluated.
            </p>

            {/* Quick Metrics */}
            <div
              className="grid grid-cols-3 gap-3"
              style={{ width: '100%', marginBottom: '24px' }}
            >
              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Resources</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'white' }}>356</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--success)' }}>100% Checked</div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Security Score</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--success)' }}>84<span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/100</span></div>
                <div style={{ fontSize: '0.72rem', color: 'var(--success)' }}>+4% Improved</div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Critical Alerts</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--critical)' }}>5</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--critical)' }}>Action Required</div>
              </div>
            </div>

            {/* Clouds Scanned Indicator */}
            <div
              className="flex items-center justify-between"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                marginBottom: '24px',
                fontSize: '0.82rem',
              }}
            >
              <span style={{ color: 'var(--text-muted)' }}>Covered Clouds:</span>
              <div className="flex gap-2">
                <span style={{ background: 'rgba(255, 153, 0, 0.15)', color: '#ff9900', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>AWS (184)</span>
                <span style={{ background: 'rgba(0, 120, 212, 0.15)', color: '#0078d4', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>Azure (112)</span>
                <span style={{ background: 'rgba(66, 133, 244, 0.15)', color: '#4285f4', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>GCP (60)</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3" style={{ width: '100%' }}>
              <button
                className="btn btn-primary"
                onClick={() => {
                  onClose();
                  navigate('/resources');
                }}
                style={{ flex: 1, padding: '12px', fontSize: '0.95rem' }}
              >
                View Resources & Findings <ArrowRight size={16} />
              </button>
              <button
                className="btn"
                onClick={onClose}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: 'var(--text-main)',
                  padding: '12px 20px',
                  borderRadius: '10px',
                }}
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* Scanning In Progress State */
          <div className="flex flex-col items-center text-center">
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'rgba(59, 130, 246, 0.15)',
                border: '2px solid rgba(59, 130, 246, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                position: 'relative',
              }}
            >
              <Loader2 size={38} color="var(--primary)" style={{ animation: 'spin 1.2s linear infinite' }} />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
                }}
              />
            </div>

            <h3 style={{ fontSize: '1.35rem', margin: '0 0 6px 0', fontWeight: 700 }}>
              Scanning Cloud Infrastructure
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0 0 20px 0' }}>
              Querying cloud APIs, inspecting security configurations & IAM policies...
            </p>

            {/* Progress Bar */}
            <div
              style={{
                width: '100%',
                height: '10px',
                background: 'rgba(255, 255, 255, 0.08)',
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
                  boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)',
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
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                textAlign: 'left',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  padding: '8px',
                  borderRadius: '10px',
                  background: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  flexShrink: 0,
                }}
              >
                <StepIcon size={18} color="var(--primary)" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Current Step</div>
                <div style={{ fontSize: '0.86rem', color: 'white', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentStep.label}
                </div>
              </div>
            </div>

            {/* Cloud Badges */}
            <div className="flex items-center justify-center gap-3" style={{ width: '100%' }}>
              <span style={{ fontSize: '0.78rem', color: progress > 15 ? '#ff9900' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Cloud size={14} /> AWS {progress > 45 ? '✓' : '...'}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
              <span style={{ fontSize: '0.78rem', color: progress > 45 ? '#0078d4' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Server size={14} /> Azure {progress > 70 ? '✓' : '...'}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
              <span style={{ fontSize: '0.78rem', color: progress > 70 ? '#4285f4' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Database size={14} /> GCP {progress > 90 ? '✓' : '...'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
