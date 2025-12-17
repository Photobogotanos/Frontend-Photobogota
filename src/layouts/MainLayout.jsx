import MenuSuperior from "@/components/layout/MenuSuperior/MenuSuperior";
import Footer from "@/components/layout/Footer/Footer";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <MenuSuperior />
      <Outlet />
      <Footer />
    </>
  );
};

export default MainLayout;
