import { useCallback, useEffect, useState } from "react";
import PageContainer from "@/components/common/PageContainer/PageContainer";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import { FaCheck, FaTimes, FaUserCheck, FaInbox } from "react-icons/fa";
import toast from "react-hot-toast";
import {
  listarApelacionesPendientes,
  resolverApelacion,
} from "@/services/moderacion.service";
import ResolverApelacionModal from "./ResolverApelacionModal";
import "../moderacion-admin.css";
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
    <PageContainer className="moderacion-apelaciones-page">
      <div className="moderacion-page">
        <PageHeader
          subtitle="Administración"
          icon={<FaUserCheck />}
          title="Apelaciones de suspensión"
          description="Revisa las apelaciones de usuarios sancionados. Aprueba la apelación para reactivar la cuenta o recházala para mantener la suspensión."
        />

        <div className="moderacion-card">
          {cargando ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : apelaciones.length === 0 ? (
            <div className="moderacion-vacio">
              <FaInbox />
              <p className="mb-0">No hay apelaciones pendientes.</p>
              <p className="small mb-0">
                Cuando un usuario apela su suspensión, aparecerá aquí para
                revisarla.
              </p>
            </div>
          ) : (
            <Table hover responsive className="moderacion-table">
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
                {apelaciones.map((a) => (
                  <tr key={a.id}>
                    <td className="fw-semibold">@{a.nombreUsuario}</td>
                    <td className="text-nowrap">
                      {formatearFecha(a.fechaApelacion || a.fecha)}
                    </td>
                    <td className="contenido-apelacion" title={a.contenidoOriginal}>
                      {a.contenidoOriginal || "—"}
                    </td>
                    <td className="motivo-apelacion">{a.motivoApelacion || "—"}</td>
                    <td className="text-end text-nowrap">
                      <button
                        type="button"
                        className="btn-mod-outline btn-mod-success btn-mod-sm me-1"
                        onClick={() => abrirResolver(a, true)}
                      >
                        <FaCheck /> Aprobar
                      </button>
                      <button
                        type="button"
                        className="btn-mod-outline btn-mod-danger btn-mod-sm"
                        onClick={() => abrirResolver(a, false)}
                      >
                        <FaTimes /> Rechazar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </div>

      <ResolverApelacionModal
        mostrar={modal !== null}
        aprobar={modal?.aprobar}
        nombreUsuario={modal?.apelacion?.nombreUsuario}
        onCerrar={() => setModal(null)}
        onConfirmar={(respuesta) =>
          manejarResuelta(modal.apelacion.id, {
            aprobar: modal.aprobar,
            respuesta,
          })
        }
      />
    </PageContainer>
  );
};

export default ModeracionApelacionesPage;
