// Utilidades compartidas para mostrar el estado de una solicitud de aspirante
// de forma consistente en toda la sección de moderación.

export const ESTADOS_EN_REVISION = ["PENDIENTE", "EN_CORRECCION"];

export function getEstadoMeta(estado) {
  switch (estado) {
    case "PENDIENTE":
      return { label: "Pendiente", variant: "warning" };
    case "EN_CORRECCION":
      return { label: "En corrección", variant: "info" };
    case "ENVIO_CREDENCIALES":
      return { label: "Aprobada · envío de credenciales", variant: "success" };
    case "APROBADO":
      return { label: "Aprobada", variant: "success" };
    case "RECHAZADO":
      return { label: "Rechazada", variant: "danger" };
    default:
      return { label: estado, variant: "secondary" };
  }
}

export function estaEnRevision(estado) {
  return ESTADOS_EN_REVISION.includes(estado);
}

export function puedeEnviarCredenciales(estado) {
  return estado === "ENVIO_CREDENCIALES";
}

export function formatearFecha(fecha) {
  if (!fecha) return "No disponible";
  return new Date(fecha).toLocaleString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
