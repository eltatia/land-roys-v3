import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Sidebar from "../components/layout/Sidebar"; 
import { Outlet } from "react-router-dom";
import "../styles/LayoutMotos.css";

const LayoutCatalogoMotos = () => {
  return (
    <div className="layout-motos-container">

      <Header />

      <div className="layout-motos-body">
        <Sidebar />

        <div className="layout-motos-main">
          {/* Aquí se renderizan las páginas de motos */}
          <Outlet />
        </div>
      </div>

      <Footer />

    </div>
  );
};

export default LayoutCatalogoMotos;
