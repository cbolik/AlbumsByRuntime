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

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ token: null, user: null });

  const setAuth = useCallback((token: TokenData, user: UserProfile) => {
    setState({ token, user });
  }, []);

  const clearAuth = useCallback(() => {
    setState({ token: null, user: null });
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
