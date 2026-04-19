import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  username: string;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const STATIC_USER = 'admin';
const STATIC_PASS = 'admin123';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('auth_logged_in') === 'true';
  });
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('auth_username') || '';
  });

  const login = (user: string, pass: string): boolean => {
    if (user === STATIC_USER && pass === STATIC_PASS) {
      setIsLoggedIn(true);
      setUsername(user);
      localStorage.setItem('auth_logged_in', 'true');
      localStorage.setItem('auth_username', user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername('');
    localStorage.removeItem('auth_logged_in');
    localStorage.removeItem('auth_username');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
