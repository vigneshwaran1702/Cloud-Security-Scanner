import { useState, useEffect } from 'react';
import { Shield, User, Users, ShieldAlert, CheckCircle, Search, Trash2, UserCheck, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../services/api';

export default function AdminUsers() {
  const { user } = useAuth();
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionMsg, setActionMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/api/v1/users');
      setUsersList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn("Using mock users data for administration panel");
      setUsersList([
        { id: 1, name: 'Vignesh Cloud Admin', email: 'vigneshcloud@gmail.com', role: 'admin', is_active: true, created_at: '2026-01-10 09:00:00' },
        { id: 2, name: 'Security Analyst', email: 'user@cloudguard.io', role: 'user', is_active: true, created_at: '2026-01-15 10:30:00' },
        { id: 3, name: 'Compliance Auditor', email: 'auditor@cloudguard.io', role: 'user', is_active: true, created_at: '2026-02-01 14:15:00' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await apiRequest(`/api/v1/users/${userId}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role: newRole }),
      });
      setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      setActionMsg({ type: 'success', text: `Role updated to ${newRole.toUpperCase()} successfully.` });
    } catch (err) {
      setActionMsg({ type: 'error', text: err.message || 'Failed to update user role. Only vigneshcloud@gmail.com can be Administrator.' });
    }
    setTimeout(() => setActionMsg({ type: '', text: '' }), 4000);
  };

  const handleDeleteUser = async (userId) => {
    if (userId === user?.id) {
      setActionMsg({ type: 'error', text: 'You cannot delete your own admin account.' });
      return;
    }
    try {
      await apiRequest(`/api/v1/users/${userId}`, { method: 'DELETE' });
      setUsersList(prev => prev.filter(u => u.id !== userId));
      setActionMsg({ type: 'success', text: 'User removed successfully.' });
    } catch (err) {
      setActionMsg({ type: 'error', text: err.message || 'Failed to delete user.' });
    }
    setTimeout(() => setActionMsg({ type: '', text: '' }), 4000);
  };

  const filteredUsers = usersList.filter(u =>
    (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in flex flex-col gap-6" style={{ paddingBottom: '40px' }}>
      {/* Top Header Card */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '24px' }}>
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div style={{
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              padding: '12px',
              borderRadius: '16px',
              boxShadow: '0 8px 24px rgba(220, 38, 38, 0.3)'
            }}>
              <Users size={28} color="white" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>User Access & Governance</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                Manage team identities, roles, and administrative cloud security privileges.
              </p>
            </div>
          </div>

          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search user name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 38px',
                background: 'var(--input-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
          </div>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionMsg.text && (
        <div style={{
          background: actionMsg.type === 'error' ? 'var(--critical-bg)' : 'var(--success-bg)',
          border: `1px solid ${actionMsg.type === 'error' ? 'var(--critical-border)' : 'var(--success-border)'}`,
          borderRadius: '12px',
          padding: '12px 16px',
          color: actionMsg.type === 'error' ? 'var(--critical)' : 'var(--success)',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          {actionMsg.type === 'error' ? <ShieldAlert size={18} color="var(--critical)" /> : <CheckCircle size={18} color="var(--success)" />}
          <span>{actionMsg.text}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="glass-panel" style={{ borderRadius: '24px', overflow: 'hidden', padding: 0 }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--panel-inner-bg)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '16px 20px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>USER</th>
                <th style={{ padding: '16px 20px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>ROLE</th>
                <th style={{ padding: '16px 20px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>STATUS</th>
                <th style={{ padding: '16px 20px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>REGISTERED DATE</th>
                <th style={{ padding: '16px 20px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Loading user identities...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No users matching criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => {
                  const isVigneshAdmin = u.email.toLowerCase() === 'vigneshcloud@gmail.com';
                  return (
                    <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}>
                      <td style={{ padding: '16px 20px' }}>
                        <div className="flex items-center gap-3">
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: u.role === 'admin' ? 'linear-gradient(135deg, var(--primary), var(--accent))' : 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            color: 'white',
                            fontSize: '0.85rem',
                            boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)'
                          }}>
                            {(u.name || 'User').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>{u.name}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          fontSize: '0.75rem',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          background: u.role === 'admin' ? 'var(--badge-primary-bg)' : 'rgba(59, 130, 246, 0.15)',
                          color: u.role === 'admin' ? 'var(--primary)' : 'var(--low)',
                          border: `1px solid ${u.role === 'admin' ? 'var(--badge-primary-border)' : 'rgba(59, 130, 246, 0.3)'}`,
                          fontWeight: 700,
                          textTransform: 'uppercase'
                        }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          fontSize: '0.75rem',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          background: 'rgba(16, 185, 129, 0.15)',
                          color: 'var(--success)',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)' }}></span>
                          Active
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {u.created_at || '2026-01-10 09:00:00'}
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div className="flex items-center justify-end gap-2">
                          {isVigneshAdmin ? (
                            <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, padding: '6px 10px', background: 'var(--badge-primary-bg)', border: '1px solid var(--badge-primary-border)', borderRadius: '8px' }}>
                              Primary SuperAdmin
                            </span>
                          ) : (
                            <>
                              <button
                                onClick={() => handleRoleChange(u.id, u.role === 'admin' ? 'user' : 'admin')}
                                title="Change user role"
                                style={{
                                  background: 'var(--panel-inner-bg)',
                                  border: '1px solid var(--border-color)',
                                  color: 'var(--text-main)',
                                  padding: '6px 10px',
                                  borderRadius: '8px',
                                  fontSize: '0.78rem',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                <UserCheck size={14} />
                                {u.role === 'admin' ? 'Set as User' : 'Promote'}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                title="Delete user"
                                style={{
                                  background: 'var(--critical-bg)',
                                  border: '1px solid var(--critical-border)',
                                  color: 'var(--critical)',
                                  padding: '6px',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center'
                                }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
