import React, { useEffect, useState } from "react";
import {
    Bike,
    Wrench,
    Settings,
    RefreshCcw,
    Package,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getTotalUnidadesMotos } from "../../../services/motos.service";
import { getTotalUnidadesRepuestos } from "../../../services/Repuestos.service";

const SeleccionInventarios = () => {
    const [totalMotos, setTotalMotos] = useState(0);
    const [totalRepuestos, setTotalRepuestos] = useState(0);

    useEffect(() => {
        const cargarTotal = async () => {
            try {
                const [totalMotosValue, totalRepuestosValue] = await Promise.all([
                    getTotalUnidadesMotos(),
                    getTotalUnidadesRepuestos(),
                ]);
                setTotalMotos(totalMotosValue);
                setTotalRepuestos(totalRepuestosValue);
            } catch (e) {
                console.error("Error al cargar totales de inventario", e);
            }
        };
        cargarTotal();
    }, []);

    const secciones = [
        {
            id: "motos",
            titulo: "Motos",
            descripcion:
                "Gestión integral de modelos, fichas técnicas, galería de medios y precios premium.",
            icon: <Bike size={64} />,
            actionIcon: <Settings size={14} />,
            link: "/admin/inventarios/gestion_motos",
        },
        {
            id: "repuestos",
            titulo: "Repuestos",
            descripcion:
                "Control de stock de piezas originales, componentes mecánicos y accesorios de mantenimiento.",
            icon: <Wrench size={64} />,
            actionIcon: <RefreshCcw size={14} />,
            link: "/admin/inventario",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-10">
            <div className="max-w-7xl mx-auto space-y-16">

                {/* Header */}
                <div className="space-y-4">
                    <h1 className="text-5xl font-black text-slate-900">
                        Selección de <span className="text-yellow-400 italic">Inventario</span>
                    </h1>
                    <p className="text-slate-500 max-w-xl text-sm">
                        Accede a los módulos de gestión con visualización avanzada.
                    </p>
                    <div className="w-24 h-1.5 bg-yellow-400 rounded-full" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg">
                        <span className="text-[9px] uppercase tracking-[0.25em] text-slate-400 font-black">
                            Total De Motos En Stock
                        </span>
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-3xl font-black text-slate-900">
                                {totalMotos}
                            </span>
                            <div className="p-3 rounded-2xl bg-yellow-50 text-yellow-500">
                                <Bike size={22} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg">
                        <span className="text-[9px] uppercase tracking-[0.25em] text-slate-400 font-black">
                            Total Unidades Repuestos
                        </span>
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-3xl font-black text-slate-900">
                                {totalRepuestos}
                            </span>
                            <div className="p-3 rounded-2xl bg-slate-50 text-slate-500">
                                <Package size={22} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {secciones.map((sec) => (
                        <div
                            key={sec.id}
                            className="rounded-[3rem] bg-white p-14 text-center shadow-2xl hover:-translate-y-2 transition-all"
                        >
                            <div className="w-32 h-32 mx-auto mb-10 rounded-full bg-slate-100 flex items-center justify-center">
                                {sec.icon}
                            </div>

                            <h2 className="text-3xl font-black mb-4">
                                {sec.titulo}
                            </h2>

                            <p className="text-xs text-slate-500 max-w-xs mx-auto mb-10">
                                {sec.descripcion}
                            </p>

                            <Link
                                to={sec.link}
                                className="inline-flex items-center gap-3 bg-yellow-400 hover:bg-yellow-500 px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                                <span className="bg-black/20 p-1.5 rounded-md">
                                    {sec.actionIcon}
                                </span>
                                Gestionar Inventario
                            </Link>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default SeleccionInventarios;
