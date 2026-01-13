import RepuestoCard from './RepuestoCard'
import { repuestos } from "../../../data/repuestos"

const RepuestosGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
      {repuestos.map((item) => (
        <RepuestoCard key={item.id} {...item} />
      ))}
    </div>
  )
}

export default RepuestosGrid
