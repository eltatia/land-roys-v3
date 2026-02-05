import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

/* Context */
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./util/ProtectedRoute";

/* Layouts */
import Layout from "./layout/Layout";
import AdminLayout from "./layout/AdminLayout";

/* Páginas cliente */
import Home from "./pages/client/home/Home";
import Models from "./pages/client/models/Models";
import ModelDetail from "./pages/client/models/ModelDetail";
import Spares from "./pages/client/spares/Spares";
import About from "./pages/client/about/About";

/* Páginas admin */
import Login from "./pages/admin/auth/Login";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import Slider from "./pages/admin/slider/Slider";
import Home_secciones from "./pages/admin/home_secciones/Home_secciones";
import Ranking from "./components/admin/home_secciones/Ranking";
import Ofertas from "./components/admin/home_secciones/Ofertas";
import Experiencia from "./components/admin/home_secciones/Experiencia";

import Inventarios from "./pages/admin/inventarios/Inventarios";
import GestionInventarioMoto from "./components/admin/inventarios/motos/GestionInventarioMoto";



function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas cliente */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/modelos" element={<Models />} />
            <Route path="/modelos/:id" element={<ModelDetail />} />
            <Route path="/repuestos" element={<Spares />} />
            <Route path="/nosotros" element={<About />} />
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
            <Route path="inventario" element={<Inventory />} />
            <Route path="repuestos" element={<InventorySpares />} />
            <Route path="promociones" element={<Promotions />} />
            <Route path="eventos" element={<Events />} />
            <Route path="configuracion" element={<Settings />} />
            <Route path="clientes" element={<Clients />} />
            <Route path="ventas" element={<Sales />} />
            <Route path="reportes" element={<Reports />} />
            <Route path="slider_gestion" element={<Slider />} />

            {/* Home secciones como padre */}
            <Route path="home_secciones" element={<Home_secciones />}>
              <Route path="ranking" element={<Ranking />} />
              <Route path="ofertas" element={<Ofertas />} />
              <Route path="experiencia" element={<Experiencia />} />
            </Route>

            {/* Inventarios como padre */}
            <Route path="inventarios" element={<Inventarios />} >
              <Route path="gestion_motos" element={<GestionInventarioMoto />} />
            </Route>
            
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
