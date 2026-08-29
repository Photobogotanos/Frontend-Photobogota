import { test, expect } from "@playwright/test";

test.describe("Página de inicio (pública)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("muestra la portada principal de PhotoBogotá", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "PhotoBogotá", level: 1 }),
    ).toBeVisible();
    await expect(
      page.getByText("Comunidad fotográfica de Bogotá"),
    ).toBeVisible();
  });

  test("contiene las secciones de inspiración y reseñas", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Inspiración" })).toBeVisible();
    await expect(
      page.getByText("Esto dicen los parceros"),
    ).toBeVisible();
  });

  test("los enlaces de navegación públicos están disponibles", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: "Iniciar Sesión" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "¿Quieres ser socio?" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Quiénes somos" }),
    ).toBeVisible();
  });
});
