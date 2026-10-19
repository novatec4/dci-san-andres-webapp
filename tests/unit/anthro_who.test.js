// =============================================================================
// ANTHRO_WHO.TEST.JS - Suite de Pruebas Unitarias del Motor Antropométrico OMS
// Valida z-scores LMS, ajuste de ±0.7 cm, edema, flags y TEM
// =============================================================================

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

// Cargar el módulo WHOAnthro
const WHOAnthro = require(path.join(__dirname, '../../app/js/anthro_who.js'));

test('WHOAnthro Engine: Versión y metadatos del proyecto', () => {
  assert.equal(WHOAnthro.version, '2.3.5');
  assert.match(WHOAnthro.targetPopulation, /0 y 5 años/i);
});

test('WHOAnthro: Validación de rango etario (0 a 59 meses cumplidos)', () => {
  // Edad válida: 24 meses
  const valid = WHOAnthro.calculateZScores({ ageMonths: 24, heightCm: 87.8, weightKg: 12.1, sex: 'M' });
  assert.equal(valid.isValidAge, true);

  // Edad inválida: 60 meses (5 años cumplidos fuera del rango 0-59m)
  const invalidOver = WHOAnthro.calculateZScores({ ageMonths: 60, heightCm: 110, weightKg: 18, sex: 'M' });
  assert.equal(invalidOver.isValidAge, false);
  assert.match(invalidOver.error, /fuera del rango/i);

  // Edad negativa
  const invalidNeg = WHOAnthro.calculateZScores({ ageMonths: -1, heightCm: 50, weightKg: 3.5, sex: 'M' });
  assert.equal(invalidNeg.isValidAge, false);
});

test('WHOAnthro: Cálculo de Z-Score Mediana Exacta (Z ≈ 0.00 DE)', () => {
  // Niño varón de 12 meses con talla 75.75 cm y peso 9.68 kg (Medianas exactas OMS)
  const result = WHOAnthro.calculateZScores({
    ageMonths: 12,
    heightCm: 75.75,
    weightKg: 9.68,
    sex: 'M'
  });

  assert.equal(result.isValidAge, true);
  assert.ok(Math.abs(result.haz) <= 0.05, `HAZ esperado ~0, obtenido ${result.haz}`);
  assert.ok(Math.abs(result.waz) <= 0.05, `WAZ esperado ~0, obtenido ${result.waz}`);
  assert.equal(result.isDCI, false);
  assert.equal(result.nutritionalStatus, 'Normal');
});

test('WHOAnthro: Diagnóstico de Desnutrición Crónica Infantil (DCI - Talla Baja)', () => {
  // Niño varón de 24 meses: mediana OMS es 87.8 cm. Una talla de 80.0 cm da Z < -2.0 DE (DCI)
  const modDCI = WHOAnthro.calculateZScores({
    ageMonths: 24,
    heightCm: 81.0,
    weightKg: 10.5,
    sex: 'M'
  });
  assert.equal(modDCI.isDCI, true);
  assert.equal(modDCI.isSevereDCI, false);
  assert.equal(modDCI.nutritionalStatus, 'Desnutrición Crónica Moderada');

  // Talla severamente baja (< -3.0 DE): 77.0 cm a los 24 meses
  const sevDCI = WHOAnthro.calculateZScores({
    ageMonths: 24,
    heightCm: 77.0,
    weightKg: 9.0,
    sex: 'M'
  });
  assert.equal(sevDCI.isDCI, true);
  assert.equal(sevDCI.isSevereDCI, true);
  assert.match(sevDCI.nutritionalStatus, /Severa/i);
});

test('WHOAnthro: Factor de Corrección Canónico OMS por Posición de Medición (±0.7 cm)', () => {
  // 1. Niño < 24 meses medido DE PIE: debe sumarse +0.7 cm
  const under24Standing = WHOAnthro.calculateZScores({
    ageMonths: 18,
    heightCm: 81.0,
    weightKg: 10.5,
    sex: 'M',
    measuredStanding: true
  });
  assert.equal(under24Standing.positionCorrectionApplied, 0.7);
  assert.equal(under24Standing.adjustedHeight, 81.7);

  // 2. Niño >= 24 meses medido ACOSTADO: debe restarse -0.7 cm
  const over24Recumbent = WHOAnthro.calculateZScores({
    ageMonths: 36,
    heightCm: 96.0,
    weightKg: 14.0,
    sex: 'M',
    measuredStanding: false
  });
  assert.equal(over24Recumbent.positionCorrectionApplied, -0.7);
  assert.equal(over24Recumbent.adjustedHeight, 95.3);
});

test('WHOAnthro: Protocolo Clínico de Edema Bilateral Nutricional (SAM / Kwashiorkor)', () => {
  // Con edema = 'y', se clasifica como SAM y WAZ/WHZ/BAZ quedan invalidados (null)
  const edemaResult = WHOAnthro.calculateZScores({
    ageMonths: 24,
    heightCm: 85.0,
    weightKg: 12.0,
    sex: 'M',
    oedema: 'y'
  });

  assert.equal(edemaResult.hasOedema, true);
  assert.equal(edemaResult.isSAM, true);
  assert.equal(edemaResult.waz, null);
  assert.equal(edemaResult.baz, null);
  assert.equal(edemaResult.whz, null);
  assert.ok(edemaResult.haz !== null, 'HAZ sí se calcula a pesar del edema');
  assert.match(edemaResult.nutritionalStatus, /Edema/i);
});

test('WHOAnthro: Banderas de Plausibilidad Biológica OMS (Biological Flags)', () => {
  // Valor absurdo: Talla 40 cm a los 48 meses (HAZ < -6.0)
  const flagResult = WHOAnthro.calculateZScores({
    ageMonths: 48,
    heightCm: 40.0,
    weightKg: 15.0,
    sex: 'M'
  });

  assert.equal(flagResult.flags.flagHAZ, true);
  assert.equal(flagResult.isBiologicallyPlausible, false);
});

test('WHOAnthro: Cálculo y Certificación del Error Técnico de Medición (TEM)', () => {
  // Mediciones pareadas duplicadas con alta concordancia (diferencias <= 0.3 cm)
  const measurements = [
    { m1: 85.2, m2: 85.4 },
    { m1: 90.1, m2: 90.0 },
    { m1: 76.5, m2: 76.4 },
    { m1: 82.0, m2: 82.2 },
    { m1: 88.5, m2: 88.6 }
  ];

  const tem = WHOAnthro.calculateTEM(measurements);
  assert.equal(tem.N, 5);
  assert.ok(tem.absoluteTEM > 0, 'TEM absoluto debe ser positivo');
  assert.ok(tem.relativeTEM < 1.0, `TEM relativo esperado < 1%, obtenido ${tem.relativeTEM}%`);
  assert.equal(tem.isCertified, true, 'Debe cumplir umbral de certificación (%TEM <= 1.5%)');
});
