import { createContext, useContext, useState, useEffect } from 'react';
import { supabase, supabaseSignIn, supabaseSignUp, supabaseSignOut } from '../services/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Global Auth Modal State for Guest Action Interception
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    title: 'Sign In Required',
    subtitle: 'Please sign in with your account or Supabase credentials to continue.',
    onSuccess: null,
  });

  useEffect(() => {
    // 1. Fetch initial active Supabase session
    async function initSession() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (session && session.user && !error) {
          const userMeta = session.user.user_metadata || {};
          const activeUser = {
            id: session.user.id,
            name: userMeta.name || userMeta.full_name || session.user.email?.split('@')[0],
            email: session.user.email,
            role: userMeta.role || 'user',
            auth_provider: 'supabase',
            is_active: true,
            created_at: session.user.created_at,
          };
          setUser(activeUser);
          setToken(session.access_token);
        } else {
          setUser(null);
          setToken(null);
        }
      } catch (err) {
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    }

    initSession();

    // 2. Real-time Supabase Auth state subscriber
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session && session.user) {
        const userMeta = session.user.user_metadata || {};
        const activeUser = {
          id: session.user.id,
          name: userMeta.name || userMeta.full_name || session.user.email?.split('@')[0],
          email: session.user.email,
          role: userMeta.role || 'user',
          auth_provider: 'supabase',
          is_active: true,
          created_at: session.user.created_at,
        };
        setUser(activeUser);
        setToken(session.access_token);
      } else {
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const result = await supabaseSignIn(cleanEmail, password);

    if (result && result.user) {
      setUser(result.user);
      setToken(result.access_token);

      if (authModal.onSuccess && typeof authModal.onSuccess === 'function') {
        authModal.onSuccess(result.user);
      }
      closeAuthModal();
      return result.user;
    }
    throw new Error('Authentication failed.');
  };

  const loginWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard',
      },
    });
    if (error) throw error;
    return data;
  };

  const register = async (name, email, password, role = 'user') => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    const result = await supabaseSignUp(cleanEmail, password, cleanName, role);

    if (result && result.user) {
      setUser(result.user);
      setToken(result.access_token);

      if (authModal.onSuccess && typeof authModal.onSuccess === 'function') {
        authModal.onSuccess(result.user);
      }
      closeAuthModal();
      return result;
    }
    throw new Error('Registration failed.');
  };

  const elevateToAdmin = async () => {
    if (user?.id) {
      try {
        await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', user.id);
        setUser(prev => ({ ...prev, role: 'admin' }));
      } catch (e) {}
    }
  };

  const logout = async () => {
    await supabaseSignOut();
    setUser(null);
    setToken(null);
  };

  // Helper to open Auth Modal
  const openAuthModal = (config = {}) => {
    setAuthModal({
      isOpen: true,
      title: config.title || 'Sign In to CloudGuard',
      subtitle: config.subtitle || 'Connect with your Supabase account to continue.',
      onSuccess: config.onSuccess || null,
    });
  };

  const closeAuthModal = () => {
    setAuthModal(prev => ({ ...prev, isOpen: false, onSuccess: null }));
  };

  /**
   * Action Gate Helper:
   * If authenticated with Supabase, run action immediately.
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
