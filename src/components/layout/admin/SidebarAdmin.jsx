import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../../../services/Supabase";
import "./SidebarAdmin.css";

import { MdDashboard, MdPeople, MdShoppingCart, MdBarChart, MdSlideshow, MdBuild } from "react-icons/md";
import { FaMotorcycle } from "react-icons/fa";

export default function SidebarAdmin() {

  const { pathname } = useLocation(); // detectar ruta actual

  // función para validar si está activa
  const isActive = (path) => pathname.startsWith(path);

  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getRole() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        setRole(profile?.role);
      }
      setLoading(false);
    }
    getRole();
  }, []);

  if (loading) return null; // O un skeleton loader

  return (
    <aside className="admin-sidebar">

      <div className="admin-sidebar-body">
        <h1 className="admin-sidebar-section title-center">Admin Panel</h1>

        <nav className="admin-sidebar-nav">

          <Link
            to="/admin"
            className={`admin-sidebar-link ${isActive("/admin") && pathname === "/admin" ? "active" : ""}`}
          >
            <MdDashboard size={20} className="admin-icon" />
            <p>Panel Principal</p>
          </Link>

          <Link
            to="/admin/gestion-carrusel"
            className={`admin-sidebar-link ${isActive("/admin/gestion-carrusel") ? "active" : ""}`}
          >
            <MdSlideshow size={20} className="admin-icon" />
            <p>Gestión de Carrusel</p>
          </Link>


          <Link
            to="/admin/modelos"
            className={`admin-sidebar-link ${isActive("/admin/modelos") ? "active" : ""}`}
          >
            <FaMotorcycle size={20} className="admin-icon" />
            <p>Gestión de Modelos</p>
          </Link>

          <Link
            to="/admin/repuestos"
            className={`admin-sidebar-link ${isActive("/admin/repuestos") ? "active" : ""}`}
          >
            <MdBuild size={20} className="admin-icon" />
            <p>Gestión de Repuestos</p>
          </Link>

          <Link
            to="/admin/pedidos"
            className={`admin-sidebar-link ${isActive("/admin/pedidos") ? "active" : ""}`}
          >
            <MdShoppingCart size={20} className="admin-icon" />
            <p>Pedidos / Consultas</p>
          </Link>

          {role === "admin" && (
            <>
              <Link
                to="/admin/users"
                className={`admin-sidebar-link ${isActive("/admin/users") ? "active" : ""}`}
              >
                <MdPeople size={20} className="admin-icon" />
                <p>Gestión de Usuarios</p>
              </Link>

              <Link
                to="/admin/reportes"
                className={`admin-sidebar-link ${isActive("/admin/reportes") ? "active" : ""}`}
              >
                <MdBarChart size={20} className="admin-icon" />
                <p>Reportes y Estadísticas</p>
              </Link>
            </>
          )}

        </nav>
      </div>

    </aside>
  );
}
