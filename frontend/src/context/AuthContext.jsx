import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/endpoints';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  const setAuthData = useCallback((userData, accessToken, refreshToken) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
  }, []);

  const clearAuth = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }, []);

  const login = async (credentials) => {
    const { data } = await authAPI.login(credentials);
    setAuthData(data.data.user, data.data.accessToken, data.data.refreshToken);
    return data.data.user;
  };

  const register = async (userData) => {
    const { data } = await authAPI.register(userData);
    setAuthData(data.data.user, data.data.accessToken, data.data.refreshToken);
    return data.data.user;
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } finally {
      clearAuth();
    }
  };

  const handleOAuthCallback = useCallback((userData, accessToken, refreshToken) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const { data } = await authAPI.getMe();
          setUser(data.data);
          localStorage.setItem('user', JSON.stringify(data.data));
        } catch {
          clearAuth();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [clearAuth]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, handleOAuthCallback, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
