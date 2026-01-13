import React from 'react';

const Descuentos = () => {
    return (
        <>
            <section className="pt-32 pb-16 bg-gray-100 dark:bg-gray-900">
                <div className="container mx-auto px-4 text-center">
                    <p className="font-semibold text-primary mb-2">OFERTAS EXCLUSIVAS</p>
                    <h1 className="text-5xl md:text-6xl font-display text-gray-900 dark:text-white">DESCUENTOS IRRESISTIBLES</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
                        Aprovecha nuestras promociones por tiempo limitado y llévate la motocicleta de tus sueños a un precio increíble.
                    </p>
                </div>
            </section>
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                            <img alt="Motorcycle Land Roys Explorer 800 on a light background" className="w-full h-64 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9f-4DXvnCOF25I8khz9_NlwGRHKkrr4rdEBiFwyBjRKFzDzBmK8Df_iiA-VxqaH_4-8HGsKuERHb6u1AlZ4LcD41-6yV-KD86GWsBi2tSn2SfDfF_JFy2Ib1drrzE8oP0q3jUl-Ale6VaNWZsFOO8vxhuaCMkeLJGmWQaKL9p9f3BYQtJlD-742ee2V43opp1VHBNWPbDKI5MY8BtMD6gBNkO9WksUumzzU0BGtkJQKgFDj7mx0F26ziyC_IFhC2lUdQXbIXTA1Pq" />
                            <div className="p-6">
                                <span className="inline-block bg-yellow-100 dark:bg-yellow-900/30 text-primary font-bold text-sm px-3 py-1 rounded-full mb-3">-15% DESCUENTO</span>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Land Roys Explorer 800</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">La compañera perfecta para la aventura sin límites, ahora con un precio especial.</p>
                                <div className="flex items-baseline mb-6">
                                    <span className="text-3xl font-bold text-primary mr-2">$8,500</span>
                                    <span className="text-xl text-gray-500 dark:text-gray-400 line-through">$10,000</span>
                                </div>
                                <button className="w-full bg-black text-[#D4AF37] font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-gray-900 transition-colors duration-300">
                                    Ver Oferta
                                </button>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                            <img alt="Motorcycle Land Roys Urban X in a dark studio setting" className="w-full h-64 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhoU_jJV4I0LO6sXrn9uTfngPi3jSO7Ywi9AQNy8YXOm-cc1uSwVEbb0xyyAM3Kkj5AIvMm3H3Zgczp2P5L0L-5TQsdyTTtHa-eA-fW31rP0bPpG6F1-yXxjCxTrJNEe1wriRTFbYoMvTlKCKVVRFfKTq9qcvj1UgAcXHZC4UULuJoOwPpen12mXAL382kMxfcMJizujL721eocbo8VP61n82_VKkqUeM2YlI1vpf9EauqYAnRoupEa2M8K5y7rp7pA0hOmkvfZf02" />
                            <div className="p-6">
                                <span className="inline-block bg-yellow-100 dark:bg-yellow-900/30 text-primary font-bold text-sm px-3 py-1 rounded-full mb-3">FINANCIACIÓN 0%</span>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Land Roys Urban X</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">Domina la jungla urbana con estilo y agilidad. ¡Págala en cómodas cuotas sin interés!</p>
                                <div className="flex items-baseline mb-6">
                                    <span className="text-3xl font-bold text-gray-900 dark:text-white">$9,200</span>
                                </div>
                                <button className="w-full bg-black text-[#D4AF37] font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-gray-900 transition-colors duration-300">
                                    Más Información
                                </button>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                            <img alt="Motorcycle Land Roys Adventurer 1200 on a dirt road" className="w-full h-64 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBt9834atBrGSvuXFDf_JLOf_M_Fhu8melWy6JEjqEbB8rKcVk3JfRdJJVWOJXfMD0NFuody3DOQmF_yiFKyqLlA9I1df4XIgNspVBT-DbsdYmT5PbTEvrDFzZIOIhrdD8M6YruTPwfWoql12YsYnpq1zrAniF6e0rfY69MtimHDK1djH_msK7GF1iLbUpCPEHtWQ7C9GewzC76ljdl_j2dL8Ox9lx8QXrnqqU-lZGlNPaNy5y6amgpo8vwuPqBZx8SmqY-G1giHF5B" />
                            <div className="p-6">
                                <span className="inline-block bg-yellow-100 dark:bg-yellow-900/30 text-primary font-bold text-sm px-3 py-1 rounded-full mb-3">PACK AVENTURA GRATIS</span>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Land Roys Adventurer 1200</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">Construida para conquistar. Llévate el pack de maletas valorado en $1,200 gratis.</p>
                                <div className="flex items-baseline mb-6">
                                    <span className="text-3xl font-bold text-gray-900 dark:text-white">$14,500</span>
                                </div>
                                <button className="w-full bg-black text-[#D4AF37] font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-gray-900 transition-colors duration-300">
                                    Descubrir Pack
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Descuentos;
