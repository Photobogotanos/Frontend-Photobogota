import { useCallback, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaBan, FaCheck } from "react-icons/fa";
import toast from "react-hot-toast";
import {
  listarPalabrasProhibidas,
  eliminarPalabraProhibida,
  togglePalabraProhibida,
} from "@/services/moderacion.service";
import PalabraFormModal from "./PalabraFormModal";
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
    <div className="moderacion-palabras-page">
      <Container fluid>
        <Card className="shadow-sm">
          <Card.Header className="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <h4 className="mb-0">Palabras y frases prohibidas</h4>
            <Button variant="primary" onClick={abrirCrear}>
              <FaPlus className="me-1" /> Nueva regla
            </Button>
          </Card.Header>
          <Card.Body>
            <Row className="mb-3">
              <Col md={4}>
                <InputGroup>
                  <InputGroup.Text>
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Buscar por texto..."
                    value={buscando}
                    onChange={(e) => setBuscando(e.target.value)}
                  />
                </InputGroup>
              </Col>
            </Row>

            {cargando ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : (
              <Table hover responsive className="moderacion-tabla">
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
                  {filtradas.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center text-muted py-4">
                        No hay reglas configuradas.
                      </td>
                    </tr>
                  )}
                  {filtradas.map((p) => {
                    const categoria = ETIQUETAS_CATEGORIA[p.categoria] || ETIQUETAS_CATEGORIA.OTRO;
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
                                <Badge key={i} pill bg="light" text="dark" className="me-1 mb-1">
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
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-1"
                            title="Editar"
                            onClick={() => abrirEditar(p)}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            variant={p.activo ? "outline-warning" : "outline-success"}
                            size="sm"
                            className="me-1"
                            title={p.activo ? "Desactivar" : "Activar"}
                            onClick={() => manejarToggle(p)}
                          >
                            {p.activo ? <FaBan /> : <FaCheck />}
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            title="Eliminar"
                            onClick={() => manejarEliminar(p)}
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>

        <PalabraFormModal
          mostrar={modalAbierto}
          onCerrar={() => setModalAbierto(false)}
          palabra={palabraEditar}
          onGuardado={cargar}
        />
      </Container>
    </div>
  );
};

export default ModeracionPalabrasPage;
