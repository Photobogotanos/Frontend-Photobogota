import { test, expect } from "@playwright/test";
import { iniciarSesion } from "./helpers/login.js";

test.describe("Listado de spots", () => {
  test("el mapa muestra al menos un spot existente en la BD", async ({ page }) => {
    await iniciarSesion(page, "MIEMBRO");

    // Espera a que el mapa termine de cargar los spots del backend
    await expect(page.locator(".mapa-cargando")).toBeHidden({ timeout: 20000 });

    // Al menos un spot real se renderiza como marker de Leaflet o clúster
    const hayMarkers = page.locator(".leaflet-marker-icon, .marker-cluster");
    await expect(hayMarkers.first()).toBeVisible({ timeout: 20000 });

    // El navegador muestra el mapa de Bogotá
    await expect(page.locator(".leaflet-container")).toBeVisible();
  });
});
