import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, ChevronRight, Zap, Target, Gauge } from 'lucide-react';
import { getMotos } from '../../../services/Moto.service';
import Loader from '../../../components/common/Loader';

const Models = () => {
    const [filter, setFilter] = useState('all');
    const [motos, setMotos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMotos = async () => {
            try {
                const data = await getMotos();
                setMotos(data);
            } catch (error) {
                console.error('Error cargando motos:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMotos();
    }, []);

    const brandFilters = useMemo(() => {
        const brands = new Set(motos.map((moto) => moto.marca).filter(Boolean));
        return ['all', ...Array.from(brands)];
    }, [motos]);

    const filteredBikes = filter === 'all'
        ? motos
        : motos.filter(moto => moto.marca?.toLowerCase() === filter.toLowerCase());

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Loader />
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Hero Section */}
            <div className="relative h-[40vh] bg-black overflow-hidden flex items-center justify-center">
                <img
                    src="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=2070&auto=format&fit=crop"
                    alt="Banner Modelos"
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                />
                <div className="relative z-10 text-center text-white px-4">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-4">
                        Nuestros <span className="text-yellow-500">Modelos</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-200 font-light">
                        Innovación y potencia en cada viaje
                    </p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
                <div className="bg-white rounded-xl shadow-xl p-4 flex flex-wrap gap-4 justify-center items-center">
                    <div className="flex items-center gap-2 mr-4 text-gray-500 font-bold uppercase tracking-wider text-sm">
                        <Filter size={18} /> Filtrar por:
                    </div>
                    {brandFilters.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 transform hover:-translate-y-1 ${filter === cat
                                    ? 'bg-yellow-400 text-black shadow-lg scale-105'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {cat === 'all' ? 'Todos' : cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                {filteredBikes.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-gray-500">
                        No hay motocicletas disponibles en este momento.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredBikes.map((moto) => (
                            <div key={moto.id_moto} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col">
                        {/* Image */}
                        <div className="relative h-64 overflow-hidden">
                            <img
                                src={
                                    moto.imagen_moto?.find((img) => img.imagen?.orden === 0)?.imagen?.url_imagen
                                    || moto.imagen_moto?.[0]?.imagen?.url_imagen
                                    || 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=2070&auto=format&fit=crop'
                                }
                                alt={`${moto.marca} ${moto.modelo}`}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-yellow-400 font-bold px-3 py-1 rounded-full text-sm border border-yellow-500/30">
                                {moto.estado}
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                <Link
                                    to={`/modelos/${moto.id_moto}`}
                                    className="bg-yellow-400 text-black font-bold px-6 py-2 rounded-full w-full hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2"
                                >
                                    Ver Detalles <ChevronRight size={18} />
                                </Link>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-yellow-600 transition-colors">
                                    {moto.marca} {moto.modelo}
                                </h3>
                                <span className="text-xl font-extrabold text-black">
                                    ${moto.precio?.toLocaleString()}
                                </span>
                            </div>

                            {/* Specs */}
                            <div className="grid grid-cols-3 gap-2 mt-auto pt-4 border-t border-gray-100">
                                <div className="text-center">
                                    <div className="flex justify-center text-gray-400 mb-1"><Target size={16} /></div>
                                    <div className="text-xs font-bold text-gray-800">{moto.cilindrada || '---'}</div>
                                    <div className="text-[10px] text-gray-500 uppercase">Motor</div>
                                </div>
                                <div className="text-center border-l border-gray-100">
                                    <div className="flex justify-center text-gray-400 mb-1"><Zap size={16} /></div>
                                    <div className="text-xs font-bold text-gray-800">{moto.anio || '---'}</div>
                                    <div className="text-[10px] text-gray-500 uppercase">Año</div>
                                </div>
                                <div className="text-center border-l border-gray-100">
                                    <div className="flex justify-center text-gray-400 mb-1"><Gauge size={16} /></div>
                                    <div className="text-xs font-bold text-gray-800">{moto.estado || '---'}</div>
                                    <div className="text-[10px] text-gray-500 uppercase">Estado</div>
                                </div>
                            </div>
                        </div>
                    </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Models;
