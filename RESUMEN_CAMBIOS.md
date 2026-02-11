# 📋 Resumen de Cambios - Land Roys V3

Este documento detalla todas las nuevas características, mejoras y modificaciones técnicas realizadas en la aplicación.

## 🚀 Nuevas Funcionalidades

### 1. Sistema de Reportes Avanzado (`Reportes.jsx`)
Se creó un módulo de reportes completamente nuevo que incluye:
-   **Pestañas Temáticas**: Navegación entre *Ventas*, *Inventario* y *Leads*.
-   **Exportación de Datos**:
    -   📄 **PDF**: Generación de reportes formales listos para imprimir.
    -   📊 **Excel**: Descarga de bases de datos completas para análisis.
-   **Filtros Inteligentes**: Barra de herramientas para filtrar datos por *Hoy*, *Esta Semana*, *Este Mes* o *Rango Personalizado*.

### 2. Dashboard Interactivo (`Dashboard.jsx`)
-   **Filtros de Fecha**: Se implementó el control de tiempos para que todos los gráficos y KPIs (Ingresos, Ventas, Leads) reaccionen al periodo seleccionado.
-   **Configuración Rápida**: Botón de engranaje ⚙️ para cambiar el número de WhatsApp del negocio sin necesidad de tocar el código.

### 3. Módulo de Ventas con Descuentos (`Clientes.jsx`)
Se mejoró el proceso de cierre de venta:
-   **Descuentos**: Ahora es posible aplicar descuentos por porcentaje (%) o monto fijo ($).
-   **Cálculos Automáticos**: El sistema calcula el *Precio Final* al instante.
-   **Auditoría**: El precio original y el descuento quedan registrados en las notas de la venta.
-   **Control de Stock**: Validación estricta que impide vender productos sin inventario y descuenta automáticamente la unidad vendida.

---

## 🛠️ Cambios Técnicos y Código

### Archivos Nuevos y Modificados

| Archivo | Tipo | Descripción del Cambio |
| :--- | :--- | :--- |
| `src/pages/admin/reportes/Reportes.jsx` | ✨ Nuevo | Lógica completa de tablas, filtros y exportación. |
| `src/pages/admin/dashboard/Dashboard.jsx` | ⚡ Modificado | Integración de filtros de fecha y modal de config. |
| `src/pages/admin/clientes/Clientes.jsx` | ⚡ Modificado | Lógica de cálculo de descuentos y validación de stock. |
| `src/services/Reportes.service.js` | ⚙️ Backend | Consultas SQL dinámicas recibiendo `startDate` y `endDate`. |
| `src/components/common/Header.jsx` | 🎨 UI | Lectura dinámica de configuración (Teléfono). |

### Base de Datos (Lógica Aplicada)

No se requirieron cambios estructurales (nuevas tablas), pero sí lógica de gestión:

1.  **Ventas (`ventas`)**:
    -   El campo `monto` ahora almacena el valor real de la transacción (con descuento).
    -   El historial de precios se guarda en texto dentro de `notas`.
2.  **Inventario (`motos`)**:
    -   Actualización atómica: `stock = stock - 1` al confirmar venta.

### Librerías Integradas
Se añadieron las siguientes dependencias al proyecto (`package.json`):
-   `jspdf` & `jspdf-autotable`: Para generación de PDFs.
-   `xlsx`: Para exportación a Excel.
-   `lucide-react`: Iconografía del sistema.

---

> **Nota**: Para ver los reportes funcionando, asegúrate de tener datos cargados en el rango de fechas seleccionado.
