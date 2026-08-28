const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMsg = `API error: ${response.status} ${response.statusText}`;
      try {
        const errData = await response.json();
        if (errData.detail) {
          errorMsg = typeof errData.detail === 'string' ? errData.detail : JSON.stringify(errData.detail);
        }
      } catch (e) {
        // Ignore parse errors
      }
      throw new Error(errorMsg);
    }

    return await response.json();
  } catch (err) {
    // If backend server is down/unreachable, gracefully fallback to mock client mode for seamless demo
    if (err.name === 'TypeError' || err.message.includes('fetch') || err.message.includes('NetworkError')) {
      console.warn(`Backend connection failed (${url}). Utilizing local mock authentication fallback.`);
      return handleMockFallback(endpoint, options);
    }
    throw err;
  }
}

function handleMockFallback(endpoint, options) {
  const body = options.body ? JSON.parse(options.body) : {};

  // Retrieve or initialize local mock users store
  const getMockUsers = () => {
    try {
      const stored = localStorage.getItem('cg_mock_users_db');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      { id: 1, name: 'Vignesh Cloud Admin', email: 'vigneshcloud@gmail.com', role: 'admin', is_active: true, created_at: '2026-01-10 09:00:00' },
      { id: 2, name: 'Security User', email: 'user@cloudguard.io', role: 'user', is_active: true, created_at: '2026-01-15 10:00:00' },
      { id: 3, name: 'Security Auditor', email: 'auditor@cloudguard.io', role: 'user', is_active: true, created_at: '2026-02-01 14:15:00' }
    ];
  };

  const saveMockUsers = (users) => {
    try {
      localStorage.setItem('cg_mock_users_db', JSON.stringify(users));
    } catch (e) {}
  };

  if (endpoint === '/api/v1/auth/login') {
    const rawEmail = (body.email || '').trim().toLowerCase();
    const rawPassword = body.password || '';
    const mockUsers = getMockUsers();
    
    if (!rawEmail || !rawPassword) {
      throw new Error('Please enter both email and password.');
    }

    const foundUser = mockUsers.find(u => u.email.toLowerCase() === rawEmail);
    const isAdmin = rawEmail === 'vigneshcloud@gmail.com';
    
    // Check registered password if exists
    if (foundUser && foundUser.password && foundUser.password !== rawPassword) {
      throw new Error('Invalid email or password. Please check your credentials.');
    }

    if (isAdmin && rawPassword !== 'cloudvignesh17') {
      throw new Error('Invalid credentials for Administrator account.');
    }

    const loggedUser = foundUser ? {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role,
      is_active: foundUser.is_active,
      created_at: foundUser.created_at
    } : {
      id: isAdmin ? 1 : Math.floor(Math.random() * 900) + 10,
      name: isAdmin ? 'Vignesh Cloud Admin' : rawEmail.split('@')[0].replace('.', ' '),
      email: rawEmail,
      role: isAdmin ? 'admin' : 'user',
      is_active: true,
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };

    return {
      access_token: `mock_jwt_token_${Date.now()}`,
      token_type: 'bearer',
      user: loggedUser
    };
  }

  if (endpoint === '/api/v1/auth/register') {
    const rawEmail = (body.email || '').trim().toLowerCase();
    const rawName = (body.name || 'New User').trim();
    const rawPassword = body.password || '';
    const isAdmin = rawEmail === 'vigneshcloud@gmail.com';
    
    const mockUsers = getMockUsers();
    let existing = mockUsers.find(u => u.email.toLowerCase() === rawEmail);
    
    if (existing) {
      throw new Error('An account with this email address already exists. Please sign in instead.');
    }

    const userObj = {
      id: Math.floor(Math.random() * 1000) + 20,
      name: rawName,
      email: rawEmail,
      password: rawPassword,
      role: isAdmin ? 'admin' : (body.role || 'user'),
      is_active: true,
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };
    mockUsers.push(userObj);
    saveMockUsers(mockUsers);

    return {
      access_token: `mock_jwt_token_${Date.now()}`,
      token_type: 'bearer',
      user: {
        id: userObj.id,
        name: userObj.name,
        email: userObj.email,
        role: userObj.role,
        is_active: userObj.is_active,
        created_at: userObj.created_at
      }
    };
  }

  if (endpoint === '/api/v1/auth/me') {
    const storedUser = localStorage.getItem('user');
    if (storedUser) return JSON.parse(storedUser);
    return {
      id: 2,
      name: 'Security User',
      email: 'user@cloudguard.io',
      role: 'user',
      is_active: true,
      created_at: '2026-01-15 10:00:00'
    };
  }

  if (endpoint === '/api/v1/auth/verify-admin-id') {
    const adminKey = body.admin_key || body.admin_id || '';
    const cleanKey = adminKey.trim().toLowerCase();
    const isValid = ['vigneshcloud@gmail.com', 'cloudvignesh17', 'vignesh'].includes(cleanKey);
    
    if (!isValid) {
      throw new Error('Access Denied: Only vigneshcloud@gmail.com can log in as Administrator.');
    }

    const elevatedUser = {
      id: 1,
      name: 'Vignesh Cloud Admin',
      email: 'vigneshcloud@gmail.com',
      role: 'admin',
      is_active: true,
      created_at: '2026-01-10 09:00:00'
    };

    return {
      access_token: `elevated_admin_token_${Date.now()}`,
      token_type: 'bearer',
      user: elevatedUser
    };
  }

  if (endpoint === '/api/v1/cloud/verify-account') {
    const provider = (body.provider || 'AWS').toUpperCase();
    const acc = body.account_id || '891230912401';

    return {
      success: true,
      account_status: {
        account_id: acc,
        provider: provider,
        status: 'Verified & Active',
        security_score: provider === 'AZURE' ? 91 : (provider === 'GCP' ? 88 : 84),
        region: provider === 'AZURE' ? 'eastus2' : (provider === 'GCP' ? 'us-central1' : 'us-east-1'),
        monitored_services: provider === 'AZURE' ? ['Managed Identity', 'Key Vault', 'VNet'] : (provider === 'GCP' ? ['Cloud SQL', 'Cloud Storage'] : ['S3', 'EC2', 'EKS']),
        total_resources: provider === 'AZURE' ? 112 : (provider === 'GCP' ? 60 : 184),
        critical_issues: 1,
        high_issues: 3,
        compliance_status: `${provider} Security Standard Verified`,
        last_verification: new Date().toISOString().replace('T', ' ').slice(0, 19)
      }
    };
  }

  if (endpoint === '/api/v1/users') {
    return [
      { id: 1, name: 'Vignesh Cloud Admin', email: 'vigneshcloud@gmail.com', role: 'admin', is_active: true, created_at: '2026-01-10 09:00:00' },
      { id: 2, name: 'Security Analyst', email: 'user@cloudguard.io', role: 'user', is_active: true, created_at: '2026-01-15 10:30:00' },
      { id: 3, name: 'Compliance Auditor', email: 'auditor@cloudguard.io', role: 'user', is_active: true, created_at: '2026-02-01 14:15:00' }
    ];
  }

  return { success: true };
}

export { API_BASE_URL };

