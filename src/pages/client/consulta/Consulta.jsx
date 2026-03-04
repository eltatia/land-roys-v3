import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import caferacer from '../../../assets/img/CafeRacer_250.webp';
import './Consulta.css';

const Consulta = () => {
    const animate = true;
    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;


    return (
        <section className="bg-[#fcfcf9] py-20 px-6">
            <div className="max-w-7xl mx-auto">

                {/* --- Header Section --- */}
                <div className="mb-16 text-center md:text-left">
                    <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-zinc-800 to-zinc-400 uppercase leading-none">
                        CONTÁCTANOS
                    </h1>
                    <div className="w-24 h-1.5 bg-yellow-400 mt-4 mb-6 mx-auto md:mx-0"></div>
                    <p className="text-gray-500 max-w-md text-lg leading-relaxed mx-auto md:mx-0">
                        Potencia tu viaje. Conecta directamente con nuestro centro
                        de alto rendimiento y especialistas en maquinaria premium.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">

                    {/* --- Contact Cards --- */}
                    <div className="space-y-6">

                        {/* WhatsApp Card */}
                        <article className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                            <div className="flex justify-between items-start mb-6">
                                <div className="bg-[#25D366] p-3 rounded-xl text-white">
                                    <MessageCircle size={32} fill="currentColor" />
                                </div>
                                <small className="text-[10px] font-bold bg-green-50 text-green-600 px-3 py-1 rounded-full uppercase tracking-wider">
                                    Respuesta {'<'} 5 min
                                </small>
                            </div>

                            <p className="text-yellow-500 font-bold text-xs uppercase tracking-widest">Soporte Experto</p>
                            <h2 className="text-2xl font-black text-zinc-900 mt-1 mb-2">Asesoría Vía WhatsApp</h2>
                            <p className="text-gray-400 text-sm mb-8">Consulta especificaciones y financiamiento personalizado.</p>

                            <a
                                href={`https://wa.me/${whatsappNumber}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full inline-block bg-yellow-400 hover:bg-yellow-500 text-zinc-900 font-bold py-4 rounded-xl transition-colors uppercase text-sm tracking-tighter text-center"
                            >
                                Hablar por WhatsApp
                            </a>
                        </article>

                        {/* Direct Line Card */}
                        <article className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-6">
                                <div className="bg-gray-50 p-3 rounded-xl text-zinc-400 border border-gray-100">
                                    <Phone size={32} />
                                </div>
                                <small className="text-[10px] font-bold text-zinc-400 px-3 py-1 uppercase tracking-wider">
                                    Atención 24/7
                                </small>
                            </div>

                            <p className="text-yellow-500 font-bold text-xs uppercase tracking-widest">Llamanos a nuestra</p>
                            <h2 className="text-2xl font-black text-zinc-900 mt-1 mb-2">Línea Directa</h2>
                            <p className="text-yellow-500 text-3xl font-black my-4">+51 987 654 321</p>
                            <small className="text-gray-300 text-[10px] uppercase font-bold tracking-widest">Línea nacional sin costo</small>
                        </article>
                    </div>

                    {/* --- Image/Promo Section --- */}
                    <div className="relative group">
                        <div className={`absolute -inset-1 bg-white rounded-[40px] shadow-2xl opacity-50 group-hover:opacity-100 transition duration-500 promo-img ${animate ? 'animate-in' : ''}`}></div>
                        <div className={`relative aspect-square rounded-[38px] overflow-hidden promo-img ${animate ? 'animate-in' : ''}`}>
                            <img
                                src={caferacer}
                                alt="Cafe Racer"
                                className="w-full h-full object-cover grayscale brightness-50"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                            <div className={`absolute bottom-12 left-10 right-10 promo-text ${animate ? 'animate-in' : ''}`}>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-0.5 bg-yellow-400"></div>
                                    <span className="text-yellow-400 font-bold text-xs uppercase tracking-widest">Ingeniería Pura</span>
                                </div>
                                <h2 className="text-5xl md:text-6xl font-black text-white italic leading-none uppercase">
                                    Siente la <br />
                                    <span className="text-yellow-400">Adrenalina.</span>
                                </h2>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Consulta;
