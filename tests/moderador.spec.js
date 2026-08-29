import { test, expect } from "@playwright/test";
import { iniciarSesion, abrirMenuLateral } from "./helpers/login.js";

test.describe("Flujo de moderador", () => {
  test.beforeEach(async ({ page }) => {
    await iniciarSesion(page, "MOD");
  });

  test("ve sus opciones de moderador en el menú lateral", async ({ page }) => {
    await abrirMenuLateral(page);

    const menu = page.locator(".offcanvas.show");
    await expect(menu.getByRole("link", { name: "Dashboard Reportes" })).toBeVisible();
    await expect(
      menu.getByRole("link", { name: "Revisar Solicitudes de Socios" }),
    ).toBeVisible();
    await expect(
      menu.getByRole("link", { name: "Categorías de Establecimiento" }),
    ).toBeVisible();
    await expect(menu.getByRole("link", { name: "Enviar Notificación" })).toBeVisible();
  });

  test("visita la página de revisión de solicitudes", async ({ page }) => {
    await page.goto("/moderador/revision-solicitudes");
    await expect(
      page.getByRole("heading", { name: "Solicitudes de Membresía" }),
    ).toBeVisible();
  });

  test("visita la página de categorías", async ({ page }) => {
    await page.goto("/categorias");
    await expect(
      page.getByRole("heading", { name: "Gestión de Categorías y Localidades" }),
    ).toBeVisible();
  });

  test("no puede acceder a rutas de administrador", async ({ page }) => {
    await page.goto("/admin/usuarios");
    // ProtectedRoute redirige al inicio (/) si no tiene el rol
    await expect(page).toHaveURL(/\/$/);
  });
});
