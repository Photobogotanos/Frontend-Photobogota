import EditarLocal from "@/components/socio/EditarLocal/EditarLocal";
import PageContainer from "@/components/common/PageContainer/PageContainer";

const EditarLocalPage = () => {
  return (
    <PageContainer className="editar-local" fluid={false} containerClassName="">
      <EditarLocal />
    </PageContainer>
  );
};

export default EditarLocalPage;