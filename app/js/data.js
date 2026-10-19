// ============================================================
// DATA.JS - Synthetic Data Generator
// Plataforma de Caracterización Georreferenciada de la
// Población Infantil en San Andrés y Manglaralto
// (Santa Elena, Ecuador)
// ============================================================

// Seeded pseudo-random number generator for deterministic data
function seededRandom(seed) {
  let s = seed;
  return function() {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
const random = seededRandom(42);

// Helper: pick random element from array
function pickRandom(arr) {
  return arr[Math.floor(random() * arr.length)];
}

// Helper: random integer between min and max (inclusive)
function randInt(min, max) {
  return Math.floor(random() * (max - min + 1)) + min;
}

// Helper: random float between min and max
function randFloat(min, max) {
  return min + random() * (max - min);
}

// Helper: format date as ISO string (YYYY-MM-DD)
function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Helper: random date between two dates
function randomDate(start, end) {
  const startTime = start.getTime();
  const endTime = end.getTime();
  const randomTime = startTime + random() * (endTime - startTime);
  return new Date(randomTime);
}

// ============================================================
// APP_DATA Object
// ============================================================
const APP_DATA = {
  project: {
    name: 'Caracterización Georreferenciada de la Población Infantil (0 a 5 años)',
    subtitle: 'Fase Activa: San Andrés (Guano, Chimborazo)',
    province: 'Chimborazo, Ecuador',
    startDate: '2026-05-18',
    currentDate: '2026-09-26',
    totalTargetSanAndres: 647, // Muestra Oficial Etapa San Andrés: 647 niños
    totalTargetGlobal: 1397,   // Muestra Total Convenio (San Andrés 647 + Manglaralto 750)
    totalTarget: 647,
    viviendasDasimetricas: 5486, // 5.486 techos habitacionales clasificados por K-NN
    viviendasIA: 5486,
    asentamientosPDOT: 45,     // 45 Asentamientos Humanos Oficiales PDOT Guano 2023-2027
    centralidadesPDOT: 45,
    sectoresOperativos: 3,     // Macro-Sectores: Sector A (221), Sector B (230), Sector C (196)
    brigadistasTotal: 73       // 73 estudiantes de Nutrición ESPOCH (36 duplas + 1 logística)
  },

  // Modo de Datos: 'real' (Operación en Vivo / Línea Base Oficial) vs 'demo' (Simulación Demostrativa)
  dataMode: localStorage.getItem('cgpi_data_mode') || 'real',

  setDataMode(mode) {
    this.dataMode = (mode === 'demo') ? 'demo' : 'real';
    localStorage.setItem('cgpi_data_mode', this.dataMode);
    if (window.App && App.currentModule && App.modules[App.currentModule]) {
      App.navigateTo(App.currentModule);
    }
  },

  getDataMode() {
    return this.dataMode;
  },

  getActiveChildren() {
    // En Modo Real: 0 niños censados en campo a la fecha (el barrido masivo inicia el 5 de oct tras el TEM)
    return this.dataMode === 'real' ? [] : this.children;
  },

  communities: [
    { id: 'san-andres-centro', name: 'Barrio San Andrés Centro', lat: -1.5917, lng: -78.7017, population: 3800, color: '#E8734A' },
    { id: 'pulingui', name: 'Comunidad Pulinguí', lat: -1.5645, lng: -78.7420, population: 1400, color: '#8b5cf6' },
    { id: 'trencilla', name: 'Comunidad Trencilla', lat: -1.5830, lng: -78.7350, population: 1250, color: '#f59e0b' },
    { id: 'gualiqueme', name: 'Comunidad Gualiqueme', lat: -1.5598, lng: -78.7232, population: 1600, color: '#10b981' },
    { id: 'san-pablo', name: 'Comunidad San Pablo', lat: -1.5720, lng: -78.7180, population: 1100, color: '#3b82f6' },
    { id: 'los-pinos', name: 'Barrio Los Pinos', lat: -1.5950, lng: -78.7080, population: 950, color: '#ec4899' },
    { id: 'batzacon', name: 'Comunidad Batzacón', lat: -1.6080, lng: -78.6980, population: 850, color: '#ef4444' },
    { id: 'calshi', name: 'Comunidad Calshi', lat: -1.5680, lng: -78.7120, population: 1050, color: '#06b6d4' }
  ],

  surveyors: [],
  children: [],
  healthCenters: [],
  schools: []
};

// ============================================================
// ============================================================
// GENERATE & PERSIST PERSONNEL (73 Brigadistas de Nutrición ESPOCH)
// ============================================================
APP_DATA.initPersonnel = function() {
  const saved = localStorage.getItem('cgpi_personnel_v3');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
        // Sanear teléfonos de soporte o ficticios para que queden vacíos
        parsed.forEach(p => {
          if (p.phone === '0998234512' || p.phone === '+593 99 823 4512') {
            p.phone = '';
          }
        });
        this.surveyors = parsed;
        return;
    } catch (e) {}
  }

  // Carga asíncrona oficial desde brigadistas_espoch_dci.json
  fetch('data/brigadistas_espoch_dci.json')
    .then(r => r.json())
    .then(list => {
      this.surveyors = list.map((b, idx) => ({
        id: idx + 1,
        brigadistaId: b.id,
        cedula: b.cedula_ofuscada,
        name: b.nombres.split(' ')[0] || 'Estudiante',
        lastName: b.nombres.split(' ').slice(1).join(' ') || 'ESPOCH',
        fullName: b.nombres,
        role: b.rol.includes('Supervisor') ? 'supervisor' : (b.rol.includes('Antropometrista') ? 'nutricionista' : 'encuestador'),
        roleLabel: b.rol,
        carrera: b.carrera,
        pao: b.pao,
        dupla: b.dupla,
        posicion: b.posicion,
        zone: 'san-andres-centro',
        zoneName: b.zona_nombre,
        status: 'activo',
        phone: b.telefono || b.phone || '',
        email: b.email || b.email_institucional || `${b.id.toLowerCase().replace(/[^a-z0-9]/g, '')}@espoch.edu.ec`,
        targetSurveys: 39,
        completedSurveys: 0,
        startDate: '2026-09-21',
        avatar: (b.nombres.split(' ')[0][0] + (b.nombres.split(' ')[1] ? b.nombres.split(' ')[1][0] : 'E')).toUpperCase()
      }));

      // Incorporar brigadistas auto-registrados si existen
      try {
        const registered = JSON.parse(localStorage.getItem('cgpi_registered_brigadistas_v2')) || [];
        if (Array.isArray(registered) && registered.length > 0) {
          registered.forEach(reg => {
            if (!this.surveyors.some(s => s.cedula === reg.cedula || s.brigadistaId === reg.id)) {
              this.surveyors.unshift({
                id: this.surveyors.length + 1,
                brigadistaId: reg.id,
                cedula: reg.cedula,
                name: reg.name?.split(' ')[0] || 'Estudiante',
                lastName: reg.name?.split(' ').slice(1).join(' ') || 'Registrado',
                fullName: reg.name || reg.nombres,
                role: reg.role || 'encuestador',
                roleLabel: reg.roleLabel || 'Encuestador de Terreno ESPOCH',
                carrera: reg.carrera || 'Nutrición y Dietética - ESPOCH',
                pao: reg.pao || 'PAO 5',
                dupla: reg.dupla || 'D01',
                posicion: reg.posicion || 'Titular 1',
                zone: 'san-andres-centro',
                zoneName: reg.zona_nombre || 'San Andrés Centro',
                status: 'activo',
                phone: reg.telefono || reg.phone || '',
                email: reg.email || '',
                targetSurveys: 39,
                completedSurveys: 0,
                startDate: new Date().toISOString().substring(0, 10),
                avatar: reg.avatar || 'ES'
              });
            }
          });
        }
      } catch (e) {}

      localStorage.setItem('cgpi_personnel_v3', JSON.stringify(this.surveyors));
    })
    .catch(err => {
      console.warn('Error cargando brigadistas_espoch_dci.json', err);
    });
};

APP_DATA.initPersonnel();


// ============================================================
// GENERATE CHILDREN (200)
// ============================================================
(function generateChildren() {
  const boyNames = [
    'Santiago', 'Mateo', 'Sebastián', 'Nicolás', 'Alejandro',
    'Samuel', 'Daniel', 'Benjamín', 'Joaquín', 'Lucas',
    'Emiliano', 'Tomás', 'David', 'Gabriel', 'Adrián',
    'Isaac', 'Ángel', 'Leonardo', 'Diego', 'Maximiliano',
    'Juan Pablo', 'Rafael', 'Esteban', 'Cristian', 'Andrés',
    'Víctor', 'Josué', 'Kevin', 'Bryan', 'Jefferson',
    'Joel', 'Erick', 'Javier', 'Pablo', 'Ricardo'
  ];
  const girlNames = [
    'Valentina', 'Isabella', 'Sofía', 'Camila', 'Luciana',
    'Renata', 'Victoria', 'Martina', 'Emma', 'Mía',
    'Catalina', 'Antonella', 'Samantha', 'Daniela', 'Salomé',
    'Paula', 'Emilia', 'Amanda', 'Ariana', 'Bianca',
    'Génesis', 'Melany', 'Doménica', 'Guadalupe', 'Nayeli',
    'Abigail', 'Tamara', 'Fernanda', 'Andrea', 'Karla',
    'Joselyn', 'Angie', 'Leslie', 'Dayana', 'Kiara'
  ];
  const childLastNames = [
    'Tomalá', 'Suárez', 'Baque', 'Villón', 'Quimí',
    'Reyes', 'Lindao', 'Orrala', 'Borbor', 'Catuto',
    'González', 'Pozo', 'Figueroa', 'Tigrero', 'Rosales',
    'De la Cruz', 'Yagual', 'Soriano', 'Lino', 'Rodríguez',
    'Magallanes', 'Cedeño', 'Zambrano', 'Laínez', 'Chancay',
    'Matías', 'Merchán', 'Pilco', 'Salinas', 'Parrales'
  ];

  // Community distribution weights in San Andrés
  const communityWeights = [
    { id: 'san-andres-centro', weight: 0.25 },
    { id: 'pulingui', weight: 0.15 },
    { id: 'trencilla', weight: 0.15 },
    { id: 'gualiqueme', weight: 0.15 },
    { id: 'san-pablo', weight: 0.10 },
    { id: 'los-pinos', weight: 0.08 },
    { id: 'batzacon', weight: 0.06 },
    { id: 'calshi', weight: 0.06 }
  ];

  function pickCommunity() {
    const r = random();
    let cumulative = 0;
    for (const cw of communityWeights) {
      cumulative += cw.weight;
      if (r < cumulative) return cw.id;
    }
    return communityWeights[communityWeights.length - 1].id;
  }

  // Nutritional status distribution thresholds
  // ~60% Normal, ~15% Desnutrición Leve, ~8% Desnutrición Moderada,
  // ~2% Desnutrición Severa, ~10% Sobrepeso, ~5% Obesidad
  function pickNutritionalStatus() {
    const r = random();
    if (r < 0.60) return 'Normal';
    if (r < 0.75) return 'Desnutrición Leve';
    if (r < 0.83) return 'Desnutrición Moderada';
    if (r < 0.85) return 'Desnutrición Severa';
    if (r < 0.95) return 'Sobrepeso';
    return 'Obesidad';
  }

  // Age-appropriate weight ranges (kg) by age
  // Based on WHO growth standards approximate median ranges
  const weightRanges = {
    0: [3.0, 5.5], 1: [7.5, 12.0], 2: [9.5, 14.5], 3: [11.0, 17.0],
    4: [13.0, 20.0], 5: [15.0, 22.0], 6: [16.5, 25.0], 7: [18.0, 28.0],
    8: [20.0, 32.0], 9: [22.0, 36.0], 10: [24.0, 40.0], 11: [26.0, 45.0],
    12: [28.0, 50.0]
  };

  // Age-appropriate height ranges (cm) by age
  const heightRanges = {
    0: [45, 60], 1: [68, 82], 2: [78, 92], 3: [85, 100],
    4: [92, 108], 5: [98, 115], 6: [105, 121], 7: [110, 128],
    8: [115, 135], 9: [120, 140], 10: [125, 147], 11: [130, 153],
    12: [135, 160]
  };

  // Apply nutritional status modifier to weight
  function adjustWeightForStatus(weight, status, age) {
    switch (status) {
      case 'Desnutrición Leve':
        return weight * randFloat(0.82, 0.90);
      case 'Desnutrición Moderada':
        return weight * randFloat(0.70, 0.82);
      case 'Desnutrición Severa':
        return weight * randFloat(0.55, 0.70);
      case 'Sobrepeso':
        return weight * randFloat(1.10, 1.25);
      case 'Obesidad':
        return weight * randFloat(1.25, 1.45);
      default:
        return weight;
    }
  }

  // Grade level by age
  function getGradeLevel(age, enrolled) {
    if (!enrolled) return null;
    if (age < 3) return null;
    if (age <= 4) return 'Inicial 1';
    if (age === 5) return 'Inicial 2';
    if (age === 6) return '1° Básica';
    if (age === 7) return '2° Básica';
    if (age === 8) return '3° Básica';
    if (age === 9) return '4° Básica';
    if (age === 10) return '5° Básica';
    if (age === 11) return '6° Básica';
    if (age === 12) return '7° Básica';
    return null;
  }

  const observations = [
    'Sin observaciones relevantes.',
    'Presenta signos leves de anemia, referido a centro de salud.',
    'Buen estado de salud general. Familia colaborativa.',
    'Requiere seguimiento nutricional en próxima visita.',
    'Vive con abuela materna, padres trabajan fuera de la comunidad.',
    'Acceso limitado a agua potable en el hogar.',
    'Niño participativo y en buen desarrollo cognitivo.',
    'Se observa retraso en esquema de vacunación.',
    'Familia solicita apoyo para programa de alimentación escolar.',
    'Condiciones de vivienda precarias, techo de zinc deteriorado.',
    'Participa en programa de desayuno escolar.',
    'Padre dedicado a la pesca artesanal, ingresos variables.',
    'Buenas condiciones de higiene en el hogar.',
    'Se recomienda evaluación odontológica.',
    'Menor muestra señales de desarrollo adecuado para su edad.',
    'Familia numerosa, recursos económicos limitados.',
    'Madre soltera, trabaja en comercio informal.',
    'Acceso a transporte escolar comunitario.',
    'Requiere lentes, referido a optometría.',
    'Niño con alergia alimentaria reportada por la madre.'
  ];

  const incomeOptions = ['Bajo', 'Medio-Bajo', 'Medio'];

  const surveyStart = new Date('2025-02-01');
  const surveyEnd = new Date('2025-09-28');

  for (let i = 0; i < 200; i++) {
    const gender = random() < 0.50 ? 'M' : 'F';
    const namePool = gender === 'M' ? boyNames : girlNames;
    const firstName = pickRandom(namePool);
    const lastName = pickRandom(childLastNames) + ' ' + pickRandom(childLastNames);

    // Componente A.3.1: Exclusivo niños entre 0 y 5 años (0 a 4 años cumplidos / 0-59 meses)
    const age = randInt(0, 4);
    const ageMonths = Math.min(59, age * 12 + randInt(0, 11));
    const birthYear = 2026 - Math.floor(ageMonths / 12) - (random() < 0.2 ? 1 : 0);
    const birthMonth = randInt(1, 12);
    const birthDay = randInt(1, 28);
    const birthDate = `${Math.max(2021, Math.min(2026, birthYear))}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`;

    const communityId = pickCommunity();
    const community = APP_DATA.communities.find(c => c.id === communityId) || APP_DATA.communities[0];

    // Offset lat/lng from community center by ±0.003 to ±0.015 (realistic range in San Andrés)
    const latOffset = (random() < 0.5 ? 1 : -1) * randFloat(0.003, 0.012);
    const lngOffset = (random() < 0.5 ? 1 : -1) * randFloat(0.003, 0.012);
    const centerLat = community ? community.lat : -1.5917;
    const centerLng = community ? community.lng : -78.7017;
    const lat = parseFloat((centerLat + latOffset).toFixed(6));
    const lng = parseFloat((centerLng + lngOffset).toFixed(6));

    const nutritionalStatus = pickNutritionalStatus();

    // Generate age-appropriate weight and height (0 a 4 años)
    const wRange = weightRanges[age] || weightRanges[2];
    const hRange = heightRanges[age] || heightRanges[2];
    let baseWeight = randFloat(wRange[0], wRange[1]);
    const height = parseFloat(randFloat(hRange[0], hRange[1]).toFixed(1));

    // Adjust weight for nutritional status
    let weight = parseFloat(adjustWeightForStatus(baseWeight, nutritionalStatus, age).toFixed(1));

    // Calculate BMI
    const heightM = height / 100;
    const bmi = parseFloat((weight / (heightM * heightM)).toFixed(1));

    // Cálculo Oficial OMS WHO Anthro (LMS)
    let haz = null;
    let waz = null;
    let whz = null;
    let isDCI = false;
    let isSAM = false;

    if (typeof WHOAnthro !== 'undefined') {
      const anthro = WHOAnthro.calculateZScores({
        ageMonths: ageMonths,
        heightCm: height,
        weightKg: weight,
        sex: gender,
        measuredStanding: age >= 2
      });
      haz = anthro.haz;
      waz = anthro.waz;
      whz = anthro.whz;
      isDCI = anthro.isDCI;
      isSAM = anthro.isSAM;
    }

    const vaccinated = random() < 0.75;
    const vaccinationComplete = vaccinated ? (random() < 0.65) : false;
    const enrolledInSchool = age >= 3 ? (random() < 0.80) : false;
    const gradeLevel = getGradeLevel(age, enrolledInSchool);

    const accessHealth = random() < 0.70;
    const accessEducation = random() < 0.80;
    const accessWater = random() < 0.65;
    const accessInternet = random() < 0.35;

    const surveyorId = randInt(1, 15);
    const surveyDate = formatDate(randomDate(surveyStart, surveyEnd));
    const householdSize = randInt(2, 10);

    // Income distribution weighted toward lower income
    const incomeR = random();
    const householdIncome = incomeR < 0.45 ? 'Bajo' : (incomeR < 0.80 ? 'Medio-Bajo' : 'Medio');

    const observation = pickRandom(observations);

    APP_DATA.children.push({
      id: i + 1,
      name: firstName,
      lastName: lastName,
      age: age,
      ageMonths: ageMonths,
      gender: gender,
      birthDate: birthDate,
      communityId: communityId,
      lat: lat,
      lng: lng,
      weight: weight,
      height: height,
      bmi: bmi,
      haz: haz,
      waz: waz,
      whz: whz,
      isDCI: isDCI,
      isSAM: isSAM,
      nutritionalStatus: nutritionalStatus,
      vaccinated: vaccinated,
      vaccinationComplete: vaccinationComplete,
      enrolledInSchool: enrolledInSchool,
      gradeLevel: gradeLevel,
      accessHealth: accessHealth,
      accessEducation: accessEducation,
      accessWater: accessWater,
      accessInternet: accessInternet,
      surveyorId: surveyorId,
      surveyDate: surveyDate,
      householdSize: householdSize,
      householdIncome: householdIncome,
      observations: observation
    });
  }
})();

// ============================================================
// HEALTH CENTERS (6) — San Andrés (Guano, Chimborazo)
// ============================================================
APP_DATA.healthCenters = [
  { id: 1, name: 'Centro de Salud Tipo B San Andrés', lat: -1.5912, lng: -78.7015, communityId: 'san-andres-centro', type: 'Centro de Salud Tipo B' },
  { id: 2, name: 'Puesto de Salud Pulinguí', lat: -1.5650, lng: -78.7410, communityId: 'pulingui', type: 'Puesto de Salud' },
  { id: 3, name: 'Puesto de Salud Trencilla', lat: -1.5835, lng: -78.7345, communityId: 'trencilla', type: 'Puesto de Salud' },
  { id: 4, name: 'Puesto de Salud San Pablo', lat: -1.5715, lng: -78.7175, communityId: 'san-pablo', type: 'Puesto de Salud' },
  { id: 5, name: 'Puesto de Salud Gualiqueme', lat: -1.5595, lng: -78.7230, communityId: 'gualiqueme', type: 'Puesto de Salud' },
  { id: 6, name: 'Puesto de Salud Batzacón', lat: -1.6075, lng: -78.6975, communityId: 'batzacon', type: 'Puesto de Salud' }
];

// ============================================================
// SCHOOLS (8) — San Andrés (Guano, Chimborazo)
// ============================================================
APP_DATA.schools = [
  { id: 1, name: 'Unidad Educativa San Andrés', lat: -1.5925, lng: -78.7020, communityId: 'san-andres-centro', type: 'Educación Básica y Bachillerato', students: 320 },
  { id: 2, name: 'Escuela Pulinguí', lat: -1.5640, lng: -78.7425, communityId: 'pulingui', type: 'Educación Básica', students: 185 },
  { id: 3, name: 'Escuela Trencilla', lat: -1.5825, lng: -78.7355, communityId: 'trencilla', type: 'Educación Básica', students: 140 },
  { id: 4, name: 'Escuela Gualiqueme', lat: -1.5590, lng: -78.7230, communityId: 'gualiqueme', type: 'Educación Básica', students: 110 },
  { id: 5, name: 'Centro de Educación Inicial San Andrés', lat: -1.5930, lng: -78.7010, communityId: 'san-andres-centro', type: 'Inicial', students: 65 },
  { id: 6, name: 'Escuela San Pablo', lat: -1.5725, lng: -78.7170, communityId: 'san-pablo', type: 'Educación Básica', students: 95 },
  { id: 7, name: 'Escuela Los Pinos', lat: -1.5945, lng: -78.7075, communityId: 'los-pinos', type: 'Educación Básica', students: 80 },
  { id: 8, name: 'Escuela Batzacón', lat: -1.6085, lng: -78.6985, communityId: 'batzacon', type: 'Educación Básica', students: 90 }
];

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

APP_DATA.getChildrenByCommunity = function(communityId) {
  return this.children.filter(function(c) { return c.communityId === communityId; });
};

APP_DATA.getSurveyorById = function(id) {
  return this.surveyors.find(function(s) { return s.id === id; });
};

APP_DATA.getCommunityById = function(id) {
  return this.communities.find(function(c) { return c.id === id; });
};

APP_DATA.getChildrenBySurveyor = function(surveyorId) {
  return this.children.filter(function(c) { return c.surveyorId === surveyorId; });
};

APP_DATA.getSurveysByMonth = function() {
  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const counts = {};
  monthNames.forEach(function(m) { counts[m] = 0; });

  const activeList = this.getActiveChildren();
  activeList.forEach(function(child) {
    const monthIndex = parseInt(child.surveyDate.split('-')[1], 10) - 1;
    const monthName = monthNames[monthIndex];
    if (counts[monthName] !== undefined) {
      counts[monthName]++;
    }
  });

  return monthNames
    .filter(function(m) { return counts[m] > 0; })
    .map(function(m) { return { month: m, count: counts[m] }; });
};

APP_DATA.getNutritionalStats = function() {
  var stats = {
    'Normal': 0,
    'Desnutrición Leve': 0,
    'Desnutrición Moderada': 0,
    'Desnutrición Severa': 0,
    'Sobrepeso': 0,
    'Obesidad': 0
  };
  const activeList = this.getActiveChildren();
  activeList.forEach(function(child) {
    if (stats[child.nutritionalStatus] !== undefined) {
      stats[child.nutritionalStatus]++;
    }
  });
  return stats;
};

APP_DATA.getAccessStats = function() {
  var stats = {
    health: { yes: 0, no: 0 },
    education: { yes: 0, no: 0 },
    water: { yes: 0, no: 0 },
    internet: { yes: 0, no: 0 }
  };
  const activeList = this.getActiveChildren();
  activeList.forEach(function(child) {
    stats.health[child.accessHealth ? 'yes' : 'no']++;
    stats.education[child.accessEducation ? 'yes' : 'no']++;
    stats.water[child.accessWater ? 'yes' : 'no']++;
    stats.internet[child.accessInternet ? 'yes' : 'no']++;
  });
  return stats;
};

APP_DATA.getGenderStats = function() {
  var stats = { M: 0, F: 0 };
  const activeList = this.getActiveChildren();
  activeList.forEach(function(child) {
    stats[child.gender]++;
  });
  return stats;
};

APP_DATA.getAgeDistribution = function() {
  var distribution = [];
  for (var age = 0; age <= 12; age++) {
    distribution.push({ age: age, count: 0 });
  }
  const activeList = this.getActiveChildren();
  activeList.forEach(function(child) {
    if (child.age >= 0 && child.age <= 12) {
      distribution[child.age].count++;
    }
  });
  return distribution;
};

// ============================================================
// PERSONNEL CRUD & PERSISTENCE METHODS
// ============================================================
APP_DATA.savePersonnel = function() {
  try {
    localStorage.setItem('cgpi_personnel_v3', JSON.stringify(this.surveyors));
  } catch (e) {
    console.error('Error saving personnel to localStorage', e);
  }
};

APP_DATA.addPerson = function(person) {
  var maxId = this.surveyors.reduce(function(max, p) { return Math.max(max, p.id || 0); }, 0);
  person.id = maxId + 1;
  person.avatar = (person.name ? person.name[0] : 'P') + (person.lastName ? person.lastName[0] : '');
  person.completedSurveys = parseInt(person.completedSurveys, 10) || 0;
  person.targetSurveys = parseInt(person.targetSurveys, 10) || 65;
  person.startDate = person.startDate || new Date().toISOString().split('T')[0];
  person.role = (person.role || 'encuestador').toLowerCase();
  person.status = (person.status || 'activo').toLowerCase();
  this.surveyors.unshift(person);
  this.savePersonnel();
  return person;
};

APP_DATA.updatePerson = function(id, updated) {
  var idx = this.surveyors.findIndex(function(p) { return p.id === id; });
  if (idx !== -1) {
    Object.assign(this.surveyors[idx], updated);
    if (updated.name || updated.lastName) {
      this.surveyors[idx].avatar = (this.surveyors[idx].name ? this.surveyors[idx].name[0] : 'P') + 
                                   (this.surveyors[idx].lastName ? this.surveyors[idx].lastName[0] : '');
    }
    this.savePersonnel();
    return this.surveyors[idx];
  }
  return null;
};

APP_DATA.deletePerson = function(id) {
  var idx = this.surveyors.findIndex(function(p) { return p.id === id; });
  if (idx !== -1) {
    var removed = this.surveyors.splice(idx, 1)[0];
    this.savePersonnel();
    return removed;
  }
  return null;
};

APP_DATA.resetPersonnel = function() {
  localStorage.removeItem('cgpi_personnel_v3');
  this.surveyors = [];
  this.initPersonnel();
};

APP_DATA.exportPersonnelCSV = function() {
  var headers = ['ID', 'Cedula', 'Nombre', 'Apellido', 'Rol', 'Zona_Comunidad', 'Estado', 'Telefono', 'Email', 'Encuestas_Realizadas', 'Meta_Encuestas', 'Fecha_Inicio'];
  var rows = this.surveyors.map(function(p) {
    return [
      p.id,
      p.cedula || '',
      '"' + (p.name || '').replace(/"/g, '""') + '"',
      '"' + (p.lastName || '').replace(/"/g, '""') + '"',
      p.role || 'encuestador',
      p.zone || '',
      p.status || 'activo',
      p.phone || '',
      p.email || '',
      p.completedSurveys || 0,
      p.targetSurveys || 65,
      p.startDate || ''
    ].join(',');
  });
  return '\uFEFF' + headers.join(',') + '\n' + rows.join('\n');
};

APP_DATA.importPersonnelCSV = function(csvText) {
  var lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) return 0;
  var addedCount = 0;
  var self = this;
  
  for (var i = 1; i < lines.length; i++) {
    var line = lines[i].trim();
    if (!line) continue;
    var parts = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',');
    if (parts.length >= 3) {
      var clean = parts.map(function(p) { return p.replace(/^"|"$/g, '').trim(); });
      var person = {
        cedula: clean[1] || '',
        name: clean[2] || 'Personal',
        lastName: clean[3] || '',
        role: (clean[4] || 'encuestador').toLowerCase(),
        zone: clean[5] || 'san-andres',
        status: (clean[6] || 'activo').toLowerCase(),
        phone: clean[7] || '',
        email: clean[8] || '',
        completedSurveys: parseInt(clean[9], 10) || 0,
        targetSurveys: parseInt(clean[10], 10) || 65
      };
      self.addPerson(person);
      addedCount++;
    }
  }
  return addedCount;
};

if (typeof window !== 'undefined') {
  window.APP_DATA = APP_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = APP_DATA;
}

