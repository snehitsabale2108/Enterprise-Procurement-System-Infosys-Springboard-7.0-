import { Navigate } from "react-router-dom";
import { renderRoleScreen } from "../features/roleScreenRegistry";
import { normalizeRole, useAuth } from "../context/AuthContext";

export default function RoleDashboard() {
  const { role } = useAuth();
  const normalizedRole = normalizeRole(role);

  if (!normalizedRole) {
    return <Navigate to="/login" replace />;
  }

  return renderRoleScreen(normalizedRole) ?? <Navigate to="/login" replace />;
}
