import Container from "react-bootstrap/Container";
import DashboardEliminaciones from "@/components/admin/AdminEliminaciones/DashboardEliminaciones";
import "./AdminEliminacionesPage.css";

const AdminEliminacionesPage = () => {
  return (
    <div className="admin-eliminaciones-page">
      <Container fluid className="p-0">
        <DashboardEliminaciones />
      </Container>
    </div>
  );
};

export default AdminEliminacionesPage;
