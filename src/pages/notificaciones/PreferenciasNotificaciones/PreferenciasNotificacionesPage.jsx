import PreferenciasNotificaciones from "@/components/notificaciones/PreferenciasNotificaciones/PreferenciasNotificaciones";
import PageContainer from "@/components/common/PageContainer/PageContainer";
import "./PreferenciasNotificacionesPage.css";

const PreferenciasNotificacionesPage = () => {
  return (
    <PageContainer className="preferencias-page mt-3" containerClassName="mt-3">
      <PreferenciasNotificaciones />
    </PageContainer>
  );
};

export default PreferenciasNotificacionesPage;
