import React, { useEffect, useState } from "react";
import { getGeneralStats, getSalesTimeline, getLeadsDistribution } from "../../../services/Reportes.service";
import { APP_CONFIG } from "../../../config";
import Swal from "sweetalert2";
import {
  BarChart3,
  TrendingUp,
  Users,
  ArrowUpRight,
  Wallet,
  Activity,
  AlertCircle,
  Settings,
  Save,
  Phone
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Pie,
  PieChart,
  Legend
} from 'recharts';

/**
 * Page: Dashboard
 * Description: Premium Analytics with Recharts and Config.
 */
const Dashboard = () => {
  const [stats, setStats] = useState({
    totalVentas: 0,
    totalSolicitudes: 0,
    ingresosTotales: 0,
  });
  const [salesData, setSalesData] = useState([]);
  const [leadsData, setLeadsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Config State
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState(
    localStorage.getItem("whatsapp_number") || APP_CONFIG.WHATSAPP_NUMBER
  );

  // Date Filter State
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
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const range = getDateRange();
        const [general, timeline, distribution] = await Promise.all([
          getGeneralStats(range),
          getSalesTimeline(range),
          getLeadsDistribution(range)
        ]);
        setStats(general);
        setSalesData(timeline);
        setLeadsData(distribution);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [dateFilter, customRange.start, customRange.end]);

  const handleSaveConfig = () => {
    localStorage.setItem("whatsapp_number", whatsappNumber);
    setIsConfigOpen(false);
    Swal.fire({
      icon: 'success',
      title: 'Configuración Guardada',
      text: 'El número de WhatsApp ha sido actualizado. Recarga la página para ver los cambios en el Header.',
      confirmButtonColor: '#000'
    }).then(() => {
      window.location.reload(); // Reload to update Header
    });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
    </div>
  );

  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black text-white p-3 rounded-xl shadow-xl border border-gray-800">
          <p className="text-xs text-gray-400 mb-1">{label}</p>
          <p className="text-lg font-bold">
            {payload[0].name === 'total'
              ? currency.format(payload[0].value)
              : payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-8 space-y-10 bg-gray-50/50 min-h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Resumen</h1>
          <p className="text-gray-500 mt-2 font-medium">Bienvenido de vuelta, Admin.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white px-5 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-sm border border-gray-100">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>Sistema en línea</span>
          </div>
          <button
            onClick={() => setIsConfigOpen(true)}
            className="bg-black text-white p-2.5 rounded-full hover:bg-gray-800 transition-colors shadow-lg shadow-black/20"
            title="Configuración"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>


      {/* Date Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 max-w-fit">
        {[
          { id: 'today', label: 'Hoy' },
          { id: 'week', label: 'Esta Semana' },
          { id: 'month', label: 'Este Mes' },
          { id: 'custom', label: 'Personalizado' },
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setDateFilter(filter.id)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${dateFilter === filter.id
              ? 'bg-black text-white shadow-md'
              : 'text-gray-500 hover:bg-gray-50 hover:text-black'
              }`}
          >
            {filter.label}
          </button>
        ))}

        {dateFilter === 'custom' && (
          <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200 animate-in fade-in slide-in-from-left-4">
            <input
              type="date"
              value={customRange.start}
              onChange={(e) => setCustomRange({ ...customRange, start: e.target.value })}
              className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-black outline-none"
            />
            <span className="text-gray-400">-</span>
            <input
              type="date"
              value={customRange.end}
              onChange={(e) => setCustomRange({ ...customRange, end: e.target.value })}
              className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-black outline-none"
            />
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Revenue */}
        <div className="bg-[#1a1a1a] p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-yellow-400/20" />
          <div className="relative z-10 flex flex-col h-full justify-between gap-6">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <Wallet className="text-yellow-400" size={24} />
              </div>
              <span className="flex items-center gap-1 text-green-400 text-xs font-bold bg-green-400/10 px-2 py-1 rounded-lg">
                <TrendingUp size={14} /> KPI
              </span>
            </div>
            <div>
              <p className="text-gray-400 font-medium text-sm uppercase tracking-wider">Ingresos Totales</p>
              <h3 className="text-4xl lg:text-5xl font-black text-white mt-2">{currency.format(stats.ingresosTotales)}</h3>
            </div>
          </div>
        </div>

        {/* Sales */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div className="relative z-10 flex flex-col h-full justify-between gap-6">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                <BarChart3 size={24} />
              </div>
            </div>
            <div>
              <p className="text-gray-500 font-bold text-sm uppercase tracking-wider">Ventas Cerradas</p>
              <h3 className="text-4xl lg:text-5xl font-black text-gray-900 mt-2">{stats.totalVentas}</h3>
            </div>
          </div>
        </div>

        {/* Leads */}
        <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-8 rounded-[2rem] shadow-xl shadow-yellow-400/20 relative overflow-hidden group">
          <div className="relative z-10 flex flex-col h-full justify-between gap-6">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-black/10 rounded-2xl text-black backdrop-blur-md">
                <Users size={24} />
              </div>
            </div>
            <div>
              <p className="text-black/60 font-black text-sm uppercase tracking-wider">Prospectos Totales</p>
              <h3 className="text-4xl lg:text-5xl font-black text-black mt-2">{stats.totalSolicitudes}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Sales Timeline (Area Chart) */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Tendencia de Ventas</h3>
              <p className="text-gray-500 text-sm">Historial de ingresos por período.</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg">
              <Activity size={20} className="text-gray-400" />
            </div>
          </div>

          <div className="flex-1 w-full min-h-[300px]">
            {salesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FACC15" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#FACC15" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#EAB308"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorSales)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2 border-2 border-dashed border-gray-100 rounded-2xl p-6">
                <BarChart3 size={48} className="opacity-20" />
                <p className="font-medium text-sm">Aún no hay datos de ventas para mostrar</p>
                <p className="text-xs">Registra tu primera venta para ver la tendencia.</p>
              </div>
            )}
          </div>
        </div>

        {/* Leads Distribution (Donut Chart) */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900">Distribución de Leads</h3>
            <p className="text-gray-500 text-sm">Estado actual de tus prospectos.</p>
          </div>

          <div className="flex-1 w-full min-h-[300px] relative">
            {leadsData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                  <RechartsPieChart>
                    <Pie
                      data={leadsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {leadsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      formatter={(value, entry) => (
                        <span className="text-sm font-medium text-gray-600 ml-2">{value}</span>
                      )}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-12">
                  <span className="text-3xl font-black text-gray-900">
                    {leadsData.reduce((acc, curr) => acc + curr.value, 0)}
                  </span>
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total</span>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2 border-2 border-dashed border-gray-100 rounded-2xl p-6">
                <AlertCircle size={48} className="opacity-20" />
                <p className="font-medium text-sm">No hay leads registrados</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Config Modal */}
      {
        isConfigOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden p-6 space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings size={32} className="text-yellow-600" />
                </div>
                <h2 className="text-2xl font-black text-gray-900">Configuración</h2>
                <p className="text-gray-500 text-sm">Ajustes generales del sistema.</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                  Número de WhatsApp (Header)
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-3.5 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none font-medium"
                    placeholder="+51..."
                  />
                </div>
                <p className="text-xs text-gray-400 pl-1">
                  Este número se usará en el botón "Consulta" del menú principal.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsConfigOpen(false)}
                  className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveConfig}
                  className="flex-1 py-3 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-black/20 flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

// Wrapper because PieChart name conflict with Lucide
const RechartsPieChart = ({ children }) => (
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      {children}
    </PieChart>
  </ResponsiveContainer>
);

export default Dashboard;