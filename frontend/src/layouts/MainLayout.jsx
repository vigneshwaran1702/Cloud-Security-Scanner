import { Outlet, Link, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, Cloud, Settings, LogOut, Bell, Users, ShieldCheck, Sparkles } from 'lucide-react';
import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import SecurityChatDrawer from '../components/SecurityChatDrawer';
import CloudAccountVerifierModal from '../components/CloudAccountVerifierModal';
import ScanModal from '../components/ScanModal';
import NotificationsPopover from '../components/NotificationsPopover';

const pageTitles = {
  '/dashboard': 'Overview',
  '/resources': 'Cloud Resources',
  '/settings': 'Settings',
  '/admin/users': 'User Governance',
};

export default function MainLayout() {
  const { user, logout, isAdmin } = useAuth();
  const { unreadCount } = useNotifications();
  const location = useLocation();
  const currentPath = location.pathname;
  const pageTitle = pageTitles[currentPath] || 'Overview';
  
  const [isScanning, setIsScanning] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVerifierOpen, setIsVerifierOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const bellBtnRef = useRef(null);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/resources', label: 'Resources', icon: Cloud },
    { path: '/settings', label: 'Settings', icon: Settings },
    ...(isAdmin ? [{ path: '/admin/users', label: 'User Management', icon: Users }] : []),
  ];

  const userInitials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'US';

  return (
    <div className="flex" style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Sidebar */}
      <aside className="glass-panel flex-col flex" style={{ width: '260px', margin: '16px', borderRadius: '24px', padding: '24px' }}>
        <div className="flex items-center gap-4" style={{ marginBottom: '40px' }}>
          <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', padding: '10px', borderRadius: '12px' }}>
            <Shield size={24} color="white" />
          </div>
          <h2 className="gradient-text" style={{ fontSize: '1.2rem', margin: 0 }}>CloudGuard AI</h2>
        </div>

        <nav className="flex flex-col gap-4" style={{ flex: 1 }}>
          {navItems.map(item => {
            const isActive = currentPath === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-4"
                style={{
                  color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                  textDecoration: 'none',
                  padding: '12px',
                  borderRadius: '12px',
                  background: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
                  transition: 'var(--transition)',
                  fontWeight: isActive ? 500 : 400,
                }}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-col flex" style={{ flex: 1, padding: '16px 16px 16px 0', overflow: 'hidden' }}>
        {/* Top Header */}
        <header className="glass-panel flex justify-between items-center" style={{ position: 'relative', zIndex: 100, marginBottom: '24px', padding: '16px 24px', borderRadius: '24px' }}>
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>{pageTitle}</h1>
          <div className="flex items-center gap-4">
            <button
              className="btn"
              onClick={() => setIsVerifierOpen(true)}
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#a7f3d0',
                padding: '8px 14px',
                borderRadius: '12px',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <ShieldCheck size={18} color="var(--success)" />
              Verify Cloud Status
            </button>

            <button
              className="btn"
              onClick={() => setIsChatOpen(!isChatOpen)}
              style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(59, 130, 246, 0.25))',
                border: '1px solid rgba(139, 92, 246, 0.4)',
                color: '#c084fc',
                padding: '8px 14px',
                borderRadius: '12px',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Sparkles size={18} color="#c084fc" />
              Security Chat
            </button>

            <button className="btn btn-primary" onClick={() => setIsScanning(true)}>
              <Shield size={18} />
              Run Scan
            </button>
            <div style={{ position: 'relative' }}>
              <button
                ref={bellBtnRef}
                type="button"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                style={{
                  background: isNotifOpen ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                  border: isNotifOpen ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                }}
                title="Security Notifications"
              >
                <Bell size={20} color={isNotifOpen ? '#ffffff' : 'var(--text-muted)'} />
                {unreadCount > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    minWidth: '16px',
                    height: '16px',
                    padding: '0 4px',
                    background: 'var(--critical)',
                    color: 'white',
                    fontSize: '0.65rem',
                    fontWeight: 'bold',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)'
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
            <div className="flex items-center gap-3" style={{ paddingLeft: '8px', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: isAdmin ? 'linear-gradient(135deg, var(--accent), #7c3aed)' : 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                color: 'white',
                fontSize: '0.9rem',
                flexShrink: 0
              }}>
                {userInitials}
              </div>
              <div>
                <div className="flex items-center gap-2" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                  {user?.name || 'User'}
                  <span style={{
                    fontSize: '0.7rem',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    background: isAdmin ? 'rgba(139, 92, 246, 0.25)' : 'rgba(59, 130, 246, 0.25)',
                    color: isAdmin ? '#c084fc' : '#60a5fa',
                    border: `1px solid ${isAdmin ? 'rgba(139, 92, 246, 0.4)' : 'rgba(59, 130, 246, 0.4)'}`,
                    fontWeight: 700,
                    textTransform: 'uppercase'
                  }}>
                    {user?.role || 'USER'}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user?.email}</div>
              </div>

              {/* Logout Button directly near User ID */}
              <button
                onClick={logout}
                title="Log out of account"
                style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  color: '#fca5a5',
                  padding: '7px 12px',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginLeft: '8px',
                  transition: 'var(--transition)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.22)';
                  e.currentTarget.style.color = '#ef4444';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)';
                  e.currentTarget.style.color = '#fca5a5';
                }}
              >
                <LogOut size={15} />
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

      {/* Cloud Account Status Verifier Modal */}
      <CloudAccountVerifierModal
        isOpen={isVerifierOpen}
        onClose={() => setIsVerifierOpen(false)}
      />
    </div>
  );
}


