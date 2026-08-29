import { expect } from "@playwright/test";
import { USUARIOS } from "../credenciales.js";

/**
 * Inicia sesión con las credenciales de un rol dado y espera aterrizar en el mapa.
 * El backend real (photoapi.duckdns.org) es compartido y a veces responde lento
 * o con rate-limit; por eso reintentamos el envío si el primer intento no llega
 * a /mapa.
 * @param {import('@playwright/test').Page} page
 * @param {'MIEMBRO'|'SOCIO'|'MOD'|'ADMIN'} rol
 */
export async function iniciarSesion(page, rol = "MIEMBRO", reintentos = 2) {
  const credenciales = USUARIOS[rol];
  if (!credenciales) {
    throw new Error(`No hay credenciales para el rol: ${rol}`);
  }

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
 * Abre el menú lateral (Offcanvas) una vez logueado.
 * @param {import('@playwright/test').Page} page
 */
export async function abrirMenuLateral(page) {
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
  await page.locator(".offcanvas.show").getByText(textoItem, { exact: true }).first().click();
}
