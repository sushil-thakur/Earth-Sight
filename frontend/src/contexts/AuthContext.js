import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_ENDPOINTS, STATUS_CODES, ERROR_MESSAGES } from '../config/api';

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
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Set up axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await axios.get(API_ENDPOINTS.auth.profile);
          setUser(response.data.user);
        } catch (error) {
          console.error('Auth check failed:', error);
          // Handle different error scenarios
          if (error.response?.status === STATUS_CODES.UNAUTHORIZED) {
            logout();
          }
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(API_ENDPOINTS.auth.login, {
        email,
        password
      });

      const { token: newToken, user: userData } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const status = error.response?.status;
      let message = ERROR_MESSAGES.SERVER_ERROR;
      
      if (status === STATUS_CODES.UNAUTHORIZED) {
        message = 'Invalid email or password';
      } else if (status === STATUS_CODES.BAD_REQUEST) {
        message = error.response?.data?.error || ERROR_MESSAGES.VALIDATION_ERROR;
      }
      
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(API_ENDPOINTS.auth.register, userData);
      
      const { token: newToken, user: userInfo } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userInfo);
      
      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      const status = error.response?.status;
      let message = ERROR_MESSAGES.SERVER_ERROR;
      
      if (status === STATUS_CODES.BAD_REQUEST) {
        message = error.response?.data?.error || ERROR_MESSAGES.VALIDATION_ERROR;
      }
      
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
  };

  const updateProfile = async (updates) => {
    try {
      const response = await axios.put(API_ENDPOINTS.auth.profile, updates);
      setUser(response.data.user);
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error) {
      const status = error.response?.status;
      let message = ERROR_MESSAGES.SERVER_ERROR;
      
      if (status === STATUS_CODES.UNAUTHORIZED) {
        message = ERROR_MESSAGES.UNAUTHORIZED;
        logout(); // Auto logout on auth error
      } else if (status === STATUS_CODES.BAD_REQUEST) {
        message = error.response?.data?.error || ERROR_MESSAGES.VALIDATION_ERROR;
      }
      
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 