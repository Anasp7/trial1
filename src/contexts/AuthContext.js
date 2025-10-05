import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('jwt_token');
    console.log('AuthContext: Checking for existing token:', token ? 'YES' : 'NO');
    
    if (token) {
      console.log('AuthContext: Found token, setting in API service and loading user...');
      apiService.setToken(token);
      loadUser();
    } else {
      console.log('AuthContext: No token found, setting loading to false');
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      console.log('AuthContext: Loading user with current token...');
      const response = await apiService.getCurrentUser();
      console.log('AuthContext: User loaded successfully:', response.user);
      setUser(response.user);
      setError(null);
    } catch (error) {
      console.error('AuthContext: Failed to load user:', error);
      apiService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('AuthContext: Starting login...');
      const response = await apiService.login(email, password);
      console.log('AuthContext: Login response received:', response);
      
      setUser(response.user);
      
      // Update the API service token
      console.log('AuthContext: Setting token in API service...');
      apiService.setToken(response.access_token);
      
      return response;
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.register(userData);
      setUser(response.user);
      
      // Update the API service token
      apiService.setToken(response.access_token);
      
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
    setError(null);
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const hasRole = (role) => {
    return user && user.role === role;
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
    hasRole,
    setError,
  };

  // Debug logging
  console.log('AuthContext render:', {
    user: user ? `${user.name} (${user.role})` : 'null',
    loading,
    hasToken: !!localStorage.getItem('jwt_token')
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
