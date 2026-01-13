import "./ConsultasTable.css";

export default function ConsultasTable() {
  const data = [
    {
      nombre: "Maria Garcia",
      email: "maria.g@example.com",
      telefono: "555-0101",
      asunto: "Disponibilidad de partes",
      mensaje: 'Hola, quisiera saber si tienen...',
      fecha: "hace 1 día",
    },
    {
      nombre: "Carlos Rodriguez",
      email: "c.rodriguez@example.com",
      telefono: "555-0102",
      asunto: "Financiamiento",
      mensaje: 'Me gustaría obtener más información...',
      fecha: "hace 3 días",
    },
    {
      nombre: "Ana Lopez",
      email: "ana.lopez@example.com",
      telefono: "555-0103",
      asunto: "Test Drive",
      mensaje: '¿Es posible agendar una prueba...?',
      fecha: "hace 5 días",
    },
  ];

  return (
    <div className="mt-8">
      <h2 className="chart-title">Consultas Recientes</h2>

      <div className="table-wrapper">
        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nombre completo</th>
                <th>Contacto</th>
                <th>Asunto y Mensaje</th>
                <th>Fecha</th>
              </tr>
            </thead>

            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  <td>{row.nombre}</td>

                  <td>
                    {row.email}
                    <br />
                    {row.telefono}
                  </td>

                  <td>
                    <strong>{row.asunto}</strong> — "{row.mensaje}"
                  </td>

                  <td>{row.fecha}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}
