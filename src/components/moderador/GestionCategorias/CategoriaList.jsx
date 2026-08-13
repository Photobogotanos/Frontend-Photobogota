import { useState, useEffect, useCallback } from "react";
import { Modal } from "react-bootstrap";
import {
  FaTags,
  FaPlus,
  FaSync,
  FaSearch,
  FaEdit,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import Swal from "sweetalert2";
import {
  getTodasCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
  toggleCategoria,
} from "@/api/categoriaApi";
import SpinnerLoader from "@/components/common/SpinnerLoader/SpinnerLoader";
import "./CategoriaList.css";

const estaActiva = (item) => item.activo === true;

const CategoriaList = () => {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    imagen: "",
  });

  const cargarCategorias = useCallback(async () => {
    setCargando(true);
    try {
      const data = await getTodasCategorias();
      setCategorias(data);
    } catch (error) {
      console.error("Error cargando categorías:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar las categorías",
      });
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch inicial al montar, patrón válido
    cargarCategorias();
  }, [cargarCategorias]);

  const filteredItems = categorias.filter((item) =>
    item.nombre.toLowerCase().includes(busqueda.toLowerCase()),
  );

  const handleCrear = () => {
    setEditItem(null);
    setFormData({ nombre: "", descripcion: "", imagen: "" });
    setShowModal(true);
  };

  const handleEditar = (item) => {
    setEditItem(item);
    setFormData({
      nombre: item.nombre || "",
      descripcion: item.descripcion || "",
      imagen: item.imagen || "",
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEliminar = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar categoría?",
      text: "¿Estás seguro de que deseas eliminar esta categoría?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await eliminarCategoria(id);
        cargarCategorias();
        Swal.fire("Eliminado", "Categoría eliminada correctamente", "success");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar la categoría " + error.message,
        });
      }
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleCategoria(id);
      cargarCategorias();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cambiar el estado " + error.message,
      });
    }
  };

  const handleGuardar = async () => {
    if (!formData.nombre.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: "El nombre no puede estar vacío",
      });
      return;
    }

    try {
      if (editItem) {
        await actualizarCategoria(editItem.id, formData);
        Swal.fire(
          "Actualizado",
          "Categoría actualizada correctamente",
          "success",
        );
      } else {
        await crearCategoria(formData);
        Swal.fire("Creado", "Categoría creada correctamente", "success");
      }
      setShowModal(false);
      cargarCategorias();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar la categoría " + error.message,
      });
    }
  };

  const renderItem = (item) => (
    <div
      key={item.id}
      className={`item-card ${estaActiva(item) ? "" : "inactiva"}`}
    >
      <div className="item-info">
        <span className="item-nombre">{item.nombre}</span>
        {item.descripcion && (
          <span className="item-descripcion">{item.descripcion}</span>
        )}
      </div>
      <div className="item-acciones">
        <button
          type="button"
          className={`btn-toggle ${estaActiva(item) ? "active" : "inactive"}`}
          onClick={() => handleToggle(item.id)}
          title={estaActiva(item) ? "Desactivar" : "Activar"}
        >
          {estaActiva(item) ? <FaToggleOn /> : <FaToggleOff />}
        </button>
        <span
          className={`estado-badge ${estaActiva(item) ? "activo" : "inactivo"}`}
        >
          {estaActiva(item) ? "Activa" : "Inactiva"}
        </span>
        <button
          type="button"
          className="btn-edit"
          onClick={() => handleEditar(item)}
          aria-label="Editar"
        >
          <FaEdit />
        </button>
        <button
          type="button"
          className="btn-delete"
          onClick={() => handleEliminar(item.id)}
          aria-label="Eliminar"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );

  return (
    <div className="categoria-list">
      <div className="toolbar">
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar categoría..."
            aria-label="Buscar categoría"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="actions">
          <button type="button" className="btn-refresh" onClick={cargarCategorias}>
            <FaSync /> Actualizar
          </button>
          <button type="button" className="btn-primary" onClick={handleCrear}>
            <FaPlus /> Nueva Categoría
          </button>
        </div>
      </div>

      {cargando ? (
        <div className="loading-overlay">
          <SpinnerLoader texto="Cargando categorías..." />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="empty-state">
          <FaTags className="empty-icon" />
          <h3>No se encontraron categorías</h3>
          <p>Crea una nueva categoría para comenzar</p>
        </div>
      ) : (
        <div className="items-grid">{filteredItems.map(renderItem)}</div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editItem ? "Editar" : "Nueva"} Categoría</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label htmlFor="nombre">Nombre *</label>
            <input
              id="nombre"
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ingrese el nombre de la categoría"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Ingrese una descripción (opcional)"
              className="form-control"
              rows={3}
            />
          </div>
          <div className="form-group">
            <label htmlFor="imagen">URL de Imagen</label>
            <input
              id="imagen"
              type="text"
              name="imagen"
              value={formData.imagen}
              onChange={handleChange}
              placeholder="https://ejemplo.com/imagen.webp"
              className="form-control"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowModal(false)}
          >
            Cancelar
          </button>
          <button type="button" className="btn btn-primary" onClick={handleGuardar}>
            {editItem ? "Actualizar" : "Crear"}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CategoriaList;
