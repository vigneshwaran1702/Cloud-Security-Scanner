import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Shield, User, Mail, Lock, UserPlus, ShieldAlert, CheckCircle2, ArrowLeft, Eye, EyeOff, Sun, Moon, Loader2 } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { register, loginWithGoogle, user } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanName) {
      setError('Please enter your full name.');
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters in length.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify both passwords match.');
      return;
    }

    setLoading(true);

    try {
      await register(cleanName, cleanEmail, password, 'user');
      setSuccess('Account created successfully! Please sign in with your email and password.');
      setTimeout(() => {
        navigate('/login', {
          state: {
            registeredEmail: cleanEmail,
            registeredMessage: 'Registration successful! Please enter your password to sign in.'
          },
          replace: true
        });
      }, 1000);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again or use another email.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const targetEmail = cleanEmail.includes('@') ? cleanEmail : 'user@gmail.com';
      await loginWithGoogle({
        email: targetEmail,
        name: name.trim() || cleanEmail.split('@')[0].replace(/[._-]/g, ' ') || 'Google User',
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Google registration failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'var(--auth-bg-gradient)',
      position: 'relative',
    }}>
      {/* Floating Theme Toggle in Top Right */}
      <button
        onClick={toggleTheme}
        type="button"
        style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          background: 'var(--panel-bg)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-main)',
          padding: '8px 14px',
          borderRadius: '12px',
          fontSize: '0.85rem',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: 'var(--glass-shadow)',
          transition: 'var(--transition)',
        }}
      >
        {isDark ? (
          <>
            <Sun size={16} color="#fbbf24" />
            <span>Light Mode</span>
          </>
        ) : (
          <>
            <Moon size={16} color="var(--primary)" />
            <span>Dark Mode</span>
          </>
        )}
      </button>

      <div className="glass-panel animate-fade-in" style={{
        width: '100%',
        maxWidth: '480px',
        padding: '36px 32px',
        borderRadius: '28px',
        boxShadow: 'var(--glass-shadow)',
        background: 'var(--panel-bg-solid)',
      }}>
        {/* Header Branding */}
        <div className="flex flex-col items-center gap-3 text-center" style={{ marginBottom: '24px' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            padding: '14px',
            borderRadius: '18px',
            boxShadow: '0 8px 24px var(--primary-glow)',
            display: 'inline-flex'
          }}>
            <Shield size={36} color="white" />
          </div>
          <div>
            <h1 className="gradient-text" style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>
              Create Account
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
              Register your profile to access CloudGuard AI
            </p>
          </div>
        </div>

        {/* Success Alert */}
        {success && (
          <div style={{
            background: 'var(--success-bg)',
            border: '1px solid var(--success-border)',
            borderRadius: '12px',
            padding: '12px 16px',
            color: 'var(--success)',
            fontSize: '0.85rem',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <CheckCircle2 size={18} color="var(--success)" style={{ flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div style={{
            background: 'var(--critical-bg)',
            border: '1px solid var(--critical-border)',
            borderRadius: '12px',
            padding: '12px 16px',
            color: 'var(--critical)',
            fontSize: '0.85rem',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <ShieldAlert size={18} color="var(--critical)" style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Google Quick Sign Up */}
        <div style={{ marginBottom: '18px' }}>
          <button
            type="button"
            disabled={googleLoading || loading}
            onClick={handleGoogleSignUp}
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
            <span>Sign up with Google</span>
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
          <span>Or with Email & Password</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 500 }}>
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 500 }}>
              Email Address / Gmail
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@gmail.com"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 500 }}>
              Create Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                style={{
                  width: '100%',
                  padding: '12px 42px 12px 42px',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 500 }}>
              Confirm Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                style={{
                  width: '100%',
                  padding: '12px 42px 12px 42px',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: 600,
              marginTop: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {loading ? (
              <span>Registering Account...</span>
            ) : (
              <>
                <UserPlus size={20} />
                Register User Account
              </>
            )}
          </button>
        </form>

        {/* Footer links */}
        <div style={{ textAlign: 'center', marginTop: '22px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          <div>
            Already registered?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <ArrowLeft size={14} /> Go to Sign In
            </Link>
          </div>
          <div style={{ marginTop: '10px' }}>
            <Link to="/dashboard" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.82rem' }}>
              ← Browse platform as Guest
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
