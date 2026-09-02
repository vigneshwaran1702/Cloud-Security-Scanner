import { Outlet, Link, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, Cloud, Settings, LogOut, Bell, Users, ShieldCheck, Sparkles, Zap, Crown, Sun, Moon } from 'lucide-react';
import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useSubscription } from '../context/SubscriptionContext';
import { useTheme } from '../context/ThemeContext';
import SecurityChatDrawer from '../components/SecurityChatDrawer';
import CloudAccountVerifierModal from '../components/CloudAccountVerifierModal';
import ScanModal from '../components/ScanModal';
import NotificationsPopover from '../components/NotificationsPopover';

const pageTitles = {
  '/dashboard': 'Overview',
  '/resources': 'Cloud Resources',
  '/subscription': 'Subscription & Upgrades',
  '/settings': 'Settings & Theme',
  '/admin/users': 'User Governance',
};

export default function MainLayout() {
  const { user, logout, isAdmin } = useAuth();
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
  const bellBtnRef = useRef(null);
  const verifierBtnRef = useRef(null);

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
        <header className="glass-panel flex justify-between items-center" style={{ position: 'relative', zIndex: 100, marginBottom: '24px', padding: '16px 24px', borderRadius: '24px' }}>
          <div className="flex items-center gap-3">
            <h1 style={{ fontSize: '1.45rem', margin: 0, fontWeight: 700 }}>{pageTitle}</h1>
            <Link
              to="/subscription"
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '12px',
                background: isPro ? 'var(--success-bg)' : 'var(--badge-primary-bg)',
                border: isPro ? '1px solid var(--success-border)' : '1px solid var(--badge-primary-border)',
                color: isPro ? 'var(--success)' : 'var(--primary)',
                transition: 'all 0.2s',
              }}
            >
              {isPro ? <Crown size={13} color="var(--success)" /> : <Zap size={13} color="var(--primary)" />}
              {isPro ? 'PRO DEFENDER' : 'UPGRADE ($39)'}
            </Link>
          </div>
          
          <div className="flex items-center gap-3">

            {/* Theme Toggle Button (Light/Dark) */}
            <button
              onClick={toggleTheme}
              className="btn btn-secondary"
              type="button"
              style={{
                padding: '8px 14px',
                borderRadius: '12px',
                fontSize: '0.84rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'var(--transition)',
              }}
              title={isDark ? 'Switch to Crisp Light Mode' : 'Switch to Cyber Dark Mode'}
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

            {/* Verify Cloud Status Dropdown Popover */}
            <div style={{ position: 'relative' }}>
              <button
                ref={verifierBtnRef}
                className="btn"
                type="button"
                onClick={() => setIsVerifierOpen(!isVerifierOpen)}
                style={{
                  background: isVerifierOpen ? 'var(--success-bg)' : 'rgba(16, 185, 129, 0.08)',
                  border: isVerifierOpen ? '1px solid var(--success)' : '1px solid var(--success-border)',
                  color: 'var(--success)',
                  padding: '8px 14px',
                  borderRadius: '12px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                title="Verify Cloud Connection & Security Status"
              >
                <ShieldCheck size={17} color="var(--success)" />
                Verify Cloud Status
              </button>

              <CloudAccountVerifierModal
                isOpen={isVerifierOpen}
                onClose={() => setIsVerifierOpen(false)}
                triggerRef={verifierBtnRef}
              />
            </div>

            <button
              className="btn"
              data-chat-trigger="true"
              onClick={() => setIsChatOpen(!isChatOpen)}
              style={{
                background: isChatOpen ? 'linear-gradient(135deg, var(--badge-primary-bg), rgba(6, 182, 212, 0.2))' : 'var(--badge-primary-bg)',
                border: isChatOpen ? '1px solid var(--primary)' : '1px solid var(--badge-primary-border)',
                color: 'var(--primary)',
                padding: '8px 14px',
                borderRadius: '12px',
                fontSize: '0.84rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <Sparkles size={17} color="var(--primary)" />
              Security Chat
            </button>

            <button className="btn btn-primary" onClick={() => setIsScanning(true)}>
              <Shield size={17} />
              Run Scan
            </button>

            <div style={{ position: 'relative' }}>
              <button
                ref={bellBtnRef}
                type="button"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                style={{
                  background: isNotifOpen ? 'var(--badge-primary-bg)' : 'var(--panel-inner-bg)',
                  border: isNotifOpen ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                  cursor: 'pointer',
                  padding: '9px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                }}
                title="Security Notifications"
              >
                <Bell size={18} color={isNotifOpen ? 'var(--primary)' : 'var(--text-muted)'} />
                {unreadCount > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    minWidth: '16px',
                    height: '16px',
                    padding: '0 4px',
                    background: 'var(--critical)',
                    color: 'white',
                    fontSize: '0.62rem',
                    fontWeight: 'bold',
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
            
            {/* User Profile and Logout Button */}
            <div className="flex items-center gap-3" style={{ paddingLeft: '10px', borderLeft: '1px solid var(--border-color)' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                color: 'white',
                fontSize: '0.85rem',
                flexShrink: 0,
                boxShadow: '0 2px 8px var(--primary-glow)'
              }}>
                {userInitials}
              </div>
              <div>
                <div className="flex items-center gap-2" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  {user?.name || 'User'}
                  <span style={{
                    fontSize: '0.65rem',
                    padding: '2px 7px',
                    borderRadius: '10px',
                    background: 'var(--badge-primary-bg)',
                    color: 'var(--badge-primary-color)',
                    border: '1px solid var(--badge-primary-border)',
                    fontWeight: 700,
                    textTransform: 'uppercase'
                  }}>
                    {user?.role || 'USER'}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</div>
              </div>

              {/* Logout Button directly near User ID */}
              <button
                onClick={logout}
                title="Log out of account"
                style={{
                  background: 'var(--critical-bg)',
                  border: '1px solid var(--critical-border)',
                  color: 'var(--critical)',
                  padding: '7px 12px',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  marginLeft: '6px',
                  transition: 'var(--transition)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(244, 63, 94, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--critical-bg)';
                }}
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
          <Outlet />
        </div>
      </main>

      {/* Full-Screen Centered Multi-Cloud Scan Modal */}
      <ScanModal
        isOpen={isScanning}
        onClose={() => setIsScanning(false)}
      />

      {/* AI Security Assistant Floating Chat Drawer */}
      <SecurityChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onOpenCloudVerifier={() => setIsVerifierOpen(true)}
      />
    </div>
  );
}
