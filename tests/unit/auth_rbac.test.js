// =============================================================================
// AUTH_RBAC.TEST.JS - Suite de Pruebas Unitarias de Autenticación y RBAC 2.0
// Valida matriz de permisos por roles, rutas por defecto y protección de sesiones
// =============================================================================

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const Auth = require(path.join(__dirname, '../../app/js/auth.js'));

test('RBAC 2.0: Matriz de Permisos por Rol', () => {
  const permissions = Auth.ROLE_PERMISSIONS;
  assert.ok(permissions, 'Debe existir la matriz ROLE_PERMISSIONS');

  // Rol Admin: Acceso irrestricto (10 módulos con Portal)
  assert.equal(permissions.admin.length, 10);
  assert.ok(permissions.admin.includes('portal'), 'Admin debe tener acceso a portal');
  assert.ok(permissions.admin.includes('users'), 'Admin debe tener acceso a users');
  assert.ok(permissions.admin.includes('credentials'), 'Admin debe tener acceso a credentials');
  assert.ok(permissions.admin.includes('reports'), 'Admin debe tener acceso a reports');

  // Rol Supervisor: Acceso a 9 módulos (incluye portal, no users)
  assert.equal(permissions.supervisor.includes('users'), false, 'Supervisor no debe acceder a users');
  assert.ok(permissions.supervisor.includes('portal'), 'Supervisor debe acceder a portal');
  assert.ok(permissions.supervisor.includes('kobo'), 'Supervisor debe acceder a kobo');

  // Rol Encuestador: Acceso operativo con Portal del Encuestador
  assert.deepEqual(permissions.encuestador.sort(), ['credentials', 'gis', 'portal', 'protocols', 'surveyors'].sort());
  assert.equal(permissions.encuestador.includes('users'), false);
  assert.equal(permissions.encuestador.includes('reports'), false);

  // Rol Nutricionista: Acceso clínico a población y portal
  assert.ok(permissions.nutricionista.includes('population'));
  assert.ok(permissions.nutricionista.includes('portal'));
  assert.equal(permissions.nutricionista.includes('users'), false);
});

test('RBAC 2.0: Rutas por Defecto tras Login (v2.4.0 Portal Encuestador)', () => {
  const routes = Auth.DEFAULT_ROUTE_BY_ROLE;
  assert.equal(routes.admin, 'dashboard');
  assert.equal(routes.supervisor, 'dashboard');
  assert.equal(routes.encuestador, 'portal');
  assert.equal(routes.nutricionista, 'portal');
});

test('RBAC 2.0: Algoritmo Módulo 10 de Cédula Ecuatoriana y Formato con Guión', () => {
  assert.equal(typeof Auth.validarCedulaEcuador, 'function');
  assert.equal(typeof Auth.formatearCedulaConGuion, 'function');

  // Formato con guión
  assert.equal(Auth.formatearCedulaConGuion('1710034065'), '171003406-5');
  assert.equal(Auth.formatearCedulaConGuion('171003406-5'), '171003406-5');

  // Validación de cédula válida ecuatoriana (Módulo 10 exacto)
  assert.equal(Auth.validarCedulaEcuador('171003406-5'), true);
  // Inválida (provincia incorrecta 35)
  assert.equal(Auth.validarCedulaEcuador('350123456-7'), false);
  // Inválida (longitud incorrecta)
  assert.equal(Auth.validarCedulaEcuador('12345'), false);
});

test('RBAC 2.0: Directorio de Usuarios Oficiales del Sistema', () => {
  assert.ok(Array.isArray(Auth.defaultUsers), 'defaultUsers debe ser un array');
  assert.ok(Auth.defaultUsers.length >= 3, 'Debe haber al menos 3 usuarios preconfigurados');

  const admin = Auth.defaultUsers.find(u => u.role === 'admin');
  assert.ok(admin, 'Debe existir el usuario admin');
  assert.equal(admin.email, 'admin@dci.ec');

  const sup = Auth.defaultUsers.find(u => u.role === 'supervisor');
  assert.ok(sup, 'Debe existir el usuario supervisor');
  assert.equal(sup.email, 'supervisor@dci.ec');
});

test('RBAC 2.0: Mapeo de Colores por Rol Institucional', () => {
  const adminColor = Auth._getRoleColor('admin');
  assert.match(adminColor, /#E8734A/, 'Admin debe usar naranja institucional');

  const encColor = Auth._getRoleColor('encuestador');
  assert.match(encColor, /#10b981/, 'Encuestador debe usar verde');
});
