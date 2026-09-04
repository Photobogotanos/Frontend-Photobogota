import { test, expect } from "@playwright/test";
import {
  iniciarSesion,
  abrirMenuLateral,
  irDesdeMenuLateral,
  verificarContenidoPagina,
} from "./helpers/login.js";

test.describe("Flujo de administrador", () => {
  test.beforeEach(async ({ page }) => {
    await iniciarSesion(page, "ADMIN");
    await expect(page).toHaveURL(/\/mapa/);
  });

  test("el menú lateral de administrador muestra las opciones de su rol", async ({ page }) => {
    await abrirMenuLateral(page);

    const menu = page.locator(".offcanvas.show");
    await expect(menu.getByRole("link", { name: "Gestión Cuentas" })).toBeVisible();
    await expect(menu.getByRole("link", { name: "Reportes" })).toBeVisible();
    await expect(menu.getByRole("link", { name: "Ver Logs" })).toBeVisible();
    await expect(menu.getByRole("link", { name: "Enviar Notificación" })).toBeVisible();
  });

  test("navega por el menú y cada opción muestra su página", async ({ page }) => {
    const vcp = verificarContenidoPagina;

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
        verificar: (p) => vcp(p, "Enviar notificación"),
      },
      {
        item: "Reportes",
        url: /\/admin\/reportes/,
        verificar: (p) => vcp(p, "Dashboard de reportes"),
      },
      {
        item: "Sol. Eliminación cuentas",
        url: /\/admin\/eliminaciones/,
        verificar: (p) =>
          vcp(p, "Solicitudes de eliminación de cuenta"),
      },
      {
        item: "Gestión Cuentas",
        url: /\/admin\/usuarios/,
        verificar: (p) => vcp(p, "Usuarios"),
      },
      {
        item: "Notificaciones de Mantenimiento",
        url: /\/admin\/notificaciones-mantenimiento/,
        verificar: (p) => vcp(p, "Mantenimiento del sistema"),
      },
      {
        item: "Filtro de contenido",
        url: /\/admin\/moderacion\/palabras/,
        verificar: (p) => vcp(p, "Palabras y frases prohibidas"),
      },
      {
        item: "Historial de moderación",
        url: /\/admin\/moderacion\/historial/,
        verificar: (p) => vcp(p, "Historial de moderación"),
      },
      {
        item: "Apelaciones",
        url: /\/admin\/moderacion\/apelaciones/,
        verificar: (p) => vcp(p, "Apelaciones de suspensión"),
      },
      {
        item: "Ver Logs",
        url: /\/admin\/ver-logs/,
        verificar: (p) => vcp(p, "Visualizador de logs"),
      },
    ];

    for (const opcion of opciones) {
      await irDesdeMenuLateral(page, opcion);
    }
  });
});
