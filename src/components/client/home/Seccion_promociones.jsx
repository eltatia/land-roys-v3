import React, { useEffect, useState } from "react";
import { ArrowRight, Clock } from "lucide-react";
import { getOfertasPublicas } from "../../../services/ofertas.public.service";
import Compra_modal_oferta from "./Compra_modal_oferta";

const Seccion_promociones = () => {
  const [oferta, setOferta] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchOferta = async () => {
      try {
        const data = await getOfertasPublicas();
        if (data && data.length > 0) {
          setOferta(data[0]);
        }
      } catch (error) {
        console.error("Error cargando oferta", error);
      }
    };

    fetchOferta();
  }, []);

  if (!oferta) return null;

  return (
    <>
      <section className="bg-[#121212] min-h-screen flex items-center justify-center p-6 md:p-12">
        <div className="container mx-auto max-w-6xl flex flex-col lg:flex-row items-center gap-12">
          <div className="relative w-full lg:w-1/2 flex justify-center">
            <div className="absolute -top-6 -left-6 z-20 bg-yellow-400 w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-[0_0_30px_rgba(250,204,21,0.4)] rotate-[-15deg]">
              <span className="text-[10px] font-black uppercase">Descuento</span>
              <span className="text-2xl font-black">-{oferta.descuento}%</span>
              <span className="text-[10px] font-black uppercase">Off</span>
            </div>

            <div className="relative z-10 bg-white p-4 shadow-2xl transform rotate-[-2deg] transition-transform hover:rotate-0 duration-500">
              <img src={oferta.imagen_url} alt={oferta.titulo} className="w-full max-w-md object-contain" />
            </div>
          </div>

          <div className="w-full lg:w-1/2 bg-[#1a1a1a] p-10 md:p-16 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 blur-[80px]" />

            <div className="space-y-8 relative z-10">
              <div className="flex items-center gap-3">
                <div className="h-[1px] w-8 bg-yellow-400/50" />
                <span className="text-yellow-400 text-[10px] font-black uppercase tracking-[0.4em]">Promoción Especial</span>
              </div>

              <h2 className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tighter">
                {oferta.titulo.split(" ")[0]} <br />
                <span className="text-yellow-400 italic">{oferta.titulo.replace(oferta.titulo.split(" ")[0], "")}</span>
              </h2>

              <p className="text-gray-400 text-sm leading-relaxed max-w-md italic border-l-2 border-yellow-400/30 pl-6">{oferta.descripcion}</p>

              <div className="flex items-end gap-6">
                <div>
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Precio Normal</span>
                  <span className="text-gray-500 line-through text-xl font-bold">S/ {oferta.precio_original}</span>
                </div>

                <div>
                  <span className="text-yellow-400 text-[10px] font-black uppercase tracking-widest block">Oferta</span>
                  <span className="text-yellow-400 text-4xl font-black drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">S/ {oferta.precio_especial}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <Clock size={14} className="text-yellow-400" />
                Válido hasta {new Date(oferta.expiracion).toLocaleDateString()}
              </div>

              <button
                onClick={() => setOpenModal(true)}
                className="w-full group bg-yellow-400 hover:bg-yellow-500 text-black p-6 rounded-2xl flex items-center justify-between transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-yellow-400/20"
              >
                <span className="font-black uppercase text-sm tracking-widest">{oferta.textoboton || "Consultar Oferta"}</span>
                <div className="bg-black/10 p-2 rounded-xl group-hover:translate-x-1 transition-transform">
                  <ArrowRight size={20} strokeWidth={3} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      <Compra_modal_oferta open={openModal} onClose={() => setOpenModal(false)} oferta={oferta} />
    </>
  );
};

export default Seccion_promociones;
