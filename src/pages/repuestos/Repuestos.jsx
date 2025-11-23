import React from 'react'
import RepuestosHeader from '../../components/repuestos/RepuestosHeader'
import RepuestosGrid from '../../components/repuestos/RepuestosGrid'


const Repuestos = () => {
  return (
    <main className="flex-1 py-10 lg:pl-8">
      <RepuestosHeader />
      <RepuestosGrid />
    </main>
  )
}

export default Repuestos
