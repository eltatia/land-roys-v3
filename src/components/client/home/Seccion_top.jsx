import React, { useEffect, useState } from "react";
import { Star, ArrowUpRight, Award } from "lucide-react";
import { getRankingHomePublic } from "../../../services/rankingHome.service";
import "./Seccion_top.css";

const Seccion_top = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      setLoading(true);
      try {
        const data = await getRankingHomePublic();

        if (!data || data.length === 0) {
          setProducts([]);
          return;
        }

        const mapped = data.map((item) => ({
          id: item.id,
          rank: item.rank || "-",
          tag: item.tag || "",
          name: item.name || "Sin nombre",
          desc: item.description || "",
          quote: item.rank === "#1" ? item.description : null,
          price: item.price || "-",
          image: item.image_url || "",
          btnPrimary: item.btn_primary_url || "#",
          isMain: item.rank === "#1",
          stats: item.rank === "#1" ? "DESTACADO DE LA SEMANA" : null,
        }));

        const principal = mapped.find((p) => p.isMain);
        const secundarios = mapped.filter((p) => !p.isMain);
        const ordered = [secundarios[0] || null, principal, secundarios[1] || null].filter(Boolean);

        setProducts(ordered);
      } catch (error) {
        console.error("Error cargando ranking público:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  if (loading || products.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-yellow-600 text-[10px] font-bold tracking-[0.2em] uppercase">Colección Exclusiva</span>
          <h2 className="text-3xl md:text-4xl font-black text-[#1a1f2c] mt-2 italic tracking-tighter">MÁS VENDIDOS DE LA SEMANA</h2>
          <div className="w-12 h-1 bg-yellow-400 mx-auto mt-4"></div>
        </div>

        <div className="seccion-top-grid">
          {products.map((item) => (
            <div
              key={item.id}
              className={`seccion-top-card relative bg-white rounded-[2.5rem] p-8 transition-all duration-500 hover:-translate-y-2
                ${item.isMain
                  ? "w-full md:w-[400px] border-2 border-yellow-400 shadow-[0_20px_50px_rgba(252,211,77,0.15)] z-20"
                  : "w-full md:w-[320px] border border-gray-100 shadow-xl z-10"}`}
            >
              {item.isMain && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-white border border-yellow-400 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
                  <Award size={16} className="text-yellow-500" />
                  <span className="text-[10px] font-bold text-gray-800">{item.tag}</span>
                </div>
              )}

              <div className="flex justify-between items-start mb-6">
                <span className={`text-4xl font-black italic ${item.isMain ? "text-yellow-500/90" : "text-gray-400"}`}>
                  {item.rank}
                </span>

                {item.isMain ? (
                  <div className="text-right">
                    <div className="flex text-yellow-400 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" />
                      ))}
                    </div>
                    <span className="text-[9px] font-bold text-gray-400">{item.stats}</span>
                  </div>
                ) : (
                  <span className="text-[8px] font-bold text-gray-300 tracking-widest uppercase py-1 px-2 border border-gray-100 rounded-full">
                    {item.tag}
                  </span>
                )}
              </div>

              <div className="aspect-square mb-8 overflow-hidden rounded-2xl bg-gray-50">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply hover:scale-110 transition-transform duration-700" />
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-black text-gray-900 leading-tight">{item.name}</h3>

                {item.isMain ? (
                  <p className="text-gray-500 text-sm leading-relaxed italic border-l-2 border-yellow-400 pl-4">"{item.quote}"</p>
                ) : (
                  <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
                )}

                <div className="flex justify-between items-center pt-4">
                  <div>
                    {item.isMain && <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Inversión</span>}
                    <span className={`font-black ${item.isMain ? "text-2xl text-gray-900" : "text-lg text-gray-500"}`}>{item.price}</span>
                  </div>

                  {item.isMain ? (
                    <a href={item.btnPrimary} className="bg-black text-white px-8 py-3 rounded-full text-xs font-bold hover:bg-gray-800 transition-colors shadow-lg inline-block">
                      RESERVAR
                    </a>
                  ) : (
                    <a href="#" className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-black transition-colors group">
                      EXPLORAR
                      <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Seccion_top;
