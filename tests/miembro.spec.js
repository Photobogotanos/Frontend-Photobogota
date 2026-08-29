import { test, expect } from "@playwright/test";
import { iniciarSesion, abrirMenuLateral } from "./helpers/login.js";

test.describe("Flujo de miembro", () => {
  test("un miembro logueado ve el mapa", async ({ page }) => {
    await iniciarSesion(page, "MIEMBRO");

    await expect(page).toHaveURL(/\/mapa/);
    await expect(page.locator(".leaflet-container")).toBeVisible();
  });

  test("el menú lateral de miembro muestra las opciones de su rol", async ({ page }) => {
    await iniciarSesion(page, "MIEMBRO");
    await abrirMenuLateral(page);

    const menu = page.locator(".offcanvas.show");
    await expect(menu.getByRole("link", { name: "Mapa" })).toBeVisible();
    await expect(menu.getByRole("link", { name: "Mi Perfil" })).toBeVisible();
    await expect(menu.getByRole("link", { name: "Ser Socio" })).toBeVisible();
    await expect(
      menu.getByRole("button", { name: "Cerrar Sesión" }),
    ).toBeVisible();
  });

  test("abre el creador de spot desde el botón del navbar", async ({ page }) => {
    await iniciarSesion(page, "MIEMBRO");

    const botonCrear = page.getByRole("link", { name: "Crear nuevo spot" });
    await botonCrear.click();

    await expect(page).toHaveURL(/\/crear-spot/);
    await expect(page.getByText("Nuevo establecimiento")).toBeVisible();
  });

  test("ve las tabs de su perfil (Mis Spots / Mis Reseñas / Guardados)", async ({ page }) => {
    await iniciarSesion(page, "MIEMBRO");
    await abrirMenuLateral(page);
    await page
      .locator(".offcanvas.show")
      .getByRole("link", { name: "Mi Perfil" })
      .click();

    await expect(page).toHaveURL(/\/perfil/);

    const tabs = page.locator(".perfil-tabs");
    await expect(tabs.getByRole("button", { name: "Mis Spots" })).toBeVisible();
    await expect(tabs.getByRole("button", { name: "Mis Reseñas" })).toBeVisible();
    await expect(tabs.getByRole("button", { name: "Guardados" })).toBeVisible();
  });
});
