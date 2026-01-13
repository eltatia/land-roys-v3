import React from "react";
import { FiArrowRight } from "react-icons/fi";
import "../../../styles/catalogoMotos/MotoCard.css";

const MotoCard = ({ imagen, titulo, descripcion, precio }) => {
  return (
    <div className="moto-card">

      {/* Imagen */}
      <div className="moto-card-img">
        <div
          className="moto-card-img-bg"
          style={{ backgroundImage: `url("${imagen}")` }}
        ></div>
      </div>

      {/* Texto */}
      <div className="moto-card-info">
        <p className="moto-card-title">{titulo}</p>
        <p className="moto-card-desc">{descripcion}</p>

        {/* Precio */}
        <p className="moto-card-price">${precio.toLocaleString()}</p>
      </div>

      {/* Botón */}
      <div className="moto-card-btn-box">
        <button className="moto-card-btn">
          Ver Detalles <FiArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default MotoCard;

