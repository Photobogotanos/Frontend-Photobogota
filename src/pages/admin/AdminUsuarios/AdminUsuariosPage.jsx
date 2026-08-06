import PageContainer from "@/components/common/PageContainer/PageContainer";
import { useNavigate } from "react-router-dom";
import { FaUserPlus, FaUsers } from "react-icons/fa";
import "./AdminUsuariosPage.css";
import { useState } from "react";
import ListaUsuarios from "@/components/admin/AdminUsuarios/ListaUsuarios";
import PageHeader from "@/components/common/PageHeader/PageHeader";

const AdminUsuariosPage = () => {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCrearUsuario = () => {
    navigate("/admin/crear-cuentas");
  };

  const handleUsuarioCreado = () => {
    // Refrescar la lista cuando se crea un nuevo usuario
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <PageContainer className="admin-usuarios-page">
      <div className="admin-usuarios-toolbar">
        <PageHeader
          subtitle="Gestión de Usuarios"
          title="Usuarios"
          icon={<FaUsers />}
          description="Administra las cuentas de usuarios de la plataforma"
        />
        <button
          type="button"
          className="btn-crear-usuario"
          onClick={handleCrearUsuario}
        >
          <FaUserPlus />
          <span>Crear Nuevo Usuario</span>
        </button>
      </div>

      <div className="admin-usuarios-content">
        <ListaUsuarios key={refreshKey} onUsuarioCreado={handleUsuarioCreado} />
      </div>
    </PageContainer>
  );
};

export default AdminUsuariosPage;
