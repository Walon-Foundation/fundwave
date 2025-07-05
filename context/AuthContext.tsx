"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { UserJwtPayload } from '../lib/jwt';

interface AuthState {
  isAuthenticated: boolean;
  user: UserJwtPayload | null;
}

interface AuthContextType extends AuthState {
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const getInitialState = (): AuthState => {
  if (typeof window === 'undefined') {
    return { isAuthenticated: false, user: null };
  }
  try {
    const token = sessionStorage.getItem('session');
    if (!token) return { isAuthenticated: false, user: null };

    const decoded = jwtDecode<UserJwtPayload & { exp: number }>(token);
    if (decoded.exp * 1000 < Date.now()) {
      sessionStorage.removeItem('session');
      return { isAuthenticated: false, user: null };
    }
    return { isAuthenticated: true, user: decoded };
  } catch (e) {
    console.error('Invalid token on initial load', e);
    sessionStorage.removeItem('session');
    return { isAuthenticated: false, user: null };
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(getInitialState);

  const login = (token: string) => {
    try {
      const decoded = jwtDecode<UserJwtPayload>(token);
      sessionStorage.setItem('session', token);
      setAuthState({ isAuthenticated: true, user: decoded });
    } catch (e) {
      console.error('Invalid token on login', e);
      sessionStorage.removeItem('session');
      setAuthState({ isAuthenticated: false, user: null });
    }
  };

  const logout = () => {
    sessionStorage.removeItem('session');
    setAuthState({ isAuthenticated: false, user: null });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
