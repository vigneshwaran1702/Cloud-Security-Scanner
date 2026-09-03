import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  Cloud,
  Settings,
  LogOut,
  Bell,
  Users,
  ShieldCheck,
  Sparkles,
  Zap,
  Crown,
  Sun,
  Moon,
  ChevronDown,
  User,
  CheckCircle2,
  Search,
  ChevronRight,
  Layers,
  Lock,
  Menu,
  Terminal,
  HelpCircle,
  LogIn,
  SlidersHorizontal,
  FolderGit2
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useSubscription } from '../context/SubscriptionContext';
import { useTheme } from '../context/ThemeContext';
import { getCloudState } from '../services/api';
import SecurityChatDrawer from '../components/SecurityChatDrawer';
import CloudAccountVerifierModal from '../components/CloudAccountVerifierModal';
import ScanModal from '../components/ScanModal';
import NotificationsPopover from '../components/NotificationsPopover';
import AuthModal from '../components/AuthModal';

const breadcrumbMap = {
  '/dashboard': 'Security Command Center Overview',
  '/resources': 'Cloud Asset Inventory',
  '/subscription': 'Subscription & Pricing Plans',
  '/settings': 'Platform Settings & Cloud Credentials',
  '/admin/users': 'IAM & Admin User Governance',
};

export default function MainLayout() {
  const { user, logout, isAdmin, requireAuth, openAuthModal } = useAuth();
  const { unreadCount } = useNotifications();
  const { isPro, activeTier } = useSubscription();
  const { theme, toggleTheme, isDark } = useTheme();
  const location = useLocation();
  const currentPath = location.pathname;

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVerifierOpen, setIsVerifierOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const bellBtnRef = useRef(null);
  const userMenuRef = useRef(null);

  const cloudState = getCloudState();
  const activeCloudId = cloudState.activeCloudId;
  const activeProvider = cloudState.activeProvider || 'AWS';

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

  const displayName = user?.name || (user?.email ? user.email.split('@')[0] : 'User');
  const userIdentifier = user?.email || (user?.id ? `ID: #${user.id}` : 'Verified User');
  const userInitials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'US';

  const navItems = [
    { path: '/dashboard', label: 'Security Command Center', icon: LayoutDashboard },
    { path: '/resources', label: 'Asset Inventory', icon: Layers },
    {
      path: '/subscription',
      label: 'Subscription & Pro',
      icon: Zap,
      badge: isPro ? 'PRO' : '$39'
    },
    { path: '/settings', label: 'Settings & Cloud Keys', icon: Settings },
    ...(isAdmin ? [{ path: '/admin/users', label: 'IAM & Governance', icon: Users }] : []),
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)', color: 'var(--text-main)', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. GOOGLE CLOUD CONSOLE TOP APP BAR */}
      <header className="gcp-header">
        {/* Left: Navigation Drawer Toggle & Google Cloud Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Navigation menu"
          >
            <Menu size={20} />
          </button>

          {/* Logo & Security Suite Name */}
          <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            {/* 4-Color Cloud Icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" fill="#4285F4"/>
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4c-1.39 0-2.68.38-3.79 1.04l3.19 3.2c.2-.01.4-.04.6-.04 2.21 0 4 1.79 4 4 0 .2-.03.4-.04.6l3.39 3.4c.03-.38.05-.78.05-1.2 0-2.64-2.05-4.78-4.65-4.96z" fill="#EA4335"/>
              <path d="M6 20h13c.42 0 .82-.05 1.2-.15l-4.14-4.15c-.32.19-.69.3-1.06.3h-9c-2.21 0-4-1.79-4-4 0-.37.11-.74.3-1.06L.15 6.8C.05 7.18 0 7.58 0 8c0 3.31 2.69 6 6 6z" fill="#FBBC04"/>
              <path d="M12 4c1.39 0 2.68.38 3.79 1.04l-3.19 3.2C12.4 8.23 12.2 8.2 12 8.2c-2.21 0-4 1.79-4 4 0 .2.03.4.04.6l-3.39 3.4C4.62 15.82 4.6 15.42 4.6 15c0-3.31 2.69-6 6-6 1.39 0 2.68.38 3.79 1.04z" fill="#34A853"/>
            </svg>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
              Cloud <span style={{ color: '#1a73e8', fontWeight: 600 }}>Security</span>
            </div>
          </Link>

          {/* Google Cloud Project / Account Selector Dropdown */}
          <div
            onClick={() => requireAuth(() => setIsVerifierOpen(true), "Sign in with your Google account to connect and switch cloud projects.")}
            className="gcp-project-selector"
            title="Select Cloud Project or Account"
          >
            <FolderGit2 size={15} color="#1a73e8" />
            <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>
              {activeCloudId ? `${activeProvider}: ${activeCloudId.slice(0, 16)}...` : 'Select Cloud Project'}
            </span>
            <ChevronDown size={14} color="var(--text-muted)" />
          </div>
        </div>

        {/* Center: Google Search Omnibox */}
        <div className="gcp-search-bar">
          <Search size={16} color="var(--text-muted)" style={{ marginRight: '10px' }} />
          <input
            type="text"
            placeholder="Search products, resources, CIS security docs (/)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              width: '100%',
              color: 'var(--text-main)',
              fontSize: '0.85rem'
            }}
          />
        </div>

        {/* Right: Cloud Shell, Verify, Scan, Notifications & Profile */}
        <div className="flex items-center gap-2">
          {/* Cloud Shell / AI Terminal */}
          <button
            type="button"
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="header-icon-btn"
            title="Activate Cloud Shell & AI Assistant"
            style={{ width: '36px', height: '36px', borderRadius: '50%' }}
          >
            <Terminal size={17} color="#1a73e8" />
          </button>

          {/* Verify Cloud Button */}
          <button
            type="button"
            onClick={() => requireAuth(() => setIsVerifierOpen(true), "Sign in with your Google account to verify cloud ID.")}
            className="btn"
            style={{
              padding: '6px 12px',
              background: 'var(--panel-inner-bg)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontSize: '0.82rem',
              fontWeight: 500,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ShieldCheck size={15} color="var(--success)" />
            <span>Verify ID</span>
          </button>

          {/* Run Scan Button (Google Blue #1a73e8) */}
          <button
            type="button"
            onClick={() => requireAuth(() => setIsScanning(true), "Sign in with your Google account to run live scans.")}
            className="btn btn-primary"
            style={{
              padding: '6px 14px',
              background: '#1a73e8',
              borderColor: '#1a73e8',
              fontSize: '0.82rem',
              fontWeight: 600,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 1px 3px rgba(26, 115, 232, 0.3)'
            }}
          >
            <Shield size={15} />
            <span>Run Scan</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="header-icon-btn"
            type="button"
            title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            style={{ width: '36px', height: '36px', borderRadius: '50%' }}
          >
            {isDark ? <Sun size={17} color="#fbbf24" /> : <Moon size={17} color="#1a73e8" />}
          </button>

          {/* Notifications */}
          <div style={{ position: 'relative' }}>
            <button
              ref={bellBtnRef}
              type="button"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="header-icon-btn"
              style={{ width: '36px', height: '36px', borderRadius: '50%' }}
              title="Notifications"
            >
              <Bell size={17} />
              {unreadCount > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  minWidth: '14px',
                  height: '14px',
                  padding: '0 3px',
                  background: 'var(--critical)',
                  color: 'white',
                  fontSize: '0.58rem',
                  fontWeight: 700,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
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

          <div style={{ width: '1px', height: '24px', background: 'var(--border-color)', margin: '0 4px' }} />

          {/* User Profile or Google Sign-In Button */}
          {!user ? (
            <button
              type="button"
              onClick={() => openAuthModal({ title: 'Sign In to Google Cloud Security', subtitle: 'Sign in with your Google account or Gmail/password to access scanning and compliance features.' })}
              className="btn btn-primary"
              style={{
                padding: '6px 16px',
                background: '#1a73e8',
                borderColor: '#1a73e8',
                borderRadius: '8px',
                fontSize: '0.84rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <LogIn size={15} />
              <span>Login</span>
            </button>
          ) : (
            <div style={{ position: 'relative' }} ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                style={{
                  background: isUserMenuOpen ? 'var(--panel-inner-bg)' : 'transparent',
                  border: isUserMenuOpen ? '1px solid var(--border-color-hover)' : '1px solid transparent',
                  cursor: 'pointer',
                  padding: '4px 10px 4px 4px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'var(--transition)',
                }}
                title={`Account: ${displayName}`}
              >
                {user?.picture ? (
                  <img
                    src={user.picture}
                    alt={displayName}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #1a73e8',
                    }}
                  />
                ) : (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4285F4, #34A853)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: '0.8rem',
                    flexShrink: 0,
                    boxShadow: '0 1px 4px rgba(66, 133, 244, 0.4)'
                  }}>
                    {userInitials}
                  </div>
                )}
                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2 }}>
                    {displayName}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', lineHeight: 1.2, maxWidth: '130px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {userIdentifier}
                  </span>
                </div>
                <ChevronDown size={14} color="var(--text-muted)" style={{ transform: isUserMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
              </button>

              {/* Google Account Profile Dropdown */}
              {isUserMenuOpen && (
                <div
                  className="glass-panel"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '260px',
                    padding: '16px',
                    borderRadius: '16px',
                    zIndex: 200,
                    boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--panel-bg-solid)',
                    animation: 'fadeIn 0.15s ease-out'
                  }}
                >
                  <div style={{ textAlign: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #4285F4, #34A853)',
                      color: 'white',
                      fontWeight: 800,
                      fontSize: '1.2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 8px',
                    }}>
                      {userInitials}
                    </div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {displayName}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                      {userIdentifier}
                    </div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                      <span style={{
                        fontSize: '0.64rem',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        background: 'rgba(26, 115, 232, 0.12)',
                        color: '#1a73e8',
                        fontWeight: 700,
                        textTransform: 'uppercase'
                      }}>
                        {user?.role || 'USER'}
                      </span>
                      <span style={{
                        fontSize: '0.64rem',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        background: isPro ? 'var(--success-bg)' : 'var(--table-header-bg)',
                        color: isPro ? 'var(--success)' : 'var(--text-subtle)',
                        border: isPro ? '1px solid var(--success-border)' : '1px solid var(--border-subtle)',
                        fontWeight: 600,
                      }}>
                        {activeTier.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <Link
                    to="/settings"
                    onClick={() => setIsUserMenuOpen(false)}
                    style={{ padding: '8px 10px', borderRadius: '8px', color: 'var(--text-main)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', fontWeight: 500 }}
                  >
                    <User size={15} color="var(--text-muted)" />
                    <span>Manage Account</span>
                  </Link>

                  <Link
                    to="/subscription"
                    onClick={() => setIsUserMenuOpen(false)}
                    style={{ padding: '8px 10px', borderRadius: '8px', color: 'var(--text-main)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', fontWeight: 500 }}
                  >
                    <Zap size={15} color="#1a73e8" />
                    <span>Billing & Subscriptions</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin/users"
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{ padding: '8px 10px', borderRadius: '8px', color: '#1a73e8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', fontWeight: 600 }}
                    >
                      <Users size={15} color="#1a73e8" />
                      <span>IAM & Admin</span>
                    </Link>
                  )}

                  <div style={{ height: '1px', background: 'var(--border-color)', margin: '4px 0' }} />

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
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
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

      {/* 2. GOOGLE CLOUD CONSOLE BODY LAYOUT */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Left Navigation Sidebar */}
        <aside
          className="gcp-sidebar"
          style={{
            width: isSidebarOpen ? '250px' : '64px',
            padding: isSidebarOpen ? '16px 0' : '16px 4px',
          }}
        >
          <nav className="flex flex-col gap-1" style={{ flex: 1 }}>
            {navItems.map(item => {
              const isActive = currentPath === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`gcp-nav-item ${isActive ? 'active' : ''}`}
                  title={!isSidebarOpen ? item.label : undefined}
                >
                  <Icon size={18} color={isActive ? '#1a73e8' : 'currentColor'} style={{ flexShrink: 0 }} />
                  {isSidebarOpen && (
                    <div className="flex items-center justify-between" style={{ flex: 1 }}>
                      <span>{item.label}</span>
                      {item.badge && (
                        <span style={{
                          fontSize: '0.64rem',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: '4px',
                          background: isPro ? 'var(--success-bg)' : 'rgba(26, 115, 232, 0.12)',
                          color: isPro ? 'var(--success)' : '#1a73e8'
                        }}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Pro Tier Banner (when open) */}
          {isSidebarOpen && !isPro && (
            <div style={{
              margin: '16px',
              padding: '14px',
              borderRadius: '12px',
              background: 'var(--panel-inner-bg)',
              border: '1px solid var(--border-color)',
            }}>
              <div className="flex items-center gap-1.5" style={{ color: '#1a73e8', fontWeight: 700, fontSize: '0.82rem', marginBottom: '4px' }}>
                <Sparkles size={14} /> Upgrade to Pro ($39)
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0 0 10px 0', lineHeight: 1.35 }}>
                Automated CIS compliance & safe production auto-fixes.
              </p>
              <Link
                to="/subscription"
                className="btn btn-primary"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  textDecoration: 'none',
                  padding: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                  background: '#1a73e8',
                  borderColor: '#1a73e8'
                }}
              >
                Upgrade Plan
              </Link>
            </div>
          )}
        </aside>

        {/* Main Content Area */}
        <main className="gcp-main-container">
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            <Link to="/dashboard" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Cloud Security Platform</Link>
            <span>›</span>
            <span style={{ color: 'var(--text-muted)' }}>Security Command Center</span>
            <span>›</span>
            <span style={{ color: '#1a73e8', fontWeight: 600 }}>{breadcrumbMap[currentPath] || 'Overview'}</span>
          </div>

          <Outlet />
        </main>
      </div>

      {/* GLOBAL MODALS */}
      <AuthModal />
      <CloudAccountVerifierModal
        isOpen={isVerifierOpen}
        onClose={() => setIsVerifierOpen(false)}
      />
      <ScanModal
        isOpen={isScanning}
        onClose={() => setIsScanning(false)}
      />
      <SecurityChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onOpenCloudVerifier={() => requireAuth(() => setIsVerifierOpen(true), "Sign in with your Google account to connect cloud ID.")}
      />
    </div>
  );
}
