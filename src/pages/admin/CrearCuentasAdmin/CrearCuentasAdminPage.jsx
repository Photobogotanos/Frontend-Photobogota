import Container from 'react-bootstrap/Container';
import './CrearCuentasAdminPage.css';
import CrearCuentasAdmin from '@/components/admin/CrearCuentasAdmin/AdminCreacionDeCuentaForm';

const CrearCuentasAdminPage = () => {
  return (
    <div className="crear-cuentas-page">
      <Container fluid className="p-0">
          <CrearCuentasAdmin />
      </Container>
    </div>
  );
};

export default CrearCuentasAdminPage;