// =============================================================================
// Surveyors Module – Encuestadores
// =============================================================================
const SurveyorsModule = {

  // ---------------------------------------------------------------------------
  // render()
  // ---------------------------------------------------------------------------
  render() {
    const surveyors = APP_DATA.surveyors;
    const communities = APP_DATA.communities;

    const totalCount = surveyors.length;
    const activoCount = surveyors.filter(s => s.status === 'activo').length;
    const enCampoCount = surveyors.filter(s => s.status === 'en-campo').length;
    const inactivoCount = surveyors.filter(s => s.status === 'inactivo').length;

    const html = `
      <div class="module-header fade-in">
        <div>
          <h1>👥 Encuestadores</h1>
          <span>Gestión y seguimiento del equipo de campo</span>
        </div>
      </div>

      <!-- KPI Row -->
      <div class="kpi-grid fade-in" style="grid-template-columns:repeat(4,1fr);">
        <div class="kpi-card">
          <div class="kpi-icon">👥</div>
          <div>
            <div class="kpi-value">${totalCount}</div>
            <div class="kpi-label">Total Encuestadores</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon">✅</div>
          <div>
            <div class="kpi-value" style="color:#22c55e;">${activoCount}</div>
            <div class="kpi-label">Activos</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon">📋</div>
          <div>
            <div class="kpi-value" style="color:#3b82f6;">${enCampoCount}</div>
            <div class="kpi-label">En Campo</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon">⏸️</div>
          <div>
            <div class="kpi-value" style="color:#ef4444;">${inactivoCount}</div>
            <div class="kpi-label">Inactivos</div>
          </div>
        </div>
      </div>

      <!-- Search & Filter -->
      <div class="card fade-in" style="margin-bottom:1rem;padding:1rem 1.5rem;">
        <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center;">
          <input type="text" id="surveyor-search" class="search-input" placeholder="🔍 Buscar encuestador por nombre..." style="flex:1;min-width:220px;">
          <div class="filter-group">
            <select id="surveyor-filter-zone" class="select-styled">
              <option value="">Todas las zonas</option>
              ${communities.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
            </select>
          </div>
        </div>
      </div>

      <!-- Surveyor Grid -->
      <div id="surveyors-grid" class="grid-3 fade-in">
        <!-- Cards injected dynamically -->
      </div>

      <!-- Detail Modal -->
      <div id="surveyor-modal-overlay" style="
        display:none;position:fixed;top:0;left:0;width:100%;height:100%;
        background:rgba(0,0,0,.6);backdrop-filter:blur(4px);
        z-index:9999;align-items:center;justify-content:center;
      ">
        <div id="surveyor-modal-content" class="card" style="
          max-width:720px;width:90%;max-height:85vh;overflow-y:auto;
          padding:2rem;position:relative;margin:auto;
        ">
          <!-- Filled dynamically -->
        </div>
      </div>
    `;

    document.getElementById('main-content').innerHTML = html;
  },

  // ---------------------------------------------------------------------------
  // init()
  // ---------------------------------------------------------------------------
  init() {
    this._renderCards(APP_DATA.surveyors);

    const searchInput = document.getElementById('surveyor-search');
    const zoneFilter = document.getElementById('surveyor-filter-zone');

    if (searchInput) searchInput.addEventListener('input', () => this._applyFilters());
    if (zoneFilter) zoneFilter.addEventListener('change', () => this._applyFilters());

    // Modal close on overlay click
    const overlay = document.getElementById('surveyor-modal-overlay');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) this._closeModal();
      });
    }

    // Listen for escape key to close modal
    this._escHandler = (e) => { if (e.key === 'Escape') this._closeModal(); };
    document.addEventListener('keydown', this._escHandler);
  },

  // ---------------------------------------------------------------------------
  // Internal helpers
  // ---------------------------------------------------------------------------
  _applyFilters() {
    const searchVal = (document.getElementById('surveyor-search').value || '').toLowerCase();
    const zoneVal = document.getElementById('surveyor-filter-zone').value;

    let filtered = APP_DATA.surveyors;

    if (searchVal) {
      filtered = filtered.filter(s =>
        `${s.name} ${s.lastName}`.toLowerCase().includes(searchVal)
      );
    }
    if (zoneVal) {
      filtered = filtered.filter(s => s.zone === zoneVal);
    }

    this._renderCards(filtered);
  },

  _getStatusBadge(status) {
    const map = {
      'activo': { cls: 'badge badge-success', text: 'Activo' },
      'en-campo': { cls: 'badge badge-info', text: 'En Campo' },
      'inactivo': { cls: 'badge badge-danger', text: 'Inactivo' }
    };
    const cfg = map[status] || { cls: 'badge', text: status };
    return `<span class="${cfg.cls}">${cfg.text}</span>`;
  },

  _getCommunityColor(zone) {
    const community = APP_DATA.communities.find(c => c.name === zone);
    return community ? community.color : '#94a3b8';
  },

  _renderCards(list) {
    const grid = document.getElementById('surveyors-grid');
    if (!grid) return;

    if (list.length === 0) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;padding:3rem;text-align:center;">
        <div style="font-size:2.5rem;margin-bottom:.75rem;">🔍</div>
        <div style="font-size:1.1rem;color:var(--text-secondary);">No se encontraron encuestadores</div>
      </div>`;
      return;
    }

    grid.innerHTML = list.map(s => {
      const pct = s.targetSurveys > 0 ? Math.round((s.completedSurveys / s.targetSurveys) * 100) : 0;
      const communityColor = this._getCommunityColor(s.zone);

      return `
        <div class="card" style="padding:1.5rem;display:flex;flex-direction:column;gap:.75rem;">
          <!-- Avatar + Name -->
          <div style="display:flex;align-items:center;gap:.85rem;">
            <div class="avatar" style="background:${communityColor};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.85rem;color:white;flex-shrink:0;">
              ${s.avatar}
            </div>
            <div style="flex:1;min-width:0;">
              <div style="font-weight:600;font-size:1rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                ${s.name} ${s.lastName}
              </div>
              <div style="display:flex;align-items:center;gap:.4rem;font-size:.8rem;color:var(--text-secondary);margin-top:.15rem;">
                <span class="status-dot" style="background:${communityColor};"></span>
                ${s.zone}
              </div>
            </div>
            ${this._getStatusBadge(s.status)}
          </div>

          <!-- Stats -->
          <div style="display:flex;justify-content:space-between;align-items:center;padding:.5rem 0;border-top:1px solid rgba(255,255,255,.06);border-bottom:1px solid rgba(255,255,255,.06);">
            <div>
              <div class="stat-value" style="font-size:1.05rem;">${s.completedSurveys} / ${s.targetSurveys}</div>
              <div class="stat-label">Encuestas</div>
            </div>
            <div style="text-align:right;">
              <div class="stat-value" style="font-size:1.05rem;color:${pct >= 75 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#ef4444'};">${pct}%</div>
              <div class="stat-label">Completado</div>
            </div>
          </div>

          <!-- Progress bar -->
          <div class="progress-bar">
            <div class="progress-fill" style="width:${pct}%;background:${pct >= 75 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#ef4444'};"></div>
          </div>

          <!-- Contact -->
          <div style="font-size:.75rem;color:var(--text-secondary);display:flex;flex-direction:column;gap:.2rem;">
            <div>📞 ${s.phone}</div>
            <div>✉️ ${s.email}</div>
          </div>

          <!-- Actions -->
          <button class="btn btn-secondary btn-sm" onclick="SurveyorsModule._showDetail('${s.id}')" style="width:100%;margin-top:auto;">
            Ver Detalle
          </button>
        </div>
      `;
    }).join('');
  },

  _showDetail(surveyorId) {
    const s = APP_DATA.getSurveyorById(surveyorId);
    if (!s) return;

    const children = APP_DATA.getChildrenBySurveyor(surveyorId);
    const pct = s.targetSurveys > 0 ? Math.round((s.completedSurveys / s.targetSurveys) * 100) : 0;
    const communityColor = this._getCommunityColor(s.zone);

    const modal = document.getElementById('surveyor-modal-content');
    if (!modal) return;

    const nutritionalBadge = (status) => {
      const map = {
        'Normal': 'badge-success',
        'Desnutrición Leve': 'badge-warning',
        'Desnutrición Moderada': 'badge-danger',
        'Desnutrición Severa': 'badge-danger',
        'Sobrepeso': 'badge-info',
        'Obesidad': 'badge-purple'
      };
      return `<span class="badge ${map[status] || ''}">${status}</span>`;
    };

    modal.innerHTML = `
      <button onclick="SurveyorsModule._closeModal()" class="btn btn-icon" style="position:absolute;top:1rem;right:1rem;font-size:1.2rem;">✕</button>

      <!-- Header -->
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;">
        <div class="avatar" style="width:56px;height:56px;font-size:1.1rem;background:${communityColor};display:flex;align-items:center;justify-content:center;font-weight:700;color:white;">
          ${s.avatar}
        </div>
        <div>
          <h2 style="margin:0;font-size:1.35rem;">${s.name} ${s.lastName}</h2>
          <div style="display:flex;align-items:center;gap:.5rem;margin-top:.25rem;">
            <span class="status-dot" style="background:${communityColor};"></span>
            <span style="font-size:.85rem;color:var(--text-secondary);">${s.zone}</span>
            ${this._getStatusBadge(s.status)}
          </div>
        </div>
      </div>

      <!-- Info grid -->
      <div class="grid-3" style="margin-bottom:1.5rem;">
        <div class="kpi-card" style="padding:.75rem 1rem;">
          <div><div class="kpi-value" style="font-size:1.1rem;">${s.completedSurveys} / ${s.targetSurveys}</div><div class="kpi-label">Encuestas</div></div>
        </div>
        <div class="kpi-card" style="padding:.75rem 1rem;">
          <div><div class="kpi-value" style="font-size:1.1rem;color:${pct >= 75 ? '#22c55e' : '#f59e0b'};">${pct}%</div><div class="kpi-label">Progreso</div></div>
        </div>
        <div class="kpi-card" style="padding:.75rem 1rem;">
          <div><div class="kpi-value" style="font-size:1.1rem;">${children.length}</div><div class="kpi-label">Niños encuestados</div></div>
        </div>
      </div>

      <div style="font-size:.85rem;color:var(--text-secondary);margin-bottom:1rem;">
        📞 ${s.phone} &nbsp;|&nbsp; ✉️ ${s.email} &nbsp;|&nbsp; 📅 Inicio: ${s.startDate}
      </div>

      <!-- Children table -->
      <h3 style="font-size:1rem;margin-bottom:.75rem;">Niños Encuestados (${children.length})</h3>
      ${children.length > 0 ? `
        <div style="overflow-x:auto;">
          <table class="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Edad</th>
                <th>Comunidad</th>
                <th>Estado Nutricional</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              ${children.map((ch, i) => {
                const comm = APP_DATA.getCommunityById(ch.communityId);
                return `
                  <tr>
                    <td>${i + 1}</td>
                    <td>${ch.name} ${ch.lastName}</td>
                    <td>${ch.age} años</td>
                    <td>${comm ? comm.name : '—'}</td>
                    <td>${nutritionalBadge(ch.nutritionalStatus)}</td>
                    <td>${ch.surveyDate}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      ` : `
        <div class="empty-state" style="padding:2rem;text-align:center;">
          <div style="font-size:1.5rem;margin-bottom:.5rem;">📭</div>
          <div>No hay registros de niños encuestados</div>
        </div>
      `}
    `;

    const overlay = document.getElementById('surveyor-modal-overlay');
    if (overlay) overlay.style.display = 'flex';
  },

  _closeModal() {
    const overlay = document.getElementById('surveyor-modal-overlay');
    if (overlay) overlay.style.display = 'none';
  },

  // ---------------------------------------------------------------------------
  // destroy()
  // ---------------------------------------------------------------------------
  destroy() {
    this._closeModal();
    if (this._escHandler) {
      document.removeEventListener('keydown', this._escHandler);
      this._escHandler = null;
    }
  }
};
