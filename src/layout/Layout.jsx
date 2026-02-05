import { Outlet } from 'react-router-dom'
import Header from '../components/common/Header.jsx'
import Footer from '../components/common/Footer.jsx'

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 main-content">
        <Outlet /> {/* Aquí se renderizarán las rutas hijas */}
      </main>
      <Footer />
    </div>
  )
}

export default Layout

