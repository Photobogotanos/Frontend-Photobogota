import { test, expect } from "@playwright/test";
import { iniciarSesion, abrirMenuLateral } from "./helpers/login.js";

test.describe("Rutas protegidas", () => {
  test("redirige a /login al visitar una ruta protegida sin sesión", async ({ page }) => {
    await page.goto("/mapa");
    await expect(page).toHaveURL(/\/login/);
  });

  test("redirige a /login al visitar /perfil sin sesión", async ({ page }) => {
    await page.goto("/perfil");
    await expect(page).toHaveURL(/\/login/);
  });

  test("redirige a /login al visitar /crear-spot sin sesión", async ({ page }) => {
    await page.goto("/crear-spot");
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("Cierre de sesión", () => {
  test("un usuario logueado puede cerrar sesión y vuelve al estado público", async ({ page }) => {
    await iniciarSesion(page, "MIEMBRO");

    // Cerrar sesión desde el menú lateral
    await abrirMenuLateral(page);
    await page
      .locator(".offcanvas.show")
      .getByRole("button", { name: "Cerrar Sesión" })
      .click();

    // Tras el logout queda des-autenticado: se ve la página pública (login) y
    // el navbar ya no tiene el menú lateral propio de un usuario logueado.
    await expect(
      page.getByRole("link", { name: "Iniciar Sesión" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Abrir menú lateral" }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: /Crear nuevo/ }),
    ).toHaveCount(0);
  });
});
