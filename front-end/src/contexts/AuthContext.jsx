import { createContext, useContext, useState, useEffect } from 'react';
import { users } from '../data/mockData';
import { persist } from '../data/mockPersistence';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('eps_user');
    if (stored) {
      try { setCurrentUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  // Login by user ID (quick-access / dev mode)
  const login = (userId) => {
    const user = users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    setCurrentUser(user);
    localStorage.setItem('eps_user', JSON.stringify(user));
    localStorage.setItem('eps_token', `mock-jwt-${user.id}-${Date.now()}`);
    return user;
  };

  // Login by email + password (mock — matches email, accepts any password)
  const loginWithCredentials = (email, password) => {
    if (!email || !password) throw new Error('Email and password are required');
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) throw new Error('No account found with this email address');
    if (user.status !== 'active') throw new Error('Your account has been deactivated. Contact admin.');
    // In mock mode we accept any non-empty password
    setCurrentUser(user);
    localStorage.setItem('eps_user', JSON.stringify(user));
    localStorage.setItem('eps_token', `mock-jwt-${user.id}-${Date.now()}`);
    return user;
  };

  // Register mock (persisted to localStorage so the account survives logout/reload)
  const register = (name, email, password, department) => {
    if (!name || !email || !password) throw new Error('All fields are required');
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) throw new Error('An account with this email already exists');
    const newUser = {
      id: `U${String(users.length + 1).padStart(3, '0')}`,
      name, email, role: 'employee', department: department || 'Engineering',
      avatar: `hsl(${Math.random() * 360}, 60%, 55%)`,
      phone: '', status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };
    users.push(newUser); // add to mock data array
    persist('users', users);
    setCurrentUser(newUser);
    localStorage.setItem('eps_user', JSON.stringify(newUser));
    localStorage.setItem('eps_token', `mock-jwt-${newUser.id}-${Date.now()}`);
    return newUser;
  };

  // Forgot password mock
  const requestPasswordReset = (email) => {
    if (!email) throw new Error('Please enter your email address');
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) throw new Error('No account found with this email address');
    // In mock mode, just return success
    return { message: `Password reset link sent to ${email}` };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('eps_user');
    localStorage.removeItem('eps_token');
  };

  const hasRole = (...roles) => {
    if (!currentUser) return false;
    return roles.includes(currentUser.role);
  };

  return (
    <AuthContext.Provider value={{
      currentUser, login, loginWithCredentials, register,
      requestPasswordReset, logout, hasRole, loading,
      isAuthenticated: !!currentUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
