import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../../styles/home/ModelsSection.css";
import { fetchMotos } from "../../../services/motosService";
import BrandLoader from "../../ui/BrandLoader";

const ModelsSection = () => {
  const [motos, setMotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMotos = async () => {
      const { data, error } = await fetchMotos();
      if (!error && data) {
        setMotos(data);
      }
      setLoading(false);
    };

    loadMotos();
  }, []);

  return (
    <section className="models-section">
      <div className="models-header">
        <h4 className="models-subtitle">Nuestra Gama</h4>
        <h2 className="models-title">Encuentra Tu Próximo Viaje</h2>
      </div>

      {loading ? (
        <div className="models-loader">
          <BrandLoader />
        </div>
      ) : motos.length === 0 ? (
        <p className="models-empty">No hay modelos disponibles por ahora.</p>
      ) : (
        <div className="models-grid">
          {motos.slice(0, 3).map((moto) => (
            <div className="model-card" key={moto.id ?? moto.slug}>
              <div
                className="model-image"
                style={{
                  backgroundImage: `url("${moto.imagen || moto.hero_image || moto.bike_image || ""}")`,
                }}
              ></div>

              <div className="model-content">
                <h3 className="model-name">{moto.titulo}</h3>
                <p className="model-description">{moto.descripcion}</p>
                <Link className="model-btn" to={`/motos/${moto.slug}`} state={{ moto }}>
                  Ver Detalles
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ModelsSection;
