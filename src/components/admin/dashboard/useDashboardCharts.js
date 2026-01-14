// src/components/admin/dashboard/useDashboardCharts.js
import { useEffect } from "react";
import Chart from "chart.js/auto";

export default function useDashboardCharts({
  totalPedidosRef,
  nuevosUsuariosRef,
  consultasPendientesRef,
  ventasMesRef,
  salesChartRef,
  modelPopularityRef,
  charts: chartData,
}) {
  useEffect(() => {

    // Validación
    if (
      !totalPedidosRef.current ||
      !nuevosUsuariosRef.current ||
      !consultasPendientesRef.current ||
      !ventasMesRef.current ||
      !salesChartRef.current ||
      !modelPopularityRef.current
    ) {
      console.warn("Canvas aún no disponible");
      return;
    }

    const isDarkMode = document.documentElement.classList.contains("dark");
    const gridColor = isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
    const textColor = isDarkMode ? "#f9fafb" : "#111827";

    const miniChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: { x: { display: false }, y: { display: false } },
      elements: { point: { radius: 0 } },
    };

    const instances = [];

    const labels = chartData?.labels?.length ? chartData.labels : ["Ene", "Feb", "Mar", "Abr", "May", "Jun"];
    const ventasData = chartData?.ventas?.length ? chartData.ventas : [0, 0, 0, 0, 0, 0];
    const pedidosData = chartData?.pedidos?.length ? chartData.pedidos : [0, 0, 0, 0, 0, 0];

    // Mini chart – pedidos
    instances.push(
      new Chart(totalPedidosRef.current, {
        type: "line",
        data: {
          labels,
          datasets: [{
            data: pedidosData,
            borderColor: "#f27f0d",
            backgroundColor: "rgba(242,127,13,0.1)",
            fill: true,
            tension: 0.4,
          }],
        },
        options: miniChartOptions,
      })
    );

    // Mini chart – nuevos usuarios
    instances.push(
      new Chart(nuevosUsuariosRef.current, {
        type: "bar",
        data: {
          labels,
          datasets: [{
            data: pedidosData.map((value) => Math.max(1, Math.round(value / 2))),
            backgroundColor: isDarkMode ? "#ffe5cf" : "#f27f0d",
            borderRadius: 4,
          }],
        },
        options: miniChartOptions,
      })
    );

    // Mini chart – consultas pendientes
    instances.push(
      new Chart(consultasPendientesRef.current, {
        type: "line",
        data: {
          labels,
          datasets: [{
            data: ventasData.map((value) => Math.max(0, Math.round(value / 500))),
            borderColor: isDarkMode ? "#fff" : "#4b5563",
            tension: 0.4,
          }],
        },
        options: miniChartOptions,
      })
    );

    // Mini chart – ventas
    instances.push(
      new Chart(ventasMesRef.current, {
        type: "line",
        data: {
          labels,
          datasets: [{
            data: ventasData,
            borderColor: "#f27f0d",
            backgroundColor: "rgba(242,127,13,0.1)",
            fill: true,
            tension: 0.4,
          }],
        },
        options: miniChartOptions,
      })
    );

    // Main chart – sales
    instances.push(
      new Chart(salesChartRef.current, {
        type: "line",
        data: {
          labels,
          datasets: [{
            label: "Ventas ($)",
            data: ventasData,
            borderColor: "#f27f0d",
            backgroundColor: "rgba(242,127,13,0.1)",
            fill: true,
            tension: 0.4,
          }],
        },
        options: {
          plugins: { legend: { display: false } },
          scales: {
            y: { ticks: { color: textColor }, grid: { color: gridColor } },
            x: { ticks: { color: textColor }, grid: { color: gridColor } },
          },
        },
      })
    );

    // Doughnut chart
    instances.push(
      new Chart(modelPopularityRef.current, {
        type: "doughnut",
        data: {
          labels,
          datasets: [{
            data: pedidosData.length ? pedidosData : [0, 0, 0, 0],
            backgroundColor: ["#f27f0d", "#f9a14a", "#fcc28c", "#ffe5cf"],
          }],
        },
        options: {
          plugins: {
            legend: {
              position: "bottom",
              labels: { color: textColor, boxWidth: 12, padding: 20 },
            },
          },
        },
      })
    );

    return () => instances.forEach((chart) => chart.destroy());
  }, [
    chartData,
    totalPedidosRef,
    nuevosUsuariosRef,
    consultasPendientesRef,
    ventasMesRef,
    salesChartRef,
    modelPopularityRef,
  ]);
}
