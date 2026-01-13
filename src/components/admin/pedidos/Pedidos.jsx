import React, { useState, useEffect } from 'react';
import { supabase } from '../../../services/Supabase';
import { MdDelete, MdCheckCircle, MdVisibility, MdClose, MdEmail, MdPhone, MdDateRange } from 'react-icons/md';
import Swal from 'sweetalert2';

const Pedidos = () => {
    const [consultas, setConsultas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedConsulta, setSelectedConsulta] = useState(null);
    const [filter, setFilter] = useState('all'); // 'all', 'Pendiente', 'Atendido'

    useEffect(() => {
        fetchConsultas();
    }, []);

    const fetchConsultas = async () => {
        try {
            const { data, error } = await supabase
                .from('consultas')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setConsultas(data);
        } catch (error) {
            console.error('Error fetching consultas:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const { error } = await supabase
                .from('consultas')
                .update({ estado: newStatus })
                .eq('id', id);

            if (error) throw error;

            setConsultas(prev => prev.map(c =>
                c.id === id ? { ...c, estado: newStatus } : c
            ));

            const toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
            toast.fire({
                icon: 'success',
                title: `Marcado como ${newStatus}`
            });

        } catch (error) {
            console.error('Error updating status:', error);
            Swal.fire('Error', 'No se pudo actualizar el estado', 'error');
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Eliminar consulta?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#000',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                const { error } = await supabase
                    .from('consultas')
                    .delete()
                    .eq('id', id);

                if (error) throw error;

                setConsultas(prev => prev.filter(c => c.id !== id));
                if (selectedConsulta?.id === id) setSelectedConsulta(null);

                Swal.fire('Eliminado', 'La consulta ha sido eliminada', 'success');
            } catch (error) {
                console.error('Error deleting consulta:', error);
                Swal.fire('Error', 'No se pudo eliminar', 'error');
            }
        }
    };

    const filteredConsultas = filter === 'all'
        ? consultas
        : consultas.filter(c => c.estado === filter);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-display font-bold text-gray-900 tracking-tight">Consultas y Pedidos</h1>
                    <p className="text-gray-500 mt-2">Gestiona los mensajes y cotizaciones de clientes</p>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === 'all' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Todos
                    </button>
                    <button
                        onClick={() => setFilter('Pendiente')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === 'Pendiente' ? 'bg-white shadow-sm text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Pendientes
                    </button>
                    <button
                        onClick={() => setFilter('Atendido')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === 'Atendido' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Atendidos
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* List Column */}
                <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-200px)]">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="font-bold text-gray-700">Bandeja de Entrada ({filteredConsultas.length})</h3>
                    </div>

                    <div className="overflow-y-auto flex-1">
                        {loading ? (
                            <div className="flex justify-center py-10">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                            </div>
                        ) : filteredConsultas.length === 0 ? (
                            <div className="text-center py-10 px-4 text-gray-400">
                                No hay consultas {filter !== 'all' && `en estado ${filter}`}
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {filteredConsultas.map((consulta) => (
                                    <div
                                        key={consulta.id}
                                        onClick={() => setSelectedConsulta(consulta)}
                                        className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${selectedConsulta?.id === consulta.id ? 'bg-blue-50 border-l-4 border-blue-500' : 'border-l-4 border-transparent'}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className={`font-bold text-sm ${consulta.estado === 'Pendiente' ? 'text-gray-900' : 'text-gray-600'}`}>
                                                {consulta.nombre}
                                            </h4>
                                            <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                                {new Date(consulta.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 truncate font-medium mb-1">{consulta.asunto || 'Sin asunto'}</p>
                                        <p className="text-xs text-gray-400 line-clamp-2">{consulta.mensaje}</p>

                                        <div className="mt-2 flex items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${consulta.estado === 'Pendiente' ? 'bg-red-100 text-red-600' :
                                                    consulta.estado === 'Atendido' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {consulta.estado}
                                            </span>
                                            {consulta.modelo_interes && (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] bg-gray-100 text-gray-600 border border-gray-200">
                                                    {consulta.modelo_interes}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Detail Column */}
                <div className="lg:col-span-2">
                    {selectedConsulta ? (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full min-h-[500px]">
                            {/* Detail Header */}
                            <div className="p-6 border-b border-gray-100 bg-gray-50/30 flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedConsulta.asunto || 'Consulta General'}</h2>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <MdDateRange />
                                            {formatDate(selectedConsulta.created_at)}
                                        </div>
                                        {selectedConsulta.modelo_interes && (
                                            <div className="flex items-center gap-1 text-black font-medium">
                                                <span className="bg-black text-white px-2 py-0.5 rounded text-xs">Interés:</span>
                                                {selectedConsulta.modelo_interes}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {selectedConsulta.estado === 'Pendiente' ? (
                                        <button
                                            onClick={() => handleStatusChange(selectedConsulta.id, 'Atendido')}
                                            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm text-sm font-medium"
                                        >
                                            <MdCheckCircle size={18} />
                                            Marcar Atendido
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleStatusChange(selectedConsulta.id, 'Pendiente')}
                                            className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                                        >
                                            Reabrir
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleDelete(selectedConsulta.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Eliminar"
                                    >
                                        <MdDelete size={22} />
                                    </button>
                                </div>
                            </div>

                            {/* Detail Body */}
                            <div className="p-8 space-y-8">
                                {/* Contact Info */}
                                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Datos de Contacto</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Nombre</p>
                                            <p className="font-medium text-gray-900 text-lg">{selectedConsulta.nombre}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Email</p>
                                            <a href={`mailto:${selectedConsulta.email}`} className="flex items-center gap-2 font-medium text-blue-600 hover:underline">
                                                <MdEmail />
                                                {selectedConsulta.email || 'No especificado'}
                                            </a>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Teléfono</p>
                                            <a href={`tel:${selectedConsulta.telefono}`} className="flex items-center gap-2 font-medium text-gray-900 hover:text-blue-600">
                                                <MdPhone />
                                                {selectedConsulta.telefono || 'No especificado'}
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Message */}
                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Mensaje</h3>
                                    <div className="bg-white p-6 rounded-xl border border-gray-200 text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {selectedConsulta.mensaje}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200 min-h-[500px]">
                            <MdVisibility size={48} className="mb-4 opacity-20" />
                            <p className="text-lg font-medium">Selecciona una consulta para ver el detalle</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Pedidos;
