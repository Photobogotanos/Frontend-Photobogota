export const detectarCampoEnUso = (mensaje, { email, nombreUsuario }) => {
  if (!mensaje) return null;

  const mensajeNormalizado = mensaje.toLowerCase();
  const emailNormalizado = email?.toLowerCase();
  const usuarioNormalizado = nombreUsuario?.toLowerCase();

  if (emailNormalizado && mensajeNormalizado.includes(emailNormalizado)) {
    return "email";
  }

  if (usuarioNormalizado && mensajeNormalizado.includes(usuarioNormalizado)) {
    return "nombreUsuario";
  }

  const hablaDeEmail = /email|correo/.test(mensajeNormalizado);
  const hablaDeUsuario = /usuario/.test(mensajeNormalizado);

  if (hablaDeEmail && hablaDeUsuario) return null;

  if (hablaDeEmail) return "email";
  if (hablaDeUsuario) return "nombreUsuario";

  return null;
};