import { test, expect } from "@playwright/test";
import {
  iniciarSesion,
  abrirMenuLateral,
  irDesdeMenuLateral,
  verificarContenidoPagina,
} from "./helpers/login.js";

test.describe("Flujo de moderador", () => {
  test.beforeEach(async ({ page }) => {
    await iniciarSesion(page, "MOD");
    await expect(page).toHaveURL(/\/mapa/);
  });

  test("el menú lateral de moderador muestra las opciones de su rol", async ({ page }) => {
    await abrirMenuLateral(page);

    const menu = page.locator(".offcanvas.show");
    await expect(menu.getByRole("link", { name: "Dashboard Reportes" })).toBeVisible();
    await expect(
      menu.getByRole("link", { name: "Revisar Solicitudes de Socios" }),
    ).toBeVisible();
    await expect(menu.getByRole("link", { name: "Gestionar Reportes" })).toBeVisible();
    await expect(
      menu.getByRole("link", { name: "Categorías de Establecimiento" }),
    ).toBeVisible();
    await expect(menu.getByRole("link", { name: "Enviar Notificación" })).toBeVisible();
  });

  test("navega por el menú y cada opción muestra su página", async ({ page }) => {
    const dashboard = (p) => verificarContenidoPagina(p, "Dashboard de reportes");

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
        item: "Enviar Notificación",
        url: /\/admin\/enviar-notificacion/,
        verificar: (p) =>
          verificarContenidoPagina(p, "Enviar notificación"),
      },
      {
        item: "Dashboard Reportes",
        url: /\/dashboard-reportes/,
        verificar: dashboard,
      },
      {
        item: "Revisar Solicitudes de Socios",
        url: /\/moderador\/revision-solicitudes/,
        verificar: (p) =>
          verificarContenidoPagina(p, "Solicitudes de Membresía"),
      },
      {
        item: "Gestionar Reportes",
        url: /\/gestionar-reportes/,
        verificar: dashboard,
      },
      {
        item: "Categorías de Establecimiento",
        url: /\/categorias/,
        verificar: (p) =>
          verificarContenidoPagina(p, "Gestión de Categorías y Localidades"),
      },
    ];

    for (const opcion of opciones) {
      await irDesdeMenuLateral(page, opcion);
    }
  });

  test("no puede acceder a rutas de administrador", async ({ page }) => {
    await page.goto("/admin/usuarios");
    // ProtectedRoute restringe /admin/* a rol ADMIN; un MOD es redirigido al inicio (/)
    await expect(page).toHaveURL(/\/$/);
  });
});
