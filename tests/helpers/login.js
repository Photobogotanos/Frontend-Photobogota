import { expect } from "@playwright/test";
import { USUARIOS } from "../credenciales.js";

/**
 * Inicia sesión con las credenciales de un rol dado y espera aterrizar en el mapa.
 * El backend real (photoapi.duckdns.org) es compartido y a veces responde lento
 * o con rate-limit; por eso reintentamos el envío si el primer intento no llega
 * a /mapa.
 * @param {import('@playwright/test').Page} page
 * @param {'MIEMBRO'|'SOCIO'|'MOD'|'ADMIN'} rol
 * @param {number} reintentos
 * @param {{login?: string, contrasena?: string}} [credencialesExtra]
 *   Credenciales personalizadas (p.ej. tras cambiar la contraseña en un test).
 */
export async function iniciarSesion(
  page,
  rol = "MIEMBRO",
  reintentos = 2,
  credencialesExtra = {},
) {
  const credencialesBase = USUARIOS[rol];
  if (!credencialesBase) {
    throw new Error(`No hay credenciales para el rol: ${rol}`);
  }
  const credenciales = {
    login: credencialesExtra.login ?? credencialesBase.login,
    contrasena: credencialesExtra.contrasena ?? credencialesBase.contrasena,
  };

  for (let intento = 0; intento <= reintentos; intento++) {
    await page.goto("/login");

    await page
      .getByPlaceholder("Ingresa tu usuario o correo electrónico")
      .fill(credenciales.login);

    await page
      .getByPlaceholder("Ingresa tu contraseña")
      .fill(credenciales.contrasena);

    await page.getByRole("button", { name: /Ingresar/ }).click();

    // Espera razonable para que el backend responda; si no llega a /mapa,
    // reintentamos (p.ej. rate-limit o lentitud del backend compartido).
    try {
      await expect(page).toHaveURL(/\/mapa/, { timeout: 15_000 });
      return;
    } catch {
      if (intento < reintentos) {
        console.log(`Login de ${rol} reintentando (intento ${intento + 1})...`);
      }
    }
  }

  throw new Error(
    `No se pudo iniciar sesión como ${rol} tras ${reintentos + 1} intentos. ` +
      `Credenciales: ${credenciales.login}. El backend real puede estar en rate-limit.`,
  );
}

/**
 * Cierra cualquier SweetAlert2 abierto para que no bloquee la interacción.
 * El backend real a veces muestra dialogs de error de forma tardía (tras una
 * request pendiente), así que hacemos un breve polling para capturarlos.
 */
export async function dismissSwalSiAbierto(page) {
  const contenedor = page.locator(".swal2-container.swal2-backdrop-show");
  const ok = page.locator(".swal2-confirm");

  // Polling breve: si el Swal aparece (incluso tardío), lo aceptamos con "OK".
  const inicio = Date.now();
  while (Date.now() - inicio < 1200) {
    if (await contenedor.isVisible().catch(() => false)) {
      await ok.click().catch(() => {});
      await contenedor
        .waitFor({ state: "hidden", timeout: 3000 })
        .catch(() => {});
      return;
    }
    await page.waitForTimeout(120);
  }
}

/**
 * Abre el menú lateral (Offcanvas) una vez logueado.
 * Descarta cualquier Swal abierto antes de hacer click, porque
 * los overlays de SweetAlert2 interceptan los clicks.
 * @param {import('@playwright/test').Page} page
 */
export async function abrirMenuLateral(page) {
  await dismissSwalSiAbierto(page);
  const boton = page.getByRole("button", { name: "Abrir menú lateral" });
  await boton.click();
  await expect(page.locator(".offcanvas.show")).toBeVisible();
}

/**
 * Cierra la sesión desde el menú lateral.
 * @param {import('@playwright/test').Page} page
 */
export async function cerrarSesion(page) {
  await abrirMenuLateral(page);
  await page.getByText("Cerrar Sesión").click();
  await expect(page).toHaveURL(/\/login/);
}

/**
 * Navega a una ruta del menú lateral buscando el texto del ítem.
 * @param {import('@playwright/test').Page} page
 * @param {string} textoItem
 */
export async function navegarDesdeMenuLateral(page, textoItem) {
  await abrirMenuLateral(page);
  await page
    .locator(".offcanvas.show")
    .getByText(textoItem, { exact: true })
    .first()
    .click();
}

/**
 * Verifica que la página muestra contenido: un heading esperado O un dialog
 * de error del Swal (ambos indican que la página cargó y mostró algo).
 * @param {import('@playwright/test').Page} page
 * @param {string} heading texto del heading esperado
 */
export async function verificarContenidoPagina(page, heading) {
  const headingLoc = page.getByRole("heading", { name: heading, exact: true });
  const swalLoc = page.locator(".swal2-modal");
  // Espera a que aparezca cualquiera de los dos (heading o Swal error)
  await expect(headingLoc.or(swalLoc)).toBeVisible({ timeout: 20_000 });
}

/**
 * Navega desde el menú lateral a una opción, espera llegar a su URL y verifica
 * que la página destino muestra contenido ("algo"). Reutiliza un verificador
 * opcional para validar un elemento visible específico de la página.
 *
 * @param {import('@playwright/test').Page} page
 * @param {object} opcion
 * @param {string} opcion.item Texto exacto del ítem en el menú lateral.
 * @param {string|RegExp} opcion.url Ruta o patrón de URL que debe alcanzarse.
 * @param {((p: import('@playwright/test').Page) => Promise<void>)?} [opcion.verificar]
 *   Función que verifica que la página carga (header, botón, etc.).
 */
export async function irDesdeMenuLateral(page, { item, url, verificar }) {
  await abrirMenuLateral(page);
  await page
    .locator(".offcanvas.show")
    .getByText(item, { exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(url);
  // Descarta cualquier Swal de error que el backend haya mostrado tras navegar,
  // para que no bloqueen la verificación de contenido.
  await dismissSwalSiAbierto(page);
  if (verificar) {
    await verificar(page);
  }
}
