import React, { useEffect, useRef, useState } from "react";
import useDashboardCharts from "./useDashboardCharts";
import CardAdmin from "./CardAdmin";
import "./Dashboard.css";
import ConsultasTable from "./ConsultasTable";
import { fetchDashboardMetrics } from "../../../services/dashboardService";

export default function Dashboard() {
  // Referencias
  const totalPedidosRef = useRef(null);
  const nuevosUsuariosRef = useRef(null);
  const consultasPendientesRef = useRef(null);
  const ventasMesRef = useRef(null);
  const salesChartRef = useRef(null);
  const modelPopularityRef = useRef(null);

  const [metrics, setMetrics] = useState({
    totals: {
      totalPedidos: 0,
      nuevosUsuarios: 0,
      consultasPendientes: 0,
      ventasMes: 0,
      totalConsultas: 0,
    },
    charts: {
      labels: [],
      ventas: [],
      pedidos: [],
    },
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const data = await fetchDashboardMetrics();
        setMetrics(data);
      } catch (error) {
        console.error("Error loading dashboard metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, []);

  // Hook separado
  useDashboardCharts({
    totalPedidosRef,
    nuevosUsuariosRef,
    consultasPendientesRef,
    ventasMesRef,
    salesChartRef,
    modelPopularityRef,
    charts: metrics.charts,
  });

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
      <div className="mx-auto max-w-7xl">

        {/* TÍTULO */}
        <div className="pb-8">
          <p className="text-3xl font-black text-gray-900 ">
            Panel Principal
          </p>
          <p className="text-base text-gray-500 dark:text-gray-400">
            Bienvenido, aquí tienes un resumen general.
          </p>
        </div>

        {/* TARJETAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <CardAdmin
            title="Total Pedidos"
            value={metrics.totals.totalPedidos.toLocaleString("es-PE")}
            change={loading ? "Cargando métricas..." : "Actualizado en tiempo real"}
            positive
          >
            <canvas ref={totalPedidosRef}></canvas>
          </CardAdmin>

          <CardAdmin
            title="Nuevos Usuarios"
            value={metrics.totals.nuevosUsuarios.toLocaleString("es-PE")}
            change={loading ? "Cargando métricas..." : "Usuarios registrados"}
            positive
          >
            <canvas ref={nuevosUsuariosRef}></canvas>
          </CardAdmin>

          <CardAdmin
            title="Consultas Pendientes"
            value={metrics.totals.consultasPendientes.toLocaleString("es-PE")}
            change={loading ? "Cargando métricas..." : `${metrics.totals.totalConsultas} consultas totales`}
            positive={false}
          >
            <canvas ref={consultasPendientesRef}></canvas>
          </CardAdmin>

          <CardAdmin
            title="Ventas del Mes"
            value={`S/ ${metrics.totals.ventasMes.toLocaleString("es-PE")}`}
            change={loading ? "Cargando métricas..." : "Basado en pedidos registrados"}
            positive
          >
            <canvas ref={ventasMesRef}></canvas>
          </CardAdmin>

        </div>

        {/* GRÁFICOS PRINCIPALES */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card-admin lg:col-span-2">
            <h2 className="chart-title">Tendencia de Ventas</h2>
            <canvas ref={salesChartRef}></canvas>
          </div>

          <div className="card-admin">
            <h2 className="chart-title">Popularidad de Modelos</h2>
            <canvas ref={modelPopularityRef}></canvas>
          </div>
        </div>
        
        <ConsultasTable />
      </div>
    </main>
  );
}
