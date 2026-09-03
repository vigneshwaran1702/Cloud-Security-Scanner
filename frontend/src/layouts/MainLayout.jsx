import { Outlet, Link, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, Cloud, Settings, LogOut, Bell, Users, ShieldCheck, Sparkles, Zap, Crown, Sun, Moon, ChevronDown, User, CheckCircle2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useSubscription } from '../context/SubscriptionContext';
import { useTheme } from '../context/ThemeContext';
import SecurityChatDrawer from '../components/SecurityChatDrawer';
import CloudAccountVerifierModal from '../components/CloudAccountVerifierModal';
import ScanModal from '../components/ScanModal';
import NotificationsPopover from '../components/NotificationsPopover';
import AuthModal from '../components/AuthModal';

const pageTitles = {
  '/dashboard': 'Overview',
  '/resources': 'Cloud Resources',
  '/subscription': 'Subscription & Upgrades',
  '/settings': 'Settings & Theme',
  '/admin/users': 'User Governance',
};

export default function MainLayout() {
  const { user, logout, isAdmin, requireAuth, openAuthModal } = useAuth();
  const { unreadCount } = useNotifications();
  const { isPro, activeTier } = useSubscription();
  const { theme, toggleTheme, isDark } = useTheme();
  const location = useLocation();
  const currentPath = location.pathname;
  const pageTitle = pageTitles[currentPath] || 'Overview';
  
  const [isScanning, setIsScanning] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVerifierOpen, setIsVerifierOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const bellBtnRef = useRef(null);
  const verifierBtnRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close user menu on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }
    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/resources', label: 'Resources', icon: Cloud },
    {
      path: '/subscription',
      label: 'Subscription',
      icon: Zap,
      badge: isPro ? 'PRO ACTIVE' : '$39 PRO',
      isProHighlight: !isPro
    },
    { path: '/settings', label: 'Settings', icon: Settings },
    ...(isAdmin ? [{ path: '/admin/users', label: 'User Management', icon: Users }] : []),
  ];

  const userInitials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'US';

  return (
    <div className="flex" style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Sidebar */}
      <aside className="glass-panel flex-col flex" style={{ width: '264px', margin: '16px', borderRadius: '24px', padding: '24px' }}>
        <div className="flex items-center gap-3" style={{ marginBottom: '32px' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            padding: '10px',
            borderRadius: '14px',
            boxShadow: '0 4px 16px var(--primary-glow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Shield size={22} color="white" />
          </div>
          <div>
            <h2 className="gradient-text" style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800, letterSpacing: '-0.03em' }}>CloudGuard AI</h2>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', fontWeight: 600, letterSpacing: '0.04em' }}>CLOUD SECURITY</div>
          </div>
        </div>

        <nav className="flex flex-col gap-2" style={{ flex: 1 }}>
          {navItems.map(item => {
            const isActive = currentPath === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center justify-between"
                style={{
                  color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                  textDecoration: 'none',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  background: isActive
                    ? 'var(--sidebar-active-bg)'
                    : item.isProHighlight
                    ? 'var(--badge-primary-bg)'
                    : 'transparent',
                  border: isActive
                    ? '1px solid var(--sidebar-active-border)'
                    : item.isProHighlight
                    ? '1px solid var(--badge-primary-border)'
                    : '1px solid transparent',
                  transition: 'var(--transition)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.9rem',
                }}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} color={isActive ? 'var(--primary)' : item.isProHighlight ? 'var(--accent)' : 'currentColor'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '2px 7px',
                      borderRadius: '8px',
                      background: isPro
                        ? 'var(--success-bg)'
                        : 'linear-gradient(135deg, var(--primary), var(--accent))',
                      color: isPro ? 'var(--success)' : '#fff',
                      border: isPro ? '1px solid var(--success-border)' : 'none',
                      letterSpacing: '0.04em',
                      boxShadow: !isPro ? '0 2px 8px var(--primary-glow)' : 'none',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Pro Upgrade Box (if free) */}
        {!isPro && (
          <div
            style={{
              marginTop: 'auto',
              padding: '16px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, var(--badge-primary-bg), rgba(6, 182, 212, 0.08))',
              border: '1px solid var(--badge-primary-border)',
              textAlign: 'center',
            }}
          >
            <div className="flex items-center justify-center gap-1.5" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>
              <Sparkles size={16} /> Unlock Pro $39/mo
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: 1.35 }}>
              Safe production auto-fixes & 24/7 instant SecOps AI assist.
            </p>
            <Link
              to="/subscription"
              className="btn btn-primary"
              style={{
                display: 'block',
                textDecoration: 'none',
                padding: '8px 12px',
                fontSize: '0.8rem',
                fontWeight: 700,
                borderRadius: '10px',
                width: '100%',
              }}
            >
              Upgrade for $39
            </Link>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-col flex" style={{ flex: 1, padding: '16px 16px 16px 0', overflow: 'hidden' }}>
        {/* Top Header */}
        <header className="glass-panel flex justify-between items-center" style={{ position: 'relative', zIndex: 100, marginBottom: '24px', padding: '14px 24px', borderRadius: '20px' }}>
          <div className="flex items-center gap-3">
            <h1 style={{ fontSize: '1.35rem', margin: 0, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>{pageTitle}</h1>
            {isPro && (
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '8px',
                  background: 'var(--success-bg)',
                  border: '1px solid var(--success-border)',
                  color: 'var(--success)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  letterSpacing: '0.04em'
                }}
              >
                <Crown size={12} /> PRO
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2.5">
            {/* Verify Cloud Action */}
            <button
              type="button"
              onClick={() => requireAuth(() => setIsVerifierOpen(true), "Sign in with your Google account or Gmail/password to verify and connect your cloud ID.")}
              className={`header-action-btn ${isVerifierOpen ? 'active' : ''}`}
              title="Verify Cloud Connection & Security Status"
            >
              <ShieldCheck size={16} color="var(--success)" />
              <span>Verify Cloud</span>
            </button>

            {/* AI Security Chat Trigger */}
            <button
              type="button"
              className={`header-action-btn ${isChatOpen ? 'active' : ''}`}
              data-chat-trigger="true"
              onClick={() => setIsChatOpen(!isChatOpen)}
              title="Open AI SecOps Assistant"
            >
              <Sparkles size={16} color="var(--primary)" />
              <span>AI Chat</span>
            </button>

            {/* Primary Action: Run Scan */}
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => requireAuth(() => setIsScanning(true), "Sign in with your Google account or Gmail/password to start live cloud security scans.")}
              style={{ padding: '8px 16px', borderRadius: '12px', fontSize: '0.84rem', fontWeight: 600 }}
            >
              <Shield size={16} />
              <span>Run Scan</span>
            </button>

            <div className="header-divider" />

            {/* Theme Toggle Button (Icon only) */}
            <button
              onClick={toggleTheme}
              className="header-icon-btn"
              type="button"
              title={isDark ? 'Switch to Crisp Light Mode' : 'Switch to Cyber Dark Mode'}
            >
              {isDark ? (
                <Sun size={17} color="#fbbf24" />
              ) : (
                <Moon size={17} color="var(--primary)" />
              )}
            </button>

            {/* Notifications Button */}
            <div style={{ position: 'relative' }}>
              <button
                ref={bellBtnRef}
                type="button"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`header-icon-btn ${isNotifOpen ? 'active' : ''}`}
                title="Security Notifications"
              >
                <Bell size={17} />
                {unreadCount > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    minWidth: '15px',
                    height: '15px',
                    padding: '0 3px',
                    background: 'var(--critical)',
                    color: 'white',
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(244, 63, 94, 0.4)'
                  }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </div>
                )}
              </button>

              <NotificationsPopover
                isOpen={isNotifOpen}
                onClose={() => setIsNotifOpen(false)}
                triggerRef={bellBtnRef}
              />
            </div>

            <div className="header-divider" />
            
            {/* User Profile or Guest Login Button */}
            {!user ? (
              <button
                type="button"
                onClick={() => openAuthModal({ title: 'Sign In to CloudGuard', subtitle: 'Sign in with your Google account or Gmail/password to access full scanning, verification, and Pro features.' })}
                className="btn btn-primary"
                style={{
                  padding: '8px 16px',
                  borderRadius: '12px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <LogIn size={15} />
                <span>Sign In / Register</span>
              </button>
            ) : (
              <div style={{ position: 'relative' }} ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  style={{
                    background: isUserMenuOpen ? 'var(--panel-inner-bg)' : 'transparent',
                    border: isUserMenuOpen ? '1px solid var(--border-color-hover)' : '1px solid transparent',
                    padding: '4px 8px 4px 4px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'var(--transition)',
                  }}
                  title="Account Menu"
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: '0.8rem',
                    flexShrink: 0,
                    boxShadow: '0 2px 8px var(--primary-glow)'
                  }}>
                    {userInitials}
                  </div>
                  <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.2 }}>
                      {user?.name || 'User'}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', lineHeight: 1.2, textTransform: 'capitalize' }}>
                      {user?.role || 'user'}
                    </span>
                  </div>
                  <ChevronDown size={14} color="var(--text-muted)" style={{ transform: isUserMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div
                    className="glass-panel"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      width: '240px',
                      padding: '12px',
                      borderRadius: '16px',
                      zIndex: 200,
                      boxShadow: 'var(--glass-shadow-hover)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--panel-bg-solid)',
                      animation: 'fadeIn 0.15s ease-out'
                    }}
                  >
                    {/* Account Header Info */}
                    <div style={{ padding: '8px 10px 10px', borderBottom: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {user?.name || 'User'}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                        {user?.email || 'user@cloudguard.io'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                        <span style={{
                          fontSize: '0.64rem',
                          padding: '2px 6px',
                          borderRadius: '6px',
                          background: 'var(--badge-primary-bg)',
                          color: 'var(--badge-primary-color)',
                          fontWeight: 700,
                          textTransform: 'uppercase'
                        }}>
                          {user?.role || 'USER'}
                        </span>
                        <span style={{
                          fontSize: '0.64rem',
                          padding: '2px 6px',
                          borderRadius: '6px',
                          background: isPro ? 'var(--success-bg)' : 'var(--table-header-bg)',
                          color: isPro ? 'var(--success)' : 'var(--text-subtle)',
                          border: isPro ? '1px solid var(--success-border)' : '1px solid var(--border-subtle)',
                          fontWeight: 600,
                        }}>
                          {activeTier.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Menu Options */}
                    <Link
                      to="/settings"
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '8px',
                        color: 'var(--text-main)',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.82rem',
                        fontWeight: 500,
                        transition: 'var(--transition)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--panel-inner-bg)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <User size={15} color="var(--text-muted)" />
                      <span>Account Settings</span>
                    </Link>

                    <Link
                      to="/subscription"
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '8px',
                        color: 'var(--text-main)',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.82rem',
                        fontWeight: 500,
                        transition: 'var(--transition)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--panel-inner-bg)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <Zap size={15} color="var(--accent)" />
                      <span>Subscription Plan</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin/users"
                        onClick={() => setIsUserMenuOpen(false)}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '8px',
                          color: 'var(--primary)',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          transition: 'var(--transition)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--panel-inner-bg)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <Users size={15} color="var(--primary)" />
                        <span>Admin Governance</span>
                      </Link>
                    )}

                    <div style={{ height: '1px', background: 'var(--border-color)', margin: '4px 0' }} />

                    {/* Logout Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '8px',
                        color: 'var(--critical)',
                        background: 'transparent',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'var(--transition)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--critical-bg)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <LogOut size={15} color="var(--critical)" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
          <Outlet />
        </div>
      </main>

      {/* Universal Auth Modal for Gated Actions & Google Login */}
      <AuthModal />

      {/* Full-Screen Centered Cloud ID Verifier Modal */}
      <CloudAccountVerifierModal
        isOpen={isVerifierOpen}
        onClose={() => setIsVerifierOpen(false)}
      />

      {/* Full-Screen Centered Multi-Cloud Scan Modal */}
      <ScanModal
        isOpen={isScanning}
        onClose={() => setIsScanning(false)}
      />

      {/* AI Security Assistant Floating Chat Drawer */}
      <SecurityChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onOpenCloudVerifier={() => requireAuth(() => setIsVerifierOpen(true), "Sign in with Google or Gmail/password to verify and connect your cloud ID.")}
      />
    </div>
  );
}
