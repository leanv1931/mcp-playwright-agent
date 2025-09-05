// tests/coverage.spec.ts
import { test, expect } from '@playwright/test';

const URL = 'https://mi-app-delfina.vercel.app/';

// Este test obtiene la cobertura de JS usando el API de Chrome DevTools Protocol

test('Cobertura de JS en la página', async ({ page, context, browser }) => {
  // Conectamos al DevTools Protocol
  const session = await context.newCDPSession(page);
  await session.send('Profiler.enable');
  await session.send('Profiler.startPreciseCoverage', { callCount: true, detailed: true });

  await page.goto(URL);

  // Interacción: clic en el botón 'Ver Notas'
  const botonNotas = await page.locator('a.button', { hasText: 'Ver Notas' });
  if (await botonNotas.isVisible()) {
    await botonNotas.click();
    // Espera a que la navegación ocurra o el contenido cambie
    await page.waitForLoadState('networkidle');
  }

  // Detenemos la cobertura y obtenemos los datos
  const coverage = await session.send('Profiler.takePreciseCoverage');
  await session.send('Profiler.stopPreciseCoverage');
  await session.send('Profiler.disable');

  // Procesamos los datos
  let total = 0;
  let used = 0;
  for (const entry of coverage.result) {
    for (const func of entry.functions) {
      for (const range of func.ranges) {
        total += range.endOffset - range.startOffset;
        if (range.count > 0) {
          used += range.endOffset - range.startOffset;
        }
      }
    }
  }
  const percent = total > 0 ? ((used / total) * 100).toFixed(2) : '0';
  console.log(`Cobertura JS: ${percent}%`);
  expect(Number(percent)).toBeGreaterThanOrEqual(0);
});
