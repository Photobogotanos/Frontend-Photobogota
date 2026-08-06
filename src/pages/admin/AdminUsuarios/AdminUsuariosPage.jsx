import PageContainer from '@/components/common/PageContainer/PageContainer';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaUsers } from 'react-icons/fa';
import './AdminUsuariosPage.css';
import { useState } from 'react';
import ListaUsuarios from '@/components/admin/AdminUsuarios/ListaUsuarios';

const AdminUsuariosPage = () => {
    const navigate = useNavigate();
    const [refreshKey, setRefreshKey] = useState(0);

    const handleCrearUsuario = () => {
        navigate('/admin/crear-cuentas');
    };

    const handleUsuarioCreado = () => {
        // Refrescar la lista cuando se crea un nuevo usuario
        setRefreshKey(prev => prev + 1);
    };

    return (
        <PageContainer className="admin-usuarios-page">
                {/* Header con acciones */}
                <div className="usuarios-page-header">
                    <div className="header-left">
                        <h1 className="page-title">
                            <FaUsers className="title-icon" />
                            Gestión de Usuarios
                        </h1>
                        <p className="page-subtitle">
                            Administra las cuentas de usuarios de la plataforma
                        </p>
                    </div>
                    <button type="button" className="btn-crear-usuario" onClick={handleCrearUsuario}>
                        <FaUserPlus /> Crear Nuevo Usuario
                    </button>
                </div>

                <ListaUsuarios key={refreshKey} onUsuarioCreado={handleUsuarioCreado} />
        </PageContainer>
    );
};

export default AdminUsuariosPage;