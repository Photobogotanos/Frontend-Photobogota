import { test, expect } from "@playwright/test";
import { iniciarSesion, dismissSwalSiAbierto } from "./helpers/login.js";

// Tests de ESCRITURA del rol MOD: acciones que CREAN/ENVÍAN contra el backend
// real. Por decisión del usuario: solo crear/enviar (sin destructivas) y sin
// restricciones de escritura en la BD compartida.

test.describe("Escrituras de moderador", () => {
  test.beforeEach(async ({ page }) => {
    await iniciarSesion(page, "MOD");
  });

  test("crea una categoría de establecimiento", async ({ page }) => {
    await page.goto("/categorias");
    await dismissSwalSiAbierto(page);

    // El tab de categorías es el activo por defecto; el Swal de error del
    // backend podía interceptar el click, así que no lo volvemos a clickear.
    const nombre = `Categoría e2e ${Date.now()}`;
    await page.getByRole("button", { name: "Nueva Categoría" }).click();

    await page.locator("#nombre").fill(nombre);
    await page.locator("#descripcion").fill("Categoría creada por test e2e.");
    await page.locator("#imagen").fill("https://ejemplo.com/cat.webp");

    await page.getByRole("button", { name: "Crear" }).click();

    await expect(
      page.getByText("Categoría creada correctamente"),
    ).toBeVisible({ timeout: 20000 });
    await page.locator(".swal2-confirm").click().catch(() => {});
  });

  test("crea una localidad", async ({ page }) => {
    await page.goto("/categorias");
    await dismissSwalSiAbierto(page);
    await page.getByRole("tab", { name: "Localidades" }).click();

    const nombre = `Localidad e2e ${Date.now()}`;
    await page.getByRole("button", { name: "Nueva Localidad" }).click();

    await page.locator("#nombre").fill(nombre);
    await page.locator("#descripcion").fill("Localidad creada por test e2e.");

    await page.getByRole("button", { name: "Crear" }).click();

    await expect(
      page.getByText("Localidad creada correctamente"),
    ).toBeVisible({ timeout: 20000 });
    await page.locator(".swal2-confirm").click().catch(() => {});
  });

  test("envía una notificación", async ({ page }) => {
    await page.goto("/admin/enviar-notificacion");

    await page
      .locator('[aria-label="Título de la notificación"]')
      .fill(`Anuncio MOD e2e ${Date.now()}`);
    await page
      .locator('[aria-label="Mensaje de la notificación"]')
      .fill("Mensaje de prueba e2e.");

    await page.locator('button:has-text("Enviar notificación")').click();

    await expect(page.locator(".swal2-title")).toHaveText(
      "¿Enviar notificación?",
    );
    await page.locator('.swal2-confirm:has-text("Sí, enviar")').click();

    await expect(page.locator(".swal2-title")).toHaveText(
      "Notificación enviada",
      { timeout: 20000 },
    );
    await page.locator(".swal2-confirm").click().catch(() => {});
  });
});
