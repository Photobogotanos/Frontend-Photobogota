import { test, expect } from "@playwright/test";
import { iniciarSesion } from "./helpers/login.js";
import { inputJuntoAlabel, passwordJuntoAlabel } from "./helpers/campos.js";

// Tests de ESCRITURA del rol ADMIN: acciones que CREAN/ENVÍAN contra el backend
// real. Por decisión del usuario: solo crear/enviar (sin destructivas) y sin
// restricciones de escritura en la BD compartida.

test.describe("Escrituras de administrador", () => {
  test.beforeEach(async ({ page }) => {
    await iniciarSesion(page, "ADMIN");
  });

  // Cooldown entre tests: el backend real compartido aplica rate-limit por
  // ventana de tiempo. Sin este delay, 5 logins + requests en secuencia
  // caen en "Demasiadas solicitudes".
  test.afterEach(async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
  });

  test("crea una cuenta de usuario (rol miembro)", async ({ page }) => {
    const sufijo = Date.now();
    const usuario = `e2e_admin_${sufijo}`;

    await page.goto("/admin/crear-cuentas");

    await inputJuntoAlabel(page, "Email").fill(`e2e_${sufijo}@test.com`);
    await inputJuntoAlabel(page, "Nombres").fill("Cuenta");
    await inputJuntoAlabel(page, "Apellidos").fill("E2E");
    await inputJuntoAlabel(page, "Nombre de usuario").fill(usuario);
    await inputJuntoAlabel(page, "Fecha de nacimiento").fill("1995-01-01");

    // Rol: Miembro (default, card) - evitar crear cuentas con accesos de más
    await page.locator(".role-card").first().click().catch(() => {});

    await passwordJuntoAlabel(page, "Contraseña").fill("ClaveSegura123");
    await passwordJuntoAlabel(page, "Confirmación").fill("ClaveSegura123");

    await page
      .getByRole("button", { name: "Crear Usuario" })
      .click();

    await expect(
      page.locator(".swal2-title").filter({ hasText: "Usuario creado" }),
    ).toBeVisible({ timeout: 20000 });
    await page.locator(".swal2-confirm").click().catch(() => {});
  });

  test("crea una regla de filtro de contenido", async ({ page }) => {
    const texto = `e2e-spam-${Date.now()}`;

    await page.goto("/admin/moderacion/palabras");

    await page.locator('button:has-text("Nueva regla")').click();

    await page.locator("#palabra-texto").fill(texto);

    // Tipo: PALABRA (default) y Categoría: SPAM
    await page.locator('[id="palabra-tipo"]').click();
    await page
      .locator(".spot-select__option")
      .filter({ hasText: "Palabra (coincidencia exacta)" })
      .click();
    await page.locator('[id="palabra-categoria"]').click();
    await page
      .locator(".spot-select__option")
      .filter({ hasText: "Spam" })
      .click();

    // Guardar
    await page.locator('.palabra-form-modal button[type="submit"]').click();

    // Toast de éxito (react-hot-toast)
    await expect(page.locator('[role="status"]')).toBeVisible({
      timeout: 20000,
    });
  });

  test("programa una notificación de mantenimiento", async ({ page }) => {
    await page.goto("/admin/notificaciones-mantenimiento");

    const inicio = page.locator(
      '[aria-label="Fecha y hora de inicio del mantenimiento"]',
    );
    const fin = page.locator(
      '[aria-label="Fecha y hora de fin del mantenimiento"]',
    );

    // Flatpickr se inicializa en un effect posterior al render; hay que esperar
    // a que la instancia `_flatpickr` exista antes de fijar la fecha.
    const setFecha = async (input, offDias) => {
      await input.waitFor({ state: "visible" });
      const fecha = new Date(Date.now() + offDias * 24 * 60 * 60 * 1000);
      fecha.setHours(8, 0, 0, 0);
      await input.evaluate(async (el, date) => {
        const fp = await new Promise((resolve) => {
          const check = () => {
            if (el._flatpickr) resolve(el._flatpickr);
            else setTimeout(check, 50);
          };
          check();
        });
        fp.setDate(date, true);
      }, fecha);
    };

    await setFecha(inicio, 30);
    await setFecha(fin, 31);

    await page
      .locator('[aria-label="Motivo del mantenimiento"]')
      .fill(`Mantenimiento e2e ${Date.now()}`);

    await page
      .locator('button:has-text("Programar y notificar a todos")')
      .click();

    // Swal confirmación
    await expect(page.locator(".swal2-title")).toHaveText(
      "¿Programar mantenimiento?",
    );
    await page.locator('.swal2-confirm:has-text("Sí, programar")').click();

    // Swal éxito
    await expect(page.locator(".swal2-title")).toHaveText(
      "Mantenimiento programado",
      { timeout: 20000 },
    );
    await page.locator(".swal2-confirm").click().catch(() => {});
  });

  test("envía una notificación", async ({ page }) => {
    await page.goto("/admin/enviar-notificacion");

    await page
      .locator('[aria-label="Título de la notificación"]')
      .fill(`Anuncio e2e ${Date.now()}`);
    await page
      .locator('[aria-label="Mensaje de la notificación"]')
      .fill("Mensaje de prueba e2e.");

    // Alcance: TODOS (default)
    await page.locator('button:has-text("Enviar notificación")').click();

    // Swal confirmación
    await expect(page.locator(".swal2-title")).toHaveText(
      "¿Enviar notificación?",
    );
    await page.locator('.swal2-confirm:has-text("Sí, enviar")').click();

    // Swal éxito
    await expect(page.locator(".swal2-title")).toHaveText(
      "Notificación enviada",
      { timeout: 20000 },
    );
    await page.locator(".swal2-confirm").click().catch(() => {});
  });

  test("guarda la configuración de puntos", async ({ page }) => {
    await page.goto("/admin/puntos");

    await page.locator("#puntosSpot").fill("15");
    await page.locator("#puntosResena").fill("10");
    await page.locator("#puntosGuardado").fill("5");
    await page.locator("#puntosBase").fill("0");
    await page.locator("#limiteDiario").fill("200");

    await page
      .locator('button:has-text("Guardar configuración")')
      .click();

    await expect(
      page.locator("[role='status']"),
    ).toBeVisible({ timeout: 20000 });
  });
});
