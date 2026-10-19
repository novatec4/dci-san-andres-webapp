/* ============================================================
   app.js — Main Application Controller (v2.6.2 Oficial)
   Handles module registration, navigation, mobile drawer, and RBAC lifecycle.
   ============================================================ */

const App = {
  currentModule: null,

  modules: {
    dashboard: typeof DashboardModule !== 'undefined' ? DashboardModule : null,
    portal: typeof PortalModule !== 'undefined' ? PortalModule : null,
    gis: typeof GISModule !== 'undefined' ? GISModule : null,
    kobo: typeof KoboSyncModule !== 'undefined' ? KoboSyncModule : null,
    protocols: typeof ProtocolsModule !== 'undefined' ? ProtocolsModule : null,
    surveyors: typeof SurveyorsModule !== 'undefined' ? SurveyorsModule : null,
    population: typeof PopulationModule !== 'undefined' ? PopulationModule : null,
    users: typeof UsersModule !== 'undefined' ? UsersModule : null,
    reports: typeof ReportsModule !== 'undefined' ? ReportsModule : null,
    credentials: typeof CredentialsModule !== 'undefined' ? CredentialsModule : null
  },

  moduleTitles: {
    dashboard: '📊 Dashboard Ejecutivo',
    portal: '🎒 Panel Operativo del Encuestador',
    gis: '🗺️ Mapa GIS San Andrés',
    kobo: '📥 Sincronización KoBoToolbox',
    protocols: '📖 Protocolos de Campo',
    surveyors: '👥 Equipo y Personal',
    population: '👶 Población Infantil',
    users: '👤 Gestión de Usuarios',
    reports: '📄 Reportes Institucionales',
    credentials: '🪪 Credenciales & Validación QR'
  },

  init() {
    // Inicializar subsistemas
    if (typeof Auth !== 'undefined') {
      Auth.init();
    }
    if (typeof KoboSyncModule !== 'undefined') {
      KoboSyncModule.init();
    }

    // SEGURIDAD OBLIGATORIA: Si no hay sesión válida, desplegar Login y detener carga
    if (!Auth.isAuthenticated()) {
      Auth.renderLoginPage();
      return;
    }

    this.initAppShell();

    // Enrutamiento inteligente por URL (Hash o Query Params)
    const urlParams = new URLSearchParams(window.location.search);
    const hashModule = (window.location.hash || '').replace('#', '').trim();
    const queryModule = urlParams.get('module');
    const requestedModule = queryModule || hashModule;

    const defaultRoute = Auth.DEFAULT_ROUTE_BY_ROLE[Auth.currentUser?.role] || 'dashboard';
    const targetModule = (requestedModule && this.modules[requestedModule] && Auth.canAccess(requestedModule))
      ? requestedModule
      : defaultRoute;

    this.navigateTo(targetModule);

    // Si el destino es el mapa GIS y vienen parámetros de coordenadas o comunidad, enfocarlos
    if (targetModule === 'gis') {
      this._handleGisLocationParams(urlParams);
    }
  },

  // Manejo de parámetros georreferenciados para el visor de mapas
  _handleGisLocationParams(urlParams) {
    const lat = parseFloat(urlParams.get('lat'));
    const lng = parseFloat(urlParams.get('lng'));
    const zone = urlParams.get('zone');
    const community = urlParams.get('community');

    setTimeout(() => {
      if (window.GISModule) {
        if (!isNaN(lat) && !isNaN(lng)) {
          GISModule.focusCoordinates(lat, lng, 16, zone ? `Zona: ${zone}` : null);
        } else if (community) {
          GISModule.focusCommunityOrZone(community);
        } else if (zone) {
          GISModule.focusCommunityOrZone(zone);
        }
      }
    }, 450);
  },

  // Inicializa el shell, listeners de navegación y tema (se invoca tras login exitoso)
  initAppShell() {
    this.setupNavigation();
    this.setupSidebarCollapse();
    this.setupMobileDrawer();
    this.setupThemeToggle();
    this.setupHashRouting();
    if (typeof Auth !== 'undefined') {
      Auth.applyRbacInterface();
    }
  },

  // ---------------------------------------------------------------------------
  // Colapso de Sidebar (Desktop 76px)
  // ---------------------------------------------------------------------------
  setupSidebarCollapse() {
    const sidebar = document.getElementById('app-sidebar');
    const collapseBtn = document.getElementById('sidebar-collapse-btn');
    if (!sidebar || !collapseBtn) return;

    const applyCollapseState = (collapsed) => {
      if (collapsed) {
        document.body.classList.add('sidebar-collapsed');
        sidebar.classList.add('collapsed');
        collapseBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>';
        collapseBtn.setAttribute('title', 'Expandir barra lateral');
      } else {
        document.body.classList.remove('sidebar-collapsed');
        sidebar.classList.remove('collapsed');
        collapseBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>';
        collapseBtn.setAttribute('title', 'Colapsar barra lateral');
      }
      localStorage.setItem('cgpi_sidebar_collapsed', collapsed ? 'true' : 'false');
      // Notificar redimensionamiento para Leaflet y Chart.js
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 320);
    };

    const isCollapsedSaved = localStorage.getItem('cgpi_sidebar_collapsed') === 'true';
    if (window.innerWidth > 768 && isCollapsedSaved) {
      applyCollapseState(true);
    }

    collapseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const currentlyCollapsed = document.body.classList.contains('sidebar-collapsed');
      applyCollapseState(!currentlyCollapsed);
    });
  },

  setupHashRouting() {
    window.addEventListener('hashchange', () => {
      const hash = (window.location.hash || '').replace('#', '').trim();
      if (hash && this.modules[hash] && Auth.isAuthenticated() && Auth.canAccess(hash)) {
        if (this.currentModule !== hash) {
          this.navigateTo(hash);
        }
      }
    });
  },

  // ---------------------------------------------------------------------------
  // Drawer y Navegación Móvil
  // ---------------------------------------------------------------------------
  setupMobileDrawer() {
    const sidebar = document.getElementById('app-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const hamburgerBtn = document.getElementById('btn-mobile-drawer');
    const bottomMenuBtn = document.getElementById('btn-bottom-menu');

    const toggleDrawer = () => {
      const isOpen = sidebar.classList.contains('drawer-open');
      if (isOpen) {
        sidebar.classList.remove('drawer-open');
        overlay.classList.remove('active');
      } else {
        sidebar.classList.add('drawer-open');
        overlay.classList.add('active');
      }
    };

    const closeDrawer = () => {
      if (sidebar) sidebar.classList.remove('drawer-open');
      if (overlay) overlay.classList.remove('active');
    };

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', toggleDrawer);
    if (bottomMenuBtn) bottomMenuBtn.addEventListener('click', toggleDrawer);
    if (overlay) overlay.addEventListener('click', closeDrawer);

    // Cerrar drawer al hacer clic en un enlace del sidebar en móvil
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          closeDrawer();
        }
      });
    });

    // Eventos para Bottom Navigation Bar
    document.querySelectorAll('.mobile-bottom-nav .bottom-nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const mod = item.dataset.module;
        if (mod && mod !== 'menu') {
          closeDrawer();
          this.navigateTo(mod);
        }
      });
    });
  },

  // ---------------------------------------------------------------------------
  // Navegación de Escritorio
  // ---------------------------------------------------------------------------
  setupNavigation() {
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const moduleName = item.dataset.module;
        if (moduleName) {
          e.preventDefault();
          this.navigateTo(moduleName);
        }
      });
    });
  },

  navigate(moduleName) {
    this.navigateTo(moduleName);
  },

  navigateTo(moduleName) {
    // 1. Verificación de Seguridad y Sesión
    if (!Auth.isAuthenticated()) {
      Auth.renderLoginPage();
      return;
    }

    // 2. Control de Acceso por Roles (RBAC 2.0)
    if (!Auth.canAccess(moduleName)) {
      alert(`Acceso denegado: Su perfil (${Auth.currentUser.roleLabel}) no tiene permisos para el módulo "${moduleName}".`);
      return;
    }

    // 3. Destruir módulo activo si existe
    if (this.currentModule && this.modules[this.currentModule]) {
      try {
        if (typeof this.modules[this.currentModule].destroy === 'function') {
          this.modules[this.currentModule].destroy();
        }
      } catch (err) {
        console.warn(`Error destroying module "${this.currentModule}":`, err);
      }
    }

    // 4. Actualizar estado activo en Sidebar Desktop
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.module === moduleName);
    });

    // 5. Actualizar estado activo en Mobile Bottom Bar
    document.querySelectorAll('.mobile-bottom-nav .bottom-nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.module === moduleName);
    });

    // 6. Obtener definición del módulo
    const module = this.modules[moduleName];
    if (!module || typeof module.render !== 'function') {
      console.error(`Module "${moduleName}" not found or has no render() method.`);
      return;
    }

    this.currentModule = moduleName;

    // Actualizar título en Mobile Top Bar si existe
    const mobileTitle = document.getElementById('mobile-header-title');
    if (mobileTitle && this.moduleTitles[moduleName]) {
      mobileTitle.textContent = this.moduleTitles[moduleName];
    }

    // 7. Renderizar e inicializar el módulo (soporta render síncrono o asíncrono)
    try {
      const renderResult = module.render();
      const executeInit = () => {
        try {
          if (typeof module.init === 'function') module.init();
        } catch (err) {
          console.error(`Error initializing module "${moduleName}":`, err);
        }
      };

      if (renderResult && typeof renderResult.then === 'function') {
        renderResult.then(executeInit).catch(err => {
          console.error(`Error async rendering module "${moduleName}":`, err);
        });
      } else {
        requestAnimationFrame(executeInit);
      }
    } catch (err) {
      console.error(`Error rendering module "${moduleName}":`, err);
      const mainContent = document.getElementById('main-content');
      mainContent.innerHTML = `
        <div class="module-header">
          <h1>Error</h1>
          <p class="module-subtitle">No se pudo cargar el módulo</p>
        </div>
        <div class="card fade-in" style="padding: 2rem; text-align: center; border-left: 4px solid var(--danger);">
          <p style="color: var(--danger);">Ocurrió un error al cargar el módulo "${moduleName}".</p>
          <p style="color: var(--text-muted); font-size: 0.875rem; margin-top: 0.5rem;">${err.message}</p>
        </div>
      `;
    }
  },

  // ---------------------------------------------------------------------------
  // Control de Temas
  // ---------------------------------------------------------------------------
  setupThemeToggle() {
    const saved = localStorage.getItem('cgpi-theme');
    if (saved === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    this._updateThemeLabel();

    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        if (next === 'dark') {
          document.documentElement.removeAttribute('data-theme');
        } else {
          document.documentElement.setAttribute('data-theme', 'light');
        }
        localStorage.setItem('cgpi-theme', next);
        this._updateThemeLabel();
      });
    }
  },

  _updateThemeLabel() {
    const label = document.querySelector('.theme-label');
    const theme = document.documentElement.getAttribute('data-theme');
    if (label) {
      if (theme === 'light') {
        label.textContent = 'Modo Oscuro';
      } else {
        label.textContent = 'Modo Claro';
      }
    }
  },

  // ---------------------------------------------------------------------------
  // Modal Institucional: Versión Vigente del Sistema (v2.6.2)
  // ---------------------------------------------------------------------------
  showVersionModal() {
    const existing = document.getElementById('version-system-modal');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'version-system-modal';
    overlay.className = 'modal-overlay version-modal-overlay active';
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.65);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;z-index:9999;padding:1rem;opacity:1;visibility:visible;';

    overlay.innerHTML = `
      <div class="version-modal-card card" style="max-width:560px;width:100%;padding:0;overflow:hidden;border:1px solid #E0E2EC;box-shadow:0 16px 48px rgba(0,0,0,0.2);background:#FFFFFF;border-radius:20px;">
        <!-- Cabecera Institucional Google Clean -->
        <div style="background:#002B49;padding:1.5rem;color:white;position:relative;border-bottom:3px solid var(--accent);">
          <button id="btn-close-version-modal" style="position:absolute;top:1rem;right:1rem;background:rgba(255,255,255,0.15);border:none;color:white;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:1.1rem;display:flex;align-items:center;justify-content:center;transition:all .2s;">&times;</button>
          <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.5rem;">
            <span style="background:var(--accent);color:white;font-size:0.7rem;font-weight:800;padding:0.2rem 0.6rem;border-radius:20px;letter-spacing:0.5px;">PRODUCCIÓN OFICIAL</span>
            <span style="font-size:0.75rem;color:rgba(255,255,255,0.85);">Componente A.3.1</span>
          </div>
          <h2 style="font-size:1.35rem;font-weight:800;margin:0 0 0.25rem 0;color:white;">Sistema DCI San Andrés</h2>
          <p style="font-size:0.85rem;color:rgba(255,255,255,0.85);margin:0;">Caracterización Georreferenciada de la Población Infantil (0 a 5 años)</p>
        </div>

        <!-- Ficha Técnica de Versión Vigente -->
        <div style="padding:1.5rem;max-height:70vh;overflow-y:auto;">
          <div style="display:flex;align-items:center;justify-content:space-between;background:#F8F9FA;padding:0.85rem 1rem;border-radius:12px;border:1px solid #E0E2EC;margin-bottom:1.25rem;">
            <div>
              <span style="font-size:0.72rem;color:#747775;display:block;text-transform:uppercase;letter-spacing:0.5px;">Versión Vigente</span>
              <strong style="font-size:1.2rem;color:#002B49;font-family:monospace;">v2.6.2 (Build Oficial)</strong>
            </div>
            <div style="text-align:right;">
              <span style="font-size:0.72rem;color:#747775;display:block;text-transform:uppercase;letter-spacing:0.5px;">Fecha de Corte</span>
              <strong style="font-size:0.9rem;color:#1F1F1F;">26 Septiembre 2026</strong>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.85rem;margin-bottom:1.25rem;font-size:0.82rem;">
            <div style="background:#F8F9FA;padding:0.75rem;border-radius:10px;border:1px solid #E0E2EC;">
              <span style="color:#747775;font-size:0.7rem;display:block;">Entorno de Ejecución</span>
              <strong style="color:#10b981;">Stack Docker Producción</strong>
              <div style="font-size:0.7rem;color:#444746;margin-top:2px;">Nginx :8086 + PostGIS :5434</div>
            </div>
            <div style="background:#F8F9FA;padding:0.75rem;border-radius:10px;border:1px solid #E0E2EC;">
              <span style="color:#747775;font-size:0.7rem;display:block;">Población Objetivo</span>
              <strong style="color:#1F1F1F;">Niños entre 0 y 5 años</strong>
              <div style="font-size:0.7rem;color:#444746;margin-top:2px;">0 a 59 meses cumplidos</div>
            </div>
            <div style="background:#F8F9FA;padding:0.75rem;border-radius:10px;border:1px solid #E0E2EC;">
              <span style="color:#747775;font-size:0.7rem;display:block;">Meta Censal San Andrés</span>
              <strong style="color:var(--accent);">647 Infantes (45 Asents.)</strong>
              <div style="font-size:0.7rem;color:#444746;margin-top:2px;">Global Convenio: 1.397 niños</div>
            </div>
            <div style="background:#F8F9FA;padding:0.75rem;border-radius:10px;border:1px solid #E0E2EC;">
              <span style="color:#747775;font-size:0.7rem;display:block;">Estándar Nutricional</span>
              <strong style="color:#002B49;">OMS whoanthro (LMS)</strong>
              <div style="font-size:0.7rem;color:#444746;margin-top:2px;">HAZ, WAZ, WHZ, BAZ y TEM</div>
            </div>
          </div>

          <div style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.3);border-radius:10px;padding:0.75rem 1rem;margin-bottom:1.25rem;">
            <div style="display:flex;align-items:center;gap:0.5rem;font-weight:700;color:#10b981;font-size:0.85rem;margin-bottom:0.25rem;">
              <span>✅</span> Control de Calidad y Pruebas Superadas
            </div>
            <div style="font-size:0.78rem;color:#444746;line-height:1.4;">
              • <strong>26/26 Pruebas Unitarias Aprobadas</strong> (Node.js Test Runner en 0.22 s).<br>
              • <strong>Catastro Dasimétrico Oficial PDOT-45</strong>: 5.486 techos clasificados K-NN.<br>
              • <strong>3 Macro-Sectores Oficiales</strong> con micro-ruteo de 36 duplas ESPOCH en 5 lunes.
            </div>
          </div>

          <div style="font-size:0.75rem;color:#747775;line-height:1.4;border-top:1px solid #E0E2EC;padding-top:0.75rem;">
            Convenio de Cooperación Técnica Interinstitucional <strong>ESPOCH & Fundación Ayuda en Acción Ecuador</strong>. Financiado con fondos de la <strong>Unión Europea</strong>.
          </div>
        </div>

        <!-- Acciones del Modal -->
        <div style="padding:1rem 1.5rem;background:#F8F9FA;border-top:1px solid #E0E2EC;display:flex;justify-content:space-between;align-items:center;">
          <a href="verificar.html" target="_blank" class="btn btn-secondary btn-sm" style="display:inline-flex;align-items:center;gap:0.4rem;text-decoration:none;border-radius:20px;">
            🪪 Probar Portal QR (/verificar.html)
          </a>
          <button id="btn-confirm-version-close" class="btn btn-primary btn-sm" style="background:#002B49;border-radius:20px;">
            Entendido
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const closeFn = () => overlay.remove();
    document.getElementById('btn-close-version-modal').onclick = closeFn;
    document.getElementById('btn-confirm-version-close').onclick = closeFn;
    overlay.onclick = (e) => { if (e.target === overlay) closeFn(); };
  }
};

window.App = App;

document.addEventListener('DOMContentLoaded', () => App.init());
