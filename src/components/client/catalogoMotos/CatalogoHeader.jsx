import React from "react";
import { FiSearch, FiArrowDown, FiType } from "react-icons/fi";
import "../../../styles/catalogoMotos/CatalogoHeader.css";

const CatalogoHeader = () => {
  return (
    <header className="catalogo-header">

      <div className="catalogo-header-text">
        <h1 className="catalogo-title">Nuestros Modelos</h1>
        <p className="catalogo-subtitle">
          Ingeniería de precisión para el camino por delante.
        </p>
      </div>

      <div className="catalogo-actions">

        {/* Buscador */}
        <div className="catalogo-search-box">
          <FiSearch className="catalogo-search-icon" />
          <input
            type="text"
            placeholder="Buscar modelo o característica..."
            className="catalogo-search-input"
          />
        </div>

        {/* Ordenar */}
        <div className="catalogo-sort">
          <span className="catalogo-sort-label">Ordenar por:</span>

          <div className="catalogo-sort-buttons">
            <button className="catalogo-sort-btn active">
              <FiArrowDown size={18} />
            </button>

            <button className="catalogo-sort-btn">
              <FiType size={18} />
            </button>
          </div>
        </div>

      </div>

    </header>
  );
};

export default CatalogoHeader;


