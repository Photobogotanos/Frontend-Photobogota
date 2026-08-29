/**
 * Utilidades de localización de campos de formulario.
 * Los labels de Bootstrap NO están asociados con htmlFor/id (getByLabel no los
 * encuentra), así que localizamos por la posición del input respecto al label.
 */

/**
 * Input que es hermano inmediato del label cuyo texto contiene `texto`
 * (caso: Email, Nombres, Apellidos, Nombre de usuario en el registro).
 * @param {import('@playwright/test').Page} page
 * @param {string} texto
 */
export const inputJuntoAlabel = (page, texto) =>
  page
    .locator("label")
    .filter({ hasText: texto })
    .locator("xpath=following-sibling::input")
    .first();

/**
 * Contraseña: el input de password está dentro de un contenedor hermano del
 * label (`.input-icon-container`), no como hermano directo.
 * @param {import('@playwright/test').Page} page
 * @param {string} texto
 */
export const passwordJuntoAlabel = (page, texto) =>
  page
    .locator("label")
    .filter({ hasText: texto })
    .locator("xpath=following-sibling::div//input")
    .first();
