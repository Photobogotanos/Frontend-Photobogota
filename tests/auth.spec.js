import { test, expect } from '@playwright/test';

const USUARIO_EXISTENTE = {
    usuarioOCorreo: 'sotomayo250525@gmail.com',
    contrasena: 'Segura123.',
};

test.describe('Login', () => {
    test('un usuario con credenciales válidas llega al mapa', async ({ page }) => {
        await page.goto('/login'); 

        await page
            .getByPlaceholder('Ingresa tu usuario o correo electrónico')
            .fill(USUARIO_EXISTENTE.usuarioOCorreo);

        await page
            .getByPlaceholder('Ingresa tu contraseña')
            .fill(USUARIO_EXISTENTE.contrasena);

        await page.getByRole('button', { name: /Ingresar/ }).click();

        await expect(page).toHaveURL(/\/mapa/);
    });

    test('credenciales inválidas muestran un error y no navega', async ({ page }) => {
        await page.goto('/login');

        await page
            .getByPlaceholder('Ingresa tu usuario o correo electrónico')
            .fill('usuario-que-no-existe@test.com');

        await page
            .getByPlaceholder('Ingresa tu contraseña')
            .fill('ClaveIncorrecta123.');

        await page.getByRole('button', { name: /Ingresar/ }).click();

        await expect(
            page.locator('text=/El usuario o contraseña no son correctos.*Intento 1\\/5/i')
        ).toBeVisible();
        await expect(page).not.toHaveURL(/\/mapa/);
    });
});