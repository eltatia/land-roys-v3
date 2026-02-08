import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search, ShoppingCart, ChevronDown } from "lucide-react";
import Swal from "sweetalert2";
import { getRepuestos } from "../../../services/Repuestos.service";
import { getCategoriasRepuestos } from "../../../services/CategoriasRepuestos.service";

const currency = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const getCategoryLabel = (categories, key) => {
  if (key === "otros") return "Otros";
  return categories.find((cat) => cat.id === key)?.nombre || "Otros";
};

const Repuestos = () => {
  const [repuestos, setRepuestos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("recientes");
  const [estadoFiltro, setEstadoFiltro] = useState("all");
  const [soloStock, setSoloStock] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartVisible, setCartVisible] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [flyItems, setFlyItems] = useState([]);
  const cartButtonRef = useRef(null);
  const [customerForm, setCustomerForm] = useState({
    nombre: "",
    telefono: "",
    ciudad: "",
    direccion: "",
    notas: "",
  });
  const [imageFallback, setImageFallback] = useState({});
  const repuestoPlaceholder = "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=1200&auto=format&fit=crop";

  useEffect(() => {
    const fetchRepuestos = async () => {
      setLoading(true);
      try {
        const [repuestosData, categoriasData] = await Promise.all([getRepuestos(), getCategoriasRepuestos()]);
        setCategorias(categoriasData);
        const data = repuestosData;
        setRepuestos(data);
      } catch (error) {
        console.error("Error cargando repuestos:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los repuestos",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRepuestos();
  }, []);

  useEffect(() => {
    const storedCart = localStorage.getItem("repuestos_cart");
    if (storedCart) {
      try {
        const parsed = JSON.parse(storedCart);
        if (Array.isArray(parsed)) {
          setCartItems(parsed);
        }
      } catch {
        localStorage.removeItem("repuestos_cart");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("repuestos_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const categories = useMemo(() => {
    const base = [{ key: "all", label: "Todos" }, ...categorias.map((cat) => ({ key: cat.id, label: cat.nombre }))];
    if (repuestos.some((item) => !item.categoria_id)) {
      base.push({ key: "otros", label: "Otros" });
    }
    return base;
  }, [categorias, repuestos]);

  const categoriasById = useMemo(() => {
    return categorias.reduce((acc, categoria) => {
      acc[categoria.id] = categoria;
      return acc;
    }, {});
  }, [categorias]);

  const getCategoryKeyForItem = (item) => item.categoria_id || "otros";
  const getImageSrc = (item) => (imageFallback[item.id] ? repuestoPlaceholder : item.imagen_url || repuestoPlaceholder);

  const countsByCategory = useMemo(() => {
    const counts = repuestos.reduce((acc, item) => {
      const key = getCategoryKeyForItem(item);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    counts.all = repuestos.length;
    return counts;
  }, [repuestos]);

  const filteredRepuestos = useMemo(() => {
    const term = search.trim().toLowerCase();
    let data = [...repuestos];

    if (activeCategory !== "all") {
      data = data.filter((item) => getCategoryKeyForItem(item) === activeCategory);
    }

    if (estadoFiltro !== "all") {
      data = data.filter((item) => (item.estado || "").toLowerCase() === estadoFiltro);
    }

    if (soloStock) {
      data = data.filter((item) => Number(item.stock || 0) > 0);
    }

    if (term) {
      data = data.filter((item) =>
        [
          item.nombre,
          item.descripcion,
          categoriasById[item.categoria_id]?.nombre || item.categoria,
        ]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(term))
      );
    }

    if (sortOrder === "precio_asc") {
      data.sort((a, b) => Number(a.precio || 0) - Number(b.precio || 0));
    } else if (sortOrder === "precio_desc") {
      data.sort((a, b) => Number(b.precio || 0) - Number(a.precio || 0));
    }

    return data;
  }, [repuestos, activeCategory, estadoFiltro, soloStock, search, sortOrder, categoriasById]);

  const cartTotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + Number(item.precio || 0) * item.cantidad, 0),
    [cartItems]
  );

  const updateCartItem = (item, change = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((entry) => entry.id === item.id);
      if (!existing) {
        return [...prev, { ...item, cantidad: 1 }];
      }
      return prev.map((entry) =>
        entry.id === item.id ? { ...entry, cantidad: Math.max(1, entry.cantidad + change) } : entry
      );
    });
  };

  const removeCartItem = (id) => {
    setCartItems((prev) => prev.filter((entry) => entry.id !== id));
  };

  const handleAddToCart = (item, sourceRect) => {
    const cartRect = cartButtonRef.current?.getBoundingClientRect();
    if (cartRect) {
      if (sourceRect) {
        const flyId = crypto.randomUUID();
        setFlyItems((prev) => [
          ...prev,
          {
            id: flyId,
            image: item.imagen_url,
            startX: sourceRect.left,
            startY: sourceRect.top,
            endX: cartRect.left + cartRect.width / 2,
            endY: cartRect.top + cartRect.height / 2,
          },
        ]);
        setTimeout(() => {
          setFlyItems((prev) => prev.filter((fly) => fly.id !== flyId));
        }, 700);
      }
    }
    updateCartItem(item, 1);
    setCartOpen(true);
    setCartVisible(true);
  };

  const handleCartToggle = () => {
    if (cartOpen) {
      setCartOpen(false);
      setTimeout(() => setCartVisible(false), 300);
    } else {
      setCartVisible(true);
      requestAnimationFrame(() => setCartOpen(true));
    }
  };

  const handleCustomerChange = (event) => {
    const { name, value } = event.target;
    setCustomerForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetCheckout = () => {
    setCustomerForm({
      nombre: "",
      telefono: "",
      ciudad: "",
      direccion: "",
      notas: "",
    });
    setCheckoutOpen(false);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setCheckoutOpen(true);
  };

  const handleCartClose = () => {
    setCartOpen(false);
    setTimeout(() => setCartVisible(false), 300);
  };

  const handleAddToCartClick = (item, event) => {
    const sourceRect = event.currentTarget.getBoundingClientRect();
    handleAddToCart(item, sourceRect);
  };

  const handleSendWhatsApp = async () => {
    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
    if (!whatsappNumber) {
      Swal.fire({
        icon: "error",
        title: "Número no configurado",
        text: "Configura VITE_WHATSAPP_NUMBER en el archivo .env.",
      });
      return;
    }

    const phoneDigits = customerForm.telefono.replace(/\D/g, "");
    if (!customerForm.nombre.trim() || phoneDigits.length < 7) {
      Swal.fire({
        icon: "warning",
        title: "Datos incompletos",
        text: "Ingresa un nombre y un teléfono válido.",
      });
      return;
    }

    const itemsText = cartItems
      .map((item) => {
        const subtotal = Number(item.precio || 0) * item.cantidad;
        return `- ${item.nombre} x${item.cantidad} = ${currency.format(subtotal)}`;
      })
      .join("\n");

    const message = [
      "Hola, quiero comprar estos repuestos:",
      itemsText,
      "",
      `Total: ${currency.format(cartTotal)}`,
      "",
      "Cliente:",
      `Nombre: ${customerForm.nombre}`,
      `Teléfono: ${phoneDigits}`,
      customerForm.ciudad ? `Ciudad: ${customerForm.ciudad}` : null,
      customerForm.direccion ? `Dirección: ${customerForm.direccion}` : null,
      customerForm.notas ? `Observaciones: ${customerForm.notas}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const confirm = await Swal.fire({
      title: "Revisa tu pedido",
      html: `<pre style="text-align:left;white-space:pre-wrap;">${message}</pre>`,
      showCancelButton: true,
      confirmButtonText: "Enviar por WhatsApp",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank", "noopener,noreferrer");
      resetCheckout();
    }
  };

  const handleContactAdvisor = () => {
    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
    if (!whatsappNumber) {
      Swal.fire({
        icon: "error",
        title: "Número no configurado",
        text: "Configura VITE_WHATSAPP_NUMBER en el archivo .env.",
      });
      return;
    }
    const message = "Hola, quisiera consultar por un repuesto.";
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="bg-[#f5f6f9] min-h-screen">
      <div className="bg-[#0f172a] text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-yellow-400">Catálogo de Repuestos Originales</h1>
          <p className="text-slate-200 mt-4">Encuentra lo que necesitas para tu moto con repuestos de calidad.</p>
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-full px-5 py-3 w-full max-w-2xl">
              <Search size={18} className="text-slate-200" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por nombre, categoría o detalle..."
                className="bg-transparent w-full outline-none text-sm text-white placeholder:text-slate-300"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        <aside className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-bold text-slate-700 mb-4">Categorías</h2>
            <div className="space-y-3">
              {categories.map((category) => {
                const isActive = activeCategory === category.key;
                const count = countsByCategory[category.key] || 0;
                return (
                  <button
                    key={category.key}
                    onClick={() => setActiveCategory(category.key)}
                    className={`w-full flex items-center justify-between px-4 py-2 rounded-xl text-sm font-semibold transition ${
                      isActive ? "bg-yellow-400 text-black" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <span>{category.label}</span>
                    <span className="bg-white/70 text-xs px-2 py-0.5 rounded-full text-gray-500">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-yellow-50 rounded-2xl border border-yellow-100 p-5 space-y-3">
            <h3 className="text-lg font-bold text-slate-700">¿No encuentras tu repuesto?</h3>
            <p className="text-sm text-slate-600">
              Contáctanos directamente y te ayudaremos a conseguirlo.
            </p>
            <button
              onClick={handleContactAdvisor}
              className="w-full bg-yellow-400 text-black font-bold py-2 rounded-full shadow-sm"
            >
              Contactar Asesor
            </button>
          </div>
        </aside>

        <main className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-black text-slate-800">Destacados</h2>
            <div className="relative">
              <select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-10 text-sm font-semibold text-slate-600"
              >
                <option value="recientes">Más recientes</option>
                <option value="precio_asc">Precio: menor a mayor</option>
                <option value="precio_desc">Precio: mayor a menor</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={estadoFiltro}
              onChange={(event) => setEstadoFiltro(event.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-semibold text-slate-600"
            >
              <option value="all">Todos los estados</option>
              <option value="disponible">Disponible</option>
              <option value="preventa">Preventa</option>
              <option value="agotado">Agotado</option>
            </select>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-600">
              <input
                type="checkbox"
                checked={soloStock}
                onChange={(event) => setSoloStock(event.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              Con stock
            </label>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-500">
              Cargando repuestos...
            </div>
          ) : filteredRepuestos.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-500">
              No hay repuestos para mostrar.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredRepuestos.map((item) => (
                <article key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="relative">
                    <img
                      src={getImageSrc(item)}
                      alt={item.nombre}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                      onError={() => setImageFallback((prev) => ({ ...prev, [item.id]: true }))}
                    />
                    <button
                      onClick={(event) => handleAddToCartClick(item, event)}
                      className="absolute right-4 bottom-4 bg-white p-2 rounded-full shadow-sm hover:scale-105 transition"
                    >
                      <ShoppingCart size={18} className="text-slate-700" />
                    </button>
                    {Number(item.stock || 0) > 0 && Number(item.stock || 0) <= 3 && (
                      <span className="absolute left-4 bottom-4 bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full">
                        Solo {item.stock} disponibles
                      </span>
                    )}
                  </div>
                  <div className="p-5 space-y-2">
                    <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
                      {getCategoryLabel(categorias, getCategoryKeyForItem(item))}
                    </span>
                    <h3 className="text-lg font-bold text-slate-800">{item.nombre}</h3>
                    {item.descripcion && <p className="text-sm text-gray-500">{item.descripcion}</p>}
                    <div className="flex items-center justify-between pt-2">
                      <p className="text-lg font-black text-slate-900">{currency.format(Number(item.precio || 0))}</p>
                      <button
                        onClick={(event) => handleAddToCartClick(item, event)}
                        className="text-xs font-bold text-yellow-500"
                      >
                        Agregar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>

      <button
        ref={cartButtonRef}
        onClick={handleCartToggle}
        className="fixed bottom-6 right-6 bg-yellow-400 text-black rounded-full shadow-lg px-4 py-3 flex items-center gap-2 font-bold"
      >
        <ShoppingCart size={18} />
        Carrito ({cartItems.reduce((acc, item) => acc + item.cantidad, 0)})
      </button>

      {cartVisible && (
        <div className="fixed inset-0 z-40">
          <div
            className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
              cartOpen ? "opacity-100" : "opacity-0"
            }`}
            onClick={handleCartClose}
          />
          <aside
            className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ${
              cartOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="text-lg font-bold text-slate-800">Tu carrito</h3>
              <button onClick={handleCartClose} className="text-sm text-gray-500">
                Cerrar
              </button>
            </div>
            <div className="flex-1 overflow-auto p-5 space-y-4">
              {cartItems.length === 0 ? (
                <p className="text-sm text-gray-500">Aún no agregas repuestos.</p>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 border border-gray-100 rounded-xl p-3">
                    <img
                      src={getImageSrc(item)}
                      alt={item.nombre}
                      className="w-20 h-16 object-cover rounded-lg bg-gray-100"
                      loading="lazy"
                      onError={() => setImageFallback((prev) => ({ ...prev, [item.id]: true }))}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800">{item.nombre}</p>
                      <p className="text-xs text-gray-400">{currency.format(Number(item.precio || 0))}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateCartItem(item, -1)}
                          className="w-8 h-8 rounded-full border border-gray-200 text-gray-600"
                        >
                          -
                        </button>
                        <span className="text-sm font-semibold">{item.cantidad}</span>
                        <button
                          onClick={() => updateCartItem(item, 1)}
                          className="w-8 h-8 rounded-full border border-gray-200 text-gray-600"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeCartItem(item.id)}
                          className="ml-auto text-xs text-red-500 font-semibold"
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-5 border-t space-y-3">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span>Total</span>
                <span>{currency.format(cartTotal)}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
                className="w-full bg-yellow-400 text-black font-bold py-3 rounded-xl disabled:opacity-60"
              >
                Finalizar compra
              </button>
            </div>
          </aside>
        </div>
      )}

      {checkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={resetCheckout} />
          <div className="relative bg-white w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">Datos para tu pedido</h3>
              <button onClick={resetCheckout} className="text-sm text-gray-500">
                Cerrar
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500">Nombre</label>
                <input
                  name="nombre"
                  value={customerForm.nombre}
                  onChange={handleCustomerChange}
                  className="mt-1 w-full border rounded-xl px-3 py-2"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500">Teléfono</label>
                <input
                  name="telefono"
                  value={customerForm.telefono}
                  onChange={handleCustomerChange}
                  className="mt-1 w-full border rounded-xl px-3 py-2"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500">Ciudad</label>
                <input
                  name="ciudad"
                  value={customerForm.ciudad}
                  onChange={handleCustomerChange}
                  className="mt-1 w-full border rounded-xl px-3 py-2"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500">Dirección</label>
                <input
                  name="direccion"
                  value={customerForm.direccion}
                  onChange={handleCustomerChange}
                  className="mt-1 w-full border rounded-xl px-3 py-2"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">Observaciones</label>
              <textarea
                name="notas"
                value={customerForm.notas}
                onChange={handleCustomerChange}
                rows={3}
                className="mt-1 w-full border rounded-xl px-3 py-2"
              />
            </div>
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>Total</span>
              <span>{currency.format(cartTotal)}</span>
            </div>
            <button
              onClick={handleSendWhatsApp}
              className="w-full bg-green-500 text-white font-bold py-3 rounded-xl"
            >
              Enviar pedido por WhatsApp
            </button>
          </div>
        </div>
      )}

      {flyItems.map((fly) => (
        <span
          key={fly.id}
          className="fixed z-50 pointer-events-none"
          style={{
            left: fly.startX,
            top: fly.startY,
            width: 56,
            height: 56,
            transform: "translate(-50%, -50%)",
            animation: "fly-to-cart 0.7s ease-in-out forwards",
            "--fly-x": `${fly.endX - fly.startX}px`,
            "--fly-y": `${fly.endY - fly.startY}px`,
          }}
        >
          <span className="block w-full h-full bg-white rounded-xl shadow-lg overflow-hidden">
            {fly.image ? (
              <img src={fly.image} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="flex items-center justify-center w-full h-full text-xs text-gray-400">+1</span>
            )}
          </span>
        </span>
      ))}
      <style>{`
        @keyframes fly-to-cart {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          60% {
            opacity: 0.9;
          }
          100% {
            transform: translate(calc(-50% + var(--fly-x)), calc(-50% + var(--fly-y))) scale(0.2);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
};

export default Repuestos;
