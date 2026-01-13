import { FiArrowRight} from "react-icons/fi"
import { Link } from "react-router-dom";
import "../../../styles/repuestos/RepuestoCard.css";
const RepuestoCard = ({ title, description, price, image, slug, item }) => {
  return (
    <div className="repuesto-card group">

      <div className="repuesto-img-wrapper">
        <div
          className="repuesto-img"
          style={{ backgroundImage: `url("${image}")` }}
        ></div>
      </div>

      <div className="repuesto-content">
        <h3 className="repuesto-title">{title}</h3>
        <p className="repuesto-description">{description}</p>
        <p className="repuesto-price">${price}</p>
      </div>

      <div className="repuesto-btn-wrapper">
        <Link className="repuesto-btn" to={`/repuestos/${slug}`} state={{ repuesto: item }}>
          <span className="truncate">Ver Detalles</span>
          <FiArrowRight size={18} className="icon" />
        </Link>
      </div>

    </div>
  )
}

export default RepuestoCard
