import { Link } from "react-router-dom";
import img404 from "../assets/img/404Landroys.png";

export default function NotFound404() {
  return (
    <main
      className="h-screen flex-grow flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${img404})`,
      }}
    >
      <div className="w-full max-w-lg text-center bg-black/50 p-8 rounded-xl">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white">
          404
        </h1>

        <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight text-white">
          Página no encontrada
        </h2>

        <p className="mt-4 max-w-lg mx-auto text-gray-200">
          Lo sentimos, la página que buscas no está disponible.
        </p>

        <div className="mt-10">
          <Link
            className="inline-flex min-w-[84px] max-w-[480px] items-center justify-center rounded-md h-12 px-8 
                       bg-[#D4AF37] text-black text-lg font-bold tracking-wide shadow-lg
                       hover:bg-[#b5952f] transition-colors duration-300"
            to="/"
          >
            <span>Regresar al Inicio</span>
          </Link>
        </div>
      </div>
    </main>
  );
}






