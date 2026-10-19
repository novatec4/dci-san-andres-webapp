// =============================================================================
// V3_MODERN_ENGINE.TEST.JS - Pruebas del Motor Moderno v3.0.0 (WHOAnthro & RBAC)
// =============================================================================

const test = require('node:test');
const assert = require('node:assert/strict');

test('v3.0.0 Modern WHOAnthro ES Module: Calibración y Algoritmo LMS', async () => {
  const whoModule = await import('../../src/services/whoanthro.js');
  const WHO = whoModule.WHOAnthro;

  assert.match(WHO.version, /LMS whoanthro/i);
  
  // Cálculo de Z-score HAZ y WAZ para niño varón de 24 meses
  const haz = WHO.calculateHAZ(24, 87.82, 'M', 'standard');
  const waz = WHO.calculateWAZ(24, 12.15, 'M', false);
  assert.equal(typeof haz, 'number');
  assert.equal(typeof waz, 'number');
  assert.ok(Math.abs(haz) < 0.1, 'Mediana exacta de talla debe dar z ≈ 0');
  assert.ok(Math.abs(waz) < 0.1, 'Mediana exacta de peso debe dar z ≈ 0');

  // Ajuste por posición supino/de pie (±0.7 cm)
  // Niño >= 24 meses medido recostado (recumbent) se le resta 0.7 cm
  const adjRecumbent = WHO.adjustHeightForPosition(90.0, 30, 'recumbent');
  assert.equal(adjRecumbent, 89.3);

  // Niño < 24 meses medido parado (standing) se le suma 0.7 cm
  const adjStanding = WHO.adjustHeightForPosition(80.0, 18, 'standing');
  assert.equal(adjStanding, 80.7);

  // Edema nutricional bilateral
  const diagEdema = WHO.getNutritionalDiagnosis(-1.0, null, -3.5, true);
  assert.equal(diagEdema.severity, 'SAM');
  assert.equal(diagEdema.referralRequired, true);
  assert.match(diagEdema.label, /Kwashiorkor/i);

  // Banderas biológicas OMS
  const flags = WHO.checkBiologicalFlags(-6.5, 1.2, 0.5, 0.2);
  assert.equal(flags.flagHaz, true);
  assert.equal(flags.flagWaz, false);
});

test('v3.0.0 RBAC Nutricionista: Desacoplamiento y Permisos Clínicos', async () => {
  const authModule = await import('../../src/services/authStore.js');
  const AuthStore = authModule.AuthStore;

  // Permisos de nutricionista
  assert.equal(AuthStore.canAccess('nutricionista', 'nutritionist'), true, 'Nutricionista debe acceder a su portal clínico');
  assert.equal(AuthStore.canAccess('nutricionista', 'population'), true, 'Nutricionista debe acceder a población infantil');
  assert.equal(AuthStore.canAccess('nutricionista', 'reports'), true, 'Nutricionista debe acceder a reportes');
  assert.equal(AuthStore.canAccess('nutricionista', 'gis'), true, 'Nutricionista debe acceder a mapa GIS');
  assert.equal(AuthStore.canAccess('nutricionista', 'users'), false, 'Nutricionista no accede a users');

  // Permisos de encuestador
  assert.equal(AuthStore.canAccess('encuestador', 'student'), true, 'Encuestador accede a panel estudiante');
  assert.equal(AuthStore.canAccess('encuestador', 'population'), false, 'Encuestador no accede a padrón infantil');

  // Usuario nutricionista Carmen Elena Paredes
  const users = AuthStore.getUsers();
  const nutri = users.find(u => u.role === 'nutricionista');
  assert.ok(nutri, 'Usuario nutricionista debe existir');
  assert.equal(nutri.email, 'nutricionista@dci.ec');
  assert.equal(nutri.role, 'nutricionista');
  assert.equal(nutri.dupla, undefined, 'Nutricionista no debe pertenecer a Dupla D01');
  assert.equal(nutri.defaultRoute, 'nutritionist', 'Debe aterrizar en su portal clínico');
});
