import React from 'react';
import { Printer, X, AlertTriangle } from 'lucide-react';

export function ReferralSheetModal({ child, onClose }) {
  if (!child) return null;

  const todayStr = new Date().toLocaleDateString('es-EC', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  const isSam = child.hasEdema || (child.whz !== null && child.whz < -3);
  const hazFormatted = child.haz !== null && child.haz !== undefined ? `${child.haz} DE` : '--';
  const whzFormatted = child.whz !== null && child.whz !== undefined ? `${child.whz} DE` : '--';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm print:p-0 print:bg-white">
      {/* Contenedor Ficha Oficial 760px */}
      <div className="bg-white rounded-2xl max-w-[760px] w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 print:max-h-none print:shadow-none print:border-none print:rounded-none">
        
        {/* Header Oficial Azul Marino #002B49 */}
        <div className="bg-[#002B49] text-white px-7 py-5 flex items-center justify-between print:px-4 print:py-3">
          <div>
            <div className="text-[11px] font-bold tracking-wider text-blue-200 uppercase">
              MINISTERIO DE SALUD PÚBLICA • DISTRITO 06D04 GUANO-PENIPE
            </div>
            <h2 className="text-lg font-extrabold text-white mt-0.5 tracking-tight">
              Ficha Oficial de Referencia &amp; Triaje Nutricional Prioritario
            </h2>
            <div className="text-xs text-slate-200 mt-0.5">
              Destino: <strong>Centro de Salud San Andrés Tipo B</strong> • Convenio ESPOCH - Ayuda en Acción
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg print:hidden transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cuerpo Imprimible de la Ficha */}
        <div className="p-7 overflow-y-auto flex-1 text-xs text-[#1F1F1F] leading-relaxed print:p-4 print:overflow-visible">
          
          {/* Subcabecera Operativo y Código Rojo */}
          <div className="border-b-2 border-[#002B49] pb-3 mb-4 flex items-center justify-between flex-wrap gap-2">
            <div>
              <div className="text-sm font-bold text-[#002B49]">OPERATIVO DCI SAN ANDRÉS (COMPONENTE A.3.1)</div>
              <div className="text-xs text-slate-500">Fecha de Emisión: <strong>{todayStr}</strong></div>
            </div>
            <div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FEE2E2] text-[#991B1B] border border-[#F87171] font-extrabold text-[11px] tracking-wide">
                <AlertTriangle className="w-3.5 h-3.5 text-[#991B1B]" />
                CÓDIGO ROJO — PRIORIDAD 1
              </span>
            </div>
          </div>

          {/* Sección 1: Identificación del Sujeto de Atención */}
          <div className="mb-4 bg-[#F8F9FA] p-4 rounded-xl border border-[#E0E2EC]">
            <div className="font-bold text-[#002B49] text-xs uppercase tracking-wider mb-2.5">
              1. Identificación del Sujeto de Atención
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Código de Sujeto / Nombre Completo:</span>
                <strong className="text-slate-900 font-bold">{child.subjectCode || 'SA-CEN-001'} — {child.name}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Edad Cronológica / Sexo:</span>
                <strong className="text-slate-900 font-bold">{child.ageMonths} meses cumplidos • {child.gender === 'F' ? 'Femenino' : 'Masculino'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Comunidad / Cuadrante PDOT:</span>
                <strong className="text-slate-900 font-bold">{child.community} ({child.sector || 'Sector A'})</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Nombre del Tutor / Madre:</span>
                <strong className="text-slate-900 font-bold">{child.tutorName || 'Representante Legal Acreditado'}</strong>
              </div>
            </div>
          </div>

          {/* Sección 2: Banderas Rojas y Hallazgos Antropométricos (SECA 874 / 417) */}
          <div className="mb-4 bg-[#FFFBFB] p-4 rounded-xl border border-[#FCA5A5]">
            <div className="font-bold text-[#991B1B] text-xs uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>2. Banderas Rojas y Hallazgos Antropométricos (SECA 874 / 417)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <div className="bg-white p-3 rounded-lg border border-[#FECACA]">
                <span className="text-slate-500 text-[10px] block uppercase font-semibold">Z-Score Talla/Edad (HAZ)</span>
                <div className="text-base font-extrabold text-rose-600 mt-0.5">{hazFormatted}</div>
                <span className="text-[10px] text-rose-600 font-semibold block mt-0.5">
                  {child.haz < -3 ? 'Talla Baja Severa (DCI)' : (child.haz < -2 ? 'Talla Baja Moderada' : 'Normal')}
                </span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-[#FECACA]">
                <span className="text-slate-500 text-[10px] block uppercase font-semibold">Z-Score Peso/Talla (WHZ)</span>
                <div className="text-base font-extrabold text-rose-600 mt-0.5">{whzFormatted}</div>
                <span className="text-[10px] text-rose-600 font-semibold block mt-0.5">
                  {child.whz < -3 ? 'Emaciación Severa (SAM)' : (child.whz < -2 ? 'Emaciación Moderada (MAM)' : 'Adecuado')}
                </span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-[#FECACA]">
                <span className="text-slate-500 text-[10px] block uppercase font-semibold">Edema Bilateral Clínico</span>
                <div className="text-base font-extrabold text-slate-800 mt-0.5">
                  {child.hasEdema ? 'POSITIVO (Fóvea +)' : 'Negativo (0)'}
                </div>
                <span className={`text-[10px] font-semibold block mt-0.5 ${child.hasEdema ? 'text-rose-600' : 'text-slate-500'}`}>
                  {child.hasEdema ? 'Kwashiorkor / Urgencia' : 'Sin fóvea maleolar'}
                </span>
              </div>
            </div>

            <div className="p-3 bg-white/80 rounded-lg border border-rose-100 text-xs text-[#7F1D1D] leading-relaxed">
              <strong>Diagnóstico Presuntivo de Terreno: </strong> 
              {isSam 
                ? 'Desnutrición Aguda Severa (SAM) sobre Desnutrición Crónica reagudizada con riesgo metabólico inminente. Requiere valoración médica integral inmediata, prueba de apetito con RUTF y exámenes de laboratorio urgentes en C.S. San Andrés Tipo B.'
                : 'Desnutrición Crónica Infantil (DCI / Talla Baja) con riesgo de descompensación aguda. Requiere control pediátrico, tamizaje de anemia y seguimiento integral.'
              }
              <div className="mt-1 font-semibold text-rose-800">
                Código CIE-10 Sugerido: <strong>{isSam ? 'E43 (Desnutrición proteicocalórica severa no especificada)' : 'E45 (Retraso del desarrollo debido a desnutrición proteicocalórica)'}</strong>
              </div>
            </div>
          </div>

          {/* Sección 3: Datos de la Dupla Evaluadora */}
          <div className="mb-4 bg-[#F8F9FA] p-4 rounded-xl border border-[#E0E2EC]">
            <div className="font-bold text-[#002B49] text-xs uppercase tracking-wider mb-2">
              3. Profesionales Evaluadores en Terreno
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
              <div><strong>Dupla Evaluadora:</strong> {child.dupla || 'Dupla D01 (Nutrición ESPOCH)'}</div>
              <div><strong>Balanza SECA 874:</strong> Calibrada hoy (Dif: &le; 50g)</div>
              <div><strong>Docente Supervisor:</strong> ND. Verónica Delgado López</div>
            </div>
          </div>

          {/* Firmas Médico-Legales */}
          <div className="grid grid-cols-2 gap-8 mt-6 pt-4 border-t border-dashed border-slate-300 text-center">
            <div>
              <div className="border-b border-[#1F1F1F] h-10 mb-1 mx-6"></div>
              <div className="font-bold text-[#1F1F1F] text-xs">Firma del Encuestador / Dupla ESPOCH</div>
              <div className="text-[10px] text-slate-500">C.I. Registrada en Plataforma DCI</div>
            </div>
            <div>
              <div className="border-b border-[#1F1F1F] h-10 mb-1 mx-6"></div>
              <div className="font-bold text-[#1F1F1F] text-xs">Sello y Firma C.S. San Andrés Tipo B</div>
              <div className="text-[10px] text-slate-500">Médico / Enfermero Receptor MSP</div>
            </div>
          </div>

        </div>

        {/* Footer del Modal con Acciones */}
        <div className="bg-[#F8F9FA] px-7 py-4 border-t border-[#E0E2EC] flex items-center justify-between print:hidden">
          <span className="text-xs text-slate-500">
            Documento médico-legal válido para contrarreferencia MSP
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="py-2.5 px-5 bg-[#002B49] hover:bg-[#003860] text-white font-semibold rounded-full text-xs transition-all shadow-sm flex items-center gap-2"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Ficha de Derivación</span>
            </button>
            <button
              onClick={onClose}
              className="py-2.5 px-4 bg-white hover:bg-slate-100 border border-[#C4C7C5] text-[#1F1F1F] font-semibold rounded-full text-xs transition-all"
            >
              Cerrar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ReferralSheetModal;
