import React from 'react'
import HeroSection from '../../../components/client/home/HeroSection';
import ModelsSection from '../../../components/client/home/ModelsSection';
import PilaresSection from '../../../components/client/home/PilaresSection';
import ModeloInsigniaSection from '../../../components/client/home/ModeloInsigniaSection';
import TrustCounter from '../../../components/client/home/TrustCounter';



const Home = () => {
  return (
    <>
      <HeroSection />
      <TrustCounter />
      <ModelsSection />
      <PilaresSection />
      <ModeloInsigniaSection />
    </>
  )
}

export default Home;