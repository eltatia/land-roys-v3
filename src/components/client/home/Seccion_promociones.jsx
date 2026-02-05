import React, { useState, useEffect } from 'react';
import { Zap, ShoppingBag } from 'lucide-react';
import './Seccion_promociones.css';

const Seccion_promociones = () => {
  // Lógica del contador (Ejemplo: faltan 2 días, 14 horas...)
  const [timeLeft, setTimeLeft] = useState({
    dias: '02',
    horas: '14',
    min: '45',
    seg: '09'
  });

  // Efecto opcional para que el contador se mueva (solo segundos para el ejemplo)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => ({
        ...prev,
        seg: (parseInt(prev.seg) > 0 ? String(parseInt(prev.seg) - 1).padStart(2, '0') : '59')
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 px-4 bg-slate-200">
      <div className="max-w-6xl mx-auto">
        {/* Contenedor Principal con Degradado */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-400 to-slate-500 rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 shadow-2xl">
          
          {/* Lado Izquierdo: Texto y Contador */}
          <div className="flex-1 space-y-8 z-10">
            {/* Etiqueta Flash Sale */}
            <div className="inline-flex items-center gap-2 bg-yellow-400 px-4 py-1.5 rounded-full shadow-lg">
              <Zap size={14} fill="black" />
              <span className="text-[10px] font-black tracking-widest uppercase">Flash Sale</span>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter leading-none">
                OFERTAS POR VENCER
              </h2>
              <p className="text-slate-100/80 text-sm md:text-base max-w-md font-light">
                Aprovecha hasta un <span className="text-yellow-400 font-bold">20% de descuento</span> en modelos seleccionados de la serie Urban. Solo por tiempo limitado.
              </p>
            </div>

            {/* Contador UI */}
            <div className="flex gap-4">
              {Object.entries(timeLeft).map(([label, value]) => (
                <div key={label} className="flex flex-col items-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl flex items-center justify-center shadow-inner">
                    <span className="text-2xl md:text-3xl font-black text-white">{value}</span>
                  </div>
                  <span className="text-[10px] font-bold text-yellow-400 mt-2 uppercase tracking-tighter italic">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Botón de Acción */}
            <button className="flex items-center gap-3 bg-yellow-400 hover:bg-yellow-500 text-black font-black px-10 py-4 rounded-full transition-all hover:scale-105 active:scale-95 shadow-xl shadow-yellow-400/20 uppercase text-xs tracking-widest">
              Consultar Ofertas
              <ShoppingBag size={18} />
            </button>
          </div>

          {/* Lado Derecho: Imagen de Producto (Card Estilo Apple) */}
          <div className="flex-1 relative z-10 seccion-promociones-image-desktop">
            <div className="relative group">
              {/* Card de la Moto */}
              <div className="bg-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                <div className="relative aspect-square">
                  <img 
                    src="https://images.unsplash.com/photo-1558981403-c5f91cbba527?q=80&w=800&auto=format&fit=crop" 
                    alt="Urban Swift R" 
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay de información sobre la foto */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                    <span className="text-yellow-400 text-[10px] font-bold tracking-widest uppercase mb-1 block">Ultimas Unidades</span>
                    <h3 className="text-2xl font-black text-white mb-2">Urban Swift R</h3>
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl font-black text-white">$4,999</span>
                      <span className="text-sm text-white/40 line-through font-bold">$6,250</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Efecto de resplandor detrás (Glow) */}
              <div className="absolute -inset-4 bg-yellow-400/10 blur-3xl rounded-full -z-10 group-hover:bg-yellow-400/20 transition-colors" />
            </div>
          </div>

          {/* Elemento Decorativo: Circulo desenfocado en el fondo del banner */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 blur-3xl rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Seccion_promociones;