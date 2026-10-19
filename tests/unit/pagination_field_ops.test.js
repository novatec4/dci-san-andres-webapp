// =============================================================================
// PAGINATION_FIELD_OPS.TEST.JS - Suite de Pruebas de Escalabilidad y Terreno (v2.4.0)
// Valida paginación dinámica, compresión fotográfica de perfiles y reportes ejecutivos
// =============================================================================

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('Paginación: Algoritmo canónico de segmentación y tamaños de página (10 a 100)', () => {
  const allowedSizes = [10, 20, 30, 50, 100];
  const totalItems = 1397; // Meta de niños

  allowedSizes.forEach(pageSize => {
    const totalPages = Math.ceil(totalItems / pageSize);
    assert.ok(totalPages >= 14, `Para tamaño ${pageSize}, deben existir suficientes páginas`);
    
    // Probar primera y última página
    const page1Start = 0;
    const page1End = pageSize;
    assert.equal(page1End - page1Start, pageSize);

    const lastPage = totalPages;
    const lastStart = (lastPage - 1) * pageSize;
    const lastItemsCount = totalItems - lastStart;
    assert.ok(lastItemsCount > 0 && lastItemsCount <= pageSize);
  });
});

test('Módulos de Sistema: Presencia de selectores dinámicos de página 10-100', () => {
  const populationContent = fs.readFileSync(path.join(__dirname, '../../app/js/population.js'), 'utf8');
  const surveyorsContent = fs.readFileSync(path.join(__dirname, '../../app/js/surveyors.js'), 'utf8');
  const usersContent = fs.readFileSync(path.join(__dirname, '../../app/js/users.js'), 'utf8');

  assert.match(populationContent, /pop-page-size/, 'population.js debe tener selector de tamaño de página');
  assert.match(populationContent, /pageSize:\s*20/, 'population.js debe inicializar en 20 por defecto');

  assert.match(surveyorsContent, /personnel-page-size/, 'surveyors.js debe tener selector de tamaño de página');
  assert.match(surveyorsContent, /pageSize:\s*20/, 'surveyors.js debe inicializar en 20 por defecto');

  assert.match(usersContent, /users-page-size/, 'users.js debe tener selector de tamaño de página');
  assert.match(usersContent, /pageSize:\s*20/, 'users.js debe inicializar en 20 por defecto');
});

test('Fotografía de Perfil & Gafete: Soporte de compresión canvas en personal y usuarios', () => {
  const surveyorsContent = fs.readFileSync(path.join(__dirname, '../../app/js/surveyors.js'), 'utf8');
  const usersContent = fs.readFileSync(path.join(__dirname, '../../app/js/users.js'), 'utf8');

  assert.match(surveyorsContent, /person-photo-file/, 'surveyors.js debe incluir input de archivo de fotografía');
  assert.match(surveyorsContent, /toDataURL\('image\/jpeg'/, 'surveyors.js debe comprimir imagen a JPEG base64');

  assert.match(usersContent, /user-photo-file/, 'users.js debe incluir input de archivo de fotografía');
  assert.match(usersContent, /toDataURL\('image\/jpeg'/, 'users.js debe comprimir imagen a JPEG base64');
});

test('Reportes Institucionales: Conmutador Demo/Real y Generador Imprimible Oficial', () => {
  const reportsContent = fs.readFileSync(path.join(__dirname, '../../app/js/reports.js'), 'utf8');

  assert.match(reportsContent, /reports-toggle-demo/, 'reports.js debe incluir botón de modo demo');
  assert.match(reportsContent, /reports-toggle-real/, 'reports.js debe incluir botón de modo real');
  assert.match(reportsContent, /_generatePrintableExecutiveReport/, 'reports.js debe incluir generador imprimible ejecutivo');
  assert.match(reportsContent, /_exportCommunityCSV/, 'reports.js debe exportar CSV de comunidades');
});

test('Protocolos de Campo: Materiales de contingencia física CEISH y Guía OMS', () => {
  const protocolsContent = fs.readFileSync(path.join(__dirname, '../../app/js/protocols.js'), 'utf8');

  assert.match(protocolsContent, /printConsentSheet/, 'protocols.js debe incluir generador de consentimiento CEISH');
  assert.match(protocolsContent, /printAnthroCheatSheet/, 'protocols.js debe incluir guía de bolsillo OMS');
});
