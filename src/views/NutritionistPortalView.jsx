import React, { useState } from 'react';
import { 
  Stethoscope, 
  ShieldAlert, 
  Activity, 
  Scale, 
  FileText, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2, 
  Users, 
  ArrowRight,
  ClipboardList
} from 'lucide-react';
import { DataService } from '../services/dataService';
import { ChildAnthropometryModal } from '../components/nutrition/ChildAnthropometryModal';
import { ReferralSheetModal } from '../components/nutrition/ReferralSheetModal';

export function NutritionistPortalView({ user, onNavigate }) {
  const [selectedChild, setSelectedChild] = useState(null);
  const [referralChild, setReferralChild] = useState(null);

  const stats = DataService.getNutritionStats();
  const children = DataService.getChildren();
  const criticalCases = children.filter(c => c.hasEdema || (c.whz !== null && c.whz < -2) || (c.haz !== null && c.haz < -3)).slice(0, 8);

  const macroSectors = DataService.getMacroSectors();

  return (
    <div className="space-y-6">
      {/* Banner Profesional Nutricionista (Estilo Google Clean Canónico) */}
      <div className="bg-white p-6 rounded-2xl border-l-4 border-l-[#E8734A] border border-[#E0E2EC] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#E8734A] mb-1">
            <Stethoscope className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">ÁREA DE NUTRICIÓN Y SALUD PÚBLICA &bull; ESPOCH &amp; AYUDA EN ACCIÓN</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#1F1F1F]">
            {user?.name || 'Lic. Carmen Elena Paredes'}
          </h2>
          <p className="text-xs text-[#747775] mt-0.5">
            {user?.roleLabel || 'Nutricionista Especialista de Campo'} &bull; Supervisión Antropométrica Parroquial
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://ee.kobotoolbox.org/XnLSvL66"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 px-4 py-2.5"
          >
            <span>Instrumento 2 (Antropometría KoBo)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={() => onNavigate('protocols')}
            className="btn btn-secondary rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm px-4 py-2.5"
          >
            <ClipboardList className="w-3.5 h-3.5 text-[#002B49]" />
            <span>Guía OMS &amp; CEISH</span>
          </button>
        </div>
      </div>

      {/* Tarjetas de Monitoreo Clínico */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Muestra San Andrés</span>
            <div className="p-2 rounded-lg bg-blue-50 text-[#002B49]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {stats.totalEvaluated} <span className="text-sm font-semibold text-slate-400">/ 647 niños</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Meta Parroquial • 45 Asentamientos PDOT
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Alertas Rojas (SAM)</span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-rose-600">
            {stats.samCount} <span className="text-xs font-semibold text-slate-500">casos</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            WHZ &lt; -3 DE o Edema Bilateral
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Prevalencia DCI (HAZ)</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-600">
            {stats.dciPrevalencePct}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Talla Baja para la Edad (HAZ &lt; -2 DE)
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Equipos SECA 874/417</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">
            36 Balanzas
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Verificación Matutina Pesa 5.0 kg (±50g)
          </div>
        </div>
      </div>

      {/* Desglose de Macro-Sectores Parroquiales */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Estratificación Territorial de la Población Infantil (PDOT 2023–2027)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Organización operativa en 3 Macro-Sectores para 36 duplas de Nutrición ESPOCH en 5 jornadas de lunes
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Meta Parroquial: 647 niños (100%)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {macroSectors.map(s => (
            <div key={s.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#002B49]">{s.code}: {s.name}</span>
                <span className="text-[11px] font-bold text-[#E8734A]">{s.pct}%</span>
              </div>
              <div className="text-xs text-slate-600 mb-2">
                {s.settlementsCount} Asentamientos PDOT • {s.duplas}
              </div>
              <div className="flex items-baseline justify-between pt-2 border-t border-slate-200">
                <span className="text-[11px] text-slate-500">Meta censal:</span>
                <span className="text-base font-extrabold text-slate-900">{s.targetChildren} niños</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Casos Clínicos Prioritarios para Derivación al C.S. San Andrés Tipo B */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Casos Prioritarios y Banderas Rojas Identificadas</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Haga clic sobre cualquier infante para consultar su curva antropométrica OMS o expedir la Ficha de Derivación al C.S. Tipo B
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600">
            {criticalCases.length} Casos con criterio de triaje
          </span>
        </div>

        {criticalCases.length === 0 ? (
          <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs">
            No se registran casos con alertas rojas en el lote de datos actual.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Código Sujeto</th>
                  <th className="py-2.5 px-3">Nombre</th>
                  <th className="py-2.5 px-3">Edad</th>
                  <th className="py-2.5 px-3">Comunidad</th>
                  <th className="py-2.5 px-3">T/E (HAZ)</th>
                  <th className="py-2.5 px-3">P/T (WHZ)</th>
                  <th className="py-2.5 px-3">Diagnóstico OMS</th>
                  <th className="py-2.5 px-3 text-right">Acción Clínica</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {criticalCases.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">{c.subjectCode}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{c.name}</td>
                    <td className="py-2.5 px-3 text-slate-600">{c.ageMonths} m</td>
                    <td className="py-2.5 px-3 text-slate-600">{c.community}</td>
                    <td className="py-2.5 px-3">
                      <span className={`font-bold ${c.haz < -2 ? 'text-rose-600' : 'text-slate-700'}`}>
                        {c.haz} DE
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`font-bold ${c.whz < -2 ? 'text-rose-600' : 'text-slate-700'}`}>
                        {c.whz !== null ? `${c.whz} DE` : '--'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.hasEdema || c.whz < -3 ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {c.diagnosis?.label}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedChild(c)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-[11px] transition-all"
                        >
                          Ver Curva
                        </button>
                        <button
                          onClick={() => setReferralChild(c)}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded text-[11px] transition-all flex items-center gap-1 shadow-sm"
                        >
                          <FileText className="w-3 h-3" />
                          Derivar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modales */}
      {selectedChild && (
        <ChildAnthropometryModal
          child={selectedChild}
          onClose={() => setSelectedChild(null)}
          onGenerateReferral={(c) => {
            setSelectedChild(null);
            setReferralChild(c);
          }}
        />
      )}

      {referralChild && (
        <ReferralSheetModal
          child={referralChild}
          professionalName={user?.name}
          onClose={() => setReferralChild(null)}
        />
      )}
    </div>
  );
}
