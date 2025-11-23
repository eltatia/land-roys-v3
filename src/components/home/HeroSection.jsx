import "../../styles/home/HeroSection.css";

const HeroSection = () => {
  return (
    <section className="hero-section">

      {/* Imagen de fondo */}
      <div className="hero-bg">
        <div
          className="hero-bg-image"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBDURNm7563L4rj3QvZtYYSypoEZBV57PyxG_ibSszAeyLRGwQdogI78N-k80n8V-2ByuHhnAsuGpIKLzQAAwGF4aoaIe848Ye4bxUUgJ-fzc8oIKyYb3U9vz4nc1ngiH6omNblWuIo8bX1u44wgr5OEmDpe5l22AQsQ7xYd_XR_9ByqzQXJubDu1dcl2ggp3Ei5dwAVDPH8iBJnayfwzCtWIPKeMC0SwWNaXwGQgk9LF9fFeQwUXauLyFtf7sFaK2zWCNPSfJAHQ")'
          }}
        />
      </div>

      {/* Oscurecedor */}
      <div className="hero-overlay"></div>

      {/* Texto */}
      <div className="hero-content">
        <h1 className="hero-title">
          INGENIERÍA EXCEPCIONAL. ESPÍRITU INDOMABLE.
        </h1>

        <p className="hero-description">
          Descubre la libertad en cada curva. Las motocicletas Land Roys están diseñadas para quienes se atreven a explorar el mundo sin límites.
        </p>

        <button className="hero-button">
          Explora la Gama
        </button>
      </div>

    </section>
  );
};

export default HeroSection;

