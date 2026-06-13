import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, try to restore session if an access token exists
  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem('cafevibes_access_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { user: fetchedUser } = await authService.getMe();
        setUser(fetchedUser);
      } catch (err) {
        localStorage.removeItem('cafevibes_access_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  const persistSession = (data) => {
    if (data?.accessToken) {
      localStorage.setItem('cafevibes_access_token', data.accessToken);
    }
    setUser(data?.user || null);
  };

  const signup = useCallback(async (payload) => {
    const data = await authService.signup(payload);
    persistSession(data);
    return data;
  }, []);

  const login = useCallback(async (payload) => {
    const data = await authService.login(payload);
    persistSession(data);
    return data;
  }, []);

  const googleLogin = useCallback(async (idToken) => {
    const data = await authService.googleAuth(idToken);
    persistSession(data);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem('cafevibes_access_token');
      setUser(null);
    }
  }, []);

  const value = {
    user,
    setUser,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isEmployee: user?.role === 'employee',
    signup,
    login,
    googleLogin,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
