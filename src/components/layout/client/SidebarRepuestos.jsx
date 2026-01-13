import React from "react";
import { MdFilterAlt, MdLocalOffer } from "react-icons/md";
import { Link } from "react-router-dom";
import "../../../styles/repuestos/SidebarRepuestos.css";

const SidebarRepuestos = () => {
  return (
    <aside className="sr-container">
      <div className="sr-content">

        {/* Filtro */}
        <div className="sr-section">
          <h3 className="sr-title">
            <MdFilterAlt size={20} />
            <span>Filtrar Repuestos</span>
          </h3>
        </div>

        {/* Categorías */}
        <div className="sr-categories">
          <h4 className="sr-subtitle">Categorías</h4>

          <Link className="sr-item active" to="/repuestos/categoria/frenos">
            Frenos
          </Link>

          <Link className="sr-item" to="/repuestos/categoria/motor">
            Motor
          </Link>

          <Link className="sr-item" to="/repuestos/categoria/electrico">
            Eléctrico
          </Link>

          <Link className="sr-item" to="/repuestos/categoria/accesorios">
            Accesorios
          </Link>

          <Link className="sr-item" to="/repuestos/categoria/chasis-llantas">
            Chasis y Llantas
          </Link>
        </div>

        {/* Promociones */}
        <div className="sr-promo">
          <div className="sr-promo-header">
            <MdLocalOffer className="sr-promo-icon" />
            <h4>Promociones</h4>
          </div>

          <p>
            ¡Aprovecha hasta un <span className="strong">25% de descuento</span>{" "}
            en repuestos seleccionados!
          </p>

          <Link to="/ofertas/repuestos" className="sr-button">
            Ver Ofertas
          </Link>
        </div>

      </div>
    </aside>
  );
};

export default SidebarRepuestos;


