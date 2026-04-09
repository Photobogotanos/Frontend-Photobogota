import { useState, useEffect, useCallback, useMemo } from 'react';
import './ListaUsuarios.css';
import Select from 'react-select';
import {
  FaSearch,
  FaSync,
  FaUsers,
  FaBan,
  FaUserCheck,
  FaTrash,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

import SpinnerLoader from "@/components/common/SpinnerLoader/SpinnerLoader";
import Swal from 'sweetalert2';

const USUARIOS_INICIALES = [
  { id: 1, nombres: 'Juan Sebastian', apellidos: 'Sotomayor', email: 'juan@dev.com', nombreUsuario: 'juanss', rol: 'admin', estado: 'activo', fechaRegistro: '2026-02-15', ultimoAcceso: '2026-04-09' },
  { id: 2, nombres: 'Ana', apellidos: 'García', email: 'ana@ejemplo.com', nombreUsuario: 'anag', rol: 'mod', estado: 'activo', fechaRegistro: '2026-03-01', ultimoAcceso: '2026-04-08' },
  { id: 3, nombres: 'Pedro', apellidos: 'Pérez', email: 'pedro@socio.com', nombreUsuario: 'pedrop', rol: 'socio', estado: 'inactivo', fechaRegistro: '2026-01-20', ultimoAcceso: null },
  { id: 4, nombres: 'Laura', apellidos: 'Méndez', email: 'laura@mail.com', nombreUsuario: 'lauram', rol: 'miembro', estado: 'activo', fechaRegistro: '2026-03-20', ultimoAcceso: '2026-04-05' },
  { id: 5, nombres: 'Carlos', apellidos: 'Ruiz', email: 'carlos@test.com', nombreUsuario: 'cruiz', rol: 'miembro', estado: 'activo', fechaRegistro: '2026-04-01', ultimoAcceso: '2026-04-02' },
];

const ListaUsuarios = () => {
  const [usuarios, setUsuarios] = useState(USUARIOS_INICIALES);
  const [cargando, setCargando] = useState(false);
  const [filtros, setFiltros] = useState({ rol: null, estado: null, busqueda: '' });
  const [paginacion, setPaginacion] = useState({ pagina: 1, porPagina: 5 });

  const cargarUsuarios = useCallback(async () => {
    setCargando(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setCargando(false);
  }, []);

  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

  // Opciones para react-select
  const rolOptions = [
    { value: 'todos', label: 'Todos los roles' },
    { value: 'admin', label: 'Administradores' },
    { value: 'mod', label: 'Moderadores' },
    { value: 'socio', label: 'Socios' },
    { value: 'miembro', label: 'Miembros' },
  ];

  const estadoOptions = [
    { value: 'todos', label: 'Todos los estados' },
    { value: 'activo', label: 'Activos' },
    { value: 'inactivo', label: 'Inactivos' },
  ];

  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter(u => {
      const matchBusqueda = !filtros.busqueda ||
        `${u.nombres} ${u.apellidos} ${u.email} ${u.nombreUsuario}`.toLowerCase().includes(filtros.busqueda.toLowerCase());

      const matchRol = !filtros.rol || filtros.rol.value === 'todos' || u.rol === filtros.rol.value;
      const matchEstado = !filtros.estado || filtros.estado.value === 'todos' || u.estado === filtros.estado.value;

      return matchBusqueda && matchRol && matchEstado;
    });
  }, [usuarios, filtros]);

  const handleActualizarEstado = async (usuarioId, estadoActual) => {
    const nuevoEstado = estadoActual === 'activo' ? 'inactivo' : 'activo';
    const result = await Swal.fire({
      title: `¿${nuevoEstado === 'activo' ? 'Activar' : 'Suspender'} usuario?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: nuevoEstado === 'activo' ? '#22c55e' : '#ef4444',
      confirmButtonText: 'Confirmar'
    });

    if (result.isConfirmed) {
      setUsuarios(prev => prev.map(u => u.id === usuarioId ? { ...u, estado: nuevoEstado } : u));
      Swal.fire('¡Actualizado!', '', 'success');
    }
  };

  const handleEliminarUsuario = async (usuarioId) => {
    const result = await Swal.fire({
      title: '¿Eliminar usuario?',
      text: "Esta acción es irreversible (Modo Demo)",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Sí, eliminar'
    });

    if (result.isConfirmed) {
      setUsuarios(prev => prev.filter(u => u.id !== usuarioId));
      Swal.fire('Eliminado', '', 'success');
    }
  };

  // Función para mostrar nombre del rol
  const getRolNombre = (rol) => {
    const roles = {
      admin: 'Administrador',
      mod: 'Moderador',
      socio: 'Socio',
      miembro: 'Miembro'
    };
    return roles[rol] || rol;
  };

  const totalPaginas = Math.ceil(usuariosFiltrados.length / paginacion.porPagina);
  const usuariosPagina = usuariosFiltrados.slice(
    (paginacion.pagina - 1) * paginacion.porPagina,
    paginacion.pagina * paginacion.porPagina
  );

  return (
    <div className="lista-usuarios-container">
      {/* Filtros */}
      <div className="filtros-bar">
        <div className="filtros-group">
          <div className="search-wrapper">
            <FaSearch className="search-icon-input" />
            <input
              type="text"
              placeholder="Buscar por nombre, usuario o email..."
              value={filtros.busqueda}
              onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value, pagina: 1 })}
              className="search-input"
            />
          </div>

          {/* Select de Rol */}
          <Select
            options={rolOptions}
            value={filtros.rol}
            onChange={(selected) => setFiltros({ ...filtros, rol: selected, pagina: 1 })}
            placeholder="Filtrar por rol"
            className="react-select-container"
            classNamePrefix="react-select"
            isClearable
            menuPortalTarget={document.body}         
            menuPosition="fixed"                      
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            }}
          />

          {/* Select de Estado */}
          <Select
            options={estadoOptions}
            value={filtros.estado}
            onChange={(selected) => setFiltros({ ...filtros, estado: selected, pagina: 1 })}
            placeholder="Filtrar por estado"
            className="react-select-container"
            classNamePrefix="react-select"
            isClearable
            menuPortalTarget={document.body}          
            menuPosition="fixed"
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            }}
          />
        </div>

        <div className="acciones-group">
          <button className="btn-refresh" onClick={cargarUsuarios}>
            <FaSync /> Actualizar
          </button>
        </div>
      </div>

      {/* Tabla / Loading / Empty */}
      <div className="tabla-wrapper">
        {cargando ? (
          <div className="loading-overlay">
            <SpinnerLoader texto="Cargando usuarios..." />
          </div>
        ) : usuariosPagina.length === 0 ? (
          <div className="empty-state">
            <FaUsers className="empty-icon" />
            <h3>No se encontraron usuarios</h3>
            <p>Intenta cambiar los filtros de búsqueda</p>
          </div>
        ) : (
          <>
            <div className="tabla-scroll">
              <table className="usuarios-tabla">
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosPagina.map(user => (
                    <tr key={user.id} className="usuario-fila">
                      <td className="usuario-cell">
                        <div className="usuario-avatar">
                          {user.nombres.charAt(0)}{user.apellidos.charAt(0)}
                        </div>
                        <div className="usuario-info">
                          <span className="usuario-nombre-completo">
                            {user.nombres} {user.apellidos}
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
                        <span className={`status-badge ${user.estado}`}>
                          {user.estado === 'activo' ? '● Activo' : '● Inactivo'}
                        </span>
                      </td>
                      <td className="acciones-cell">
                        <button
                          className={`action-icon ${user.estado === 'activo' ? 'suspend' : 'activate'}`}
                          onClick={() => handleActualizarEstado(user.id, user.estado)}
                          title={user.estado === 'activo' ? 'Suspender usuario' : 'Activar usuario'}
                        >
                          {user.estado === 'activo' ? <FaBan /> : <FaUserCheck />}
                        </button>
                        <button
                          className="action-icon delete"
                          onClick={() => handleEliminarUsuario(user.id)}
                          title="Eliminar usuario"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {totalPaginas > 1 && (
              <div className="paginacion">
                <button
                  className="page-btn"
                  disabled={paginacion.pagina === 1}
                  onClick={() => setPaginacion(prev => ({ ...prev, pagina: prev.pagina - 1 }))}
                >
                  <FaChevronLeft />
                </button>
                <span className="page-info">{paginacion.pagina} de {totalPaginas}</span>
                <button
                  className="page-btn"
                  disabled={paginacion.pagina === totalPaginas}
                  onClick={() => setPaginacion(prev => ({ ...prev, pagina: prev.pagina + 1 }))}
                >
                  <FaChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ListaUsuarios;