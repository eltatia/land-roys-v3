import React from "react";
import { FiUsers } from "react-icons/fi";
import "../../../styles/home/TrustCounter.css";

const TrustCounter = () => {
  return (
    <section className="trust-container">

      <div className="trust-texts">
        <h2 className="trust-title">
          Usuarios que eligen nuestra experiencia
        </h2>

        <p className="trust-subtitle">
          Esto es solo el comienzo
        </p>
      </div>

      <div className="trust-number-box">
        <FiUsers className="trust-icon" />
        <span className="trust-number">100</span>
      </div>

    </section>
  );
};

export default TrustCounter;

