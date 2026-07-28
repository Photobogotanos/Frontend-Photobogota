import Container from "react-bootstrap/Container";
import DashboardReportes from "@/components/reportes/DashboardReportes/DashboardReportes";
import "./AdminReportesPage.css";

const AdminReportesPage = () => {
  return (
    <div className="admin-reportes-page">
      <Container fluid className="p-0">
        <DashboardReportes />
      </Container>
    </div>
  );
};

export default AdminReportesPage;
