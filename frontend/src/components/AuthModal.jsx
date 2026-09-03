import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Mail, Lock, LogIn, User, Eye, EyeOff, X, Loader2, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function AuthModal() {
  const { authModal, closeAuthModal, login, loginWithGoogle, register } = useAuth();
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!authModal.isOpen) return null;

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid email address or Gmail.');
      setLoading(false);
      return;
    }

    if (!password || password.length < 3) {
      setError('Please enter your password.');
      setLoading(false);
      return;
    }

    try {
      if (tab === 'login') {
        await login(cleanEmail, password);
      } else {
        const cleanName = name.trim() || cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
        await register(cleanName, cleanEmail, password);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (customEmail = null) => {
    setError('');
    setSuccessMsg('');
    setGoogleLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const targetEmail = customEmail || (cleanEmail.includes('@') ? cleanEmail : 'vigneshcloud@gmail.com');
      const targetName = name.trim() || (targetEmail === 'vigneshcloud@gmail.com' ? 'Vignesh Waran' : targetEmail.split('@')[0]);
      await loginWithGoogle({
        email: targetEmail,
        name: targetName,
      });
    } catch (err) {
      setError(err.message || 'Google Sign-In failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(3, 7, 18, 0.78)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3000,
        padding: '20px',
        animation: 'fadeIn 0.25s ease',
        overflowY: 'auto',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading && !googleLoading) {
          closeAuthModal();
        }
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '480px',
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
          onClick={closeAuthModal}
          disabled={loading || googleLoading}
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
          title="Close"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3" style={{ marginBottom: '18px', paddingRight: '36px' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              padding: '12px',
              borderRadius: '16px',
              boxShadow: '0 4px 14px var(--primary-glow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Shield size={26} color="white" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {authModal.title || 'Sign In to CloudGuard'}
            </h2>
            <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '0.84rem', lineHeight: 1.4 }}>
              {authModal.subtitle || 'Sign in with your Google account or Gmail/password to continue.'}
            </p>
          </div>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div style={{
            background: 'var(--success-bg)',
            border: '1px solid var(--success-border)',
            borderRadius: '12px',
            padding: '10px 14px',
            color: 'var(--success)',
            fontSize: '0.85rem',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div style={{
            background: 'var(--critical-bg)',
            border: '1px solid var(--critical-border)',
            borderRadius: '12px',
            padding: '10px 14px',
            color: 'var(--critical)',
            fontSize: '0.85rem',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <ShieldAlert size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* 1. Google One-Click Sign In Button */}
        <div style={{ marginBottom: '20px' }}>
          <button
            type="button"
            disabled={googleLoading || loading}
            onClick={() => handleGoogleSignIn()}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: '#ffffff',
              border: '1px solid #dadce0',
              borderRadius: '12px',
              color: '#3c4043',
              fontSize: '0.95rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.18)';
              e.currentTarget.style.background = '#f8f9fa';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              e.currentTarget.style.background = '#ffffff';
            }}
          >
            {googleLoading ? (
              <Loader2 size={20} color="#4285F4" style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          margin: '18px 0',
          color: 'var(--text-muted)',
          fontSize: '0.78rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
          <span>Or with Gmail & Password</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
        </div>

        {/* Tab Selector: Sign In vs Create Account */}
        <div style={{
          display: 'flex',
          background: 'var(--panel-inner-bg)',
          borderRadius: '12px',
          padding: '4px',
          marginBottom: '16px',
          border: '1px solid var(--border-color)',
        }}>
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setError('');
            }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '9px',
              border: 'none',
              background: tab === 'login' ? 'var(--primary)' : 'transparent',
              color: tab === 'login' ? '#ffffff' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'var(--transition)',
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setError('');
            }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '9px',
              border: 'none',
              background: tab === 'register' ? 'var(--primary)' : 'transparent',
              color: tab === 'register' ? '#ffffff' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'var(--transition)',
            }}
          >
            Create Account
          </button>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3">
          {tab === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '5px', textTransform: 'uppercase' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vignesh Waran"
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--input-bg)',
                    color: 'var(--text-main)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '5px', textTransform: 'uppercase' }}>
              Gmail / Email Address / User ID
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vigneshcloud@gmail.com or name@company.com"
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 38px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--input-bg)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '5px', textTransform: 'uppercase' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '10px 38px 10px 38px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--input-bg)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
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
              fontSize: '0.92rem',
              marginTop: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {loading ? (
              <>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <LogIn size={16} />
                <span>{tab === 'login' ? 'Sign In with Gmail / Email' : 'Create & Log In'}</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Fast Login Buttons */}
        <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', textAlign: 'center', fontWeight: 600 }}>
            ⚡ QUICK DEMO ACCESS
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleGoogleSignIn('vigneshcloud@gmail.com')}
              style={{
                flex: 1,
                padding: '8px 10px',
                borderRadius: '10px',
                border: '1px solid rgba(79, 70, 229, 0.4)',
                background: 'rgba(79, 70, 229, 0.12)',
                color: 'var(--primary)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
              }}
            >
              <Sparkles size={13} />
              Admin (vigneshcloud)
            </button>
            <button
              type="button"
              onClick={() => handleGoogleSignIn('security.lead@cloudcorp.io')}
              style={{
                flex: 1,
                padding: '8px 10px',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                background: 'var(--panel-inner-bg)',
                color: 'var(--text-main)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              SecOps Engineer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
