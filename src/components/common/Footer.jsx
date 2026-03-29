import { Bike, Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

import logoCompleto from '../../assets/LogoFooterCompleto.png';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#1a1a1a] border-t border-gray-100 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

                    {/* Columna 1: Branding y Redes */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center mb-4">
                            <img
                                src={logoCompleto}   // tu nueva imagen
                                alt="Land Roys - Logo oficial"
                                className="w-48 object-contain"
                            />
                        </div>

                        <p className="text-white text-sm leading-relaxed mb-6">
                            Expertos en la venta de motos y repuestos de alta calidad. Tu pasión sobre dos ruedas comienza aquí.
                        </p>
                        <div className="flex gap-4">
                            <Link to="/facebook" className="p-2 bg-[#2a2a2a] rounded-full text-gray-400 hover:text-yellow-500 hover:shadow-md transition-all">
                                <Facebook size={20} />
                            </Link>
                            <Link to="/instagram" className="p-2 bg-[#2a2a2a] rounded-full text-gray-400 hover:text-yellow-500 hover:shadow-md transition-all">
                                <Instagram size={20} />
                            </Link>
                            <Link to="/twitter" className="p-2 bg-[#2a2a2a] rounded-full text-gray-400 hover:text-yellow-500 hover:shadow-md transition-all flex items-center justify-center w-9 h-9">
                                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    {/* Columna 2: Enlaces Rápidos */}
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Empresa</h3>
                        <ul className="space-y-4">
                            <li><Link to="/nosotros" className="text-gray-500 hover:text-white text-sm transition-colors">Sobre Nosotros</Link></li>
                            <li><Link to="/modelos" className="text-gray-500 hover:text-white text-sm transition-colors">Nuestros Modelos</Link></li>
                            <li><Link to="/blog" className="text-gray-500 hover:text-white text-sm transition-colors">Blog</Link></li>
                        </ul>
                    </div>

                    {/* Columna 3: Soporte */}
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Soporte</h3>
                        <ul className="space-y-4">
                            <li><Link to="/faq" className="text-gray-500 hover:text-white text-sm transition-colors">Preguntas Frecuentes</Link></li>
                            <li><Link to="/repuestos" className="text-gray-500 hover:text-white text-sm transition-colors">Repuestos</Link></li>
    
                            <li><Link to="/contacto" className="text-gray-500 hover:text-white text-sm transition-colors">Contacto</Link></li>
                        </ul>
                    </div>

                    {/* Columna 4: Contacto Directo */}
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Contacto</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-white text-sm">
                                <MapPin size={18} className="text-yellow-500 shrink-0" />
                                <span>Av. Madre de Dios #298, Ciudad de Puerto Maldonado</span>
                            </li>
                            <li className="flex items-center gap-3 text-white text-sm">
                                <Phone size={18} className="text-yellow-500 shrink-0" />
                                <span>+52 (55) 1234-5678</span>
                            </li>
                            <li className="flex items-center gap-3 text-white text-sm">
                                <Mail size={18} className="text-yellow-500 shrink-0" />
                                <span>info@landroys.com</span>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Línea Divisoria y Copyright */}
                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-white text-xs">
                        © {currentYear} Land Roys. Todos los derechos reservados.
                    </p>
                    <div className="flex gap-6">
                        <Link to="/privacidad" className="text-white hover:text-gray-600 text-xs transition-colors">Privacidad</Link>
                        <Link to="/terminos" className="text-white hover:text-gray-600 text-xs transition-colors">Términos</Link>
                        <Link to="/cookies" className="text-white hover:text-gray-600 text-xs transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
