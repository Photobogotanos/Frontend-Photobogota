import Container from "react-bootstrap/Container";
import DashboardReportes from "@/components/reportes/DashboardReportes/DashboardReportes";
import "./DashboardReportesPage.css";

const DashboardReportesPage = () => {
  return (
    <div className="dashboard-reportes-page">
      <Container fluid className="p-0">
        <DashboardReportes />
      </Container>
    </div>
  );
};

export default DashboardReportesPage;
