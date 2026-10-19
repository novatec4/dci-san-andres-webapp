// =============================================================================
// DATASERVICE.JS - Servicio de Datos Bimodal (Real vs Demo) & Catastro Oficial
// =============================================================================

import { WHOAnthro } from './whoanthro';

const COMMUNITIES = [
  { id: 'san-andres-centro', name: 'San Andrés Centro', sector: 'Sector A', target: 85 },
  { id: 'pulingui', name: 'Pulinguí', sector: 'Sector C', target: 68 },
  { id: 'trencilla', name: 'Trencilla', sector: 'Sector B', target: 45 },
  { id: 'gualiqueme', name: 'Gualiqueme', sector: 'Sector B', target: 52 },
  { id: 'san-pablo', name: 'San Pablo', sector: 'Sector A', target: 40 },
  { id: 'los-pinos', name: 'Los Pinos', sector: 'Sector A', target: 36 },
  { id: 'batzacon', name: 'Batzacón', sector: 'Sector B', target: 48 },
  { id: 'calshi', name: 'Calshi', sector: 'Sector C', target: 39 },
  { id: 'chimborazo', name: 'Chimborazo Bajo', sector: 'Sector C', target: 34 },
  { id: 'guayllabamba', name: 'Guayllabamba', sector: 'Sector A', target: 30 },
  { id: 'la-merced', name: 'La Merced', sector: 'Sector B', target: 35 },
  { id: 'santa-rosa', name: 'Santa Rosa de Chuquipogyo', sector: 'Sector C', target: 55 }
];

const MACRO_SECTORS = [
  {
    id: 'sector-a',
    code: 'Sector A',
    name: 'Cabecera y Bajas',
    settlementsCount: 16,
    targetChildren: 221,
    pct: 34.2,
    duplas: 'D01 a D12 (12 Duplas)',
    supervisor: 'ND. Verónica Carlina Delgado López',
    color: '#002B49'
  },
  {
    id: 'sector-b',
    code: 'Sector B',
    name: 'Panamericana y Zona Media',
    settlementsCount: 14,
    targetChildren: 230,
    pct: 35.5,
    duplas: 'D13 a D24 (12 Duplas)',
    supervisor: 'Mgs. Vilma Lorena Velasco Castillo',
    color: '#10B981'
  },
  {
    id: 'sector-c',
    code: 'Sector C',
    name: 'Altas y Páramo',
    settlementsCount: 15,
    targetChildren: 196,
    pct: 30.3,
    duplas: 'D25 a D36 (12 Duplas)',
    supervisor: 'Dr. Juan Patricio Ramos Rodríguez',
    color: '#E8734A'
  }
];

// Generador de 200 infantes sintéticos para validación de algoritmos OMS
function generateSyntheticChildren() {
  const firstNames = ['Liam', 'Mateo', 'Dylan', 'Sebastián', 'Thiago', 'Sofía', 'Valentina', 'Isabella', 'Camila', 'Mia', 'Gael', 'Emiliano', 'Lucas', 'Emma', 'Victoria'];
  const lastNames = ['Guashpa', 'Paucar', 'Pillajo', 'Chirau', 'Daquilema', 'Cajamarca', 'Lema', 'Curicho', 'Taday', 'Balseca', 'Morales', 'Morocho', 'Cepeda', 'Yanza'];
  
  const children = [];
  for (let i = 1; i <= 200; i++) {
    const ageMonths = Math.floor(Math.random() * 59) + 1; // 1 a 59 meses
    const gender = Math.random() > 0.48 ? 'M' : 'F';
    const comm = COMMUNITIES[i % COMMUNITIES.length];
    
    // Altura y peso base
    const baseHeight = 49 + (ageMonths * 1.02) + (Math.random() * 6 - 3);
    const heightCm = Math.round(baseHeight * 10) / 10;
    const baseWeight = 3.3 + (ageMonths * 0.28) + (Math.random() * 2 - 1);
    const weightKg = Math.round(baseWeight * 10) / 10;
    
    const hasEdema = (i === 17 || i === 89); // 2 casos críticos de prueba
    const position = ageMonths < 24 ? 'recumbent' : 'standing';
    
    const haz = WHOAnthro.calculateHAZ(ageMonths, heightCm, gender, position);
    const waz = WHOAnthro.calculateWAZ(ageMonths, weightKg, gender, hasEdema);
    const whz = WHOAnthro.calculateWHZ(heightCm, weightKg, gender, hasEdema, position);
    const baz = WHOAnthro.calculateBAZ(ageMonths, heightCm, weightKg, gender, hasEdema);
    const diag = WHOAnthro.getNutritionalDiagnosis(haz, waz, whz, hasEdema);
    
    children.push({
      id: `INF-${String(i).padStart(4, '0')}`,
      subjectCode: `SA-${comm.id.substring(0, 3).toUpperCase()}-${String(i).padStart(3, '0')}`,
      name: `${firstNames[i % firstNames.length]} ${lastNames[(i * 3) % lastNames.length]}`,
      ageMonths,
      gender,
      heightCm,
      weightKg,
      hasEdema,
      position,
      community: comm.name,
      sector: comm.sector,
      lat: -1.58 + (Math.random() * 0.08 - 0.04),
      lng: -78.71 + (Math.random() * 0.08 - 0.04),
      haz,
      waz,
      whz,
      baz,
      diagnosis: diag,
      surveyDate: '2026-09-20'
    });
  }
  return children;
}

const DEMO_CHILDREN = generateSyntheticChildren();

export const DataService = {
  projectMeta: {
    name: 'Componente A.3.1 - San Andrés',
    stageName: 'Fase de Campo Oficial San Andrés',
    targetSanAndres: 647,
    targetGlobal: 1397,
    officialSettlements: 45,
    dasimetricRoofs: 5486,
    surveyorsCount: 73,
    duplasCount: 36,
    startDate: '05/10/2026'
  },

  getDataMode() {
    return localStorage.getItem('cgpi_data_mode') || 'real';
  },

  setDataMode(mode) {
    const val = (mode === 'demo') ? 'demo' : 'real';
    localStorage.setItem('cgpi_data_mode', val);
    return val;
  },

  getChildren() {
    const mode = this.getDataMode();
    if (mode === 'real') {
      return []; // Línea base en 0 antes del 05/10/2026
    }
    return DEMO_CHILDREN;
  },

  getMacroSectors() {
    return MACRO_SECTORS;
  },

  getCommunities() {
    return COMMUNITIES;
  },

  getNutritionStats() {
    const children = this.getChildren();
    const total = children.length;
    if (total === 0) {
      return {
        totalEvaluated: 0,
        samCount: 0,
        mamCount: 0,
        dciCount: 0,
        normalCount: 0,
        overweightCount: 0,
        dciPrevalencePct: 0,
        targetTotal: 647
      };
    }

    const sam = children.filter(c => c.hasEdema || (c.whz !== null && c.whz < -3)).length;
    const mam = children.filter(c => !c.hasEdema && c.whz !== null && c.whz >= -3 && c.whz < -2).length;
    const dci = children.filter(c => c.haz !== null && c.haz < -2).length;
    const normal = children.filter(c => c.diagnosis.code === 'NORMAL').length;
    const overweight = children.filter(c => c.whz !== null && c.whz > 2).length;

    return {
      totalEvaluated: total,
      samCount: sam,
      mamCount: mam,
      dciCount: dci,
      normalCount: normal,
      overweightCount: overweight,
      dciPrevalencePct: ((dci / total) * 100).toFixed(1),
      targetTotal: 647
    };
  }
};
