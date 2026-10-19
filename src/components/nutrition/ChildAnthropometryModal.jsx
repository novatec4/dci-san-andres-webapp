import React from 'react';
import { X, Activity, AlertTriangle, CheckCircle2, Ruler, Scale, Printer } from 'lucide-react';
import { WHOAnthro } from '../../services/whoanthro';

export function ChildAnthropometryModal({ child, onClose, onGenerateReferral }) {
  if (!child) return null;

  const { haz, waz, whz, baz, diagnosis, hasEdema } = child;
  const isSam = diagnosis?.severity === 'SAM' || hasEdema;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Cabecera del Modal */}
        <div className="bg-[#002B49] text-white p-5 flex items-center justify-between border-b-2 border-[#E8734A]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-200">
                {child.subjectCode || child.id}
              </span>
              <span className="text-xs text-slate-300">
                {child.community} • {child.sector}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Ficha Antropométrica Individual OMS
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido Clínico */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Datos Generales */}
          <div className="grid grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block">Sujeto / Nombre:</span>
              <strong className="text-slate-800 text-sm">{child.name}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Edad en Meses:</span>
              <strong className="text-slate-800 text-sm">{child.ageMonths} meses</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Sexo:</span>
              <strong className="text-slate-800 text-sm">{child.gender === 'F' ? 'Femenino' : 'Masculino'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Posición de Medición:</span>
              <strong className="text-slate-800 text-sm">
                {child.position === 'recumbent' ? 'Recostado' : 'Parado'}
              </strong>
            </div>
          </div>

          {/* Mediciones de Campo */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-50 text-blue-700">
                <Ruler className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Talla / Longitud:</span>
                <span className="text-lg font-bold text-slate-800">{child.heightCm} cm</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-700">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Peso Corporal:</span>
                <span className="text-lg font-bold text-slate-800">{child.weightKg} kg</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ${hasEdema ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Edema Bilateral:</span>
                <span className={`text-sm font-bold ${hasEdema ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {hasEdema ? 'PRESENTE (Kwashiorkor)' : 'Ausente (Negativo)'}
                </span>
              </div>
            </div>
          </div>

          {/* Puntajes Z-Score OMS (LMS whoanthro) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
              Indicadores Antropométricos OMS 2006 (Puntajes Z)
            </h4>
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <span className="text-[11px] font-semibold text-slate-500 block">T/E (HAZ)</span>
                <span className={`text-base font-extrabold ${haz < -2 ? 'text-rose-600' : 'text-slate-800'}`}>
                  {haz !== null ? `${haz} DE` : '--'}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Talla para la Edad</span>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <span className="text-[11px] font-semibold text-slate-500 block">P/E (WAZ)</span>
                <span className={`text-base font-extrabold ${waz < -2 ? 'text-amber-600' : 'text-slate-800'}`}>
                  {waz !== null ? `${waz} DE` : (hasEdema ? 'Inválido' : '--')}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Peso para la Edad</span>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <span className="text-[11px] font-semibold text-slate-500 block">P/T (WHZ)</span>
                <span className={`text-base font-extrabold ${whz < -2 ? 'text-rose-600' : 'text-slate-800'}`}>
                  {whz !== null ? `${whz} DE` : '--'}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Emaciación / Aguda</span>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <span className="text-[11px] font-semibold text-slate-500 block">IMC/E (BAZ)</span>
                <span className="text-base font-extrabold text-slate-800">
                  {baz !== null ? `${baz} DE` : '--'}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Masa Corporal</span>
              </div>
            </div>
          </div>

          {/* Diagnóstico Integrado */}
          <div className={`p-4 rounded-xl border ${
            isSam ? 'bg-rose-50 border-rose-200' : (diagnosis?.color === 'warning' ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200')
          }`}>
            <div className="flex items-center gap-2 mb-1">
              {isSam ? (
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              )}
              <h5 className={`font-bold text-sm ${
                isSam ? 'text-rose-900' : (diagnosis?.color === 'warning' ? 'text-amber-900' : 'text-emerald-900')
              }`}>
                Diagnóstico Nutricional: {diagnosis?.label}
              </h5>
            </div>
            <p className="text-xs text-slate-600 ml-7">
              {isSam 
                ? 'CRITERIO DE DERIVACIÓN URGENTE: El infante cumple criterios clínicos de Desnutrición Aguda Severa. Requiere atención inmediata en el Centro de Salud Tipo B.'
                : (diagnosis?.severity === 'DCI-MODERADA' 
                  ? 'Retraso de crecimiento longitudinal (Talla Baja). Requiere consejería nutricional y seguimiento en comunidad.'
                  : 'Parámetros antropométricos dentro del rango de normalidad según la referencia OMS 2006.')}
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Cerrar Ficha
          </button>

          {diagnosis?.referralRequired && (
            <button
              onClick={() => onGenerateReferral(child)}
              className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Generar Ficha de Derivación MSP Tipo B
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
