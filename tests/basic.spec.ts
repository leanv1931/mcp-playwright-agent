import { test, expect } from '@playwright/test';

// Test básico para verificar que la página carga correctamente
const URL = 'https://mi-app-delfina.vercel.app/';

test('La página principal carga correctamente y elementos clave están presentes', async ({ page }) => {
  await page.goto(URL);
  await expect(page).toHaveTitle(/Delfina|mi-app/i);

  // Verifica que haya al menos un botón relevante (button o <a class="button">)
  const boton = await page.locator('button, a.button');
  await expect(boton).toBeVisible();
  const botonTexto = await boton.textContent();
  expect(botonTexto).toMatch(/Ver Notas|Notas|button/i);

  // Verifica que una imagen se haya cargado correctamente
  const imagen = await page.locator('img').first();
  await expect(imagen).toBeVisible();

  // Verifica que un título visible esté en la página
  const titulo = await page.locator('h1, h2, h3').first();
  await expect(titulo).toBeVisible();
  const tituloTexto = await titulo.textContent();
  expect(tituloTexto).toMatch(/Delfina|mi-app/i);
});
