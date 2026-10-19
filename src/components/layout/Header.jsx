import React from 'react';
import { Database, Activity, MapPin } from 'lucide-react';
import { DataService } from '../../services/dataService';

export function Header({ currentRoute, dataMode, onToggleMode }) {
  const titles = {
    dashboard: 'Control de Mando Ejecutivo',
    nutritionist: 'Portal de Monitoreo Nutricional Clínico',
    student: 'Panel Operativo de Campo (Duplas)',
    gis: 'Sistema de Información Geográfica (GIS)',
    population: 'Caracterización de Población Infantil',
    surveyors: 'Directorio de Personal y Duplas Acreditadas',
    users: 'Gestión Integral de Usuarios',
    protocols: 'Protocolos Bioéticos y Guías de Campo OMS',
    reports: 'Generación de Reportes y Auditoría',
    credentials: 'Validación Digital y Credenciales QR'
  };

  const isReal = dataMode === 'real';

  return (
    <header className="h-16 bg-white border-b border-[#E0E2EC] px-6 flex items-center justify-between shadow-sm shrink-0">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-base font-bold text-[#1F1F1F] tracking-tight">
            {titles[currentRoute] || 'Plataforma DCI'}
          </h2>
          <div className="flex items-center gap-2 text-[11px] text-[#747775] font-medium">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#E8734A]" />
              San Andrés, Chimborazo
            </span>
            <span>&bull;</span>
            <span>Población Objetivo: 0 a 59 meses</span>
          </div>
        </div>
      </div>

      {/* Selector Bimodal Google Segmented Button */}
      <div className="flex items-center gap-3">
        <div className="bg-[#F0F4F9] p-1 rounded-xl border border-[#E0E2EC] flex items-center gap-1 text-xs">
          <button
            onClick={() => onToggleMode('real')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              isReal 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'text-[#444746] hover:text-[#1F1F1F]'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isReal ? 'bg-white' : 'bg-emerald-500'}`} />
            Modo Operación Real
          </button>
          <button
            onClick={() => onToggleMode('demo')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              !isReal 
                ? 'btn-primary shadow-sm' 
                : 'text-[#444746] hover:text-[#1F1F1F]'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${!isReal ? 'bg-white' : 'bg-[#E8734A]'}`} />
            Modo Demostración (200)
          </button>
        </div>
      </div>
    </header>
  );
}
