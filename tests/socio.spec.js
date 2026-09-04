import { test, expect } from "@playwright/test";
import { iniciarSesion, abrirMenuLateral, irDesdeMenuLateral } from "./helpers/login.js";

test.describe("Flujo de socio", () => {
  test.beforeEach(async ({ page }) => {
    await iniciarSesion(page, "SOCIO");
    await expect(page).toHaveURL(/\/mapa/);
  });

  test("el menú lateral de socio muestra las opciones de su rol", async ({ page }) => {
    await abrirMenuLateral(page);

    const menu = page.locator(".offcanvas.show");
    await expect(menu.getByRole("link", { name: "Locales", exact: true })).toBeVisible();
    await expect(menu.getByRole("link", { name: "Promociones", exact: true })).toBeVisible();
    await expect(menu.getByRole("link", { name: "Estadísticas", exact: true })).toBeVisible();
    await expect(
      menu.getByRole("link", { name: "Reportes de mis locales", exact: true }),
    ).toBeVisible();
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
        item: "Locales",
        url: /\/locales/,
        verificar: () =>
          expect(
            page.getByText("Mis Locales", { exact: true }).first(),
          ).toBeVisible(),
      },
      {
        item: "Promociones",
        url: /\/socio-promociones/,
        verificar: () =>
          expect(
            page.getByRole("heading", { name: "Mis Promociones", level: 1 }),
          ).toBeVisible(),
      },
      {
        item: "Estadísticas",
        url: /\/estadisticas/,
        verificar: () =>
          expect(
            page.getByRole("heading", { name: "Estadísticas de tu Negocio" }),
          ).toBeVisible(),
      },
      {
        item: "Reportes de mis locales",
        url: /\/socio\/reportes/,
        verificar: () =>
          expect(
            page.getByRole("heading", { name: "Reportes de mis locales" }),
          ).toBeVisible(),
      },
    ];

    for (const opcion of opciones) {
      await irDesdeMenuLateral(page, opcion);
    }
  });
});
