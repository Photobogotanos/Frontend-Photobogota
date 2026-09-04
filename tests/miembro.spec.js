import { test, expect } from "@playwright/test";
import { iniciarSesion, abrirMenuLateral, irDesdeMenuLateral } from "./helpers/login.js";

test.describe("Flujo de miembro", () => {
  test.beforeEach(async ({ page }) => {
    // Inicia sesión y aterriza en el mapa
    await iniciarSesion(page, "MIEMBRO");
    await expect(page).toHaveURL(/\/mapa/);
  });

  test("un miembro logueado ve el mapa", async ({ page }) => {
    await expect(page.locator(".leaflet-container")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Ocultar filtros" }),
    ).toBeVisible();
  });

  test("el menú lateral de miembro muestra las opciones de su rol", async ({ page }) => {
    await abrirMenuLateral(page);

    const menu = page.locator(".offcanvas.show");
    await expect(menu.getByRole("link", { name: "Mapa" })).toBeVisible();
    await expect(menu.getByRole("link", { name: "Mi Perfil" })).toBeVisible();
    await expect(menu.getByRole("link", { name: "Ser Socio" })).toBeVisible();
  });

  test("navega por el menú y cada opción muestra su página", async ({ page }) => {
    const opciones = [
      {
        item: "Mapa",
        url: /\/mapa/,
        verificar: () =>
          expect(
            page.getByRole("button", { name: "Ocultar filtros" }),
          ).toBeVisible(),
      },
      {
        item: "Mi Perfil",
        url: /\/perfil/,
        verificar: () =>
          expect(page.getByRole("button", { name: "Editar perfil" })).toBeVisible(),
      },
      {
        item: "Ser Socio",
        url: /\/solicitud-socio\/formulario/,
        verificar: () =>
          expect(
            page.getByRole("heading", { name: "Solicitud de socio" }),
          ).toBeVisible(),
      },
    ];

    for (const opcion of opciones) {
      await irDesdeMenuLateral(page, opcion);
    }
  });
});
