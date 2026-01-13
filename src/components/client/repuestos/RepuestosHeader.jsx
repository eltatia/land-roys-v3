import React from 'react'
import { FiSearch } from "react-icons/fi"
import '../../../styles/repuestos/RepuestosHeader.css';

const RepuestosHeader = () => {
  return (
    <div className="repuestos-header">

      <div className="rh-text-box">
        <h1 className="rh-title">Catálogo de Repuestos</h1>
        <p className="rh-subtitle">
          Encuentra la pieza perfecta para tu Land Roys.
        </p>
      </div>

      <div className="rh-filters">

        {/* Buscador */}
        <div className="rh-search-wrapper">
          <FiSearch className="rh-search-icon" />
          <input
            className="rh-search-input"
            placeholder="Buscar por nombre, código o descripción..."
            type="text"
          />
        </div>

        {/* Ordenar */}
        <div className="rh-order-wrapper">
          <span className="rh-order-label">Ordenar por:</span>
          <select className="rh-order-select">
            <option>Precio: Mayor a Menor</option>
            <option>Precio: Menor a Mayor</option>
            <option>Nombre A-Z</option>
            <option>Más Relevantes</option>
          </select>
        </div>

      </div>
    </div>
  )
}

export default RepuestosHeader


