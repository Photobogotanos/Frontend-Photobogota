import PageContainer from "@/components/common/PageContainer/PageContainer";
import CrearPublicacionForm from "@/components/spots/CreacionSpotForm/CreacionSpotForm";
import "./CreacionSpotPage.css";

export default function CreacionSpotPage() {
  return (
    <PageContainer className="creacion-spot" fluid={false} containerClassName="mt-3">
      <CrearPublicacionForm></CrearPublicacionForm>
    </PageContainer>
  );
}
