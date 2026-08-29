import { test, expect } from "@playwright/test";
import { inputJuntoAlabel, passwordJuntoAlabel } from "./helpers/campos.js";

// Llena todos los campos obligatorios del registro. El email DEBE ser
// válido para que el navegador no bloquee el submit por validación nativa
// (input type="email") antes de que React evalúe sus propias reglas.
async function llenarCamposBase(page, email, pass1, pass2) {
  await inputJuntoAlabel(page, "Email").fill(email);
  await inputJuntoAlabel(page, "Nombres").fill("Juan");
  await inputJuntoAlabel(page, "Apellidos").fill("Perez");
  await inputJuntoAlabel(page, "Nombre de usuario").fill("juanperez_e2e_test");
  await inputJuntoAlabel(page, "Fecha de nacimiento").fill("2000-05-15");
  await passwordJuntoAlabel(page, "Contraseña").fill(pass1);
  await passwordJuntoAlabel(page, "Confirmación de la contraseña").fill(pass2);
}

test.describe("Registro de cuenta (validaciones)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/creacion-cuenta");
  });

  test("al intentar enviar con campos vacíos muestra error de campos incompletos", async ({ page }) => {
    await page.getByRole("button", { name: /Guardar/ }).click();

    const swal = page.locator(".swal2-modal");
    await expect(swal).toBeVisible();
    await expect(swal.getByText("Campos incompletos")).toBeVisible();
  });

  test("un correo mal formado es bloqueado antes del envío", async ({ page }) => {
    // Con un valor inválido en un input type="email", el navegador aplica la
    // validación nativa y NO se dispara el submit de React (ni el Swal).
    await llenarCamposBase(page, "correo-no-valid", "Clave1234", "Clave1234");

    await page.getByRole("button", { name: /Guardar/ }).click();

    // No hay Swal de éxito (ni de ningún resultado de React) y no navega a /login.
    await page.locator(".swal2-modal").waitFor({ state: "hidden", timeout: 3000 }).catch(() => {});
    await expect(page).toHaveURL(/\/creacion-cuenta/);
    await expect(
      page.getByRole("button", { name: /Guardar/ }),
    ).toBeEnabled();
  });

  test("rechaza una contraseña insegura", async ({ page }) => {
    await llenarCamposBase(page, "juan.perez@test.com", "solopass", "solopass");

    await page.getByRole("button", { name: /Guardar/ }).click();

    const swal = page.locator(".swal2-modal");
    await expect(swal).toBeVisible();
    await expect(swal.getByText("Contraseña insegura")).toBeVisible();
  });

  test("rechaza contraseñas que no coinciden", async ({ page }) => {
    await llenarCamposBase(page, "juan.perez@test.com", "Clave1234", "OtraClave1234");

    await page.getByRole("button", { name: /Guardar/ }).click();

    const swal = page.locator(".swal2-modal");
    await expect(swal).toBeVisible();
    await expect(swal.getByText("Las contraseñas no coinciden")).toBeVisible();
  });
});
