// Helper reutilizable para crear un spot/local desde el mapa, siguiendo el
// flujo real de la app. Lo usan los tests de MIEMBRO (tipo SPOT) y SOCIO
// (tipo LOCAL, añade teléfono/sitio web).
import { expect } from "@playwright/test";

/**
 * Marca un punto en el mapa (modo publicar) y espera aterrizar en /crear-spot.
 * Geoman (Leaflet) crea el marker con mousedown/mouseup en una posición fija;
 * el click() normal de Playwright mueve el ratón (tiny-drag) y Geoman lo cancela.
 * @param {import('@playwright/test').Page} page
 */
export async function marcarPuntoEnMapa(page) {
  await page.getByRole("button", { name: "Marcar spot" }).click();

  const mapaLocator = page.locator(".mapa-bogota");
  await mapaLocator.waitFor({ state: "visible" });
  const box = await mapaLocator.boundingBox();
  const cx = box.x + box.width * 0.35;
  const cy = box.y + box.height * 0.35;
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.up();

  await expect(page).toHaveURL(/\/crear-spot/, { timeout: 15000 });
}

/**
 * Llena y publica el formulario de /crear-spot. Al final navega a /spot/{id}.
 * @param {import('@playwright/test').Page} page
 * @param {object} datos
 * @param {string} datos.nombre Nombre del lugar
 * @param {string} [datos.direccion]
 * @param {string} [datos.descripcion]
 * @param {string} [datos.telefono] Solo SOCIO
 * @param {string} [datos.sitioWeb] Solo SOCIO
 */
export async function publicarSpot(page, datos) {
  const {
    nombre,
    direccion = "Calle 85 # 11-45, Bogotá",
    descripcion = "Descripción generada por el test e2e.",
    telefono = "",
    sitioWeb = "",
  } = datos;

  // Nombre
  await page.getByPlaceholder("Ej: Mirador de Monserrate").fill(nombre);

  // Dirección
  await page
    .getByPlaceholder("Ej: Carrera 7 # 32-16, La Candelaria")
    .fill(direccion);

  // Datos de local (solo SOCIO) - opcionales
  if (telefono) {
    await page.locator("#telefono-local").fill(telefono);
  }
  if (sitioWeb) {
    await page.locator("#web-local").fill(sitioWeb);
  }

  // Categoría (react-select)
  await page.locator("input#categoria-spot").click();
  await page.locator(".spot-select__option").first().click();

  // Localidad (react-select)
  await page.locator("input#localidad-spot").click();
  await page.locator(".spot-select__option").first().click();

  // Descripción
  await page
    .getByPlaceholder("Describe lo que se ve en la foto")
    .fill(descripcion);

  // Imagen (input file oculto)
  await page
    .locator(".uploader-wrapper input[type=file]")
    .setInputFiles("tests/assets/foto-test.png");

  // Publicar
  await page.getByRole("button", { name: "Publicar", exact: true }).click();

  // Tras publicar, la app navega a /spot/{id} del nuevo lugar
  await expect(page).toHaveURL(/\/spot\/\d+/, { timeout: 30000 });
  return page.url().match(/\/spot\/(\d+)/)?.[1];
}
