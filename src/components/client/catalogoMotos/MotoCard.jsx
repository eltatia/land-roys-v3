import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import "../../../styles/catalogoMotos/MotoCard.css";

const MotoCard = ({ imagen, titulo, descripcion, precio, slug, moto }) => {
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
        <Link className="moto-card-btn" to={`/motos/${slug}`} state={{ moto }}>
          Ver Detalles <FiArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};

export default MotoCard;
