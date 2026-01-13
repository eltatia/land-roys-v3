import "./loading.css";

export default function Loading() {
  return (
    <div className="loading-root font-display">
      <div className="layout-container">
        <div className="center-wrapper">
          <div className="content-box">

            <div className="spinner-box">
              <svg
                className="spinner-icon"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="spinner-circle"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="spinner-fill"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>

            <p className="loading-title">Cargando...</p>
            <p className="loading-subtitle">Preparing the ride...</p>

            <div className="progress-container">
              <div className="progress-bg">
                <div className="progress-bar"></div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="brand-footer">
        <p>Land Roys</p>
      </div>
    </div>
  );
}

