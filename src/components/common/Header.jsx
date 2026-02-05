import { Bike, MessageSquareQuote } from 'lucide-react';
import { NavLink } from 'react-router-dom'; // <-- Usamos NavLink

const Header = () => {
    const navLinks = [
        { name: 'Inicio', path: '/' },
        { name: 'Modelos', path: '/modelos' },
        { name: 'Repuestos', path: '/repuestos' },
        { name: 'Nosotros', path: '/nosotros' },
    ];

    return (
        <header className="w-full bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    {/* Logo */}
                    <div className="flex items-center gap-2 cursor-pointer flex-shrink-0">
                        <div className="bg-yellow-400 p-2 rounded-lg shadow-md hover:scale-110 transition-transform">
                            <Bike size={28} className="text-black" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tighter text-gray-900">
                            Land <span className="text-yellow-500">Roys</span>
                        </h1>
                    </div>

                    {/* Navegación */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                className={({ isActive }) =>
                                    `text-sm font-semibold relative group ${isActive ? 'text-black' : 'text-gray-600 hover:text-black'
                                    }`
                                }
                            >
                                {link.name}
                                <span
                                    className={`absolute -bottom-1 left-0 h-0.5 bg-yellow-400 transition-all duration-300 ${
                                        // Si está activo, ancho completo
                                        window.location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                                        }`}
                                ></span>
                            </NavLink>
                        ))}
                    </nav>

                    {/* Botón de acción */}
                    <div className="flex items-center gap-4">
                        <NavLink
                            to="/consulta"
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm shadow-lg transition-all active:scale-95 ${isActive ? 'bg-yellow-400 text-black' : 'bg-black text-white hover:bg-gray-800'
                                }`
                            }
                        >
                            <MessageSquareQuote size={18} className="text-yellow-400 transition-transform" />
                            <span className="hidden sm:inline">CONSULTA</span>
                        </NavLink>
                    </div>

                </div>
            </div>
        </header>
    );
};

export default Header;
