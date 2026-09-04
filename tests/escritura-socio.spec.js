import { test, expect } from "@playwright/test";

// Tests de ESCRITURA del rol SOCIO: acciones que CREAN/ENVÍAN contra el backend
// real. Por decisión del usuario: solo crear/enviar (sin destructivas) y sin
// restricciones de escritura en la BD compartida.
//
// NOTA: No se incluyen tests de "crear local" (flujo que pasa por /crear-spot
// con rol SOCIO) porque la app crashea al renderizar SpotDatosLocal: React
// lanza "Element type is invalid ... got: object" por cómo Vite interpola el
// plugin CJS time_picker de react-multi-date-picker usado en los DatePicker de
// horario (src/components/spots/CreacionSpotForm/SpotDatosLocal.jsx). La página
// queda en blanco y no se pueden crear locals ni (por dependencia) promociones
// que requieran un local previo. El flujo MIEMBRO (crear spot) sí funciona.

// La solicitud de membresía es un formulario PÚBLICO (sin login) y no pasa por
// SpotDatosLocal, así que se puede probar.
test.describe("Solicitud de membresía (pública)", () => {
  test("envía una solicitud de socio desde el CTA del navbar con datos random", async ({
    page,
  }) => {
    // Datos random (aleatorios por ejecución) para evitar colisiones en la BD.
    const sufijo = Date.now();
    const aleatorio = () => Math.random().toString(36).slice(2, 8);

    const datos = {
      nombres: `Sol${aleatorio()}`,
      apellidos: `E2E ${aleatorio()}`,
      email: `solicitud_${sufijo}@test.com`,
      telefono: `3${String(Math.floor(Math.random() * 1_000_000_000)).slice(0, 9)}`,
      fechaNacimiento: `19${Math.floor(Math.random() * 20 + 70)}-0${Math.floor(
        Math.random() * 8 + 1,
      )}-1${Math.floor(Math.random() * 8)}`,
      razonSocial: `Negocio ${aleatorio()} ${sufijo}`,
      nit: `900${sufijo.toString().slice(-6)}${Math.floor(Math.random() * 90 + 10)}`,
      propietario: `Juan ${aleatorio()}`,
    };

    // Acceso desde el CTA del navbar (visible solo sin sesión iniciada).
    await page.goto("/");
    await page
      .getByRole("link", { name: "¿Quieres ser socio?" })
      .click();
    await expect(
      page.getByRole("heading", { name: "Solicitud de socio" }),
    ).toBeVisible();

    await page.locator("#nombres").fill(datos.nombres);
    await page.locator("#apellidos").fill(datos.apellidos);
    await page.locator("#email").fill(datos.email);
    await page.locator("#telefono").fill(datos.telefono);
    // fechaNacimiento es un Flatpickr (allowInput): el input visible tiene clase
    // flatpickr-input + input-solicitud-socio, no id fechaNacimiento.
    await page
      .locator("input.flatpickr-input.input-solicitud-socio")
      .fill(datos.fechaNacimiento);
    await page.locator("#razonSocial").fill(datos.razonSocial);

    await page.locator(".spot-select__control").first().click();
    await page.locator(".spot-select__option").first().click();

    await page.locator("#direccion").fill("Calle 10 # 20-30, Bogotá");
    await page.locator("#nit").fill(datos.nit);
    await page.locator("#propietario").fill(datos.propietario);

    await page.locator(".spot-select__control").nth(1).click();
    await page.locator(".spot-select__option").first().click();

    await page
      .locator("#rutDocumento")
      .setInputFiles("tests/assets/foto-test.png");

    // Los checkboxes usan Form.Check de react-bootstrap; los localizamos por su
    // atributo name para evitar problemas de asociación label/htmlFor.
    await page.locator('input[name="autorizoUsoDatos"]').check();
    await page.locator('input[name="aceptaTerminos"]').check();

    await page.getByRole("button", { name: "Enviar solicitud" }).click();

    await expect(page.locator(".swal2-title")).toHaveText(
      "Solicitud enviada",
      { timeout: 30000 },
    );
    await page.locator(".swal2-confirm").click().catch(() => {});
  });
});
