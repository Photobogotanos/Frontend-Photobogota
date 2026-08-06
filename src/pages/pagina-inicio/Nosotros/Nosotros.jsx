import "./Nosotros.css";
import NosotrosContent from "@/components/pagina-inicio/NosotrosContent/NosotrosContent";
import PageContainer from "@/components/common/PageContainer/PageContainer";

const Nosotros = () => {
  return (
    <PageContainer className="nosotros-page" fluid={false} containerClassName="mt-3">
      <NosotrosContent></NosotrosContent>
    </PageContainer>
  );
};

export default Nosotros;
