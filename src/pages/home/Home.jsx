import React from 'react'
import HeroSection from '../../components/home/HeroSection';
import ModelsSection from '../../components/home/ModelsSection';
import PilaresSection from '../../components/home/PilaresSection';
import ModeloInsigniaSection from '../../components/home/ModeloInsigniaSection';
import TrustCounter from '../../components/home/TrustCounter';


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