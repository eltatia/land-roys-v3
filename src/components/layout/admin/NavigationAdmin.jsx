import { Link, useNavigate } from "react-router-dom"
import { supabase } from "../../../services/Supabase.js"
import "./NavigationAdmin.css"

// Íconos
import { FaUsers, FaUserCircle } from "react-icons/fa"
import { FiSettings, FiLogOut } from "react-icons/fi"

export default function NavigationAdmin() {

  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate("/admin/login")
  }

  return (
    <nav className="admin-navbar">

      {/* IZQUIERDA - Logo */}
      <div className="admin-navbar-left">
        <svg className="admin-logo-icon" fill="none" viewBox="0 0 48 48">
          <path
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z"
          />
        </svg>

        <h2 className="admin-logo-text">Land Roys</h2>
      </div>

      {/* DERECHA - Navegación */}
      <div className="admin-navbar-right">

        {/* PERFIL */}
        <Link to="/admin/perfil" className="admin-link">
          <FaUserCircle size={20} />
          <span>Perfil</span>
        </Link>

        {/* CONFIGURACIÓN */}
        <Link to="/admin/configuracion" className="admin-link">
          <FiSettings size={20} />
          <span>Configuración</span>
        </Link>

        {/* USUARIOS */}
        <Link to="/admin/usuarios" className="admin-link">
          <FaUsers size={20} />
          <span>Usuarios</span>
        </Link>

        {/* SALIR */}
        <button onClick={handleLogout} className="admin-logout">
          <FiLogOut size={20} />
          <span>Salir</span>
        </button>

      </div>
    </nav>
  )
}

