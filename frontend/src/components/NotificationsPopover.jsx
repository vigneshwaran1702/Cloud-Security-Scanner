import { useState, useRef, useEffect } from 'react';
import { Bell, ShieldAlert, AlertTriangle, CheckCircle2, Info, Check, Trash2, X, ArrowRight } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

const typeIcons = {
  critical: { icon: ShieldAlert, color: '#f87171', bg: 'rgba(239, 68, 68, 0.2)', border: 'rgba(239, 68, 68, 0.4)' },
  high: { icon: AlertTriangle, color: '#fb923c', bg: 'rgba(249, 115, 22, 0.2)', border: 'rgba(249, 115, 22, 0.4)' },
  success: { icon: CheckCircle2, color: '#34d399', bg: 'rgba(16, 185, 129, 0.2)', border: 'rgba(16, 185, 129, 0.4)' },
  info: { icon: Info, color: '#60a5fa', bg: 'rgba(59, 130, 246, 0.2)', border: 'rgba(59, 130, 246, 0.4)' },
};

export default function NotificationsPopover({ isOpen, onClose, triggerRef }) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();
  const [filter, setFilter] = useState('all');
  const popoverRef = useRef(null);
  const navigate = useNavigate();

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        (!triggerRef?.current || !triggerRef.current.contains(event.target))
      ) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'critical') return n.type === 'critical' || n.type === 'high';
    return true;
  });

  const handleItemClick = (item) => {
    markAsRead(item.id);
    if (item.type === 'critical' || item.type === 'high') {
      navigate('/resources');
      onClose();
    }
  };

  return (
    <div
      ref={popoverRef}
      style={{
        position: 'absolute',
        top: 'calc(100% + 12px)',
        right: '0',
        width: '400px',
        maxWidth: 'calc(100vw - 32px)',
        zIndex: 9999,
        background: '#0d1527',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.1), 0 10px 25px rgba(0, 0, 0, 0.6)',
        overflow: 'hidden',
        animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '540px',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: '14px 18px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          background: '#131e36',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            style={{
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              padding: '7px',
              borderRadius: '9px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
            }}
          >
            <Bell size={17} color="white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#ffffff' }}>Notifications</h3>
              {unreadCount > 0 && (
                <span
                  style={{
                    background: 'var(--critical)',
                    color: 'white',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: '10px',
                    boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)',
                  }}
                >
                  {unreadCount} new
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              title="Mark all as read"
              className="btn"
              style={{
                padding: '5px 9px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#e2e8f0',
                fontSize: '0.75rem',
                borderRadius: '7px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 500,
              }}
            >
              <Check size={13} /> Mark read
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '7px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#94a3b8';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: '8px 16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: '#090f1d',
        }}
      >
        <div className="flex items-center gap-1.5">
          {[
            { key: 'all', label: 'All' },
            { key: 'unread', label: `Unread (${unreadCount})` },
            { key: 'critical', label: 'Alerts' },
          ].map(tab => {
            const isActive = filter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '14px',
                  border: isActive ? '1px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.06)',
                  background: isActive ? 'var(--primary)' : 'rgba(255, 255, 255, 0.06)',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#94a3b8';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                  }
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {notifications.length > 0 && (
          <button
            onClick={clearAll}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              fontSize: '0.72rem',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 6px',
              borderRadius: '6px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#f87171';
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#94a3b8';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <Trash2 size={12} /> Clear all
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          background: '#0d1527',
          maxHeight: '360px',
        }}
      >
        {filteredNotifications.length === 0 ? (
          <div
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: '#94a3b8',
              fontSize: '0.88rem',
            }}
          >
            <CheckCircle2 size={36} color="var(--success)" style={{ margin: '0 auto 12px auto', opacity: 0.9 }} />
            <p style={{ margin: 0, fontWeight: 600, color: '#ffffff' }}>No notifications</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>You are completely up to date!</p>
          </div>
        ) : (
          filteredNotifications.map(item => {
            const config = typeIcons[item.type] || typeIcons.info;
            const Icon = config.icon;

            return (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: item.isRead ? '#131d31' : '#162544',
                  border: item.isRead ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(59, 130, 246, 0.35)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = item.isRead ? '#1a2742' : '#1e325c';
                  e.currentTarget.style.borderColor = item.isRead ? 'rgba(255, 255, 255, 0.18)' : 'rgba(59, 130, 246, 0.6)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = item.isRead ? '#131d31' : '#162544';
                  e.currentTarget.style.borderColor = item.isRead ? 'rgba(255, 255, 255, 0.08)' : 'rgba(59, 130, 246, 0.35)';
                }}
              >
                {/* Unread indicator dot */}
                {!item.isRead && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--primary)',
                      boxShadow: '0 0 8px var(--primary)',
                    }}
                  />
                )}

                <div
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    background: config.bg,
                    border: `1px solid ${config.border}`,
                    flexShrink: 0,
                    marginTop: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={16} color={config.color} />
                </div>

                <div style={{ flex: 1, minWidth: 0, paddingRight: item.isRead ? '18px' : '24px' }}>
                  <div className="flex items-center gap-2" style={{ marginBottom: '3px' }}>
                    <span style={{ fontSize: '0.86rem', fontWeight: item.isRead ? 600 : 700, color: '#ffffff' }}>
                      {item.title}
                    </span>
                  </div>

                  <p style={{ margin: '2px 0 6px 0', fontSize: '0.79rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                    {item.description}
                  </p>

                  <div className="flex items-center gap-2" style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    {item.cloud && (
                      <span
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: '#e2e8f0',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                        }}
                      >
                        {item.cloud}
                      </span>
                    )}
                    <span>•</span>
                    <span style={{ color: '#94a3b8' }}>{item.time}</span>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(item.id);
                  }}
                  title="Dismiss notification"
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    opacity: 0.6,
                    padding: '4px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.color = '#f87171';
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.opacity = '0.6';
                    e.currentTarget.style.color = '#94a3b8';
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: '10px 16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          background: '#090f1d',
        }}
      >
        <button
          onClick={() => {
            navigate('/resources');
            onClose();
          }}
          className="btn"
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(139, 92, 246, 0.25))',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            color: '#ffffff',
            fontSize: '0.8rem',
            fontWeight: 600,
            padding: '8px 12px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(139, 92, 246, 0.4))';
            e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.6)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(139, 92, 246, 0.25))';
            e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
          }}
        >
          View All Security Findings <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
