import { CiShoppingTag } from "react-icons/ci";
import { Badge, Button, Card } from "react-bootstrap";
import { FaCheckCircle } from "react-icons/fa";
import { FaBan, FaTrash } from "react-icons/fa6";
import { FiEdit3 } from "react-icons/fi";
import { LuCopyPlus } from "react-icons/lu";
import { obtenerEtiquetaEstadoPromocion } from "@/services/promocion.service";

const getBadgeColor = (estado) => {
  switch (estado) {
    case "ACTIVA":
      return "success";
    case "EXPIRADA":
      return "danger";
    case "PROXIMA":
      return "info";
    case "DESACTIVADA":
      return "secondary";
    default:
      return "secondary";
  }
};

const formatFecha = (fecha) => {
  if (!fecha) return "—";
  return new Date(fecha).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function PromocionCard({ promocion, onEditar, onDuplicar, onToggle, onEliminar }) {
  return (
    <Card className={`promocion-card ${(promocion.estado || "").toLowerCase()}`}>
      <div className="promocion-imagen-container">
        {promocion.imagen ? (
          <Card.Img
            variant="top"
            src={promocion.imagen}
            alt={promocion.titulo}
            className="promocion-imagen"
          />
        ) : (
          <div className="promocion-imagen-placeholder d-flex align-items-center justify-content-center">
            <CiShoppingTag style={{ fontSize: "3rem", color: "#bbb" }} />
          </div>
        )}
        <Badge bg={getBadgeColor(promocion.estado)} className="promocion-badge">
          {obtenerEtiquetaEstadoPromocion(promocion.estado)}
        </Badge>
        {promocion.descuento && (
          <div className="promocion-descuento">{promocion.descuento} OFF</div>
        )}
      </div>

      <Card.Body className="promocion-body">
        <Card.Title className="promocion-titulo">{promocion.titulo}</Card.Title>

        <Card.Text className="promocion-descripcion">
          {promocion.descripcion}
        </Card.Text>

        {promocion.codigo && (
          <div className="promocion-codigo">
            <span className="codigo-label">Código:</span>
            <code className="codigo-valor">{promocion.codigo}</code>
            <Button
              variant="link"
              size="sm"
              className="btn-copy"
              onClick={() => navigator.clipboard.writeText(promocion.codigo)}
            >
              📋
            </Button>
          </div>
        )}

        <div className="promocion-fechas">
          <div className="fecha-item">
            <span className="fecha-label">Inicio:</span>
            <span className="fecha-valor">{formatFecha(promocion.fechaInicio)}</span>
          </div>
          <div className="fecha-item">
            <span className="fecha-label">Fin:</span>
            <span className="fecha-valor">{formatFecha(promocion.fechaFin)}</span>
          </div>
        </div>

        {promocion.usosMaximos ? (
          <div className="promocion-usos">
            <div className="usos-info">
              <span>
                Usos: {promocion.usos} / {promocion.usosMaximos}
              </span>
              <span className="usos-porcentaje">
                {Math.round((promocion.usos / promocion.usosMaximos) * 100)}%
              </span>
            </div>
            <div className="usos-bar">
              <div
                className="usos-progress"
                style={{
                  width: `${Math.min((promocion.usos / promocion.usosMaximos) * 100, 100)}%`,
                  background:
                    promocion.usos >= promocion.usosMaximos
                      ? "#ef4444"
                      : "var(--color-primary)",
                }}
              />
            </div>
          </div>
        ) : (
          <div className="promocion-usos">
            <div className="usos-info">
              <span>Usos: {promocion.usos} / Ilimitado</span>
            </div>
          </div>
        )}

        <div className="promocion-acciones">
          <Button
            variant="outline-primary"
            size="sm"
            className="btn-editar"
            onClick={() => onEditar(promocion)}
          >
            <FiEdit3 /> Editar
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            className="btn-duplicar"
            onClick={() => onDuplicar(promocion)}
          >
            <LuCopyPlus /> Duplicar
          </Button>
          {promocion.estado === "ACTIVA" || promocion.estado === "PROXIMA" ? (
            <Button
              variant="outline-danger"
              size="sm"
              className="btn-desactivar"
              onClick={() => onToggle(promocion)}
            >
              <FaBan /> Desactivar
            </Button>
          ) : (
            promocion.estado === "DESACTIVADA" && (
              <Button
                variant="outline-success"
                size="sm"
                className="btn-desactivar"
                onClick={() => onToggle(promocion)}
              >
                <FaCheckCircle /> Activar
              </Button>
            )
          )}
          <Button
            variant="outline-danger"
            size="sm"
            className="btn-desactivar"
            onClick={() => onEliminar(promocion)}
            aria-label={`Eliminar promoción ${promocion.titulo}`}
          >
            <FaTrash />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}