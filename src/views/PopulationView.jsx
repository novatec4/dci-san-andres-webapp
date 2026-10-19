import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MapPin, 
  Activity, 
  Calendar, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { DataService } from '../services/dataService';
import { ChildAnthropometryModal } from '../components/nutrition/ChildAnthropometryModal';
import { ReferralSheetModal } from '../components/nutrition/ReferralSheetModal';

export function PopulationView({ user, dataMode, onNavigate }) {
  const isReal = dataMode === 'real';
  const children = DataService.getChildren();
  const communities = DataService.getCommunities();
  const macroSectors = DataService.getMacroSectors();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('all');
  const [selectedChild, setSelectedChild] = useState(null);
  const [referralChild, setReferralChild] = useState(null);

  // Filtrado en modo demo
  const filteredChildren = children.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.subjectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.community.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === 'all' || c.sector === selectedSector;
    let matchesAge = true;
    if (selectedAgeGroup === '0-5') matchesAge = c.ageMonths <= 5;
    else if (selectedAgeGroup === '6-23') matchesAge = c.ageMonths >= 6 && c.ageMonths <= 23;
    else if (selectedAgeGroup === '24-59') matchesAge = c.ageMonths >= 24;

    return matchesSearch && matchesSector && matchesAge;
  });

  return (
    <div className="space-y-6">
      {/* Cabecera de Estado de Datos */}
      <div className={`p-5 rounded-xl border flex items-center justify-between gap-4 ${
        isReal ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-orange-50 border-orange-200 text-orange-950'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg ${isReal ? 'bg-emerald-600 text-white' : 'bg-[#E8734A] text-white'}`}>
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold">
              {isReal 
                ? 'Línea Base Oficial: Padrón Objetivo de 647 Infantes en San Andrés' 
                : 'Muestra Demostrativa: 200 Infantes Sintéticos con Algoritmos OMS'}
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              {isReal 
                ? 'El barrido en territorio inicia formalmente el 05/10/2026. A continuación se detallan las cuotas censales por sector y comunidad.'
                : 'Registros simulados para auditoría de puntajes Z (HAZ, WAZ, WHZ, BAZ) y flujos clínicos.'}
            </p>
          </div>
        </div>
      </div>

      {isReal ? (
        /* VISTA ENRIQUECIDA EN MODO REAL: METAS POR ASENTAMIENTOS Y MACRO-SECTORES */
        <div className="space-y-6">
          {/* Cuotas por Macro-Sectores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {macroSectors.map(s => (
              <div key={s.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800">{s.code} • {s.name}</span>
                  <span className="text-xs font-extrabold text-[#E8734A]">{s.pct}%</span>
                </div>
                <div className="text-xs text-slate-500 mb-3">
                  {s.settlementsCount} Asentamientos PDOT • {s.duplas}
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
                  <span className="text-xs text-slate-500">Meta Poblacional:</span>
                  <span className="text-xl font-extrabold text-slate-900">{s.targetChildren} niños</span>
                </div>
              </div>
            ))}
          </div>

          {/* Tabla de Metas por Comunidad PDOT */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Distribución de Cuotas Censales por Asentamiento Oficial (45 Comunidades)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Planificación cartográfica basada en K-NN sobre los 5.486 techos dasimétricos de San Andrés
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-600">
                Padrón Parroquial: 647 infantes
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Comunidad / Asentamiento</th>
                    <th className="py-2.5 px-4">Macro-Sector</th>
                    <th className="py-2.5 px-4">Meta Censal (0-59 m)</th>
                    <th className="py-2.5 px-4">Avance Actual</th>
                    <th className="py-2.5 px-4 text-right">Estado Operativo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {communities.map((c, i) => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-4 font-semibold text-slate-800 flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{c.name}</span>
                      </td>
                      <td className="py-2.5 px-4 text-slate-600">{c.sector}</td>
                      <td className="py-2.5 px-4 font-bold text-slate-900">{c.target} infantes</td>
                      <td className="py-2.5 px-4 text-slate-500">0 / {c.target} (0%)</td>
                      <td className="py-2.5 px-4 text-right">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                          Programado 05/10
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* VISTA DEMOSTRATIVA: TABLA CON 200 REGISTROS Y MODALES CLÍNICOS */
        <div className="space-y-4">
          {/* Filtros */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, código o comunidad..."
                className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#002B49]"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-700"
              >
                <option value="all">Todos los Sectores</option>
                <option value="Sector A">Sector A (Cabecera)</option>
                <option value="Sector B">Sector B (Media)</option>
                <option value="Sector C">Sector C (Altas)</option>
              </select>

              <select
                value={selectedAgeGroup}
                onChange={(e) => setSelectedAgeGroup(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-700"
              >
                <option value="all">Todos los Rangos</option>
                <option value="0-5">0 a 5 meses (Lactancia)</option>
                <option value="6-23">6 a 23 meses (Complementaria)</option>
                <option value="24-59">24 a 59 meses (Preescolar)</option>
              </select>
            </div>
          </div>

          {/* Tabla de Infantes */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700">
                Mostrando {filteredChildren.length} de {children.length} infantes
              </span>
              <span className="text-[11px] text-slate-400">
                Haga clic en cualquier fila para abrir la Ficha Antropométrica OMS
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Código</th>
                    <th className="py-2.5 px-4">Nombre Completo</th>
                    <th className="py-2.5 px-4">Edad</th>
                    <th className="py-2.5 px-4">Sexo</th>
                    <th className="py-2.5 px-4">Comunidad</th>
                    <th className="py-2.5 px-4">Talla</th>
                    <th className="py-2.5 px-4">Peso</th>
                    <th className="py-2.5 px-4">T/E (HAZ)</th>
                    <th className="py-2.5 px-4">Diagnóstico OMS</th>
                    <th className="py-2.5 px-4 text-right">Ficha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredChildren.slice(0, 50).map(c => (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedChild(c)}
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <td className="py-2.5 px-4 font-mono font-semibold text-slate-700">{c.subjectCode}</td>
                      <td className="py-2.5 px-4 font-bold text-slate-900">{c.name}</td>
                      <td className="py-2.5 px-4 text-slate-600">{c.ageMonths} m</td>
                      <td className="py-2.5 px-4 text-slate-600">{c.gender}</td>
                      <td className="py-2.5 px-4 text-slate-600">{c.community}</td>
                      <td className="py-2.5 px-4 text-slate-800">{c.heightCm} cm</td>
                      <td className="py-2.5 px-4 text-slate-800">{c.weightKg} kg</td>
                      <td className="py-2.5 px-4">
                        <span className={`font-bold ${c.haz < -2 ? 'text-rose-600' : 'text-slate-800'}`}>
                          {c.haz} DE
                        </span>
                      </td>
                      <td className="py-2.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          c.hasEdema || c.whz < -3 
                            ? 'bg-rose-100 text-rose-800' 
                            : (c.diagnosis?.severity === 'DCI-MODERADA' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800')
                        }`}>
                          {c.diagnosis?.label}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <ChevronRight className="w-4 h-4 text-slate-400 inline" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

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
