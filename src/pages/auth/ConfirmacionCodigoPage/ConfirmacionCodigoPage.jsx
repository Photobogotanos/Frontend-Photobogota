import PageContainer from "@/components/common/PageContainer/PageContainer";
import ConfirmacionCodigoForm from "@/components/auth/ConfirmacionCodigoForm/ConfirmacionCodigoForm";
import "./ConfirmacionCodigoPage.css";
export default function ConfirmacionCodigoPage() {
  return (
    <PageContainer className="confirmacion-codigo" fluid={false} containerClassName="">
      <ConfirmacionCodigoForm></ConfirmacionCodigoForm>
    </PageContainer>
  );
}
