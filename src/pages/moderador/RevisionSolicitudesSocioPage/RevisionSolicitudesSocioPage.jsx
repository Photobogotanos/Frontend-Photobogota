import SolicitudSocio from "@/components/moderador/SolicitudSocio/SolicitudSocio";
import "./RevisionSolicitudesSocioPage.css";
import PageContainer from "@/components/common/PageContainer/PageContainer";

export default function RevisionSolicitudesSocioPage() {
  return (
    <PageContainer className="revision-solicitudes-socio mt-5" fluid={false} containerClassName="mt-3">
      <SolicitudSocio></SolicitudSocio>
    </PageContainer>
  );
}
