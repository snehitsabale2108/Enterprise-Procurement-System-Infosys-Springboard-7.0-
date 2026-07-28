import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login";
import {
  ROLE_SCREEN_REGISTRY,
  ROLE_SCREEN_ROLES,
} from "./features/roleScreenRegistry";

function RootRedirect() {
  const { isAuthenticated, getRolePath, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={getRolePath(role)} replace />;
}

function PublicRoute({ children }) {
  const { isAuthenticated, getRolePath, role } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={getRolePath(role)} replace />;
  }

  return children;
}

const roleRoutes = ROLE_SCREEN_ROLES;

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route element={<ProtectedRoute allowedRoles={roleRoutes} />}>
        {roleRoutes.map((role) => (
          <Route
            key={role}
            path={`/${role}`}
            element={<RoleScreenRoute role={role} />}
          />
        ))}
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function RoleScreenRoute({ role }) {
  const Screen = ROLE_SCREEN_REGISTRY[role];

  return Screen ? <Screen /> : <Navigate to="/login" replace />;
}

export default App;
