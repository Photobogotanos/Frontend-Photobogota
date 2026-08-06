import { useCallback, useEffect, useState } from "react";
import PageContainer from "@/components/common/PageContainer/PageContainer";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";
import Spinner from "react-bootstrap/Spinner";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaBan,
  FaCheck,
  FaInbox,
  FaShieldAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";
import {
  listarPalabrasProhibidas,
  eliminarPalabraProhibida,
  togglePalabraProhibida,
} from "@/services/moderacion.service";
import PalabraFormModal from "./PalabraFormModal";
import "../moderacion-admin.css";
import "./ModeracionPalabrasPage.css";

const ETIQUETAS_CATEGORIA = {
  OFENSIVO: { texto: "Ofensivo", variant: "danger" },
  SPAM: { texto: "Spam", variant: "warning" },
  OTRO: { texto: "Otro", variant: "secondary" },
};

const ModeracionPalabrasPage = () => {
  const [palabras, setPalabras] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [buscando, setBuscando] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [palabraEditar, setPalabraEditar] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    const resultado = await listarPalabrasProhibidas();
    setCargando(false);
    if (resultado.exitoso) {
      setPalabras(resultado.datos?.content || resultado.datos || []);
    } else {
      toast.error(resultado.mensaje);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch inicial al montar, patrón válido
    cargar();
  }, [cargar]);

  const abrirCrear = () => {
    setPalabraEditar(null);
    setModalAbierto(true);
  };

  const abrirEditar = (palabra) => {
    setPalabraEditar(palabra);
    setModalAbierto(true);
  };

  const manejarEliminar = async (palabra) => {
    if (!window.confirm(`¿Eliminar la regla "${palabra.texto}"?`)) return;
    const resultado = await eliminarPalabraProhibida(palabra.id);
    if (resultado.exitoso) {
      toast.success(resultado.mensaje);
      cargar();
    } else {
      toast.error(resultado.mensaje);
    }
  };

  const manejarToggle = async (palabra) => {
    const resultado = await togglePalabraProhibida(palabra.id);
    if (resultado.exitoso) {
      toast.success(
        `${palabra.texto} ${palabra.activo ? "desactivada" : "activada"} correctamente`,
      );
      cargar();
    } else {
      toast.error(resultado.mensaje);
    }
  };

  const filtradas = palabras.filter((p) =>
    (p.texto || "").toLowerCase().includes(buscando.toLowerCase()),
  );

  return (
    <PageContainer className="moderacion-palabras-page">
      <div className="moderacion-page">
        <PageHeader
          subtitle="Administración"
          icon={<FaShieldAlt />}
          title="Palabras y frases prohibidas"
          description="Gestiona las reglas de moderación: palabras y frases que se detectan automáticamente en reseñas, spots y perfiles de usuario."
        />

        <div className="moderacion-card">
          <div className="moderacion-card-header">
            <h4 className="moderacion-card-title">Reglas configuradas</h4>
            <button type="button" className="btn-mod" onClick={abrirCrear}>
              <FaPlus /> Nueva regla
            </button>
          </div>

          <div className="moderacion-buscador">
            <FaSearch className="moderacion-buscador-icon" />
            <input
              type="text"
              className="form-control moderacion-input"
              placeholder="Buscar por texto..."
              value={buscando}
              onChange={(e) => setBuscando(e.target.value)}
            />
          </div>

          {cargando ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : filtradas.length === 0 ? (
            <div className="moderacion-vacio">
              <FaInbox />
              <p className="mb-0">No hay reglas configuradas.</p>
            </div>
          ) : (
            <Table hover responsive className="moderacion-table">
              <thead>
                <tr>
                  <th>Texto</th>
                  <th>Tipo</th>
                  <th>Categoría</th>
                  <th>Excepciones</th>
                  <th>Estado</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtradas.map((p) => {
                  const categoria =
                    ETIQUETAS_CATEGORIA[p.categoria] || ETIQUETAS_CATEGORIA.OTRO;
                  return (
                    <tr key={p.id} className={!p.activo ? "table-secondary" : ""}>
                      <td className="fw-semibold">{p.texto}</td>
                      <td>
                        <Badge bg={p.tipo === "FRASE" ? "info" : "dark"}>
                          {p.tipo === "FRASE" ? "Frase" : "Palabra"}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg={categoria.variant}>{categoria.texto}</Badge>
                      </td>
                      <td>
                        {p.excepciones && p.excepciones.length > 0 ? (
                          <div className="excepciones-lista">
                            {p.excepciones.map((exc, i) => (
                              <Badge
                                key={i}
                                pill
                                bg="light"
                                text="dark"
                                className="me-1 mb-1"
                              >
                                {exc}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td>
                        <Badge bg={p.activo ? "success" : "secondary"}>
                          {p.activo ? "Activa" : "Inactiva"}
                        </Badge>
                      </td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn-mod-outline btn-mod-sm me-1"
                          title="Editar"
                          onClick={() => abrirEditar(p)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          type="button"
                          className={`btn-mod-outline btn-mod-sm me-1 ${
                            p.activo ? "btn-mod-warning" : "btn-mod-success"
                          }`}
                          title={p.activo ? "Desactivar" : "Activar"}
                          onClick={() => manejarToggle(p)}
                        >
                          {p.activo ? <FaBan /> : <FaCheck />}
                        </button>
                        <button
                          type="button"
                          className="btn-mod-outline btn-mod-danger btn-mod-sm"
                          title="Eliminar"
                          onClick={() => manejarEliminar(p)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </div>
      </div>

      <PalabraFormModal
        mostrar={modalAbierto}
        onCerrar={() => setModalAbierto(false)}
        palabra={palabraEditar}
        onGuardado={cargar}
      />
    </PageContainer>
  );
};

export default ModeracionPalabrasPage;
