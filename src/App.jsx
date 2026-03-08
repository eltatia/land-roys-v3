import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';

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
import ModeloDetalle from "./pages/client/modelos/ModeloDetalle";
import Blog from "./pages/client/blog/Blog";
import BlogPost from "./pages/client/blog/BlogPost";

/* Páginas admin */
import Login from "./pages/admin/auth/Login";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import Slider from "./pages/admin/slider/Slider";
import Inventario from "./pages/admin/inventario/Inventario";
import Ventas from "./pages/admin/ventas/Ventas";
import Clientes from "./pages/admin/clientes/Clientes";
import Reportes from "./pages/admin/reportes/Reportes";
import BlogGestion from "./pages/admin/blog/BlogGestion";

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Rutas cliente */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/modelos" element={<Modelos />} />
              <Route path="/modelos/:id" element={<ModeloDetalle />} />
              <Route path="/repuestos" element={<Repuestos />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
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
              <Route path="ventas" element={<Ventas />} />
              <Route path="clientes" element={<Clientes />} />
              <Route path="blog_gestion" element={<BlogGestion />} />
              <Route path="reportes" element={<Reportes />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
