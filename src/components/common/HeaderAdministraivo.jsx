import React from "react";
import { LogOut, UserCircle } from "lucide-react";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import logoHeaderLandRoys from "../../assets/LogoHeaderCompleto.png";

const HeaderAdministrativo = () => {
  const { logout, user, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error al salir:", error);
    }
  };

  return (
    <header className="h-[80px] w-full bg-white border-b border-gray-200 px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center mb-4">
        <img
          src={logoHeaderLandRoys}   // tu nueva imagen
          alt="Land Roys - Logo oficial"
          className="w-48 object-contain"
        />
      </div>


      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-gray-700">
          <UserCircle size={28} />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold">{user?.email}</span>
            <span className="text-xs text-gray-500 uppercase">{role}</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
        >
          <LogOut size={18} />
          Salir
        </button>
      </div>
    </header>
  );
};

export default HeaderAdministrativo;
