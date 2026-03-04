import React, { useState } from "react";
import Swal from "sweetalert2";
import { useMotos } from "../../../hooks/useMotos";
import { PlusCircle, Save } from "lucide-react";
import Landing from "../../ui/Landing";

const input =
    "w-full rounded-2xl border border-transparent bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none ring-1 ring-slate-200 focus:bg-white focus:ring-emerald-400 transition-all duration-200";

const label =
    "block text-sm font-semibold text-slate-600 mb-1";

const getInitialForm = (ofertaExistente) => ({
    titulo: ofertaExistente?.titulo || "",
    descripcion: ofertaExistente?.descripcion || "",
    textoboton: ofertaExistente?.textoboton || "Comprar",
    imagen_url: ofertaExistente?.imagen_url || "",
    descuento: ofertaExistente?.descuento || 0,
    moto_id: ofertaExistente?.moto_id || "",
    precio_original: ofertaExistente?.precio_original || 0,
    precio_especial: ofertaExistente?.precio_especial || 0,
    expiracion: ofertaExistente?.expiracion || "",
    moto_seleccionada: ofertaExistente?.moto_seleccionada || "",
});

const OfertaForm = ({ onSubmit, ofertaExistente }) => {
    const { motos, loading: loadingMotos } = useMotos();
    const [form, setForm] = useState(() => getInitialForm(ofertaExistente));

    const handleChange = (e) => {
        const { name, value } = e.target;
        let updated = { ...form, [name]: value };

        if (name === "moto_id") {
            const moto = motos.find((m) => m.id === value);
            if (moto) {
                updated.imagen_url = moto.imagen_url || "";
                updated.precio_original = Number(moto.precio);
                updated.moto_seleccionada = moto.nombre;
                updated.precio_especial = +(
                    moto.precio * (1 - updated.descuento / 100)
                ).toFixed(2);
            }
        }

        if (name === "descuento") {
            updated.precio_especial = +(
                updated.precio_original * (1 - value / 100)
            ).toFixed(2);
        }

        setForm(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await Swal.fire({
            title: ofertaExistente ? "¿Actualizar oferta?" : "¿Crear oferta?",
            text: ofertaExistente
                ? "Los cambios se guardarán."
                : "La oferta será publicada.",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#059669",
            cancelButtonColor: "#64748b",
            confirmButtonText: ofertaExistente ? "Actualizar" : "Crear",
            cancelButtonText: "Cancelar",
        });

        if (!result.isConfirmed) return;

        await onSubmit({
            ...form,
            descuento: Number(form.descuento),
            precio_original: Number(form.precio_original),
            precio_especial: Number(form.precio_especial),
            expiracion: new Date(form.expiracion).toISOString(),
        });

        Swal.fire({
            icon: "success",
            title: ofertaExistente ? "Actualizada" : "Creada",
            timer: 1600,
            showConfirmButton: false,
        });
    };

    if (loadingMotos) {
        return <Landing/>;
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-[28px] p-7 space-y-5 border border-slate-100 shadow-lg shadow-slate-200/40"
        >
            <div>
                <label htmlFor="oferta-titulo" className={label}>Título</label>
                <input id="oferta-titulo" name="titulo" value={form.titulo} onChange={handleChange} className={input} required />
            </div>

            <div>
                <label htmlFor="oferta-descripcion" className={label}>Descripción</label>
                <textarea id="oferta-descripcion" name="descripcion" value={form.descripcion} onChange={handleChange} className={input} rows={3} required />
            </div>

            <div>
                <label htmlFor="oferta-boton" className={label}>Texto del botón</label>
                <input id="oferta-boton" name="textoboton" value={form.textoboton} onChange={handleChange} className={input} />
            </div>

            <div>
                <label htmlFor="oferta-moto" className={label}>Moto</label>
                <select id="oferta-moto" name="moto_id" value={form.moto_id} onChange={handleChange} className={input} required>
                    <option value="">Seleccionar moto</option>
                    {motos.map((m) => (
                        <option key={m.id} value={m.id}>
                            {m.nombre} — S/. {m.precio}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="oferta-imagen" className={label}>Imagen</label>
                <input id="oferta-imagen" value={form.imagen_url} readOnly className={`${input} bg-slate-100`} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="oferta-precio-original" className={label}>Precio original</label>
                    <input id="oferta-precio-original" value={form.precio_original} readOnly className={`${input} bg-slate-100`} />
                </div>

                <div>
                    <label htmlFor="oferta-descuento" className={label}>Descuento (%)</label>
                    <input id="oferta-descuento" type="number" name="descuento" value={form.descuento} onChange={handleChange} className={input} min={0} max={100} />
                </div>
            </div>

            <div>
                <label htmlFor="oferta-precio-especial" className={label}>Precio especial</label>
                <input id="oferta-precio-especial" value={form.precio_especial} readOnly className={`${input} bg-emerald-50 ring-emerald-300`} />
            </div>

            <div>
                <label htmlFor="oferta-expiracion" className={label}>Expiración</label>
                <input id="oferta-expiracion" type="datetime-local" name="expiracion" value={form.expiracion} onChange={handleChange} className={input} required />
            </div>

            <button
                type="submit"
                className="w-full mt-6 flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white py-3 rounded-2xl font-extrabold shadow-lg hover:shadow-emerald-300/40 hover:opacity-95 transition"
            >
                {ofertaExistente ? (
                    <>
                        <Save size={22} />
                        Actualizar oferta
                    </>
                ) : (
                    <>
                        <PlusCircle size={22} />
                        Crear oferta
                    </>
                )}
            </button>
        </form>
    );
};

export default OfertaForm;
