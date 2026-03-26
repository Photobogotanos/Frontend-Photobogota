/**
 * Datos mockup para el servicio de usuario
 * Contraseñas hasheadas con SHA-256 via Web Crypto API
 * Para regenerar un hash: await hashearContrasena("miContrasena")
 */

// Utilidad de hashing 

export const hashearContrasena = async (contrasena) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(contrasena);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

// Datos demo 
// Hashes pre-calculados:
//   socio123    → 637e7c5f2e791200a1688142f4fe61e137d9876fb52767286dd6355587ac870e
//   encerrado   → b5ea8243cd9dcc3b9a6b778895b035116564d8416ab01f355c23b5d69fdc0a15
//   mod123      → 09fbcc458fb3430db7ec54ee95635e7fbc06ccfd982b49c55ec53ab8ac2397e7
//   miembro123  → 00ea3591f221351a994c90c0d4914dcb1491aac2f912efce540773994d744f69

export const USUARIOS_DEMO = [
  {
    id: 1,
    nombreUsuario: "socio",
    contrasenaHash: "637e7c5f2e791200a1688142f4fe61e137d9876fb52767286dd6355587ac870e",
    correo: "socio@photobogota.com",
    nombre: "Socio Demo",
    apellido: "Demo",
    rol: "SOCIO",
    fechaNacimiento: "2004-11-05",
  },
  {
    id: 2,
    nombreUsuario: "perro",
    contrasenaHash: "b5ea8243cd9dcc3b9a6b778895b035116564d8416ab01f355c23b5d69fdc0a15",
    correo: "perro@photobogota.com",
    nombre: "Administrador",
    apellido: "Demo",
    rol: "ADMIN",
    fechaNacimiento: "2004-11-05",
  },
  {
    id: 3,
    nombreUsuario: "moderador",
    contrasenaHash: "09fbcc458fb3430db7ec54ee95635e7fbc06ccfd982b49c55ec53ab8ac2397e7",
    correo: "moderador@photobogota.com",
    nombre: "Moderador",
    apellido: "Demo",
    rol: "MOD",
    fechaNacimiento: "2004-11-05",
  },
  {
    id: 4,
    nombreUsuario: "miembro",
    contrasenaHash: "00ea3591f221351a994c90c0d4914dcb1491aac2f912efce540773994d744f69",
    correo: "miembro@photobogota.com",
    nombre: "Miembro",
    apellido: "Demo",
    rol: "MIEMBRO",
    nivel: 5,
    fechaNacimiento: "2004-11-05",
  },
];

/**
 * Registra un nuevo usuario en el array demo (en memoria).
 * Simula el comportamiento del servidor.
 * @param {{ email, nombres, apellidos, nombreUsuario, fechaNacimiento, contrasena }} datos
 * @returns {Promise<{ exitoso: boolean, mensaje: string, nombreUsuario?: string }>}
 */
export const registrarUsuarioDemo = async (datos) => {
  const { email, nombres, apellidos, nombreUsuario, fechaNacimiento, contrasena } = datos;

  const correoExiste = USUARIOS_DEMO.some((u) => u.correo === email);
  if (correoExiste) {
    return { exitoso: false, mensaje: "Ya existe una cuenta con ese correo en modo demo." };
  }

  const usuarioExiste = USUARIOS_DEMO.some((u) => u.nombreUsuario === nombreUsuario);
  if (usuarioExiste) {
    return { exitoso: false, mensaje: "Ese nombre de usuario ya está en uso en modo demo." };
  }

  const contrasenaHash = await hashearContrasena(contrasena);

  const nuevoUsuario = {
    id: USUARIOS_DEMO.length + 1,
    nombreUsuario,
    contrasenaHash,
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