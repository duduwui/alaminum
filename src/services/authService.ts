import { User, LoginCredentials, RegisterPayload } from '../types/auth';

const STORAGE_KEY_CURRENT_USER = 'winhome_current_user';

export function processGoogleAuthCallback(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const hash = window.location.hash || '';
    const search = window.location.search || '';
    let encoded: string | null = null;

    if (hash.includes('google_success=')) {
      const queryPart = hash.includes('?') ? hash.split('?')[1] : hash.replace('#', '');
      encoded = new URLSearchParams(queryPart).get('google_success');
    } else if (search.includes('google_success=')) {
      encoded = new URLSearchParams(search).get('google_success');
    }

    if (encoded) {
      const data = JSON.parse(atob(encoded));
      if (data.token) {
        localStorage.setItem('dh_admin_token', data.token);
      }
      if (data.user) {
        localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(data.user));
        window.dispatchEvent(new CustomEvent('auth-changed', { detail: data.user }));
        // Clean URL query while preserving hash anchor
        const cleanHash = hash.startsWith('#auth') || hash.startsWith('#login') || hash.startsWith('#register') ? '#auth' : '';
        window.history.replaceState(null, '', window.location.pathname + cleanHash);
        return data.user;
      }
    }
  } catch (e) {
    console.error('Error processing Google auth callback:', e);
  }
  return null;
}

export function getCurrentUser(): User | null {
  try {
    // Process any incoming Google callback first
    const googleUser = processGoogleAuthCallback();
    if (googleUser) return googleUser;

    const raw = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
    if (!raw) return null;
    const user = JSON.parse(raw);
    if (
      user &&
      (user.email?.toLowerCase().includes('winhome') ||
       user.name?.toLowerCase().includes('winhome') ||
       user.company?.toLowerCase().includes('winhome'))
    ) {
      localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
      return null;
    }
    return user;
  } catch (e) {
    console.error('Error reading current user:', e);
    return null;
  }
}

export function getAdminToken(): string | null {
  return localStorage.getItem('dh_admin_token');
}

export function getAuthHeaders(additionalHeaders: Record<string, string> = {}): Record<string, string> {
  const token = getAdminToken();
  return {
    ...additionalHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export function setCurrentUser(user: User | null): void {
  if (!user) {
    localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
  } else {
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('auth-changed', { detail: user }));
  }
}

export function logoutUser(): void {
  if (['admin', 'super_admin'].includes(getCurrentUser()?.role || '')) {
    void fetch('/api/cms/logout', { method: 'POST', credentials: 'include', headers: getAuthHeaders() }).catch(() => {});
  }
  localStorage.removeItem('dh_admin_token');
  setCurrentUser(null);
}

export async function loginAdminUser(credentials: LoginCredentials): Promise<User> {
  const email = credentials.email.trim();
  const password = credentials.password.trim();

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    const payload = await response.json().catch(() => ({}));
    if (response.ok) {
      if (payload.token) {
        localStorage.setItem('dh_admin_token', payload.token);
      }
      if (payload.user?.role !== 'admin' && payload.user?.role !== 'super_admin') {
        throw new Error('This account does not have administrator access.');
      }
      setCurrentUser(payload.user);
      return payload.user as User;
    }

    throw new Error(payload.error || 'Administrator sign-in failed.');
  } catch (err: any) {
    throw err;
  }
}

export async function loginUser(credentials: LoginCredentials): Promise<User> {
  const email = credentials.email.trim();
  const password = credentials.password.trim();

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      if (data.token) {
        localStorage.setItem('dh_admin_token', data.token);
      }
      setCurrentUser(data.user);
      return data.user;
    }

    throw new Error(data.error || 'Authentication failed');
  } catch (err: any) {
    throw err;
  }
}

export async function registerUser(payload: RegisterPayload): Promise<User> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    setCurrentUser(data.user);
    return data.user;
}

export async function requestPasswordReset(email: string): Promise<string> {
  const response = await fetch('/api/auth/forgot-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Could not send reset email.');
  return data.message;
}

export async function resetPassword(token: string, password: string): Promise<void> {
  const response = await fetch('/api/auth/reset-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, password }) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Could not reset password.');
}

// User CRUD Management for Admin Portal
export async function fetchAllUsers(): Promise<User[]> {
    const res = await fetch('/api/users', {
      credentials: 'include',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Could not load users.');
    return res.json();
}

export async function createUser(payload: Partial<User> & { password?: string }): Promise<User> {
    const res = await fetch('/api/users', {
      method: 'POST',
      credentials: 'include',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Failed to create admin');
    return data;
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User> {
    const res = await fetch(`/api/users/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(updates)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Could not update account');
    return data;
}

export async function deleteUser(id: string): Promise<boolean> {
    const res = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: getAuthHeaders()
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Could not delete account');
  return true;
}
