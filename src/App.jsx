import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

/* Context */
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./util/ProtectedRoute";

/* Layouts */
import Layout from "./layout/Layout";
import AdminLayout from "./layout/AdminLayout";

/* Páginas cliente */
import Home from "./pages/client/home/Home";
import Modelos from "./pages/client/modelos/Modelos";
import Repuestos from "./pages/client/repuestos/Repuestos";

/* Páginas admin */
import Login from "./pages/admin/auth/Login";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import Slider from "./pages/admin/slider/Slider";
import Inventario from "./pages/admin/inventario/Inventario";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas cliente */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/modelos" element={<Modelos />} />
            <Route path="/repuestos" element={<Repuestos />} />
          </Route>

          {/* Login admin */}
          <Route path="/login/admin" element={<Login />} />

          {/* Rutas admin protegidas */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="slider_gestion" element={<Slider />} />
            <Route path="inventario" element={<Inventario />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
