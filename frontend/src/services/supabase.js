import { createClient } from '@supabase/supabase-js';

export const SUPABASE_CONFIG = {
  url: import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 'https://axkfyqvwgdlptgvbonut.supabase.co',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_9jZwoM-XQbBS2VL8_3fsbQ_2xuPMgMg',
};

// Initialize the official Supabase client
export const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/**
 * Sign Up with Supabase Auth
 */
export async function supabaseSignUp(email, password, name = '', role = 'user') {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim() || cleanEmail.split('@')[0].replace(/[._-]/g, ' ');

  const { data, error } = await supabase.auth.signUp({
    email: cleanEmail,
    password,
    options: {
      data: {
        name: cleanName,
        full_name: cleanName,
        role: role || 'user',
      },
    },
  });

  if (error) {
    const rawMsg = error.message || 'Registration failed';
    if (['already', 'registered', 'exists', 'duplicate', 'conflict'].some(k => rawMsg.toLowerCase().includes(k))) {
      throw new Error('An account with this email already exists. Please sign in instead.');
    }
    throw new Error(rawMsg);
  }

  // Anti-enumeration check: if email confirmation is enabled and user already exists
  if (data?.user?.identities && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
    throw new Error('An account with this email already exists. Please sign in instead.');
  }

  const userObj = data?.user || {};
  const userMeta = userObj?.user_metadata || {};
  const userId = userObj?.id;

  // Insert or update profile in Supabase profiles table
  if (userId) {
    try {
      await supabase.from('profiles').upsert({
        id: userId,
        email: cleanEmail,
        name: cleanName,
        role: role || 'user',
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      // Non-blocking if table trigger handles it
    }
  }

  return {
    access_token: data?.session?.access_token || `jwt_supabase_${userId}`,
    refresh_token: data?.session?.refresh_token,
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
 * Sign In with Supabase Auth
 */
export async function supabaseSignIn(email, password) {
  const cleanEmail = email.trim().toLowerCase();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password,
  });

  if (error) {
    throw new Error(error.message || 'Supabase authentication failed');
  }

  const userObj = data.user || {};
  const userMeta = userObj.user_metadata || {};

  return {
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
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

/**
 * Sign Out from Supabase Auth
 */
export async function supabaseSignOut() {
  await supabase.auth.signOut();
}

/**
 * Get current session from Supabase
 */
export async function supabaseGetSession() {
  const { data } = await supabase.auth.getSession();
  return data?.session || null;
}

/**
 * Get current user from Supabase
 */
export async function supabaseGetUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  const userMeta = user.user_metadata || {};
  return {
    id: user.id,
    name: userMeta.name || userMeta.full_name || user.email?.split('@')[0],
    email: user.email,
    role: userMeta.role || 'user',
    auth_provider: 'supabase',
    is_active: true,
  };
}

/**
 * Fetch Profile from Supabase `profiles` table
 */
export async function supabaseGetProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) return null;
    return data;
  } catch (e) {
    return null;
  }
}

/**
 * Save / Update Cloud Account in Supabase `cloud_accounts` table
 */
export async function supabaseSaveCloudAccount(accountData) {
  try {
    const { data, error } = await supabase
      .from('cloud_accounts')
      .upsert(accountData)
      .select();
    if (error) throw error;
    return data;
  } catch (e) {
    console.warn('Supabase cloud_accounts upsert notice:', e.message);
    return null;
  }
}

/**
 * Get Cloud Accounts from Supabase
 */
export async function supabaseGetCloudAccounts() {
  try {
    const { data, error } = await supabase
      .from('cloud_accounts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return [];
    return data || [];
  } catch (e) {
    return [];
  }
}

/**
 * Save Scan Results in Supabase `scans` table
 */
export async function supabaseSaveScan(scanData) {
  try {
    const { data, error } = await supabase
      .from('scans')
      .insert(scanData)
      .select();
    if (error) throw error;
    return data;
  } catch (e) {
    console.warn('Supabase scans insert notice:', e.message);
    return null;
  }
}

/**
 * Get Scans from Supabase
 */
export async function supabaseGetScans() {
  try {
    const { data, error } = await supabase
      .from('scans')
      .select('*')
      .order('started_at', { ascending: false });
    if (error) return [];
    return data || [];
  } catch (e) {
    return [];
  }
}
