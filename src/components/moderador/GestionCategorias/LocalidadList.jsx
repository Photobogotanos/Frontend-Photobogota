import { useState, useEffect, useCallback } from "react";
import { Modal } from "react-bootstrap";
import {
  FaMapMarkerAlt,
  FaPlus,
  FaSync,
  FaSearch,
  FaEdit,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaImage,
  FaAlignLeft,
} from "react-icons/fa";
import Swal from "sweetalert2";
import {
  getTodasLocalidades,
  crearLocalidad,
  actualizarLocalidad,
  eliminarLocalidad,
  toggleLocalidad,
} from "@/api/localidadApi";
import SpinnerLoader from "@/components/common/SpinnerLoader/SpinnerLoader";
import "./LocalidadList.css";

const LocalidadList = () => {
  const [localidades, setLocalidades] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    imagen: "",
  });

  const cargarLocalidades = useCallback(async () => {
    setCargando(true);
    try {
      const data = await getTodasLocalidades();
      setLocalidades(data);
    } catch (error) {
      console.error("Error cargando localidades:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar las localidades",
      });
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarLocalidades();
  }, [cargarLocalidades]);

  const filteredItems = localidades.filter((item) =>
    item.nombre.toLowerCase().includes(busqueda.toLowerCase())
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

  const handleEliminar = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar localidad?",
      text: "¿Estás seguro de que deseas eliminar esta localidad?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await eliminarLocalidad(id);
        cargarLocalidades();
        Swal.fire("Eliminada", "Localidad eliminada correctamente", "success");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar la localidad",
        });
      }
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleLocalidad(id);
      cargarLocalidades();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cambiar el estado",
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

    const dataToSend = {
      nombre: formData.nombre,
      descripcion: formData.descripcion || null,
      imagen: formData.imagen || null,
    };

    try {
      if (editItem) {
        await actualizarLocalidad(editItem.id, dataToSend);
        Swal.fire("Actualizada", "Localidad actualizada correctamente", "success");
      } else {
        await crearLocalidad(dataToSend);
        Swal.fire("Creada", "Localidad creada correctamente", "success");
      }
      setShowModal(false);
      cargarLocalidades();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar la localidad",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const estaActiva = (item) => item.activo === true;

  const renderItem = (item) => (
    <div key={item.id} className={`item-card ${estaActiva(item) ? "" : "inactiva"}`}>
      <div className="item-info">
        <span className="item-nombre">{item.nombre}</span>
        {item.descripcion && (
          <span className="item-descripcion">{item.descripcion}</span>
        )}
      </div>
      <div className="item-acciones">
        <button
          className={`btn-toggle ${estaActiva(item) ? "active" : "inactive"}`}
          onClick={() => handleToggle(item.id)}
          title={estaActiva(item) ? "Desactivar" : "Activar"}
        >
          {estaActiva(item) ? <FaToggleOn /> : <FaToggleOff />}
        </button>
        <span className={`estado-badge ${estaActiva(item) ? "activo" : "inactivo"}`}>
          {estaActiva(item) ? "Activa" : "Inactiva"}
        </span>
        <button className="btn-edit" onClick={() => handleEditar(item)}>
          <FaEdit />
        </button>
        <button className="btn-delete" onClick={() => handleEliminar(item.id)}>
          <FaTrash />
        </button>
      </div>
    </div>
  );

  return (
    <div className="localidad-list">
      <div className="toolbar">
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar localidad..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="actions">
          <button className="btn-refresh" onClick={cargarLocalidades}>
            <FaSync /> Actualizar
          </button>
          <button className="btn-primary" onClick={handleCrear}>
            <FaPlus /> Nueva Localidad
          </button>
        </div>
      </div>

      {cargando ? (
        <div className="loading-overlay">
          <SpinnerLoader texto="Cargando localidades..." />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="empty-state">
          <FaMapMarkerAlt className="empty-icon" />
          <h3>No se encontraron localidades</h3>
          <p>Crea una nueva localidad para comenzar</p>
        </div>
      ) : (
        <div className="items-grid">
          {filteredItems.map(renderItem)}
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editItem ? "Editar" : "Nueva"} Localidad</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label>Nombre *</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Chapinero, Usaquén"
              className="form-control"
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Describe brevemente esta localidad..."
              className="form-control"
              rows={3}
            />
          </div>
          <div className="form-group">
            <label>URL de Imagen</label>
            <input
              type="text"
              name="imagen"
              value={formData.imagen}
              onChange={handleChange}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="form-control"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={handleGuardar}>
            {editItem ? "Actualizar" : "Crear"}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LocalidadList;