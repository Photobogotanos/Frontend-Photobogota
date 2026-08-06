import "./SocioPromocionesPage.css";
import SocioPromociones from "@/components/socio/SocioPromociones/SocioPromociones";
import PageContainer from "@/components/common/PageContainer/PageContainer";

const SocioPromocionesPage = () => {
  return (
    <PageContainer className="socio-promociones" fluid={false} containerClassName="">
      <SocioPromociones></SocioPromociones>
    </PageContainer>
  );
};

export default SocioPromocionesPage;
