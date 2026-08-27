import { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

const initialNotifications = [
  {
    id: 'notif-1',
    title: 'Public S3 Bucket Alert',
    description: 'Bucket customer-data-prod has public read permissions enabled.',
    type: 'critical',
    cloud: 'AWS',
    time: '10m ago',
    isRead: false,
  },
  {
    id: 'notif-2',
    title: 'Overprivileged Managed Identity',
    description: 'app-service-identity-prod has Subscription Owner permissions.',
    type: 'high',
    cloud: 'Azure',
    time: '25m ago',
    isRead: false,
  },
  {
    id: 'notif-3',
    title: 'Unencrypted Cloud SQL Database',
    description: 'user-db-instance-gcp lacks Customer-Managed Encryption (CMEK).',
    type: 'critical',
    cloud: 'GCP',
    time: '1h ago',
    isRead: false,
  },
  {
    id: 'notif-4',
    title: 'PCI DSS Compliance Passed',
    description: 'Cloud environment scored 91% in PCI DSS v4.0 evaluation.',
    type: 'success',
    cloud: 'System',
    time: '3h ago',
    isRead: true,
  },
  {
    id: 'notif-5',
    title: 'Automated Config Backup',
    description: 'Multi-cloud security posture state archived successfully.',
    type: 'info',
    cloud: 'System',
    time: '5h ago',
    isRead: true,
  },
];

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('cloudguard_notifications');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not load saved notifications:', e);
    }
    return initialNotifications;
  });

  useEffect(() => {
    try {
      localStorage.setItem('cloudguard_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.warn('Could not save notifications:', e);
    }
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const addNotification = ({ title, description, type = 'info', cloud = 'System' }) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      title,
      description,
      type,
      cloud,
      time: 'Just now',
      isRead: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
