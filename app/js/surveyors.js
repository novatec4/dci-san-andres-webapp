// =============================================================================
// Personnel & Team Management Module — Gestión de Equipo y Personal
// Admite cualquier número de registros (20, 50, 100+) con roles institucionales,
// filtros avanzados, CRUD interactivo, WhatsApp directo y carga/descarga masiva.
// =============================================================================

const SurveyorsModule = {
  viewMode: 'cards', // 'cards' | 'table'
  searchQuery: '',
  roleFilter: '',
  zoneFilter: '',
  statusFilter: '',
  editingId: null,
  currentPage: 1,
  pageSize: 20,
  currentPhotoData: null,

  // ---------------------------------------------------------------------------
  // render()
  // ---------------------------------------------------------------------------
  render() {
    const personnel = APP_DATA.surveyors || [];
    const communities = APP_DATA.communities || [];

    const totalCount = personnel.length;
    const enCampoCount = personnel.filter(p => p.status === 'en-campo').length;
    const tecnicosCount = personnel.filter(p => p.role === 'encuestador' || p.role === 'nutricionista').length;
    const promotoresCount = personnel.filter(p => p.role === 'promotor').length;

    const html = `
      <div class="module-header fade-in" style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1rem;">
        <div>
          <h1>👥 Gestión de Equipo y Personal</h1>
          <p class="module-subtitle">Control y seguimiento operativo de brigadistas, nutricionistas, promotores y supervisores</p>
        </div>
        <div style="display:flex;gap:0.6rem;flex-wrap:wrap;">
          <button id="btn-export-personnel" class="btn btn-secondary" style="padding:0.6rem 1rem;font-size:0.85rem;background:rgba(255,255,255,0.06);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text-primary);display:flex;align-items:center;gap:0.4rem;">
            📤 Exportar Planilla (CSV)
          </button>
          <label class="btn btn-secondary" style="padding:0.6rem 1rem;font-size:0.85rem;background:rgba(255,255,255,0.06);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text-primary);display:flex;align-items:center;gap:0.4rem;cursor:pointer;">
            📥 Importar CSV
            <input type="file" id="input-import-csv" accept=".csv,.txt" style="display:none;">
          </label>
          <button id="btn-add-personnel" class="btn btn-primary" style="padding:0.6rem 1.2rem;font-size:0.85rem;background:var(--accent);color:white;border-radius:var(--radius-sm);font-weight:600;display:flex;align-items:center;gap:0.4rem;box-shadow:0 2px 10px rgba(232,115,74,0.3);">
            ➕ Nuevo Integrante
          </button>
        </div>
      </div>

      <!-- KPI Row -->
      <div class="kpi-grid fade-in" style="grid-template-columns:repeat(4,1fr);margin-bottom:1.5rem;">
        <div class="kpi-card">
          <div class="kpi-icon" style="background:rgba(232,115,74,0.15);color:var(--accent);">👥</div>
          <div>
            <div class="kpi-value" id="kpi-total-personnel">${totalCount}</div>
            <div class="kpi-label">Total Personal Registrado</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon" style="background:rgba(59,130,246,0.15);color:#3b82f6;">📋</div>
          <div>
            <div class="kpi-value" id="kpi-campo-personnel" style="color:#3b82f6;">${enCampoCount}</div>
            <div class="kpi-label">Desplegados en Campo Hoy</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon" style="background:rgba(16,185,129,0.15);color:#10b981;">🥗</div>
          <div>
            <div class="kpi-value" id="kpi-tecnicos-personnel" style="color:#10b981;">${tecnicosCount}</div>
            <div class="kpi-label">Encuestadores & Nutricionistas</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon" style="background:rgba(139,92,246,0.15);color:#8b5cf6;">🩺</div>
          <div>
            <div class="kpi-value" id="kpi-promotores-personnel" style="color:#8b5cf6;">${promotoresCount}</div>
            <div class="kpi-label">Vigilantes / Promotores (C2)</div>
          </div>
        </div>
      </div>

      <!-- Search, Filters & View Toggle -->
      <div class="card fade-in" style="margin-bottom:1.5rem;padding:1rem 1.5rem;">
        <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center;">
          <input type="text" id="personnel-search" class="search-input" placeholder="🔍 Buscar por nombre, cédula o teléfono..." value="${this.searchQuery}" style="flex:1;min-width:240px;">
          
          <div class="filter-group">
            <select id="personnel-filter-role" class="select-styled" style="padding:0.6rem 0.8rem;background:var(--bg-tertiary);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text-primary);">
              <option value="">Todos los Roles</option>
              <option value="encuestador" ${this.roleFilter === 'encuestador' ? 'selected' : ''}>Encuestador(a)</option>
              <option value="nutricionista" ${this.roleFilter === 'nutricionista' ? 'selected' : ''}>Nutricionista</option>
              <option value="supervisor" ${this.roleFilter === 'supervisor' ? 'selected' : ''}>Supervisor(a)</option>
              <option value="promotor" ${this.roleFilter === 'promotor' ? 'selected' : ''}>Promotor(a) Comunitario</option>
              <option value="coordinador" ${this.roleFilter === 'coordinador' ? 'selected' : ''}>Coordinador(a)</option>
            </select>
          </div>

          <div class="filter-group">
            <select id="personnel-filter-zone" class="select-styled" style="padding:0.6rem 0.8rem;background:var(--bg-tertiary);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text-primary);">
              <option value="">Todas las Zonas</option>
              ${communities.map(c => `<option value="${c.id}" ${this.zoneFilter === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
            </select>
          </div>

          <div class="filter-group">
            <select id="personnel-filter-status" class="select-styled" style="padding:0.6rem 0.8rem;background:var(--bg-tertiary);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text-primary);">
              <option value="">Todos los Estados</option>
              <option value="activo" ${this.statusFilter === 'activo' ? 'selected' : ''}>Activo</option>
              <option value="en-campo" ${this.statusFilter === 'en-campo' ? 'selected' : ''}>En Campo</option>
              <option value="capacitacion" ${this.statusFilter === 'capacitacion' ? 'selected' : ''}>En Capacitación</option>
              <option value="inactivo" ${this.statusFilter === 'inactivo' ? 'selected' : ''}>Inactivo</option>
            </select>
          </div>

          <!-- View Mode Toggle -->
          <div style="display:flex;border:1px solid var(--border);border-radius:var(--radius-sm);overflow:hidden;">
            <button id="btn-view-cards" class="btn ${this.viewMode === 'cards' ? 'active' : ''}" title="Vista Cuadrícula" style="padding:0.5rem 0.8rem;background:${this.viewMode === 'cards' ? 'var(--accent)' : 'transparent'};color:${this.viewMode === 'cards' ? 'white' : 'var(--text-secondary)'};">
              🗂️
            </button>
            <button id="btn-view-table" class="btn ${this.viewMode === 'table' ? 'active' : ''}" title="Vista Tabla" style="padding:0.5rem 0.8rem;background:${this.viewMode === 'table' ? 'var(--accent)' : 'transparent'};color:${this.viewMode === 'table' ? 'white' : 'var(--text-secondary)'};">
              📄
            </button>
          </div>

          <!-- Dynamic Page Size -->
          <div style="display:inline-flex;align-items:center;gap:0.4rem;font-size:0.8rem;color:var(--text-secondary);margin-left:auto;">
            <label for="personnel-page-size" style="font-weight:600;">Mostrar:</label>
            <select id="personnel-page-size" class="select-styled" style="padding:0.4rem 0.6rem;background:var(--bg-tertiary);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text-primary);font-weight:700;">
              <option value="10" ${this.pageSize === 10 ? 'selected' : ''}>10 por página</option>
              <option value="20" ${this.pageSize === 20 ? 'selected' : ''}>20 por página</option>
              <option value="30" ${this.pageSize === 30 ? 'selected' : ''}>30 por página</option>
              <option value="50" ${this.pageSize === 50 ? 'selected' : ''}>50 por página</option>
              <option value="100" ${this.pageSize === 100 ? 'selected' : ''}>100 por página</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Main Personnel Content List -->
      <div id="personnel-list-container" class="fade-in">
        ${this._buildPersonnelView()}
      </div>

      <!-- Modal para Registrar / Editar Integrante -->
      <div class="modal-overlay" id="personnel-modal">
        <div class="modal" style="max-width:540px;">
          <div class="modal-header">
            <h3 class="modal-title" id="personnel-modal-title">➕ Registrar Nuevo Integrante</h3>
            <button class="modal-close" id="btn-close-modal">✕</button>
          </div>
          <form id="personnel-form" style="display:flex;flex-direction:column;gap:1rem;">
            <input type="hidden" id="form-person-id">

            <!-- Carga de Foto de Perfil / Gafete -->
            <div style="background:var(--bg-tertiary);padding:0.85rem;border-radius:10px;border:1px solid var(--border);display:flex;align-items:center;gap:1rem;">
              <div id="person-photo-preview" style="width:54px;height:54px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--brand-brown));color:white;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1.4rem;flex-shrink:0;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.2);">
                📷
              </div>
              <div style="flex:1;">
                <label style="font-size:0.78rem;font-weight:600;color:var(--text-primary);display:block;margin-bottom:0.2rem;">Fotografía para Gafete Oficial</label>
                <input type="file" id="person-photo-file" accept="image/*" style="font-size:0.75rem;color:var(--text-secondary);">
                <small style="font-size:0.7rem;color:var(--text-muted);display:block;margin-top:2px;">JPG o PNG de rostro para credencialización</small>
              </div>
            </div>
            
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
              <div>
                <label style="font-size:0.8rem;color:var(--text-secondary);display:block;margin-bottom:0.3rem;">Nombre *</label>
                <input type="text" id="form-name" required class="search-input" style="width:100%;" placeholder="Ej. Carlos Alberto">
              </div>
              <div>
                <label style="font-size:0.8rem;color:var(--text-secondary);display:block;margin-bottom:0.3rem;">Apellido *</label>
                <input type="text" id="form-lastname" required class="search-input" style="width:100%;" placeholder="Ej. Suárez Baque">
              </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
              <div>
                <label style="font-size:0.8rem;color:var(--text-secondary);display:block;margin-bottom:0.3rem;">Cédula / ID</label>
                <input type="text" id="form-cedula" class="search-input" style="width:100%;" placeholder="Ej. 0601234567">
              </div>
              <div>
                <label style="font-size:0.8rem;color:var(--text-secondary);display:block;margin-bottom:0.3rem;">Rol en el Proyecto *</label>
                <select id="form-role" required class="select-styled" style="width:100%;padding:0.6rem;background:var(--bg-tertiary);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text-primary);">
                  <option value="encuestador">📋 Encuestador(a) de Campo</option>
                  <option value="nutricionista">🥗 Nutricionista / Antropometría</option>
                  <option value="supervisor">🛡️ Supervisor(a) de Brigada</option>
                  <option value="promotor">🩺 Promotor / Vigilante (C2)</option>
                  <option value="coordinador">🎯 Coordinador(a) de Zona</option>
                </select>
              </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
              <div>
                <label style="font-size:0.8rem;color:var(--text-secondary);display:block;margin-bottom:0.3rem;">Teléfono / WhatsApp</label>
                <input type="tel" id="form-phone" class="search-input" style="width:100%;" placeholder="0987654321 (Celular del brigadista)">
              </div>
              <div>
                <label style="font-size:0.8rem;color:var(--text-secondary);display:block;margin-bottom:0.3rem;">Correo Institucional</label>
                <input type="email" id="form-email" class="search-input" style="width:100%;" placeholder="usuario@dci.ec">
              </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
              <div>
                <label style="font-size:0.8rem;color:var(--text-secondary);display:block;margin-bottom:0.3rem;">Comunidad Asignada</label>
                <select id="form-zone" class="select-styled" style="width:100%;padding:0.6rem;background:var(--bg-tertiary);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text-primary);">
                  ${communities.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                </select>
              </div>
              <div>
                <label style="font-size:0.8rem;color:var(--text-secondary);display:block;margin-bottom:0.3rem;">Estado Operativo</label>
                <select id="form-status" class="select-styled" style="width:100%;padding:0.6rem;background:var(--bg-tertiary);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text-primary);">
                  <option value="activo">🟢 Activo</option>
                  <option value="en-campo">🔵 En Campo Hoy</option>
                  <option value="capacitacion">🟡 En Capacitación</option>
                  <option value="inactivo">⏸️ Inactivo / Pausado</option>
                </select>
              </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
              <div>
                <label style="font-size:0.8rem;color:var(--text-secondary);display:block;margin-bottom:0.3rem;">Meta de Encuestas</label>
                <input type="number" id="form-target" class="search-input" style="width:100%;" value="65" min="0">
              </div>
              <div>
                <label style="font-size:0.8rem;color:var(--text-secondary);display:block;margin-bottom:0.3rem;">Encuestas Completadas</label>
                <input type="number" id="form-completed" class="search-input" style="width:100%;" value="0" min="0">
              </div>
            </div>

            <div style="display:flex;justify-content:flex-end;gap:0.75rem;margin-top:1rem;border-top:1px solid var(--border);padding-top:1rem;">
              <button type="button" id="btn-cancel-form" class="btn" style="padding:0.6rem 1.2rem;background:rgba(255,255,255,0.06);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text-primary);">Cancelar</button>
              <button type="submit" class="btn" style="padding:0.6rem 1.4rem;background:var(--accent);color:white;border-radius:var(--radius-sm);font-weight:600;">Guardar Integrante</button>
            </div>
          </form>
        </div>
      </div>
    `;

    const main = document.getElementById('main-content');
    if (main) {
      main.innerHTML = html;
    }
  },

  // ---------------------------------------------------------------------------
  // init()
  // ---------------------------------------------------------------------------
  init() {
    this._attachEventListeners();
  },

  destroy() {
    // Cleanup if needed
  },

  // ---------------------------------------------------------------------------
  // Internal View Builders
  // ---------------------------------------------------------------------------
  _filterPersonnel() {
    const list = APP_DATA.surveyors || [];
    const q = this.searchQuery.toLowerCase().trim();
    return list.filter(p => {
      const matchSearch = !q || 
        (p.name && p.name.toLowerCase().includes(q)) || 
        (p.lastName && p.lastName.toLowerCase().includes(q)) ||
        (p.fullName && p.fullName.toLowerCase().includes(q)) ||
        (p.dupla && p.dupla.toLowerCase().includes(q)) ||
        (p.email && p.email.toLowerCase().includes(q)) ||
        (p.cedula && p.cedula.includes(q)) ||
        (p.phone && p.phone.includes(q));

      const matchRole = !this.roleFilter || (p.role && p.role.toLowerCase() === this.roleFilter.toLowerCase());
      const matchZone = !this.zoneFilter || (p.zone === this.zoneFilter);
      const matchStatus = !this.statusFilter || (p.status === this.statusFilter);

      return matchSearch && matchRole && matchZone && matchStatus;
    });
  },

  _getRoleBadge(role) {
    const r = (role || 'encuestador').toLowerCase();
    switch (r) {
      case 'coordinador':
        return '<span class="badge" style="background:rgba(59,130,246,0.15);color:#3b82f6;border:1px solid rgba(59,130,246,0.3);">🎯 Coordinación</span>';
      case 'supervisor':
        return '<span class="badge" style="background:rgba(139,92,246,0.15);color:#8b5cf6;border:1px solid rgba(139,92,246,0.3);">🛡️ Supervisor(a)</span>';
      case 'nutricionista':
        return '<span class="badge" style="background:rgba(16,185,129,0.15);color:#10b981;border:1px solid rgba(16,185,129,0.3);">🥗 Nutricionista</span>';
      case 'promotor':
        return '<span class="badge" style="background:rgba(20,184,166,0.15);color:#14b8a6;border:1px solid rgba(20,184,166,0.3);">🩺 Promotor(a) C2</span>';
      default:
        return '<span class="badge" style="background:rgba(232,115,74,0.15);color:var(--accent);border:1px solid rgba(232,115,74,0.3);">📋 Encuestador(a)</span>';
    }
  },

  _getStatusBadge(status) {
    switch (status) {
      case 'en-campo':
        return '<span class="badge" style="background:rgba(59,130,246,0.15);color:#3b82f6;">🔵 En Campo</span>';
      case 'capacitacion':
        return '<span class="badge" style="background:rgba(245,158,11,0.15);color:#f59e0b;">🟡 Capacitación</span>';
      case 'inactivo':
        return '<span class="badge" style="background:rgba(239,68,68,0.15);color:#ef4444;">⏸️ Inactivo</span>';
      default:
        return '<span class="badge" style="background:rgba(16,185,129,0.15);color:#10b981;">🟢 Activo</span>';
    }
  },

  _getCommunityName(zoneId) {
    const comm = APP_DATA.communities.find(c => c.id === zoneId);
    return comm ? comm.name : (zoneId || 'Sin asignar');
  },

  _buildPersonnelView() {
    const filtered = this._filterPersonnel();
    if (filtered.length === 0) {
      return `
        <div class="card" style="padding:3rem;text-align:center;">
          <div style="font-size:2.5rem;margin-bottom:0.5rem;opacity:0.6;">🔍</div>
          <h3 style="color:var(--text-secondary);margin-bottom:0.5rem;">No se encontró personal con los filtros aplicados</h3>
          <p style="color:var(--text-muted);font-size:0.9rem;">Prueba modificando la búsqueda o registra un nuevo integrante.</p>
        </div>
      `;
    }

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / this.pageSize));
    if (this.currentPage > totalPages) this.currentPage = totalPages;
    const start = (this.currentPage - 1) * this.pageSize;
    const paged = filtered.slice(start, start + this.pageSize);

    const contentHtml = this.viewMode === 'cards' ? this._buildCardsView(paged) : this._buildTableView(paged);

    const paginationHtml = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:1.5rem;padding:0.75rem 1rem;background:var(--bg-secondary);border:1px solid var(--border);border-radius:var(--radius-md);flex-wrap:wrap;gap:1rem;">
        <div style="font-size:0.85rem;color:var(--text-secondary);">
          Mostrando <strong style="color:var(--text-primary);">${total === 0 ? 0 : start + 1} - ${Math.min(start + this.pageSize, total)}</strong> de <strong style="color:var(--text-primary);">${total}</strong> integrantes
        </div>
        <div style="display:flex;gap:0.5rem;align-items:center;">
          <button id="personnel-prev-page" class="btn" style="padding:0.4rem 0.8rem;font-size:0.8rem;background:var(--bg-tertiary);border:1px solid var(--border);color:var(--text-primary);border-radius:4px;cursor:${this.currentPage <= 1 ? 'not-allowed' : 'pointer'};opacity:${this.currentPage <= 1 ? '0.5' : '1'};" ${this.currentPage <= 1 ? 'disabled' : ''}>← Anterior</button>
          <span style="font-size:0.8rem;font-weight:600;padding:0.4rem 0.8rem;background:rgba(232,115,74,0.1);color:var(--accent);border-radius:4px;border:1px solid rgba(232,115,74,0.25);">Página ${this.currentPage} de ${totalPages}</span>
          <button id="personnel-next-page" class="btn" style="padding:0.4rem 0.8rem;font-size:0.8rem;background:var(--bg-tertiary);border:1px solid var(--border);color:var(--text-primary);border-radius:4px;cursor:${this.currentPage >= totalPages ? 'not-allowed' : 'pointer'};opacity:${this.currentPage >= totalPages ? '0.5' : '1'};" ${this.currentPage >= totalPages ? 'disabled' : ''}>Siguiente →</button>
        </div>
      </div>
    `;

    return contentHtml + paginationHtml;
  },

  _buildCardsView(list) {
    return `
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:1.25rem;">
        ${list.map(p => {
          const pct = Math.min(100, Math.round(((p.completedSurveys || 0) / (p.targetSurveys || 65)) * 100));
          const cleanPhone = (p.phone || '').replace(/[^0-9]/g, '');
          const waLink = cleanPhone ? (cleanPhone.startsWith('593') ? cleanPhone : '593' + cleanPhone.replace(/^0/, '')) : null;

          return `
            <div class="card" style="display:flex;flex-direction:column;justify-content:space-between;padding:1.25rem;border-left:4px solid ${p.status === 'en-campo' ? '#3b82f6' : (p.status === 'activo' ? '#10b981' : '#f59e0b')};">
              <div>
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem;">
                  <div style="display:flex;align-items:center;gap:0.75rem;">
                    <div style="width:46px;height:46px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--brand-brown));color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1rem;flex-shrink:0;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,0.15);">
                      ${p.photoUrl ? `<img src="${p.photoUrl}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;">` : (p.avatar || 'PE')}
                    </div>
                    <div>
                      <div style="font-weight:700;font-size:1rem;color:var(--text-primary);">${p.name} ${p.lastName}</div>
                      <div style="font-size:0.75rem;color:var(--text-muted);">${p.cedula ? 'CI: ' + p.cedula : 'ID #' + p.id}</div>
                    </div>
                  </div>
                  <div>
                    ${this._getStatusBadge(p.status)}
                  </div>
                </div>

                <div style="display:flex;gap:0.4rem;align-items:center;margin-bottom:0.75rem;flex-wrap:wrap;">
                  ${this._getRoleBadge(p.role)}
                  <span class="badge" style="background:rgba(255,255,255,0.06);color:var(--text-secondary);font-size:0.75rem;">📍 ${this._getCommunityName(p.zone)}</span>
                </div>

                <div style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:1rem;display:flex;flex-direction:column;gap:0.25rem;">
                  <div style="display:flex;align-items:center;justify-content:space-between;">
                    <span>📱 ${p.phone && p.phone.trim() ? p.phone : '<em style="color:var(--text-muted);font-style:italic;">Por registrar</em>'}</span>
                    ${waLink ? `<a href="https://wa.me/${waLink}" target="_blank" rel="noopener" style="color:#25D366;font-weight:600;font-size:0.75rem;display:flex;align-items:center;gap:0.2rem;">💬 WhatsApp</a>` : ''}
                  </div>
                  <div style="font-size:0.75rem;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;">✉️ ${p.email || 'Sin correo'}</div>
                </div>

                <!-- Progreso de Encuestas -->
                <div style="margin-bottom:1rem;background:rgba(0,0,0,0.15);padding:0.75rem;border-radius:var(--radius-sm);">
                  <div style="display:flex;justify-content:space-between;font-size:0.75rem;margin-bottom:0.3rem;">
                    <span style="color:var(--text-secondary);">Avance de Levantamiento</span>
                    <span style="font-weight:700;color:var(--text-primary);">${p.completedSurveys || 0} / ${p.targetSurveys || 65} (${pct}%)</span>
                  </div>
                  <div class="progress-bar" style="height:6px;background:rgba(255,255,255,0.1);border-radius:3px;overflow:hidden;">
                    <div class="progress-fill" style="width:${pct}%;background:${pct >= 100 ? '#10b981' : 'var(--accent)'};height:100%;"></div>
                  </div>
                </div>
              </div>

              <!-- Footer Actions -->
              <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--border);padding-top:0.75rem;margin-top:0.5rem;">
                <select class="quick-status-select" data-id="${p.id}" style="padding:0.3rem 0.5rem;font-size:0.75rem;background:var(--bg-tertiary);border:1px solid var(--border);border-radius:4px;color:var(--text-primary);">
                  <option value="activo" ${p.status === 'activo' ? 'selected' : ''}>🟢 Activo</option>
                  <option value="en-campo" ${p.status === 'en-campo' ? 'selected' : ''}>🔵 En Campo</option>
                  <option value="capacitacion" ${p.status === 'capacitacion' ? 'selected' : ''}>🟡 Capacitación</option>
                  <option value="inactivo" ${p.status === 'inactivo' ? 'selected' : ''}>⏸️ Inactivo</option>
                </select>

                <div style="display:flex;gap:0.4rem;align-items:center;">
                  <button class="btn-view-qr-cred" data-code="${p.brigadistaId || ('ESPOCH-BRIG-' + String(p.id).padStart(2, '0'))}" title="Ver Credencial Oficial QR" style="padding:0.3rem 0.6rem;font-size:0.78rem;background:rgba(232,115,74,0.15);border:1px solid rgba(232,115,74,0.4);border-radius:4px;color:var(--accent);font-weight:700;display:flex;align-items:center;gap:0.25rem;cursor:pointer;">
                    🪪 QR
                  </button>
                  <button class="btn-edit-person" data-id="${p.id}" title="Editar Integrante" style="padding:0.3rem 0.6rem;font-size:0.8rem;background:rgba(255,255,255,0.06);border:1px solid var(--border);border-radius:4px;color:var(--text-primary);">
                    ✏️
                  </button>
                  <button class="btn-delete-person" data-id="${p.id}" title="Dar de baja / Eliminar" style="padding:0.3rem 0.6rem;font-size:0.8rem;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:4px;color:#ef4444;">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  _buildTableView(list) {
    return `
      <div class="card" style="padding:0;overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;text-align:left;font-size:0.85rem;">
          <thead>
            <tr style="border-bottom:1px solid var(--border);background:rgba(255,255,255,0.02);color:var(--text-secondary);">
              <th style="padding:0.75rem 1rem;">ID</th>
              <th style="padding:0.75rem 1rem;">Nombre y Cédula</th>
              <th style="padding:0.75rem 1rem;">Rol</th>
              <th style="padding:0.75rem 1rem;">Comunidad Asignada</th>
              <th style="padding:0.75rem 1rem;">Contacto</th>
              <th style="padding:0.75rem 1rem;">Avance</th>
              <th style="padding:0.75rem 1rem;">Estado</th>
              <th style="padding:0.75rem 1rem;text-align:right;">Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(p => {
              const pct = Math.min(100, Math.round(((p.completedSurveys || 0) / (p.targetSurveys || 65)) * 100));
              const cleanPhone = (p.phone || '').replace(/[^0-9]/g, '');
              const waLink = cleanPhone ? (cleanPhone.startsWith('593') ? cleanPhone : '593' + cleanPhone.replace(/^0/, '')) : null;

              return `
                <tr style="border-bottom:1px solid var(--border);">
                  <td style="padding:0.75rem 1rem;font-weight:700;color:var(--accent);">${p.brigadistaId || ('#' + p.id)}</td>
                  <td style="padding:0.75rem 1rem;">
                    <div style="display:flex;align-items:center;gap:0.75rem;">
                      <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--brand-brown));color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;flex-shrink:0;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.15);">
                        ${p.photoUrl ? `<img src="${p.photoUrl}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;">` : (p.avatar || 'PE')}
                      </div>
                      <div>
                        <div style="font-weight:600;color:var(--text-primary);">${p.name} ${p.lastName}</div>
                        <div style="font-size:0.75rem;color:var(--text-muted);">${p.cedula ? 'CI: ' + p.cedula : 'Sin cédula'}</div>
                      </div>
                    </div>
                  </td>
                  <td style="padding:0.75rem 1rem;">${this._getRoleBadge(p.role)}</td>
                  <td style="padding:0.75rem 1rem;color:var(--text-secondary);">📍 ${this._getCommunityName(p.zone)}</td>
                  <td style="padding:0.75rem 1rem;">
                    <div>${p.phone && p.phone.trim() ? p.phone : '<em style="color:var(--text-muted);font-style:italic;">Por registrar</em>'}</div>
                    ${waLink ? `<a href="https://wa.me/${waLink}" target="_blank" rel="noopener" style="color:#25D366;font-size:0.75rem;font-weight:600;">💬 WhatsApp</a>` : ''}
                  </td>
                  <td style="padding:0.75rem 1rem;min-width:130px;">
                    <div style="font-size:0.75rem;margin-bottom:0.25rem;">${p.completedSurveys || 0} / ${p.targetSurveys || 65} (${pct}%)</div>
                    <div style="height:5px;background:rgba(255,255,255,0.1);border-radius:3px;overflow:hidden;">
                      <div style="width:${pct}%;background:${pct >= 100 ? '#10b981' : 'var(--accent)'};height:100%;"></div>
                    </div>
                  </td>
                  <td style="padding:0.75rem 1rem;">${this._getStatusBadge(p.status)}</td>
                  <td style="padding:0.75rem 1rem;text-align:right;">
                    <button class="btn-view-qr-cred" data-code="${p.brigadistaId || ('ESPOCH-BRIG-' + String(p.id).padStart(2, '0'))}" title="Ver Credencial QR" style="padding:0.3rem 0.5rem;background:rgba(232,115,74,0.15);border:1px solid rgba(232,115,74,0.4);border-radius:4px;color:var(--accent);font-weight:700;margin-right:0.3rem;cursor:pointer;">🪪 QR</button>
                    <button class="btn-edit-person" data-id="${p.id}" title="Editar" style="padding:0.3rem 0.5rem;background:rgba(255,255,255,0.06);border:1px solid var(--border);border-radius:4px;color:var(--text-primary);margin-right:0.3rem;">✏️</button>
                    <button class="btn-delete-person" data-id="${p.id}" title="Eliminar" style="padding:0.3rem 0.5rem;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:4px;color:#ef4444;">🗑️</button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  // ---------------------------------------------------------------------------
  // Event Listeners & Interactions
  // ---------------------------------------------------------------------------
  _attachEventListeners() {
    const searchInput = document.getElementById('personnel-search');
    const roleSelect = document.getElementById('personnel-filter-role');
    const zoneSelect = document.getElementById('personnel-filter-zone');
    const statusSelect = document.getElementById('personnel-filter-status');
    const pageSizeSelect = document.getElementById('personnel-page-size');
    const viewCardsBtn = document.getElementById('btn-view-cards');
    const viewTableBtn = document.getElementById('btn-view-table');
    const addBtn = document.getElementById('btn-add-personnel');
    const exportBtn = document.getElementById('btn-export-personnel');
    const importInput = document.getElementById('input-import-csv');
    const modal = document.getElementById('personnel-modal');
    const closeModalBtn = document.getElementById('btn-close-modal');
    const cancelFormBtn = document.getElementById('btn-cancel-form');
    const form = document.getElementById('personnel-form');
    const photoInput = document.getElementById('person-photo-file');
    const photoPreview = document.getElementById('person-photo-preview');

    // Page Size Selector
    if (pageSizeSelect) {
      pageSizeSelect.addEventListener('change', (e) => {
        this.pageSize = parseInt(e.target.value, 10) || 20;
        this.currentPage = 1;
        this._updateListView();
      });
    }

    // Photo file upload & Canvas compression
    if (photoInput) {
      photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const size = 120;
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, size, size);
            this.currentPhotoData = canvas.toDataURL('image/jpeg', 0.85);
            if (photoPreview) {
              photoPreview.innerHTML = `<img src="${this.currentPhotoData}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
            }
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      });
    }

    // Filters & Search
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.currentPage = 1;
        this._updateListView();
      });
    }

    if (roleSelect) {
      roleSelect.addEventListener('change', (e) => {
        this.roleFilter = e.target.value;
        this.currentPage = 1;
        this._updateListView();
      });
    }

    if (zoneSelect) {
      zoneSelect.addEventListener('change', (e) => {
        this.zoneFilter = e.target.value;
        this.currentPage = 1;
        this._updateListView();
      });
    }

    if (statusSelect) {
      statusSelect.addEventListener('change', (e) => {
        this.statusFilter = e.target.value;
        this.currentPage = 1;
        this._updateListView();
      });
    }

    // View toggles
    if (viewCardsBtn) {
      viewCardsBtn.addEventListener('click', () => {
        this.viewMode = 'cards';
        viewCardsBtn.style.background = 'var(--accent)';
        viewCardsBtn.style.color = 'white';
        if (viewTableBtn) {
          viewTableBtn.style.background = 'transparent';
          viewTableBtn.style.color = 'var(--text-secondary)';
        }
        this._updateListView();
      });
    }

    if (viewTableBtn) {
      viewTableBtn.addEventListener('click', () => {
        this.viewMode = 'table';
        viewTableBtn.style.background = 'var(--accent)';
        viewTableBtn.style.color = 'white';
        if (viewCardsBtn) {
          viewCardsBtn.style.background = 'transparent';
          viewCardsBtn.style.color = 'var(--text-secondary)';
        }
        this._updateListView();
      });
    }

    // Open Modal for Add
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        this.editingId = null;
        this.currentPhotoData = null;
        document.getElementById('personnel-modal-title').textContent = '➕ Registrar Nuevo Integrante';
        form.reset();
        document.getElementById('form-person-id').value = '';
        if (photoPreview) photoPreview.innerHTML = '📷';
        if (photoInput) photoInput.value = '';
        modal.classList.add('active');
      });
    }

    // Close Modal
    const closeModal = () => {
      if (modal) modal.classList.remove('active');
    };
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (cancelFormBtn) cancelFormBtn.addEventListener('click', closeModal);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    // Form Submit (Create or Edit)
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const idVal = document.getElementById('form-person-id').value;
        const personData = {
          name: document.getElementById('form-name').value.trim(),
          lastName: document.getElementById('form-lastname').value.trim(),
          cedula: document.getElementById('form-cedula').value.trim(),
          role: document.getElementById('form-role').value,
          phone: document.getElementById('form-phone').value.trim(),
          email: document.getElementById('form-email').value.trim(),
          zone: document.getElementById('form-zone').value,
          status: document.getElementById('form-status').value,
          targetSurveys: parseInt(document.getElementById('form-target').value, 10) || 65,
          completedSurveys: parseInt(document.getElementById('form-completed').value, 10) || 0,
          photoUrl: this.currentPhotoData || undefined
        };

        if (idVal) {
          // Update
          APP_DATA.updatePerson(parseInt(idVal, 10), personData);
        } else {
          // Add new
          APP_DATA.addPerson(personData);
        }

        closeModal();
        this._refreshAll();
      });
    }

    // Delegate Edit, Delete, Quick Status and Pagination in List
    const container = document.getElementById('personnel-list-container');
    if (container) {
      container.addEventListener('click', (e) => {
        // Pagination: Previous Page
        if (e.target.closest('#personnel-prev-page')) {
          if (this.currentPage > 1) {
            this.currentPage--;
            this._updateListView();
          }
          return;
        }

        // Pagination: Next Page
        if (e.target.closest('#personnel-next-page')) {
          const total = this._filterPersonnel().length;
          const totalPages = Math.max(1, Math.ceil(total / this.pageSize));
          if (this.currentPage < totalPages) {
            this.currentPage++;
            this._updateListView();
          }
          return;
        }
        // QR Credential button
        const qrBtn = e.target.closest('.btn-view-qr-cred');
        if (qrBtn) {
          const code = qrBtn.dataset.code;
          if (window.App && typeof App.navigateTo === 'function') {
            App.navigateTo('credentials');
            setTimeout(() => {
              if (window.CredentialsModule && typeof CredentialsModule.showBrigadista === 'function') {
                CredentialsModule.showBrigadista(code);
              }
            }, 100);
          } else {
            window.open(`verificar.html?id=${encodeURIComponent(code)}`, '_blank');
          }
          return;
        }

        // Edit button
        const editBtn = e.target.closest('.btn-edit-person');
        if (editBtn) {
          const id = parseInt(editBtn.dataset.id, 10);
          const person = (APP_DATA.surveyors || []).find(p => p.id === id);
          if (person) {
            this.editingId = id;
            this.currentPhotoData = person.photoUrl || null;
            const photoPrev = document.getElementById('person-photo-preview');
            const photoInp = document.getElementById('person-photo-file');
            if (photoInp) photoInp.value = '';
            if (photoPrev) {
              if (person.photoUrl) {
                photoPrev.innerHTML = `<img src="${person.photoUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
              } else {
                photoPrev.innerHTML = '📷';
              }
            }
            document.getElementById('personnel-modal-title').textContent = `✏️ Editar Integrante: ${person.name} ${person.lastName}`;
            document.getElementById('form-person-id').value = person.id;
            document.getElementById('form-name').value = person.name || '';
            document.getElementById('form-lastname').value = person.lastName || '';
            document.getElementById('form-cedula').value = person.cedula || '';
            document.getElementById('form-role').value = person.role || 'encuestador';
            document.getElementById('form-phone').value = person.phone || '';
            document.getElementById('form-email').value = person.email || '';
            document.getElementById('form-zone').value = person.zone || 'san-andres';
            document.getElementById('form-status').value = person.status || 'activo';
            document.getElementById('form-target').value = person.targetSurveys || 65;
            document.getElementById('form-completed').value = person.completedSurveys || 0;
            modal.classList.add('active');
          }
          return;
        }

        // Delete button
        const delBtn = e.target.closest('.btn-delete-person');
        if (delBtn) {
          const id = parseInt(delBtn.dataset.id, 10);
          const person = (APP_DATA.surveyors || []).find(p => p.id === id);
          if (person) {
            if (confirm(`¿Estás seguro de eliminar a ${person.name} ${person.lastName} de la base de personal?`)) {
              APP_DATA.deletePerson(id);
              this._refreshAll();
            }
          }
        }
      });

      // Quick Status Dropdown change
      container.addEventListener('change', (e) => {
        if (e.target.classList.contains('quick-status-select')) {
          const id = parseInt(e.target.dataset.id, 10);
          const newStatus = e.target.value;
          APP_DATA.updatePerson(id, { status: newStatus });
          this._refreshKPIs();
          this._updateListView();
        }
      });
    }

    // Export CSV
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const csvContent = APP_DATA.exportPersonnelCSV();
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `planilla_personal_dci_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }

    // Import CSV
    if (importInput) {
      importInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target.result;
          const count = APP_DATA.importPersonnelCSV(text);
          alert(`✅ Se importaron exitosamente ${count} nuevos integrantes a la base de personal.`);
          this._refreshAll();
          importInput.value = '';
        };
        reader.readAsText(file);
      });
    }
  },

  _updateListView() {
    const container = document.getElementById('personnel-list-container');
    if (container) {
      container.innerHTML = this._buildPersonnelView();
    }
  },

  _refreshKPIs() {
    const personnel = APP_DATA.surveyors || [];
    const totalEl = document.getElementById('kpi-total-personnel');
    const campoEl = document.getElementById('kpi-campo-personnel');
    const tecnicosEl = document.getElementById('kpi-tecnicos-personnel');
    const promotoresEl = document.getElementById('kpi-promotores-personnel');

    if (totalEl) totalEl.textContent = personnel.length;
    if (campoEl) campoEl.textContent = personnel.filter(p => p.status === 'en-campo').length;
    if (tecnicosEl) tecnicosEl.textContent = personnel.filter(p => p.role === 'encuestador' || p.role === 'nutricionista').length;
    if (promotoresEl) promotoresEl.textContent = personnel.filter(p => p.role === 'promotor').length;
  },

  _refreshAll() {
    this._refreshKPIs();
    this._updateListView();
  }
};
