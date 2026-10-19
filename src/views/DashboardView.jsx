import React, { useState } from 'react';
import { 
  Users, 
  MapPin, 
  Activity, 
  Droplets, 
  ShieldAlert, 
  TrendingUp, 
  FileText,
  Layers,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { DataService } from '../services/dataService';
import { ReferralSheetModal } from '../components/nutrition/ReferralSheetModal';

export function DashboardView({ onNavigate, user }) {
  const stats = DataService.getNutritionStats();
  const macroSectors = DataService.getMacroSectors();
  const [referralModalOpen, setReferralModalOpen] = useState(false);

  const sampleChildForReferral = {
    id: 'INF-0017',
    subjectCode: 'SA-PUL-017',
    name: 'Mateo Sebastián Paucar Lema',
    ageMonths: 18,
    gender: 'M',
    heightCm: 76.2,
    weightKg: 8.4,
    hasEdema: true,
    community: 'Pulinguí',
    sector: 'Sector C',
    haz: -3.42,
    waz: null,
    whz: -3.15,
    diagnosis: {
      label: 'Desnutrición Aguda Severa (Kwashiorkor con Edema Bilateral)',
      severity: 'SAM'
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner de Inicio de Barrido Oficial (Google Clean Style) */}
      <div className="bg-white p-6 rounded-2xl border-l-4 border-l-[#E8734A] border border-[#E0E2EC] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#E8734A] mb-1">
            <span className="w-2 h-2 rounded-full bg-[#E8734A] animate-pulse" />
            LÍNEA BASE OFICIAL CENSAL &bull; OPERATIVO DCI 2026
          </div>
          <h2 className="text-lg font-bold text-[#1F1F1F]">
            Monitoreo Integral de Cobertura, Estado Nutricional OMS y Triaje Clínico
          </h2>
          <p className="text-xs text-[#747775] mt-1">
            Meta Parroquial: <strong className="text-[#1F1F1F]">647 niños (San Andrés)</strong> &bull; Meta Global Contrato: 1.397 niños &bull; 45 Asentamientos Humanos Oficiales PDOT Guano 2023–2027.
          </p>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-bold px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full uppercase tracking-wider inline-block">
            Barrido inicia el 05/10/2026
          </span>
        </div>
      </div>

      {/* ACTO 1: EL RETO TERRITORIAL (METAS Y ESTRATIFICACIÓN) */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#F0F4F9] text-[#444746] border border-[#E0E2EC]">
            NIVEL 1
          </span>
          <h3 className="text-sm font-bold text-[#1F1F1F] tracking-tight">
            Cobertura Censal en la Geografía Andina de San Andrés
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="bg-white p-5 rounded-xl border border-[#E0E2EC] shadow-sm">
            <div className="flex items-center justify-between text-[#747775] mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Meta Poblacional</span>
              <div className="p-2 rounded-lg bg-blue-50 text-[#002B49]">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#1F1F1F]">
              {stats.totalEvaluated} <span className="text-sm font-semibold text-[#747775]">/ 647 niños</span>
            </div>
            <div className="text-[11px] text-[#747775] mt-1">
              San Andrés (0 a 59 meses)
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E0E2EC] shadow-sm">
            <div className="flex items-center justify-between text-[#747775] mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Avance de Cobertura</span>
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#1F1F1F]">
              {((stats.totalEvaluated / 647) * 100).toFixed(1)}%
            </div>
            <div className="text-[11px] text-[#747775] mt-1">
              Hacia el cumplimiento censal
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E0E2EC] shadow-sm">
            <div className="flex items-center justify-between text-[#747775] mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Duplas Activas</span>
              <div className="p-2 rounded-lg bg-orange-50 text-[#E8734A]">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#1F1F1F]">
              {stats.activeDuplas} <span className="text-sm font-semibold text-[#747775]">/ 36 duplas</span>
            </div>
            <div className="text-[11px] text-[#747775] mt-1">
              73 Brigadistas Acreditados
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E0E2EC] shadow-sm">
            <div className="flex items-center justify-between text-[#747775] mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Comunidades Visitadas</span>
              <div className="p-2 rounded-lg bg-purple-50 text-purple-700">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#1F1F1F]">
              {stats.communitiesCovered} <span className="text-sm font-semibold text-[#747775]">/ 45 PDOT</span>
            </div>
            <div className="text-[11px] text-[#747775] mt-1">
              Asentamientos Oficiales Guano
            </div>
          </div>
        </div>

        {/* 3 Macro-Sectores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {macroSectors.map(s => (
            <div key={s.id} className="bg-white p-4 rounded-xl border border-[#E0E2EC] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-xs text-[#1F1F1F]">{s.code} &bull; {s.name}</span>
                  <span className="text-xs font-bold text-[#E8734A]">{s.pct}%</span>
                </div>
                <div className="text-[11px] text-[#747775] mb-2">
                  {s.settlementsCount} Asentamientos &bull; {s.duplas}
                </div>
                <div className="w-full bg-[#F0F4F9] h-2 rounded-full overflow-hidden mb-3">
                  <div 
                    className="bg-[#E8734A] h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (s.evaluated / s.targetChildren) * 100)}%` }}
                  />
                </div>
              </div>
              <div className="pt-2 border-t border-[#E0E2EC] flex justify-between items-center text-xs">
                <span className="text-[#747775]">Evaluados:</span>
                <span className="font-extrabold text-[#1F1F1F]">{s.evaluated} / {s.targetChildren}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ACTO 2 & ACTO 3: PARADOJA NUTRICIONAL Y AGUA SEGURA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Acto 2: Paradoja Nutricional */}
        <div className="bg-white p-6 rounded-xl border border-[#E0E2EC] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#F0F4F9] text-[#444746] border border-[#E0E2EC]">NIVEL 2</span>
              <h3 className="text-sm font-bold text-[#1F1F1F]">
                La Paradoja Nutricional de la Altura (Desnutrición Crónica)
              </h3>
            </div>

            <div className="space-y-4 my-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-[#444746]">Línea Base Chimborazo (ENSANUT)</span>
                  <span className="font-bold text-rose-600">35.1%</span>
                </div>
                <div className="w-full bg-[#F0F4F9] h-2.5 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: '35.1%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-[#444746]">Promedio Nacional (Ecuador)</span>
                  <span className="font-bold text-[#1F1F1F]">20.1%</span>
                </div>
                <div className="w-full bg-[#F0F4F9] h-2.5 rounded-full overflow-hidden">
                  <div className="bg-slate-400 h-full rounded-full" style={{ width: '20.1%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-[#444746]">Muestra Activa en Terreno (San Andrés)</span>
                  <span className="font-bold text-[#E8734A]">{stats.dciPrevalencePct}%</span>
                </div>
                <div className="w-full bg-[#F0F4F9] h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#E8734A] h-full rounded-full" style={{ width: `${Math.min(100, parseFloat(stats.dciPrevalencePct))}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-[#747775] p-3 bg-[#F8F9FA] rounded-lg border border-[#E0E2EC]">
            Chimborazo registra una tasa de desnutrición crónica 1.7 veces superior al promedio nacional. El retraso estatural se acelera entre los 6 y 23 meses con el destete y la alimentación complementaria.
          </div>
        </div>

        {/* Acto 3: Determinantes de Agua y Saneamiento */}
        <div className="bg-white p-6 rounded-xl border border-[#E0E2EC] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#F0F4F9] text-[#444746] border border-[#E0E2EC]">NIVEL 3</span>
              <h3 className="text-sm font-bold text-[#1F1F1F]">
                Determinantes Ambientales: Agua Segura y Riesgo Infeccioso
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 my-4">
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-center">
                <Droplets className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <span className="text-xl font-bold text-emerald-900 block">42%</span>
                <span className="text-[11px] text-emerald-700 font-medium">Red Pública con Cloración</span>
              </div>

              <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-center">
                <Droplets className="w-5 h-5 text-rose-600 mx-auto mb-1" />
                <span className="text-xl font-bold text-rose-900 block">58%</span>
                <span className="text-[11px] text-rose-700 font-medium">Acequia / Vertiente sin Tratar</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-[#747775] p-3 bg-[#F8F9FA] rounded-lg border border-[#E0E2EC]">
            El 58% de las familias de comunidades altas consumen agua no clorada. Los infantes en estos hogares presentan un riesgo 2.4 veces mayor de episodios diarreicos recurrentes y detención del crecimiento.
          </div>
        </div>
      </div>

      {/* ACTO 4: TRIAJE CLÍNICO Y RESCATE MSP */}
      <div className="bg-white p-6 rounded-xl border border-[#E0E2EC] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 text-rose-600">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="text-sm font-bold text-[#1F1F1F]">
              Protocolo de Triaje y Derivación al Centro de Salud San Andrés Tipo B (MSP)
            </h3>
          </div>
          <p className="text-xs text-[#747775] max-w-2xl">
            Ante la identificación de Banderas Rojas OMS (Desnutrición Aguda Severa WHZ &lt; -3 DE o Edema Bilateral Nutricional), se emite la Ficha Oficial de Referencia para rescate pediátrico inmediato.
          </p>
        </div>

        <button
          onClick={() => setReferralModalOpen(true)}
          className="btn-primary flex items-center gap-2 shrink-0 rounded-xl shadow-md"
        >
          <FileText className="w-4 h-4" />
          <span>Ver Ficha Oficial de Derivación MSP</span>
        </button>
      </div>

      {/* Modal de Ficha de Derivación */}
      {referralModalOpen && (
        <ReferralSheetModal
          child={sampleChildForReferral}
          professionalName={user?.name}
          onClose={() => setReferralModalOpen(false)}
        />
      )}
    </div>
  );
}
