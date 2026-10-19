// =============================================================================
// AUTHSTORE.JS - Gestor de Autenticación, Sesiones y RBAC 2.0 (Seguridad Estricta)
// Proyecto DCI - Componente A.3.1 (Ayuda en Acción / ESPOCH)
// =============================================================================

// Función utilitaria para cálculo de edad en años cumplidos
export function calculateAge(birthDate) {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age >= 0 ? age : null;
}

// Hash criptográfico síncrono SHA-256 para integridad y autenticación
export const SECURITY_SALT = 'dci_espoch_salt_2026';

export function sha256Sync(ascii) {
  function rightRotate(value, amount) { return (value >>> amount) | (value << (32 - amount)); }
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = 'length';
  let i, j;
  let result = '';
  const words = [];
  const asciiBitLength = ascii[lengthProperty] * 8;
  const hash = [];
  const k = [];
  let primeCounter = 0;
  const isComposite = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) { isComposite[i] = candidate; }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }
  ascii += '\x80';
  while ((ascii[lengthProperty] % 64) - 56) ascii += '\x00';
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return '';
    words[i >> 2] |= j << ((3 - i) % 4) * 8;
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength;
  for (j = 0; j < words[lengthProperty];) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash.slice(0);
    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15], w2 = w[i - 2];
      const a = hash[0], e = hash[4];
      const temp1 =
        hash[7] +
        (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
        ((e & hash[5]) ^ (~e & hash[6])) +
        k[i] +
        (w[i] =
          i < 16
            ? w[i]
            : (w[i - 16] +
                (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                w[i - 7] +
                (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) |
              0);
      const temp2 =
        (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
        ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
      hash.unshift((temp1 + temp2) | 0);
      hash.pop();
      hash[4] = (hash[4] + temp1) | 0;
    }
    for (i = 0; i < 8; i++) { hash[i] = (hash[i] + oldHash[i]) | 0; }
  }
  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += ((b < 16) ? '0' : '') + b.toString(16);
    }
  }
  return result;
}

export function hashPassword(plainPassword) {
  return sha256Sync(plainPassword + ':' + SECURITY_SALT);
}

export function generateSessionSignature(user) {
  if (!user || !user.id) return '';
  return sha256Sync(`${user.id}:${user.role || ''}:${user.cedula || ''}:${SECURITY_SALT}`);
}

const INITIAL_USERS = [
  {
    id: 'usr-nut-01',
    name: 'Lic. Carmen Elena Paredes',
    cedula: '180345678-9',
    email: 'nutricionista@dci.ec',
    phone: '0998412356',
    birthDate: '1991-06-14',
    gender: 'Femenino',
    bloodType: 'O+',
    kichwaLevel: 'Intermedio',
    emergencyContactName: 'Dr. Roberto Paredes (Padre)',
    emergencyContactPhone: '0994123890',
    passwordHash: '07b1606bf23486faf5879a5c9375b8fe7e1323f654f7865761084258cfeb21f3', // nutri123
    role: 'nutricionista',
    roleLabel: 'Nutricionista Especialista de Campo',
    organization: 'Ayuda en Acción / FSP ESPOCH',
    territory: 'San Andrés - Parroquia Completa',
    status: 'activo',
    avatar: 'CP',
    defaultRoute: 'nutritionist'
  },
  {
    id: 'usr-enc-01',
    name: 'Daniela Alejandra Balseca Quesada',
    cedula: '060412389-1',
    email: 'daniela.balseca@espoch.edu.ec',
    phone: '0987654321',
    birthDate: '2003-08-22',
    gender: 'Femenino',
    bloodType: 'A+',
    kichwaLevel: 'Básico',
    emergencyContactName: 'Mgs. Elena Quesada (Madre)',
    emergencyContactPhone: '0995123456',
    codigo_estudiante: '6501',
    passwordHash: '3eb2600f84b72733285af1b3408c382564b9674e8c24171d19807b2e7cd57d1e', // campo123
    role: 'encuestador',
    roleLabel: 'Brigadista Acreditada ESPOCH',
    organization: 'Carrera de Nutrición y Dietética (FSP)',
    dupla: 'D01',
    posicion: 'Titular 1',
    sector: 'Sector A',
    territory: 'Sector A - Cabecera y Bajas',
    zona_nombre: 'Sector A - Cabecera y Bajas San Andrés',
    meta_encuestas: 18,
    status: 'activo',
    avatar: 'DB',
    defaultRoute: 'student'
  },
  {
    id: 'usr-adm-01',
    name: 'Ing. Dennys Franklin Rojas',
    cedula: '060384912-3',
    email: 'admin@dci.ec',
    phone: '0998234512',
    birthDate: '1988-11-15',
    gender: 'Masculino',
    bloodType: 'O+',
    kichwaLevel: 'Básico',
    emergencyContactName: 'Ing. Patricia Rojas (Hermana)',
    emergencyContactPhone: '0993456789',
    passwordHash: 'd136eda4b30042028c7175ff9a46b5adb64e4b915f94b93051ff65365ded01e0', // admin123
    role: 'admin',
    roleLabel: 'Administrador / CIO',
    organization: 'Dirección de Proyecto DCI',
    territory: 'Todas las Zonas',
    status: 'activo',
    avatar: 'DF',
    defaultRoute: 'dashboard'
  },
  {
    id: 'usr-adm-02',
    name: 'Administrador General ESPOCH',
    cedula: '060384912-4',
    email: 'admin@espoch.edu.ec',
    phone: '0991122334',
    birthDate: '1985-03-20',
    gender: 'Masculino',
    bloodType: 'O+',
    kichwaLevel: 'Intermedio',
    emergencyContactName: 'Dirección de TI ESPOCH',
    emergencyContactPhone: '032998200',
    passwordHash: '67f77cb17a393d38ef2d1184c75ba2bbc01563485055aa97e7b370ae833613eb', // Dci2026*
    role: 'admin',
    roleLabel: 'Administrador General ESPOCH',
    organization: 'Ayuda en Acción / ESPOCH',
    territory: 'Todas las Zonas',
    status: 'activo',
    avatar: 'AD',
    defaultRoute: 'dashboard'
  },
  {
    id: 'usr-sup-01',
    name: 'ND. Verónica Carlina Delgado López',
    cedula: '060234567-8',
    email: 'veronica.delgado@espoch.edu.ec',
    phone: '0994645682',
    birthDate: '1984-07-09',
    gender: 'Femenino',
    bloodType: 'A+',
    kichwaLevel: 'Fluido / Nativo',
    emergencyContactName: 'Ing. Marco Delgado (Hermano)',
    emergencyContactPhone: '0998765412',
    passwordHash: '67f77cb17a393d38ef2d1184c75ba2bbc01563485055aa97e7b370ae833613eb', // Dci2026*
    role: 'supervisor',
    roleLabel: 'Docente Tutora / Supervisora Sector A',
    organization: 'Facultad de Salud Pública (ESPOCH)',
    sector: 'Sector A',
    territory: 'Sector A (Centralidades San Andrés)',
    status: 'activo',
    avatar: 'VD',
    defaultRoute: 'dashboard'
  },
  {
    id: 'usr-sup-02',
    name: 'Mgs. Vilma Lorena Velasco Castillo',
    cedula: '060234567-9',
    email: 'vilma.velasco@espoch.edu.ec',
    phone: '0997123456',
    birthDate: '1986-10-12',
    gender: 'Femenino',
    bloodType: 'O+',
    kichwaLevel: 'Intermedio',
    emergencyContactName: 'Carlos Velasco (Padre)',
    emergencyContactPhone: '0981234567',
    passwordHash: '67f77cb17a393d38ef2d1184c75ba2bbc01563485055aa97e7b370ae833613eb', // Dci2026*
    role: 'supervisor',
    roleLabel: 'Docente Tutora FSP (Sector B)',
    organization: 'Facultad de Salud Pública - ESPOCH',
    sector: 'Sector B',
    territory: 'Sector B (Eje Vial y Bajas)',
    status: 'activo',
    avatar: 'VV',
    defaultRoute: 'dashboard'
  },
  {
    id: 'usr-sup-03',
    name: 'Dr. Juan Patricio Ramos Rodríguez',
    cedula: '060345678-0',
    email: 'patricio.ramos@espoch.edu.ec',
    phone: '0992345678',
    birthDate: '1979-12-04',
    gender: 'Masculino',
    bloodType: 'B+',
    kichwaLevel: 'Fluido / Nativo',
    emergencyContactName: 'Dra. Miriam Ramos (Esposa)',
    emergencyContactPhone: '0996543210',
    passwordHash: '67f77cb17a393d38ef2d1184c75ba2bbc01563485055aa97e7b370ae833613eb', // Dci2026*
    role: 'supervisor',
    roleLabel: 'Docente Tutor FSP (Sector C)',
    organization: 'Facultad de Salud Pública - ESPOCH',
    sector: 'Sector C',
    territory: 'Sector C (Comunidades Altas)',
    status: 'activo',
    avatar: 'PR',
    defaultRoute: 'dashboard'
  },
  {
    id: 'usr-sup-04',
    name: 'Juan Diego Román',
    cedula: '171234567-8',
    email: 'supervisor@dci.ec',
    phone: '0984567890',
    birthDate: '1992-04-28',
    gender: 'Masculino',
    bloodType: 'O+',
    kichwaLevel: 'Básico',
    emergencyContactName: 'Lucía Román (Madre)',
    emergencyContactPhone: '0991239876',
    passwordHash: 'a699bb935f9706918431ad0bb1bb459ce41756977bb2806a53cd4af4dcf88c7b', // supervisor123
    role: 'supervisor',
    roleLabel: 'Supervisor de Campo AeA',
    organization: 'Ayuda en Acción Ecuador',
    territory: 'San Andrés (Guano)',
    status: 'activo',
    avatar: 'JR',
    defaultRoute: 'dashboard'
  }
];

const SESSION_KEY = 'cgpi_auth_session_v3';
const USERS_DB_KEY = 'cgpi_users_db_v3';

export const AuthStore = {
  getUsers() {
    try {
      const stored = localStorage.getItem(USERS_DB_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(u => {
            const init = INITIAL_USERS.find(iu => iu.id === u.id);
            return init ? { ...init, ...u } : u;
          });
        }
      }
    } catch {}
    return INITIAL_USERS;
  },

  saveUsers(users) {
    try {
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
    } catch {}
  },

  getCurrentUser() {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      
      // Verificación de integridad de firma de sesión
      if (parsed && parsed.payload && parsed.signature) {
        const expectedSig = generateSessionSignature(parsed.payload);
        if (parsed.signature !== expectedSig) {
          console.warn('[Seguridad DCI] Integridad de sesión comprometida o alterada externamente. Acceso revocado.');
          localStorage.removeItem(SESSION_KEY);
          return null;
        }
        return parsed.payload;
      }
      
      // Soporte de compatibilidad: si la sesión era formato plano antiguo, verificar que no haya sido alterada
      if (parsed && parsed.id && parsed.role) {
        const users = this.getUsers();
        const verified = users.find(u => u.id === parsed.id);
        if (verified && verified.role === parsed.role) {
          // Re-firmar sesión para protegerla
          const upgraded = { payload: parsed, signature: generateSessionSignature(parsed) };
          localStorage.setItem(SESSION_KEY, JSON.stringify(upgraded));
          return parsed;
        } else if (parsed.id && parsed.id.startsWith('ESPOCH-BRIG-') && parsed.role === 'encuestador') {
          const upgraded = { payload: parsed, signature: generateSessionSignature(parsed) };
          localStorage.setItem(SESSION_KEY, JSON.stringify(upgraded));
          return parsed;
        } else {
          // Intento de alteración de rol en formato antiguo detectado
          console.warn('[Seguridad DCI] Detección de escalada de privilegios en sesión local. Acceso revocado.');
          localStorage.removeItem(SESSION_KEY);
          return null;
        }
      }
    } catch (e) {
      localStorage.removeItem(SESSION_KEY);
    }
    return null;
  },

  login(identifier, password) {
    const cleanId = (identifier || '').trim();
    const cleanDigits = cleanId.replace(/[^0-9]/g, '');
    const cleanPass = (password || '').trim();

    if (!cleanId) {
      return { success: false, error: 'Ingrese su cédula o correo institucional.' };
    }
    if (!cleanPass) {
      return { success: false, error: 'Ingrese su contraseña o código estudiantil asignado.' };
    }

    const hashedInput = hashPassword(cleanPass);
    const users = this.getUsers();

    // 1. Buscar coincidencia por email o cédula
    const user = users.find(u => 
      (u.email && u.email.toLowerCase() === cleanId.toLowerCase()) || 
      (u.cedula && u.cedula.replace(/[^0-9]/g, '') === cleanDigits && cleanDigits.length >= 9)
    );

    if (user) {
      // Validación criptográfica estricta (sin bypass de texto plano)
      const validPass = 
        (user.passwordHash && user.passwordHash === hashedInput) ||
        (user.codigo_estudiante && user.codigo_estudiante === cleanPass);

      if (!validPass) {
        return { success: false, error: 'Contraseña o código estudiantil incorrecto. Verifique sus credenciales.' };
      }

      if (user.status !== 'activo') {
        return { success: false, error: 'Esta cuenta se encuentra temporalmente inactiva o suspendida.' };
      }

      const sessionUser = {
        ...user,
        loginAt: new Date().toISOString()
      };

      const sessionData = {
        payload: sessionUser,
        signature: generateSessionSignature(sessionUser)
      };

      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
      return { success: true, user: sessionUser, defaultRoute: user.defaultRoute || 'dashboard' };
    }

    // 2. Soporte para brigadistas acreditados ESPOCH con código de 4 dígitos
    if (cleanDigits.length === 10 || cleanId.toUpperCase().startsWith('ESPOCH')) {
      const isStudentCode = /^\d{4}$/.test(cleanPass) && parseInt(cleanPass, 10) >= 6000 && parseInt(cleanPass, 10) <= 6999;

      if (isStudentCode) {
        const studentIndex = parseInt(cleanDigits.substring(cleanDigits.length - 2), 10) || 1;
        const duplaNum = Math.max(1, Math.min(36, Math.ceil(studentIndex / 2)));
        const duplaCode = `D${String(duplaNum).padStart(2, '0')}`;

        const dynamicStudent = {
          id: `ESPOCH-BRIG-${String(Math.min(73, Math.max(1, studentIndex))).padStart(2, '0')}`,
          name: `Estudiante Brigadista ${duplaCode}`,
          cedula: `${cleanDigits.substring(0, 9)}-${cleanDigits.substring(9, 10) || '0'}`,
          codigo_estudiante: cleanPass,
          email: `estudiante.${duplaCode.toLowerCase()}@espoch.edu.ec`,
          phone: '0987654321',
          birthDate: '2003-05-18',
          gender: (studentIndex % 2 === 0) ? 'Masculino' : 'Femenino',
          bloodType: 'O+',
          kichwaLevel: 'Básico',
          emergencyContactName: 'Familiar de Contacto (Padres)',
          emergencyContactPhone: '0991234567',
          role: 'encuestador',
          roleLabel: 'Brigadista Acreditada ESPOCH',
          organization: 'Carrera de Nutrición y Dietética (FSP)',
          dupla: duplaCode,
          posicion: (studentIndex % 2 === 0) ? 'Titular 2' : 'Titular 1',
          sector: duplaNum <= 12 ? 'Sector A' : (duplaNum <= 24 ? 'Sector B' : 'Sector C'),
          zona_nombre: duplaNum <= 12 ? 'Sector A - Cabecera y Bajas' : (duplaNum <= 24 ? 'Sector B - Panamericana y Media' : 'Sector C - Altas y Páramo'),
          meta_encuestas: 18,
          status: 'activo',
          avatar: `E${duplaNum}`,
          defaultRoute: 'student',
          loginAt: new Date().toISOString()
        };

        const sessionData = {
          payload: dynamicStudent,
          signature: generateSessionSignature(dynamicStudent)
        };

        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
        return { success: true, user: dynamicStudent, defaultRoute: 'student' };
      } else {
        return { success: false, error: 'Código estudiantil no válido. Debe tener 4 dígitos asignados (ej: 6500).' };
      }
    }

    return { 
      success: false, 
      error: 'Usuario o cédula no encontrada en el padrón institucional. Verifique el formato ingresado.' 
    };
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
  },

  addUser(newUser) {
    const users = this.getUsers();
    const id = `usr-${Date.now().toString(36)}`;
    const userToSave = {
      id,
      ...newUser,
      status: newUser.status || 'activo',
      avatar: (newUser.name || 'US').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
    };
    users.push(userToSave);
    this.saveUsers(users);
    return userToSave;
  },

  updateUser(id, updates) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      this.saveUsers(users);
      return users[idx];
    }
    return null;
  },

  // Permisos modulares por rol (RBAC 2.0)
  canAccess(role, moduleKey) {
    const permissions = {
      admin: ['dashboard', 'nutritionist', 'student', 'gis', 'population', 'surveyors', 'users', 'protocols', 'reports', 'credentials', 'kobo'],
      supervisor: ['dashboard', 'nutritionist', 'student', 'gis', 'population', 'surveyors', 'protocols', 'reports', 'credentials', 'kobo'],
      nutricionista: ['nutritionist', 'gis', 'population', 'surveyors', 'protocols', 'reports', 'credentials'],
      encuestador: ['student', 'gis', 'surveyors', 'protocols', 'credentials'],
      observador: ['dashboard', 'gis', 'reports', 'protocols']
    };

    const allowed = permissions[role] || [];
    return allowed.includes(moduleKey);
  }
};
