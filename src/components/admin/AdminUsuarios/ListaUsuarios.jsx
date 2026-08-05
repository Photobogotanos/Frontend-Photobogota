import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import "./ListaUsuarios.css";
import Select from "react-select";
import { FaSearch, FaSync, FaUsers } from "react-icons/fa";

import SpinnerLoader from "@/components/common/SpinnerLoader/SpinnerLoader";
import Swal from "sweetalert2";
import {
  listarUsuariosAdmin,
  actualizarEstadoUsuarioAdmin,
  eliminarUsuarioAdmin,
} from "@/services/admin.service";
import FilaUsuario from "./FilaUsuario";
import PaginacionUsuarios from "./PaginacionUsuarios";

const rolOptions = [
  { value: "todos", label: "Todos los roles" },
  { value: "ADMIN", label: "Administradores" },
  { value: "MOD", label: "Moderadores" },
  { value: "SOCIO", label: "Socios" },
  { value: "MIEMBRO", label: "Miembros" },
];

const estadoOptions = [
  { value: "todos", label: "Todos los estados" },
  { value: "true", label: "Activos" },
  { value: "false", label: "Inactivos" },
];

const ListaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [filtros, setFiltros] = useState({
    rol: null,
    estado: null,
    busqueda: "",
  });
  const [paginacion, setPaginacion] = useState({
    pagina: 0,
    porPagina: 10,
    totalPaginas: 0,
    totalElementos: 0,
  });
  const modoDemo = useRef(false);

  const cargarUsuarios = useCallback(async () => {
    setCargando(true);
    try {
      const resultado = await listarUsuariosAdmin(
        paginacion.pagina,
        paginacion.porPagina,
      );

      if (resultado.exitoso) {
        modoDemo.current = resultado.esDemo;
        const data = resultado.data;
        // Sincronización con la estructura de Page de Spring Boot o Mock
        setUsuarios(data.content || []);
        setPaginacion((prev) => ({
          ...prev,
          totalPaginas: data.totalPages || 0,
          totalElementos: data.totalElements || 0,
        }));
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: resultado.mensaje || "No se pudieron cargar los usuarios",
        });
      }
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los usuarios",
      });
    } finally {
      setCargando(false);
    }
  }, [paginacion.pagina, paginacion.porPagina]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch inicial al montar, patrón válido
    cargarUsuarios();
  }, [cargarUsuarios]);

  // Filtrado local (mantiene la reactividad de la búsqueda)
  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((u) => {
      const matchBusqueda =
        !filtros.busqueda ||
        `${u.nombresCompletos} ${u.email} ${u.nombreUsuario}`
          .toLowerCase()
          .includes(filtros.busqueda.toLowerCase());

      const matchRol =
        !filtros.rol ||
        filtros.rol.value === "todos" ||
        u.rol === filtros.rol.value;

      const matchEstado =
        !filtros.estado ||
        filtros.estado.value === "todos" ||
        String(u.estadoCuenta) === filtros.estado.value;

      return matchBusqueda && matchRol && matchEstado;
    });
  }, [usuarios, filtros]);

  const handleActualizarEstado = async (usuarioId, estadoActual) => {
    const nuevoEstado = !estadoActual;
    const accion = nuevoEstado ? "activar" : "desactivar";

    const result = await Swal.fire({
      title: `¿${nuevoEstado ? "Activar" : "Desactivar"} usuario?`,
      text: `¿Estás seguro de que deseas ${accion} este usuario?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: nuevoEstado ? "#22c55e" : "#ef4444",
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      const resultado = await actualizarEstadoUsuarioAdmin(
        usuarioId,
        nuevoEstado,
      );

      if (resultado.exitoso) {
        if (resultado.esDemo) {
          Swal.fire({
            icon: "info",
            title: "Modo Demo",
            text: resultado.mensaje,
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          Swal.fire("¡Actualizado!", resultado.mensaje, "success");
        }
        cargarUsuarios();
      } else {
        Swal.fire(
          "Error",
          resultado.mensaje || "No se pudo actualizar",
          "error",
        );
      }
    }
  };

  const handleEliminarUsuario = async (usuarioId, nombreUsuario) => {
    const result = await Swal.fire({
      title: "¿Eliminar usuario?",
      html: `¿Estás seguro de eliminar a <strong>${nombreUsuario}</strong>?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      const resultado = await eliminarUsuarioAdmin(usuarioId);

      if (resultado.exitoso) {
        if (resultado.esDemo) {
          Swal.fire({
            icon: "info",
            title: "Modo Demo",
            text: resultado.mensaje,
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          Swal.fire("Eliminado", resultado.mensaje, "success");
        }
        cargarUsuarios();
      } else {
        Swal.fire("Error", resultado.mensaje || "No se pudo eliminar", "error");
      }
    }
  };

  return (
    <div className="lista-usuarios-container">
      <div className="filtros-bar">
        <div className="filtros-group">
          <div className="search-wrapper">
            <FaSearch className="search-icon-input" />
            <input
              type="text"
              placeholder="Buscar por nombre, usuario o email..."
              aria-label="Buscar por nombre, usuario o email"
              value={filtros.busqueda}
              onChange={(e) =>
                setFiltros({ ...filtros, busqueda: e.target.value })
              }
              className="search-input"
            />
          </div>

          <Select
            options={rolOptions}
            value={filtros.rol}
            onChange={(selected) => setFiltros({ ...filtros, rol: selected })}
            placeholder="Rol"
            classNamePrefix="spot-select"
            isClearable
          />

          <Select
            options={estadoOptions}
            value={filtros.estado}
            onChange={(selected) =>
              setFiltros({ ...filtros, estado: selected })
            }
            placeholder="Estado"
            classNamePrefix="spot-select"
            isClearable
          />
        </div>

        <div className="acciones-group">
          <button type="button" className="btn-refresh" onClick={cargarUsuarios}>
            <FaSync /> Actualizar
          </button>
        </div>
      </div>

      <div className="tabla-wrapper">
        {cargando ? (
          <div className="loading-overlay">
            <SpinnerLoader texto="Cargando usuarios..." />
          </div>
        ) : usuariosFiltrados.length === 0 ? (
          <div className="empty-state">
            <FaUsers className="empty-icon" />
            <h3>No se encontraron usuarios</h3>
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
                  {usuariosFiltrados.map((user) => (
                    <FilaUsuario
                      key={user.id}
                      user={user}
                      onActualizarEstado={handleActualizarEstado}
                      onEliminarUsuario={handleEliminarUsuario}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <PaginacionUsuarios
              paginacion={paginacion}
              onCambiarPagina={(pagina) =>
                setPaginacion((p) => ({ ...p, pagina }))
              }
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ListaUsuarios;
