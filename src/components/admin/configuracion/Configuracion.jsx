import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { fetchSettings, upsertSettings } from "../../../services/settingsService";

const initialState = {
  site_title: "",
  contact_email: "",
  contact_phone: "",
  whatsapp: "",
  address: "",
};

const Configuracion = () => {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await fetchSettings();
        if (data) {
          setFormData({
            site_title: data.site_title ?? "",
            contact_email: data.contact_email ?? "",
            contact_phone: data.contact_phone ?? "",
            whatsapp: data.whatsapp ?? "",
            address: data.address ?? "",
          });
        }
      } catch (error) {
        console.error("Error loading settings:", error);
        Swal.fire("Error", "No se pudo cargar la configuración", "error");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.site_title.trim()) {
      Swal.fire("Error", "El título del sitio es obligatorio.", "error");
      return false;
    }
    if (!formData.contact_email.trim()) {
      Swal.fire("Error", "El correo de contacto es obligatorio.", "error");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) {
      Swal.fire("Error", "Ingresa un correo válido.", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      const { error } = await upsertSettings(formData);
      if (error) throw error;
      Swal.fire("Guardado", "Configuración actualizada", "success");
    } catch (error) {
      console.error("Error saving settings:", error);
      Swal.fire("Error", error.message || "No se pudo guardar", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Cargando configuración...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuración</h1>
      <p className="text-gray-500 mb-8">Ajusta la información pública del sitio y canales de contacto.</p>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Título del sitio</label>
          <input
            type="text"
            name="site_title"
            value={formData.site_title}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none text-gray-900"
            placeholder="Land Roys"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Correo de contacto</label>
          <input
            type="email"
            name="contact_email"
            value={formData.contact_email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none text-gray-900"
            placeholder="contacto@landroys.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
          <input
            type="text"
            name="contact_phone"
            value={formData.contact_phone}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none text-gray-900"
            placeholder="+51 999 888 777"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
          <input
            type="text"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none text-gray-900"
            placeholder="+51 999 888 777"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none text-gray-900 resize-none"
            placeholder="Av. Principal 123, Lima"
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition"
            disabled={saving}
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Configuracion;
