import React from 'react';
import { Star, ArrowUpRight, Award } from 'lucide-react';
import './Seccion_top.css';

const Seccion_top = () => {
    const products = [
        {
            rank: "#2",
            tag: "URBAN PERFORMANCE",
            name: "Urban Rider 500",
            desc: "Equilibrio perfecto entre agilidad urbana y eficiencia tecnológica.",
            price: "$6,499",
            image: "https://images.unsplash.com/photo-1558981403-c5f91cbba527?q=80&w=500&auto=format&fit=crop",
            isMain: false
        },
        {
            rank: "#1",
            tag: "PREMIUM CHOICE",
            name: "Apex Predator 1200",
            quote: "Líder indiscutible por su motor de 1200cc y aerodinámica optimizada. La definición de potencia pura.",
            price: "$12,999",
            image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=500&auto=format&fit=crop",
            isMain: true,
            stats: "+150 ENTREGAS ESTE MES"
        },
        {
            rank: "#3",
            tag: "ADVENTURE SOUL",
            name: "Trail Master Z",
            desc: "Robustez sin límites para conquistar los terrenos más exigentes.",
            price: "$8,250",
            image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=500&auto=format&fit=crop",
            isMain: false
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">

                {/* Encabezado de Sección */}
                <div className="text-center mb-16">
                    <span className="text-yellow-600 text-[10px] font-bold tracking-[0.2em] uppercase">Colección Exclusiva</span>
                    <h2 className="text-3xl md:text-4xl font-black text-[#1a1f2c] mt-2 italic tracking-tighter">
                        MÁS VENDIDOS DE LA SEMANA
                    </h2>
                    <div className="w-12 h-1 bg-yellow-400 mx-auto mt-4"></div>
                </div>

                <div className="seccion-top-grid">
                    {products.map((item) => (
                        <div
                            key={item.rank}
                            className={`seccion-top-card relative bg-white rounded-[2.5rem] p-8 transition-all duration-500 hover:-translate-y-2
        ${item.isMain
                                    ? 'w-full md:w-[400px] border-2 border-yellow-400 shadow-[0_20px_50px_rgba(252,211,77,0.15)] z-20'
                                    : 'w-full md:w-[320px] border border-gray-100 shadow-xl z-10'
                                }
      `}
                        >
                            {/* Badge Superior para el #1 */}
                            {item.isMain && (
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-white border border-yellow-400 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
                                    <Award size={16} className="text-yellow-500" />
                                    <span className="text-[10px] font-bold text-gray-800">{item.tag}</span>
                                </div>
                            )}

                            {/* Rango y Estrellas */}
                            <div className="flex justify-between items-start mb-6">
                                <span className={`text-4xl font-black italic ${item.isMain ? 'text-yellow-500/90' : 'text-gray-400'}`}>
                                    {item.rank}
                                </span>
                                {item.isMain && (
                                    <div className="text-right">
                                        <div className="flex text-yellow-400 mb-1">
                                            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                        </div>
                                        <span className="text-[9px] font-bold text-gray-400">{item.stats}</span>
                                    </div>
                                )}
                                {!item.isMain && (
                                    <span className="text-[8px] font-bold text-gray-300 tracking-widest uppercase py-1 px-2 border border-gray-100 rounded-full">
                                        {item.tag}
                                    </span>
                                )}
                            </div>

                            {/* Imagen del Producto */}
                            <div className="aspect-square mb-8 overflow-hidden rounded-2xl bg-gray-50">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover mix-blend-multiply hover:scale-110 transition-transform duration-700"
                                />
                            </div>

                            {/* Info de Producto */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-black text-gray-900 leading-tight">
                                    {item.name}
                                </h3>

                                {item.isMain ? (
                                    <p className="text-gray-500 text-sm leading-relaxed italic border-l-2 border-yellow-400 pl-4">
                                        "{item.quote}"
                                    </p>
                                ) : (
                                    <p className="text-gray-400 text-xs leading-relaxed">
                                        {item.desc}
                                    </p>
                                )}

                                {/* Footer de Card */}
                                <div className="flex justify-between items-center pt-4">
                                    <div>
                                        {item.isMain && <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Inversión</span>}
                                        <span className={`font-black ${item.isMain ? 'text-2xl text-gray-900' : 'text-lg text-gray-500'}`}>
                                            {item.price}
                                        </span>
                                    </div>

                                    {item.isMain ? (
                                        <button className="bg-black text-white px-8 py-3 rounded-full text-xs font-bold hover:bg-gray-800 transition-colors shadow-lg">
                                            RESERVAR
                                        </button>
                                    ) : (
                                        <button className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-black transition-colors group">
                                            EXPLORAR <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        </button>
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