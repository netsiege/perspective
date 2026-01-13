const API_URL = process.env.NEXT_PUBLIC_BACKEND_HOST?.replace(/\/$/, '') || 'http://10.7.7.7:8000';

export interface TeamSession {
  token: string;
  team_id: number;
  team_name: string;
  expires_at: number;
}

export interface AuthResponse {
  message: string;
  team_id: number;
  team_name: string;
  session_id: string;
  token: string;
  expires_in: number;
}

export interface VerifyResponse {
  valid: boolean;
  team_id: number;
  team_name: string;
}

/**
 * Login with team credentials and store session
 */
export const login = async (teamName: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/api/team/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      team_name: teamName,
      password: password,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Authentication failed');
  }

  const data: AuthResponse = await response.json();
  
  // Store session in localStorage
  saveSession(data);
  return data;
};

/**
 * Verify current session token with backend
 */
export const verifySession = async (token: string): Promise<VerifyResponse | null> => {
  try {
    const response = await fetch(`${API_URL}/api/team/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    return null;
  }
};

/**
 * Save session data to localStorage
 */
export const saveSession = (data: AuthResponse): void => {
  localStorage.setItem('session_token', data.session_id);
  localStorage.setItem('team_id', data.team_id.toString());
  localStorage.setItem('team_name', data.team_name);
  localStorage.setItem('game_token', data.token);
  localStorage.setItem('expires_at', (Date.now() + data.expires_in * 1000).toString());
};

/**
 * Get current session from localStorage
 */
export const getSession = (): TeamSession | null => {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('session_token');
  const expiresAt = localStorage.getItem('expires_at');
  
  if (!token || !expiresAt) return null;
  
  // Check expiration
  if (Date.now() > parseInt(expiresAt)) {
    clearSession();
    return null;
  }
  
  return {
    token,
    team_id: parseInt(localStorage.getItem('team_id') || '0'),
    team_name: localStorage.getItem('team_name') || '',
    expires_at: parseInt(expiresAt),
  };
};

/**
 * Clear session from localStorage
 */
export const clearSession = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('session_token');
  localStorage.removeItem('team_id');
  localStorage.removeItem('team_name');
  localStorage.removeItem('game_token');
  localStorage.removeItem('expires_at');
};

/**
 * Logout and clear session
 */
export const logout = (): void => {
  clearSession();
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return getSession() !== null;
};

/**
 * Get authorization headers for authenticated requests
 */
export const getAuthHeaders = (): HeadersInit => {
  const session = getSession();
  
  if (!session) {
    return {};
  }
  
  return {
    'Authorization': `Bearer ${session.token}`,
  };
};

/**
 * Get team-specific game token
 */
export const getGameToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('game_token');
};
