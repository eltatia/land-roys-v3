import "../../../styles/home/ModelsSection.css";

const ModelsSection = () => {
  return (
    <section className="models-section">

      <div className="models-header">
        <h4 className="models-subtitle">Nuestra Gama</h4>
        <h2 className="models-title">Encuentra Tu Próximo Viaje</h2>
      </div>

      <div className="models-grid">
        
        {/* CARD 1 */}
        <div className="model-card">
          <div
            className="model-image"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC23IJoABv7fmk5KADDdKh7CUhhJ2hBTYDt0pPK08T7qtZx0WEx4Ikvn3FLuBbwUD9K1Icf5stT_Q2x8QT1pWYLNUxtrBTewDm4dmMkaRBZ0yK8kx3WnQUPSvsJDsPSMsVvBsdDTeHHeL0CVr2X621pa3ynSWxpWqsx8eGJDgs-DnSt7Ln09MYwpKbb-UcpbWGuLVLtZGzhu54qU5b3nykB8t7FwCfkUD1Yj5w4g6xX5M-N-ZsEaBFHLquLkPFaAqU5ldNFFs-_OA")'
            }}
          ></div>

          <div className="model-content">
            <h3 className="model-name">Land Roys Explorer 800</h3>
            <p className="model-description">
              La compañera perfecta para la aventura sin límites.
            </p>
            <button className="model-btn">Ver Detalles</button>
          </div>
        </div>

        {/* CARD 2 */}
        <div className="model-card">
          <div
            className="model-image"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA7irr99hpBfW22TQhU11fZdyo-vyAI9SuhU_E1OFqM63yceyN_b80TwptwVqaa_3qh6VermPkqPJ9HcLLQ85pWEJnaltXyr6a7NhJLpmCxpaRPhCCzNTF5TwnrzCjNaPgk46qoxy2qhGclbcqlmcg5aTIM52pMGGyJBiJVQxk3Mibhhe7xLt2zpMFvz9rt3-zU2F8ph387tmEHkE18WhfiJuGdWn-63F1pe-pASrpZ9000Saex_vxx-ovZHjb1kpjoh-VNs8HzEA")'
            }}
          ></div>

          <div className="model-content">
            <h3 className="model-name">Land Roys Urban X</h3>
            <p className="model-description">
              Domina la jungla urbana con estilo y agilidad.
            </p>
            <button className="model-btn">Ver Detalles</button>
          </div>
        </div>

        {/* CARD 3 */}
        <div className="model-card">
          <div
            className="model-image"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDKzw4jWsKJBGx8Jix_UXyAoSwIfjlMq9gfzjsrLxqwjUsaGtEDQL2yNwvSEI_CKzD1p5ga6t1-cPw5gD4xecoP3AM4UifkVKYz7DYvrDcR8Bv0LPgpEuJfeGkSh_bIkjJeqS75gf_BvDiEfX7q9rLX2-OLq1-DGQu922qCytESTPmtKW0ZW9zjvbgo4Q931WnofBt2JRGEdfBdg-llqgKoRnqgqWiaPOEgFCpIHSSkg9TyW5iMks_pIbDnFmk8vvFuI9fEjXhzyQ")'
            }}
          ></div>

          <div className="model-content">
            <h3 className="model-name">Land Roys Adventurer 1200</h3>
            <p className="model-description">
              Construida para conquistar los terrenos más exigentes.
            </p>
            <button className="model-btn">Ver Detalles</button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ModelsSection;

