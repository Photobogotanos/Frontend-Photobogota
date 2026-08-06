import PageContainer from "@/components/common/PageContainer/PageContainer";
import FormularioCreacion from "@/components/auth/CreacionDeCuentaForm/CreacionDeCuentaForm";
import "./CreacionDeCuentaPage.css";

function CreacionDeCuentaPage() {
  return (
    <PageContainer className="creacion-cuenta" fluid={false} containerClassName="">
      <FormularioCreacion></FormularioCreacion>
    </PageContainer>
  );
}

export default CreacionDeCuentaPage;
