import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserRole = 'student' | 'lecturer' | null;

export interface StudentUser {
  role: 'student';
  fullName: string;
  email: string;
  regNumber: string;
  department: string;
  level: string;
}

export interface LecturerUser {
  role: 'lecturer';
  fullName: string;
  email: string;
  staffId: string;
  department: string;
  courses: string[];
}

export type AppUser = StudentUser | LecturerUser | null;

interface AuthContextType {
  user: AppUser;
  isLoading: boolean;
  login: (user: AppUser) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const stored = await AsyncStorage.getItem('smartattend_user');
      if (stored) setUser(JSON.parse(stored));
    } catch (e) {
      console.log('Error loading user:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData: AppUser) => {
    setUser(userData);
    await AsyncStorage.setItem('smartattend_user', JSON.stringify(userData));
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('smartattend_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
