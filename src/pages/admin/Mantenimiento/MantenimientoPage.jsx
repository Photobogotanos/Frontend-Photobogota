import Container from "react-bootstrap/Container";
import "./MantenimientoPage.css";
import MantenimientoAdmin from "@/components/admin/Mantenimiento/MantenimientoAdmin";

const MantenimientoPage = () => {
  return (
    <div className="mantenimiento-page">
      <Container fluid className="p-0">
        <MantenimientoAdmin />
      </Container>
    </div>
  );
};

export default MantenimientoPage;
