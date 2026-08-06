import { useCallback, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Spinner from "react-bootstrap/Spinner";
import { FaCheck, FaTimes, FaUserCheck } from "react-icons/fa";
import toast from "react-hot-toast";
import {
  listarApelacionesPendientes,
  resolverApelacion,
} from "@/services/moderacion.service";
import ResolverApelacionModal from "./ResolverApelacionModal";
import "./ModeracionApelacionesPage.css";

const formatearFecha = (fecha) => {
  if (!fecha) return "—";
  return new Date(fecha).toLocaleString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ModeracionApelacionesPage = () => {
  const [apelaciones, setApelaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modal, setModal] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    const resultado = await listarApelacionesPendientes();
    setCargando(false);
    if (resultado.exitoso) {
      setApelaciones(resultado.datos || []);
    } else {
      toast.error(resultado.mensaje);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch inicial al montar, patrón válido
    cargar();
  }, [cargar]);

  const abrirResolver = (apelacion, aprobar) => {
    setModal({ apelacion, aprobar });
  };

  const manejarResuelta = async (id, body) => {
    const resultado = await resolverApelacion(id, body);
    if (resultado.exitoso) {
      toast.success(
        body.aprobar
          ? "Apelación aprobada: la cuenta fue reactivada"
          : "Apelación rechazada: se mantiene el ban",
      );
      setModal(null);
      cargar();
    } else {
      toast.error(resultado.mensaje);
    }
  };

  return (
    <div className="moderacion-apelaciones-page">
      <Container fluid>
        <Card className="shadow-sm">
          <Card.Header>
            <h4 className="mb-0">
              <FaUserCheck className="me-2" />
              Apelaciones de suspensión
            </h4>
          </Card.Header>
          <Card.Body>
            {cargando ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : (
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Fecha</th>
                    <th>Contenido sancionado</th>
                    <th>Motivo de la apelación</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {apelaciones.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center text-muted py-4">
                        No hay apelaciones pendientes.
                      </td>
                    </tr>
                  )}
                  {apelaciones.map((a) => (
                    <tr key={a.id}>
                      <td className="fw-semibold">@{a.nombreUsuario}</td>
                      <td className="text-nowrap">{formatearFecha(a.fechaApelacion || a.fecha)}</td>
                      <td className="contenido-apelacion" title={a.contenidoOriginal}>
                        {a.contenidoOriginal || "—"}
                      </td>
                      <td className="motivo-apelacion">{a.motivoApelacion || "—"}</td>
                      <td className="text-end text-nowrap">
                        <Button
                          variant="outline-success"
                          size="sm"
                          className="me-1"
                          onClick={() => abrirResolver(a, true)}
                        >
                          <FaCheck className="me-1" /> Aprobar
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => abrirResolver(a, false)}
                        >
                          <FaTimes className="me-1" /> Rechazar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}

            {apelaciones.length === 0 && !cargando && (
              <div className="text-center text-muted">
                <Badge bg="light" text="secondary">
                  Cuando un usuario apela su suspensión, aparecerá aquí para revisarla.
                </Badge>
              </div>
            )}
          </Card.Body>
        </Card>

        <ResolverApelacionModal
          mostrar={modal !== null}
          aprobar={modal?.aprobar}
          nombreUsuario={modal?.apelacion?.nombreUsuario}
          onCerrar={() => setModal(null)}
          onConfirmar={(respuesta) =>
            manejarResuelta(modal.apelacion.id, { aprobar: modal.aprobar, respuesta })
          }
        />
      </Container>
    </div>
  );
};

export default ModeracionApelacionesPage;
