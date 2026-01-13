import React from "react";
import MotoCard from "./MotoCard";

const CatalogoGrid = () => {
  const motos = [
    {
      slug: "lr-scrambler-800",
      imagen:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDdonhDrid9F3lrJRj5m-kKPaD6b2YwsGybyrNuK2bowZ9ec82Lwk7X9PJw3jRIPpCer897LCgedegyt2wze48AwHWnzCSUdeYe0XydzQk_RwnurHlo_w5fPHdavFWXO2MJ2yE0lMt_-EGSj1BRp1toSkArKo0H32h7YwaqE20S_IGyAjtkv6ieBhoUh8Ajyh6gQZbPAJ3DuqCc-eJAoyNx9IVPNeyetxsXI8Q5dHwVQ8DBUlpWCjjGyF4cXTtpSLYkMKMSGoNGTA",
      titulo: "LR-Scrambler 800",
      descripcion: "La aventurera urbana perfecta, diseñada para la agilidad y el estilo.",
      precio: 18900,
      heroTagline: "Aventura urbana sin límites",
      heroTitle: "DOMINA CADA",
      heroHighlight: "TRAYECTO.",
      heroDescription:
        "Diseñada para quienes buscan una moto versátil con alma exploradora. La Scrambler 800 combina potencia, estilo y control total.",
      priceSoles: "S/ 68,900",
      priceUsd: "$ 18,900 USD",
      power: "84 HP",
      torque: "78 Nm",
      weight: "198 kg",
      heroImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBqD4mUPjQXP0dXUt0L_4FIqQlALrYJpJ9TgVtIQEAyvPCLYr_7PiIluoLxSblj_sao6_d4YRaDa8vEqhkHnWy3Z7059KQnVA0l6FTOtLDtZtjygYb9haX2uM8Co72cKcCudQ-PTwzdx4CB1_1li2Fz2gfkADP74BQ2LuOkgXln2-svKawh59C-bbdGgOlezRCdJwNDmblbupOIxiZ0jdTJqFO4qXv4Ao3E8MCw42Tk_lhadegjcl423Sm423PU32Q9kCewcw8Jj0A",
      bikeImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBsK8i4EKg3VB8QA608j74lYMp8XYhowgEMAfJJvYoBR1rhy8GuePlp0djHoIgGJxj-F-FDrrjhZqx67p4-vJVceerJnAvEOUxIw-WKue_SymwxcDdqP9y6qYvCwHNY2rDxLHuj_m0bnfHpeqyUVEvJrBY3eUaktaRCjNvjJ4xCu1p9ZJ91yWkL_b-qfGQMidHuo3hQR0lwa4H5cGn7Lepafb2FlRnTZcrbYa2H4fJ4YGTh84CIzrvRgmCc1cW89xNLSKIXgMeD0k8",
      performanceImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB0ns6Jhs7h91WgWOFKFl_YnkxGp_HZR7eJEOqN56uO_YNtukStiRf8Z9F51E1xPpusPJ9eYOXaEjeaghzwVKK4sJkvVbqfjnZp-QF1OgyH8kGsVaehKvYBs3Q-VVullqHvS-Dv7GLlK2Wwcb-e4FjLOeZKjEFlp6qXteOBrVAljZw1GISJzL03YA2j99d4t0hoWpg-r1bUWdLv53YoN7IkaIa3ThtfyX16f62526CEoz5HD4PGwrTx-oiGX5zra6zsYrHRTdzyrsA",
    },

    {
      slug: "lr-tourer-1200",
      imagen:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCovG1NBcp7xesFZr3HekOy2F34OCmSICyr-L-25XmqFoHd-QPlfWSI_EBvuObNsa9hZmqf69HGX9Vs9WUS2_MY2_Cu9rG8ZULj0zoPYfrRRCL5qnwJXv75qPPe7gTQ6MST0mjlgGJZVDX66nuaREkOAdqn5QltbuvPBa7DDeFNIidGoR8IZynsy60oYSqQ-0gOv6MVsUTb5Ldq5Um_dUsxOmoUGqpZkFRR7LkpRZ-LeGhZq1pOuiP5SXA3oBCQqxTR2kWwLyMhvQ",
      titulo: "LR-Tourer 1200",
      descripcion: "Comodidad sin límites para largas distancias y viajes inolvidables.",
      precio: 25900,
      heroTagline: "Touring premium",
      heroTitle: "VIAJA SIN",
      heroHighlight: "FRONTERAS.",
      heroDescription:
        "Una gran viajera pensada para rutas interminables. Ergonomía avanzada, electrónica de apoyo y potencia controlada.",
      priceSoles: "S/ 94,500",
      priceUsd: "$ 25,900 USD",
      power: "108 HP",
      torque: "112 Nm",
      weight: "236 kg",
      heroImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCK54sE7XQqKfaXrj6o8hB9kB2UoN9lX5D9bV6y9pGSL9WUxgH3tV0vQfjZg9hECSBqKSm2m2y4m2sOonfG6Q1GODx1Qep2qZf_aq4D9Yx9r3pYADPjT9qVBScR7wqbK7oDg4nX2s8QYy6rU5zzv6f2X7oa9x2cSeN2myKpwbU8Q9t4J0R6kzQm8G4zM6kC2U2QmwbB7a5xZy2bQZmQW6a7x0EUc8pN2M2m9gPMUR0s4IKR9g",
      bikeImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBTaY5bFQq-3Vw6g5k_R8rQ1cs8a7YIT6q4_36iLkvN0u7r7f2h3Xr8qhq5Cw8Gq7cn6V2XFYD0K2fKX1txgD2tQ1-3U0uVJIXm7x4C7w7uZp3NcMSm2Bf6G2tBf0xDQJ8eBmY7H8Xl6r2R_1XkW7cQvv0F2Y9sYQ3NFXCmoj9r6cScsF6a3cV3J01jE8AVm4H_2h1W4zP1l4Tq9N8xV6j7h0",
      performanceImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC2O2S0oO7Q4R6phl8HZx7Q6q_0g0y84W6V3Z2g9gO7h8uO1b0pE9t2y2Z0wH2bK2Z5oXb4QW0R2z3w0c8G7O4y4c6s5y1p2p5g6a7b8c9d0e1f2g3h4i5j6k7l8m9n0",
    },

    {
      slug: "lr-cruiser-950",
      imagen:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBTcceMEiH_cM4BUDxuVHIDYtEbyWpmrNJupPsgUH_WVr_8omo7fJuRE05q-mhiIrog4rC2GhLkTjWp-uCPlwCBgChbKm7Y06vAN7acplrpRLw1aKmFjcHMcWyXxVLDE1BiQdm-sqWJ5AZ7XCbddTli9RZfMIdenAfGaR387X7YxESjGhZuoruFKPaCTy5_ibrA8wnn16IlUDnP2UN8NRSz7IgfWjyBMyLKlq0obEkyE9Z2PjXMHfrEk5Fzf0rabj4iD54XHJN6YA",
      titulo: "LR-Cruiser 950",
      descripcion: "Potencia y presencia en cada kilómetro, un icono de la carretera.",
      precio: 21400,
      heroTagline: "Cruiser legendaria",
      heroTitle: "RUGE CON",
      heroHighlight: "ESTILO.",
      heroDescription:
        "Diseño musculoso con un motor lleno de carácter. Perfecta para recorrer la ciudad y la carretera con autoridad.",
      priceSoles: "S/ 78,900",
      priceUsd: "$ 21,400 USD",
      power: "95 HP",
      torque: "96 Nm",
      weight: "220 kg",
      heroImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCwXr9lOFn53oB0h2MTVwX8qH0wqE4dQol0ZxHk45vW6Kz8rwk1Jr3tLkq3O3l0F7Q6a3r0P1S4q9M3G8s8m4g9T4v2D2y5c1s4l7y8t4w9f4j6n1",
      bikeImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD4ZQfC-3fSkG6H4Z2K7yC7s8qO5V5v7J7j9mJ3r1s3d7g6m7y7y8k2p6n4m6c5m2j6r3s2d9",
      performanceImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA6n7y2a1x8y7n7x4n3j2h1j5k7c8b7n6m5v4c3x2z1a0s9d8f7g6h5j4k3l2",
    },

    // DUPLICADOS COMO EJEMPLO PARA LLENAR EL GRID
    {
      slug: "lr-cruiser-950-clasica",
      imagen:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBTcceMEiH_cM4BUDxuVHIDYtEbyWpmrNJupPsgUH_WVr_8omo7fJuRE05q-mhiIrog4rC2GhLkTjWp-uCPlwCBgChbKm7Y06vAN7acplrpRLw1aKmFjcHMcWyXxVLDE1BiQdm-sqWJ5AZ7XCbddTli9RZfMIdenAfGaR387X7YxESjGhZuoruFKPaCTy5_ibrA8wnn16IlUDnP2UN8NRSz7IgfWjyBMyLKlq0obEkyE9Z2PjXMHfrEk5Fzf0rabj4iD54XHJN6YA",
      titulo: "LR-Cruiser 950",
      descripcion: "Potencia y presencia en cada kilómetro, un icono de la carretera.",
      precio: 21400,
      heroTagline: "Cruiser legendaria",
      heroTitle: "RUGE CON",
      heroHighlight: "ESTILO.",
      heroDescription:
        "Diseño musculoso con un motor lleno de carácter. Perfecta para recorrer la ciudad y la carretera con autoridad.",
      priceSoles: "S/ 78,900",
      priceUsd: "$ 21,400 USD",
      power: "95 HP",
      torque: "96 Nm",
      weight: "220 kg",
      heroImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCwXr9lOFn53oB0h2MTVwX8qH0wqE4dQol0ZxHk45vW6Kz8rwk1Jr3tLkq3O3l0F7Q6a3r0P1S4q9M3G8s8m4g9T4v2D2y5c1s4l7y8t4w9f4j6n1",
      bikeImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD4ZQfC-3fSkG6H4Z2K7yC7s8qO5V5v7J7j9mJ3r1s3d7g6m7y7y8k2p6n4m6c5m2j6r3s2d9",
      performanceImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA6n7y2a1x8y7n7x4n3j2h1j5k7c8b7n6m5v4c3x2z1a0s9d8f7g6h5j4k3l2",
    },

    {
      slug: "lr-cruiser-950-nocturna",
      imagen:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBTcceMEiH_cM4BUDxuVHIDYtEbyWpmrNJupPsgUH_WVr_8omo7fJuRE05q-mhiIrog4rC2GhLkTjWp-uCPlwCBgChbKm7Y06vAN7acplrpRLw1aKmFjcHMcWyXxVLDE1BiQdm-sqWJ5AZ7XCbddTli9RZfMIdenAfGaR387X7YxESjGhZuoruFKPaCTy5_ibrA8wnn16IlUDnP2UN8NRSz7IgfWjyBMyLKlq0obEkyE9Z2PjXMHfrEk5Fzf0rabj4iD54XHJN6YA",
      titulo: "LR-Cruiser 950",
      descripcion: "Potencia y presencia en cada kilómetro, un icono de la carretera.",
      precio: 21400,
      heroTagline: "Cruiser legendaria",
      heroTitle: "RUGE CON",
      heroHighlight: "ESTILO.",
      heroDescription:
        "Diseño musculoso con un motor lleno de carácter. Perfecta para recorrer la ciudad y la carretera con autoridad.",
      priceSoles: "S/ 78,900",
      priceUsd: "$ 21,400 USD",
      power: "95 HP",
      torque: "96 Nm",
      weight: "220 kg",
      heroImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCwXr9lOFn53oB0h2MTVwX8qH0wqE4dQol0ZxHk45vW6Kz8rwk1Jr3tLkq3O3l0F7Q6a3r0P1S4q9M3G8s8m4g9T4v2D2y5c1s4l7y8t4w9f4j6n1",
      bikeImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD4ZQfC-3fSkG6H4Z2K7yC7s8qO5V5v7J7j9mJ3r1s3d7g6m7y7y8k2p6n4m6c5m2j6r3s2d9",
      performanceImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA6n7y2a1x8y7n7x4n3j2h1j5k7c8b7n6m5v4c3x2z1a0s9d8f7g6h5j4k3l2",
    },

    {
      slug: "lr-cruiser-950-edicion",
      imagen:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBTcceMEiH_cM4BUDxuVHIDYtEbyWpmrNJupPsgUH_WVr_8omo7fJuRE05q-mhiIrog4rC2GhLkTjWp-uCPlwCBgChbKm7Y06vAN7acplrpRLw1aKmFjcHMcWyXxVLDE1BiQdm-sqWJ5AZ7XCbddTli9RZfMIdenAfGaR387X7YxESjGhZuoruFKPaCTy5_ibrA8wnn16IlUDnP2UN8NRSz7IgfWjyBMyLKlq0obEkyE9Z2PjXMHfrEk5Fzf0rabj4iD54XHJN6YA",
      titulo: "LR-Cruiser 950",
      descripcion: "Potencia y presencia en cada kilómetro, un icono de la carretera.",
      precio: 21400,
      heroTagline: "Cruiser legendaria",
      heroTitle: "RUGE CON",
      heroHighlight: "ESTILO.",
      heroDescription:
        "Diseño musculoso con un motor lleno de carácter. Perfecta para recorrer la ciudad y la carretera con autoridad.",
      priceSoles: "S/ 78,900",
      priceUsd: "$ 21,400 USD",
      power: "95 HP",
      torque: "96 Nm",
      weight: "220 kg",
      heroImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCwXr9lOFn53oB0h2MTVwX8qH0wqE4dQol0ZxHk45vW6Kz8rwk1Jr3tLkq3O3l0F7Q6a3r0P1S4q9M3G8s8m4g9T4v2D2y5c1s4l7y8t4w9f4j6n1",
      bikeImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD4ZQfC-3fSkG6H4Z2K7yC7s8qO5V5v7J7j9mJ3r1s3d7g6m7y7y8k2p6n4m6c5m2j6r3s2d9",
      performanceImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA6n7y2a1x8y7n7x4n3j2h1j5k7c8b7n6m5v4c3x2z1a0s9d8f7g6h5j4k3l2",
    },

    {
      slug: "lr-cruiser-950-navy",
      imagen:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBTcceMEiH_cM4BUDxuVHIDYtEbyWpmrNJupPsgUH_WVr_8omo7fJuRE05q-mhiIrog4rC2GhLkTjWp-uCPlwCBgChbKm7Y06vAN7acplrpRLw1aKmFjcHMcWyXxVLDE1BiQdm-sqWJ5AZ7XCbddTli9RZfMIdenAfGaR387X7YxESjGhZuoruFKPaCTy5_ibrA8wnn16IlUDnP2UN8NRSz7IgfWjyBMyLKlq0obEkyE9Z2PjXMHfrEk5Fzf0rabj4iD54XHJN6YA",
      titulo: "LR-Cruiser 950",
      descripcion: "Potencia y presencia en cada kilómetro, un icono de la carretera.",
      precio: 21400,
      heroTagline: "Cruiser legendaria",
      heroTitle: "RUGE CON",
      heroHighlight: "ESTILO.",
      heroDescription:
        "Diseño musculoso con un motor lleno de carácter. Perfecta para recorrer la ciudad y la carretera con autoridad.",
      priceSoles: "S/ 78,900",
      priceUsd: "$ 21,400 USD",
      power: "95 HP",
      torque: "96 Nm",
      weight: "220 kg",
      heroImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCwXr9lOFn53oB0h2MTVwX8qH0wqE4dQol0ZxHk45vW6Kz8rwk1Jr3tLkq3O3l0F7Q6a3r0P1S4q9M3G8s8m4g9T4v2D2y5c1s4l7y8t4w9f4j6n1",
      bikeImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD4ZQfC-3fSkG6H4Z2K7yC7s8qO5V5v7J7j9mJ3r1s3d7g6m7y7y8k2p6n4m6c5m2j6r3s2d9",
      performanceImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA6n7y2a1x8y7n7x4n3j2h1j5k7c8b7n6m5v4c3x2z1a0s9d8f7g6h5j4k3l2",
    },

    {
      slug: "lr-cruiser-950-matte",
      imagen:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBTcceMEiH_cM4BUDxuVHIDYtEbyWpmrNJupPsgUH_WVr_8omo7fJuRE05q-mhiIrog4rC2GhLkTjWp-uCPlwCBgChbKm7Y06vAN7acplrpRLw1aKmFjcHMcWyXxVLDE1BiQdm-sqWJ5AZ7XCbddTli9RZfMIdenAfGaR387X7YxESjGhZuoruFKPaCTy5_ibrA8wnn16IlUDnP2UN8NRSz7IgfWjyBMyLKlq0obEkyE9Z2PjXMHfrEk5Fzf0rabj4iD54XHJN6YA",
      titulo: "LR-Cruiser 950",
      descripcion: "Potencia y presencia en cada kilómetro, un icono de la carretera.",
      precio: 21400,
      heroTagline: "Cruiser legendaria",
      heroTitle: "RUGE CON",
      heroHighlight: "ESTILO.",
      heroDescription:
        "Diseño musculoso con un motor lleno de carácter. Perfecta para recorrer la ciudad y la carretera con autoridad.",
      priceSoles: "S/ 78,900",
      priceUsd: "$ 21,400 USD",
      power: "95 HP",
      torque: "96 Nm",
      weight: "220 kg",
      heroImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCwXr9lOFn53oB0h2MTVwX8qH0wqE4dQol0ZxHk45vW6Kz8rwk1Jr3tLkq3O3l0F7Q6a3r0P1S4q9M3G8s8m4g9T4v2D2y5c1s4l7y8t4w9f4j6n1",
      bikeImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD4ZQfC-3fSkG6H4Z2K7yC7s8qO5V5v7J7j9mJ3r1s3d7g6m7y7y8k2p6n4m6c5m2j6r3s2d9",
      performanceImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA6n7y2a1x8y7n7x4n3j2h1j5k7c8b7n6m5v4c3x2z1a0s9d8f7g6h5j4k3l2",
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
      {motos.map((moto, index) => (
        <MotoCard
          key={moto.slug || index}
          imagen={moto.imagen}
          titulo={moto.titulo}
          descripcion={moto.descripcion}
          precio={moto.precio}
          slug={moto.slug}
          moto={moto}
        />
      ))}
    </section>
  );
};

export default CatalogoGrid;
