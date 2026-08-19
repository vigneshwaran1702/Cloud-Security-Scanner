import { Outlet, Link, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, Cloud, Settings, LogOut, Bell, X, Loader2, CheckCircle, Users, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import SecurityChatDrawer from '../components/SecurityChatDrawer';
import CloudAccountVerifierModal from '../components/CloudAccountVerifierModal';

const pageTitles = {
  '/dashboard': 'Overview',
  '/resources': 'Cloud Resources',
  '/settings': 'Settings',
  '/admin/users': 'User Governance',
};

export default function MainLayout() {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  const pageTitle = pageTitles[currentPath] || 'Overview';
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVerifierOpen, setIsVerifierOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/resources', label: 'Resources', icon: Cloud },
    { path: '/settings', label: 'Settings', icon: Settings },
    ...(isAdmin ? [{ path: '/admin/users', label: 'User Management', icon: Users }] : []),
  ];

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanComplete(false);
  };

  useEffect(() => {
    if (isScanning && !scanComplete) {
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setScanComplete(true);
            return 100;
          }
          return prev + Math.floor(Math.random() * 15) + 5;
        });
      }, 400);
      return () => clearInterval(interval);
    }
  }, [isScanning, scanComplete]);

  const closeScanModal = () => {
    setIsScanning(false);
  };

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

        <div
          onClick={logout}
          className="flex items-center gap-4"
          style={{ color: 'var(--text-muted)', cursor: 'pointer', padding: '12px', marginTop: 'auto', transition: 'var(--transition)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--critical)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-col flex" style={{ flex: 1, padding: '16px 16px 16px 0', overflow: 'hidden' }}>
        {/* Top Header */}
        <header className="glass-panel flex justify-between items-center" style={{ marginBottom: '24px', padding: '16px 24px', borderRadius: '24px' }}>
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

            <button className="btn btn-primary" onClick={startScan}>
              <Shield size={18} />
              Run Scan
            </button>
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <Bell size={20} color="var(--text-muted)" />
              <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: 'var(--critical)', borderRadius: '50%' }}></div>
            </div>
            <div className="flex items-center gap-4">
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
                fontSize: '0.9rem'
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
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
          <Outlet />
        </div>
      </main>

      {/* Scan Modal Overlay */}
      {isScanning && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          animation: 'fadeIn 0.3s ease'
        }}>
          <div className="glass-panel" style={{ width: '420px', padding: '32px', position: 'relative' }}>
            <button 
              onClick={closeScanModal}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
            
            <div className="flex flex-col items-center gap-4 text-center">
              {scanComplete ? (
                <>
                  <CheckCircle size={48} color="var(--success)" />
                  <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Scan Complete</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Successfully scanned 356 resources across AWS and Azure. 
                    No new critical issues found.
                  </p>
                  <button className="btn btn-primary" onClick={closeScanModal} style={{ width: '100%', marginTop: '16px' }}>
                    View Results
                  </button>
                </>
              ) : (
                <>
                  <Loader2 size={48} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
                  <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Running Security Scan...</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Analyzing cloud infrastructure and checking compliance rules.
                  </p>
                  
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginTop: '16px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${Math.min(scanProgress, 100)}%`, 
                      height: '100%', 
                      background: 'var(--primary)',
                      transition: 'width 0.4s ease'
                    }}></div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {Math.min(scanProgress, 100)}% Complete
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

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


