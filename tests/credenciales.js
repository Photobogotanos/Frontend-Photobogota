// Credenciales de prueba para los tests E2E.
//
// El repo ya usa credenciales de prueba literales (ver tests/auth.spec.js).
// Para no comitear secretos reales en el control de versiones, cada valor
// se puede sobreescribir desde variables de entorno (así un CI o un
// desarrollador puede inyectar sus propias credenciales sin tocar el código).
// Playwright carga automáticamente las variables de un `.env` del proyecto.
//
// Ejemplos:
//   E2E_MIEMBRO_USER=... E2E_MIEMBRO_PASS=... pnpm run test:e2e
const env = (nombre, fallback) => process.env[nombre] || fallback;

export const USUARIOS = {
  MIEMBRO: {
    login: env("E2E_MIEMBRO_USER", "Yanpol7"),
    contrasena: env("E2E_MIEMBRO_PASS", "Sergiogeien4."),
  },
  SOCIO: {
    login: env("E2E_SOCIO_USER", "Danfel67"),
    contrasena: env("E2E_SOCIO_PASS", "Photobogotanos123"),
  },
  MOD: {
    login: env("E2E_MOD_USER", "sergon123"),
    contrasena: env("E2E_MOD_PASS", "Photobogotanos123"),
  },
  ADMIN: {
    login: env("E2E_ADMIN_USER", "sebassye"),
    contrasena: env("E2E_ADMIN_PASS", "Canela2505."),
  },
};

export const CREDENCIALES_INVALIDAS = {
  login: "usuario-que-no-existe@test.com",
  contrasena: "ClaveIncorrecta123.",
};

export const correoDemostr = (rol) =>
  `${USUARIOS[rol]?.login || "usuario"}@test-e2e-photobogota.com`;
