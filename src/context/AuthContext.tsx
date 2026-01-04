"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as authLogin, logout as authLogout, getSession, verifySession } from '@/lib/auth';
import { AuthState } from '@/types/data';

interface AuthContextType extends AuthState {
  login: (teamName: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    teamId: null,
    teamName: null,
    loading: true,
  });

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      const session = getSession();
      
      if (session) {
        // Verify session with backend
        const verified = await verifySession(session.token);
        
        if (verified && verified.valid) {
          setAuthState({
            isAuthenticated: true,
            teamId: session.team_id,
            teamName: session.team_name,
            loading: false,
          });
        } else {
          // Session invalid, clear it
          authLogout();
          setAuthState({
            isAuthenticated: false,
            teamId: null,
            teamName: null,
            loading: false,
          });
        }
      } else {
        setAuthState({
          isAuthenticated: false,
          teamId: null,
          teamName: null,
          loading: false,
        });
      }
    };

    checkSession();
  }, []);

  const login = async (teamName: string, password: string) => {
    try {
      const response = await authLogin(teamName, password);
      
      setAuthState({
        isAuthenticated: true,
        teamId: response.team_id,
        teamName: response.team_name,
        loading: false,
      });
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authLogout();
    setAuthState({
      isAuthenticated: false,
      teamId: null,
      teamName: null,
      loading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
