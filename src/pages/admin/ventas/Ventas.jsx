import React, { useEffect, useState } from "react";
import { getVentas } from "../../../services/Ventas.service";
import Swal from "sweetalert2";
import { PlusCircle, Search, Calendar, DollarSign, Package } from "lucide-react";

/**
 * Page: Ventas
 * Description: Premium list of sales.
 */
const Ventas = () => {
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchVentas = async () => {
            try {
                const data = await getVentas();
                setVentas(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchVentas();
    }, []);

    const currency = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
    });

    const filteredVentas = ventas.filter(v =>
        v.cliente_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.producto.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
        </div>
    );

    return (
        <div className="p-8 space-y-8 bg-gray-50/50 min-h-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Historial de Ventas</h1>
                    <p className="text-gray-500 mt-1">Registro de transacciones y entregas.</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                    <Search className="text-gray-400 ml-2" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar venta..."
                        className="bg-transparent border-none focus:ring-0 text-sm w-48 md:w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Producto / Cliente</th>
                            <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Fecha</th>
                            <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Método Pago</th>
                            <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Monto</th>
                            <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredVentas.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-8 py-12 text-center text-gray-400">
                                    No se encontraron ventas.
                                </td>
                            </tr>
                        ) : (
                            filteredVentas.map((venta) => (
                                <tr key={venta.id} className="hover:bg-gray-50/80 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-900 text-lg">{venta.producto}</span>
                                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                                <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                                                {venta.cliente_nombre}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-gray-600 font-medium">
                                            <Calendar size={16} className="text-gray-400" />
                                            {new Date(venta.fecha_venta).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="capitalize px-3 py-1 rounded-lg bg-gray-100 text-gray-600 text-sm font-medium border border-gray-200">
                                            {venta.metodo_pago || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <span className="font-black text-gray-900 text-lg">
                                            {currency.format(venta.monto)}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${venta.estado === 'completado' ? 'bg-green-100 text-green-700' :
                                                venta.estado === 'cancelado' ? 'bg-red-100 text-red-700' :
                                                    'bg-gray-100 text-gray-700'
                                            }`}>
                                            {venta.estado}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Ventas;
