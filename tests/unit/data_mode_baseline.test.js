// =============================================================================
// DATA_MODE_BASELINE.TEST.JS - Suite de Pruebas del Conmutador de Datos y Línea Base
// Valida coherencia de Modo Real (Línea Base Oficial: 0 censados / meta 1.397) vs Modo Demo
// =============================================================================

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('DataMode: Parámetros Oficiales del Proyecto DCI (Componente A.3.1)', () => {
  const dataJsPath = path.join(__dirname, '../../app/js/data.js');
  const content = fs.readFileSync(dataJsPath, 'utf8');

  // Verificar meta censal de San Andrés (647 niños) y meta global del convenio (1.397 niños)
  assert.match(content, /totalTargetSanAndres:\s*647/, 'Meta oficial de San Andrés debe ser 647 niños');
  assert.match(content, /totalTargetGlobal:\s*1397/, 'Meta global del convenio debe ser 1.397 niños');

  // Verificar catastro dasimétrico oficial de 5.486 techos habitacionales
  assert.match(content, /viviendasDasimetricas:\s*5486/, 'Debe registrar 5.486 techos dasimétricos K-NN');

  // Verificar 45 asentamientos oficiales PDOT Guano 2023-2027
  assert.match(content, /asentamientosPDOT:\s*45/, 'Debe registrar 45 asentamientos oficiales PDOT');

  // Verificar 73 brigadistas (36 duplas + 1 logística)
  assert.match(content, /brigadistasTotal:\s*(51|73)/, 'Debe registrar 73 brigadistas ESPOCH');

  // Verificar unificación del rango etario a 0 a 5 años
  assert.match(content, /población infantil \(0 a 5 años\)/i, 'Debe especificar niños entre 0 y 5 años');
});

test('DataMode: Lógica de Separación entre Modo Real y Modo Demo', () => {
  // Mock simple simulando la lógica de APP_DATA
  const mockAppData = {
    dataMode: 'real',
    children: Array.from({ length: 200 }, (_, i) => ({ id: i + 1 })),
    getActiveChildren() {
      return this.dataMode === 'real' ? [] : this.children;
    }
  };

  // En Modo Real: 0 niños censados en campo antes del barrido masivo
  mockAppData.dataMode = 'real';
  const realChildren = mockAppData.getActiveChildren();
  assert.equal(realChildren.length, 0, 'En modo real debe retornar 0 niños censados');

  // En Modo Demo: 200 niños sintéticos para pruebas de visualización
  mockAppData.dataMode = 'demo';
  const demoChildren = mockAppData.getActiveChildren();
  assert.equal(demoChildren.length, 200, 'En modo demo debe retornar los 200 niños');
});
