import React from "react";
import { Outlet } from "react-router-dom";
import HeaderAdministrativo from "../components/common/HeaderAdministraivo";
import SidebarAdministrativo from "../components/common/SidebarAdministrativo";

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <HeaderAdministrativo />

      {/* Contenido */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <SidebarAdministrativo />

        {/* Main */}
        <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

