import Header from "../components/layout/client/Header";
import Footer from "../components/layout/client/Footer";
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
