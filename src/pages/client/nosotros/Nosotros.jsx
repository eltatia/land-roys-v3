import React from 'react';
import { Shield, Gem, Award, Zap } from 'lucide-react';
import './Nosotros.css'; // Archivo CSS aparte para estilos que no son Tailwind
import caferacer from '../../../assets/img/CafeRacer_250.webp'

const Nosotros = () => {
    return (
        <div className="bg-white font-sans">

            {/* --- Hero Section --- */}
            <section className="hero relative h-[70vh] flex items-center justify-center text-center text-white">
                <div className="hero-bg" aria-hidden="true">
                    <div className="hero-overlay"></div>
                </div>

                <div className="relative z-10 px-4">
                    <span className="uppercase tracking-widest text-yellow-500 font-bold text-sm">Desde 2010</span>
                    <h1 className="text-5xl md:text-6xl font-black mt-2 mb-4">
                        NUESTRA PASIÓN,<br />TU LIBERTAD
                    </h1>
                    <p className="max-w-xl mx-auto text-gray-200">
                        Más de una década brindando los mejores servicios de los dos ruedas con pasión y compromiso inquebrantable.
                    </p>
                </div>
            </section>

            <main>
                {/* --- Story Section --- */}
                <section className="py-20 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="w-12 h-1 bg-yellow-500 mb-4"></div>
                        <h2 className="text-4xl font-bold mb-6">Dominando Terrenos, Creando Aventuras</h2>
                        <p className="text-gray-600 mb-4">
                            Land Roys nació para los que buscan potencia y estilo en cada camino. De un taller dedicado a los todoterreno, a un referente en experiencias off-road para verdaderos apasionados.
                        </p>
                        <p className="text-gray-600 mb-8">
                            Nos enfocamos en ofrecer vehículos de alto rendimiento y un servicio postventa que entiende que tu Land Roys no es solo un auto, es tu compañero de aventuras y libertad.
                        </p>
                    </div>

                    <div className="relative">
                        <img
                            src={caferacer}
                            alt="CafeRacer_250"
                            title='CafeRacer_250'
                            className="rounded-2xl shadow-2xl"
                        />
                        <div className="absolute foundation-badge">
                            <span className="block text-yellow-500 font-bold text-2xl">2010</span>
                            <span className="text-gray-500 text-sm">Fundación Land Roys</span>
                        </div>
                    </div>
                </section>

                {/* --- Values Section --- */}
                <section className="py-20 bg-gray-50 px-6" aria-labelledby="valores-title">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <h2 id="valores-title" className="text-4xl font-bold mb-4">Valores que nos Impulsan</h2>
                                <p className="text-gray-500">Nuestros pilares garantizan excelencia en cada interacción.</p>
                            </div>
                            <div className="hidden md:block w-32 h-1 bg-yellow-400"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { icon: <Shield size={24} />, title: "Calidad", desc: "Seleccionamos solo lo mejor para tu seguridad." },
                                { icon: <Gem size={24} />, title: "Confianza", desc: "Transparencia total en cada proceso de venta." },
                                { icon: <Award size={24} />, title: "Experiencia", desc: "Décadas de conocimiento acumulado para ti." },
                                { icon: <Zap size={24} />, title: "Innovación", desc: "Evolucionamos hacia la movilidad del futuro." },
                            ].map((val) => (
                                <article key={val.title} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                    <div className="text-yellow-500 mb-4 bg-yellow-50 w-fit p-3 rounded-lg">{val.icon}</div>
                                    <h3 className="font-bold text-lg mb-2">{val.title}</h3>
                                    <p className="text-gray-500 text-sm">{val.desc}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- Stats Strip --- */}
                <section className="bg-zinc-900 text-white py-12 px-6" aria-label="Estadísticas de Luna Teck">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div>
                            <h3 className="text-4xl font-bold text-yellow-500">15+</h3>
                            <p className="text-sm uppercase tracking-widest text-gray-400">Años de experiencia</p>
                        </div>
                        <div>
                            <h3 className="text-4xl font-bold text-yellow-500">50k+</h3>
                            <p className="text-sm uppercase tracking-widest text-gray-400">Motos entregadas</p>
                        </div>
                        <div>
                            <h3 className="text-4xl font-bold text-yellow-500">10</h3>
                            <p className="text-sm uppercase tracking-widest text-gray-400">Centros de servicio</p>
                        </div>
                    </div>
                </section>

                {/* --- Philosophy --- */}
                <section className="py-20 text-center px-6 max-w-4xl mx-auto" aria-labelledby="filosofia-title">
                    <h2 id="filosofia-title" className="text-2xl font-bold mb-8 uppercase tracking-widest">Nuestra Filosofía</h2>
                    <blockquote className="text-2xl italic text-gray-700 leading-relaxed">
                        "No solo vendemos vehículos de dos ruedas; entregamos la llave a un estilo de vida sin límites. Nuestra misión es asegurar que cada kilómetro sea una experiencia única de libertad."
                    </blockquote>
                </section>
            </main>

        </div>
    );
};

export default Nosotros;
