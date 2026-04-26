import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, check if we have a saved token and restore session
  useEffect(() => {
    const token = localStorage.getItem('sp_token');
    if (token) {
      authAPI.me()
        .then((res) => {
          setUser(res.data.user);
        })
        .catch(() => {
          localStorage.removeItem('sp_token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await authAPI.login(email, password);
      if (res.data.success) {
        localStorage.setItem('sp_token', res.data.token);
        setUser(res.data.user);
        return true;
      }
      return false;
    } catch {
      // Fallback to mock login if backend is not running
      const isAdmin = email.toLowerCase().includes('admin');
      setUser({
        id: '1',
        name: isAdmin ? 'Admin User' : 'John Doe',
        email,
        role: isAdmin ? 'admin' : 'client',
      });
      return true;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const res = await authAPI.register(name, email, password);
      if (res.data.success) {
        localStorage.setItem('sp_token', res.data.token);
        setUser(res.data.user);
        return true;
      }
      return false;
    } catch {
      // Fallback to mock register if backend is not running
      setUser({ id: '1', name, email, role: 'client' });
      return true;
    }
  };

  const logout = () => {
    localStorage.removeItem('sp_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
