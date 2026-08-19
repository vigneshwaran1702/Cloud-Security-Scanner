import { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Users, Shield, ShieldAlert, Trash2, Search, CheckCircle, RefreshCw, AlertCircle, UserCheck, ShieldCheck } from 'lucide-react';

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/api/v1/users');
      setUsers(data);
    } catch (err) {
      setError(err.message || 'Failed to load user registry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId, name, email) => {
    if (email.toLowerCase() === 'vigneshcloud@gmail.com') {
      alert('The Primary Administrator account cannot be deleted.');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete user "${name}" (${email})?`)) return;
    try {
      await apiRequest(`/api/v1/users/${userId}`, {
        method: 'DELETE',
      });
      setUsers(prev => prev.filter(u => u.id !== userId));
      setActionSuccess(`User "${name}" deleted successfully.`);
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header Banner */}
      <div className="glass-panel flex justify-between items-center" style={{ padding: '24px' }}>
        <div className="flex items-center gap-4">
          <div style={{ background: 'rgba(139, 92, 246, 0.2)', border: '1px solid var(--accent)', padding: '12px', borderRadius: '14px' }}>
            <Users size={28} color="var(--accent)" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 style={{ margin: 0, fontSize: '1.4rem' }}>User Governance & Security Portal</h2>
              <span style={{
                fontSize: '0.7rem',
                background: 'rgba(139, 92, 246, 0.25)',
                color: '#c084fc',
                padding: '2px 8px',
                borderRadius: '12px',
                border: '1px solid rgba(139, 92, 246, 0.4)',
                fontWeight: 700
              }}>
                ADMIN EXCLUSIVE
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Audit registered users, oversee access control, and manage security directory accounts.
            </p>
          </div>
        </div>

        <button className="btn" onClick={fetchUsers} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white' }}>
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Admin Notice */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.15))',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '16px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div className="flex items-center gap-3">
          <ShieldCheck size={24} color="#c084fc" />
          <div>
            <div style={{ fontWeight: 600, color: 'white', fontSize: '0.95rem' }}>
              Sole System Administrator: <span style={{ color: '#c084fc' }}>vigneshcloud@gmail.com</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              All other accounts are standard users who registered their credentials. Administrator rights are exclusively protected.
            </div>
          </div>
        </div>
      </div>

      {/* Action Notification */}
      {actionSuccess && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid var(--success)',
          borderRadius: '12px',
          padding: '14px 18px',
          color: '#a7f3d0',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <CheckCircle size={18} color="var(--success)" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid var(--critical)',
          borderRadius: '12px',
          padding: '14px 18px',
          color: '#fca5a5',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <AlertCircle size={18} color="var(--critical)" />
          <span>{error}</span>
        </div>
      )}

      {/* Search & Stats Bar */}
      <div className="glass-panel flex justify-between items-center" style={{ padding: '16px 24px' }}>
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 38px',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              color: 'white',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
        </div>

        <div className="flex items-center gap-6" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          <div>Total Users: <strong style={{ color: 'white' }}>{users.length}</strong></div>
          <div>Primary Admin: <strong style={{ color: 'var(--accent)' }}>1</strong></div>
          <div>Registered Users: <strong style={{ color: 'var(--primary)' }}>{users.filter(u => u.email.toLowerCase() !== 'vigneshcloud@gmail.com').length}</strong></div>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading users list...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No users found matching "{search}".
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>User Profile</th>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Email Address</th>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Role & Authority</th>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Registered Date</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => {
                const isSoleAdmin = u.email.toLowerCase() === 'vigneshcloud@gmail.com';
                const isSelf = currentUser?.id === u.id;
                const initials = u.name ? u.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'US';

                return (
                  <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s ease' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <div className="flex items-center gap-3">
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          background: isSoleAdmin ? 'linear-gradient(135deg, var(--accent), #7c3aed)' : 'linear-gradient(135deg, var(--primary), #2563eb)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          color: 'white'
                        }}>
                          {initials}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'white' }}>
                            {u.name} {isSelf && <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '10px', marginLeft: '6px', color: 'var(--text-muted)' }}>(You)</span>}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: #{u.id}</div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '16px 24px', color: 'var(--text-main)' }}>
                      {u.email}
                    </td>

                    <td style={{ padding: '16px 24px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        background: isSoleAdmin ? 'rgba(139, 92, 246, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                        color: isSoleAdmin ? '#c084fc' : '#60a5fa',
                        border: `1px solid ${isSoleAdmin ? 'rgba(139, 92, 246, 0.4)' : 'rgba(59, 130, 246, 0.4)'}`
                      }}>
                        {isSoleAdmin ? <ShieldAlert size={14} /> : <UserCheck size={14} />}
                        {isSoleAdmin ? 'PRIMARY ADMINISTRATOR' : 'STANDARD USER'}
                      </span>
                    </td>

                    <td style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {u.created_at || 'N/A'}
                    </td>

                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <div className="flex items-center gap-2" style={{ justifyContent: 'flex-end' }}>
                        {isSoleAdmin ? (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '6px 12px' }}>
                            Protected Admin
                          </span>
                        ) : (
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name, u.email)}
                            style={{
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              color: 'var(--critical)',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '0.8rem',
                              fontWeight: 500
                            }}
                            title="Delete user"
                          >
                            <Trash2 size={15} />
                            Remove User
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
