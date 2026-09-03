import { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Global Auth Modal State for Guest Action Interception
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    title: 'Sign In Required',
    subtitle: 'Please sign in with your Google account or Gmail/password to continue.',
    onSuccess: null,
  });

  useEffect(() => {
    async function initAuth() {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const userData = await apiRequest('/api/v1/auth/me');
          if (userData && userData.email) {
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          }
          setToken(storedToken);
        } catch (err) {
          console.error("Auth validation failed:", err);
          const savedUser = localStorage.getItem('user');
          if (!savedUser) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
          }
        }
      }
      setLoading(false);
    }
    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await apiRequest('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.access_token);
    setUser(data.user);
    
    // If there was a pending action after modal auth, trigger it
    if (authModal.onSuccess && typeof authModal.onSuccess === 'function') {
      authModal.onSuccess(data.user);
    }
    closeAuthModal();
    return data.user;
  };

  const loginWithGoogle = async (googleData = {}) => {
    const email = typeof googleData === 'string' ? googleData : (googleData.email || 'vigneshcloud@gmail.com');
    const name = googleData.name || (email.includes('@') ? email.split('@')[0] : 'Google User');
    const picture = googleData.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`;

    const data = await apiRequest('/api/v1/auth/google', {
      method: 'POST',
      body: JSON.stringify({ email, name, picture }),
    });

    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.access_token);
    setUser(data.user);

    if (authModal.onSuccess && typeof authModal.onSuccess === 'function') {
      authModal.onSuccess(data.user);
    }
    closeAuthModal();
    return data.user;
  };

  const register = async (name, email, password, role = 'user') => {
    const data = await apiRequest('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });

    return data;
  };

  const elevateToAdmin = async (adminKey) => {
    const data = await apiRequest('/api/v1/auth/verify-admin-id', {
      method: 'POST',
      body: JSON.stringify({ admin_key: adminKey, admin_id: adminKey }),
    });

    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.access_token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // Helper to open Auth Modal
  const openAuthModal = (config = {}) => {
    setAuthModal({
      isOpen: true,
      title: config.title || 'Sign In to CloudGuard',
      subtitle: config.subtitle || 'Connect with your Google account or Gmail/password to continue.',
      onSuccess: config.onSuccess || null,
    });
  };

  const closeAuthModal = () => {
    setAuthModal(prev => ({ ...prev, isOpen: false, onSuccess: null }));
  };

  /**
   * Action Gate Helper:
   * If authenticated, run action immediately.
   * If guest/unauthenticated, open Auth Modal with action context.
   */
  const requireAuth = (actionCallback, reasonSubtitle = 'Sign in to access this feature') => {
    if (user) {
      if (typeof actionCallback === 'function') actionCallback(user);
      return true;
    }
    openAuthModal({
      title: 'Authentication Required',
      subtitle: reasonSubtitle,
      onSuccess: () => {
        if (typeof actionCallback === 'function') actionCallback();
      },
    });
    return false;
  };

  const isAdmin = user?.role === 'admin' && user?.email?.toLowerCase() === 'vigneshcloud@gmail.com';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        loginWithGoogle,
        register,
        elevateToAdmin,
        logout,
        isAdmin,
        authModal,
        openAuthModal,
        closeAuthModal,
        requireAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
