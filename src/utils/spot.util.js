/**
 * Red de seguridad cliente mientras el backend termina de implementar el
 * contrato (GET /spots?tipo=LOCAL&mios=true): nunca muestra locales que no
 * pertenezcan a la cuenta logueada.
 */
export const esLocalPropio = (local, usuarioLogueado) => {
  const tipo = (local.tipo || "").toUpperCase();
  if (tipo !== "LOCAL") return false;

  const identificadoresSpot = [
    local.creador?.nombreUsuario,
    local.creador?.username,
    local.creadorId,
    local.creadorUsername,
    local.nombreUsuarioCreador,
    local.usernameCreador,
  ]
    .filter((v) => v !== undefined && v !== null)
    .map((v) => String(v).toLowerCase());

  const identificadoresUsuario = [
    usuarioLogueado?.id,
    usuarioLogueado?.username?.replace(/^@/, ""),
    usuarioLogueado?.nombreUsuario,
    usuarioLogueado?.nombre,
  ]
    .filter((v) => v !== undefined && v !== null)
    .map((v) => String(v).toLowerCase());

  const identificadoresUsuarioSet = new Set(identificadoresUsuario);

  // Sin identificador de creador ni de usuario activo: confiamos en el filtro
  // mios del backend y no descartamos el local.
  if (identificadoresSpot.length === 0 || identificadoresUsuario.length === 0) {
    return true;
  }

  return identificadoresSpot.some((creador) =>
    identificadoresUsuarioSet.has(creador),
  );
};

/**
 * Un local "deshabilitado" no aparece en el mapa público. El backend puede
 * comunicar la visibilidad con activo:false, deshabilitado:true o un estado
 * tipo "DESHABILITADO"/"INACTIVO".
 */
export const esLocalDeshabilitado = (local = {}) => {
  if (!local) return false;
  if (local.activo === false) return true;
  if (local.deshabilitado === true) return true;
  const estado = String(
    local.estado || local.estadoLocal || local.estadoVisibilidad || "",
  ).toUpperCase();
  return estado === "DESHABILITADO" || estado === "INACTIVO";
};