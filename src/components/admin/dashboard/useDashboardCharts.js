// src/components/admin/dashboard/useDashboardCharts.js
import { useEffect } from "react";
import Chart from "chart.js/auto";

export default function useDashboardCharts(refs) {
  useEffect(() => {
    const {
      totalPedidosRef,
      nuevosUsuariosRef,
      consultasPendientesRef,
      ventasMesRef,
      salesChartRef,
      modelPopularityRef
    } = refs;

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

    const charts = [];

    // Mini chart – pedidos
    charts.push(
      new Chart(totalPedidosRef.current, {
        type: "line",
        data: {
          labels: ["1","2","3","4","5","6","7"],
          datasets: [{
            data: [65, 59, 80, 81, 56, 55, 90],
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
    charts.push(
      new Chart(nuevosUsuariosRef.current, {
        type: "bar",
        data: {
          labels: ["1","2","3","4","5","6","7"],
          datasets: [{
            data: [20, 30, 45, 40, 50, 65, 88],
            backgroundColor: isDarkMode ? "#ffe5cf" : "#f27f0d",
            borderRadius: 4,
          }],
        },
        options: miniChartOptions,
      })
    );

    // Mini chart – consultas pendientes
    charts.push(
      new Chart(consultasPendientesRef.current, {
        type: "line",
        data: {
          labels: ["1","2","3","4","5","6","7"],
          datasets: [{
            data: [15, 18, 14, 16, 13, 11, 12],
            borderColor: isDarkMode ? "#fff" : "#4b5563",
            tension: 0.4,
          }],
        },
        options: miniChartOptions,
      })
    );

    // Mini chart – ventas
    charts.push(
      new Chart(ventasMesRef.current, {
        type: "line",
        data: {
          labels: ["1","2","3","4","5","6","7"],
          datasets: [{
            data: [10000,15000,12000,25000,30000,38000,45678],
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
    charts.push(
      new Chart(salesChartRef.current, {
        type: "line",
        data: {
          labels: ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],
          datasets: [{
            label: "Ventas ($)",
            data: [22000,25000,31000,35000,32000,38000,41000,45678,43000,47000,51000,55000],
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
    charts.push(
      new Chart(modelPopularityRef.current, {
        type: "doughnut",
        data: {
          labels: ["Scrambler 400X", "Adventure Pro", "Urban Classic", "Café Racer"],
          datasets: [{
            data: [300,150,220,180],
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

    return () => charts.forEach((chart) => chart.destroy());
  }, []);
}
