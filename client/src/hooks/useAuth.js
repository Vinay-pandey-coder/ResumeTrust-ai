import { useState, useEffect, useCallback } from 'react';
import { getMe } from '../services/api';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const login = useCallback((userData, jwtToken) => {
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken) {
        try {
          if (storedUser) setUser(JSON.parse(storedUser));
          const userData = await getMe();
          setUser(userData.user); // Fix: Access nested user object
          localStorage.setItem('user', JSON.stringify(userData.user));
          setIsLoggedIn(true);
        } catch (error) {
          console.error('Auth verification failed:', error);
          logout();
        }
      } else {
        setIsLoggedIn(false);
      }
      setLoading(false);
    };
    initAuth();
  }, [logout]);

  return { user, token, isLoggedIn, loading, login, logout };
};

export default useAuth;
