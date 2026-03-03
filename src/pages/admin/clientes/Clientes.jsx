import React, { useEffect, useState } from "react";
import { getSolicitudes, updateSolicitud } from "../../../services/Solicitudes.service";
import { closeSaleTransaction } from "../../../services/Ventas.service";
import { getMotos } from "../../../services/motos.service";
import Swal from "sweetalert2";
import {
    Mail,
    Phone,
    MapPin,
    MessageSquare,
    CheckCircle2,
    XCircle,
    DollarSign,
    Calendar,
    CreditCard,
    User,
    ShoppingBag,
    MoreVertical,
    Search,
    AlertTriangle
} from "lucide-react";

/**
 * Page: Clientes / Leads CRM
 * Description: Kanban-style or Grid view of leads with conversion workflow.
 */
const Clientes = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [motos, setMotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [saleForm, setSaleForm] = useState({
        moto_id: "", // ID of selected moto
        monto: "",
        metodo_pago: "transferencia", // transferencia, efectivo, tarjeta
        fecha_entrega: "",
        producto: "", // Name of product (derived from selected moto)
        notas: "",
        discountType: 'percent', // 'percent' | 'fixed'
        discountValue: 0
    });

    const fetchData = async () => {
        try {
            const [leadsData, motosData] = await Promise.all([
                getSolicitudes(),
                getMotos()
            ]);
            setSolicitudes(leadsData);
            setMotos(motosData);
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "No se pudieron cargar los datos", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenSaleModal = (lead) => {
        setSelectedLead(lead);
        setSaleForm({
            moto_id: "",
            monto: "",
            metodo_pago: "transferencia",
            fecha_entrega: "",
            producto: "",
            notas: "",
            discountType: 'percent',
            discountValue: 0
        });
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedLead(null);
    }

    const handleSaleSubmit = async (e) => {
        e.preventDefault();

        // Use consistent string comparison to find the moto
        const selectedMoto = motos.find(m => String(m.id) === String(saleForm.moto_id));

        if (!selectedMoto) {
            Swal.fire("Error", "Selecciona una moto válida", "error");
            return;
        }

        if (selectedMoto.stock <= 0) {
            Swal.fire("Sin Stock", "Esta moto no tiene stock disponible para la venta.", "error");
            return;
        }

        try {
            // Calculate Final Price and Discount Details
            const basePrice = Number(saleForm.monto); // This comes from form, initialized with moto price
            let discountAmount = 0;
            let finalPrice = basePrice;

            if (saleForm.discountValue > 0) {
                if (saleForm.discountType === 'percent') {
                    discountAmount = basePrice * (saleForm.discountValue / 100);
                } else {
                    discountAmount = Number(saleForm.discountValue);
                }
                finalPrice = basePrice - discountAmount;
            }

            // Format Notes with Discount Info
            const discountNote = saleForm.discountValue > 0
                ? ` [Descuento: ${saleForm.discountType === 'percent' ? saleForm.discountValue + '%' : '$' + saleForm.discountValue} (-$${discountAmount}). Precio Original: $${basePrice}]`
                : "";

            const fullNotes = `${saleForm.notas}${discountNote}`;

            const ventaPayload = {
                solicitud_id: selectedLead.id,
                cliente_nombre: selectedLead.nombre,
                cliente_email: selectedLead.email,
                producto: selectedMoto.nombre,
                monto: finalPrice,
                metodo_pago: saleForm.metodo_pago,
                fecha_entrega: saleForm.fecha_entrega || null,
                notas: fullNotes,
                estado: "completado"
            };

            const solicitudPayload = {
                estado: 'vendido',
                notas_admin: `Venta cerrada por $${finalPrice}. Producto: ${selectedMoto.nombre}. ${fullNotes}`
            };

            await closeSaleTransaction({
                ventaPayload,
                motoId: selectedMoto.id,
                stockActual: selectedMoto.stock,
                solicitudId: selectedLead.id,
                solicitudPayload,
            });

            Swal.fire("¡Venta Registrada!", "Inventario actualizado y venta creada.", "success");
            handleCloseModal();
            fetchData(); // Refresh both leads and inventory

        } catch (error) {
            console.error(error);
            Swal.fire("Error", "No se pudo registrar la venta", "error");
        }
    }

    const handleChangeEstado = async (id, nuevoEstado) => {
        try {
            await updateSolicitud(id, { estado: nuevoEstado });
            fetchData();
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
            });
            Toast.fire({
                icon: "success",
                title: `Estado actualizado a ${nuevoEstado}`
            });
        } catch (error) {
            console.error(error);
        }
    }

    const handleMarkLost = async (lead) => {
        const { value: text } = await Swal.fire({
            input: "textarea",
            inputLabel: "Motivo de pérdida",
            inputPlaceholder: "Ej. Compró otra marca, muy caro...",
            inputAttributes: {
                "aria-label": "Escribe el motivo"
            },
            showCancelButton: true,
            confirmButtonText: "Marcar como Perdido",
            confirmButtonColor: "#d33",
            cancelButtonText: "Cancelar"
        });

        if (text) {
            try {
                await updateSolicitud(lead.id, {
                    estado: 'cerrado',
                    notas_admin: `PERDIDO: ${text}`
                });
                Swal.fire("Listo", "Lead marcado como perdido", "success");
                fetchData();
            } catch (error) {
                console.error(error);
            }
        }
    }

    const filteredSolicitudes = solicitudes.filter(s => {
        const matchesSearch = s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || s.estado === filterStatus;
        return matchesSearch && matchesFilter;
    });

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
        </div>
    );

    return (
        <div className="p-8 space-y-8 bg-gray-50/50 min-h-full">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Gestión de Leads</h1>
                    <p className="text-gray-500 mt-1">Administra tus clientes potenciales y cierra ventas.</p>
                </div>

                <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                    <Search className="text-gray-400 ml-2" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar lead..."
                        className="bg-transparent border-none focus:ring-0 text-sm w-48 md:w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {[
                    { label: "Todos", value: "all" },
                    { label: "Pendientes", value: "pendiente" },
                    { label: "Contactados", value: "contactado" },
                    { label: "Vendidos", value: "vendido" },
                    { label: "Perdidos", value: "cerrado" }
                ].map(filter => (
                    <button
                        key={filter.value}
                        onClick={() => setFilterStatus(filter.value)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap
                        ${filterStatus === filter.value
                                ? "bg-black text-white shadow-lg shadow-black/20"
                                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"}`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredSolicitudes.length === 0 ? (
                    <div className="col-span-full py-20 text-center">
                        <User size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No se encontraron leads</h3>
                        <p className="text-gray-500">Intenta cambiar los filtros o busca otro nombre.</p>
                    </div>
                ) : (
                    filteredSolicitudes.map((solicitud) => (
                        <div key={solicitud.id} className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                            {/* Status Bar */}
                            <div className={`absolute top-0 left-0 w-1 h-full 
                                ${solicitud.estado === 'pendiente' ? 'bg-yellow-400' :
                                    solicitud.estado === 'contactado' ? 'bg-blue-500' :
                                        solicitud.estado === 'vendido' ? 'bg-green-500' : 'bg-gray-300'}`}
                            />

                            <div className="flex justify-between items-start mb-4 pl-3">
                                <div>
                                    <h3 className="font-bold text-xl text-gray-900 leading-tight">{solicitud.nombre}</h3>
                                    <span className="text-xs font-medium text-gray-400">
                                        {new Date(solicitud.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider
                                    ${solicitud.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                        solicitud.estado === 'contactado' ? 'bg-blue-100 text-blue-800' :
                                            solicitud.estado === 'vendido' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                    {solicitud.estado}
                                </div>
                            </div>

                            <div className="space-y-3 pl-3 mb-6">
                                <div className="flex items-center gap-3 text-gray-600 text-sm group-hover:text-gray-900 transition-colors">
                                    <Mail size={16} className="text-gray-400" />
                                    <span className="truncate">{solicitud.email}</span>
                                </div>
                                {solicitud.telefono && (
                                    <div className="flex items-center gap-3 text-gray-600 text-sm group-hover:text-gray-900 transition-colors">
                                        <Phone size={16} className="text-gray-400" />
                                        <span>{solicitud.telefono}</span>
                                    </div>
                                )}
                                {solicitud.ciudad && (
                                    <div className="flex items-center gap-3 text-gray-600 text-sm group-hover:text-gray-900 transition-colors">
                                        <MapPin size={16} className="text-gray-400" />
                                        <span>{solicitud.ciudad}</span>
                                    </div>
                                )}
                            </div>

                            {/* Actions Area */}
                            <div className="pl-3 mt-auto pt-4 border-t border-gray-50 flex flex-wrap gap-2">
                                {solicitud.estado === 'pendiente' && (
                                    <button
                                        onClick={() => handleChangeEstado(solicitud.id, 'contactado')}
                                        className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                                    >
                                        <MessageSquare size={14} /> Contactar
                                    </button>
                                )}

                                {solicitud.estado !== 'vendido' && solicitud.estado !== 'cerrado' && (
                                    <button
                                        onClick={() => handleOpenSaleModal(solicitud)}
                                        className="flex-[2] bg-black hover:bg-gray-800 text-white text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-lg shadow-black/10"
                                    >
                                        <DollarSign size={14} /> Convertir a Venta
                                    </button>
                                )}

                                {solicitud.estado !== 'cerrado' && solicitud.estado !== 'vendido' && (
                                    <button
                                        onClick={() => handleMarkLost(solicitud)}
                                        className="w-8 h-9 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-red-500 rounded-lg flex items-center justify-center transition-colors"
                                        title="Marcar como perdido"
                                    >
                                        <XCircle size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal de Venta */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="bg-black p-6 flex justify-between items-center">
                            <div>
                                <h2 className="text-white text-xl font-bold">Registrar Venta</h2>
                                <p className="text-gray-400 text-sm">Cerrando trato con {selectedLead?.nombre}</p>
                            </div>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-white transition-colors">
                                <XCircle size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSaleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Producto (Inventario)</label>
                                <div className="relative">
                                    <ShoppingBag className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <select
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all appearance-none"
                                        value={saleForm.moto_id}
                                        onChange={e => {
                                            const val = e.target.value;
                                            const selectedMoto = motos.find(m => String(m.id) === String(val));
                                            setSaleForm({
                                                ...saleForm,
                                                moto_id: val,
                                                monto: selectedMoto ? selectedMoto.precio : ""
                                            });
                                        }}
                                    >
                                        <option value="">Selecciona una moto...</option>
                                        {motos.map(moto => (
                                            <option key={moto.id} value={moto.id}>
                                                {moto.nombre} (Stock: {moto.stock}) - ${moto.precio}
                                            </option>
                                        ))}
                                    </select>
                                    {/* Stock Validation Display */}
                                    {saleForm.moto_id && (
                                        (() => {
                                            const m = motos.find(moto => String(moto.id) === String(saleForm.moto_id));
                                            const stock = m ? m.stock : 0;
                                            return (
                                                <div className={`text-xs mt-1 font-bold ${stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    Stock disponible: {stock}
                                                </div>
                                            );
                                        })()
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Precio Base ($)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-3 text-gray-400" size={18} />
                                        <input
                                            type="number"
                                            required
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                            value={saleForm.monto}
                                            onChange={e => setSaleForm({ ...saleForm, monto: e.target.value })}
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Fecha Entrega</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                                        <input
                                            type="date"
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                            value={saleForm.fecha_entrega}
                                            onChange={e => setSaleForm({ ...saleForm, fecha_entrega: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Discount Section */}
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Aplicar Descuento</label>
                                <div className="flex gap-4">
                                    <div className="flex bg-white rounded-lg border border-gray-200 p-1 h-10">
                                        <button
                                            type="button"
                                            onClick={() => setSaleForm({ ...saleForm, discountType: 'percent' })}
                                            className={`px-3 py-1 rounded-md text-sm font-bold transition-all ${saleForm.discountType === 'percent' ? 'bg-black text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                                        >
                                            %
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSaleForm({ ...saleForm, discountType: 'fixed' })}
                                            className={`px-3 py-1 rounded-md text-sm font-bold transition-all ${saleForm.discountType === 'fixed' ? 'bg-black text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                                        >
                                            $
                                        </button>
                                    </div>
                                    <div className="relative flex-1">
                                        <input
                                            type="number"
                                            min="0"
                                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all h-10"
                                            placeholder={saleForm.discountType === 'percent' ? "Porcentaje (ej. 10)" : "Monto (ej. 500)"}
                                            value={saleForm.discountValue}
                                            onChange={e => setSaleForm({ ...saleForm, discountValue: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Final Price Calculation */}
                                <div className="mt-4 flex justify-between items-center border-t border-gray-200 pt-3">
                                    <span className="text-sm font-medium text-gray-500">Precio Final:</span>
                                    <span className="text-xl font-black text-green-600">
                                        {(() => {
                                            const base = Number(saleForm.monto) || 0;
                                            const val = Number(saleForm.discountValue) || 0;
                                            let final = base;
                                            if (val > 0) {
                                                if (saleForm.discountType === 'percent') final = base - (base * (val / 100));
                                                else final = base - val;
                                            }
                                            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(final < 0 ? 0 : final);
                                        })()}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Método de Pago</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['transferencia', 'efectivo', 'tarjeta'].map(method => (
                                        <button
                                            key={method}
                                            type="button"
                                            onClick={() => setSaleForm({ ...saleForm, metodo_pago: method })}
                                            className={`py-2 rounded-xl text-sm font-medium border transition-all ${saleForm.metodo_pago === method
                                                ? 'bg-yellow-400 border-yellow-400 text-black'
                                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            {method.charAt(0).toUpperCase() + method.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Notas / Observaciones</label>
                                <textarea
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                    rows="3"
                                    value={saleForm.notas}
                                    onChange={e => setSaleForm({ ...saleForm, notas: e.target.value })}
                                    placeholder="Detalles adicionales..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={(() => {
                                    if (!saleForm.moto_id) return true;
                                    const m = motos.find(moto => String(moto.id) === String(saleForm.moto_id));
                                    return !m || m.stock <= 0;
                                })()}
                                className={`w-full font-bold py-4 rounded-xl shadow-xl transition-all flex items-center justify-center gap-2
                                    ${(() => {
                                        if (!saleForm.moto_id) return 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none';
                                        const m = motos.find(moto => String(moto.id) === String(saleForm.moto_id));
                                        return m && m.stock > 0
                                            ? 'bg-black hover:bg-gray-800 text-white shadow-black/20 active:scale-95'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none';
                                    })()}`}
                            >
                                {(() => {
                                    const m = motos.find(moto => String(moto.id) === String(saleForm.moto_id));
                                    if (m && m.stock > 0) return <><CheckCircle2 size={20} /> Confirmar Venta</>;
                                    return <><AlertTriangle size={20} /> {m ? 'Sin Stock' : 'Selecciona Moto'}</>;
                                })()}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Clientes;
