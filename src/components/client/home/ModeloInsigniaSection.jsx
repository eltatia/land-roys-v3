import { FaMotorcycle } from "react-icons/fa6";
import "../../../styles/home/ModeloInsigniaSection.css";

const ModeloInsigniaSection = () => {
  return (
    <section className="modelo-section">

      <div className="modelo-container">

        {/* Imagen */}
        <div className="modelo-image-wrapper">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmAbG7ff6l9ataX1Enbt4zRSnzogbu32jPfT-6bv3pdJwoSa86pSF_3t3LfyaHpQLwed92d73GX_UqKxo0MBV7C64lKXKLppmoMHp0pSaoqumquXjLgpHr2xJ8OeUGa7fryRsvgfYCB6TmL6XSYSccWZkMOdAOeVQBsgNI-LufwpwRx-AompQXQSpydPiAM3GetfKlqqGwGQ9WZphkSI2IWR3DUNRQUqi6ryw8bgp83iGJ-0DHVML3rxEE_pde-xpQF51RZtJ_ag"
            alt="Adventurer 1200"
            className="modelo-image"
          />
        </div>

        {/* Texto */}
        <div className="modelo-text">
          <h4 className="modelo-subtitle">
            <FaMotorcycle size={18} className="modelo-icon" />
            Modelo Insignia
          </h4>

          <h2 className="modelo-title">
            Conoce la Adventurer 1200
          </h2>

          <p className="modelo-description">
            La máxima expresión de nuestra ingeniería y pasión por la aventura.
            Equipada con un motor de 1200cc y tecnología de punta, está lista para llevarte a donde tu imaginación te guíe.
          </p>

          <button className="modelo-btn">
            Explorar Modelo
          </button>
        </div>

      </div>

    </section>
  );
};

export default ModeloInsigniaSection;

