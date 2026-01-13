import React from "react";
import Header from "../components/layout/client/Header";
import Footer from "../components/layout/client/Footer";
import SidebarRepuestos from "../components/layout/client/SidebarRepuestos";
import { Outlet } from "react-router-dom";

const LayoutRepuestos = () => {
  return (
    <div className="layout-motos-container">
      <Header />

      <main className="layout-motos-body">
        <SidebarRepuestos />

        <div className="layout-motos-main">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LayoutRepuestos;
