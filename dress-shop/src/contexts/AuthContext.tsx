'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (name: string, email: string, password: string) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser({
        ...parsed,
        memberSince: parsed.memberSince ? new Date(parsed.memberSince) : undefined,
      });
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    }
  }, [user, isLoaded]);

  const login = async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const mockUser: User = {
      id: '1',
      name: 'Jane Doe',
      email: email,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + email,
      loyaltyPoints: 250,
      memberSince: new Date('2023-01-15'),
    };
    
    setUser(mockUser);
  };

  const signup = async (name: string, email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: name,
      email: email,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + email,
      loyaltyPoints: 0,
      memberSince: new Date(),
    };
    
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        signup,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
