import PageContainer from "@/components/common/PageContainer/PageContainer";
import EnviarNotificacion from "@/components/admin/EnviarNotificacion/EnviarNotificacion";
import "./EnviarNotificacionPage.css";

const EnviarNotificacionPage = () => {
  return (
    <PageContainer className="enviar-notificacion-page">
      <EnviarNotificacion />
    </PageContainer>
  );
};

export default EnviarNotificacionPage;
