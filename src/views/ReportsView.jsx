import React from 'react';
import { FileText, Printer, Download, TrendingUp, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';
import { DataService } from '../services/dataService';

export function ReportsView({ dataMode }) {
  const stats = DataService.getNutritionStats();
  const macroSectors = DataService.getMacroSectors();

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#002B49]" />
            Informes Oficiales de Monitoreo y Auditoría Metodológica
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Convenio de Cooperación Técnica ESPOCH & Ayuda en Acción • Estándar MPE 2.0 INEC
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="btn btn-primary px-4 py-2 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Resumen Ejecutivo</span>
          </button>
        </div>
      </div>

      {/* Matriz de Indicadores Clave */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Meta Parroquial San Andrés
          </span>
          <div className="text-2xl font-extrabold text-slate-900">
            {stats.totalEvaluated} <span className="text-sm font-semibold text-slate-400">/ 647 niños</span>
          </div>
          <div className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100 flex justify-between">
            <span>Cobertura Parroquial:</span>
            <strong className="text-slate-800">{((stats.totalEvaluated / 647) * 100).toFixed(1)}%</strong>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Prevalencia DCI Estimada
          </span>
          <div className="text-2xl font-extrabold text-[#E8734A]">
            {stats.dciPrevalencePct}%
          </div>
          <div className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100 flex justify-between">
            <span>Referencia Chimborazo:</span>
            <strong className="text-rose-600">35.1% (ENSANUT)</strong>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Casos con Criterio de Rescate
          </span>
          <div className="text-2xl font-extrabold text-rose-600">
            {stats.samCount + stats.mamCount} <span className="text-xs font-semibold text-slate-500">infantes</span>
          </div>
          <div className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100 flex justify-between">
            <span>SAM / Edema:</span>
            <strong className="text-rose-700">{stats.samCount} casos urgentes</strong>
          </div>
        </div>
      </div>

      {/* Tabla Desglosada por Macro-Sector */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-4">
          Resumen Consolidado por Macro-Sector Operativo (PDOT 2023–2027)
        </h3>

        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-4">Macro-Sector</th>
              <th className="py-2.5 px-4">Asentamientos</th>
              <th className="py-2.5 px-4">Duplas Asignadas</th>
              <th className="py-2.5 px-4">Docente Supervisora / Tutor</th>
              <th className="py-2.5 px-4">Meta Niños</th>
              <th className="py-2.5 px-4 text-right">Porcentaje</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {macroSectors.map(s => (
              <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-bold text-slate-900">{s.code} ({s.name})</td>
                <td className="py-3 px-4 text-slate-700">{s.settlementsCount} Asentamientos</td>
                <td className="py-3 px-4 text-slate-700">{s.duplas}</td>
                <td className="py-3 px-4 text-slate-700">{s.supervisor}</td>
                <td className="py-3 px-4 font-bold text-slate-900">{s.targetChildren} infantes</td>
                <td className="py-3 px-4 text-right font-extrabold text-[#E8734A]">{s.pct}%</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-50 border-t border-slate-200 font-bold">
            <tr>
              <td className="py-2.5 px-4" colSpan={4}>TOTAL PARROQUIAL SAN ANDRÉS</td>
              <td className="py-2.5 px-4 text-slate-900">647 infantes</td>
              <td className="py-2.5 px-4 text-right text-slate-900">100.0%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
