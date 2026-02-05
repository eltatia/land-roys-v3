import React from 'react';
import { Award, Users, ShieldCheck, Headphones, Calendar } from 'lucide-react';
import './Seccion_trayectoria.css';

const Seccion_trayectoria = () => {
  const stats = [
    {
      id: 1,
      icon: <Award className="text-yellow-600" size={20} />,
      title: "5+ Años",
      desc: "DE EXPERIENCIA EN EL MERCADO NACIONAL.",
      bgColor: "bg-yellow-50"
    },
    {
      id: 2,
      icon: <Users className="text-blue-600" size={20} />,
      title: "10k+",
      desc: "PILOTOS FELICES RODANDO HOY MISMO.",
      bgColor: "bg-blue-50"
    },
    {
      id: 3,
      icon: <Headphones className="text-orange-600" size={20} />,
      title: "Soporte Oficial",
      desc: "SERVICIO CERTIFICADO Y REPUESTOS ORIGINALES.",
      bgColor: "bg-orange-50"
    },
    {
      id: 4,
      icon: <ShieldCheck className="text-teal-600" size={20} />,
      title: "Garantía Total",
      desc: "SEGURIDAD EXTENDIDA EN TODOS LOS MODELOS.",
      bgColor: "bg-teal-50"
    }
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Lado Izquierdo: Texto y Stats */}
          <div className="flex-1 space-y-10">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">
                Land Roys <span className="text-gray-400 font-light italic">Experience</span>
              </h2>
              <p className="text-gray-500 text-lg max-w-xl leading-relaxed">
                Más que una venta, somos tu compañero en el camino. Nuestra trayectoria avala cada kilómetro que recorres.
              </p>
            </div>

            {/* Cuadrícula de Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {stats.map((item) => (
                <div key={item.id} className="flex items-start gap-4 group">
                  <div className={`p-3 rounded-2xl transition-transform group-hover:scale-110 ${item.bgColor}`}>
                    {item.icon}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                    <p className="text-[10px] font-bold text-gray-400 leading-tight tracking-wider uppercase">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Botón de Acción */}
            <button className="flex items-center gap-3 bg-black text-white px-8 py-4 rounded-full font-bold text-xs hover:bg-gray-800 transition-all shadow-xl active:scale-95 uppercase tracking-widest">
                Agenda tu cita
              <Calendar size={18} className="text-yellow-400" />
            </button>
          </div>

          {/* Lado Derecho: Imagen con Tarjeta Flotante */}
          <div className="flex-1 relative tarjeta-trayectoria-container">
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1614165933391-90a612010860?q=80&w=800&auto=format&fit=crop" 
                alt="Compromiso Land Roys" 
                className="w-full h-[500px] object-cover"
              />
              
              {/* Overlay de texto en la imagen */}
              <div className="absolute bottom-8 left-8 right-8">
                <p className="text-white text-2xl font-black leading-tight">
                   <span className="text-yellow-400 block text-xs uppercase tracking-[0.3em] mb-2 font-bold">Compromiso Land Roys</span>
                   Pasión por la excelencia.
                </p>
              </div>
            </div>

            {/* Tarjeta Flotante (Disponibilidad) */}
            <div className="absolute -bottom-6 -left-6 md:-left-12 bg-white p-6 rounded-3xl shadow-2xl border border-gray-50 max-w-[220px] animate-bounce-slow">
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest block mb-2">Disponibilidad</span>
              <p className="text-lg font-black text-gray-900 leading-tight">
                98% Stock <br />
                <span className="text-gray-500 font-medium text-sm text-nowrap">Entrega Inmediata</span>
              </p>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
};

export default Seccion_trayectoria;