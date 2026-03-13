/**
 * Datos mockup para el servicio de usuario
 * Estos son los datos quemados (demo) que se usan cuando el servidor no está disponible
 */

export const USUARIOS_DEMO = [
  {
    id: 1,
    nombreUsuario: "socio",
    contrasena: "socio123",
    correo: "socio@photobogota.com",
    nombre: "Socio Demo",
    apellido: "Demo",
    rol: "SOCIO",
    fechaNacimiento: "1990-01-01",
  },
  {
    id: 2,
    nombreUsuario: "perro",
    contrasena: "encerrado",
    correo: "perro@photobogota.com",
    nombre: "Administrador",
    apellido: "Demo",
    rol: "ADMINISTRADOR",
    fechaNacimiento: "1985-05-15",
  },
  {
    id: 3,
    nombreUsuario: "moderador",
    contrasena: "mod123",
    correo: "moderador@photobogota.com",
    nombre: "Moderador",
    apellido: "Demo",
    rol: "MODERADOR",
    fechaNacimiento: "1992-03-20",
  },
];

/**
 * Registra un nuevo usuario en el array demo (en memoria).
 * Simula el comportamiento del servidor.
 * @param {{ email, nombres, apellidos, fechaNacimiento, contrasena }} datos
 * @returns {{ exitoso: boolean, mensaje: string }}
 */
export const registrarUsuarioDemo = (datos) => {
  const { email, nombres, apellidos, nombreUsuario, fechaNacimiento, contrasena } = datos;

  // Verificar si el correo ya existe
  const correoExiste = USUARIOS_DEMO.some((u) => u.correo === email);
  if (correoExiste) {
    return {
      exitoso: false,
      mensaje: "Ya existe una cuenta con ese correo en modo demo.",
    };
  }

  // Verificar si el nombreUsuario ya existe
  const usuarioExiste = USUARIOS_DEMO.some((u) => u.nombreUsuario === nombreUsuario);
  if (usuarioExiste) {
    return {
      exitoso: false,
      mensaje: "Ese nombre de usuario ya está en uso en modo demo.",
    };
  }

  const nuevoUsuario = {
    id: USUARIOS_DEMO.length + 1,
    nombreUsuario,
    contrasena,
    correo: email,
    nombre: nombres,
    apellido: apellidos,
    rol: "MIEMBRO",
    fechaNacimiento,
  };

  USUARIOS_DEMO.push(nuevoUsuario);

  return {
    exitoso: true,
    mensaje: `Cuenta demo creada. Tu usuario es: ${nombreUsuario}`,
    nombreUsuario,
  };
};