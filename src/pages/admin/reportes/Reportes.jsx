import React, { useEffect, useState } from "react";
import { getGeneralStats, getAllSales, getInventoryReport, getAllLeads } from "../../../services/Reportes.service";
import {
    BarChart3,
    TrendingUp,
    Users,
    FileSpreadsheet,
    FileText,
    Download,
    Calendar as CalendarIcon,
    Search,
    Package
} from "lucide-react";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Reportes = () => {
    const [activeTab, setActiveTab] = useState('ventas'); // ventas, inventario, leads
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        ventas: [],
        inventario: [],
        leads: []
    });
    const [stats, setStats] = useState({
        totalVentas: 0,
        totalSolicitudes: 0,
        ingresosTotales: 0,
    });

    const [dateFilter, setDateFilter] = useState('month'); // today, week, month, custom
    const [customRange, setCustomRange] = useState({ start: '', end: '' });

    // Helper to get date dates
    const getDateRange = () => {
        const end = new Date();
        let start = new Date();

        // Reset hours for accurate daily comparison
        end.setHours(23, 59, 59, 999);
        start.setHours(0, 0, 0, 0);

        switch (dateFilter) {
            case 'today':
                break; // start is already today 00:00
            case 'week':
                const day = start.getDay();
                const diff = start.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
                start.setDate(diff); // Monday
                break;
            case 'month':
                start.setDate(1); // 1st of month
                break;
            case 'custom':
                if (!customRange.start) return {};
                start = new Date(customRange.start + 'T00:00:00');
                if (customRange.end) {
                    const endDateObj = new Date(customRange.end + 'T23:59:59');
                    return { startDate: start.toISOString(), endDate: endDateObj.toISOString() };
                }
                return { startDate: start.toISOString() };
            default:
                start.setDate(1); // Default to month
        }
        return { startDate: start.toISOString(), endDate: end.toISOString() };
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const range = getDateRange();
                const [general, ventasData, inventarioData, leadsData] = await Promise.all([
                    getGeneralStats(range),
                    getAllSales(range),
                    getInventoryReport(), // No date filter for inventory
                    getAllLeads(range)
                ]);
                setStats(general);
                setData({
                    ventas: ventasData,
                    inventario: inventarioData,
                    leads: leadsData
                });
            } catch (error) {
                console.error("Error loading reports:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [dateFilter, customRange.start, customRange.end]);

    const currency = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
    });

    const exportToExcel = (type) => {
        let exportData = [];
        let fileName = `Reporte_${type}_${new Date().toLocaleDateString()}.xlsx`;

        if (type === 'ventas') {
            exportData = data.ventas.map(v => ({
                ID: v.id,
                Fecha: new Date(v.fecha_venta).toLocaleDateString(),
                Cliente: v.cliente_nombre,
                Email: v.cliente_email,
                Producto: v.producto,
                Metodo_Pago: v.metodo_pago,
                Monto: v.monto,
                Notas: v.notas
            }));
        } else if (type === 'inventario') {
            exportData = data.inventario.map(i => ({
                ID: i.id,
                Modelo: i.modelo_codigo,
                Nombre: i.nombre,
                Categoria: i.categoria,
                Precio: i.precio,
                Stock: i.stock,
                Estado: i.estado,
                Valor_Total: i.precio * i.stock
            }));
        } else if (type === 'leads') {
            exportData = data.leads.map(l => ({
                ID: l.id,
                Fecha: new Date(l.created_at).toLocaleDateString(),
                Nombre: l.nombre,
                Email: l.email,
                Telefono: l.telefono,
                Ciudad: l.ciudad,
                Estado: l.estado,
                Mensaje: l.mensaje
            }));
        }

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Reporte");
        XLSX.writeFile(wb, fileName);
    };

    const exportToPDF = (type) => {
        const doc = new jsPDF();
        const date = new Date().toLocaleDateString();

        doc.setFontSize(18);
        doc.text(`Reporte de ${type.charAt(0).toUpperCase() + type.slice(1)}`, 14, 22);
        doc.setFontSize(11);
        doc.text(`Fecha: ${date}`, 14, 30);
        doc.text(`Land Roys - Sistema de Gestión`, 14, 36);

        let tableColumn = [];
        let tableRows = [];

        if (type === 'ventas') {
            tableColumn = ["ID", "Fecha", "Cliente", "Producto", "Monto", "Pago"];
            data.ventas.forEach(v => {
                const reportData = [
                    v.id,
                    new Date(v.fecha_venta).toLocaleDateString(),
                    v.cliente_nombre,
                    v.producto,
                    currency.format(v.monto),
                    v.metodo_pago
                ];
                tableRows.push(reportData);
            });
        } else if (type === 'inventario') {
            tableColumn = ["ID", "Modelo", "Nombre", "Precio", "Stock", "Valor Total"];
            data.inventario.forEach(i => {
                const reportData = [
                    i.id,
                    i.modelo_codigo,
                    i.nombre,
                    currency.format(i.precio),
                    i.stock,
                    currency.format(i.precio * i.stock)
                ];
                tableRows.push(reportData);
            });
        } else if (type === 'leads') {
            tableColumn = ["Fecha", "Nombre", "Email", "Ciudad", "Estado"];
            data.leads.forEach(l => {
                const reportData = [
                    new Date(l.created_at).toLocaleDateString(),
                    l.nombre,
                    l.email,
                    l.ciudad,
                    l.estado
                ];
                tableRows.push(reportData);
            });
        }

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 45,
            theme: 'striped',
            headStyles: { fillColor: [0, 0, 0] },
            styles: { fontSize: 8 }
        });

        doc.save(`Reporte_${type}_${date}.pdf`);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
        </div>
    );

    return (
        <div className="p-8 space-y-8 bg-gray-50/50 min-h-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Reportes</h1>
                    <p className="text-gray-500 mt-2 font-medium">Exporta y analiza el rendimiento de tu negocio.</p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-black text-white p-6 rounded-3xl shadow-xl flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Ingresos</p>
                        <h3 className="text-3xl font-black">{currency.format(stats.ingresosTotales)}</h3>
                    </div>
                    <div className="bg-white/10 p-3 rounded-2xl">
                        <TrendingUp className="text-yellow-400" size={24} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Ventas Totales</p>
                        <h3 className="text-3xl font-black">{stats.totalVentas}</h3>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                        <BarChart3 size={24} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Prospectos</p>
                        <h3 className="text-3xl font-black">{stats.totalSolicitudes}</h3>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-2xl text-yellow-600">
                        <Users size={24} />
                    </div>
                </div>
            </div>

            {/* Reports Section */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
                {/* Tabs */}
                <div className="border-b border-gray-100 p-2 flex gap-2 overflow-x-auto">
                    {[
                        { id: 'ventas', label: 'Ventas Detalladas', icon: BarChart3 },
                        { id: 'inventario', label: 'Inventario & Stock', icon: Package },
                        { id: 'leads', label: 'Leads & Clientes', icon: Users },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all
                                ${activeTab === tab.id
                                    ? 'bg-black text-white shadow-lg shadow-black/10'
                                    : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Toolbar */}
                <div className="p-6 border-b border-gray-50 flex justify-between items-center flex-wrap gap-4">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl font-bold text-gray-900">
                            {activeTab === 'ventas' && 'Historial de Ventas'}
                            {activeTab === 'inventario' && 'Reporte de Inventario'}
                            {activeTab === 'leads' && 'Base de Datos de Leads'}
                        </h3>

                        {/* Date Filters (Only for Sales and Leads) */}
                        {activeTab !== 'inventario' && (
                            <div className="flex flex-wrap items-center gap-2">
                                {[
                                    { id: 'today', label: 'Hoy' },
                                    { id: 'week', label: 'Esta Semana' },
                                    { id: 'month', label: 'Este Mes' },
                                    { id: 'custom', label: 'Personalizado' },
                                ].map(filter => (
                                    <button
                                        key={filter.id}
                                        onClick={() => setDateFilter(filter.id)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${dateFilter === filter.id
                                                ? 'bg-black text-white'
                                                : 'text-gray-500 hover:bg-gray-100 hover:text-black'
                                            }`}
                                    >
                                        {filter.label}
                                    </button>
                                ))}

                                {dateFilter === 'custom' && (
                                    <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
                                        <input
                                            type="date"
                                            value={customRange.start}
                                            onChange={(e) => setCustomRange({ ...customRange, start: e.target.value })}
                                            className="px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs focus:ring-1 focus:ring-black outline-none"
                                        />
                                        <span className="text-gray-400 text-xs">-</span>
                                        <input
                                            type="date"
                                            value={customRange.end}
                                            onChange={(e) => setCustomRange({ ...customRange, end: e.target.value })}
                                            className="px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs focus:ring-1 focus:ring-black outline-none"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => exportToExcel(activeTab)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-xl font-bold text-sm transition-colors"
                        >
                            <FileSpreadsheet size={18} /> Excel
                        </button>
                        <button
                            onClick={() => exportToPDF(activeTab)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl font-bold text-sm transition-colors"
                        >
                            <FileText size={18} /> PDF
                        </button>
                    </div>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                {activeTab === 'ventas' && (
                                    <>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Fecha</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Cliente</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Producto</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Monto</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Pago</th>
                                    </>
                                )}
                                {activeTab === 'inventario' && (
                                    <>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Modelo</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Nombre</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Stock</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Precio Unit.</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Valor Total</th>
                                    </>
                                )}
                                {activeTab === 'leads' && (
                                    <>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Fecha</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Nombre</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Email</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Ciudad</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Estado</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {activeTab === 'ventas' && data.ventas.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-600">{new Date(item.fecha_venta).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{item.cliente_nombre}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{item.producto}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{currency.format(item.monto)}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-600 uppercase">{item.metodo_pago}</span>
                                    </td>
                                </tr>
                            ))}

                            {activeTab === 'inventario' && data.inventario.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-600">{item.modelo_codigo}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{item.nombre}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-lg text-xs font-bold 
                                            ${item.stock > 5 ? 'bg-green-100 text-green-700' :
                                                item.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                            {item.stock} Unidades
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{currency.format(item.precio)}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{currency.format(item.precio * item.stock)}</td>
                                </tr>
                            ))}

                            {activeTab === 'leads' && data.leads.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-600">{new Date(item.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{item.nombre}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{item.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{item.ciudad || '-'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-lg text-xs font-bold uppercase
                                            ${item.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-700' :
                                                item.estado === 'vendido' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {item.estado}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Empty States */}
                    {activeTab === 'ventas' && data.ventas.length === 0 && (
                        <div className="p-12 text-center text-gray-400">No hay ventas registradas.</div>
                    )}
                    {activeTab === 'inventario' && data.inventario.length === 0 && (
                        <div className="p-12 text-center text-gray-400">Inventario vacío.</div>
                    )}
                    {activeTab === 'leads' && data.leads.length === 0 && (
                        <div className="p-12 text-center text-gray-400">No hay leads registrados.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reportes;
