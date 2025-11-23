
import { Link } from "react-router-dom";
import "../../styles/Footer.css";

// Iconos de react-icons
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <div className="footer-wrapper">

        <div className="footer-grid">

          {/* Logo + Slogan */}
          <div>
            <h2 className="text-xl font-bold mb-2">Land Roys</h2>
            <p className="text-sm">
              Diseñadas para la Aventura. Construidas para Durar.
            </p>
          </div>

          {/* Explorar */}
          <div>
            <h3 className="footer-title">Explorar</h3>
            <ul>
              <li><Link className="footer-link" to="/modelos">Modelos</Link></li>
              <li><Link className="footer-link" to="/configurador">Configurador</Link></li>
              <li><Link className="footer-link" to="/tecnologia">Tecnología</Link></li>
            </ul>
          </div>

          {/* Compañía */}
          <div>
            <h3 className="footer-title">Compañía</h3>
            <ul>
              <li><Link className="footer-link" to="/historia">Nuestra Historia</Link></li>
              <li><Link className="footer-link" to="/prensa">Prensa</Link></li>
              <li><Link className="footer-link" to="/contacto">Contacto</Link></li>
            </ul>
          </div>

          {/* Redes sociales */}
          <div>
            <h3 className="footer-title">Conecta</h3>
            <div className="social-icons">

              <Link
                to="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF />
              </Link>

              <Link
                to="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </Link>

              <Link
                to="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaYoutube />
              </Link>

            </div>
          </div>

        </div>

        <div className="footer-bottom">
          © {currentYear} Land Roys. Todos los derechos reservados.
        </div>

      </div>
    </footer>
  );
};

export default Footer;

