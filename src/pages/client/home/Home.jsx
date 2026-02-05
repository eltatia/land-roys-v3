import React from 'react'
import Seccion_Slider from '../../../components/client/home/Seccion_Slider'
import Seccion_top from '../../../components/client/home/Seccion_top'
import Seccion_promociones from '../../../components/client/home/Seccion_promociones'
import Seccion_trayectoria from '../../../components/client/home/Seccion_trayectoria'

const Home = () => {
  return (
    <>
      <Seccion_Slider />

      <Seccion_top/>

      <Seccion_promociones/>

      <Seccion_trayectoria/>
    </>
  )
}

export default Home