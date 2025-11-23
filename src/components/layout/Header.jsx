import { useState } from "react";
import { Link } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi"; // ICONOS
import "../../styles/Header.css";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="header-container">
      <div className="header-inner">

        {/* Logo + Título */}
        <div className="header-left">
          <div className="logo-icon">
            <svg fill="currentColor" viewBox="0 0 100 100">
              <path d="M50,0C22.4,0,0,22.4,0,50s22.4,50,50,50s50-22.4,50-50S77.6,0,50,0z M71.8,61.4h-9.5c-1.1,0-2-0.9-2-2v-9.1 c0-1.1,0.9-2,2-2h9.5c1.1,0,2,0.9,2,2v9.1C73.8,60.5,72.9,61.4,71.8,61.4z M45.2,61.4h-9.5c-1.1,0-2-0.9-2-2v-9.1 c0-1.1,0.9-2,2-2h9.5c1.1,0,2,0.9,2,2v9.1C47.2,60.5,46.3,61.4,45.2,61.4z M71.8,38.6h-9.5c-1.1,0-2-0.9-2-2v-9.1c0-1.1,0.9-2,2-2 h9.5c1.1,0,2,0.9,2,2v9.1C73.8,37.7,72.9,38.6,71.8,38.6z M45.2,38.6h-9.5c-1.1,0-2-0.9-2-2v-9.1c0-1.1,0.9-2,2-2h9.5 c1.1,0,2,0.9,2,2v9.1C47.2,37.7,46.3,38.6,45.2,38.6z M28.2,74.5c-3.1,0-5.6-2.5-5.6-5.6V31.1c0-3.1,2.5-5.6,5.6-5.6h43.7 c3.1,0,5.6,2.5,5.6,5.6v37.8c0,3.1-2.5,5.6-5.6,5.6H28.2z"/>
            </svg>
          </div>
          <h2 className="site-title">Land Roys</h2>
        </div>

        {/* Links desktop */}
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/motos">Motos</Link>
          <Link to="/repuestos">Repuestos</Link>
          <Link to="/parts">Descuentos</Link>
          <Link to="/contact">Nosotros</Link>
          <Link to="/contact">Contacto</Link>
        </nav>

        {/* Botones */}
        <div className="header-buttons">
          <button className="btn-test-drive">Consulta</button>

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
          <Link to="/parts" onClick={() => setIsOpen(false)}>Descuentos</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)}>Nosotros</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)}>Contacto</Link>
        </nav>
      )}

    </header>
  );
};

export default Header;

