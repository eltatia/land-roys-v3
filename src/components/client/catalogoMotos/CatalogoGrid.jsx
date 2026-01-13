import MotoCard from "./MotoCard";
import { motos } from "../../../data/motos";

const CatalogoGrid = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
      {motos.map((moto) => (
        <MotoCard
          key={moto.id}
          imagen={moto.imagen}
          titulo={moto.titulo}
          descripcion={moto.descripcion}
          precio={moto.precio}  
        />
      ))}
    </section>
  );
};

export default CatalogoGrid;
