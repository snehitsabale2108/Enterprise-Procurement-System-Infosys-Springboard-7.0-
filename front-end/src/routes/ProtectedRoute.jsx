import { Navigate, Outlet, useLocation } from "react-router-dom";
import { normalizeRole, useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, role, getRolePath } = useAuth();
  const location = useLocation();
  const normalizedRole = normalizeRole(role);
  const normalizedAllowedRoles = allowedRoles?.map((allowedRole) =>
    normalizeRole(allowedRole),
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (
    normalizedAllowedRoles?.length &&
    !normalizedAllowedRoles.includes(normalizedRole)
  ) {
    return <Navigate to={getRolePath(normalizedRole)} replace />;
  }

  return <Outlet />;
}
