import RepuestoCard from './RepuestoCard'

const data = [
  {
    slug: "pastillas-freno-sinterizadas",
    title: "Pastillas de Freno Sinterizadas",
    description: "Máxima potencia de frenado y durabilidad para tu seguridad.",
    price: "75.99",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDdonhDrid9F3lrJRj5m-kKPaD6b2YwsGybyrNuK2bowZ9ec82Lwk7X9PJw3jRIPpCer897LCgedegyt2wze48AwHWnzCSUdeYe0XydzQk_RwnurHlo_w5fPHdavFWXO2MJ2yE0lMt_-EGSj1BRp1toSkArKo0H32h7YwaqE20S_IGyAjtkv6ieBhoUh8Ajyh6gQZbPAJ3DuqCc-eJAoyNx9IVPNeyetxsXI8Q5dHwVQ8DBUlpWCjjGyF4cXTtpSLYkMKMSGoNGTA",
    heroTagline: "Frenado profesional",
    heroTitle: "CONTROL",
    heroHighlight: "ABSOLUTO.",
    heroDescription:
      "Pastillas sinterizadas de alto rendimiento, diseñadas para la máxima seguridad en ciudad y carretera.",
    priceSoles: "S/ 289",
    priceUsd: "$ 75.99 USD",
    specPrimary: "Alta fricción",
    specSecondary: "Resistencia térmica",
    specTertiary: "Larga duración",
    heroImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBqD4mUPjQXP0dXUt0L_4FIqQlALrYJpJ9TgVtIQEAyvPCLYr_7PiIluoLxSblj_sao6_d4YRaDa8vEqhkHnWy3Z7059KQnVA0l6FTOtLDtZtjygYb9haX2uM8Co72cKcCudQ-PTwzdx4CB1_1li2Fz2gfkADP74BQ2LuOkgXln2-svKawh59C-bbdGgOlezRCdJwNDmblbupOIxiZ0jdTJqFO4qXv4Ao3E8MCw42Tk_lhadegjcl423Sm423PU32Q9kCewcw8Jj0A",
    performanceImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB0ns6Jhs7h91WgWOFKFl_YnkxGp_HZR7eJEOqN56uO_YNtukStiRf8Z9F51E1xPpusPJ9eYOXaEjeaghzwVKK4sJkvVbqfjnZp-QF1OgyH8kGsVaehKvYBs3Q-VVullqHvS-Dv7GLlK2Wwcb-e4FjLOeZKjEFlp6qXteOBrVAljZw1GISJzL03YA2j99d4t0hoWpg-r1bUWdLv53YoN7IkaIa3ThtfyX16f62526CEoz5HD4PGwrTx-oiGX5zra6zsYrHRTdzyrsA",
  },
  {
    slug: "filtro-aire-kn",
    title: "Filtro de Aire K&N",
    description: "Aumenta el flujo de aire y la potencia de tu motor.",
    price: "55.00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCovG1NBcp7xesFZr3HekOy2F34OCmSICyr-L-25XmqFoHd-QPlfWSI_EBvuObNsa9hZmqf69HGX9Vs9WUS2_MY2_Cu9rG8ZULj0zoPYfrRRCL5qnwJXv75qPPe7gTQ6MST0mjlgGJZVDX66nuaREkOAdqn5QltbuvPBa7DDeFNIidGoR8IZynsy60oYSqQ-0gOv6MVsUTb5Ldq5Um_dUsxOmoUGqpZkFRR7LkpRZ-LeGhZq1pOuiP5SXA3oBCQqxTR2kWwLyMhvQ",
    heroTagline: "Respiración optimizada",
    heroTitle: "MÁS",
    heroHighlight: "POTENCIA.",
    heroDescription:
      "Filtros de alto flujo que protegen el motor y mejoran la respuesta del acelerador en cada recorrido.",
    priceSoles: "S/ 205",
    priceUsd: "$ 55.00 USD",
    specPrimary: "Lavable",
    specSecondary: "Alto flujo",
    specTertiary: "Protección premium",
    heroImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCK54sE7XQqKfaXrj6o8hB9kB2UoN9lX5D9bV6y9pGSL9WUxgH3tV0vQfjZg9hECSBqKSm2m2y4m2sOonfG6Q1GODx1Qep2qZf_aq4D9Yx9r3pYADPjT9qVBScR7wqbK7oDg4nX2s8QYy6rU5zzv6f2X7oa9x2cSeN2myKpwbU8Q9t4J0R6kzQm8G4zM6kC2U2QmwbB7a5xZy2bQZmQW6a7x0EUc8pN2M2m9gPMUR0s4IKR9g",
    performanceImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC2O2S0oO7Q4R6phl8HZx7Q6q_0g0y84W6V3Z2g9gO7h8uO1b0pE9t2y2Z0wH2bK2Z5oXb4QW0R2z3w0c8G7O4y4c6s5y1p2p5g6a7b8c9d0e1f2g3h4i5j6k7l8m9n0",
  },
  {
    slug: "kit-arrastre-did",
    title: "Kit de Arrastre DID",
    description: "Cadena y piñones de alta resistencia para un rendimiento óptimo.",
    price: "189.50",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBTcceMEiH_cM4BUDxuVHIDYtEbyWpmrNJupPsgUH_WVr_8omo7fJuRE05q-mhiIrog4rC2GhLkTjWp-uCPlwCBgChbKm7Y06vAN7acplrpRLw1aKmFjcHMcWyXxVLDE1BiQdm-sqWJ5AZ7XCbddTli9RZfMIdenAfGaR387X7YxESjGhZuoruFKPaCTy5_ibrA8wnn16IlUDnP2UN8NRSz7IgfWjyBMyLKlq0obEkyE9Z2PjXMHfrEk5Fzf0rabj4iD54XHJN6YA",
    heroTagline: "Transmisión eficiente",
    heroTitle: "TRACCIÓN",
    heroHighlight: "TOTAL.",
    heroDescription:
      "Kit completo de cadena y piñones para entregar la potencia de forma suave y segura.",
    priceSoles: "S/ 690",
    priceUsd: "$ 189.50 USD",
    specPrimary: "Acero reforzado",
    specSecondary: "Larga vida útil",
    specTertiary: "Compatibilidad amplia",
    heroImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCwXr9lOFn53oB0h2MTVwX8qH0wqE4dQol0ZxHk45vW6Kz8rwk1Jr3tLkq3O3l0F7Q6a3r0P1S4q9M3G8s8m4g9T4v2D2y5c1s4l7y8t4w9f4j6n1",
    performanceImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA6n7y2a1x8y7n7x4n3j2h1j5k7c8b7n6m5v4c3x2z1a0s9d8f7g6h5j4k3l2",
  },
  {
    slug: "kit-arrastre-did-pro",
    title: "Kit de Arrastre DID",
    description: "Cadena y piñones de alta resistencia para un rendimiento óptimo.",
    price: "189.50",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBTcceMEiH_cM4BUDxuVHIDYtEbyWpmrNJupPsgUH_WVr_8omo7fJuRE05q-mhiIrog4rC2GhLkTjWp-uCPlwCBgChbKm7Y06vAN7acplrpRLw1aKmFjcHMcWyXxVLDE1BiQdm-sqWJ5AZ7XCbddTli9RZfMIdenAfGaR387X7YxESjGhZuoruFKPaCTy5_ibrA8wnn16IlUDnP2UN8NRSz7IgfWjyBMyLKlq0obEkyE9Z2PjXMHfrEk5Fzf0rabj4iD54XHJN6YA"
  },
  {
    slug: "kit-arrastre-did-touring",
    title: "Kit de Arrastre DID",
    description: "Cadena y piñones de alta resistencia para un rendimiento óptimo.",
    price: "189.50",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBTcceMEiH_cM4BUDxuVHIDYtEbyWpmrNJupPsgUH_WVr_8omo7fJuRE05q-mhiIrog4rC2GhLkTjWp-uCPlwCBgChbKm7Y06vAN7acplrpRLw1aKmFjcHMcWyXxVLDE1BiQdm-sqWJ5AZ7XCbddTli9RZfMIdenAfGaR387X7YxESjGhZuoruFKPaCTy5_ibrA8wnn16IlUDnP2UN8NRSz7IgfWjyBMyLKlq0obEkyE9Z2PjXMHfrEk5Fzf0rabj4iD54XHJN6YA"
  },
  {
    slug: "kit-arrastre-did-elite",
    title: "Kit de Arrastre DID",
    description: "Cadena y piñones de alta resistencia para un rendimiento óptimo.",
    price: "189.50",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBTcceMEiH_cM4BUDxuVHIDYtEbyWpmrNJupPsgUH_WVr_8omo7fJuRE05q-mhiIrog4rC2GhLkTjWp-uCPlwCBgChbKm7Y06vAN7acplrpRLw1aKmFjcHMcWyXxVLDE1BiQdm-sqWJ5AZ7XCbddTli9RZfMIdenAfGaR387X7YxESjGhZuoruFKPaCTy5_ibrA8wnn16IlUDnP2UN8NRSz7IgfWjyBMyLKlq0obEkyE9Z2PjXMHfrEk5Fzf0rabj4iD54XHJN6YA"
  },
  {
    slug: "kit-arrastre-did-rally",
    title: "Kit de Arrastre DID",
    description: "Cadena y piñones de alta resistencia para un rendimiento óptimo.",
    price: "189.50",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBTcceMEiH_cM4BUDxuVHIDYtEbyWpmrNJupPsgUH_WVr_8omo7fJuRE05q-mhiIrog4rC2GhLkTjWp-uCPlwCBgChbKm7Y06vAN7acplrpRLw1aKmFjcHMcWyXxVLDE1BiQdm-sqWJ5AZ7XCbddTli9RZfMIdenAfGaR387X7YxESjGhZuoruFKPaCTy5_ibrA8wnn16IlUDnP2UN8NRSz7IgfWjyBMyLKlq0obEkyE9Z2PjXMHfrEk5Fzf0rabj4iD54XHJN6YA"
  },
  {
    slug: "kit-arrastre-did-xtreme",
    title: "Kit de Arrastre DID",
    description: "Cadena y piñones de alta resistencia para un rendimiento óptimo.",
    price: "189.50",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBTcceMEiH_cM4BUDxuVHIDYtEbyWpmrNJupPsgUH_WVr_8omo7fJuRE05q-mhiIrog4rC2GhLkTjWp-uCPlwCBgChbKm7Y06vAN7acplrpRLw1aKmFjcHMcWyXxVLDE1BiQdm-sqWJ5AZ7XCbddTli9RZfMIdenAfGaR387X7YxESjGhZuoruFKPaCTy5_ibrA8wnn16IlUDnP2UN8NRSz7IgfWjyBMyLKlq0obEkyE9Z2PjXMHfrEk5Fzf0rabj4iD54XHJN6YA"
  },
  {
    slug: "kit-arrastre-did-urban",
    title: "Kit de Arrastre DID",
    description: "Cadena y piñones de alta resistencia para un rendimiento óptimo.",
    price: "189.50",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBTcceMEiH_cM4BUDxuVHIDYtEbyWpmrNJupPsgUH_WVr_8omo7fJuRE05q-mhiIrog4rC2GhLkTjWp-uCPlwCBgChbKm7Y06vAN7acplrpRLw1aKmFjcHMcWyXxVLDE1BiQdm-sqWJ5AZ7XCbddTli9RZfMIdenAfGaR387X7YxESjGhZuoruFKPaCTy5_ibrA8wnn16IlUDnP2UN8NRSz7IgfWjyBMyLKlq0obEkyE9Z2PjXMHfrEk5Fzf0rabj4iD54XHJN6YA"
  },
  {
    slug: "pastillas-freno-sinterizadas-plus",
    title: "Pastillas de Freno Sinterizadas",
    description: "Máxima potencia de frenado y durabilidad para tu seguridad.",
    price: "75.99",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDdonhDrid9F3lrJRj5m-kKPaD6b2YwsGybyrNuK2bowZ9ec82Lwk7X9PJw3jRIPpCer897LCgedegyt2wze48AwHWnzCSUdeYe0XydzQk_RwnurHlo_w5fPHdavFWXO2MJ2yE0lMt_-EGSj1BRp1toSkArKo0H32h7YwaqE20S_IGyAjtkv6ieBhoUh8Ajyh6gQZbPAJ3DuqCc-eJAoyNx9IVPNeyetxsXI8Q5dHwVQ8DBUlpWCjjGyF4cXTtpSLYkMKMSGoNGTA"
  },
  {
    slug: "pastillas-freno-sinterizadas-urban",
    title: "Pastillas de Freno Sinterizadas",
    description: "Máxima potencia de frenado y durabilidad para tu seguridad.",
    price: "75.99",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDdonhDrid9F3lrJRj5m-kKPaD6b2YwsGybyrNuK2bowZ9ec82Lwk7X9PJw3jRIPpCer897LCgedegyt2wze48AwHWnzCSUdeYe0XydzQk_RwnurHlo_w5fPHdavFWXO2MJ2yE0lMt_-EGSj1BRp1toSkArKo0H32h7YwaqE20S_IGyAjtkv6ieBhoUh8Ajyh6gQZbPAJ3DuqCc-eJAoyNx9IVPNeyetxsXI8Q5dHwVQ8DBUlpWCjjGyF4cXTtpSLYkMKMSGoNGTA"
  },
  {
    slug: "pastillas-freno-sinterizadas-sport",
    title: "Pastillas de Freno Sinterizadas",
    description: "Máxima potencia de frenado y durabilidad para tu seguridad.",
    price: "75.99",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDdonhDrid9F3lrJRj5m-kKPaD6b2YwsGybyrNuK2bowZ9ec82Lwk7X9PJw3jRIPpCer897LCgedegyt2wze48AwHWnzCSUdeYe0XydzQk_RwnurHlo_w5fPHdavFWXO2MJ2yE0lMt_-EGSj1BRp1toSkArKo0H32h7YwaqE20S_IGyAjtkv6ieBhoUh8Ajyh6gQZbPAJ3DuqCc-eJAoyNx9IVPNeyetxsXI8Q5dHwVQ8DBUlpWCjjGyF4cXTtpSLYkMKMSGoNGTA"
  },
  {
    slug: "pastillas-freno-sinterizadas-gt",
    title: "Pastillas de Freno Sinterizadas",
    description: "Máxima potencia de frenado y durabilidad para tu seguridad.",
    price: "75.99",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDdonhDrid9F3lrJRj5m-kKPaD6b2YwsGybyrNuK2bowZ9ec82Lwk7X9PJw3jRIPpCer897LCgedegyt2wze48AwHWnzCSUdeYe0XydzQk_RwnurHlo_w5fPHdavFWXO2MJ2yE0lMt_-EGSj1BRp1toSkArKo0H32h7YwaqE20S_IGyAjtkv6ieBhoUh8Ajyh6gQZbPAJ3DuqCc-eJAoyNx9IVPNeyetxsXI8Q5dHwVQ8DBUlpWCjjGyF4cXTtpSLYkMKMSGoNGTA"
  },
  {
    slug: "pastillas-freno-sinterizadas-elite",
    title: "Pastillas de Freno Sinterizadas",
    description: "Máxima potencia de frenado y durabilidad para tu seguridad.",
    price: "75.99",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDdonhDrid9F3lrJRj5m-kKPaD6b2YwsGybyrNuK2bowZ9ec82Lwk7X9PJw3jRIPpCer897LCgedegyt2wze48AwHWnzCSUdeYe0XydzQk_RwnurHlo_w5fPHdavFWXO2MJ2yE0lMt_-EGSj1BRp1toSkArKo0H32h7YwaqE20S_IGyAjtkv6ieBhoUh8Ajyh6gQZbPAJ3DuqCc-eJAoyNx9IVPNeyetxsXI8Q5dHwVQ8DBUlpWCjjGyF4cXTtpSLYkMKMSGoNGTA"
  },
  {
    slug: "pastillas-freno-sinterizadas-pro",
    title: "Pastillas de Freno Sinterizadas",
    description: "Máxima potencia de frenado y durabilidad para tu seguridad.",
    price: "75.99",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDdonhDrid9F3lrJRj5m-kKPaD6b2YwsGybyrNuK2bowZ9ec82Lwk7X9PJw3jRIPpCer897LCgedegyt2wze48AwHWnzCSUdeYe0XydzQk_RwnurHlo_w5fPHdavFWXO2MJ2yE0lMt_-EGSj1BRp1toSkArKo0H32h7YwaqE20S_IGyAjtkv6ieBhoUh8Ajyh6gQZbPAJ3DuqCc-eJAoyNx9IVPNeyetxsXI8Q5dHwVQ8DBUlpWCjjGyF4cXTtpSLYkMKMSGoNGTA"
  },
  {
    slug: "pastillas-freno-sinterizadas-max",
    title: "Pastillas de Freno Sinterizadas",
    description: "Máxima potencia de frenado y durabilidad para tu seguridad.",
    price: "75.99",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDdonhDrid9F3lrJRj5m-kKPaD6b2YwsGybyrNuK2bowZ9ec82Lwk7X9PJw3jRIPpCer897LCgedegyt2wze48AwHWnzCSUdeYe0XydzQk_RwnurHlo_w5fPHdavFWXO2MJ2yE0lMt_-EGSj1BRp1toSkArKo0H32h7YwaqE20S_IGyAjtkv6ieBhoUh8Ajyh6gQZbPAJ3DuqCc-eJAoyNx9IVPNeyetxsXI8Q5dHwVQ8DBUlpWCjjGyF4cXTtpSLYkMKMSGoNGTA"
  },
]

const RepuestosGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
      {data.map((item, index) => (
        <RepuestoCard key={item.slug || index} {...item} item={item} />
      ))}
    </div>
  )
}

export default RepuestosGrid
