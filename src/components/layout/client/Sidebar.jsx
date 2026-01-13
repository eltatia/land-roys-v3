import React from "react";
import { Link } from "react-router-dom";
import { FaTags } from "react-icons/fa";
import "../../../styles/Sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-content">

        {/* Categorías */}
        <div>
          <h3 className="sidebar-title">Categorías</h3>
          <div className="sidebar-list">
            <Link className="sidebar-item active" to="/motos">Todos los modelos</Link>
            <Link className="sidebar-item" to="/motos/categoria/scrambler">Scrambler</Link>
            <Link className="sidebar-item" to="/motos/categoria/tourer">Tourer</Link>
            <Link className="sidebar-item" to="/motos/categoria/cruiser">Cruiser</Link>
          </div>
        </div>

        {/* Filtrar por Motor */}
        <div>
          <h3 className="sidebar-title">Filtrar por Motor</h3>
          <div className="sidebar-checklist">
            <label className="sidebar-check-item">
              <input type="checkbox" />
              <span>800cc</span>
            </label>
            <label className="sidebar-check-item">
              <input type="checkbox" />
              <span>950cc</span>
            </label>
            <label className="sidebar-check-item">
              <input type="checkbox" />
              <span>1200cc</span>
            </label>
          </div>
        </div>

        {/* Rangos de Precio */}
        <div>
          <h3 className="sidebar-title">Rangos de Precio</h3>
          <div className="sidebar-range-box">
            <input type="range" min="5000" max="30000" defaultValue="15000" />
            <div className="sidebar-range-values">
              <span>$5,000</span>
              <span>$30,000+</span>
            </div>
          </div>
        </div>

        {/* Promociones */}
        <div className="sidebar-promo">
          <h4 className="sidebar-promo-title">
            <FaTags className="sidebar-icon" />
            <span>Promociones</span>
          </h4>
          <p className="sidebar-promo-text">
            Financiamiento especial en modelos seleccionados. Consulta los detalles.
          </p>

          <Link to="/ofertas/motos" className="sidebar-promo-link">
            Ver Ofertas
          </Link>
        </div>

      </div>
    </aside>
  );
};

export default Sidebar;
