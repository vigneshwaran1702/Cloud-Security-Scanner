import { useState, useRef, useEffect } from 'react';
import { Bell, ShieldAlert, AlertTriangle, CheckCircle2, Info, Check, Trash2, X, Cloud, ArrowRight } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

const typeIcons = {
  critical: { icon: ShieldAlert, color: 'var(--critical)', bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.3)' },
  high: { icon: AlertTriangle, color: 'var(--high)', bg: 'rgba(249, 115, 22, 0.15)', border: 'rgba(249, 115, 22, 0.3)' },
  success: { icon: CheckCircle2, color: 'var(--success)', bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.3)' },
  info: { icon: Info, color: 'var(--primary)', bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.3)' },
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
        top: 'calc(100% + 10px)',
        right: '0',
        width: '380px',
        maxWidth: 'calc(100vw - 32px)',
        zIndex: 1100,
        background: 'rgba(15, 23, 42, 0.96)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '20px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 24px rgba(59, 130, 246, 0.2)',
        overflow: 'hidden',
        animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '520px',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(255, 255, 255, 0.02)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            style={{
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              padding: '8px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Bell size={18} color="white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Notifications</h3>
              {unreadCount > 0 && (
                <span
                  style={{
                    background: 'var(--critical)',
                    color: 'white',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: '10px',
                  }}
                >
                  {unreadCount} new
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              title="Mark all as read"
              className="btn"
              style={{
                padding: '6px 10px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'var(--text-muted)',
                fontSize: '0.75rem',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              <Check size={14} /> Read all
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div
        className="flex items-center gap-2"
        style={{
          padding: '10px 16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          background: 'rgba(0, 0, 0, 0.15)',
        }}
      >
        {[
          { key: 'all', label: 'All' },
          { key: 'unread', label: `Unread (${unreadCount})` },
          { key: 'critical', label: 'Alerts' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            style={{
              padding: '4px 12px',
              borderRadius: '20px',
              border: 'none',
              background: filter === tab.key ? 'var(--primary)' : 'transparent',
              color: filter === tab.key ? 'white' : 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {tab.label}
          </button>
        ))}

        {notifications.length > 0 && (
          <button
            onClick={clearAll}
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              opacity: 0.7,
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0.7')}
          >
            <Trash2 size={12} /> Clear
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        {filteredNotifications.length === 0 ? (
          <div
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.88rem',
            }}
          >
            <CheckCircle2 size={36} color="var(--success)" style={{ margin: '0 auto 12px auto', opacity: 0.8 }} />
            <p style={{ margin: 0, fontWeight: 500 }}>No notifications to display</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem' }}>You're completely up to date!</p>
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
                  borderRadius: '12px',
                  background: item.isRead ? 'rgba(255, 255, 255, 0.02)' : 'rgba(59, 130, 246, 0.08)',
                  border: item.isRead ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(59, 130, 246, 0.25)',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  position: 'relative',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = item.isRead ? 'rgba(255, 255, 255, 0.05)' : 'rgba(59, 130, 246, 0.14)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = item.isRead ? 'rgba(255, 255, 255, 0.02)' : 'rgba(59, 130, 246, 0.08)';
                }}
              >
                {/* Unread indicator dot */}
                {!item.isRead && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '14px',
                      right: '12px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--primary)',
                      boxShadow: '0 0 6px var(--primary)',
                    }}
                  />
                )}

                <div
                  style={{
                    padding: '8px',
                    borderRadius: '10px',
                    background: config.bg,
                    border: `1px solid ${config.border}`,
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  <Icon size={16} color={config.color} />
                </div>

                <div style={{ flex: 1, minWidth: 0, paddingRight: item.isRead ? '20px' : '28px' }}>
                  <div className="flex items-center gap-2" style={{ marginBottom: '2px' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: item.isRead ? 500 : 700, color: 'var(--text-main)' }}>
                      {item.title}
                    </span>
                  </div>

                  <p style={{ margin: '2px 0 6px 0', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    {item.description}
                  </p>

                  <div className="flex items-center gap-2" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {item.cloud && (
                      <span
                        style={{
                          background: 'rgba(255, 255, 255, 0.06)',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: 600,
                        }}
                      >
                        {item.cloud}
                      </span>
                    )}
                    <span>•</span>
                    <span>{item.time}</span>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(item.id);
                  }}
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    opacity: 0.5,
                    padding: '4px',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '0.5')}
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
          padding: '12px 16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(0, 0, 0, 0.25)',
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
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'var(--text-main)',
            fontSize: '0.82rem',
            padding: '8px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          View All Security Findings <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
