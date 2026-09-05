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
    const cleanEmail = email.trim().toLowerCase();
    let data;
    try {
      // 1. Authenticate via Backend API Server (which queries Supabase Auth)
      data = await apiRequest('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: cleanEmail, password }),
      });
    } catch (serverErr) {
      // If backend is waking up or offline, attempt direct Supabase REST sign-in
      try {
        data = await supabaseSignIn(cleanEmail, password);
      } catch (supabaseErr) {
        // Check local registered users store fallback
        let users = [];
        try {
          users = JSON.parse(localStorage.getItem('cg_registered_users') || '[]');
        } catch (e) {}
        const localUser = users.find(u => u.email.toLowerCase() === cleanEmail);
        if (localUser) {
          if (localUser.password && localUser.password !== password) {
            throw new Error('Incorrect password. Please try again.');
          }
          data = {
            access_token: `jwt_${localUser.id}_${Date.now()}`,
            token_type: 'bearer',
            user: {
              id: localUser.id,
              name: localUser.name,
              email: localUser.email,
              role: localUser.role || 'user',
              auth_provider: 'supabase',
              is_active: true,
              created_at: localUser.created_at || new Date().toISOString()
            }
          };
        } else {
          throw new Error(supabaseErr.message || serverErr.message || 'Login failed. Please check your credentials.');
        }
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
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    // 1. Check if already exists in local registry
    let users = [];
    try {
      users = JSON.parse(localStorage.getItem('cg_registered_users') || '[]');
    } catch (e) { users = []; }

    const localExisting = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (localExisting) {
      throw new Error('An account with this email already exists. Please sign in instead.');
    }

    let data;
    try {
      // 2. Try Backend Registration
      data = await apiRequest('/api/v1/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name: cleanName, email: cleanEmail, password, role }),
      });
    } catch (serverErr) {
      const serverMsg = serverErr.message || '';
      if (['already', 'exists', 'registered', 'duplicate', 'conflict'].some(k => serverMsg.toLowerCase().includes(k))) {
        throw new Error('An account with this email already exists. Please sign in instead.');
      }

      // 3. Direct Supabase Sign Up fallback
      try {
        data = await supabaseSignUp(cleanEmail, password, cleanName, role);
      } catch (supaErr) {
        const supaMsg = supaErr.message || '';
        if (['already', 'exists', 'registered', 'duplicate', 'conflict'].some(k => supaMsg.toLowerCase().includes(k))) {
          throw new Error('An account with this email already exists. Please sign in instead.');
        }
        throw new Error(supaMsg || serverMsg || 'Registration failed. Please try again.');
      }
    }

    if (data && data.user) {
      const localId = data.user.id || Math.floor(Math.random() * 9000) + 1000;
      const registeredRecord = {
        id: localId,
        name: cleanName,
        email: cleanEmail,
        password: password,
        role: role || 'user',
        auth_provider: 'supabase',
        is_active: true,
        created_at: new Date().toISOString()
      };
      users.push(registeredRecord);
      localStorage.setItem('cg_registered_users', JSON.stringify(users));

      const activeToken = data.access_token || `jwt_${localId}_${Date.now()}`;
      localStorage.setItem('token', activeToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(activeToken);
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
