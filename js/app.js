/* ============================================================
   app.js — Main Application Controller
   Handles module registration, navigation, and lifecycle.
   ============================================================ */

const App = {
  currentModule: null,

  modules: {
    dashboard: typeof DashboardModule !== 'undefined' ? DashboardModule : null,
    gis: typeof GISModule !== 'undefined' ? GISModule : null,
    surveyors: typeof SurveyorsModule !== 'undefined' ? SurveyorsModule : null,
    population: typeof PopulationModule !== 'undefined' ? PopulationModule : null,
    reports: typeof ReportsModule !== 'undefined' ? ReportsModule : null
  },

  init() {
    this.setupNavigation();
    this.setupThemeToggle();
    this.navigateTo('dashboard');
  },

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
        this._updateChartColors(next);
      });
    }
  },

  _updateThemeLabel() {
    const label = document.querySelector('.theme-label');
    if (!label) return;
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    label.textContent = isLight ? 'Tema oscuro' : 'Tema claro';
  },

  _updateChartColors(theme) {
    const isLight = theme === 'light';
    Chart.defaults.color = isLight ? '#6b5a4e' : '#b0a49a';
    Chart.defaults.borderColor = isLight ? 'rgba(60, 36, 21, 0.08)' : 'rgba(176, 164, 154, 0.1)';
    // Re-render current module to apply new chart colors
    if (this.currentModule && this.modules[this.currentModule]) {
      const mod = this.modules[this.currentModule];
      try { mod.destroy(); } catch(e) {}
      try {
        mod.render();
        requestAnimationFrame(() => { try { mod.init(); } catch(e) {} });
      } catch(e) {}
    }
  },

  setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const moduleName = item.dataset.module;
        if (moduleName) {
          this.navigateTo(moduleName);
        }
      });
    });
  },

  navigateTo(moduleName) {
    // Destroy current module if active
    if (this.currentModule && this.modules[this.currentModule]) {
      try {
        this.modules[this.currentModule].destroy();
      } catch (err) {
        console.warn(`Error destroying module "${this.currentModule}":`, err);
      }
    }

    // Update nav active state
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.module === moduleName);
    });

    this.currentModule = moduleName;
    const module = this.modules[moduleName];

    if (!module) {
      const mainContent = document.getElementById('main-content');
      mainContent.innerHTML = `
        <div class="module-header">
          <h1>${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}</h1>
          <p class="module-subtitle">Módulo en desarrollo</p>
        </div>
        <div class="card fade-in" style="padding: 3rem; text-align: center;">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 1rem; opacity: 0.5;">
            <path d="M12 2v4"/>
            <path d="m16.2 7.8 2.9-2.9"/>
            <path d="M18 12h4"/>
            <path d="m16.2 16.2 2.9 2.9"/>
            <path d="M12 18v4"/>
            <path d="m4.9 19.1 2.9-2.9"/>
            <path d="M2 12h4"/>
            <path d="m4.9 4.9 2.9 2.9"/>
          </svg>
          <h2 style="color: var(--text-secondary); margin-bottom: 0.5rem;">Próximamente</h2>
          <p style="color: var(--text-muted);">Este módulo estará disponible en una próxima actualización.</p>
        </div>
      `;
      return;
    }

    // Render and initialize the module
    try {
      module.render();
      requestAnimationFrame(() => {
        try {
          module.init();
        } catch (err) {
          console.error(`Error initializing module "${moduleName}":`, err);
        }
      });
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
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
