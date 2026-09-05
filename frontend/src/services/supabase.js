/**
 * Supabase Client & REST Auth Service
 * Provides direct and REST-based authentication methods for Supabase
 */

export const SUPABASE_CONFIG = {
  url: import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 'https://axkfyqvwgdlptgvbonut.supabase.co',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_9jZwoM-XQbBS2VL8_3fsbQ_2xuPMgMg',
};

const getHeaders = (token = null) => ({
  'Content-Type': 'application/json',
  'apikey': SUPABASE_CONFIG.anonKey,
  ...(token ? { 'Authorization': `Bearer ${token}` } : { 'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}` }),
});

/**
 * Sign in user directly with Supabase Auth REST API
 */
export async function supabaseSignIn(email, password) {
  const url = `${SUPABASE_CONFIG.url.replace(/\/$/, '')}/auth/v1/token?grant_type=password`;
  const response = await fetch(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
  });

  const data = await response.json();
  if (!response.ok) {
    const errorMsg = data.error_description || data.msg || data.message || 'Supabase authentication failed';
    throw new Error(errorMsg);
  }

  const userObj = data.user || {};
  const userMeta = userObj.user_metadata || {};

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    token_type: 'bearer',
    user: {
      id: userObj.id,
      name: userMeta.name || userMeta.full_name || email.split('@')[0].replace(/[._-]/g, ' '),
      email: userObj.email || email,
      role: userMeta.role || 'user',
      auth_provider: 'supabase',
      is_active: true,
      created_at: userObj.created_at || new Date().toISOString(),
    },
  };
}

/**
 * Sign up new user with Supabase Auth REST API
 */
export async function supabaseSignUp(email, password, name = '', role = 'user') {
  const url = `${SUPABASE_CONFIG.url.replace(/\/$/, '')}/auth/v1/signup`;
  const response = await fetch(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      password,
      data: {
        name: name.trim() || email.split('@')[0],
        full_name: name.trim() || email.split('@')[0],
        role: role || 'user',
      },
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    const errorMsg = data.error_description || data.msg || data.message || 'Supabase registration failed';
    throw new Error(errorMsg);
  }

  const userObj = data.user || data;
  const userMeta = userObj.user_metadata || {};

  return {
    access_token: data.access_token || `jwt_supabase_${userObj.id}`,
    refresh_token: data.refresh_token,
    token_type: 'bearer',
    user: {
      id: userObj.id,
      name: userMeta.name || name,
      email: userObj.email || email,
      role: userMeta.role || role,
      auth_provider: 'supabase',
      is_active: true,
      created_at: userObj.created_at || new Date().toISOString(),
    },
  };
}

/**
 * Fetch current user from Supabase with access token
 */
export async function supabaseGetUser(token) {
  if (!token) return null;
  try {
    const url = `${SUPABASE_CONFIG.url.replace(/\/$/, '')}/auth/v1/user`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(token),
    });
    if (!response.ok) return null;
    const userObj = await response.json();
    const userMeta = userObj.user_metadata || {};
    return {
      id: userObj.id,
      name: userMeta.name || userMeta.full_name || userObj.email.split('@')[0],
      email: userObj.email,
      role: userMeta.role || 'user',
      auth_provider: 'supabase',
      is_active: true,
    };
  } catch (e) {
    return null;
  }
}
