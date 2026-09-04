import { test, expect } from "@playwright/test";
import { iniciarSesion, dismissSwalSiAbierto } from "./helpers/login.js";
import { obtenerPrimerSpot } from "./helpers/api.js";

// Tests de ESCRITURA del rol MIEMBRO: acciones que CREAN o ENVÍAN contra el
// backend real. Por decisión del usuario: NO se prueban acciones destructivas
// y no hay restricciones de escritura en la BD compartida.
//
// NOTA: Se eliminó el test de "cambiar contraseña". Cualquier fallo intermedio
// dejaba la cuenta real de DANFEL7 con una contraseña aleatoria sin restaurar
// (incidente al que el usuario le da seguimiento), así que es demasiado
// riesgoso probarlo sobre una credencial de producción.

test.describe("Escrituras de miembro", () => {
  // Cooldown entre tests: el backend real compartido aplica rate-limit por
  // ventana de tiempo. Sin este delay, 5 logins + requests en secuencia
  // caen en "Demasiadas solicitudes".
  test.afterEach(async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
  });

  test("edita su perfil (nombres, biografía, teléfono)", async ({ page }) => {
    await iniciarSesion(page, "MIEMBRO");
    await page.goto("/perfil");
    await dismissSwalSiAbierto(page);

    await page.getByRole("button", { name: "Editar perfil" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    const sufijo = Date.now();
    await page.getByLabel("Nombre completo").fill(`Nombre E2E ${sufijo}`);
    await page.getByLabel("Biografía").fill("Biografía editada por test e2e.");
    await page.getByLabel("Teléfono").fill("3101112233");

    await page.getByRole("button", { name: "Guardar Cambios" }).click();

    await expect(
      page.getByRole("heading", { name: "¡Perfil actualizado!" }),
    ).toBeVisible({ timeout: 20000 });
    await page.locator(".swal2-confirm").click().catch(() => {});
  });

  test("guarda un spot como favorito", async ({ page }) => {
    const spot = await obtenerPrimerSpot(page.request);
    test.skip(!spot, "No hay spots en la BD para probar guardado");

    await iniciarSesion(page, "MIEMBRO");
    await page.goto(`/spot/${spot.id}`);
    await dismissSwalSiAbierto(page);

    // El spot puede haber quedado guardado por una corrida anterior (la BD es
    // compartida y mutable), así que normalizamos al estado "no guardado".
    const botonQuitar = page.getByRole("button", { name: "Quitar de guardados" });
    const botonGuardar = page.getByRole("button", { name: "Guardar spot" });
    await expect(botonGuardar.or(botonQuitar).first()).toBeVisible({
      timeout: 20000,
    });
    if (await botonQuitar.isVisible().catch(() => false)) {
      await botonQuitar.click();
      await expect(botonGuardar).toBeVisible({ timeout: 20000 });
    }

    await botonGuardar.click();
    await expect(botonQuitar).toBeVisible({ timeout: 20000 });
  });

  test("reporta un spot y recibe un número de ticket", async ({ page }) => {
    const spot = await obtenerPrimerSpot(page.request);
    test.skip(!spot, "No hay spots en la BD para probar reporte");

    await iniciarSesion(page, "MIEMBRO");
    await page.goto(`/spot/${spot.id}`);
    await dismissSwalSiAbierto(page);

    await page.getByRole("button", { name: "Reportar" }).click();
    await page.getByLabel("Categoría").selectOption("CONTENIDO_OFENSIVO");
    await page
      .getByPlaceholder("Cuéntanos qué pasó...")
      .fill("Contenido e2e a revisar");

    await page.getByRole("button", { name: "Enviar reporte" }).click();

    await expect(
      page.getByRole("heading", { name: "Reporte enviado" }),
    ).toBeVisible({ timeout: 20000 });
    await expect(page.locator(".ticket-label")).toHaveText("Número de ticket");
  });

  test("configura las preferencias de notificaciones", async ({ page }) => {
    await iniciarSesion(page, "MIEMBRO");
    await page.goto("/perfil");
    await dismissSwalSiAbierto(page);

    await page.getByRole("button", { name: "Notificaciones" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText("Preferencias de Notificaciones")).toBeVisible();

    // Cambia el canal preferido a correo (react-select)
    await page.getByLabel("Recibir notificaciones").check().catch(() => {});
    await page
      .locator("#canalPreferido .spot-select__control")
      .click();
    await page.getByText("Solo por correo electrónico").click();

    await page.getByRole("button", { name: "Guardar Preferencias" }).click();

    await expect(
      page.getByText("Preferencias guardadas correctamente"),
    ).toBeVisible({ timeout: 20000 });
  });
});
