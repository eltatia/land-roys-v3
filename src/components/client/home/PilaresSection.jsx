import { FaBolt, FaRegCompass } from "react-icons/fa";
import { MdDesignServices } from "react-icons/md";
import "../../../styles/home/PilaresSection.css";

const PilaresSection = () => {
  return (
    <section className="pilares-section">

      <h4 className="pilares-subtitle">
        El Corazón de Land Roys
      </h4>

      <h2 className="pilares-title">
        Nuestros Pilares Fundamentales
      </h2>

      <div className="pilares-grid">

        {/* Pila 1 */}
        <div className="pilar-item">
          <div className="pilar-icon">
            <FaBolt size={30} />
          </div>
          <h3 className="pilar-name">Potencia y Precisión</h3>
          <p className="pilar-description">
            Motores diseñados para ofrecer un rendimiento excepcional y un control total en cualquier situación.
          </p>
        </div>

        {/* Pila 2 */}
        <div className="pilar-item">
          <div className="pilar-icon">
            <MdDesignServices size={30} />
          </div>
          <h3 className="pilar-name">Diseño Atemporal</h3>
          <p className="pilar-description">
            Una estética que combina herencia clásica con innovación moderna, creando motocicletas icónicas.
          </p>
        </div>

        {/* Pila 3 */}
        <div className="pilar-item">
          <div className="pilar-icon">
            <FaRegCompass size={30} />
          </div>
          <h3 className="pilar-name">Espíritu Indomable</h3>
          <p className="pilar-description">
            Hechas para los aventureros que buscan explorar nuevos horizontes y desafiar sus propios límites.
          </p>
        </div>

      </div>
    </section>
  );
};

export default PilaresSection;
