import { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Users, Shield, UserCheck, ShieldAlert, Trash2, Search, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';

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

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      const updated = await apiRequest(`/api/v1/users/${userId}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role: newRole }),
      });
      setUsers(prev => prev.map(u => u.id === userId ? updated : u));
      setActionSuccess(`Role for ${updated.name} updated to ${updated.role.toUpperCase()}`);
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to update role');
    }
  };

  const handleDeleteUser = async (userId, name) => {
    if (!window.confirm(`Are you sure you want to delete user "${name}"?`)) return;
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
            <h2 style={{ margin: 0, fontSize: '1.4rem' }}>User & Access Management</h2>
            <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Manage registered users, assign administrator privileges, and audit system access.
            </p>
          </div>
        </div>

        <button className="btn" onClick={fetchUsers} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white' }}>
          <RefreshCw size={16} />
          Refresh
        </button>
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
          <div>Admins: <strong style={{ color: 'var(--accent)' }}>{users.filter(u => u.role === 'admin').length}</strong></div>
          <div>Standard Users: <strong style={{ color: 'var(--primary)' }}>{users.filter(u => u.role === 'user').length}</strong></div>
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
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Role</th>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Registered</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => {
                const isAdmin = u.role === 'admin';
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
                          background: isAdmin ? 'linear-gradient(135deg, var(--accent), #7c3aed)' : 'linear-gradient(135deg, var(--primary), #2563eb)',
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
                        background: isAdmin ? 'rgba(139, 92, 246, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                        color: isAdmin ? '#c084fc' : '#60a5fa',
                        border: `1px solid ${isAdmin ? 'rgba(139, 92, 246, 0.4)' : 'rgba(59, 130, 246, 0.4)'}`
                      }}>
                        {isAdmin ? <ShieldAlert size={14} /> : <UserCheck size={14} />}
                        {isAdmin ? 'ADMINISTRATOR' : 'STANDARD USER'}
                      </span>
                    </td>

                    <td style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {u.created_at || 'N/A'}
                    </td>

                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <div className="flex items-center gap-2" style={{ justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleRoleChange(u.id, u.role)}
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid var(--border-color)',
                            color: isAdmin ? '#f97316' : '#a855f7',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title={`Click to switch role to ${isAdmin ? 'User' : 'Admin'}`}
                        >
                          <Shield size={14} />
                          {isAdmin ? 'Demote to User' : 'Promote to Admin'}
                        </button>

                        {!isSelf && (
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            style={{
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              color: 'var(--critical)',
                              padding: '6px 10px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center'
                            }}
                            title="Delete user"
                          >
                            <Trash2 size={16} />
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
