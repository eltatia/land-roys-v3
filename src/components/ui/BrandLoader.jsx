import "../../styles/ui/BrandLoader.css";

const BrandLoader = () => {
  return (
    <div className="brand-loader">
      <div className="brand-loader__card">
        <div className="brand-loader__logo">
          <span className="brand-loader__ring"></span>
          <span className="brand-loader__icon">R</span>
        </div>
        <p className="brand-loader__text">Land Roys</p>
        <div className="brand-loader__signal">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default BrandLoader;
