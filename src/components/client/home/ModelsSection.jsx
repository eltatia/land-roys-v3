import "../../../styles/home/ModelsSection.css";
import { homeModels } from "../../../data/homeModels";

const ModelsSection = () => {
  return (
    <section className="models-section">

      <div className="models-header">
        <h4 className="models-subtitle">Nuestra Gama</h4>
        <h2 className="models-title">Encuentra Tu Próximo Viaje</h2>
      </div>

      <div className="models-grid">
        {homeModels.map((model) => (
          <div className="model-card" key={model.id}>
            <div
              className="model-image"
              style={{
                backgroundImage: `url("${model.image}")`,
              }}
            ></div>

            <div className="model-content">
              <h3 className="model-name">{model.name}</h3>
              <p className="model-description">{model.description}</p>
              <button className="model-btn">Ver Detalles</button>
            </div>
          </div>
        ))}

      </div>
    </section>
  );
};

export default ModelsSection;
