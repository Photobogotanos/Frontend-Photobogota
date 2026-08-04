// Utilidades compartidas para mostrar el estado de una solicitud de aspirante
// de forma consistente en TODA la app: tanto en la vista del moderador
// (panel de revisión) como en la vista del aspirante (consultar solicitud).
// Si el día de mañana se agrega o renombra un estado, este es el único
// lugar que hay que tocar.

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
