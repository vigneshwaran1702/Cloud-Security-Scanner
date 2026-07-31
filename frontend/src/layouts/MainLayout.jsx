import { Outlet, Link } from 'react-router-dom';
import { Shield, LayoutDashboard, Cloud, Settings, LogOut, Bell } from 'lucide-react';

export default function MainLayout() {
  return (
    <div className="flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside className="glass-panel flex-col flex" style={{ width: '260px', margin: '16px', borderRadius: '24px', padding: '24px' }}>
        <div className="flex items-center gap-4" style={{ marginBottom: '40px' }}>
          <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', padding: '10px', borderRadius: '12px' }}>
            <Shield size={24} color="white" />
          </div>
          <h2 className="gradient-text" style={{ fontSize: '1.2rem', margin: 0 }}>CloudGuard AI</h2>
        </div>

        <nav className="flex flex-col gap-4" style={{ flex: 1 }}>
          <Link to="/dashboard" className="flex items-center gap-4" style={{ color: 'var(--text-main)', textDecoration: 'none', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)' }}>
            <LayoutDashboard size={20} className="text-primary" />
            <span style={{ fontWeight: 500 }}>Dashboard</span>
          </Link>
          <Link to="/resources" className="flex items-center gap-4" style={{ color: 'var(--text-muted)', textDecoration: 'none', padding: '12px', borderRadius: '12px', transition: 'var(--transition)' }}>
            <Cloud size={20} />
            <span>Resources</span>
          </Link>
          <Link to="/settings" className="flex items-center gap-4" style={{ color: 'var(--text-muted)', textDecoration: 'none', padding: '12px', borderRadius: '12px', transition: 'var(--transition)' }}>
            <Settings size={20} />
            <span>Settings</span>
          </Link>
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
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Overview</h1>
          <div className="flex items-center gap-6">
            <button className="btn btn-primary">
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
    </div>
  );
}
