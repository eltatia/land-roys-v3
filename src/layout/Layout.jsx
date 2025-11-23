import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Outlet } from "react-router-dom";
import "../styles/Layout.css"; // nuevo

const Layout = () => {
  return (
    <div className="layout-container">

      <Header />

      <main className="layout-main">
        <Outlet />
      </main>

      <Footer />

    </div>
  );
};

export default Layout;
