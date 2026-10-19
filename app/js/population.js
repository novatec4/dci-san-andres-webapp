// =============================================================================
// POPULATION.JS — Módulo de Población Infantil (0 a 5 años)
// Proyecto DCI - Componente A.3.1 (Ayuda en Acción / ESPOCH)
// Versión v2.4.0 Oficial — Filtros Canónicos OMS, Conmutador Demo/Real,
// Paginación Dinámica (10-100) y Enlace Georreferenciado Directo al Mapa GIS
// =============================================================================

const PopulationModule = {
  currentPage: 1,
  pageSize: 20,
  filteredData: [],
  sortColumn: null,
  sortDirection: 'asc',
  expandedRow: null,

  // ---------------------------------------------------------------------------
  // render()
  // ---------------------------------------------------------------------------
  render() {
    const data = APP_DATA;
    const isRealMode = (data.getDataMode() === 'real');
    const children = isRealMode ? [] : data.children;
    const communities = data.communities;

    const totalCount = children.length;
    const avgAge = totalCount > 0 
      ? (children.reduce((sum, c) => sum + (c.ageMonths !== undefined ? c.ageMonths / 12 : c.age), 0) / totalCount).toFixed(1)
      : '0.0';
    const vacPct = totalCount > 0 ? Math.round((children.filter(c => c.vaccinationComplete).length / totalCount) * 100) : 0;
    const schoolPct = totalCount > 0 ? Math.round((children.filter(c => c.enrolledInSchool).length / totalCount) * 100) : 0;
    const normalPct = totalCount > 0 ? Math.round((children.filter(c => c.nutritionalStatus === 'Normal').length / totalCount) * 100) : 0;

    const statusOptions = [
      'Normal', 'Desnutrición Leve', 'Desnutrición Moderada',
      'Desnutrición Severa', 'Sobrepeso', 'Obesidad'
    ];

    const html = `
      <div class="population-module-view fade-in">
        
        <!-- Cabecera del Módulo con Conmutador Real/Demo y Acceso al Mapa -->
        <div class="module-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;margin-bottom:1.25rem;">
          <div>
            <div style="display:inline-flex;align-items:center;gap:0.4rem;background:rgba(232,115,74,0.15);color:var(--accent);padding:2px 8px;border-radius:20px;font-size:0.75rem;font-weight:700;margin-bottom:0.35rem;">
              <span>👶 CENSO POBLACIONAL INFANTIL</span>
              <span>•</span>
              <span>0 A 59 MESES CUMPLIDOS</span>
            </div>
            <h1 style="font-size:1.6rem;font-weight:800;color:var(--text-primary);margin:0;">Población Infantil Caracterizada</h1>
            <p class="module-subtitle" style="margin:0.25rem 0 0 0;font-size:0.85rem;color:var(--text-secondary);">
              Padrón nominal de niños/as en San Andrés • Z-scores WHO Anthro y Georreferenciación Catastral
            </p>
          </div>

          <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;">
            <!-- Botón Acceso Rápido al Mapa GIS -->
            <button class="btn btn-secondary btn-sm" onclick="App.navigateTo('gis')" style="display:inline-flex;align-items:center;gap:0.4rem;font-weight:700;color:var(--accent);border-color:rgba(232,115,74,0.4);padding:0.45rem 0.85rem;">
              🗺️ Ver Toda la Muestra en Mapa GIS
            </button>

            <!-- Conmutador de Datos Real vs Demo -->
            <div style="display:flex;align-items:center;gap:0.4rem;background:var(--bg-secondary);padding:4px;border-radius:10px;border:1px solid var(--border);">
              <button id="pop-btn-mode-real" class="btn" style="padding:5px 12px;font-size:0.78rem;font-weight:700;border-radius:6px;border:none;cursor:pointer;transition:var(--transition);${isRealMode ? 'background:#10B981;color:white;' : 'background:transparent;color:var(--text-muted);'}">
                🟢 Modo Real
              </button>
              <button id="pop-btn-mode-demo" class="btn" style="padding:5px 12px;font-size:0.78rem;font-weight:700;border-radius:6px;border:none;cursor:pointer;transition:var(--transition);${!isRealMode ? 'background:#E8734A;color:white;' : 'background:transparent;color:var(--text-muted);'}">
                🟡 Modo Demo (200)
              </button>
            </div>
          </div>
        </div>

        <!-- Banner de Contexto de Operación -->
        ${isRealMode ? `
          <div class="card fade-in" style="margin-bottom:1.5rem;border-left:4px solid #10B981;padding:1rem 1.25rem;background:rgba(16,185,129,0.06);border-radius:12px;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;">
              <div>
                <strong style="color:var(--text-primary);font-size:0.92rem;display:flex;align-items:center;gap:0.4rem;">
                  <span>📋</span> Línea Base en Preparación Operativa (Censo Real DCI)
                </strong>
                <p style="margin:0.25rem 0 0 0;font-size:0.8rem;color:var(--text-secondary);">
                  El padrón real de <strong>1.397 niños</strong> en San Andrés se poblará progresivamente desde KoBoToolbox a partir del <strong>05/10/2026</strong>. Para explorar filtros, tablas y cálculos clínicos ahora, active el <strong>Modo Demostración</strong>.
                </p>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- KPI Row -->
        <div class="kpi-grid fade-in" style="grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:1rem;margin-bottom:1.5rem;">
          <div class="kpi-card" style="padding:1.1rem;">
            <div class="kpi-label" style="font-size:0.78rem;text-transform:uppercase;color:var(--text-secondary);font-weight:700;">Total Registros</div>
            <div class="kpi-value" style="font-size:1.75rem;font-weight:800;color:var(--text-primary);margin-top:0.25rem;">${totalCount}</div>
            <span style="font-size:0.72rem;color:var(--text-muted);">${isRealMode ? 'Meta: 1.397 infantes' : 'Muestra sintética activa'}</span>
          </div>

          <div class="kpi-card" style="padding:1.1rem;">
            <div class="kpi-label" style="font-size:0.78rem;text-transform:uppercase;color:var(--text-secondary);font-weight:700;">Edad Promedio</div>
            <div class="kpi-value" style="font-size:1.75rem;font-weight:800;color:var(--accent);margin-top:0.25rem;">${avgAge} <small style="font-size:0.9rem;">años</small></div>
            <span style="font-size:0.72rem;color:var(--text-muted);">Población 0-59 meses</span>
          </div>

          <div class="kpi-card" style="padding:1.1rem;">
            <div class="kpi-label" style="font-size:0.78rem;text-transform:uppercase;color:var(--text-secondary);font-weight:700;">Vacunación Completa</div>
            <div class="kpi-value" style="font-size:1.75rem;font-weight:800;color:#10b981;margin-top:0.25rem;">${vacPct}%</div>
            <span style="font-size:0.72rem;color:var(--text-muted);">Esquema MSP Ecuador</span>
          </div>

          <div class="kpi-card" style="padding:1.1rem;">
            <div class="kpi-label" style="font-size:0.78rem;text-transform:uppercase;color:var(--text-secondary);font-weight:700;">Escolarizados</div>
            <div class="kpi-value" style="font-size:1.75rem;font-weight:800;color:#3b82f6;margin-top:0.25rem;">${schoolPct}%</div>
            <span style="font-size:0.72rem;color:var(--text-muted);">CDI / CNH / Inicial</span>
          </div>

          <div class="kpi-card" style="padding:1.1rem;">
            <div class="kpi-label" style="font-size:0.78rem;text-transform:uppercase;color:var(--text-secondary);font-weight:700;">Nutrición Adecuada</div>
            <div class="kpi-value" style="font-size:1.75rem;font-weight:800;color:#10b981;margin-top:0.25rem;">${normalPct}%</div>
            <span style="font-size:0.72rem;color:var(--text-muted);">Z-Score HAZ ≥ -2 DE</span>
          </div>
        </div>

        <!-- Filtros Integrados y Avanzados de Tabla -->
        <div class="card fade-in" style="margin-bottom:1.25rem;padding:1.25rem;border-radius:12px;">
          <div style="font-size:0.82rem;font-weight:700;color:var(--text-primary);margin-bottom:0.75rem;display:flex;align-items:center;justify-content:space-between;">
            <span style="display:flex;align-items:center;gap:0.4rem;">
              <span>🔍</span> Filtros Canónicos OMS y Segmentación de Campo:
            </span>
            <button id="pop-clear-filters" class="btn btn-secondary btn-sm" style="padding:3px 10px;font-size:0.75rem;">
              Limpiar Filtros
            </button>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:0.75rem;align-items:flex-end;">
            <!-- Búsqueda en texto -->
            <div class="filter-group">
              <label style="font-size:0.72rem;color:var(--text-secondary);display:block;margin-bottom:0.25rem;font-weight:600;">Buscar por Nombre / Apellido</label>
              <input type="text" id="pop-search" class="search-input" placeholder="🔍 Escribe un nombre..." style="width:100%;padding:0.5rem 0.75rem;background:var(--bg-tertiary);border:1px solid var(--border);border-radius:6px;font-size:0.82rem;color:var(--text-primary);">
            </div>

            <!-- Comunidad -->
            <div class="filter-group">
              <label style="font-size:0.72rem;color:var(--text-secondary);display:block;margin-bottom:0.25rem;font-weight:600;">Comunidad / Sector</label>
              <select id="pop-community" class="select-styled" style="width:100%;padding:0.5rem;background:var(--bg-tertiary);border:1px solid var(--border);border-radius:6px;font-size:0.82rem;color:var(--text-primary);">
                <option value="">Todas las comunidades</option>
                ${communities.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
              </select>
            </div>

            <!-- Grupos Etarios Canónicos OMS -->
            <div class="filter-group">
              <label style="font-size:0.72rem;color:var(--text-secondary);display:block;margin-bottom:0.25rem;font-weight:600;">Rango Etario Canónico OMS</label>
              <select id="pop-age-group" class="select-styled" style="width:100%;padding:0.5rem;background:var(--bg-tertiary);border:1px solid var(--border);border-radius:6px;font-size:0.82rem;color:var(--text-primary);">
                <option value="">Todos los rangos etarios</option>
                <option value="0-5">0 a 5 meses (Lactancia Exclusiva)</option>
                <option value="6-23">6 a 23 meses (Alimentación Complementaria)</option>
                <option value="24-59">24 a 59 meses (Preescolar / 2-4 años)</option>
              </select>
            </div>

            <!-- Estado Nutricional OMS -->
            <div class="filter-group">
              <label style="font-size:0.72rem;color:var(--text-secondary);display:block;margin-bottom:0.25rem;font-weight:600;">Diagnóstico Antropométrico</label>
              <select id="pop-nutrition" class="select-styled" style="width:100%;padding:0.5rem;background:var(--bg-tertiary);border:1px solid var(--border);border-radius:6px;font-size:0.82rem;color:var(--text-primary);">
                <option value="">Todos los estados</option>
                ${statusOptions.map(s => `<option value="${s}">${s}</option>`).join('')}
              </select>
            </div>

            <!-- Género -->
            <div class="filter-group">
              <label style="font-size:0.72rem;color:var(--text-secondary);display:block;margin-bottom:0.25rem;font-weight:600;">Sexo / Género</label>
              <select id="pop-gender" class="select-styled" style="width:100%;padding:0.5rem;background:var(--bg-tertiary);border:1px solid var(--border);border-radius:6px;font-size:0.82rem;color:var(--text-primary);">
                <option value="">Ambos géneros</option>
                <option value="M">Masculino (Niños)</option>
                <option value="F">Femenino (Niñas)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Barra Superior de Tabla & Paginación Dinámica Listbox -->
        <div class="fade-in" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;flex-wrap:wrap;gap:0.75rem;">
          <div id="pop-results-count" style="font-size:0.84rem;color:var(--text-secondary);font-weight:600;"></div>

          <div style="display:flex;align-items:center;gap:0.75rem;">
            <!-- Selector Dinámico de Registros por Página (10, 20, 30, 50, 100) -->
            <div style="display:inline-flex;align-items:center;gap:0.4rem;font-size:0.8rem;color:var(--text-secondary);">
              <label for="pop-page-size" style="font-weight:600;">Mostrar:</label>
              <select id="pop-page-size" class="select-styled" style="padding:4px 8px;border-radius:6px;background:var(--bg-secondary);border:1px solid var(--border);color:var(--text-primary);font-weight:700;font-size:0.8rem;">
                <option value="10">10 registros</option>
                <option value="20" selected>20 registros</option>
                <option value="30">30 registros</option>
                <option value="50">50 registros</option>
                <option value="100">100 registros</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Tabla de Datos -->
        <div class="card fade-in" style="padding:0;overflow:hidden;border-radius:12px;box-shadow:var(--shadow);">
          <div style="overflow-x:auto;">
            <table class="data-table" id="pop-table" style="font-size:0.84rem;width:100%;border-collapse:collapse;">
              <thead>
                <tr>
                  <th style="width:40px;text-align:center;">#</th>
                  <th data-col="name" class="pop-sortable" style="cursor:pointer;">Nombre Completo <span class="sort-indicator"></span></th>
                  <th data-col="age" class="pop-sortable" style="cursor:pointer;">Edad <span class="sort-indicator"></span></th>
                  <th data-col="gender" class="pop-sortable" style="cursor:pointer;">Sexo <span class="sort-indicator"></span></th>
                  <th data-col="community" class="pop-sortable" style="cursor:pointer;">Comunidad <span class="sort-indicator"></span></th>
                  <th data-col="nutritionalStatus" class="pop-sortable" style="cursor:pointer;">Estado Nutricional OMS <span class="sort-indicator"></span></th>
                  <th>Z-Score Talla (HAZ)</th>
                  <th style="text-align:center;">Vacunación</th>
                  <th style="text-align:center;">Agua Red</th>
                  <th style="text-align:center;">Acciones Georreferenciadas</th>
                </tr>
              </thead>
              <tbody id="pop-table-body">
              </tbody>
            </table>
          </div>
        </div>

        <!-- Paginador Inferior -->
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:1.25rem;flex-wrap:wrap;gap:1rem;" class="fade-in">
          <div style="font-size:0.8rem;color:var(--text-muted);">
            Proyecto DCI • Componente A.3.1 San Andrés (Guano)
          </div>

          <div style="display:inline-flex;align-items:center;gap:0.75rem;">
            <button id="pop-prev" class="btn btn-secondary btn-sm" style="padding:0.4rem 0.8rem;">← Anterior</button>
            <span id="pop-page-info" style="font-size:0.84rem;font-weight:700;color:var(--text-primary);"></span>
            <button id="pop-next" class="btn btn-secondary btn-sm" style="padding:0.4rem 0.8rem;">Siguiente →</button>
          </div>
        </div>

      </div>
    `;

    document.getElementById('main-content').innerHTML = html;
  },

  // ---------------------------------------------------------------------------
  // init()
  // ---------------------------------------------------------------------------
  init() {
    const isReal = (APP_DATA.getDataMode() === 'real');
    this.filteredData = isReal ? [] : [...APP_DATA.children];
    this.currentPage = 1;
    this.sortColumn = null;
    this.sortDirection = 'asc';
    this.expandedRow = null;

    this._renderTable();

    // Listeners de filtros
    const filterIds = ['pop-search', 'pop-community', 'pop-age-group', 'pop-nutrition', 'pop-gender'];
    filterIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => this._applyFilters());
        el.addEventListener('change', () => this._applyFilters());
      }
    });

    // Limpiar filtros
    const clearBtn = document.getElementById('pop-clear-filters');
    if (clearBtn) clearBtn.addEventListener('click', () => this._clearFilters());

    // Paginación botones
    const prevBtn = document.getElementById('pop-prev');
    const nextBtn = document.getElementById('pop-next');
    if (prevBtn) prevBtn.addEventListener('click', () => this._changePage(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => this._changePage(1));

    // Paginación selector de tamaño (10, 20, 30, 50, 100)
    const pageSizeSelect = document.getElementById('pop-page-size');
    if (pageSizeSelect) {
      pageSizeSelect.addEventListener('change', (e) => {
        this.pageSize = parseInt(e.target.value, 10) || 20;
        this.currentPage = 1;
        this._renderTable();
      });
    }

    // Conmutadores Real vs Demo
    const btnReal = document.getElementById('pop-btn-mode-real');
    if (btnReal) {
      btnReal.addEventListener('click', () => {
        APP_DATA.setDataMode('real');
      });
    }
    const btnDemo = document.getElementById('pop-btn-mode-demo');
    if (btnDemo) {
      btnDemo.addEventListener('click', () => {
        APP_DATA.setDataMode('demo');
      });
    }

    // Ordenamiento por encabezados
    document.querySelectorAll('.pop-sortable').forEach(th => {
      th.addEventListener('click', () => {
        const col = th.getAttribute('data-col');
        if (this.sortColumn === col) {
          this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
          this.sortColumn = col;
          this.sortDirection = 'asc';
        }
        this._applySort();
        this._renderTable();
      });
    });
  },

  // ---------------------------------------------------------------------------
  // Enlace directo al visor georreferenciado Leaflet (GIS)
  // ---------------------------------------------------------------------------
  openInMap(lat, lng, name, communityId) {
    if (window.App && typeof App.navigateTo === 'function') {
      App.navigateTo('gis');
      setTimeout(() => {
        if (window.GISModule && typeof GISModule.focusCoordinates === 'function') {
          const comm = APP_DATA.getCommunityById(communityId);
          const commName = comm ? comm.name : 'San Andrés';
          GISModule.focusCoordinates(lat, lng, 17, `👶 ${name} (${commName})`);
        }
      }, 420);
    }
  },

  // ---------------------------------------------------------------------------
  // Lógica Interna de Filtros
  // ---------------------------------------------------------------------------
  _applyFilters() {
    const isReal = (APP_DATA.getDataMode() === 'real');
    if (isReal) {
      this.filteredData = [];
      this._renderTable();
      return;
    }

    const search = (document.getElementById('pop-search')?.value || '').toLowerCase().trim();
    const communityVal = document.getElementById('pop-community')?.value || '';
    const ageGroupVal = document.getElementById('pop-age-group')?.value || '';
    const nutritionVal = document.getElementById('pop-nutrition')?.value || '';
    const genderVal = document.getElementById('pop-gender')?.value || '';

    this.filteredData = APP_DATA.children.filter(c => {
      // 1. Búsqueda
      if (search && !`${c.name} ${c.lastName || ''}`.toLowerCase().includes(search)) {
        return false;
      }
      // 2. Comunidad
      if (communityVal && c.communityId !== communityVal) {
        return false;
      }
      // 3. Grupos Etarios Canónicos OMS
      if (ageGroupVal) {
        const months = c.ageMonths !== undefined ? c.ageMonths : (c.age * 12);
        if (ageGroupVal === '0-5' && months > 5) return false;
        if (ageGroupVal === '6-23' && (months < 6 || months > 23)) return false;
        if (ageGroupVal === '24-59' && (months < 24 || months > 59)) return false;
      }
      // 4. Estado Nutricional
      if (nutritionVal && c.nutritionalStatus !== nutritionVal) {
        return false;
      }
      // 5. Género
      if (genderVal && c.gender !== genderVal) {
        return false;
      }
      return true;
    });

    this._applySort();
    this.currentPage = 1;
    this.expandedRow = null;
    this._renderTable();
  },

  _clearFilters() {
    const elSearch = document.getElementById('pop-search');
    const elComm = document.getElementById('pop-community');
    const elAge = document.getElementById('pop-age-group');
    const elNut = document.getElementById('pop-nutrition');
    const elGen = document.getElementById('pop-gender');

    if (elSearch) elSearch.value = '';
    if (elComm) elComm.value = '';
    if (elAge) elAge.value = '';
    if (elNut) elNut.value = '';
    if (elGen) elGen.value = '';

    const isReal = (APP_DATA.getDataMode() === 'real');
    this.filteredData = isReal ? [] : [...APP_DATA.children];
    this.sortColumn = null;
    this.sortDirection = 'asc';
    this.currentPage = 1;
    this.expandedRow = null;
    this._renderTable();
  },

  _applySort() {
    if (!this.sortColumn) return;

    const col = this.sortColumn;
    const dir = this.sortDirection === 'asc' ? 1 : -1;

    this.filteredData.sort((a, b) => {
      let valA, valB;
      switch (col) {
        case 'name':
          valA = `${a.name} ${a.lastName || ''}`.toLowerCase();
          valB = `${b.name} ${b.lastName || ''}`.toLowerCase();
          return valA < valB ? -dir : valA > valB ? dir : 0;
        case 'age':
          valA = a.ageMonths !== undefined ? a.ageMonths : a.age;
          valB = b.ageMonths !== undefined ? b.ageMonths : b.age;
          return (valA - valB) * dir;
        case 'gender':
          return (a.gender < b.gender ? -1 : 1) * dir;
        case 'community':
          const commA = (APP_DATA.getCommunityById(a.communityId) || {}).name || '';
          const commB = (APP_DATA.getCommunityById(b.communityId) || {}).name || '';
          return commA < commB ? -dir : commA > commB ? dir : 0;
        case 'nutritionalStatus':
          return (a.nutritionalStatus < b.nutritionalStatus ? -dir : a.nutritionalStatus > b.nutritionalStatus ? dir : 0);
        default:
          return 0;
      }
    });
  },

  _nutritionalBadge(status) {
    const map = {
      'Normal': 'badge-success',
      'Desnutrición Leve': 'badge-warning',
      'Desnutrición Moderada': 'badge-danger',
      'Desnutrición Severa': 'badge-danger',
      'Sobrepeso': 'badge-info',
      'Obesidad': 'badge-purple'
    };
    return `<span class="badge ${map[status] || ''}">${status}</span>`;
  },

  _boolIcon(val) {
    return val
      ? '<span style="color:#10b981;font-weight:bold;font-size:0.95rem;">✓</span>'
      : '<span style="color:#ef4444;font-weight:bold;font-size:0.95rem;">✗</span>';
  },

  _genderIcon(g) {
    return g === 'M'
      ? '<span style="color:#3b82f6;font-weight:700;">♂ M</span>'
      : '<span style="color:#ec4899;font-weight:700;">♀ F</span>';
  },

  _renderTable() {
    const tbody = document.getElementById('pop-table-body');
    if (!tbody) return;

    const isReal = (APP_DATA.getDataMode() === 'real');
    if (isReal) {
      tbody.innerHTML = `
        <tr>
          <td colspan="10" style="text-align:center;padding:3rem 1.5rem;color:var(--text-muted);">
            <div style="font-size:2.2rem;margin-bottom:0.75rem;">⏳</div>
            <strong style="color:var(--text-primary);font-size:1rem;display:block;margin-bottom:0.35rem;">
              Línea Base en Espera de Levantamiento en Terreno
            </strong>
            <span style="font-size:0.85rem;line-height:1.5;">
              La captura con KoBoToolbox para los <strong>1.397 niños</strong> de San Andrés iniciará el 05/10/2026.<br>
              Pulse el botón <strong>"Modo Demo (200)"</strong> arriba para probar los 200 registros de validación.
            </span>
          </td>
        </tr>
      `;
      const countEl = document.getElementById('pop-results-count');
      if (countEl) countEl.textContent = 'Mostrando 0 de 0 registros (Línea Base)';
      const pageInfo = document.getElementById('pop-page-info');
      if (pageInfo) pageInfo.textContent = 'Página 1 de 1';
      return;
    }

    const total = this.filteredData.length;
    const totalPages = Math.max(1, Math.ceil(total / this.pageSize));
    if (this.currentPage > totalPages) this.currentPage = totalPages;

    const start = (this.currentPage - 1) * this.pageSize;
    const end = Math.min(start + this.pageSize, total);
    const pageData = this.filteredData.slice(start, end);

    // Actualizar conteo
    const countEl = document.getElementById('pop-results-count');
    if (countEl) countEl.textContent = `Mostrando ${total > 0 ? start + 1 : 0}–${end} de ${total} registros infantiles`;

    // Actualizar indicador de página
    const pageInfo = document.getElementById('pop-page-info');
    if (pageInfo) pageInfo.textContent = `Página ${this.currentPage} de ${totalPages}`;

    // Estado botones de paginación
    const prevBtn = document.getElementById('pop-prev');
    const nextBtn = document.getElementById('pop-next');
    if (prevBtn) prevBtn.disabled = this.currentPage <= 1;
    if (nextBtn) nextBtn.disabled = this.currentPage >= totalPages;

    // Actualizar indicador de ordenamiento
    document.querySelectorAll('.pop-sortable .sort-indicator').forEach(span => {
      span.textContent = '';
    });
    if (this.sortColumn) {
      const activeTh = document.querySelector(`.pop-sortable[data-col="${this.sortColumn}"] .sort-indicator`);
      if (activeTh) activeTh.textContent = this.sortDirection === 'asc' ? ' ▲' : ' ▼';
    }

    if (pageData.length === 0) {
      tbody.innerHTML = `
        <tr><td colspan="10" style="text-align:center;padding:3rem;">
          <div class="empty-state">
            <div style="font-size:2.2rem;margin-bottom:0.5rem;">📭</div>
            <strong style="color:var(--text-primary);font-size:0.95rem;display:block;">No se encontraron infantes con los filtros seleccionados</strong>
            <span style="font-size:0.8rem;color:var(--text-muted);">Intente modificar o limpiar los criterios de búsqueda.</span>
          </div>
        </td></tr>
      `;
      return;
    }

    let rows = '';
    pageData.forEach((child, i) => {
      const rowNum = start + i + 1;
      const community = APP_DATA.getCommunityById(child.communityId);
      const isExpanded = this.expandedRow === child.id;
      const ageStr = child.ageMonths !== undefined 
        ? `${child.ageMonths}m (${child.age}a)` 
        : `${child.age} años`;
      const hazStr = child.haz !== undefined ? (child.haz > 0 ? `+${child.haz.toFixed(2)}` : child.haz.toFixed(2)) : '—';

      rows += `
        <tr class="pop-row" data-id="${child.id}" style="cursor:pointer;${isExpanded ? 'background:rgba(232,115,74,0.08);' : ''}" onclick="PopulationModule._toggleRow('${child.id}')">
          <td style="text-align:center;color:var(--text-muted);font-weight:600;">${rowNum}</td>
          <td style="font-weight:700;color:var(--text-primary);">${child.name} ${child.lastName || ''}</td>
          <td>${ageStr}</td>
          <td>${this._genderIcon(child.gender)}</td>
          <td>
            <span style="display:inline-flex;align-items:center;gap:0.35rem;">
              <span class="status-dot" style="background:${community ? community.color : '#94a3b8'};width:8px;height:8px;border-radius:50%;display:inline-block;"></span>
              ${community ? community.name : '—'}
            </span>
          </td>
          <td>${this._nutritionalBadge(child.nutritionalStatus)}</td>
          <td><code style="font-weight:700;font-size:0.82rem;color:${child.isDCI ? '#ef4444' : 'var(--text-primary)'};">${hazStr}</code></td>
          <td style="text-align:center;">${this._boolIcon(child.vaccinated)}</td>
          <td style="text-align:center;">${this._boolIcon(child.accessWater)}</td>
          <td style="text-align:center;">
            <div style="display:inline-flex;align-items:center;gap:0.35rem;" onclick="event.stopPropagation();">
              <button class="btn btn-sm" title="Localizar en Mapa GIS" onclick="PopulationModule.openInMap(${child.lat}, ${child.lng}, '${child.name}', '${child.communityId}')" style="padding:3px 8px;font-size:0.75rem;background:rgba(232,115,74,0.12);color:var(--accent);border:1px solid rgba(232,115,74,0.3);border-radius:6px;font-weight:700;">
                🗺️ Mapa
              </button>
              <button class="btn btn-sm btn-secondary" title="Ver ficha clínica detallada" onclick="PopulationModule._toggleRow('${child.id}')" style="padding:3px 7px;font-size:0.75rem;">
                ${isExpanded ? '▲' : '▼'}
              </button>
            </div>
          </td>
        </tr>
      `;

      if (isExpanded) {
        const surveyor = APP_DATA.getSurveyorById(child.surveyorId);
        rows += `
          <tr class="pop-detail-row">
            <td colspan="10" style="padding:1.25rem 1.5rem;background:rgba(232,115,74,0.03);border-left:4px solid var(--accent);">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
                <strong style="color:var(--accent);font-size:0.88rem;display:flex;align-items:center;gap:0.4rem;">
                  <span>📋</span> Ficha Clínica Antropométrica (OMS LMS 2006) — ID: CGPI-${String(child.id).padStart(4, '0')}
                </strong>
                <button class="btn btn-primary btn-sm" onclick="PopulationModule.openInMap(${child.lat}, ${child.lng}, '${child.name}', '${child.communityId}')" style="padding:4px 10px;font-size:0.75rem;gap:0.4rem;">
                  🗺️ Enfocar en Visor GIS con Coordenadas Exactas
                </button>
              </div>

              <div class="grid-3" style="gap:1rem;margin-bottom:1rem;">
                <div style="background:var(--bg-secondary);padding:0.75rem;border-radius:8px;border:1px solid var(--border);">
                  <div style="font-size:0.72rem;color:var(--text-muted);text-transform:uppercase;">Coordenadas GPS</div>
                  <div style="font-size:0.85rem;font-weight:700;color:var(--text-primary);font-family:monospace;margin-top:2px;">
                    ${child.lat.toFixed(5)}, ${child.lng.toFixed(5)}
                  </div>
                </div>

                <div style="background:var(--bg-secondary);padding:0.75rem;border-radius:8px;border:1px solid var(--border);">
                  <div style="font-size:0.72rem;color:var(--text-muted);text-transform:uppercase;">Mediciones Físicas</div>
                  <div style="font-size:0.85rem;font-weight:700;color:var(--text-primary);margin-top:2px;">
                    Peso: <strong>${child.weight} kg</strong> • Talla: <strong>${child.height} cm</strong>
                  </div>
                </div>

                <div style="background:var(--bg-secondary);padding:0.75rem;border-radius:8px;border:1px solid var(--border);">
                  <div style="font-size:0.72rem;color:var(--text-muted);text-transform:uppercase;">Z-Scores OMS Calculados</div>
                  <div style="font-size:0.82rem;font-weight:700;color:var(--text-primary);margin-top:2px;">
                    HAZ: <code>${hazStr}</code> • WAZ: <code>${child.waz !== undefined ? child.waz.toFixed(2) : '—'}</code> • WHZ: <code>${child.whz !== undefined ? child.whz.toFixed(2) : '—'}</code>
                  </div>
                </div>
              </div>

              <div style="display:flex;flex-wrap:wrap;gap:1.5rem;font-size:0.8rem;color:var(--text-secondary);background:var(--bg-secondary);padding:0.75rem 1rem;border-radius:8px;border:1px solid var(--border);">
                <div><strong>Hogar:</strong> ${child.householdSize || 4} miembros (Nivel socioeconómico: ${child.householdIncome || 'Medio-Bajo'})</div>
                <div><strong>Encuestador Acreditado:</strong> ${surveyor ? `${surveyor.name} ${surveyor.lastName}` : 'Brigada 1 ESPOCH'}</div>
                <div><strong>Fecha de Captura:</strong> ${child.surveyDate || '2026-06-15'}</div>
                <div><strong>Acceso a Red de Agua:</strong> ${this._boolIcon(child.accessWater)}</div>
                <div><strong>Saneamiento:</strong> ${this._boolIcon(child.accessHealth)}</div>
              </div>
            </td>
          </tr>
        `;
      }
    });

    tbody.innerHTML = rows;
  },

  _toggleRow(childId) {
    const numId = parseInt(childId, 10);
    this.expandedRow = this.expandedRow === numId ? null : numId;
    this._renderTable();
  },

  _changePage(delta) {
    const totalPages = Math.max(1, Math.ceil(this.filteredData.length / this.pageSize));
    const newPage = this.currentPage + delta;
    if (newPage >= 1 && newPage <= totalPages) {
      this.currentPage = newPage;
      this.expandedRow = null;
      this._renderTable();
      const table = document.getElementById('pop-table');
      if (table) table.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  },

  destroy() {
    this.expandedRow = null;
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PopulationModule;
}
if (typeof window !== 'undefined') {
  window.PopulationModule = PopulationModule;
}
