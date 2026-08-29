import { test, expect } from "@playwright/test";
import { iniciarSesion, abrirMenuLateral } from "./helpers/login.js";

test.describe("Flujo de socio", () => {
  test.beforeEach(async ({ page }) => {
    await iniciarSesion(page, "SOCIO");
  });

  test("ve sus opciones de socio en el menú lateral", async ({ page }) => {
    await abrirMenuLateral(page);

    const menu = page.locator(".offcanvas.show");
    await expect(menu.getByRole("link", { name: "Locales", exact: true })).toBeVisible();
    await expect(menu.getByRole("link", { name: "Promociones", exact: true })).toBeVisible();
    await expect(menu.getByRole("link", { name: "Estadísticas", exact: true })).toBeVisible();
    await expect(
      menu.getByRole("link", { name: "Reportes de mis locales", exact: true }),
    ).toBeVisible();
  });

  test("visita la página de Locales", async ({ page }) => {
    await page.goto("/locales");
    await expect(page.getByText("Mis Locales", { exact: true }).first()).toBeVisible();
  });

  test("visita la página de Promociones", async ({ page }) => {
    await page.goto("/socio-promociones");
    await expect(
      page.getByRole("heading", { name: "Mis Promociones", level: 1 }),
    ).toBeVisible();
  });

  test("visita la página de Estadísticas", async ({ page }) => {
    await page.goto("/estadisticas");
    await expect(
      page.getByRole("heading", { name: "Estadísticas de tu Negocio" }),
    ).toBeVisible();
  });

  test("el navbar muestra el botón 'Crear Local'", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: "Crear nuevo local" }),
    ).toBeVisible();
  });
});
