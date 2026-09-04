import { test, expect } from "@playwright/test";
import { iniciarSesion } from "./helpers/login.js";
import { marcarPuntoEnMapa, publicarSpot } from "./helpers/crearSpot.js";

// Crea un spot real contra la BD (rol MIEMBRO) siguiendo el flujo real:
// 1) Login → mapa, 2) activar "Marcar spot" y pin en el mapa (genera coords),
// 3) llenar el formulario y publicar.
test.describe("Crear spot (rol MIEMBRO)", () => {
  test("un miembro autenticado puede crear un spot", async ({ page }) => {
    const nombre = `Spot E2E ${Date.now()}`;

    await iniciarSesion(page, "MIEMBRO");

    await marcarPuntoEnMapa(page);

    // Header específico del rol MIEMBRO: "Crear local" / "Nuevo establecimiento"
    await expect(page.getByText("Nuevo establecimiento")).toBeVisible();

    // Sección de coordenadas llenada (lat/long) tras el click en el mapa
    await expect(page.getByText(/✓ Coordenadas:/)).toBeVisible();

    const spotId = await publicarSpot(page, { nombre });
    expect(spotId).toBeDefined();
  });
});
