import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login";
import RoleDashboard from "./pages/RoleDashboard";

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

const roleRoutes = [
  "employee",
  "manager",
  "senior-manager",
  "head",
  "procurement-officer",
  "finance",
  "admin",
  "supplier",
];

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
          <Route key={role} path={`/${role}`} element={<RoleDashboard />} />
        ))}
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
