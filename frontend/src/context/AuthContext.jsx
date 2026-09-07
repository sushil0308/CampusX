import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const DEMO_ACCOUNTS = {
  STUDENT: {
    email: 'student.arjun@campusx.edu',
    password: 'Student@123',
    name: 'Arjun Sharma',
    role: 'STUDENT',
    badge: 'CSE (CGPA 8.85)'
  },
  RECRUITER: {
    email: 'recruiter.google@campusx.edu',
    password: 'Recruiter@123',
    name: 'Sarah Jenkins',
    role: 'RECRUITER',
    badge: 'Google Lead'
  },
  OFFICER: {
    email: 'officer@campusx.edu',
    password: 'Officer@123',
    name: 'Dr. Rajesh Nambiar',
    role: 'PLACEMENT_OFFICER',
    badge: 'Head of Placements'
  },
  ADMIN: {
    email: 'admin@campusx.edu',
    password: 'Admin@123',
    name: 'System Admin',
    role: 'ADMIN',
    badge: 'Full Access'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.login({ email, password });
      if (res.data.success) {
        const authData = res.data.data;
        setToken(authData.token);
        setUser(authData);
        localStorage.setItem('token', authData.token);
        localStorage.setItem('user', JSON.stringify(authData));
        return authData;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please verify credentials.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const register = async (registerData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.register(registerData);
      if (res.data.success) {
        const authData = res.data.data;
        setToken(authData.token);
        setUser(authData);
        localStorage.setItem('token', authData.token);
        localStorage.setItem('user', JSON.stringify(authData));
        return authData;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const quickLoginAs = async (roleKey) => {
    const demo = DEMO_ACCOUNTS[roleKey];
    if (demo) {
      return await login(demo.email, demo.password);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        quickLoginAs,
        isAuthenticated: !!token,
        isStudent: user?.role === 'STUDENT',
        isRecruiter: user?.role === 'RECRUITER',
        isOfficer: user?.role === 'PLACEMENT_OFFICER',
        isAdmin: user?.role === 'ADMIN',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
