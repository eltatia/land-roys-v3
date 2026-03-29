import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Package2, Boxes, Tag } from "lucide-react";
import Swal from "sweetalert2";
import { getRepuestoById } from "../../../services/Repuestos.service";
import { getCategoriasRepuestos } from "../../../services/CategoriasRepuestos.service";

const currency = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  maximumFractionDigits: 0,
});

const placeholder = "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=1200&auto=format&fit=crop";

const RepuestoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [repuesto, setRepuesto] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [repuestoData, categoriasData] = await Promise.all([
          getRepuestoById(id),
          getCategoriasRepuestos(),
        ]);
        setRepuesto(repuestoData);
        setCategorias(categoriasData);
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo cargar el detalle del repuesto", "error").then(() => navigate("/repuestos"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const categoryTrail = useMemo(() => {
    if (!repuesto?.categoria_id) return repuesto?.categoria ? [repuesto.categoria] : [];
    const byId = categorias.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});
    const trail = [];
    let current = byId[repuesto.categoria_id];
    while (current) {
      trail.unshift(current.nombre);
      current = current.parent_id ? byId[current.parent_id] : null;
    }
    return trail;
  }, [categorias, repuesto]);

  const gallery = useMemo(() => {
    if (!repuesto) return [];
    const images = [repuesto.imagen_url, ...(repuesto.galeria_imagenes || [])].filter(Boolean);
    return images.length ? images : [placeholder];
  }, [repuesto]);

  useEffect(() => setImageIndex(0), [gallery.length]);

  if (loading) {
    return <section className="min-h-screen flex items-center justify-center bg-[#f5f6f9] text-slate-600">Cargando detalle...</section>;
  }

  if (!repuesto) return null;

  const handlePrev = () => setImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  const handleNext = () => setImageIndex((prev) => (prev + 1) % gallery.length);

  return (
    <section className="bg-[#f5f6f9] min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <Link to="/repuestos" className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-yellow-500">
          <ChevronLeft size={18} /> Volver a repuestos
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8 items-start">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-4">
            <div className="relative rounded-3xl overflow-hidden bg-slate-100">
              <img src={gallery[imageIndex]} alt={repuesto.nombre} className="w-full h-[420px] object-cover" />
              {gallery.length > 1 && (
                <>
                  <button type="button" onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/90 flex items-center justify-center shadow">
                    <ChevronLeft size={20} />
                  </button>
                  <button type="button" onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/90 flex items-center justify-center shadow">
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {gallery.length > 1 && (
              <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
                {gallery.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setImageIndex(index)}
                    className={`rounded-2xl overflow-hidden border-2 ${index === imageIndex ? "border-yellow-400" : "border-transparent"}`}
                  >
                    <img src={image} alt={`${repuesto.nombre} ${index + 1}`} className="h-20 w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-4">
              {categoryTrail.length > 0 && (
                <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  {categoryTrail.map((item) => (
                    <span key={item} className="px-3 py-1 rounded-full bg-slate-100">{item}</span>
                  ))}
                </div>
              )}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-slate-900">{repuesto.nombre}</h1>
                  {repuesto.modelo && <p className="text-slate-500 mt-2">Modelo compatible: {repuesto.modelo}</p>}
                </div>
                {repuesto.marca_logo_url && (
                  <img src={repuesto.marca_logo_url} alt="Marca" className="h-14 w-auto object-contain" />
                )}
              </div>
              <p className="text-3xl font-black text-yellow-500">{currency.format(Number(repuesto.precio || 0))}</p>
              {repuesto.descripcion && <p className="text-slate-600 leading-relaxed">{repuesto.descripcion}</p>}
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <h2 className="text-xl font-black text-slate-900 mb-5">Especificaciones</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="rounded-2xl bg-slate-50 p-4 flex items-start gap-3">
                  <Package2 className="text-yellow-500" size={18} />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500">Unidad de medida</p>
                    <p className="font-bold text-slate-800">{repuesto.unidad_medida || "No especificada"}</p>
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 flex items-start gap-3">
                  <Tag className="text-yellow-500" size={18} />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500">Modelo</p>
                    <p className="font-bold text-slate-800">{repuesto.modelo || "No especificado"}</p>
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 flex items-start gap-3 md:col-span-2">
                  <Boxes className="text-yellow-500" size={18} />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500">Cantidad por paquete</p>
                    <p className="font-bold text-slate-800">{repuesto.cantidad_por_paquete || "No especificada"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RepuestoDetalle;
