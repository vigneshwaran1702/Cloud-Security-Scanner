import { useState, useRef, useEffect } from 'react';
import { Bell, ShieldAlert, AlertTriangle, CheckCircle2, Info, Check, Trash2, X, ArrowRight } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

const typeIcons = {
  critical: { icon: ShieldAlert, color: 'var(--critical)', bg: 'var(--critical-bg)', border: 'var(--critical-border)' },
  high: { icon: AlertTriangle, color: 'var(--high)', bg: 'var(--high-bg)', border: 'var(--high-border)' },
  success: { icon: CheckCircle2, color: 'var(--success)', bg: 'var(--success-bg)', border: 'var(--success-border)' },
  info: { icon: Info, color: 'var(--low)', bg: 'var(--low-bg)', border: 'var(--low-border)' },
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
        background: 'var(--panel-bg-solid)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        boxShadow: 'var(--glass-shadow-hover)',
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
          borderBottom: '1px solid var(--border-color)',
          background: 'var(--panel-inner-bg)',
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
              boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)',
            }}
          >
            <Bell size={17} color="white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)' }}>Notifications</h3>
              {unreadCount > 0 && (
                <span
                  style={{
                    background: 'var(--critical)',
                    color: 'white',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: '10px',
                    boxShadow: '0 2px 6px rgba(244, 63, 94, 0.4)',
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
                background: 'var(--panel-inner-bg)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
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
              background: 'transparent',
              border: '1px solid var(--border-color)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '7px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'var(--text-main)';
              e.currentTarget.style.background = 'var(--badge-primary-bg)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.background = 'transparent';
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
          borderBottom: '1px solid var(--border-color)',
          background: 'var(--panel-inner-bg)',
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
                  border: isActive ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                  background: isActive ? 'var(--primary)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
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
              color: 'var(--text-muted)',
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
              e.currentTarget.style.color = 'var(--critical)';
              e.currentTarget.style.background = 'var(--critical-bg)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--text-muted)';
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
          maxHeight: '360px',
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
            <CheckCircle2 size={36} color="var(--success)" style={{ margin: '0 auto 12px auto', opacity: 0.9 }} />
            <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-main)' }}>No notifications</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>You are completely up to date!</p>
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
                  background: item.isRead ? 'var(--panel-inner-bg)' : 'var(--badge-primary-bg)',
                  border: item.isRead ? '1px solid var(--border-color)' : '1px solid var(--border-color-hover)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
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
                    <span style={{ fontSize: '0.86rem', fontWeight: item.isRead ? 600 : 700, color: 'var(--text-main)' }}>
                      {item.title}
                    </span>
                  </div>

                  <p style={{ margin: '2px 0 6px 0', fontSize: '0.79rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                    {item.description}
                  </p>

                  <div className="flex items-center gap-2" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {item.cloud && (
                      <span
                        style={{
                          background: 'var(--panel-inner-bg)',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-main)',
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
                    <span style={{ color: 'var(--text-muted)' }}>{item.time}</span>
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
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    opacity: 0.6,
                    padding: '4px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s',
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
          borderTop: '1px solid var(--border-color)',
          background: 'var(--panel-inner-bg)',
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
            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
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
        >
          View All Security Findings <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
