// src/pages/Login.jsx
import React, { useState } from "react";
import { User, Lock, Bike } from "lucide-react";
import { useAuth } from "../../../context/useAuth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { getUserRoles } from "../../../services/usuario.service";

const MySwal = withReactContent(Swal);

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");

  // Maneja el login y obtiene roles
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Login con email y contraseña
      await login(email, password);

      // 2️⃣ Obtener roles reales del usuario
      const roles = await getUserRoles(email); // ej: ['admin']
      if (!roles || roles.length === 0) {
        return MySwal.fire({
          icon: "error",
          title: "Acceso denegado",
          text: "Este usuario no tiene roles asignados",
        });
      }

      // 3️⃣ Si solo tiene un rol, redirigir automáticamente
      if (roles.length === 1) {
        const role = roles[0];
        const redirectPath = role === "admin" ? "/admin" : "/asistente";
        MySwal.fire({
          icon: "success",
          title: `Ingresando como ${role.toUpperCase()}`,
          showConfirmButton: false,
          timer: 1200,
        });
        return setTimeout(() => navigate(redirectPath), 1200);
      }

      // 4️⃣ Si tiene varios roles, mostrar selector
      setAvailableRoles(roles);
      setSelectedRole(roles[0]); // seleccionar el primero por defecto
    } catch (err) {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Credenciales inválidas",
      });
    }
  };

  // Maneja la selección de rol y valida que sea real
  const handleRoleSelect = () => {
    if (!selectedRole) return;

    // Validación: el rol debe estar entre los roles reales
    if (!availableRoles.includes(selectedRole)) {
      return MySwal.fire({
        icon: "error",
        title: "Acceso denegado",
        text: `Este usuario no tiene el rol ${selectedRole.toUpperCase()}`,
      });
    }

    // Redirigir según rol
    const redirectPath = selectedRole === "admin" ? "/admin" : "/asistente";
    MySwal.fire({
      icon: "success",
      title: `Ingresando como ${selectedRole.toUpperCase()}`,
      showConfirmButton: false,
      timer: 1000,
    });
    setTimeout(() => navigate(redirectPath), 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 text-yellow-500">
            <Bike size={40} strokeWidth={2.5} />
            <span className="text-3xl font-bold tracking-tight">Land Roys</span>
          </div>
        </div>

        {availableRoles.length === 0 ? (
          // Formulario login
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
              <label className="absolute -top-3 left-3 bg-white px-1 text-sm text-gray-400 z-10">
                Correo Electrónico
              </label>
              <div className="flex items-center border-2 border-yellow-400 rounded-xl p-3 bg-gray-50 shadow-inner">
                <User className="text-gray-400 mr-2" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ejemplo@gmail.com"
                  className="bg-transparent outline-none w-full text-gray-700"
                  required
                />
              </div>
            </div>

            <div className="relative">
              <label className="absolute -top-3 left-3 bg-white px-1 text-sm text-gray-400 z-10">
                Contraseña
              </label>
              <div className="flex items-center border-2 border-yellow-400 rounded-xl p-3 bg-gray-50 shadow-inner">
                <Lock className="text-gray-400 mr-2" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="●●●●●●"
                  className="bg-transparent outline-none w-full text-gray-700"
                  required
                />
              </div>
            </div>

            <div className="text-center">
              <button type="button" className="text-sm text-black hover:underline font-medium">
                ¿Has olvidado tu contraseña?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95 uppercase tracking-wider"
            >
              Login
            </button>
          </form>
        ) : (
          // Selector de rol solo con roles reales
          <div className="space-y-6">
            <h2 className="text-center font-bold text-lg">Selecciona tu rol</h2>
            <div className="flex gap-4 justify-center">
              {availableRoles.map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRole(r)}
                  className={`px-4 py-2 rounded-xl font-semibold shadow-md transition-colors ${
                    selectedRole === r ? "bg-yellow-400 text-black" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="text-center mt-4">
              <button
                onClick={handleRoleSelect}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-xl shadow-lg uppercase tracking-wider"
              >
                Ingresar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
