
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { getStoredData, setStoredData } from '../utils/storage';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, name: string, role: 'admin' | 'user') => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({ user: null, isAuthenticated: false });

  useEffect(() => {
    const savedUser = getStoredData<User>('currentUser');
    if (savedUser) {
      setAuthState({ user: savedUser, isAuthenticated: true });
    }

    // Add demo accounts if not present
    const existingUsers = getStoredData<User[]>('users') || [];
    const updatedUsers = [...existingUsers];
    const demoAccounts = [
      {
        email: 'admin@library.com',
        password: 'password123',
        name: 'Admin User',
        role: 'admin' as const,
      },
      {
        email: 'john@email.com',
        password: 'password123',
        name: 'John Doe',
        role: 'user' as const,
      },
    ];

    for (const account of demoAccounts) {
      if (!existingUsers.find(u => u.email === account.email)) {
        updatedUsers.push({
          id: Date.now().toString() + Math.random(),
          ...account,
          createdAt: new Date().toISOString(),
        });
      }
    }

    setStoredData('users', updatedUsers);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const users = getStoredData<User[]>('users') || [];
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (user && user.password === password) {
        setAuthState({ user, isAuthenticated: true });
        setStoredData('currentUser', user);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string, role: 'admin' | 'user'): Promise<boolean> => {
    try {
      const users = getStoredData<User[]>('users') || [];

      if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) return false;

      const newUser: User = {
        id: Date.now().toString(),
        email: email.toLowerCase(),
        password,
        name,
        role,
        createdAt: new Date().toISOString(),
      };

      const updatedUsers = [...users, newUser];
      setStoredData('users', updatedUsers);
      setStoredData('currentUser', newUser);
      setAuthState({ user: newUser, isAuthenticated: true });

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setAuthState({ user: null, isAuthenticated: false });
    setStoredData('currentUser', null);
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
