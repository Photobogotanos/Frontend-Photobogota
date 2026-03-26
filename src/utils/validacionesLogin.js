/**
 * Validaciones para el formulario de login
 */

/**
 * Valida que el campo de usuario/correo no esté vacío
 * @param {string} valor - El valor del campo usuario o correo
 * @returns {{ valido: boolean, mensaje?: string }}
 */
export const validarUsuarioOCorreo = (valor) => {
  if (!valor || !valor.trim()) {
    return { valido: false, mensaje: "Debes ingresar tu usuario o correo." };
  }
  return { valido: true };
};

/**
 * Valida que la contraseña no esté vacía
 * @param {string} valor - El valor del campo contraseña
 * @returns {{ valido: boolean, mensaje?: string }}
 */
export const validarContrasena = (valor) => {
  if (!valor || !valor.trim()) {
    return { valido: false, mensaje: "Debes ingresar la contraseña." };
  }
  return { valido: true };
};

/**
 * Valida el formato del usuario o correo
 * @param {string} valor - El valor del campo usuario o correo
 * @returns {{ valido: boolean, mensaje?: string }}
 */
export const validarFormatoUsuarioOCorreo = (valor) => {
  if (!valor || !valor.trim()) {
    return { valido: false, mensaje: "Debes ingresar tu usuario o correo." };
  }

  // Verificar si es un correo válido
  const esCorreoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
  
  // Si no es correo, debe tener al menos 3 caracteres
  if (!esCorreoValido && valor.length < 3) {
    return { valido: false, mensaje: "Debe ser un correo válido o un usuario con mínimo 3 caracteres." };
  }

  return { valido: true };
};

/**
 * Valida todos los campos del formulario de login
 * @param {string} usuarioOCorreo - El valor del campo usuario o correo
 * @param {string} contrasena - El valor del campo contraseña
 * @returns {{ valido: boolean, mensaje?: string }}
 */
export const validarLogin = (usuarioOCorreo, contrasena) => {
  // Validar usuario/correo
  const validacionUsuario = validarUsuarioOCorreo(usuarioOCorreo);
  if (!validacionUsuario.valido) {
    return validacionUsuario;
  }

  // Validar contraseña
  const validacionContrasena = validarContrasena(contrasena);
  if (!validacionContrasena.valido) {
    return validacionContrasena;
  }

  // Validar formato
  const validacionFormato = validarFormatoUsuarioOCorreo(usuarioOCorreo);
  if (!validacionFormato.valido) {
    return validacionFormato;
  }

  return { valido: true };
};