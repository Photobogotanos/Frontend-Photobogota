import PageContainer from "@/components/common/PageContainer/PageContainer";
import "./ContrasenaNuevaPage.css";
import PasswordResetForm from "../../../components/auth/RecuperarContraForm/PasswordResetForm";

function ContrasenaNuevaPage() {
  return (
    <PageContainer className="nueva-contrasena" fluid={false} containerClassName="">
      <PasswordResetForm></PasswordResetForm>
    </PageContainer>
  );
}

export default ContrasenaNuevaPage;
