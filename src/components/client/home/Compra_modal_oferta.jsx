import React, { useState } from "react";
import {
    X,
    MessageCircle,
    Lock,
    CreditCard,
    ShieldCheck,
    Headphones,
    Eye,
} from "lucide-react";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

const Compra_modal_oferta = ({ open, onClose, oferta }) => {
    const [nombre, setNombre] = useState("");
    const [telefono, setTelefono] = useState("");
    const [email, setEmail] = useState("");
    const [verMensaje, setVerMensaje] = useState(false);

    if (!open || !oferta) return null;

    const mensajePlano = `Hola, estoy interesado en esta oferta:

=== ${oferta.titulo} ===

Precio oferta: S/ ${oferta.precio_especial}
Precio normal: S/ ${oferta.precio_original}
Descuento: ${oferta.descuento}%

Nombre: ${nombre || "No especificado"}
Teléfono: ${telefono || "No especificado"}
Email: ${email || "No especificado"}

¿Sigue disponible?`;

    const mensajeWhatsapp = encodeURIComponent(mensajePlano);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-2">
            <div className="relative bg-white w-full max-w-xl max-h-[90vh] rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">

                {/* HEADER */}
                <div className="flex justify-between items-center px-8 py-5 border-b bg-white shrink-0">
                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                        Consulta de oferta
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-100 transition"
                    >
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                {/* BODY */}
                <div className="px-8 py-6 space-y-6 flex-1">

                    {/* RESUMEN */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em]">
                                    Oferta seleccionada
                                </span>
                                <h3 className="text-2xl font-black text-slate-900 leading-tight">
                                    {oferta.titulo}
                                </h3>
                            </div>

                            <span className="bg-gradient-to-r from-yellow-200 to-yellow-100 text-yellow-700 text-[10px] font-black px-3 py-1 rounded-xl uppercase shadow-sm">
                                -{oferta.descuento}% Descuento
                            </span>
                        </div>

                        <div className="bg-slate-50/70 border rounded-3xl p-5 flex justify-between items-center">
                            <div className="space-y-1">
                                <p className="text-[11px] font-bold text-slate-400 uppercase">
                                    Precio normal
                                </p>
                                <p className="text-sm font-bold text-slate-400 line-through">
                                    S/ {oferta.precio_original}
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="text-[11px] font-bold text-slate-400 uppercase">
                                    Precio oferta
                                </p>
                                <p className="text-3xl font-black text-yellow-400">
                                    S/ {oferta.precio_especial}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* DATOS */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">
                            Tus datos
                        </h4>

                        <input
                            type="text"
                            placeholder="Nombre completo"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Teléfono"
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                                className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                            />
                            <input
                                type="email"
                                placeholder="Correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                            />
                        </div>
                    </div>

                    {/* BENEFICIOS */}
                    <div className="grid grid-cols-2 gap-3 text-xs text-slate-500">
                        <div className="flex items-center gap-2"><ShieldCheck size={16} /> Pago seguro</div>
                        <div className="flex items-center gap-2"><Lock size={16} /> Datos protegidos</div>
                        <div className="flex items-center gap-2"><CreditCard size={16} /> Varias formas de pago</div>
                        <div className="flex items-center gap-2"><Headphones size={16} /> Atención personalizada</div>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="px-8 py-5 border-t bg-white shrink-0 space-y-3">
                    <button
                        onClick={() => setVerMensaje(true)}
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 transition"
                    >
                        <MessageCircle size={18} /> Continuar a WhatsApp
                    </button>

                    <p className="text-[10px] text-slate-400 text-center">
                        Al continuar aceptas recibir contacto para gestionar tu consulta.
                    </p>
                </div>

                {/* PREVIEW MENSAJE */}
                {verMensaje && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-5">
                        <div className="bg-white rounded-3xl p-5 w-full max-w-md shadow-xl space-y-4">
                            <h5 className="text-sm font-black text-slate-800 flex items-center gap-2">
                                <Eye size={16} /> Vista previa del mensaje
                            </h5>
                            <pre className="text-[11px] whitespace-pre-wrap bg-slate-50 border rounded-xl p-3 max-h-64 overflow-auto">
                                {mensajePlano}
                            </pre>

                            <div className="flex gap-2">
                                <button onClick={() => setVerMensaje(false)} className="flex-1 py-2 rounded-xl border text-sm font-bold">
                                    Cancelar
                                </button>
                                <a
                                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${mensajeWhatsapp}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 py-2 rounded-xl bg-green-500 text-white text-sm font-bold text-center"
                                >
                                    Enviar
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Compra_modal_oferta;
