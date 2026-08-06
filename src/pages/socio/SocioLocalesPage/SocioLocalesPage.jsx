import "./SocioLocalesPage.css";
import SocioLocales from "@/components/socio/SocioLocales/SocioLocales";
import PageContainer from "@/components/common/PageContainer/PageContainer";

const SocioLocalesPage = () => {
  return (
    <PageContainer className="locales" fluid={false} containerClassName="">
      <SocioLocales></SocioLocales>
    </PageContainer>
  );
};

export default SocioLocalesPage;
