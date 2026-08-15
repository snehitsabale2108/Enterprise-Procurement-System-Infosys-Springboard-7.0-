import { createContext, useContext, useState, useEffect } from 'react';
import { users, roles } from '../data/mockData';
import { subscribe, registerUser } from '../store/epsStore';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

const persist = (user) => {
  localStorage.setItem('eps_user', JSON.stringify(user));
  localStorage.setItem('eps_token', `mock-jwt-${user.id}-${Date.now()}`);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('eps_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Always trust the live user record (role may have been reassigned by an admin).
        const live = users.find((u) => u.id === parsed.id);
        setCurrentUser(live || parsed);
      } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  /**
   * Keep the session in sync with the user record. When an admin assigns a new
   * role, the signed-in user's role — and therefore their dashboard, sidebar
   * and permissions — switches over immediately.
   */
  useEffect(() =>
    subscribe(() => {
      setCurrentUser((prev) => {
        if (!prev) return prev;
        const live = users.find((u) => u.id === prev.id);
        if (!live) return prev;
        if (live.role === prev.role && live.status === prev.status && live.department === prev.department) {
          return prev;
        }
        const next = { ...live };
        localStorage.setItem('eps_user', JSON.stringify(next));
        return next;
      });
    }), []);

  // Login by user ID (quick-access / dev mode)
  const login = (userId) => {
    const user = users.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');
    setCurrentUser({ ...user });
    persist(user);
    return user;
  };

  // Login by email + password (mock — matches email, accepts any password)
  const loginWithCredentials = (email, password) => {
    if (!email || !password) throw new Error('Email and password are required');
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) throw new Error('No account found with this email address');
    if (user.status !== 'active') throw new Error('Your account has been deactivated. Contact admin.');
    setCurrentUser({ ...user });
    persist(user);
    return user;
  };

  /** Register with the role chosen on the sign-up form. */
  const register = (name, email, password, department, role = 'employee') => {
    const newUser = registerUser({ name, email, password, department, role });
    setCurrentUser({ ...newUser });
    persist(newUser);
    return newUser;
  };

  // Forgot password mock
  const requestPasswordReset = (email) => {
    if (!email) throw new Error('Please enter your email address');
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) throw new Error('No account found with this email address');
    return { message: `Password reset link sent to ${email}` };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('eps_user');
    localStorage.removeItem('eps_token');
  };

  const hasRole = (...roleNames) => {
    if (!currentUser) return false;
    return roleNames.includes(currentUser.role);
  };

  const permissions = roles.find((r) => r.name === currentUser?.role)?.permissions || [];
  const hasPermission = (permission) => permissions.includes(permission);

  return (
    <AuthContext.Provider value={{
      currentUser, login, loginWithCredentials, register,
      requestPasswordReset, logout, hasRole, hasPermission, permissions, loading,
      isAuthenticated: !!currentUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
