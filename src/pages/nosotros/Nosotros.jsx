import React from 'react';
import { MdDirectionsCar, MdBuild, MdPeople, MdElectricRickshaw } from "react-icons/md";

const Nosotros = () => {
    const heroBgStyle = {
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://lh3.googleusercontent.com/aida-public/AB6AXuAebLlWyoInJcEPknous7eLqq2oIVwYyyYBVn25JkhHG2GyHRNsHKmo9XVbviTd7BXUynuxPCPqJBikodl7xOocwf04JE5Gl5qwx-NoZY7ai7fKaxNXqk5Q5fYdwzgwzeuhqjldmrFTfVR1qSKdc8DFXZmllN4VZRks_luI9qGak1pz3pLkl_uaHLJKELa8X5J7zUL5utF-uGBYtu8b686w6baDbeqMEJu7K-265__qBv4TrBihlNCVTGpgHXP_GU-f1TN_tahEjOyt)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    };

    const iconGradientStyle = {
        background: 'linear-gradient(to right, #D4AF37, #b5952f)'
    };

    return (
        <main>
            <section className="relative h-[60vh] flex items-center justify-center text-center text-white" style={heroBgStyle}>
                <div className="container mx-auto px-6">
                    <h1 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-wider uppercase">NUESTRA HISTORIA,</h1>
                    <h2 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-wider uppercase text-gray-300">NUESTRA PASIÓN</h2>
                    <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-200">Desde un modesto taller a las carreteras del mundo, forjamos leyendas sobre dos ruedas.</p>
                </div>
            </section>
            <section className="py-20 lg:py-28 bg-background-light dark:bg-background-dark">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <div className="order-2 lg:order-1">
                            <span className="text-primary font-bold text-sm tracking-widest uppercase">EL VIAJE COMIENZA</span>
                            <h2 className="font-display text-4xl md:text-5xl mt-2 text-gray-900 dark:text-white">Forjados en la <br />Aventura</h2>
                            <p className="mt-6 text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                                Land Roys nació de una pasión compartida por la libertad y la mecánica. En un pequeño garaje, nuestros fundadores soñaron con crear motocicletas que no solo fueran máquinas, sino extensiones del espíritu de quien las conduce. Cada moto es un testimonio de nuestra dedicación a la artesanía, la innovación y la búsqueda incesante de la aventura.
                            </p>
                            <p className="mt-4 text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                                Creemos que cada curva del camino es una oportunidad para descubrir algo nuevo, y nuestras motocicletas están diseñadas para ser las compañeras perfectas en ese viaje de descubrimiento.
                            </p>
                        </div>
                        <div className="order-1 lg:order-2">
                            <img alt="Two Land Roys motorcycles parked in a natural, rugged landscape" className="rounded-lg shadow-2xl w-full h-auto object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbficQKTMkNw36nI5hLFG14z_xdSCEl7pthKR_-mLrQLCjrgP1wNLDocWQiNqSIKGL1uog-YI72KjGvEzDX6k-y2KCR4YCka6BjBJbGPrrj1IxWWYyuWWAVvaMOM6euPKglgf5r-_e0y7v9LNs8eR8aqZHW3dAzvS5iPcGjwLZkqiL7l4MqSEJlwwnxsmVtcQ5aXss3ddjJO8Zqhos7U568aH88wfgf-54iLWhtEgPq_iMXagDM6ZY3nAW94oZ4YfwWTHwGrzebma8" />
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-20 lg:py-28 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-6 text-center">
                    <span className="text-primary font-bold text-sm tracking-widest uppercase">NUESTROS VALORES</span>
                    <h2 className="font-display text-4xl md:text-5xl mt-2 text-gray-900 dark:text-white">El Alma de Land Roys</h2>
                    <p className="mt-4 max-w-3xl mx-auto text-gray-600 dark:text-gray-400">
                        Estos son los principios que guían cada decisión, cada diseño y cada kilómetro. Son el corazón de nuestro espíritu indomable.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                        <div className="flex flex-col items-center p-8 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={iconGradientStyle}>
                                <MdDirectionsCar className="text-white text-3xl" />
                            </div>
                            <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">Pasión por la Carretera</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Vivimos y respiramos la cultura del motociclismo. La carretera es nuestro lienzo y cada moto, nuestra obra maestra.</p>
                        </div>
                        <div className="flex flex-col items-center p-8 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={iconGradientStyle}>
                                <MdBuild className="text-white text-3xl" />
                            </div>
                            <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">Ingeniería Excepcional</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Combinamos diseño atemporal con tecnología de punta para crear máquinas fiables, potentes y seguras.</p>
                        </div>
                        <div className="flex flex-col items-center p-8 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={iconGradientStyle}>
                                <MdPeople className="text-white text-3xl" />
                            </div>
                            <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">Comunidad y Legado</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Construimos más que motos; construimos una familia de aventureros que comparten un espíritu indomable.</p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-20 lg:py-28 bg-background-light dark:bg-background-dark">
                <div className="container mx-auto px-6">
                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-12">
                        <div className="lg:w-1/2">
                            <span className="text-primary font-bold text-sm tracking-widest uppercase flex items-center gap-2">
                                <MdElectricRickshaw className="text-lg" />
                                ÚNETE AL VIAJE
                            </span>
                            <h2 className="font-display text-4xl md:text-5xl mt-2 text-gray-900 dark:text-white">Conoce la Familia Land Roys</h2>
                            <p className="mt-6 text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                                Tu próxima aventura te espera. Descubre la gama completa de motocicletas Land Roys y encuentra la compañera perfecta para conquistar nuevos horizontes. Siente la ingeniería, vive la pasión y desata tu espíritu indomable.
                            </p>
                            <a className="inline-block bg-primary text-black px-8 py-3 rounded-md font-bold text-base mt-8 hover:bg-opacity-90 transition-opacity" href="#">
                                Explorar Modelos
                            </a>
                        </div>
                        <div className="lg:w-1/2">
                            <img alt="A group of Land Roys motorcycles parked side-by-side, showcasing different models." className="rounded-lg w-full h-auto object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAddEE1IiB34qv9wMCUQRScRorQVEaK9Nce7r6t2UmvxH18l-dY6CPg7BW6RqPGW8QnxYn2fhJV79k7BLkGcLUOJog4Sj7EVxw7e9ue-S124-bD13g4SkfFsty4SxsA4JPD0xnn2SAk-QMVliU2eWM0KBptWgz8NxN0QXA_Yh9-i5TxoFfm_qApGXLfXMchYLzDrfImXibpk32KuQG-IEVHnHbCVNRsAJrUndzF12YtoC4vVn2lmm6_aHqdOA-qITZhXxRGjjEIYwgc" />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Nosotros;
