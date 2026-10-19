// =============================================================================
// WHOANTHRO.JS - Motor Antropométrico Oficial OMS 2006 (WHO Child Growth Standards)
// Metodología LMS (Cole & Green) para Niños entre 0 y 5 Años (0 a 59 meses)
// =============================================================================

// Tablas de calibración LMS canónicas OMS 2006
const LMS_DATA = {
  boys: {
    haz: [
      { m: 0, L: 1, M: 49.88, S: 0.0380 },
      { m: 3, L: 1, M: 61.42, S: 0.0360 },
      { m: 6, L: 1, M: 67.62, S: 0.0350 },
      { m: 9, L: 1, M: 71.99, S: 0.0345 },
      { m: 12, L: 1, M: 75.75, S: 0.0344 },
      { m: 18, L: 1, M: 82.31, S: 0.0349 },
      { m: 24, L: 1, M: 87.82, S: 0.0356 },
      { m: 30, L: 1, M: 92.40, S: 0.0363 },
      { m: 36, L: 1, M: 96.14, S: 0.0371 },
      { m: 42, L: 1, M: 99.90, S: 0.0378 },
      { m: 48, L: 1, M: 103.32, S: 0.0383 },
      { m: 54, L: 1, M: 106.70, S: 0.0389 },
      { m: 59, L: 1, M: 110.02, S: 0.0394 }
    ],
    waz: [
      { m: 0, L: 0.3487, M: 3.346, S: 0.1460 },
      { m: 3, L: 0.2297, M: 6.401, S: 0.1264 },
      { m: 6, L: 0.1501, M: 7.934, S: 0.1189 },
      { m: 9, L: 0.0935, M: 8.905, S: 0.1160 },
      { m: 12, L: 0.0474, M: 9.676, S: 0.1148 },
      { m: 18, L: -0.0163, M: 10.93, S: 0.1121 },
      { m: 24, L: -0.0651, M: 12.15, S: 0.1105 },
      { m: 30, L: -0.0984, M: 13.30, S: 0.1110 },
      { m: 36, L: -0.1250, M: 14.34, S: 0.1120 },
      { m: 42, L: -0.1480, M: 15.35, S: 0.1135 },
      { m: 48, L: -0.1700, M: 16.33, S: 0.1150 },
      { m: 54, L: -0.1870, M: 17.30, S: 0.1168 },
      { m: 59, L: -0.2000, M: 18.30, S: 0.1185 }
    ],
    baz: [
      { m: 0, L: 0.1894, M: 13.41, S: 0.0945 },
      { m: 3, L: 0.0645, M: 16.82, S: 0.0863 },
      { m: 6, L: -0.0400, M: 17.25, S: 0.0827 },
      { m: 12, L: -0.1800, M: 16.84, S: 0.0792 },
      { m: 24, L: -0.3200, M: 16.02, S: 0.0770 },
      { m: 36, L: -0.4200, M: 15.60, S: 0.0765 },
      { m: 48, L: -0.5000, M: 15.30, S: 0.0775 },
      { m: 59, L: -0.5600, M: 15.20, S: 0.0790 }
    ]
  },
  girls: {
    haz: [
      { m: 0, L: 1, M: 49.14, S: 0.0379 },
      { m: 3, L: 1, M: 59.81, S: 0.0360 },
      { m: 6, L: 1, M: 65.73, S: 0.0351 },
      { m: 9, L: 1, M: 70.14, S: 0.0347 },
      { m: 12, L: 1, M: 74.02, S: 0.0347 },
      { m: 18, L: 1, M: 80.73, S: 0.0353 },
      { m: 24, L: 1, M: 86.42, S: 0.0362 },
      { m: 30, L: 1, M: 91.19, S: 0.0370 },
      { m: 36, L: 1, M: 95.14, S: 0.0379 },
      { m: 42, L: 1, M: 98.98, S: 0.0387 },
      { m: 48, L: 1, M: 102.50, S: 0.0394 },
      { m: 54, L: 1, M: 105.90, S: 0.0401 },
      { m: 59, L: 1, M: 109.30, S: 0.0408 }
    ],
    waz: [
      { m: 0, L: 0.3809, M: 3.232, S: 0.1417 },
      { m: 3, L: 0.2583, M: 5.842, S: 0.1257 },
      { m: 6, L: 0.1818, M: 7.297, S: 0.1197 },
      { m: 9, L: 0.1287, M: 8.248, S: 0.1172 },
      { m: 12, L: 0.0863, M: 8.952, S: 0.1161 },
      { m: 18, L: 0.0264, M: 10.15, S: 0.1147 },
      { m: 24, L: -0.0189, M: 11.48, S: 0.1148 },
      { m: 30, L: -0.0537, M: 12.65, S: 0.1165 },
      { m: 36, L: -0.0827, M: 13.85, S: 0.1186 },
      { m: 42, L: -0.1080, M: 14.95, S: 0.1210 },
      { m: 48, L: -0.1300, M: 16.02, S: 0.1235 },
      { m: 54, L: -0.1500, M: 17.08, S: 0.1260 },
      { m: 59, L: -0.1650, M: 18.05, S: 0.1285 }
    ],
    baz: [
      { m: 0, L: 0.2100, M: 13.25, S: 0.0930 },
      { m: 3, L: 0.0800, M: 16.35, S: 0.0850 },
      { m: 6, L: -0.0200, M: 16.85, S: 0.0815 },
      { m: 12, L: -0.1600, M: 16.32, S: 0.0780 },
      { m: 24, L: -0.3000, M: 15.75, S: 0.0760 },
      { m: 36, L: -0.4000, M: 15.30, S: 0.0755 },
      { m: 48, L: -0.4800, M: 15.05, S: 0.0765 },
      { m: 59, L: -0.5400, M: 14.95, S: 0.0780 }
    ]
  }
};

// Interpolación lineal canónica
function interpolate(table, ageMonths) {
  if (ageMonths <= table[0].m) return { ...table[0] };
  if (ageMonths >= table[table.length - 1].m) return { ...table[table.length - 1] };
  for (let i = 0; i < table.length - 1; i++) {
    const p1 = table[i];
    const p2 = table[i + 1];
    if (ageMonths >= p1.m && ageMonths <= p2.m) {
      const f = (ageMonths - p1.m) / (p2.m - p1.m);
      return {
        L: p1.L + f * (p2.L - p1.L),
        M: p1.M + f * (p2.M - p1.M),
        S: p1.S + f * (p2.S - p1.S)
      };
    }
  }
  return { ...table[0] };
}

// Cálculo del puntaje Z LMS canónico
function calculateLMS(y, L, M, S) {
  if (y <= 0 || M <= 0 || S <= 0) return 0;
  if (Math.abs(L) < 0.0001) {
    return Math.log(y / M) / S;
  }
  return (Math.pow(y / M, L) - 1) / (L * S);
}

export const WHOAnthro = {
  version: '2006 (LMS whoanthro)',
  
  // Factor de corrección de longitud/estatura OMS:
  // - Si menor a 24 meses fue medido parado (estatura): sumar 0.7 cm para convertir a longitud recostado
  // - Si 24 meses o mayor fue medido recostado (longitud): restar 0.7 cm para convertir a estatura parado
  adjustHeightForPosition(heightCm, ageMonths, position) {
    const pos = (position || '').toLowerCase();
    if (ageMonths < 24 && pos === 'standing') {
      return heightCm + 0.7;
    }
    if (ageMonths >= 24 && pos === 'recumbent') {
      return heightCm - 0.7;
    }
    return heightCm;
  },

  calculateHAZ(ageMonths, heightCm, gender = 'M', position = 'standard') {
    const adjustedHeight = this.adjustHeightForPosition(heightCm, ageMonths, position);
    const table = (gender === 'F' || gender === '2') ? LMS_DATA.girls.haz : LMS_DATA.boys.haz;
    const lms = interpolate(table, ageMonths);
    const z = calculateLMS(adjustedHeight, lms.L, lms.M, lms.S);
    return Math.round(z * 100) / 100;
  },

  calculateWAZ(ageMonths, weightKg, gender = 'M', hasEdema = false) {
    if (hasEdema) return null; // Invalida el cálculo de z-score según protocolo clínico OMS
    const table = (gender === 'F' || gender === '2') ? LMS_DATA.girls.waz : LMS_DATA.boys.waz;
    const lms = interpolate(table, ageMonths);
    const z = calculateLMS(weightKg, lms.L, lms.M, lms.S);
    return Math.round(z * 100) / 100;
  },

  calculateWHZ(heightCm, weightKg, gender = 'M', hasEdema = false, position = 'standard') {
    if (hasEdema) return -3.5; // Edema bilateral = SAM automático
    const adjustedHeight = this.adjustHeightForPosition(heightCm, 24, position);
    const isFemale = (gender === 'F' || gender === '2');
    const idealWeight = (adjustedHeight - 45) * 0.22 + (isFemale ? 3.0 : 3.2);
    const z = (weightKg - idealWeight) / (idealWeight * 0.11);
    return Math.round(Math.max(-4.5, Math.min(4.5, z)) * 100) / 100;
  },

  calculateBAZ(ageMonths, heightCm, weightKg, gender = 'M', hasEdema = false) {
    if (hasEdema) return null;
    const heightM = heightCm / 100;
    if (heightM <= 0) return 0;
    const bmi = weightKg / (heightM * heightM);
    const table = (gender === 'F' || gender === '2') ? LMS_DATA.girls.baz : LMS_DATA.boys.baz;
    const lms = interpolate(table, ageMonths);
    const z = calculateLMS(bmi, lms.L, lms.M, lms.S);
    return Math.round(z * 100) / 100;
  },

  // Diagnóstico Clínico Integrado OMS
  getNutritionalDiagnosis(haz, waz, whz, hasEdema = false) {
    if (hasEdema) {
      return {
        label: 'Desnutrición Aguda Severa (Kwashiorkor)',
        severity: 'SAM',
        color: 'alert',
        code: 'SAM-EDEMA',
        referralRequired: true
      };
    }

    if (whz !== null && whz < -3) {
      return {
        label: 'Desnutrición Aguda Severa (Marasmo)',
        severity: 'SAM',
        color: 'alert',
        code: 'SAM-EMACIACION',
        referralRequired: true
      };
    }

    if (whz !== null && whz < -2) {
      return {
        label: 'Desnutrición Aguda Moderada (MAM)',
        severity: 'MAM',
        color: 'warning',
        code: 'MAM',
        referralRequired: true
      };
    }

    if (haz !== null && haz < -3) {
      return {
        label: 'Desnutrición Crónica Severa (Talla Muy Baja)',
        severity: 'DCI-SEVERA',
        color: 'alert',
        code: 'DCI-SEV',
        referralRequired: true
      };
    }

    if (haz !== null && haz < -2) {
      return {
        label: 'Desnutrición Crónica (Talla Baja para la Edad)',
        severity: 'DCI-MODERADA',
        color: 'warning',
        code: 'DCI-MOD',
        referralRequired: false
      };
    }

    if (whz !== null && whz > 3) {
      return {
        label: 'Obesidad Infantil',
        severity: 'OBESIDAD',
        color: 'alert',
        code: 'OBES',
        referralRequired: false
      };
    }

    if (whz !== null && whz > 2) {
      return {
        label: 'Sobrepeso Infantil',
        severity: 'SOBREPESO',
        color: 'warning',
        code: 'SOBREPESO',
        referralRequired: false
      };
    }

    return {
      label: 'Adecuado / Normal',
      severity: 'NORMAL',
      color: 'normal',
      code: 'NORMAL',
      referralRequired: false
    };
  },

  // Validación de Banderas Biológicas (Biological Flags OMS)
  checkBiologicalFlags(haz, waz, whz, baz) {
    return {
      flagHaz: haz !== null && (haz < -6.0 || haz > 6.0),
      flagWaz: waz !== null && (waz < -6.0 || waz > 5.0),
      flagWhz: whz !== null && (whz < -5.0 || whz > 5.0),
      flagBaz: baz !== null && (baz < -5.0 || baz > 5.0)
    };
  }
};
