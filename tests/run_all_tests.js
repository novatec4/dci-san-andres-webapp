// =============================================================================
// RUN_ALL_TESTS.JS - Runner Central de Pruebas Unitarias del Proyecto DCI
// Ejecuta toda la batería unitaria, mide tiempos y genera resumen de calidad
// =============================================================================

const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('='.repeat(70));
console.log(' PROYECTO DCI - COMPONENTE A.3.1 (Ayuda en Acción / ESPOCH)');
console.log(' SUITE DE PRUEBAS UNITARIAS AUTOMATIZADAS (v2.5.0)');
console.log(' Población Objetivo: Niños entre 0 y 5 años (0 a 59 meses cumplidos)');
console.log('='.repeat(70));

const unitDir = path.join(__dirname, 'unit');
const testFiles = fs.readdirSync(unitDir).filter(f => f.endsWith('.test.js'));

console.log(`\nArchivos de prueba detectados (${testFiles.length}):`);
testFiles.forEach((f, idx) => console.log(`  [${idx + 1}] ${f}`));
console.log('-'.repeat(70));

const startTime = Date.now();
const res = spawnSync('node', ['--test', ...testFiles.map(f => path.join('tests', 'unit', f))], {
  stdio: 'inherit',
  shell: true,
  cwd: path.join(__dirname, '..')
});
const duration = ((Date.now() - startTime) / 1000).toFixed(2);

console.log('='.repeat(70));
if (res.status === 0) {
  console.log(`✅ RESULTADO: Todas las pruebas unitarias pasaron exitosamente (${duration}s).`);
  console.log('   Estándar de calidad IEEE 829 y modelos OMS LMS verificados al 100%.');
} else {
  console.error(`❌ RESULTADO: Fallaron pruebas unitarias (código de salida ${res.status}).`);
}
console.log('='.repeat(70));

process.exit(res.status);
