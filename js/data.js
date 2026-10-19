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
    name: 'Caracterización Georreferenciada de la Población Infantil',
    subtitle: 'San Andrés y Manglaralto',
    province: 'Santa Elena, Ecuador',
    startDate: '2025-01-15',
    currentDate: '2025-09-28',
    totalTarget: 250
  },

  communities: [
    { id: 'san-andres', name: 'San Andrés', lat: -2.2854, lng: -80.7272, population: 12500, color: '#E8734A' },
    { id: 'manglaralto', name: 'Manglaralto', lat: -1.8312, lng: -80.7345, population: 5800, color: '#8b5cf6' },
    { id: 'cadeate', name: 'Cadeate', lat: -1.8567, lng: -80.7234, population: 2100, color: '#f59e0b' },
    { id: 'libertador-bolivar', name: 'Libertador Bolívar', lat: -1.8789, lng: -80.7156, population: 1800, color: '#ef4444' },
    { id: 'san-pedro', name: 'San Pedro', lat: -1.9234, lng: -80.7312, population: 3200, color: '#10b981' },
    { id: 'valdivia', name: 'Valdivia', lat: -1.9456, lng: -80.7189, population: 4100, color: '#f97316' }
  ],

  surveyors: [],
  children: [],
  healthCenters: [],
  schools: []
};

// ============================================================
// GENERATE SURVEYORS (15)
// ============================================================
(function generateSurveyors() {
  const firstNames = [
    'María', 'José', 'Ana', 'Carlos', 'Gabriela',
    'Luis', 'Patricia', 'Fernando', 'Rosa', 'Miguel',
    'Daniela', 'Andrés', 'Verónica', 'Diego', 'Lucía'
  ];
  const lastNames = [
    'Suárez Baque', 'Tomalá González', 'Reyes Villón', 'Pozo Lindao', 'Quimí Rodríguez',
    'De la Cruz Soriano', 'Borbor Yagual', 'Catuto Lino', 'Orrala Tigrero', 'Rosales Figueroa',
    'González Baque', 'Villón Suárez', 'Lindao Tomalá', 'Figueroa Orrala', 'Tigrero Catuto'
  ];

  const communityIds = APP_DATA.communities.map(c => c.id);
  const statuses = ['activo','activo','activo','activo','activo','activo','activo','activo','activo','activo','en-campo','en-campo','en-campo','inactivo','inactivo'];

  for (let i = 0; i < 15; i++) {
    const firstName = firstNames[i];
    const lastName = lastNames[i];
    const zone = communityIds[i % communityIds.length];
    const status = statuses[i];
    const completedSurveys = randInt(5, 25);
    const targetSurveys = randInt(completedSurveys + 2, 35);
    const phoneNum = '09' + String(randInt(10000000, 99999999));
    const emailName = (firstName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') + '.' + lastName.split(' ')[0].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
    const startDate = formatDate(randomDate(new Date('2025-01-15'), new Date('2025-03-15')));

    APP_DATA.surveyors.push({
      id: i + 1,
      name: firstName,
      lastName: lastName,
      zone: zone,
      status: status,
      completedSurveys: completedSurveys,
      targetSurveys: targetSurveys,
      phone: phoneNum,
      email: emailName + '@proyecto.gob.ec',
      startDate: startDate,
      avatar: firstName[0] + lastName[0]
    });
  }
})();

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

  // Community distribution weights (more in san-andres and manglaralto)
  const communityWeights = [
    { id: 'san-andres', weight: 0.30 },
    { id: 'manglaralto', weight: 0.25 },
    { id: 'cadeate', weight: 0.10 },
    { id: 'libertador-bolivar', weight: 0.10 },
    { id: 'san-pedro', weight: 0.12 },
    { id: 'valdivia', weight: 0.13 }
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

    const age = randInt(0, 12);
    const birthYear = 2025 - age - (random() < 0.5 ? 1 : 0);
    const birthMonth = randInt(1, 12);
    const birthDay = randInt(1, 28);
    const birthDate = `${Math.max(2012, Math.min(2025, birthYear))}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`;

    const communityId = pickCommunity();
    const community = APP_DATA.communities.find(c => c.id === communityId);

    // Offset lat/lng from community center by ±0.01 to ±0.03
    const latOffset = (random() < 0.5 ? 1 : -1) * randFloat(0.01, 0.03);
    const lngOffset = (random() < 0.5 ? 1 : -1) * randFloat(0.01, 0.03);
    const lat = parseFloat((community.lat + latOffset).toFixed(6));
    const lng = parseFloat((community.lng + lngOffset).toFixed(6));

    const nutritionalStatus = pickNutritionalStatus();

    // Generate age-appropriate weight and height
    const wRange = weightRanges[age];
    const hRange = heightRanges[age];
    let baseWeight = randFloat(wRange[0], wRange[1]);
    const height = parseFloat(randFloat(hRange[0], hRange[1]).toFixed(1));

    // Adjust weight for nutritional status
    let weight = parseFloat(adjustWeightForStatus(baseWeight, nutritionalStatus, age).toFixed(1));

    // Calculate BMI
    const heightM = height / 100;
    const bmi = parseFloat((weight / (heightM * heightM)).toFixed(1));

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
      gender: gender,
      birthDate: birthDate,
      communityId: communityId,
      lat: lat,
      lng: lng,
      weight: weight,
      height: height,
      bmi: bmi,
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
// HEALTH CENTERS (6)
// ============================================================
APP_DATA.healthCenters = [
  { id: 1, name: 'Centro de Salud San Andrés', lat: -2.2860, lng: -80.7265, communityId: 'san-andres', type: 'Centro de Salud' },
  { id: 2, name: 'Subcentro de Salud Manglaralto', lat: -1.8318, lng: -80.7340, communityId: 'manglaralto', type: 'Subcentro' },
  { id: 3, name: 'Puesto de Salud Cadeate', lat: -1.8572, lng: -80.7228, communityId: 'cadeate', type: 'Puesto de Salud' },
  { id: 4, name: 'Subcentro de Salud Libertador Bolívar', lat: -1.8795, lng: -80.7150, communityId: 'libertador-bolivar', type: 'Subcentro' },
  { id: 5, name: 'Puesto de Salud San Pedro', lat: -1.9240, lng: -80.7305, communityId: 'san-pedro', type: 'Puesto de Salud' },
  { id: 6, name: 'Centro de Salud Valdivia', lat: -1.9462, lng: -80.7183, communityId: 'valdivia', type: 'Centro de Salud' }
];

// ============================================================
// SCHOOLS (8)
// ============================================================
APP_DATA.schools = [
  { id: 1, name: 'Unidad Educativa San Andrés', lat: -2.2848, lng: -80.7280, communityId: 'san-andres', type: 'Educación Básica', students: 320 },
  { id: 2, name: 'Escuela Fiscal Eloy Alfaro', lat: -2.2862, lng: -80.7258, communityId: 'san-andres', type: 'Básica Superior', students: 185 },
  { id: 3, name: 'Unidad Educativa Manglaralto', lat: -1.8305, lng: -80.7350, communityId: 'manglaralto', type: 'Educación Básica', students: 275 },
  { id: 4, name: 'Centro de Educación Inicial Los Delfines', lat: -1.8320, lng: -80.7338, communityId: 'manglaralto', type: 'Inicial', students: 60 },
  { id: 5, name: 'Escuela Básica Cadeate', lat: -1.8575, lng: -80.7228, communityId: 'cadeate', type: 'Educación Básica', students: 110 },
  { id: 6, name: 'Escuela Fiscal Libertador Bolívar', lat: -1.8792, lng: -80.7148, communityId: 'libertador-bolivar', type: 'Educación Básica', students: 95 },
  { id: 7, name: 'Unidad Educativa San Pedro de la Costa', lat: -1.9228, lng: -80.7320, communityId: 'san-pedro', type: 'Educación Básica', students: 145 },
  { id: 8, name: 'Escuela Básica Valdivia', lat: -1.9450, lng: -80.7195, communityId: 'valdivia', type: 'Educación Básica', students: 160 }
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

  this.children.forEach(function(child) {
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
  this.children.forEach(function(child) {
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
  this.children.forEach(function(child) {
    stats.health[child.accessHealth ? 'yes' : 'no']++;
    stats.education[child.accessEducation ? 'yes' : 'no']++;
    stats.water[child.accessWater ? 'yes' : 'no']++;
    stats.internet[child.accessInternet ? 'yes' : 'no']++;
  });
  return stats;
};

APP_DATA.getGenderStats = function() {
  var stats = { M: 0, F: 0 };
  this.children.forEach(function(child) {
    stats[child.gender]++;
  });
  return stats;
};

APP_DATA.getAgeDistribution = function() {
  var distribution = [];
  for (var age = 0; age <= 12; age++) {
    distribution.push({ age: age, count: 0 });
  }
  this.children.forEach(function(child) {
    if (child.age >= 0 && child.age <= 12) {
      distribution[child.age].count++;
    }
  });
  return distribution;
};
