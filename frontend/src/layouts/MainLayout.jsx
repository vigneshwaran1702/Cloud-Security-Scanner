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
  BookOpen,
  Search,
  ExternalLink,
  ChevronRight,
  Layers,
  Lock,
  Flame,
  Activity,
  FileText,
  HelpCircle,
  LogIn
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
import CloudflareLearningModal from '../components/CloudflareLearningModal';

const breadcrumbMap = {
  '/dashboard': { category: 'Live Security Operations', title: 'Security Overview & Posture' },
  '/resources': { category: 'Asset Management', title: 'Cloud Resources & Inventory' },
  '/subscription': { category: 'Plans & Upgrades', title: 'Pro Security Defender' },
  '/settings': { category: 'Platform Configuration', title: 'Settings & Cloud Keys' },
  '/admin/users': { category: 'Enterprise Governance', title: 'User Access Control' },
};

export default function MainLayout() {
  const { user, logout, isAdmin, requireAuth, openAuthModal } = useAuth();
  const { unreadCount } = useNotifications();
  const { isPro, activeTier } = useSubscription();
  const { theme, toggleTheme, isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const [isScanning, setIsScanning] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVerifierOpen, setIsVerifierOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLearningModalOpen, setIsLearningModalOpen] = useState(false);
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

  const breadcrumb = breadcrumbMap[currentPath] || { category: 'Learning Center', title: 'Cloud Security Documentation' };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)', color: 'var(--text-main)', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. CLOUDFLARE TOP GLOBAL HEADER */}
      <header className="cf-global-header">
        {/* Brand & Learning Center Tag */}
        <div className="cf-brand-container">
          <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div className="cf-logo-icon">
              <Flame size={22} fill="white" />
            </div>
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                CloudGuard <span style={{ color: '#f6821f' }}>AI</span>
              </div>
              <div style={{ fontSize: '0.66rem', color: 'var(--text-subtle)', fontWeight: 700, letterSpacing: '0.05em' }}>
                SECURITY PLATFORM
              </div>
            </div>
          </Link>

          <div className="cf-brand-divider" />

          {/* Cloudflare Learning Hub Button */}
          <button
            type="button"
            onClick={() => setIsLearningModalOpen(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 8px',
              borderRadius: '6px',
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#f6821f'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <BookOpen size={15} color="#f6821f" />
            <span>Learning Center</span>
          </button>
        </div>

        {/* Center Search & Top Navigation Links */}
        <div className="flex items-center gap-4">
          <div className="cf-search-box">
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search cloud security docs, assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="cf-search-input"
            />
          </div>

          <nav className="cf-nav-links">
            <Link to="/dashboard" className={`cf-nav-link-btn ${currentPath === '/dashboard' ? 'active' : ''}`}>
              Dashboard
            </Link>
            <Link to="/resources" className={`cf-nav-link-btn ${currentPath === '/resources' ? 'active' : ''}`}>
              Resources
            </Link>
            <Link to="/subscription" className={`cf-nav-link-btn ${currentPath === '/subscription' ? 'active' : ''}`}>
              Pricing & Plans
            </Link>
            <Link to="/settings" className={`cf-nav-link-btn ${currentPath === '/settings' ? 'active' : ''}`}>
              Settings
            </Link>
            {isAdmin && (
              <Link to="/admin/users" className={`cf-nav-link-btn ${currentPath === '/admin/users' ? 'active' : ''}`}>
                Admin
              </Link>
            )}
          </nav>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-2.5">
          {/* Verify Cloud Button */}
          <button
            type="button"
            onClick={() => requireAuth(() => setIsVerifierOpen(true), "Sign in with your Google account or Gmail/password to verify and connect your cloud ID.")}
            className="btn"
            style={{
              padding: '7px 14px',
              background: 'var(--panel-inner-bg)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontSize: '0.82rem',
              fontWeight: 600,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ShieldCheck size={16} color="var(--success)" />
            <span>Verify Cloud</span>
          </button>

          {/* Primary Action: Run Scan (Cloudflare Orange) */}
          <button
            type="button"
            onClick={() => requireAuth(() => setIsScanning(true), "Sign in with your Google account or Gmail/password to start live cloud scans.")}
            className="btn"
            style={{
              padding: '7px 16px',
              background: '#f6821f',
              color: '#ffffff',
              border: 'none',
              fontSize: '0.82rem',
              fontWeight: 700,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 10px rgba(246, 130, 31, 0.3)'
            }}
          >
            <Shield size={15} />
            <span>Run Scan</span>
          </button>

          <div style={{ width: '1px', height: '20px', background: 'var(--border-color)', margin: '0 4px' }} />

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="header-icon-btn"
            type="button"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{ width: '34px', height: '34px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {isDark ? <Sun size={16} color="#fbbf24" /> : <Moon size={16} color="#f6821f" />}
          </button>

          {/* Notifications Button */}
          <div style={{ position: 'relative' }}>
            <button
              ref={bellBtnRef}
              type="button"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="header-icon-btn"
              style={{ width: '34px', height: '34px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="Notifications"
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '1px',
                  right: '1px',
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

          <div style={{ width: '1px', height: '20px', background: 'var(--border-color)', margin: '0 4px' }} />

          {/* User Profile or Guest Login Button */}
          {!user ? (
            <button
              type="button"
              onClick={() => openAuthModal({ title: 'Sign In to CloudGuard', subtitle: 'Sign in with your Google account or Gmail/password to access full scanning, verification, and Pro features.' })}
              className="btn"
              style={{
                padding: '7px 16px',
                background: 'var(--primary)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
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
                  padding: '3px 8px 3px 4px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'var(--transition)',
                }}
                title="Account Menu"
              >
                {user?.picture ? (
                  <img
                    src={user.picture}
                    alt={displayName}
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '1.5px solid #f6821f',
                    }}
                  />
                ) : (
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f6821f, #faad3f)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: '0.78rem',
                    flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(246, 130, 31, 0.3)'
                  }}>
                    {userInitials}
                  </div>
                )}
                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2 }}>
                    {displayName}
                  </span>
                  <span style={{ fontSize: '0.66rem', color: 'var(--text-subtle)', lineHeight: 1.2, maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {userIdentifier}
                  </span>
                </div>
                <ChevronDown size={13} color="var(--text-muted)" style={{ transform: isUserMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
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
                  <div style={{ padding: '8px 10px 10px', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {displayName}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                      {userIdentifier}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                      <span style={{
                        fontSize: '0.64rem',
                        padding: '2px 6px',
                        borderRadius: '6px',
                        background: 'rgba(246, 130, 31, 0.15)',
                        color: '#f6821f',
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

                  <Link
                    to="/settings"
                    onClick={() => setIsUserMenuOpen(false)}
                    style={{ padding: '8px 10px', borderRadius: '8px', color: 'var(--text-main)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: 500 }}
                  >
                    <User size={15} color="var(--text-muted)" />
                    <span>Account Settings</span>
                  </Link>

                  <Link
                    to="/subscription"
                    onClick={() => setIsUserMenuOpen(false)}
                    style={{ padding: '8px 10px', borderRadius: '8px', color: 'var(--text-main)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: 500 }}
                  >
                    <Zap size={15} color="#f6821f" />
                    <span>Subscription Plan</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin/users"
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{ padding: '8px 10px', borderRadius: '8px', color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: 600 }}
                    >
                      <Users size={15} color="var(--primary)" />
                      <span>Admin Governance</span>
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
                      fontSize: '0.82rem',
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

      {/* 2. 3-COLUMN CLOUDFLARE LEARNING & SECOPS BODY */}
      <div className="cf-body-layout">

        {/* LEFT SIDEBAR: Cloudflare Learning & Documentation Tree */}
        <aside className="cf-sidebar-left">
          {/* Cloud Concepts Section */}
          <div className="cf-tree-category">Cloud Security Concepts</div>
          <div
            className="cf-tree-link"
            onClick={() => setIsLearningModalOpen(true)}
          >
            <div className="flex items-center gap-2.5">
              <Cloud size={16} color="#f6821f" />
              <span>What is the Cloud?</span>
            </div>
            <BookOpen size={13} color="var(--text-subtle)" />
          </div>

          <div
            className="cf-tree-link"
            onClick={() => setIsLearningModalOpen(true)}
          >
            <div className="flex items-center gap-2.5">
              <Shield size={16} color="#f6821f" />
              <span>Shared Responsibility</span>
            </div>
            <ExternalLink size={12} color="var(--text-subtle)" />
          </div>

          <div
            className="cf-tree-link"
            onClick={() => setIsLearningModalOpen(true)}
          >
            <div className="flex items-center gap-2.5">
              <Lock size={16} color="#f6821f" />
              <span>Zero Trust Architecture</span>
            </div>
          </div>

          {/* Security Operations Section */}
          <div className="cf-tree-category">Live Security Operations</div>
          <Link
            to="/dashboard"
            className={`cf-tree-link ${currentPath === '/dashboard' ? 'active' : ''}`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard size={16} />
              <span>Security Dashboard</span>
            </div>
            <ChevronRight size={13} color="var(--text-subtle)" />
          </Link>

          <Link
            to="/resources"
            className={`cf-tree-link ${currentPath === '/resources' ? 'active' : ''}`}
          >
            <div className="flex items-center gap-2.5">
              <Layers size={16} />
              <span>Asset Inventory</span>
            </div>
            <ChevronRight size={13} color="var(--text-subtle)" />
          </Link>

          <div
            className="cf-tree-link"
            onClick={() => requireAuth(() => setIsScanning(true), "Sign in to launch live cloud security scanner.")}
          >
            <div className="flex items-center gap-2.5">
              <Activity size={16} />
              <span>Live Cloud Scanner</span>
            </div>
            <span style={{ fontSize: '0.65rem', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
              AUTO
            </span>
          </div>

          {/* Supported Cloud Providers */}
          <div className="cf-tree-category">Connected Providers</div>
          <div
            className="cf-tree-link"
            onClick={() => requireAuth(() => setIsVerifierOpen(true), "Sign in to inspect AWS account security.")}
          >
            <div className="flex items-center gap-2.5">
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff9900' }} />
              <span>Amazon Web Services (AWS)</span>
            </div>
          </div>

          <div
            className="cf-tree-link"
            onClick={() => requireAuth(() => setIsVerifierOpen(true), "Sign in to inspect Azure subscription security.")}
          >
            <div className="flex items-center gap-2.5">
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0078d4' }} />
              <span>Microsoft Azure</span>
            </div>
          </div>

          <div
            className="cf-tree-link"
            onClick={() => requireAuth(() => setIsVerifierOpen(true), "Sign in to inspect GCP project security.")}
          >
            <div className="flex items-center gap-2.5">
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4285f4' }} />
              <span>Google Cloud (GCP)</span>
            </div>
          </div>

          {/* Governance & Platform */}
          <div className="cf-tree-category">Governance & Upgrades</div>
          <Link
            to="/subscription"
            className={`cf-tree-link ${currentPath === '/subscription' ? 'active' : ''}`}
          >
            <div className="flex items-center gap-2.5">
              <Zap size={16} color="#f6821f" />
              <span>Pro Subscription</span>
            </div>
            <span style={{ fontSize: '0.65rem', background: isPro ? 'var(--success-bg)' : 'rgba(246, 130, 31, 0.15)', color: isPro ? 'var(--success)' : '#f6821f', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
              {isPro ? 'PRO' : '$39'}
            </span>
          </Link>

          <Link
            to="/settings"
            className={`cf-tree-link ${currentPath === '/settings' ? 'active' : ''}`}
          >
            <div className="flex items-center gap-2.5">
              <Settings size={16} />
              <span>Settings & Themes</span>
            </div>
          </Link>

          {isAdmin && (
            <Link
              to="/admin/users"
              className={`cf-tree-link ${currentPath === '/admin/users' ? 'active' : ''}`}
            >
              <div className="flex items-center gap-2.5">
                <Users size={16} color="var(--primary)" />
                <span>User Governance</span>
              </div>
            </Link>
          )}

          {/* Cloudflare Style AI Assist Banner in Sidebar */}
          <div style={{
            marginTop: 'auto',
            padding: '14px',
            borderRadius: '12px',
            background: 'var(--panel-inner-bg)',
            border: '1px solid var(--border-color)',
          }}>
            <div className="flex items-center gap-2" style={{ color: '#f6821f', fontWeight: 700, fontSize: '0.82rem', marginBottom: '4px' }}>
              <Sparkles size={14} /> AI SecOps Assistant
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0 0 10px 0', lineHeight: 1.35 }}>
              Instant remediation commands & cloud architecture guidance.
            </p>
            <button
              type="button"
              onClick={() => setIsChatOpen(true)}
              className="btn btn-primary"
              style={{ width: '100%', padding: '7px', fontSize: '0.78rem', fontWeight: 600, borderRadius: '8px' }}
            >
              Open AI Chat
            </button>
          </div>
        </aside>

        {/* CENTER CONTENT COLUMN */}
        <main className="cf-content-center">
          {/* Cloudflare Style Breadcrumbs */}
          <div className="cf-breadcrumbs">
            <Link to="/dashboard" className="cf-breadcrumb-item">Cloudflare Learning & SecOps</Link>
            <span>/</span>
            <span style={{ color: 'var(--text-subtle)' }}>{breadcrumb.category}</span>
            <span>/</span>
            <span style={{ color: '#f6821f', fontWeight: 600 }}>{breadcrumb.title}</span>
          </div>

          {/* Dynamic Page Outlet */}
          <Outlet />
        </main>

        {/* RIGHT SIDEBAR: "On This Page" / Quick Cloud Posture Status */}
        <aside className="cf-sidebar-right">
          {/* Active Cloud ID Posture Card */}
          <div style={{
            padding: '16px',
            borderRadius: '14px',
            background: 'var(--panel-bg-solid)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
              LIVE CLOUD STATUS
            </div>
            {activeCloudId ? (
              <div>
                <div className="flex items-center gap-2" style={{ marginBottom: '6px' }}>
                  <CheckCircle2 size={16} color="var(--success)" />
                  <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{activeProvider} Connected</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', wordBreak: 'break-all', fontFamily: 'monospace' }}>
                  {activeCloudId}
                </div>
                <button
                  onClick={() => requireAuth(() => setIsVerifierOpen(true), "Sign in to verify and change cloud ID.")}
                  style={{ marginTop: '10px', width: '100%', padding: '6px', fontSize: '0.75rem', background: 'var(--panel-inner-bg)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-main)', cursor: 'pointer', fontWeight: 600 }}
                >
                  Change Cloud ID
                </button>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                  No cloud account connected yet.
                </div>
                <button
                  onClick={() => requireAuth(() => setIsVerifierOpen(true), "Sign in to verify and connect cloud ID.")}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '7px', fontSize: '0.78rem', fontWeight: 600, borderRadius: '8px' }}
                >
                  <ShieldCheck size={14} /> Connect Cloud ID
                </button>
              </div>
            )}
          </div>

          {/* Quick Learning Links */}
          <div style={{
            padding: '16px',
            borderRadius: '14px',
            background: 'var(--panel-bg-solid)',
            border: '1px solid var(--border-color)',
          }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
              LEARNING TOPICS
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setIsLearningModalOpen(true)}
                style={{ background: 'none', border: 'none', textAlign: 'left', padding: 0, fontSize: '0.82rem', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                onMouseOver={(e) => e.currentTarget.style.color = '#f6821f'}
                onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                <ChevronRight size={13} color="#f6821f" /> What is the Cloud?
              </button>
              <button
                type="button"
                onClick={() => setIsLearningModalOpen(true)}
                style={{ background: 'none', border: 'none', textAlign: 'left', padding: 0, fontSize: '0.82rem', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                onMouseOver={(e) => e.currentTarget.style.color = '#f6821f'}
                onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                <ChevronRight size={13} color="#f6821f" /> Shared Responsibility
              </button>
              <button
                type="button"
                onClick={() => setIsLearningModalOpen(true)}
                style={{ background: 'none', border: 'none', textAlign: 'left', padding: 0, fontSize: '0.82rem', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                onMouseOver={(e) => e.currentTarget.style.color = '#f6821f'}
                onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                <ChevronRight size={13} color="#f6821f" /> Securing AWS & Azure
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* GLOBAL MODALS */}
      <AuthModal />
      <CloudflareLearningModal
        isOpen={isLearningModalOpen}
        onClose={() => setIsLearningModalOpen(false)}
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
        onOpenCloudVerifier={() => requireAuth(() => setIsVerifierOpen(true), "Sign in with Google or Gmail/password to verify and connect your cloud ID.")}
      />
    </div>
  );
}
