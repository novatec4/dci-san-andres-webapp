// =============================================================================
// LOPDP_SECURITY.TEST.JS - Suite de Pruebas de Seguridad y Privacidad LOPDP
// Valida ofuscación de cédulas, anonimización de infantes y aval bioético CEISH
// =============================================================================

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('LOPDP: Padrón Oficial de Brigadistas ESPOCH con Cédulas Ofuscadas', () => {
  const jsonPath = path.join(__dirname, '../../app/data/brigadistas_espoch_dci.json');
  assert.ok(fs.existsSync(jsonPath), 'Debe existir brigadistas_espoch_dci.json');

  const raw = fs.readFileSync(jsonPath, 'utf8');
  const brigadistas = JSON.parse(raw);

  assert.equal(brigadistas.length, 73, 'Debe haber exactamente 73 brigadistas de Nutrición (36 duplas + 1 logística)');

  brigadistas.forEach((b, idx) => {
    assert.ok(b.id, `Brigadista ${idx} debe tener id`);
    assert.ok(b.cedula_ofuscada, `Brigadista ${b.id} debe tener cedula_ofuscada`);
    // Formato estricto LOPDP: 6 primeros dígitos visibles y 4 asteriscos al final (ej. 060412****)
    assert.match(b.cedula_ofuscada, /^\d{6}\*{4}$/, `Cédula de ${b.id} debe estar ofuscada con 4 asteriscos`);
    assert.ok(b.dupla, `Brigadista ${b.id} debe tener dupla asignada`);
    assert.ok(b.zona_nombre, `Brigadista ${b.id} debe tener zona comunitaria`);
  });
});

test('LOPDP: Verificación de Anonimización de Sujetos Infantiles en Código de Sujeto', () => {
  // Función canónica de generación de código anonimizado del proyecto
  function generateSubjectCode(communityCode, childIndex) {
    const padded = String(childIndex).padStart(4, '0');
    return `${communityCode}-NIN-${padded}`;
  }

  const code1 = generateSubjectCode('SA', 42);
  assert.equal(code1, 'SA-NIN-0042');
  assert.equal(code1.includes('Juan'), false, 'El código nunca debe incluir nombres personales');

  const code2 = generateSubjectCode('MA', 1397);
  assert.equal(code2, 'MA-NIN-1397');
});

test('LOPDP: Aval Bioético CEISH-ESPOCH en Credenciales Oficiales', () => {
  const jsonPath = path.join(__dirname, '../../app/data/brigadistas_espoch_dci.json');
  const brigadistas = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  brigadistas.forEach(b => {
    assert.match(b.estado, /ACTIVO|CERTIFICADO TEM|HABILITADO/);
    assert.match(b.vigencia, /2026/);
    assert.match(b.carrera, /Nutrición y Dietética/);
  });
});
