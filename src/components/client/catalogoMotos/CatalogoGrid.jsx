import React from "react";
import MotoCard from "./MotoCard";

const CatalogoGrid = () => {
  const motos = [
    {
      imagen:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDdonhDrid9F3lrJRj5m-kKPaD6b2YwsGybyrNuK2bowZ9ec82Lwk7X9PJw3jRIPpCer897LCgedegyt2wze48AwHWnzCSUdeYe0XydzQk_RwnurHlo_w5fPHdavFWXO2MJ2yE0lMt_-EGSj1BRp1toSkArKo0H32h7YwaqE20S_IGyAjtkv6ieBhoUh8Ajyh6gQZbPAJ3DuqCc-eJAoyNx9IVPNeyetxsXI8Q5dHwVQ8DBUlpWCjjGyF4cXTtpSLYkMKMSGoNGTA",
      titulo: "LR-Scrambler 800",
      descripcion: "La aventurera urbana perfecta, diseñada para la agilidad y el estilo.",
      precio: 18900,
    },

    {
      imagen:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCovG1NBcp7xesFZr3HekOy2F34OCmSICyr-L-25XmqFoHd-QPlfWSI_EBvuObNsa9hZmqf69HGX9Vs9WUS2_MY2_Cu9rG8ZULj0zoPYfrRRCL5qnwJXv75qPPe7gTQ6MST0mjlgGJZVDX66nuaREkOAdqn5QltbuvPBa7DDeFNIidGoR8IZynsy60oYSqQ-0gOv6MVsUTb5Ldq5Um_dUsxOmoUGqpZkFRR7LkpRZ-LeGhZq1pOuiP5SXA3oBCQqxTR2kWwLyMhvQ",
      titulo: "LR-Tourer 1200",
      descripcion: "Comodidad sin límites para largas distancias y viajes inolvidables.",
      precio: 25900,
    },

    {
      imagen:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBTcceMEiH_cM4BUDxuVHIDYtEbyWpmrNJupPsgUH_WVr_8omo7fJuRE05q-mhiIrog4rC2GhLkTjWp-uCPlwCBgChbKm7Y06vAN7acplrpRLw1aKmFjcHMcWyXxVLDE1BiQdm-sqWJ5AZ7XCbddTli9RZfMIdenAfGaR387X7YxESjGhZuoruFKPaCTy5_ibrA8wnn16IlUDnP2UN8NRSz7IgfWjyBMyLKlq0obEkyE9Z2PjXMHfrEk5Fzf0rabj4iD54XHJN6YA",
      titulo: "LR-Cruiser 950",
      descripcion: "Potencia y presencia en cada kilómetro, un icono de la carretera.",
      precio: 21400,
    },

    // DUPLICADOS COMO EJEMPLO PARA LLENAR EL GRID
    {
      imagen:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBTcceMEiH_cM4BUDxuVHIDYtEbyWpmrNJupPsgUH_WVr_8omo7fJuRE05q-mhiIrog4rC2GhLkTjWp-uCPlwCBgChbKm7Y06vAN7acplrpRLw1aKmFjcHMcWyXxVLDE1BiQdm-sqWJ5AZ7XCbddTli9RZfMIdenAfGaR387X7YxESjGhZuoruFKPaCTy5_ibrA8wnn16IlUDnP2UN8NRSz7IgfWjyBMyLKlq0obEkyE9Z2PjXMHfrEk5Fzf0rabj4iD54XHJN6YA",
      titulo: "LR-Cruiser 950",
      descripcion: "Potencia y presencia en cada kilómetro, un icono de la carretera.",
      precio: 21400,
    },

    {
      imagen:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBTcceMEiH_cM4BUDxuVHIDYtEbyWpmrNJupPsgUH_WVr_8omo7fJuRE05q-mhiIrog4rC2GhLkTjWp-uCPlwCBgChbKm7Y06vAN7acplrpRLw1aKmFjcHMcWyXxVLDE1BiQdm-sqWJ5AZ7XCbddTli9RZfMIdenAfGaR387X7YxESjGhZuoruFKPaCTy5_ibrA8wnn16IlUDnP2UN8NRSz7IgfWjyBMyLKlq0obEkyE9Z2PjXMHfrEk5Fzf0rabj4iD54XHJN6YA",
      titulo: "LR-Cruiser 950",
      descripcion: "Potencia y presencia en cada kilómetro, un icono de la carretera.",
      precio: 21400,
    },

    {
      imagen:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBTcceMEiH_cM4BUDxuVHIDYtEbyWpmrNJupPsgUH_WVr_8omo7fJuRE05q-mhiIrog4rC2GhLkTjWp-uCPlwCBgChbKm7Y06vAN7acplrpRLw1aKmFjcHMcWyXxVLDE1BiQdm-sqWJ5AZ7XCbddTli9RZfMIdenAfGaR387X7YxESjGhZuoruFKPaCTy5_ibrA8wnn16IlUDnP2UN8NRSz7IgfWjyBMyLKlq0obEkyE9Z2PjXMHfrEk5Fzf0rabj4iD54XHJN6YA",
      titulo: "LR-Cruiser 950",
      descripcion: "Potencia y presencia en cada kilómetro, un icono de la carretera.",
      precio: 21400,
    },

    {
      imagen:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBTcceMEiH_cM4BUDxuVHIDYtEbyWpmrNJupPsgUH_WVr_8omo7fJuRE05q-mhiIrog4rC2GhLkTjWp-uCPlwCBgChbKm7Y06vAN7acplrpRLw1aKmFjcHMcWyXxVLDE1BiQdm-sqWJ5AZ7XCbddTli9RZfMIdenAfGaR387X7YxESjGhZuoruFKPaCTy5_ibrA8wnn16IlUDnP2UN8NRSz7IgfWjyBMyLKlq0obEkyE9Z2PjXMHfrEk5Fzf0rabj4iD54XHJN6YA",
      titulo: "LR-Cruiser 950",
      descripcion: "Potencia y presencia en cada kilómetro, un icono de la carretera.",
      precio: 21400,
    },

    {
      imagen:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBTcceMEiH_cM4BUDxuVHIDYtEbyWpmrNJupPsgUH_WVr_8omo7fJuRE05q-mhiIrog4rC2GhLkTjWp-uCPlwCBgChbKm7Y06vAN7acplrpRLw1aKmFjcHMcWyXxVLDE1BiQdm-sqWJ5AZ7XCbddTli9RZfMIdenAfGaR387X7YxESjGhZuoruFKPaCTy5_ibrA8wnn16IlUDnP2UN8NRSz7IgfWjyBMyLKlq0obEkyE9Z2PjXMHfrEk5Fzf0rabj4iD54XHJN6YA",
      titulo: "LR-Cruiser 950",
      descripcion: "Potencia y presencia en cada kilómetro, un icono de la carretera.",
      precio: 21400,
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
      {motos.map((moto, index) => (
        <MotoCard
          key={index}
          imagen={moto.imagen}
          titulo={moto.titulo}
          descripcion={moto.descripcion}
          precio={moto.precio}  
        />
      ))}
    </section>
  );
};

export default CatalogoGrid;