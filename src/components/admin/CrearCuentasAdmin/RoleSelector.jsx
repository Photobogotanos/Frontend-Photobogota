import Form from "react-bootstrap/Form";
import { FaUserShield, FaUserCog, FaUserFriends, FaUser } from "react-icons/fa";
import RequiredMark from "@/components/common/RequiredMark/RequiredMark";

const ROLES = [
    {
        id: 'admin',
        nombre: 'Administrador',
        icon: <FaUserShield />,
        color: '#f59e0b',
        descripcion: 'Acceso total al sistema, puede gestionar usuarios y configuraciones'
    },
    {
        id: 'mod',
        nombre: 'Moderador',
        icon: <FaUserCog />,
        color: '#3b82f6',
        descripcion: 'Puede moderar contenido y gestionar reportes'
    },
    {
        id: 'socio',
        nombre: 'Socio',
        icon: <FaUserFriends />,
        color: '#806fbe',
        descripcion: 'Puede crear, gestionar sus propios locales y hacer promociones'
    },
    {
        id: 'miembro',
        nombre: 'Miembro',
        icon: <FaUser />,
        color: '#6c757d',
        descripcion: 'Acceso básico, puede ver, crear y reseñar spots'
    }
];

export default function RoleSelector({ rol, setRol, error }) {
    return (
        <Form.Group className="mb-4">
            <Form.Label className="creacion-formulario-label">
                <FaUserShield /> Rol del Usuario <RequiredMark />
            </Form.Label>

            <div className="roles-selector-grid">
                {ROLES.map((role) => (
                    <div
                        key={role.id}
                        className={`role-card ${rol === role.id ? 'selected' : ''}`}
                        onClick={() => setRol(role.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setRol(role.id)}
                    >
                        <div className="role-icon" style={{ backgroundColor: `${role.color}20`, color: role.color }}>
                            {role.icon}
                        </div>
                        <div className="role-info">
                            <h4>{role.nombre}</h4>
                            <p>{role.descripcion}</p>
                        </div>
                        <div className={`role-radio ${rol === role.id ? 'checked' : ''}`}>
                            {rol === role.id && <div className="role-radio-inner" />}
                        </div>
                    </div>
                ))}
            </div>

            {error && <span className="error-message-role">{error}</span>}
        </Form.Group>
    );
}