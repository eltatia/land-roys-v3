import { Routes, Route } from "react-router-dom";
import Layout from "../layout/Layout";
import Home from "../pages/home/Home";


import LayoutCatalogoMotos from "../layout/LayoutCatalogoMotos";
import LayoutRepuestos from "../layout/LayoutRepuestos";


import CatalogoMotos from "../pages/catalogoMotos/CatalogoMotos";
import Repuestos from "../pages/repuestos/Repuestos";

const AppRoutes = () => {
    return (
        <Routes>
            {/* Layout general */}
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
            </Route>

            {/* Layout exclusivo con sidebar de catálogo */}
            <Route element={<LayoutCatalogoMotos />}>
                <Route path="/motos" element={<CatalogoMotos />} />
            </Route>

            {/* Layout exclusivo con sidebar de repuestos */}
            <Route element={<LayoutRepuestos />}>
                <Route path="/repuestos" element={<Repuestos />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
