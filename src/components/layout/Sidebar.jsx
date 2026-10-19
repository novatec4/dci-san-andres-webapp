import React from 'react';
import { 
  LayoutDashboard, 
  Stethoscope, 
  ClipboardCheck, 
  Map, 
  Users, 
  Baby, 
  BookOpen, 
  FileText, 
  ShieldCheck, 
  LogOut,
  UserCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { AuthStore } from '../../services/authStore';

export function Sidebar({ 
  currentRoute, 
  onNavigate, 
  user, 
  onLogout,
  isCollapsed = false,
  onToggleCollapse
}) {
  const role = user?.role || 'admin';

  const menuItems = [
    { key: 'dashboard', label: 'Dashboard Ejecutivo', icon: LayoutDashboard },
    { key: 'nutritionist', label: 'Monitoreo Nutricional', icon: Stethoscope, badge: 'Clínico' },
    { key: 'student', label: 'Panel de Campo', icon: ClipboardCheck },
    { key: 'gis', label: 'Mapa GIS San Andrés', icon: Map },
    { key: 'population', label: 'Población Infantil', icon: Baby },
    { key: 'surveyors', label: 'Equipo y Personal', icon: Users },
    { key: 'users', label: 'Gestión de Usuarios', icon: UserCheck },
    { key: 'protocols', label: 'Protocolos de Campo', icon: BookOpen },
    { key: 'reports', label: 'Reportes y Analítica', icon: FileText },
    { key: 'credentials', label: 'Credenciales QR', icon: ShieldCheck }
  ];

  // Filtrar según permisos de rol
  const visibleItems = menuItems.filter(item => AuthStore.canAccess(role, item.key));

  return (
    <aside 
      className={`${
        isCollapsed ? 'w-[76px]' : 'w-[260px]'
      } bg-white border-r border-[#E0E2EC] flex flex-col justify-between shrink-0 shadow-sm z-30 transition-all duration-300 relative select-none`}
    >
      <div>
        {/* Cabecera Institucional con Imagotipo y Botón de Colapso */}
        <div className={`p-4 border-b border-[#E0E2EC] flex items-center ${
          isCollapsed ? 'justify-center flex-col gap-2' : 'justify-between'
        }`}>
          {!isCollapsed ? (
            <div className="flex items-center gap-2 overflow-hidden">
              <img 
                src="/AEA-Imagotipo-naranja-ayuda-pantalla-4000x.png" 
                alt="Ayuda en Acción" 
                className="h-9 object-contain max-w-[160px]"
              />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#E8734A]/10 flex items-center justify-center text-[#E8734A] font-extrabold text-xs">
              AeA
            </div>
          )}

          {/* Botón Circular de Colapso / Expansión (Material 3) */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              id="sidebar-collapse-btn"
              title={isCollapsed ? "Expandir barra lateral" : "Colapsar barra lateral"}
              className="w-7 h-7 rounded-full bg-[#F0F4F9] border border-[#E0E2EC] text-[#444746] hover:bg-[#E8734A] hover:text-white hover:border-[#E8734A] flex items-center justify-center transition-all shadow-sm shrink-0"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* Menú de Navegación Oficial */}
        <nav className="p-2 space-y-1">
          {visibleItems.map(item => {
            const Icon = item.icon;
            const isActive = currentRoute === item.key;

            return (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`relative group w-full flex items-center ${
                  isCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2.5'
                } rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#E8734A] text-white shadow-md'
                    : 'text-[#444746] hover:text-[#1F1F1F] hover:bg-[#F0F4F9]'
                }`}
              >
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                  <Icon className={`${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'} shrink-0`} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!isCollapsed && item.badge && (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#E8734A]/10 text-[#E8734A]'
                  }`}>
                    {item.badge}
                  </span>
                )}

                {/* Tooltip flotante en modo colapsado */}
                {isCollapsed && (
                  <div className="hidden group-hover:flex absolute left-full ml-3 px-3 py-1.5 bg-[#1F1F1F] text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none items-center gap-2">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="bg-[#E8734A] text-white text-[9px] px-1.5 py-0.5 rounded">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer del Sidebar: Perfil, Versión y Salida */}
      <div className="p-3 border-t border-[#E0E2EC] space-y-2">
        {!isCollapsed ? (
          <>
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold text-[#1F1F1F]">v3.1.3 Oficial</span>
              </div>
              <span className="text-[10px] text-[#747775]">ESPOCH &bull; AeA</span>
            </div>

            {/* Tarjeta de Usuario Activo */}
            <div className="flex items-center justify-between bg-[#F8F9FA] p-2 rounded-xl border border-[#E0E2EC]">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E8734A] to-[#C85A32] text-white font-extrabold flex items-center justify-center text-xs shrink-0 shadow-sm">
                  {user?.avatar || 'CP'}
                </div>
                <div className="overflow-hidden text-left">
                  <div className="text-xs font-bold text-[#1F1F1F] truncate">
                    {user?.name || 'Usuario'}
                  </div>
                  <div className="text-[10px] text-[#747775] truncate">
                    {user?.roleLabel || user?.role || 'Acreditado'}
                  </div>
                </div>
              </div>

              <button
                onClick={onLogout}
                title="Cerrar sesión"
                className="p-1.5 text-[#747775] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 py-1">
            <div 
              className="relative group w-8 h-8 rounded-full bg-gradient-to-br from-[#E8734A] to-[#C85A32] text-white font-extrabold flex items-center justify-center text-xs shadow-sm cursor-pointer"
            >
              {user?.avatar || 'CP'}
              <div className="hidden group-hover:flex flex-col absolute left-full ml-3 px-3 py-1.5 bg-[#1F1F1F] text-white text-xs rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none">
                <span className="font-bold">{user?.name}</span>
                <span className="text-[10px] text-slate-300">{user?.roleLabel || user?.role}</span>
              </div>
            </div>

            <button
              onClick={onLogout}
              title="Cerrar sesión"
              className="p-2 text-[#747775] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
