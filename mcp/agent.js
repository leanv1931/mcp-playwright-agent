// mcp/agent.js
const readline = require('readline');
const { exec } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


function runPlaywrightTest(url) {
  console.log(`Ejecutando pruebas Playwright en: ${url}`);
  exec('npx playwright test tests/basic.spec.ts', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error al ejecutar pruebas: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
    console.log(stdout);
    nextAction();
  });
}

function runCoverageTest(url) {
  console.log(`Analizando cobertura JS en: ${url}`);
  exec('npx playwright test tests/coverage.spec.ts', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error al analizar cobertura: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
    console.log(stdout);
    nextAction();
  });
}

function nextAction() {
  rl.question('¿Quieres ejecutar otra acción? (si/no): ', (answer) => {
    if (answer.toLowerCase() === 'si' || answer.toLowerCase() === 'yes') {
      promptUser();
    } else {
      rl.close();
    }
  });
}


function promptUser() {
  rl.question('Escribe el comando (ej: Ejecuta pruebas en https://mi-app-delfina.vercel.app/ o Analiza cobertura en https://mi-app-delfina.vercel.app/): ', (input) => {
    const urlMatch = input.match(/https?:\/\/[^\s]+/);
    if (!urlMatch) {
      console.log('No se detectó una URL válida. Intenta de nuevo.');
      promptUser();
      return;
    }
    const url = urlMatch[0];
    const testCmds = [
      'ejecuta pruebas', 'run tests', 'test', 'prueba', 'tests'
    ];
    const coverageCmds = [
      'analiza cobertura', 'coverage', 'cobertura', 'analyze coverage', 'coverage analysis'
    ];
    const inputLower = input.toLowerCase();
    if (testCmds.some(cmd => inputLower.includes(cmd))) {
      runPlaywrightTest(url);
    } else if (coverageCmds.some(cmd => inputLower.includes(cmd))) {
      runCoverageTest(url);
    } else {
      console.log('Comando no reconocido. Usa "Ejecuta pruebas" o "Analiza cobertura".');
      promptUser();
    }
  });
}

console.log('Agente MCP listo para recibir comandos.');
promptUser();
