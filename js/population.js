// =============================================================================
// Population Module – Población Infantil
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
    const children = APP_DATA.children;
    const communities = APP_DATA.communities;

    const totalCount = children.length;
    const avgAge = (children.reduce((sum, c) => sum + c.age, 0) / totalCount).toFixed(1);
    const vacPct = Math.round((children.filter(c => c.vaccinationComplete).length / totalCount) * 100);
    const schoolPct = Math.round((children.filter(c => c.enrolledInSchool).length / totalCount) * 100);
    const normalPct = Math.round((children.filter(c => c.nutritionalStatus === 'Normal').length / totalCount) * 100);

    const statusOptions = [
      'Normal', 'Desnutrición Leve', 'Desnutrición Moderada',
      'Desnutrición Severa', 'Sobrepeso', 'Obesidad'
    ];

    const html = `
      <div class="module-header fade-in">
        <div>
          <h1>👶 Población Infantil</h1>
          <span>Registro de niños y niñas encuestados</span>
        </div>
      </div>

      <!-- KPI Row -->
      <div class="kpi-grid fade-in" style="grid-template-columns:repeat(5,1fr);">
        <div class="kpi-card">
          <div class="kpi-icon">📊</div>
          <div>
            <div class="kpi-value">${totalCount}</div>
            <div class="kpi-label">Total Registros</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon">🎂</div>
          <div>
            <div class="kpi-value">${avgAge}</div>
            <div class="kpi-label">Edad Promedio</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon">💉</div>
          <div>
            <div class="kpi-value" style="color:#22c55e;">${vacPct}%</div>
            <div class="kpi-label">Vacunación Completa</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon">🎓</div>
          <div>
            <div class="kpi-value" style="color:#3b82f6;">${schoolPct}%</div>
            <div class="kpi-label">Escolarizados</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon">🥗</div>
          <div>
            <div class="kpi-value" style="color:#22c55e;">${normalPct}%</div>
            <div class="kpi-label">Estado Nutricional Normal</div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="card fade-in" style="margin-bottom:1rem;padding:1rem 1.5rem;">
        <div style="display:flex;flex-wrap:wrap;gap:.75rem;align-items:flex-end;">
          <div class="filter-group" style="flex:1;min-width:200px;">
            <label style="font-size:.75rem;color:var(--text-secondary);display:block;margin-bottom:.25rem;">Buscar</label>
            <input type="text" id="pop-search" class="search-input" placeholder="🔍 Nombre del niño/a...">
          </div>
          <div class="filter-group">
            <label style="font-size:.75rem;color:var(--text-secondary);display:block;margin-bottom:.25rem;">Comunidad</label>
            <select id="pop-community" class="select-styled">
              <option value="">Todas</option>
              ${communities.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
            </select>
          </div>
          <div class="filter-group" style="display:flex;gap:.4rem;align-items:flex-end;">
            <div>
              <label style="font-size:.75rem;color:var(--text-secondary);display:block;margin-bottom:.25rem;">Edad mín</label>
              <input type="number" id="pop-age-min" class="search-input" placeholder="0" min="0" max="17" style="width:70px;">
            </div>
            <div>
              <label style="font-size:.75rem;color:var(--text-secondary);display:block;margin-bottom:.25rem;">Edad máx</label>
              <input type="number" id="pop-age-max" class="search-input" placeholder="17" min="0" max="17" style="width:70px;">
            </div>
          </div>
          <div class="filter-group">
            <label style="font-size:.75rem;color:var(--text-secondary);display:block;margin-bottom:.25rem;">Estado Nutricional</label>
            <select id="pop-nutrition" class="select-styled">
              <option value="">Todos</option>
              ${statusOptions.map(s => `<option value="${s}">${s}</option>`).join('')}
            </select>
          </div>
          <div class="filter-group">
            <label style="font-size:.75rem;color:var(--text-secondary);display:block;margin-bottom:.25rem;">Género</label>
            <select id="pop-gender" class="select-styled">
              <option value="">Todos</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>
          <button id="pop-clear-filters" class="btn btn-secondary btn-sm" style="height:38px;">Limpiar Filtros</button>
        </div>
      </div>

      <!-- Results count -->
      <div class="fade-in" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.75rem;">
        <div id="pop-results-count" style="font-size:.85rem;color:var(--text-secondary);"></div>
      </div>

      <!-- Table -->
      <div class="card fade-in" style="padding:0;overflow:hidden;">
        <div style="overflow-x:auto;">
          <table class="data-table" id="pop-table">
            <thead>
              <tr>
                <th style="width:40px;">#</th>
                <th data-col="name" class="pop-sortable" style="cursor:pointer;">Nombre Completo <span class="sort-indicator"></span></th>
                <th data-col="age" class="pop-sortable" style="cursor:pointer;">Edad <span class="sort-indicator"></span></th>
                <th data-col="gender" class="pop-sortable" style="cursor:pointer;">Género <span class="sort-indicator"></span></th>
                <th data-col="community" class="pop-sortable" style="cursor:pointer;">Comunidad <span class="sort-indicator"></span></th>
                <th data-col="nutritionalStatus" class="pop-sortable" style="cursor:pointer;">Estado Nutricional <span class="sort-indicator"></span></th>
                <th>Vacunado</th>
                <th>Escolarizado</th>
                <th>Acceso Agua</th>
              </tr>
            </thead>
            <tbody id="pop-table-body">
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div style="display:flex;justify-content:center;align-items:center;gap:1rem;margin-top:1rem;" class="fade-in">
        <button id="pop-prev" class="btn btn-secondary btn-sm">← Anterior</button>
        <span id="pop-page-info" style="font-size:.85rem;color:var(--text-secondary);"></span>
        <button id="pop-next" class="btn btn-secondary btn-sm">Siguiente →</button>
      </div>
    `;

    document.getElementById('main-content').innerHTML = html;
  },

  // ---------------------------------------------------------------------------
  // init()
  // ---------------------------------------------------------------------------
  init() {
    this.filteredData = [...APP_DATA.children];
    this.currentPage = 1;
    this.sortColumn = null;
    this.sortDirection = 'asc';
    this.expandedRow = null;

    this._renderTable();

    // Filter listeners
    const ids = ['pop-search', 'pop-community', 'pop-age-min', 'pop-age-max', 'pop-nutrition', 'pop-gender'];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', () => this._applyFilters());
      if (el && el.tagName === 'SELECT') el.addEventListener('change', () => this._applyFilters());
    });

    // Clear filters
    const clearBtn = document.getElementById('pop-clear-filters');
    if (clearBtn) clearBtn.addEventListener('click', () => this._clearFilters());

    // Pagination
    const prevBtn = document.getElementById('pop-prev');
    const nextBtn = document.getElementById('pop-next');
    if (prevBtn) prevBtn.addEventListener('click', () => this._changePage(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => this._changePage(1));

    // Sort headers
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
  // Internal helpers
  // ---------------------------------------------------------------------------
  _applyFilters() {
    const search = (document.getElementById('pop-search').value || '').toLowerCase();
    const communityVal = document.getElementById('pop-community').value;
    const ageMin = parseInt(document.getElementById('pop-age-min').value) || 0;
    const ageMax = parseInt(document.getElementById('pop-age-max').value) || 99;
    const nutritionVal = document.getElementById('pop-nutrition').value;
    const genderVal = document.getElementById('pop-gender').value;

    this.filteredData = APP_DATA.children.filter(c => {
      if (search && !`${c.name} ${c.lastName}`.toLowerCase().includes(search)) return false;
      if (communityVal && c.communityId !== communityVal) return false;
      if (c.age < ageMin || c.age > ageMax) return false;
      if (nutritionVal && c.nutritionalStatus !== nutritionVal) return false;
      if (genderVal && c.gender !== genderVal) return false;
      return true;
    });

    this._applySort();
    this.currentPage = 1;
    this.expandedRow = null;
    this._renderTable();
  },

  _clearFilters() {
    document.getElementById('pop-search').value = '';
    document.getElementById('pop-community').value = '';
    document.getElementById('pop-age-min').value = '';
    document.getElementById('pop-age-max').value = '';
    document.getElementById('pop-nutrition').value = '';
    document.getElementById('pop-gender').value = '';
    this.filteredData = [...APP_DATA.children];
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
          valA = `${a.name} ${a.lastName}`.toLowerCase();
          valB = `${b.name} ${b.lastName}`.toLowerCase();
          return valA < valB ? -dir : valA > valB ? dir : 0;
        case 'age':
          return (a.age - b.age) * dir;
        case 'gender':
          return a.gender < b.gender ? -dir : a.gender > b.gender ? dir : 0;
        case 'community':
          const commA = (APP_DATA.getCommunityById(a.communityId) || {}).name || '';
          const commB = (APP_DATA.getCommunityById(b.communityId) || {}).name || '';
          return commA < commB ? -dir : commA > commB ? dir : 0;
        case 'nutritionalStatus':
          return a.nutritionalStatus < b.nutritionalStatus ? -dir : a.nutritionalStatus > b.nutritionalStatus ? dir : 0;
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
      ? '<span style="color:#22c55e;font-weight:bold;">✓</span>'
      : '<span style="color:#ef4444;font-weight:bold;">✗</span>';
  },

  _genderIcon(g) {
    return g === 'M'
      ? '<span style="color:#3b82f6;">♂ M</span>'
      : '<span style="color:#ec4899;">♀ F</span>';
  },

  _renderTable() {
    const tbody = document.getElementById('pop-table-body');
    if (!tbody) return;

    const total = this.filteredData.length;
    const totalPages = Math.max(1, Math.ceil(total / this.pageSize));
    if (this.currentPage > totalPages) this.currentPage = totalPages;

    const start = (this.currentPage - 1) * this.pageSize;
    const end = Math.min(start + this.pageSize, total);
    const pageData = this.filteredData.slice(start, end);

    // Update count
    const countEl = document.getElementById('pop-results-count');
    if (countEl) countEl.textContent = `Mostrando ${total > 0 ? start + 1 : 0}–${end} de ${total} registros`;

    // Update page info
    const pageInfo = document.getElementById('pop-page-info');
    if (pageInfo) pageInfo.textContent = `Página ${this.currentPage} de ${totalPages}`;

    // Update button states
    const prevBtn = document.getElementById('pop-prev');
    const nextBtn = document.getElementById('pop-next');
    if (prevBtn) prevBtn.disabled = this.currentPage <= 1;
    if (nextBtn) nextBtn.disabled = this.currentPage >= totalPages;

    // Update sort indicators
    document.querySelectorAll('.pop-sortable .sort-indicator').forEach(span => {
      span.textContent = '';
    });
    if (this.sortColumn) {
      const activeTh = document.querySelector(`.pop-sortable[data-col="${this.sortColumn}"] .sort-indicator`);
      if (activeTh) activeTh.textContent = this.sortDirection === 'asc' ? ' ▲' : ' ▼';
    }

    // Render rows
    if (pageData.length === 0) {
      tbody.innerHTML = `
        <tr><td colspan="9" style="text-align:center;padding:3rem;">
          <div class="empty-state">
            <div style="font-size:2rem;margin-bottom:.5rem;">📭</div>
            <div>No se encontraron registros</div>
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

      rows += `
        <tr class="pop-row" data-id="${child.id}" style="cursor:pointer;${isExpanded ? 'background:rgba(99,102,241,.08);' : ''}" onclick="PopulationModule._toggleRow('${child.id}')">
          <td>${rowNum}</td>
          <td style="font-weight:500;">${child.name} ${child.lastName}</td>
          <td>${child.age} años</td>
          <td>${this._genderIcon(child.gender)}</td>
          <td>
            <span style="display:inline-flex;align-items:center;gap:.35rem;">
              <span class="status-dot" style="background:${community ? community.color : '#94a3b8'};"></span>
              ${community ? community.name : '—'}
            </span>
          </td>
          <td>${this._nutritionalBadge(child.nutritionalStatus)}</td>
          <td style="text-align:center;">${this._boolIcon(child.vaccinated)}</td>
          <td style="text-align:center;">${this._boolIcon(child.enrolledInSchool)}</td>
          <td style="text-align:center;">${this._boolIcon(child.accessWater)}</td>
        </tr>
      `;

      if (isExpanded) {
        const surveyor = APP_DATA.getSurveyorById(child.surveyorId);
        rows += `
          <tr class="pop-detail-row">
            <td colspan="9" style="padding:1.25rem 1.5rem;background:rgba(99,102,241,.04);border-left:3px solid var(--primary);">
              <div class="grid-3" style="gap:1rem;">
                <div>
                  <div class="stat-label">Fecha Nacimiento</div>
                  <div class="stat-value" style="font-size:.9rem;">${child.birthDate}</div>
                </div>
                <div>
                  <div class="stat-label">Peso</div>
                  <div class="stat-value" style="font-size:.9rem;">${child.weight} kg</div>
                </div>
                <div>
                  <div class="stat-label">Talla</div>
                  <div class="stat-value" style="font-size:.9rem;">${child.height} cm</div>
                </div>
                <div>
                  <div class="stat-label">IMC</div>
                  <div class="stat-value" style="font-size:.9rem;">${child.bmi}</div>
                </div>
                <div>
                  <div class="stat-label">Tamaño del Hogar</div>
                  <div class="stat-value" style="font-size:.9rem;">${child.householdSize} personas</div>
                </div>
                <div>
                  <div class="stat-label">Ingreso del Hogar</div>
                  <div class="stat-value" style="font-size:.9rem;">${child.householdIncome}</div>
                </div>
                <div>
                  <div class="stat-label">Encuestador</div>
                  <div class="stat-value" style="font-size:.9rem;">${surveyor ? `${surveyor.name} ${surveyor.lastName}` : '—'}</div>
                </div>
                <div>
                  <div class="stat-label">Fecha Encuesta</div>
                  <div class="stat-value" style="font-size:.9rem;">${child.surveyDate}</div>
                </div>
                <div>
                  <div class="stat-label">Grado Escolar</div>
                  <div class="stat-value" style="font-size:.9rem;">${child.gradeLevel || '—'}</div>
                </div>
              </div>

              <div style="margin-top:1rem;display:flex;flex-wrap:wrap;gap:1rem;">
                <div style="font-size:.8rem;">
                  Acceso Salud: ${this._boolIcon(child.accessHealth)} &nbsp;
                  Acceso Educación: ${this._boolIcon(child.accessEducation)} &nbsp;
                  Acceso Agua: ${this._boolIcon(child.accessWater)} &nbsp;
                  Acceso Internet: ${this._boolIcon(child.accessInternet)}
                </div>
              </div>

              ${child.observations ? `
                <div style="margin-top:.75rem;padding:.75rem;background:rgba(255,255,255,.03);border-radius:8px;border:1px solid rgba(255,255,255,.06);">
                  <div class="stat-label" style="margin-bottom:.25rem;">Observaciones</div>
                  <div style="font-size:.85rem;color:var(--text-secondary);">${child.observations}</div>
                </div>
              ` : ''}
            </td>
          </tr>
        `;
      }
    });

    tbody.innerHTML = rows;
  },

  _toggleRow(childId) {
    this.expandedRow = this.expandedRow === childId ? null : childId;
    this._renderTable();
  },

  _changePage(delta) {
    const totalPages = Math.max(1, Math.ceil(this.filteredData.length / this.pageSize));
    const newPage = this.currentPage + delta;
    if (newPage >= 1 && newPage <= totalPages) {
      this.currentPage = newPage;
      this.expandedRow = null;
      this._renderTable();
      // Scroll to top of table
      const table = document.getElementById('pop-table');
      if (table) table.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  },

  // ---------------------------------------------------------------------------
  // destroy()
  // ---------------------------------------------------------------------------
  destroy() {
    this.expandedRow = null;
  }
};
