import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SidebarRepuestos from "../components/layout/SidebarRepuestos";
import { Outlet } from "react-router-dom";

const LayoutRepuestos = () => {
  return (
    <div className="layout-motos-container">
      <Header />

      <div className="layout-motos-body">
        <SidebarRepuestos />

        <div className="layout-motos-main">
          <Outlet />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LayoutRepuestos;
