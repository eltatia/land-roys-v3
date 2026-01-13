import { useState } from "react";
import { Link } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi"; // ICONOS
import "../../../styles/Header.css";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="header-container">
      <div className="header-inner">

        {/* Logo + Título */}
        <div className="header-left">
          <div className="logo-icon">
            <img src="/logo.png" alt="Land Roys Logo" className="h-12 w-auto object-contain" />
          </div>
          <h2 className="site-title">Land Roys</h2>
        </div>

        {/* Links desktop */}
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/motos">Motos</Link>
          <Link to="/repuestos">Repuestos</Link>
          <Link to="/descuentos">Descuentos</Link>
          <Link to="/nosotros">Nosotros</Link>
          <Link to="/contacto">Contacto</Link>
        </nav>

        {/* Botones */}
        <div className="header-buttons">
          <Link
            className="btn-test-drive"
            to="/contacto#contact-form"
            onClick={(e) => {
              e.preventDefault();
              window.location.replace("/contacto#tmp");
              setTimeout(() => {
                window.location.replace("/contacto#contact-form");
              }, 10);
            }}
          >
            Consulta
          </Link>


          {/* ICONO DE MENÚ MÓVIL */}
          <button className="btn-menu" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <HiX size={30} />
            ) : (
              <HiMenu size={30} />
            )}
          </button>
        </div>

      </div>

      {/* MENU MÓVIL */}
      {isOpen && (
        <nav className="mobile-menu">
          <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/motos" onClick={() => setIsOpen(false)}>Motos</Link>
          <Link to="/repuestos" onClick={() => setIsOpen(false)}>Repuestos</Link>
          <Link to="/descuentos" onClick={() => setIsOpen(false)}>Descuentos</Link>
          <Link to="/nosotros" onClick={() => setIsOpen(false)}>Nosotros</Link>
          <Link to="/contacto" onClick={() => setIsOpen(false)}>Contacto</Link>
        </nav>
      )}

    </header>
  );
};

export default Header;

