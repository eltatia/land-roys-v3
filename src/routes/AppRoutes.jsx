import { Routes, Route } from "react-router-dom";
import Layout from "../layout/Layout";
import Home from "../pages/client/home/Home";

import LayoutCatalogoMotos from "../layout/LayoutCatalogoMotos";
import LayoutRepuestos from "../layout/LayoutRepuestos";

import CatalogoMotos from "../pages/client/catalogoMotos/CatalogoMotos";
import MotoDetail from "../pages/client/catalogoMotos/MotoDetail";
import Repuestos from "../pages/client/repuestos/Repuestos";
import RepuestoDetail from "../pages/client/repuestos/RepuestoDetail";
import Nosotros from "../pages/nosotros/Nosotros";
import Descuentos from "../pages/descuentos/Descuentos";

import Contact from "../pages/client/contact/Contact";

import NotFound404 from "../errors/404";

// admin imports
import DashboardView from "../pages/admin/adminSidebar/dashboard/DashboardView";
import AdminLayout from "../layout/AdminLayout";


// auth views
import LoginView from "../pages/admin/auth/LoginView";
import RegisterView from "../pages/admin/auth/RegisterView";

// route protection
import AdminRoute from "./AdminRoute";
import AdminOnlyRoute from "./AdminOnlyRoute";
import UsuariosView from "../pages/admin/adminNavbar/usuarios/UsuariosView";
import PerfilView from "../pages/admin/adminNavbar/perfil/PerfilView";
import ConfiguracionView from "../pages/admin/adminNavbar/configuracion/ConfiguracionView";
import CarruselHomeView from "../pages/admin/adminSidebar/carruselHome/CarruselHomeView";
import ModelosView from "../pages/admin/adminSidebar/modelos/ModelosView";
import PedidosView from "../pages/admin/adminSidebar/pedidos/PedidosView";


const AppRoutes = () => {
    return (
        <Routes>
            {/* Rutas de admin auth*/}
            <Route path="/admin/register" element={<RegisterView />} />
            <Route path="/admin/login" element={<LoginView />} />


            {/* Rutas de admin con layout */}
            <Route
                path="/admin"
                element={
                    <AdminRoute>
                        <AdminLayout />
                    </AdminRoute>
                }
            >
                {/* /admin → Dashboard */}
                <Route index element={<DashboardView />} />

                {/* /admin/Navbar*/}
                <Route path="perfil" element={<PerfilView />} />
                <Route path="configuracion" element={<ConfiguracionView />} />

                {/* Rutas protegidas SOLO para ADMIN */}
                <Route
                    path="usuarios"
                    element={
                        <AdminOnlyRoute>
                            <UsuariosView />
                        </AdminOnlyRoute>
                    }
                />

                {/* /admin/Sidebar*/}
                <Route path="gestion-carrusel" element={<CarruselHomeView />} />
                <Route path="modelos" element={<ModelosView />} />
                <Route path="pedidos" element={<PedidosView />} />
            </Route>



            {/* Layout general */}
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/nosotros" element={<Nosotros />} />
                <Route path="/descuentos" element={<Descuentos />} />
                <Route path="/contacto" element={<Contact />} />
            </Route>

            <Route path="/motos/:slug" element={<MotoDetail />} />
            <Route path="/repuestos/:slug" element={<RepuestoDetail />} />

            {/* Layout exclusivo con sidebar de catálogo */}
            <Route element={<LayoutCatalogoMotos />}>
                <Route path="/motos" element={<CatalogoMotos />} />
            </Route>
            {/* Layout exclusivo con sidebar de repuestos */}
            <Route element={<LayoutRepuestos />}>
                <Route path="/repuestos" element={<Repuestos />} />
            </Route>


            <Route path="*" element={<NotFound404 />} />
        </Routes>
    );
};

export default AppRoutes;
