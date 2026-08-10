import { Outlet, Link, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, Cloud, Settings, LogOut, Bell, X, Loader2, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/resources', label: 'Resources', icon: Cloud },
  { path: '/settings', label: 'Settings', icon: Settings },
];

const pageTitles = {
  '/dashboard': 'Overview',
  '/resources': 'Cloud Resources',
  '/settings': 'Settings',
};

export default function MainLayout() {
  const location = useLocation();
  const currentPath = location.pathname;
  const pageTitle = pageTitles[currentPath] || 'Overview';
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);

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

        <div className="flex items-center gap-4" style={{ color: 'var(--text-muted)', cursor: 'pointer', padding: '12px', marginTop: 'auto' }}>
          <LogOut size={20} />
          <span>Logout</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-col flex" style={{ flex: 1, padding: '16px 16px 16px 0', overflow: 'hidden' }}>
        {/* Top Header */}
        <header className="glass-panel flex justify-between items-center" style={{ marginBottom: '24px', padding: '16px 24px', borderRadius: '24px' }}>
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>{pageTitle}</h1>
          <div className="flex items-center gap-6">
            <button className="btn btn-primary" onClick={startScan}>
              <Shield size={18} />
              Run Scan
            </button>
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <Bell size={20} color="var(--text-muted)" />
              <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: 'var(--critical)', borderRadius: '50%' }}></div>
            </div>
            <div className="flex items-center gap-4">
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                AD
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Admin User</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>AWS & Azure</div>
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
    </div>
  );
}

