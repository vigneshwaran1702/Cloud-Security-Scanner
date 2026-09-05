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
  const cleanEmail = email.trim().toLowerCase();
  const url = `${SUPABASE_CONFIG.url.replace(/\/$/, '')}/auth/v1/token?grant_type=password`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email: cleanEmail, password }),
    });

    const data = await response.json();
    if (response.ok && data.access_token) {
      const userObj = data.user || {};
      const userMeta = userObj.user_metadata || {};

      return {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        token_type: 'bearer',
        user: {
          id: userObj.id,
          name: userMeta.name || userMeta.full_name || cleanEmail.split('@')[0].replace(/[._-]/g, ' '),
          email: userObj.email || cleanEmail,
          role: userMeta.role || 'user',
          auth_provider: 'supabase',
          is_active: true,
          created_at: userObj.created_at || new Date().toISOString(),
        },
      };
    }
    
    // If Supabase returned an error message, extract it
    const errorMsg = data.error_description || data.msg || data.message || 'Supabase authentication failed';
    throw new Error(errorMsg);
  } catch (err) {
    throw err;
  }
}

/**
 * Sign up new user with Supabase Auth REST API
 */
export async function supabaseSignUp(email, password, name = '', role = 'user') {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim() || cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
  const url = `${SUPABASE_CONFIG.url.replace(/\/$/, '')}/auth/v1/signup`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      email: cleanEmail,
      password,
      data: {
        name: cleanName,
        full_name: cleanName,
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
  const userId = userObj.id || `user_${Date.now()}`;

  // Attempt to sync to public.profiles REST endpoint if accessible
  try {
    const profileUrl = `${SUPABASE_CONFIG.url.replace(/\/$/, '')}/rest/v1/profiles`;
    await fetch(profileUrl, {
      method: 'POST',
      headers: {
        ...getHeaders(data.access_token),
        'Prefer': 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        id: userId,
        email: cleanEmail,
        name: cleanName,
        role: role || 'user',
        updated_at: new Date().toISOString(),
      }),
    });
  } catch (e) {
    // Non-blocking: Supabase DB trigger or client handles profiles
  }

  return {
    access_token: data.access_token || `jwt_supabase_${userId}`,
    refresh_token: data.refresh_token,
    token_type: 'bearer',
    user: {
      id: userId,
      name: userMeta.name || cleanName,
      email: userObj.email || cleanEmail,
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
