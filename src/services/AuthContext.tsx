import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { type TokenData } from './spotifyAuth';
import { type UserProfile } from '../types/spotify';

interface AuthState {
  token: TokenData | null;
  user: UserProfile | null;
}

interface AuthContextValue extends AuthState {
  setAuth: (token: TokenData, user: UserProfile) => void;
  clearAuth: () => void;
  isAuthenticated: boolean;
}

const SESSION_KEY = 'albums_by_runtime_auth';

function loadSession(): AuthState {
  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (!stored) return { token: null, user: null };
    const parsed = JSON.parse(stored) as AuthState;
    if (parsed.token && parsed.token.expiresAt > Date.now()) {
      return parsed;
    }
    sessionStorage.removeItem(SESSION_KEY);
  } catch { /* ignore corrupted data */ }
  return { token: null, user: null };
}

function saveSession(state: AuthState): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(loadSession);

  const setAuth = useCallback((token: TokenData, user: UserProfile) => {
    const next = { token, user };
    setState(next);
    saveSession(next);
  }, []);

  const clearAuth = useCallback(() => {
    setState({ token: null, user: null });
    sessionStorage.removeItem(SESSION_KEY);
  }, []);

  const value: AuthContextValue = {
    ...state,
    setAuth,
    clearAuth,
    isAuthenticated: state.token !== null && state.token.expiresAt > Date.now(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
