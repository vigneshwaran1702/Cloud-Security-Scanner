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
  Bot,
  MessageSquare,
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
import AccountDetailsModal from '../components/AccountDetailsModal';

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
  const [isPromoClosed, setIsPromoClosed] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVerifierOpen, setIsVerifierOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAccountDetailsOpen, setIsAccountDetailsOpen] = useState(false);
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

  const isLoggedIn = Boolean(user && typeof user === 'object' && user.email);
  const displayName = user?.name || (user?.email ? user.email.split('@')[0] : 'User');
  const userIdentifier = user?.email || (user?.id ? `ID: #${user.id}` : '');
  const userInitials = (displayName || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'US';

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
        {/* Left: Navigation Drawer Toggle & Cloud Brand & Project Selector */}
        <div className="flex items-center gap-3" style={{ flexShrink: 0, minWidth: 'max-content' }}>
          <button
            type="button"
            onClick={() => setIsSidebarOpen(prev => !prev)}
            style={{
              background: isSidebarOpen ? 'rgba(26, 115, 232, 0.12)' : 'transparent',
              border: isSidebarOpen ? '1px solid rgba(26, 115, 232, 0.3)' : '1px solid transparent',
              color: isSidebarOpen ? '#1a73e8' : 'var(--text-main)',
              cursor: 'pointer',
              padding: '7px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'all 0.2s ease',
            }}
            title={isSidebarOpen ? "Collapse navigation menu" : "Expand navigation menu"}
            aria-label="Toggle navigation menu"
          >
            <Menu size={20} />
          </button>

          {/* Logo & Security Suite Name (Strictly Single Line) */}
          <Link
            to="/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
          >
            {/* Official Cloud Security Logo */}
            <img
              src="/logo.png"
              alt="Cloud Security Logo"
              style={{
                width: '30px',
                height: '30px',
                objectFit: 'contain',
                borderRadius: '6px',
                flexShrink: 0
              }}
            />
            <div style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              flexShrink: 0
            }}>
              <span>Cloud</span>
              <span style={{ color: '#1a73e8', fontWeight: 600 }}>Security</span>
            </div>
          </Link>

          {/* Cloud Project Selector (Strictly Single Line with Truncation) */}
          <div
            onClick={() => requireAuth(() => setIsVerifierOpen(true), "Sign in to connect and switch cloud projects.")}
            className="gcp-project-selector"
            title="Select Cloud Project or Account"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              maxWidth: '210px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              flexShrink: 0,
              cursor: 'pointer'
            }}
          >
            <FolderGit2 size={15} color="#1a73e8" style={{ flexShrink: 0 }} />
            <span style={{
              fontSize: '0.82rem',
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '140px',
              display: 'inline-block'
            }}>
              {activeCloudId ? `${activeProvider}: ${activeCloudId}` : 'Select Cloud Project'}
            </span>
            <ChevronDown size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
          </div>
        </div>

        {/* Right: AI Robot Chat Assistant, Theme Toggle, Notifications & Profile */}
        <div className="flex items-center gap-2" style={{ marginLeft: 'auto' }}>
          {/* AI Security Assistant Chatbox (Robot Face) */}
          <button
            type="button"
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="header-icon-btn"
            title="Open AI Security Chatbot Assistant"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: isChatOpen ? 'rgba(26, 115, 232, 0.15)' : 'transparent',
              border: isChatOpen ? '1px solid #1a73e8' : '1px solid transparent',
              color: '#1a73e8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'var(--transition)',
            }}
          >
            <Bot size={20} color="#1a73e8" />
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

          {/* User Profile or Guest Login/Register Buttons */}
          {!isLoggedIn ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openAuthModal({ title: 'Sign In to Cloud Security', subtitle: 'Sign in with your Google account or email/password.' })}
                className="btn btn-primary"
                style={{
                  padding: '6px 14px',
                  background: '#1a73e8',
                  borderColor: '#1a73e8',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <LogIn size={15} />
                <span>Login</span>
              </button>
              
              <button
                type="button"
                onClick={() => openAuthModal({ title: 'Create Cloud Security Account', subtitle: 'Create a new account with your Google account or email/password.' })}
                className="btn"
                style={{
                  padding: '6px 12px',
                  background: 'var(--panel-inner-bg)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <User size={14} />
                <span>Create Account</span>
              </button>
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setIsAccountDetailsOpen(true)}
                style={{
                  background: isAccountDetailsOpen ? 'var(--panel-inner-bg)' : 'transparent',
                  border: isAccountDetailsOpen ? '1px solid var(--border-color-hover)' : '1px solid var(--border-color)',
                  cursor: 'pointer',
                  padding: '4px 10px 4px 4px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'var(--transition)',
                }}
                title={`Account Details: ${displayName} (Click to manage)`}
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
                <ChevronDown size={14} color="var(--text-muted)" style={{ transform: isAccountDetailsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* 2. GOOGLE CLOUD CONSOLE BODY LAYOUT */}
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        {/* Left Navigation Sidebar */}
        <aside
          className="gcp-sidebar"
          style={{
            width: isSidebarOpen ? '250px' : '68px',
            minWidth: isSidebarOpen ? '250px' : '68px',
            padding: isSidebarOpen ? '16px 0' : '16px 6px',
            transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
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
                  style={{
                    justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                    padding: isSidebarOpen ? '10px 16px' : '10px 0',
                    marginRight: isSidebarOpen ? '12px' : '0',
                    borderRadius: isSidebarOpen ? '0 24px 24px 0' : '12px',
                  }}
                >
                  <Icon size={19} color={isActive ? '#1a73e8' : 'currentColor'} style={{ flexShrink: 0 }} />
                  {isSidebarOpen && (
                    <div className="flex items-center justify-between" style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
                      {item.badge && (
                        <span style={{
                          fontSize: '0.64rem',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: '4px',
                          background: isPro ? 'var(--success-bg)' : 'rgba(26, 115, 232, 0.12)',
                          color: isPro ? 'var(--success)' : '#1a73e8',
                          marginLeft: '8px',
                          flexShrink: 0
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

          {/* Sidebar Pro Tier Banner (when sidebar open and not dismissed) */}
          {isSidebarOpen && !isPro && !isPromoClosed && (
            <div style={{
              margin: '16px',
              padding: '14px',
              borderRadius: '12px',
              background: 'var(--panel-inner-bg)',
              border: '1px solid var(--border-color)',
              position: 'relative',
              animation: 'fadeIn 0.2s ease',
            }}>
              <button
                type="button"
                onClick={() => setIsPromoClosed(true)}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Dismiss"
              >
                <X size={14} />
              </button>
              <div className="flex items-center gap-1.5" style={{ color: '#1a73e8', fontWeight: 700, fontSize: '0.82rem', marginBottom: '4px', paddingRight: '16px' }}>
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
      <AccountDetailsModal
        isOpen={isAccountDetailsOpen}
        onClose={() => setIsAccountDetailsOpen(false)}
      />
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
