import React, { useState, useEffect } from 'react';
import { AuthStore } from './services/authStore';
import { DataService } from './services/dataService';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import LoginView from './views/LoginView';
import { NutritionistPortalView } from './views/NutritionistPortalView';
import { StudentPortalView } from './views/StudentPortalView';
import { DashboardView } from './views/DashboardView';
import GisView from './views/GisView';
import { PopulationView } from './views/PopulationView';
import { SurveyorsView } from './views/SurveyorsView';
import UsersView from './views/UsersView';
import { ProtocolsView } from './views/ProtocolsView';
import { ReportsView } from './views/ReportsView';
import { CredentialsView } from './views/CredentialsView';

export function App() {
  const [currentUser, setCurrentUser] = useState(() => AuthStore.getCurrentUser());
  const [currentRoute, setCurrentRoute] = useState('dashboard');
  const [dataMode, setDataMode] = useState(() => DataService.getDataMode());
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('cgpi_sidebar_collapsed') === 'true';
  });

  // Al iniciar sesión o cargar usuario, asignar la ruta por defecto correspondiente a su rol
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'nutricionista') {
        setCurrentRoute('nutritionist');
      } else if (currentUser.role === 'encuestador') {
        setCurrentRoute('student');
      } else {
        setCurrentRoute('dashboard');
      }
    }
  }, [currentUser]);

  const handleLoginSuccess = (user, defaultRoute) => {
    setCurrentUser(user);
    setCurrentRoute(defaultRoute || 'dashboard');
  };

  const handleLogout = () => {
    AuthStore.logout();
    setCurrentUser(null);
  };

  const handleToggleMode = (newMode) => {
    const mode = DataService.setDataMode(newMode);
    setDataMode(mode);
  };

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('cgpi_sidebar_collapsed', next ? 'true' : 'false');
      return next;
    });
  };

  if (!currentUser) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden font-sans">
      {/* Barra Lateral de Navegación Oficial Colapsable */}
      <Sidebar
        currentRoute={currentRoute}
        onNavigate={setCurrentRoute}
        user={currentUser}
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />

      {/* Contenedor Principal Adaptable */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          currentRoute={currentRoute}
          dataMode={dataMode}
          onToggleMode={handleToggleMode}
        />

        <main className="flex-1 overflow-y-auto p-6 bg-[#F8F9FA]">
          <div className="max-w-7xl mx-auto">
            {currentRoute === 'nutritionist' && (
              <NutritionistPortalView user={currentUser} onNavigate={setCurrentRoute} />
            )}
            {currentRoute === 'student' && (
              <StudentPortalView user={currentUser} onNavigate={setCurrentRoute} />
            )}
            {currentRoute === 'dashboard' && (
              <DashboardView onNavigate={setCurrentRoute} user={currentUser} />
            )}
            {currentRoute === 'gis' && (
              <GisView />
            )}
            {currentRoute === 'population' && (
              <PopulationView user={currentUser} dataMode={dataMode} onNavigate={setCurrentRoute} />
            )}
            {currentRoute === 'surveyors' && (
              <SurveyorsView />
            )}
            {currentRoute === 'users' && (
              <UsersView />
            )}
            {currentRoute === 'protocols' && (
              <ProtocolsView />
            )}
            {currentRoute === 'reports' && (
              <ReportsView dataMode={dataMode} />
            )}
            {currentRoute === 'credentials' && (
              <CredentialsView user={currentUser} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
