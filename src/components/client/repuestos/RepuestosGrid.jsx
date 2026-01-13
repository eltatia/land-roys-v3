import React from 'react'
import RepuestoCard from './RepuestoCard'

const data = [
  {
    title: "Pastillas de Freno Sinterizadas",
    description: "Máxima potencia de frenado y durabilidad para tu seguridad.",
    price: "75.99",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDdonhDrid9F3lrJRj5m-kKPaD6b2YwsGybyrNuK2bowZ9ec82Lwk7X9PJw3jRIPpCer897LCgedegyt2wze48AwHWnzCSUdeYe0XydzQk_RwnurHlo_w5fPHdavFWXO2MJ2yE0lMt_-EGSj1BRp1toSkArKo0H32h7YwaqE20S_IGyAjtkv6ieBhoUh8Ajyh6gQZbPAJ3DuqCc-eJAoyNx9IVPNeyetxsXI8Q5dHwVQ8DBUlpWCjjGyF4cXTtpSLYkMKMSGoNGTA"
  },
  {
    title: "Filtro de Aire K&N",
    description: "Aumenta el flujo de aire y la potencia de tu motor.",
    price: "55.00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCovG1NBcp7xesFZr3HekOy2F34OCmSICyr-L-25XmqFoHd-QPlfWSI_EBvuObNsa9hZmqf69HGX9Vs9WUS2_MY2_Cu9rG8ZULj0zoPYfrRRCL5qnwJXv75qPPe7gTQ6MST0mjlgGJZVDX66nuaREkOAdqn5QltbuvPBa7DDeFNIidGoR8IZynsy60oYSqQ-0gOv6MVsUTb5Ldq5Um_dUsxOmoUGqpZkFRR7LkpRZ-LeGhZq1pOuiP5SXA3oBCQqxTR2kWwLyMhvQ"
  },
  {
    title: "Kit de Arrastre DID",
    description: "Cadena y piñones de alta resistencia para un rendimiento óptimo.",
    price: "189.50",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBTcceMEiH_cM4BUDxuVHIDYtEbyWpmrNJupPsgUH_WVr_8omo7fJuRE05q-mhiIrog4rC2GhLkTjWp-uCPlwCBgChbKm7Y06vAN7acplrpRLw1aKmFjcHMcWyXxVLDE1BiQdm-sqWJ5AZ7XCbddTli9RZfMIdenAfGaR387X7YxESjGhZuoruFKPaCTy5_ibrA8wnn16IlUDnP2UN8NRSz7IgfWjyBMyLKlq0obEkyE9Z2PjXMHfrEk5Fzf0rabj4iD54XHJN6YA"
  },
    {
    title: "Kit de Arrastre DID",
    description: "Cadena y piñones de alta resistencia para un rendimiento óptimo.",
    price: "189.50",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBTcceMEiH_cM4BUDxuVHIDYtEbyWpmrNJupPsgUH_WVr_8omo7fJuRE05q-mhiIrog4rC2GhLkTjWp-uCPlwCBgChbKm7Y06vAN7acplrpRLw1aKmFjcHMcWyXxVLDE1BiQdm-sqWJ5AZ7XCbddTli9RZfMIdenAfGaR387X7YxESjGhZuoruFKPaCTy5_ibrA8wnn16IlUDnP2UN8NRSz7IgfWjyBMyLKlq0obEkyE9Z2PjXMHfrEk5Fzf0rabj4iD54XHJN6YA"
  },
    {
    title: "Kit de Arrastre DID",
    description: "Cadena y piñones de alta resistencia para un rendimiento óptimo.",
    price: "189.50",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBTcceMEiH_cM4BUDxuVHIDYtEbyWpmrNJupPsgUH_WVr_8omo7fJuRE05q-mhiIrog4rC2GhLkTjWp-uCPlwCBgChbKm7Y06vAN7acplrpRLw1aKmFjcHMcWyXxVLDE1BiQdm-sqWJ5AZ7XCbddTli9RZfMIdenAfGaR387X7YxESjGhZuoruFKPaCTy5_ibrA8wnn16IlUDnP2UN8NRSz7IgfWjyBMyLKlq0obEkyE9Z2PjXMHfrEk5Fzf0rabj4iD54XHJN6YA"
  },
    {
    title: "Kit de Arrastre DID",
    description: "Cadena y piñones de alta resistencia para un rendimiento óptimo.",
    price: "189.50",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBTcceMEiH_cM4BUDxuVHIDYtEbyWpmrNJupPsgUH_WVr_8omo7fJuRE05q-mhiIrog4rC2GhLkTjWp-uCPlwCBgChbKm7Y06vAN7acplrpRLw1aKmFjcHMcWyXxVLDE1BiQdm-sqWJ5AZ7XCbddTli9RZfMIdenAfGaR387X7YxESjGhZuoruFKPaCTy5_ibrA8wnn16IlUDnP2UN8NRSz7IgfWjyBMyLKlq0obEkyE9Z2PjXMHfrEk5Fzf0rabj4iD54XHJN6YA"
  },
    {
    title: "Kit de Arrastre DID",
    description: "Cadena y piñones de alta resistencia para un rendimiento óptimo.",
    price: "189.50",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBTcceMEiH_cM4BUDxuVHIDYtEbyWpmrNJupPsgUH_WVr_8omo7fJuRE05q-mhiIrog4rC2GhLkTjWp-uCPlwCBgChbKm7Y06vAN7acplrpRLw1aKmFjcHMcWyXxVLDE1BiQdm-sqWJ5AZ7XCbddTli9RZfMIdenAfGaR387X7YxESjGhZuoruFKPaCTy5_ibrA8wnn16IlUDnP2UN8NRSz7IgfWjyBMyLKlq0obEkyE9Z2PjXMHfrEk5Fzf0rabj4iD54XHJN6YA"
  },
    {
    title: "Kit de Arrastre DID",
    description: "Cadena y piñones de alta resistencia para un rendimiento óptimo.",
    price: "189.50",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBTcceMEiH_cM4BUDxuVHIDYtEbyWpmrNJupPsgUH_WVr_8omo7fJuRE05q-mhiIrog4rC2GhLkTjWp-uCPlwCBgChbKm7Y06vAN7acplrpRLw1aKmFjcHMcWyXxVLDE1BiQdm-sqWJ5AZ7XCbddTli9RZfMIdenAfGaR387X7YxESjGhZuoruFKPaCTy5_ibrA8wnn16IlUDnP2UN8NRSz7IgfWjyBMyLKlq0obEkyE9Z2PjXMHfrEk5Fzf0rabj4iD54XHJN6YA"
  },
  {
    title: "Pastillas de Freno Sinterizadas",
    description: "Máxima potencia de frenado y durabilidad para tu seguridad.",
    price: "75.99",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDdonhDrid9F3lrJRj5m-kKPaD6b2YwsGybyrNuK2bowZ9ec82Lwk7X9PJw3jRIPpCer897LCgedegyt2wze48AwHWnzCSUdeYe0XydzQk_RwnurHlo_w5fPHdavFWXO2MJ2yE0lMt_-EGSj1BRp1toSkArKo0H32h7YwaqE20S_IGyAjtkv6ieBhoUh8Ajyh6gQZbPAJ3DuqCc-eJAoyNx9IVPNeyetxsXI8Q5dHwVQ8DBUlpWCjjGyF4cXTtpSLYkMKMSGoNGTA"
  },
  {
    title: "Pastillas de Freno Sinterizadas",
    description: "Máxima potencia de frenado y durabilidad para tu seguridad.",
    price: "75.99",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDdonhDrid9F3lrJRj5m-kKPaD6b2YwsGybyrNuK2bowZ9ec82Lwk7X9PJw3jRIPpCer897LCgedegyt2wze48AwHWnzCSUdeYe0XydzQk_RwnurHlo_w5fPHdavFWXO2MJ2yE0lMt_-EGSj1BRp1toSkArKo0H32h7YwaqE20S_IGyAjtkv6ieBhoUh8Ajyh6gQZbPAJ3DuqCc-eJAoyNx9IVPNeyetxsXI8Q5dHwVQ8DBUlpWCjjGyF4cXTtpSLYkMKMSGoNGTA"
  },
  {
    title: "Pastillas de Freno Sinterizadas",
    description: "Máxima potencia de frenado y durabilidad para tu seguridad.",
    price: "75.99",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDdonhDrid9F3lrJRj5m-kKPaD6b2YwsGybyrNuK2bowZ9ec82Lwk7X9PJw3jRIPpCer897LCgedegyt2wze48AwHWnzCSUdeYe0XydzQk_RwnurHlo_w5fPHdavFWXO2MJ2yE0lMt_-EGSj1BRp1toSkArKo0H32h7YwaqE20S_IGyAjtkv6ieBhoUh8Ajyh6gQZbPAJ3DuqCc-eJAoyNx9IVPNeyetxsXI8Q5dHwVQ8DBUlpWCjjGyF4cXTtpSLYkMKMSGoNGTA"
  },
  {
    title: "Pastillas de Freno Sinterizadas",
    description: "Máxima potencia de frenado y durabilidad para tu seguridad.",
    price: "75.99",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDdonhDrid9F3lrJRj5m-kKPaD6b2YwsGybyrNuK2bowZ9ec82Lwk7X9PJw3jRIPpCer897LCgedegyt2wze48AwHWnzCSUdeYe0XydzQk_RwnurHlo_w5fPHdavFWXO2MJ2yE0lMt_-EGSj1BRp1toSkArKo0H32h7YwaqE20S_IGyAjtkv6ieBhoUh8Ajyh6gQZbPAJ3DuqCc-eJAoyNx9IVPNeyetxsXI8Q5dHwVQ8DBUlpWCjjGyF4cXTtpSLYkMKMSGoNGTA"
  },
  {
    title: "Pastillas de Freno Sinterizadas",
    description: "Máxima potencia de frenado y durabilidad para tu seguridad.",
    price: "75.99",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDdonhDrid9F3lrJRj5m-kKPaD6b2YwsGybyrNuK2bowZ9ec82Lwk7X9PJw3jRIPpCer897LCgedegyt2wze48AwHWnzCSUdeYe0XydzQk_RwnurHlo_w5fPHdavFWXO2MJ2yE0lMt_-EGSj1BRp1toSkArKo0H32h7YwaqE20S_IGyAjtkv6ieBhoUh8Ajyh6gQZbPAJ3DuqCc-eJAoyNx9IVPNeyetxsXI8Q5dHwVQ8DBUlpWCjjGyF4cXTtpSLYkMKMSGoNGTA"
  },
  {
    title: "Pastillas de Freno Sinterizadas",
    description: "Máxima potencia de frenado y durabilidad para tu seguridad.",
    price: "75.99",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDdonhDrid9F3lrJRj5m-kKPaD6b2YwsGybyrNuK2bowZ9ec82Lwk7X9PJw3jRIPpCer897LCgedegyt2wze48AwHWnzCSUdeYe0XydzQk_RwnurHlo_w5fPHdavFWXO2MJ2yE0lMt_-EGSj1BRp1toSkArKo0H32h7YwaqE20S_IGyAjtkv6ieBhoUh8Ajyh6gQZbPAJ3DuqCc-eJAoyNx9IVPNeyetxsXI8Q5dHwVQ8DBUlpWCjjGyF4cXTtpSLYkMKMSGoNGTA"
  },
  {
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
        <RepuestoCard key={index} {...item} />
      ))}
    </div>
  )
}

export default RepuestosGrid
