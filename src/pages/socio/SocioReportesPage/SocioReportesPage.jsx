import Container from "react-bootstrap/Container";
import DashboardReportes from "@/components/reportes/DashboardReportes/DashboardReportes";
import "./SocioReportesPage.css";

// HU 15: Gestión de reportes por socios. Reutiliza el mismo dashboard que
// usan MOD y ADMIN (@/components/reportes/DashboardReportes) porque las
// acciones son las mismas (ver, cambiar estado, escalar); lo que cambia es
// el rol del usuario autenticado, y de eso ya se encarga el backend
// filtrando por asignadoA=SOCIO + propietarioSocio.
const SocioReportesPage = () => {
  return (
    <div className="socio-reportes-page">
      <Container fluid className="p-0">
        <DashboardReportes />
      </Container>
    </div>
  );
};

export default SocioReportesPage;
