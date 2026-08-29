import { test, expect } from "@playwright/test";

// Solo validaciones de UI que NO llegan a enviar correos reales al backend.
test.describe("Recuperar contraseña", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/recuperar-contrasena");
    await expect(
      page.getByRole("heading", { name: "Restablecer contraseña" }),
    ).toBeVisible();
  });

  test("muestra el formulario de recuperación", async ({ page }) => {
    await expect(
      page.getByPlaceholder("tucorreo@ejemplo.com"),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Enviar código" }),
    ).toBeVisible();
  });

  test("pide el correo si se envía vacío", async ({ page }) => {
    await page.getByRole("button", { name: "Enviar código" }).click();

    const swal = page.locator(".swal2-modal");
    await expect(swal).toBeVisible();
    await expect(swal.getByText("Correo requerido")).toBeVisible();
  });

  test("un correo mal formado es bloqueado antes del envío", async ({ page }) => {
    // El input es type="email": con un valor inválido el navegador aplica la
    // validación nativa y no llega a ejecutarse el submit de React.
    await page.getByPlaceholder("tucorreo@ejemplo.com").fill("no-es-correo");
    await page.getByRole("button", { name: "Enviar código" }).click();

    await page.locator(".swal2-modal").waitFor({ state: "hidden", timeout: 3000 }).catch(() => {});
    // No se envía: no aparece ningún Swal y nos mantenemos en la misma página.
    await expect(page).toHaveURL(/\/recuperar-contrasena/);
    await expect(
      page.getByRole("button", { name: "Enviar código" }),
    ).toBeEnabled();
  });
});
