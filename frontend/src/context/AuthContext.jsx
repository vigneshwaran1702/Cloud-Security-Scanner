import { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import { supabaseSignIn, supabaseSignUp, supabaseGetUser } from '../services/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      if (saved && storedToken) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.email) {
          return parsed;
        }
      }
    } catch (e) {}
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return null;
  });
  const [token, setToken] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? localStorage.getItem('token') : null;
  });
  const [loading, setLoading] = useState(true);

  // Global Auth Modal State for Guest Action Interception
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    title: 'Sign In Required',
    subtitle: 'Please sign in with your account or Supabase credentials to continue.',
    onSuccess: null,
  });

  useEffect(() => {
    async function initAuth() {
      const storedToken = localStorage.getItem('token');
      const savedUserStr = localStorage.getItem('user');
      
      if (!storedToken || !savedUserStr) {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setLoading(false);
        return;
      }

      try {
        const parsedUser = JSON.parse(savedUserStr);
        if (parsedUser && parsedUser.email) {
          setUser(parsedUser);
          setToken(storedToken);
        } else {
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (err) {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      setLoading(false);
    }
    initAuth();
  }, []);

  const login = async (email, password) => {
    let data;
    try {
      // 1. Authenticate via Backend API Server (which queries Supabase Auth)
      data = await apiRequest('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    } catch (serverErr) {
      // If backend is waking up or offline, attempt direct Supabase REST sign-in
      try {
        data = await supabaseSignIn(email, password);
      } catch (supabaseErr) {
        throw new Error(supabaseErr.message || serverErr.message || 'Login failed.');
      }
    }

    if (data && data.access_token) {
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.access_token);
      setUser(data.user);
      
      if (authModal.onSuccess && typeof authModal.onSuccess === 'function') {
        authModal.onSuccess(data.user);
      }
      closeAuthModal();
      return data.user;
    }
    throw new Error('Authentication failed to return valid session.');
  };

  const loginWithGoogle = async (googleData = {}) => {
    const email = typeof googleData === 'string' ? googleData : (googleData.email || 'user@gmail.com');
    const name = googleData.name || (email.includes('@') ? email.split('@')[0].replace(/[._-]/g, ' ') : 'Google User');
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
    let data;
    try {
      data = await apiRequest('/api/v1/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role }),
      });
    } catch (serverErr) {
      // Direct Supabase Sign Up fallback
      try {
        data = await supabaseSignUp(email, password, name, role);
      } catch (supaErr) {
        throw new Error(supaErr.message || serverErr.message || 'Registration failed.');
      }
    }

    if (data && data.user && data.access_token) {
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.access_token);
      setUser(data.user);
      
      if (authModal.onSuccess && typeof authModal.onSuccess === 'function') {
        authModal.onSuccess(data.user);
      }
      closeAuthModal();
    }

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
    if (user && user.email) {
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

  const isAdmin = user?.role === 'admin';

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
