import { test, expect } from "@playwright/test";
import { iniciarSesion, abrirMenuLateral } from "./helpers/login.js";

test.describe("Flujo de administrador", () => {
  test.beforeEach(async ({ page }) => {
    await iniciarSesion(page, "ADMIN");
  });

  test("ve sus opciones de administrador en el menú lateral", async ({ page }) => {
    await abrirMenuLateral(page);

    const menu = page.locator(".offcanvas.show");
    await expect(menu.getByRole("link", { name: "Gestión Cuentas" })).toBeVisible();
    await expect(menu.getByRole("link", { name: "Reportes" })).toBeVisible();
    await expect(menu.getByRole("link", { name: "Ver Logs" })).toBeVisible();
    await expect(menu.getByRole("link", { name: "Enviar Notificación" })).toBeVisible();
  });

  test("visita la página de gestión de usuarios", async ({ page }) => {
    await page.goto("/admin/usuarios");
    await expect(
      page.getByRole("heading", { name: "Usuarios", exact: true }),
    ).toBeVisible();
  });

  test("visita la página de crear cuentas", async ({ page }) => {
    await page.goto("/admin/crear-cuentas");
    await expect(
      page.getByRole("heading", { name: "Crear Nueva Cuenta" }),
    ).toBeVisible();
  });

  test("visita la página de logs", async ({ page }) => {
    await page.goto("/admin/ver-logs");
    await expect(
      page.getByRole("heading", { name: "Visualizador de logs" }),
    ).toBeVisible();
  });

  test("visita la página de moderación de palabras", async ({ page }) => {
    await page.goto("/admin/moderacion/palabras");
    await expect(
      page.getByRole("heading", { name: "Palabras y frases prohibidas" }),
    ).toBeVisible();
  });

  test("visita la página de mantenimiento", async ({ page }) => {
    await page.goto("/admin/notificaciones-mantenimiento");
    await expect(
      page.getByRole("heading", { name: "Mantenimiento del sistema" }),
    ).toBeVisible();
  });

  test("visita la página de enviar notificación", async ({ page }) => {
    await page.goto("/admin/enviar-notificacion");
    await expect(
      page.getByRole("heading", { name: "Enviar notificación" }),
    ).toBeVisible();
  });

  test("el navbar no muestra el botón de crear para admin", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: /Crear nuevo/ }),
    ).toHaveCount(0);
  });
});
