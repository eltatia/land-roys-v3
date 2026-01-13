import SidebarAdmin from "../components/layout/admin/SidebarAdmin";
import NavigationAdmin from "../components/layout/admin/NavigationAdmin";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* NAVBAR SUPERIOR FIJO */}
      <div className="fixed top-0 left-0 w-full z-50">
        <NavigationAdmin />
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex flex-grow pt-16">

        {/* SIDEBAR FIJA SIN SCROLL */}
        <div className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 border-r bg-white z-40">
          <SidebarAdmin />
        </div>

        {/* CONTENIDO SCROLEABLE */}
        <main className="flex-grow ml-64 p-6 bg-gray-100 min-h-screen overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
}




