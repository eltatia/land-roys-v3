import { useAuth } from "../context/useAuth";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-600">
        Verificando sesión...
      </div>
    );
  }

  if (!user) return <Navigate to="/login/admin" replace />;
  if (requiredRole && role !== requiredRole) return <Navigate to="/login/admin" replace />;

  return children;
};

export default ProtectedRoute;
