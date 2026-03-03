import React from 'react'
import Seccion_Slider from '../../../components/client/home/Seccion_Slider'
import Seccion_top from '../../../components/client/home/Seccion_top'
import Seccion_promociones from '../../../components/client/home/Seccion_promociones'
import Seccion_trayectoria from '../../../components/client/home/Seccion_trayectoria'
import LazyMount from '../../../components/common/LazyMount'

const SectionFallback = ({ className = 'h-[320px]' }) => (
  <div className={`w-full animate-pulse bg-gray-100 ${className}`} />
)

const Home = () => {
  return (
    <>
      <LazyMount eager fallback={<SectionFallback className="h-[600px] md:h-[85vh]" />}>
        <Seccion_Slider />
      </LazyMount>

      <LazyMount fallback={<SectionFallback className="h-[520px]" />}>
        <Seccion_top />
      </LazyMount>

      <LazyMount fallback={<SectionFallback className="h-[100vh]" />}>
        <Seccion_promociones />
      </LazyMount>

      <LazyMount fallback={<SectionFallback className="h-[260px]" />}>
        <Seccion_trayectoria />
      </LazyMount>
    </>
  )
}

export default Home
