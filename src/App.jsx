import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
/* Context */
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./util/ProtectedRoute";

/* Layouts */
import Layout from "./layout/Layout";
import AdminLayout from "./layout/AdminLayout";

/* Lazy Pages / Components */
const Home = lazy(() => import("./pages/client/home/Home"));
const Nosotros = lazy(() => import("./pages/client/nosotros/Nosotros"));
const Consulta = lazy(() => import("./pages/client/consulta/Consulta"));
const Modelos = lazy(() => import("./pages/client/modelos/Modelos"));
const ModeloDetalle = lazy(() => import("./pages/client/modelos/ModeloDetalle"));
const Repuestos = lazy(() => import("./pages/client/repuestos/Repuestos"));
const RepuestoDetalle = lazy(() => import("./pages/client/repuestos/RepuestoDetalle"));
const Blog = lazy(() => import("./pages/client/blog/Blog"));
const BlogPost = lazy(() => import("./pages/client/blog/BlogPost"));

const Login = lazy(() => import("./pages/admin/auth/Login"));
const Dashboard = lazy(() => import("./pages/admin/dashboard/Dashboard"));
const Slider = lazy(() => import("./pages/admin/slider/Slider"));
const BlogGestion = lazy(() => import("./pages/admin/blog/BlogGestion"));
const Home_secciones = lazy(() => import("./pages/admin/home_secciones/Home_secciones"));
const Ranking = lazy(() => import("./components/admin/home_secciones/Ranking"));
const Ofertas = lazy(() => import("./components/admin/home_secciones/Ofertas"));
const Experiencia = lazy(() => import("./components/admin/home_secciones/Experiencia"));
const Inventario = lazy(() => import("./pages/admin/inventario/Inventario"));
const Ventas = lazy(() => import("./pages/admin/ventas/Ventas"));
const Reportes = lazy(() => import("./pages/admin/reportes/Reportes"));
const Clientes = lazy(() => import("./pages/admin/clientes/Clientes"));

const AppLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white text-gray-600">
    Cargando...
  </div>
);

function App() {
  return (
    <AuthProvider>
        <Router>
          <Suspense fallback={<AppLoader />}>
            <Routes>
              {/* Rutas cliente */}
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/modelos" element={<Modelos />} />
                <Route path="/modelos/:id" element={<ModeloDetalle />} />
                <Route path="/repuestos" element={<Repuestos />} />
                <Route path="/repuestos/:id" element={<RepuestoDetalle />} />
                <Route path="/nosotros" element={<Nosotros />} />
                <Route path="/consulta" element={<Consulta />} />
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
                <Route path="blog_gestion" element={<BlogGestion />} />
                <Route path="inventario" element={<Inventario />} />
                <Route path="ventas" element={<Ventas />} />
                <Route path="clientes" element={<Clientes />} />
                <Route path="reportes" element={<Reportes />} />

                {/* Home secciones como padre */}
                <Route path="home_secciones" element={<Home_secciones />}>
                  <Route path="ranking" element={<Ranking />} />
                  <Route path="ofertas" element={<Ofertas />} />
                  <Route path="experiencia" element={<Experiencia />} />
                </Route>


              </Route>
            </Routes>
          </Suspense>
        </Router>
    </AuthProvider>
  );
}

export default App;
