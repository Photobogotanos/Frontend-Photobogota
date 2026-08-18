export const obtenerIdAutorCalificacion = (calificacion) =>
  typeof calificacion?.usuario === "string"
    ? calificacion.usuario
    : (calificacion?.usuario?.login ??
      calificacion?.usuario?.id ??
      calificacion?.usuarioId ??
      calificacion?.idUsuario);

export const obtenerNombreAutorCalificacion = (calificacion) =>
  typeof calificacion?.usuario === "string"
    ? calificacion.usuario
    : calificacion?.usuario?.nombreUsuario ||
      calificacion?.usuario?.nombre ||
      calificacion?.nombreUsuario ||
      calificacion?.usuarioNombre ||
      "Usuario";