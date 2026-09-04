import { test, expect } from "@playwright/test";
import { iniciarSesion } from "./helpers/login.js";

const API_BASE = "https://photoapi.duckdns.org/api/v1";

// Calificaciones de un spot existente con usuario autenticado.
// El spot se obtiene de la BD real (mismos spots que pinta el mapa).
// Flujo: primero se CREA una calificación y después se MODIFICA.
test.describe("Calificaciones de un spot", () => {
  test("un usuario autenticado puede calificar y luego modificar su calificación", async ({ page }) => {
    // Obtener un spot real de la BD (lectura).
    const respuesta = await page.request.get(`${API_BASE}/spots`);
    expect(respuesta.ok()).toBeTruthy();
    const spots = (await respuesta.json()) || [];
    const spot = Array.isArray(spots) ? spots[0] : spots?.data?.[0] || spots?.content?.[0];
    expect(spot?.id).toBeDefined();

    await iniciarSesion(page, "MIEMBRO");

    // Ir directo a la página de ese spot real
    await page.goto(`/spot/${spot.id}`);

    const seccion = page.getByRole("heading", { name: "Calificaciones" });
    await expect(seccion).toBeVisible({ timeout: 20000 });

    // ── 1) Crear calificación (si aún no hay una) ──
    const tituloCrear = page.getByText("Calificá este spot");
    if (await tituloCrear.isVisible().catch(() => false)) {
      await page
        .getByRole("button", { name: "Calificar con 5 estrellas" })
        .click();
      await page
        .getByRole("textbox", { name: "Comentario de la calificación" })
        .fill("Comentario e2e: excelente lugar.");
      await page.getByRole("button", { name: "Enviar calificación" }).click();
    }

    // Tras crear, la app muestra "Tu calificación" con botón "Editar"
    await expect(page.getByText("Tu calificación")).toBeVisible({ timeout: 20000 });
    await expect(page.getByRole("button", { name: "Editar" })).toBeVisible();

    // ── 2) Modificar la calificación ──
    await page.getByRole("button", { name: "Editar" }).click();
    await expect(page.getByText("Editar tu calificación")).toBeVisible();
    await page
      .getByRole("button", { name: "Calificar con 4 estrellas" })
      .click();
    await page
      .getByRole("textbox", { name: "Comentario de la calificación" })
      .fill("Comentario e2e modificado.");
    await page.getByRole("button", { name: "Actualizar reseña" }).click();

    // Tras modificar sigue mostrando "Tu calificación" con la reseña actualizada
    await expect(page.getByText("Tu calificación")).toBeVisible({ timeout: 20000 });
    await expect(page.getByText("Comentario e2e modificado.")).toBeVisible();
  });
});
