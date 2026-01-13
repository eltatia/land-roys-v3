import React from 'react'
import RepuestosHeader from '../../../components/client/repuestos/RepuestosHeader'
import RepuestosGrid from '../../../components/client/repuestos/RepuestosGrid'


const Repuestos = () => {
  return (
    <div className="flex-1 py-10 lg:pl-8">
      <RepuestosHeader />
      <RepuestosGrid />
    </div>
  )
}

export default Repuestos
