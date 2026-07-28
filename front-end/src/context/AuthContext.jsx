/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext();

export const ROLE_PATHS = {
  employee: "/employee",
  manager: "/manager",
  "senior-manager": "/senior-manager",
  head: "/head",
  "procurement-officer": "/procurement-officer",
  finance: "/finance",
  admin: "/admin",
  supplier: "/supplier",
};

export const ROLE_LABELS = {
  employee: "Employee",
  manager: "Manager",
  "senior-manager": "Senior Manager",
  head: "Head",
  "procurement-officer": "Procurement Officer",
  finance: "Finance",
  admin: "Admin",
  supplier: "Supplier",
};

export function normalizeRole(role) {
  return String(role ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

export function getRoleLabel(role) {
  const normalizedRole = normalizeRole(role);
  return ROLE_LABELS[normalizedRole] ?? role ?? "User";
}

function readStoredAuth() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const user = localStorage.getItem("user");

  if (!token || !role) {
    return { token: null, role: null, user: null };
  }

  return {
    token,
    role,
    user: user
      ? (() => {
          try {
            return JSON.parse(user);
          } catch {
            return null;
          }
        })()
      : null,
  };
}

export function AuthProvider({ children }) {
  const initialAuth = useMemo(() => readStoredAuth(), []);
  const [auth, setAuth] = useState(initialAuth);

  const login = (data) => {
    const token = data.token ?? data.accessToken ?? data.access_token ?? null;
    const role = normalizeRole(data.role ?? data.user?.role ?? null);
    const user = data.user ?? (role ? { role } : null);

    if (token) {
      localStorage.setItem("token", token);
    }

    if (role) {
      localStorage.setItem("role", role);
    }

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }

    setAuth({ token, role, user });
  };

  const logout = () => {
    localStorage.clear();

    setAuth({ token: null, role: null, user: null });
  };

  const isAuthenticated = Boolean(auth.token);
  const role = normalizeRole(auth.role);

  const value = useMemo(
    () => ({
      user: auth.user,
      token: auth.token,
      role,
      isAuthenticated,
      login,
      logout,
      getRolePath: (nextRole = role) => {
        const normalizedRole = normalizeRole(nextRole);

        return ROLE_PATHS[normalizedRole] ?? "/login";
      },
      getRoleLabel,
    }),
    [auth.user, auth.token, isAuthenticated, role],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
