import { useEffect, useState } from "react";
import RepuestoCard from "./RepuestoCard";
import BrandLoader from "../../ui/BrandLoader";
import { fetchRepuestos } from "../../../services/repuestosService";

const RepuestosGrid = () => {
  const [repuestos, setRepuestos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRepuestos = async () => {
      const { data, error } = await fetchRepuestos();
      if (!error && data) {
        setRepuestos(data);
      }
      setLoading(false);
    };

    loadRepuestos();
  }, []);

  if (loading) {
    return <BrandLoader />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
      {repuestos.map((item, index) => (
        <RepuestoCard key={item.slug || index} {...item} item={item} />
      ))}
    </div>
  );
};

export default RepuestosGrid;
