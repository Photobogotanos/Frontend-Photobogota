import PageContainer from "@/components/common/PageContainer/PageContainer";
import CrearPromocion from "@/components/socio/SocioPromociones/CrearPromocion";
import "./CrearPromocionPage.css";

const CrearPromocionPage = () => {
  return (
    <PageContainer className="crear-promocion mt-3" containerClassName="mt-3">
      <CrearPromocion></CrearPromocion>
    </PageContainer>
  );
};

export default CrearPromocionPage;
