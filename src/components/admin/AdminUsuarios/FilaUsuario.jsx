import { FaBan, FaUserCheck, FaTrash } from "react-icons/fa";

const ROLES = {
  ADMIN: "Administrador",
  MOD: "Moderador",
  SOCIO: "Socio",
  MIEMBRO: "Miembro",
};

const getRolNombre = (rol) => ROLES[rol] || rol;

const FilaUsuario = ({ user, onActualizarEstado, onEliminarUsuario }) => (
  <tr className="usuario-fila">
    <td className="usuario-cell">
      <div className="usuario-avatar">
        {user.nombresCompletos?.charAt(0) || "U"}
      </div>
      <div className="usuario-info">
        <span className="usuario-nombre-completo">
          {user.nombresCompletos}
        </span>
        <span className="usuario-username">@{user.nombreUsuario}</span>
      </div>
    </td>
    <td className="email-cell">{user.email}</td>
    <td>
      <span className={`role-badge badges-${user.rol}`}>
        {getRolNombre(user.rol)}
      </span>
    </td>
    <td>
      <span
        className={`status-badge ${user.estadoCuenta ? "activo" : "inactivo"}`}
      >
        {user.estadoCuenta ? "● Activo" : "● Inactivo"}
      </span>
    </td>
    <td className="acciones-cell">
      <button
        type="button"
        className={`action-icon ${user.estadoCuenta ? "suspend" : "activate"}`}
        onClick={() => onActualizarEstado(user.id, user.estadoCuenta)}
        aria-label={
          user.estadoCuenta ? "Desactivar usuario" : "Activar usuario"
        }
      >
        {user.estadoCuenta ? <FaBan /> : <FaUserCheck />}
      </button>
      <button
        type="button"
        className="action-icon delete"
        onClick={() => onEliminarUsuario(user.id, user.nombreUsuario)}
        aria-label="Eliminar usuario"
      >
        <FaTrash />
      </button>
    </td>
  </tr>
);

export default FilaUsuario;
