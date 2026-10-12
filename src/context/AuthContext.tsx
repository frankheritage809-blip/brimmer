import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/hotel.js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: (role: 'admin' | 'guest') => Promise<void>;
  register: (name: string, email: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    // Check saved session in localStorage
    const saved = localStorage.getItem('grand_azure_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('grand_azure_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('grand_azure_user', JSON.stringify(data.user));
        setShowAuthModal(false);
        return { success: true };
      }
      return { success: false, error: data.error || 'Authentication failed' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  };

  const loginAsDemo = async (role: 'admin' | 'guest') => {
    if (role === 'admin') {
      await login('admin@grandazure.com', 'admin123');
    } else {
      await login('guest@example.com', 'guest123');
    }
  };

  const register = async (name: string, email: string, phone?: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('grand_azure_user', JSON.stringify(data.user));
        setShowAuthModal(false);
        return { success: true };
      }
      return { success: false, error: data.error || 'Registration failed' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('grand_azure_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginAsDemo,
        register,
        logout,
        showAuthModal,
        setShowAuthModal,
        authModalMode,
        setAuthModalMode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
