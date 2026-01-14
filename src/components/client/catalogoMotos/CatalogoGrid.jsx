import { useEffect, useState } from "react";
import MotoCard from "./MotoCard";
import { fetchMotos } from "../../../services/motosService";
import BrandLoader from "../../ui/BrandLoader";

const CatalogoGrid = () => {
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

  if (loading) {
    return <BrandLoader />;
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
      {motos.map((moto, index) => (
        <MotoCard
          key={moto.slug || index}
          imagen={moto.imagen}
          titulo={moto.titulo}
          descripcion={moto.descripcion}
          precio={moto.precio}
          slug={moto.slug}
          moto={moto}
        />
      ))}
    </section>
  );
};

export default CatalogoGrid;
