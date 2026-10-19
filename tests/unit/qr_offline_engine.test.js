// =============================================================================
// QR_OFFLINE_ENGINE.TEST.JS - Suite de Pruebas del Módulo de Credenciales QR
// Valida construcción de URIs públicas de verificación sin llamadas a APIs externas
// =============================================================================

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('QR Offline: Validación de la URL Canónica Pública', () => {
  function buildVerificationUrl(origin, brigadistaId) {
    const base = origin.replace(/\/$/, '');
    return `${base}/verificar.html?id=${encodeURIComponent(brigadistaId)}`;
  }

  const url = buildVerificationUrl('http://localhost:8086', 'ESPOCH-BRIG-09');
  assert.equal(url, 'http://localhost:8086/verificar.html?id=ESPOCH-BRIG-09');

  const prodUrl = buildVerificationUrl('https://dci.ayudaenaccion.ec', 'ESPOCH-BRIG-25');
  assert.equal(prodUrl, 'https://dci.ayudaenaccion.ec/verificar.html?id=ESPOCH-BRIG-25');
});

test('QR Offline: Comprobar que no existen llamadas a api.qrserver.com en código cliente', () => {
  const credPath = path.join(__dirname, '../../app/js/credentials.js');
  const code = fs.readFileSync(credPath, 'utf8');

  // No debe existir api.qrserver.com
  assert.equal(code.includes('api.qrserver.com'), false, 'No debe haber llamadas externas a api.qrserver.com');
  // Debe existir QRCode en canvas local
  assert.ok(code.includes('new QRCode') || code.includes('QRCode.toCanvas') || code.includes('qrcode'), 'Debe usar motor QR local');
});

test('QR Offline: Existencia del Archivo de Biblioteca Local qrcode.min.js', () => {
  const libPath = path.join(__dirname, '../../app/js/vendor/qrcode.min.js');
  assert.ok(fs.existsSync(libPath), 'Debe existir app/js/vendor/qrcode.min.js en el repositorio');
  const stat = fs.statSync(libPath);
  assert.ok(stat.size > 10000, 'qrcode.min.js debe tener tamaño válido (>10KB)');
});
