import { Shield, User, Mail, Zap, Lock, LogOut, CheckCircle2, Crown, X, Key, Calendar, Building2 } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { getCloudState } from '../services/api';
import { Link } from 'react-router-dom';

export default function AccountDetailsModal({ isOpen, onClose }) {
  const { user, logout, isAdmin } = useAuth();
  const { isPro, activeTier } = useSubscription();
  const cloudState = getCloudState();

  if (!isOpen || !user) return null;

  const displayName = user.name || (user.email ? user.email.split('@')[0] : 'User');
  const userInitials = (displayName || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'US';

  const handleSignOut = () => {
    onClose();
    logout();
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
        background: 'rgba(3, 7, 18, 0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
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
          maxWidth: '500px',
          maxHeight: '90vh',
          overflowY: 'auto',
          margin: 'auto',
          padding: '32px',
          borderRadius: '24px',
          position: 'relative',
          background: 'var(--panel-bg-solid)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-main)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
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
          }}
          title="Close"
        >
          <X size={18} />
        </button>

        {/* Profile Header */}
        <div style={{ textAlign: 'center', paddingBottom: '20px', borderBottom: '1px solid var(--border-color)', marginBottom: '20px' }}>
          {user.picture ? (
            <img
              src={user.picture}
              alt={displayName}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #1a73e8',
                margin: '0 auto 12px',
              }}
            />
          ) : (
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4285F4, #34A853)',
              color: 'white',
              fontWeight: 800,
              fontSize: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              boxShadow: '0 4px 14px rgba(66, 133, 244, 0.4)'
            }}>
              {userInitials}
            </div>
          )}

          <h3 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {displayName}
          </h3>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
            {user.email}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '0.7rem',
              padding: '3px 10px',
              borderRadius: '12px',
              background: 'rgba(26, 115, 232, 0.14)',
              color: '#1a73e8',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              ROLE: {user.role || 'USER'}
            </span>
            <span style={{
              fontSize: '0.7rem',
              padding: '3px 10px',
              borderRadius: '12px',
              background: isPro ? 'var(--success-bg)' : 'var(--table-header-bg)',
              color: isPro ? 'var(--success)' : 'var(--text-muted)',
              border: isPro ? '1px solid var(--success-border)' : '1px solid var(--border-color)',
              fontWeight: 700,
            }}>
              {isPro ? '⭐ PRO DEFENDER' : 'FREE TIER'}
            </span>
          </div>
        </div>

        {/* Account Details List */}
        <div className="flex flex-col gap-3" style={{ marginBottom: '24px' }}>
          <div style={{ background: 'var(--panel-inner-bg)', padding: '12px 16px', borderRadius: '14px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="flex items-center gap-3">
              <Key size={16} color="#1a73e8" />
              <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Account ID</span>
            </div>
            <span style={{ fontSize: '0.84rem', fontWeight: 600, fontFamily: 'monospace' }}>
              #{user.id || '1001'}
            </span>
          </div>

          <div style={{ background: 'var(--panel-inner-bg)', padding: '12px 16px', borderRadius: '14px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="flex items-center gap-3">
              <Building2 size={16} color="var(--success)" />
              <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Connected Cloud ID</span>
            </div>
            <span style={{ fontSize: '0.84rem', fontWeight: 600, color: cloudState.activeCloudId ? 'var(--success)' : 'var(--text-muted)' }}>
              {cloudState.activeCloudId ? `${cloudState.activeProvider || 'AWS'}: ${cloudState.activeCloudId.slice(0, 12)}...` : 'None Connected'}
            </span>
          </div>

          <div style={{ background: 'var(--panel-inner-bg)', padding: '12px 16px', borderRadius: '14px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="flex items-center gap-3">
              <Calendar size={16} color="#f6821f" />
              <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Auth Provider</span>
            </div>
            <span style={{ fontSize: '0.84rem', fontWeight: 600, textTransform: 'capitalize' }}>
              {user.auth_provider || 'Email/Password'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <Link
            to="/subscription"
            onClick={onClose}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '11px',
              borderRadius: '12px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '0.88rem',
              fontWeight: 600,
            }}
          >
            <Zap size={16} />
            <span>Manage Subscription & Tiers</span>
          </Link>

          <Link
            to="/settings"
            onClick={onClose}
            className="btn"
            style={{
              width: '100%',
              padding: '11px',
              borderRadius: '12px',
              background: 'var(--panel-inner-bg)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '0.88rem',
              fontWeight: 600,
            }}
          >
            <User size={16} />
            <span>Account & API Settings</span>
          </Link>

          {isAdmin && (
            <Link
              to="/admin/users"
              onClick={onClose}
              className="btn"
              style={{
                width: '100%',
                padding: '11px',
                borderRadius: '12px',
                background: 'rgba(26, 115, 232, 0.1)',
                border: '1px solid rgba(26, 115, 232, 0.3)',
                color: '#1a73e8',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '0.88rem',
                fontWeight: 600,
              }}
            >
              <Shield size={16} />
              <span>Admin Governance Panel</span>
            </Link>
          )}

          <button
            type="button"
            onClick={handleSignOut}
            className="btn"
            style={{
              width: '100%',
              padding: '11px',
              borderRadius: '12px',
              background: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: 'var(--critical)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              marginTop: '6px',
            }}
          >
            <LogOut size={16} />
            <span>Sign Out from Account</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
