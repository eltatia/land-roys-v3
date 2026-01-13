import React from "react";
import Header from "../components/layout/client/Header";
import Footer from "../components/layout/client/Footer";
import Sidebar from "../components/layout/client/Sidebar"; 
import { Outlet } from "react-router-dom";
import "../styles/LayoutMotos.css";

const LayoutCatalogoMotos = () => {
  return (
    <div className="layout-motos-container">

      <Header />

      <main className="layout-motos-body">
        <Sidebar />

        <div className="layout-motos-main">
          {/* Aquí se renderizan las páginas de motos */}
          <Outlet />
        </div>
      </main>

      <Footer />

    </div>
  );
};

export default LayoutCatalogoMotos;
