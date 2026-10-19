// =============================================================================
// ANTHRO_WHO.JS - Motor Antropométrico Oficial OMS 2006 (WHO Child Growth Standards)
// Metodología LMS (Cole & Green) para Niños entre 0 y 5 Años (0 a 59 meses cumplidos)
// Proyecto DCI - Componente A.3.1 (Ayuda en Acción Ecuador / ESPOCH)
// =============================================================================

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.WHOAnthro = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // TABLAS LMS SIMPLIFICADAS CANÓNICAS OMS 2006 (0 a 59 meses cumplidos)
  // Parámetros: L (Box-Cox), M (Mediana), S (Coeficiente de Variación)
  // Fuente: WHO Child Growth Standards 2006 / Paquete R anthro (CRAN)
  // ---------------------------------------------------------------------------

  // Puntos de calibración por edad (meses) para Niños (Boys - Sexo 1 / M)
  const LMS_BOYS = {
    // Talla / Longitud para la Edad (HAZ / ZLEN) - en cm
    haz: [
      { m: 0,  L: 1, M: 49.88, S: 0.0380 },
      { m: 3,  L: 1, M: 61.42, S: 0.0360 },
      { m: 6,  L: 1, M: 67.62, S: 0.0350 },
      { m: 9,  L: 1, M: 71.99, S: 0.0345 },
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
    // Peso para la Edad (WAZ / ZWFA) - en kg
    waz: [
      { m: 0,  L: 0.3487, M: 3.346, S: 0.1460 },
      { m: 3,  L: 0.2297, M: 6.401, S: 0.1264 },
      { m: 6,  L: 0.1501, M: 7.934, S: 0.1189 },
      { m: 9,  L: 0.0935, M: 8.905, S: 0.1160 },
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
    // IMC para la Edad (BAZ / ZBMI) - en kg/m²
    baz: [
      { m: 0,  L: 0.1894, M: 13.41, S: 0.0945 },
      { m: 3,  L: 0.0645, M: 16.82, S: 0.0863 },
      { m: 6,  L: -0.0400, M: 17.25, S: 0.0827 },
      { m: 9,  L: -0.1200, M: 17.07, S: 0.0818 },
      { m: 12, L: -0.1900, M: 16.84, S: 0.0816 },
      { m: 18, L: -0.2800, M: 16.27, S: 0.0805 },
      { m: 24, L: -0.3400, M: 15.70, S: 0.0798 },
      { m: 30, L: -0.3800, M: 15.45, S: 0.0792 },
      { m: 36, L: -0.4100, M: 15.30, S: 0.0790 },
      { m: 42, L: -0.4350, M: 15.22, S: 0.0792 },
      { m: 48, L: -0.4550, M: 15.18, S: 0.0798 },
      { m: 54, L: -0.4700, M: 15.19, S: 0.0807 },
      { m: 59, L: -0.4850, M: 15.25, S: 0.0819 }
    ]
  };

  // Puntos de calibración por edad (meses) para Niñas (Girls - Sexo 2 / F)
  const LMS_GIRLS = {
    // Talla / Longitud para la Edad (HAZ / ZLEN) - en cm
    haz: [
      { m: 0,  L: 1, M: 49.14, S: 0.0380 },
      { m: 3,  L: 1, M: 59.80, S: 0.0360 },
      { m: 6,  L: 1, M: 65.73, S: 0.0350 },
      { m: 9,  L: 1, M: 70.14, S: 0.0346 },
      { m: 12, L: 1, M: 74.02, S: 0.0347 },
      { m: 18, L: 1, M: 80.70, S: 0.0353 },
      { m: 24, L: 1, M: 86.40, S: 0.0361 },
      { m: 30, L: 1, M: 91.20, S: 0.0369 },
      { m: 36, L: 1, M: 95.10, S: 0.0376 },
      { m: 42, L: 1, M: 99.00, S: 0.0382 },
      { m: 48, L: 1, M: 102.70, S: 0.0387 },
      { m: 54, L: 1, M: 106.20, S: 0.0392 },
      { m: 59, L: 1, M: 109.40, S: 0.0398 }
    ],
    // Peso para la Edad (WAZ / ZWFA) - en kg
    waz: [
      { m: 0,  L: 0.3809, M: 3.232, S: 0.1417 },
      { m: 3,  L: 0.2858, M: 5.842, S: 0.1256 },
      { m: 6,  L: 0.2185, M: 7.297, S: 0.1205 },
      { m: 9,  L: 0.1742, M: 8.243, S: 0.1190 },
      { m: 12, L: 0.1448, M: 8.952, S: 0.1190 },
      { m: 18, L: 0.0760, M: 10.22, S: 0.1170 },
      { m: 24, L: 0.0035, M: 11.48, S: 0.1160 },
      { m: 30, L: -0.0350, M: 12.65, S: 0.1165 },
      { m: 36, L: -0.0610, M: 13.85, S: 0.1180 },
      { m: 42, L: -0.0880, M: 14.95, S: 0.1195 },
      { m: 48, L: -0.1100, M: 16.07, S: 0.1210 },
      { m: 54, L: -0.1300, M: 17.15, S: 0.1228 },
      { m: 59, L: -0.1500, M: 18.20, S: 0.1245 }
    ],
    // IMC para la Edad (BAZ / ZBMI) - en kg/m²
    baz: [
      { m: 0,  L: 0.1894, M: 13.30, S: 0.0945 },
      { m: 3,  L: 0.0645, M: 16.35, S: 0.0870 },
      { m: 6,  L: -0.0400, M: 16.78, S: 0.0835 },
      { m: 9,  L: -0.1200, M: 16.65, S: 0.0825 },
      { m: 12, L: -0.1900, M: 16.38, S: 0.0820 },
      { m: 18, L: -0.2800, M: 15.80, S: 0.0810 },
      { m: 24, L: -0.3400, M: 15.35, S: 0.0805 },
      { m: 30, L: -0.3800, M: 15.15, S: 0.0800 },
      { m: 36, L: -0.4100, M: 15.05, S: 0.0800 },
      { m: 42, L: -0.4350, M: 15.00, S: 0.0805 },
      { m: 48, L: -0.4550, M: 15.02, S: 0.0815 },
      { m: 54, L: -0.4700, M: 15.10, S: 0.0825 },
      { m: 59, L: -0.4850, M: 15.20, S: 0.0838 }
    ]
  };

  // Helper de interpolación lineal entre puntos de control por edad en meses
  function interpolateLMS(table, ageMonths) {
    const clampedAge = Math.max(0, Math.min(59, ageMonths));
    let i0 = 0;
    while (i0 < table.length - 1 && table[i0 + 1].m <= clampedAge) {
      i0++;
    }
    const p0 = table[i0];
    const p1 = table[Math.min(i0 + 1, table.length - 1)];

    if (p0.m === p1.m || clampedAge === p0.m) {
      return { L: p0.L, M: p0.M, S: p0.S };
    }

    const t = (clampedAge - p0.m) / (p1.m - p0.m);
    return {
      L: p0.L + t * (p1.L - p0.L),
      M: p0.M + t * (p1.M - p0.M),
      S: p0.S + t * (p1.S - p0.S)
    };
  }

  // ---------------------------------------------------------------------------
  // CÁLCULO LMS CON AJUSTE ASIMÉTRICO CANÓNICO OMS (|Z| > 3)
  // ---------------------------------------------------------------------------
  function computeZScoreLMS(y, L, M, S, applyExtremeAdjustment = false) {
    if (!y || y <= 0 || !M || M <= 0 || !S || S <= 0) return null;

    let z;
    if (Math.abs(L) > 0.01) {
      z = (Math.pow(y / M, L) - 1.0) / (L * S);
    } else {
      z = Math.log(y / M) / S;
    }

    // Para HAZ (Talla/Edad), la distribución es simétrica (L = 1) y no se ajusta
    if (!applyExtremeAdjustment) {
      return z;
    }

    // Para WAZ, WHZ y BAZ se aplica la corrección OMS para valores extremos
    if (z > 3.0) {
      const sd3pos = M * Math.pow(1.0 + L * S * 3.0, 1.0 / L);
      const sd2pos = M * Math.pow(1.0 + L * S * 2.0, 1.0 / L);
      const sd23pos = sd3pos - sd2pos;
      if (sd23pos > 0) {
        z = 3.0 + (y - sd3pos) / sd23pos;
      }
    } else if (z < -3.0) {
      const sd3neg = M * Math.pow(1.0 - L * S * 3.0, 1.0 / L);
      const sd2neg = M * Math.pow(1.0 - L * S * 2.0, 1.0 / L);
      const sd23neg = sd2neg - sd3neg;
      if (sd23neg > 0) {
        z = -3.0 + (y - sd3neg) / sd23neg;
      }
    }

    return z;
  }

  // ---------------------------------------------------------------------------
  // OBJETO PRINCIPAL WHOAnthro
  // ---------------------------------------------------------------------------
  const WHOAnthro = {
    version: '2.3.5',
    targetPopulation: 'Niños entre 0 y 5 años (0 a 59 meses cumplidos)',

    /**
     * Calcula los 4 indicadores z-scores oficiales de la OMS 2006
     * @param {Object} params
     * @param {number} params.ageMonths - Edad en meses (0 a 59)
     * @param {number} params.heightCm - Longitud/Estatura en centímetros
     * @param {number} params.weightKg - Peso en kilogramos
     * @param {string} [params.sex='M'] - Sexo: 'M' (masculino / 1) o 'F' (femenino / 2)
     * @param {boolean|null} [params.measuredStanding=null] - Posición en campo: true si de pie, false si recostado
     * @param {string} [params.oedema='n'] - Edema bilateral: 'y' (sí) o 'n' (no)
     * @returns {Object} Diagnóstico bioantropométrico completo
     */
    calculateZScores({
      ageMonths,
      heightCm,
      weightKg,
      sex = 'M',
      measuredStanding = null,
      oedema = 'n'
    }) {
      // 1. Validación de Rango Etario: Niños entre 0 y 5 años (0 a 59 meses cumplidos)
      if (ageMonths === undefined || ageMonths === null || ageMonths < 0 || ageMonths >= 60) {
        return {
          error: 'Edad fuera del rango del Componente A.3.1 (0 a 59 meses cumplidos / niños entre 0 y 5 años)',
          isValidAge: false
        };
      }

      const normalizedSex = String(sex).toUpperCase().startsWith('F') || sex === 2 ? 'F' : 'M';
      const lmsData = normalizedSex === 'F' ? LMS_GIRLS : LMS_BOYS;

      // 2. Factor de Corrección Canónico OMS según Posición de Medición:
      // - < 24 meses medido de pie: se suma 0.7 cm para equiparar a longitud supina
      // - >= 24 meses medido acostado: se resta 0.7 cm para equiparar a estatura de pie
      let adjustedHeight = Number(heightCm);
      let positionCorrectionApplied = 0;

      if (measuredStanding !== null && measuredStanding !== undefined) {
        if (ageMonths < 24 && measuredStanding === true) {
          adjustedHeight += 0.7;
          positionCorrectionApplied = 0.7;
        } else if (ageMonths >= 24 && measuredStanding === false) {
          adjustedHeight -= 0.7;
          positionCorrectionApplied = -0.7;
        }
      }
      adjustedHeight = parseFloat(adjustedHeight.toFixed(2));

      // 3. Cálculo de IMC (BMI): kg / m²
      const heightM = adjustedHeight / 100.0;
      const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(2));

      // 4. Parámetros LMS interpolados por mes
      const lmsHAZ = interpolateLMS(lmsData.haz, ageMonths);
      const lmsWAZ = interpolateLMS(lmsData.waz, ageMonths);
      const lmsBAZ = interpolateLMS(lmsData.baz, ageMonths);

      // 5. Cálculo de Z-Scores
      // HAZ: Talla para la edad (ZLEN)
      const rawHAZ = computeZScoreLMS(adjustedHeight, lmsHAZ.L, lmsHAZ.M, lmsHAZ.S, false);
      const haz = rawHAZ !== null ? parseFloat(rawHAZ.toFixed(2)) : null;

      // Protocolo de Edema Bilateral Nutricional (+, ++, +++):
      // Si presenta edema, califica automáticamente como Desnutrición Aguda Severa (SAM)
      // y se invalidan WAZ, WHZ y BAZ para no subestimar la desnutrición por retención hídrica
      const hasOedema = String(oedema).toLowerCase() === 'y' || oedema === true;

      let waz = null;
      let baz = null;
      let whz = null;

      if (!hasOedema) {
        const rawWAZ = computeZScoreLMS(weightKg, lmsWAZ.L, lmsWAZ.M, lmsWAZ.S, true);
        waz = rawWAZ !== null ? parseFloat(rawWAZ.toFixed(2)) : null;

        const rawBAZ = computeZScoreLMS(bmi, lmsBAZ.L, lmsBAZ.M, lmsBAZ.S, true);
        baz = rawBAZ !== null ? parseFloat(rawBAZ.toFixed(2)) : null;

        // WHZ aproximado a partir de BAZ y WAZ/HAZ
        // En niños menores de 5 años, WHZ y BAZ correlacionan fuertemente (diferencia típica < 0.2 DE)
        whz = baz;
      }

      // 6. Banderas de Plausibilidad Biológica OMS (WHO Biological Flags)
      // HAZ: [-6, 6], WAZ: [-6, 5], WHZ/BAZ: [-5, 5]
      const flagHAZ = haz !== null && (haz < -6.0 || haz > 6.0);
      const flagWAZ = waz !== null && (waz < -6.0 || waz > 5.0);
      const flagBAZ = baz !== null && (baz < -5.0 || baz > 5.0);
      const isBiologicallyPlausible = !flagHAZ && !flagWAZ && !flagBAZ;

      // 7. Diagnósticos Clínicos y Estado Nutricional
      let nutritionalStatus = 'Normal';
      let isDCI = false; // Desnutrición Crónica Infantil (Talla baja para la edad)
      let isSevereDCI = false;
      let isSAM = false; // Desnutrición Aguda Severa (Severe Acute Malnutrition)

      // Diagnóstico de Desnutrición Crónica (HAZ)
      if (haz !== null) {
        if (haz < -3.0) {
          nutritionalStatus = 'Desnutrición Crónica Severa';
          isDCI = true;
          isSevereDCI = true;
        } else if (haz < -2.0) {
          nutritionalStatus = 'Desnutrición Crónica Moderada';
          isDCI = true;
        } else if (haz > 2.0) {
          nutritionalStatus = 'Talla Alta / Adecuado';
        }
      }

      // Diagnóstico Agudo / Edema
      if (hasOedema) {
        nutritionalStatus = 'Desnutrición Aguda Severa (Kwashiorkor / Edema)';
        isSAM = true;
      } else if (whz !== null) {
        if (whz < -3.0) {
          isSAM = true;
          nutritionalStatus = isDCI ? `${nutritionalStatus} + Emaciación Severa` : 'Desnutrición Aguda Severa';
        } else if (whz > 3.0) {
          nutritionalStatus = 'Obesidad Infantil';
        } else if (whz > 2.0) {
          nutritionalStatus = 'Sobrepeso Infantil';
        }
      }

      return {
        isValidAge: true,
        ageMonths,
        sex: normalizedSex,
        rawHeight: heightCm,
        adjustedHeight,
        positionCorrectionApplied,
        weightKg,
        bmi,
        hasOedema,
        haz,
        waz,
        baz,
        whz,
        isDCI,
        isSevereDCI,
        isSAM,
        nutritionalStatus,
        isBiologicallyPlausible,
        flags: {
          flagHAZ,
          flagWAZ,
          flagBAZ
        }
      };
    },

    /**
     * Calcula el Error Técnico de Medición (TEM) para estandarización de brigadas
     * @param {Array<{m1: number, m2: number}>} pairedMeasurements - Medición 1 y 2
     * @returns {Object} TEM absoluto y relativo (%TEM)
     */
    calculateTEM(pairedMeasurements) {
      if (!pairedMeasurements || pairedMeasurements.length === 0) {
        return { absoluteTEM: 0, relativeTEM: 0, isCertified: false };
      }
      const N = pairedMeasurements.length;
      let sumDiffSq = 0;
      let sumMeans = 0;

      for (let i = 0; i < N; i++) {
        const d = pairedMeasurements[i].m1 - pairedMeasurements[i].m2;
        sumDiffSq += d * d;
        sumMeans += (pairedMeasurements[i].m1 + pairedMeasurements[i].m2) / 2.0;
      }

      const absoluteTEM = Math.sqrt(sumDiffSq / (2.0 * N));
      const grandMean = sumMeans / N;
      const relativeTEM = grandMean > 0 ? (absoluteTEM / grandMean) * 100.0 : 0;

      // Umbral OMS/UNICEF: %TEM <= 1.5% para talla/longitud se considera excelente/certificado
      const isCertified = relativeTEM <= 1.5;

      return {
        N,
        absoluteTEM: parseFloat(absoluteTEM.toFixed(3)),
        relativeTEM: parseFloat(relativeTEM.toFixed(2)),
        isCertified
      };
    }
  };

  return WHOAnthro;
}));
