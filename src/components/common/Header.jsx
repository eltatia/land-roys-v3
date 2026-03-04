import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, MessageSquareQuote } from "lucide-react";
import HorarioDropdown from "./HorarioDropdown";
import logoHeaderLandRoys from "../../assets/LogoHeaderCompleto.png";

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Inicio", path: "/" },
        { name: "Modelos", path: "/modelos" },
        { name: "Repuestos", path: "/repuestos" },
        { name: "Sobre Nosotros", path: "/nosotros" },
    ];

    return (
        <>
            {/* HEADER */}
            <header
                className={`w-full sticky top-0 z-50 transition-all duration-300 ${
                    scrolled
                        ? "bg-white shadow-lg"
                        : "bg-white/80 backdrop-blur-md"
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">

                        {/* LOGO */}
                        <NavLink to="/" className="flex items-center group">
                            <img
                                src={logoHeaderLandRoys}
                                alt="Land Roys - Logo oficial"
                                className="w-44 object-contain transition-transform duration-300 group-hover:scale-105"
                            />
                        </NavLink>

                        {/* DESKTOP NAV */}
                        <nav className="hidden md:flex items-center gap-3 bg-gray-100/70 backdrop-blur-sm px-3 py-2 rounded-full shadow-sm">

                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.name}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `relative px-5 py-2 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 ${
                                            isActive
                                                ? "bg-white text-black shadow-md"
                                                : "text-gray-600 hover:text-black hover:bg-white/70"
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            {link.name}

                                            {isActive && (
                                                <span className="absolute inset-0 rounded-full ring-1 ring-yellow-400/40 pointer-events-none"></span>
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            ))}

                        </nav>

                        {/* RIGHT SIDE DESKTOP */}
                        <div className="hidden md:flex items-center gap-5">

                            <NavLink
                                to="/consulta"
                                className="flex items-center gap-2 px-7 py-3 rounded-full font-bold text-sm bg-black text-white shadow-md hover:shadow-xl hover:-translate-y-0.5 hover:bg-gray-900 transition-all duration-300 active:scale-95"
                            >
                                <MessageSquareQuote size={18} className="text-yellow-400" />
                                CONSULTA
                            </NavLink>

                            <HorarioDropdown />
                        </div>

                        {/* MOBILE BUTTON */}
                        <button
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            {menuOpen ? <X size={26} /> : <Menu size={26} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* OVERLAY */}
            {menuOpen && (
                <button
                    type="button"
                    aria-label="Cerrar menú móvil"
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
                    onClick={() => setMenuOpen(false)}
                />
            )}

            {/* MOBILE MENU */}
            <div
                className={`fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-2xl transform transition-transform duration-300 ${
                    menuOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="p-6 space-y-6">

                    {/* CLOSE BUTTON */}
                    <div className="flex justify-end">
                        <button onClick={() => setMenuOpen(false)}>
                            <X size={24} />
                        </button>
                    </div>

                    {/* MOBILE LINKS */}
                    <div className="space-y-3">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                onClick={() => setMenuOpen(false)}
                                className={({ isActive }) =>
                                    `block px-5 py-3 rounded-xl text-lg font-semibold transition-all duration-300 ${
                                        isActive
                                            ? "bg-black text-white shadow-md"
                                            : "text-gray-700 hover:bg-gray-100"
                                    }`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}
                    </div>

                    {/* CONSULTA BUTTON MOBILE */}
                    <NavLink
                        to="/consulta"
                        onClick={() => setMenuOpen(false)}
                        className="flex justify-center items-center gap-2 px-6 py-3 rounded-full font-bold text-sm bg-black text-white hover:bg-gray-900 transition-all"
                    >
                        <MessageSquareQuote size={18} className="text-yellow-400" />
                        CONSULTA
                    </NavLink>

                    {/* HORARIO */}
                    <HorarioDropdown mobile />
                </div>
            </div>
        </>
    );
};

export default Header;
