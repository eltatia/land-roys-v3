import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, role, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;

  if (!user) return <Navigate to="/login/admin" replace />;
  if (requiredRole && role !== requiredRole) return <Navigate to="/login/admin" replace />;

  return children;
};

export default ProtectedRoute;
