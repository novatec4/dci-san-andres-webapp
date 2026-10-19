// =============================================================================
// USERS.JS - Módulo de Administración de Usuarios del Sistema
// Proyecto DCI - Componente A.3.1 (Ayuda en Acción Ecuador / ESPOCH)
// =============================================================================

const UsersModule = {
  currentPage: 1,
  pageSize: 20,
  searchQuery: '',
  roleFilter: '',
  statusFilter: '',
  currentUserPhoto: null,

  render() {
    if (!Auth.hasRole('admin')) {
      document.getElementById('main-content').innerHTML = `
        <div class="card fade-in" style="padding:3rem;text-align:center;">
          <div style="font-size:3rem;margin-bottom:1rem;">🔒</div>
          <h2>Acceso Restringido</h2>
          <p style="color:var(--text-secondary);margin-top:.5rem;">
            El módulo de Administración de Usuarios está reservado exclusivamente para el perfil <strong>Administrador / CIO</strong>.
          </p>
        </div>
      `;
      return;
    }

    const allUsers = Auth.getAllUsers();
    
    // Filtrado
    const q = this.searchQuery.toLowerCase().trim();
    const filtered = allUsers.filter(u => {
      const matchSearch = !q ||
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.id && u.id.toLowerCase().includes(q)) ||
        (u.organization && u.organization.toLowerCase().includes(q));
      const matchRole = !this.roleFilter || u.role === this.roleFilter;
      const matchStatus = !this.statusFilter || u.status === this.statusFilter;
      return matchSearch && matchRole && matchStatus;
    });

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / this.pageSize));
    if (this.currentPage > totalPages) this.currentPage = totalPages;
    const start = (this.currentPage - 1) * this.pageSize;
    const paged = filtered.slice(start, start + this.pageSize);

    const roleLabels = {
      admin: '<span class="badge" style="background:#fee2e2;color:#991b1b;font-weight:600;">Administrador</span>',
      supervisor: '<span class="badge" style="background:#dbeafe;color:#1e40af;font-weight:600;">Supervisor</span>',
      encuestador: '<span class="badge" style="background:#d1fae5;color:#065f46;font-weight:600;">Encuestador</span>',
      nutricionista: '<span class="badge" style="background:#f3e8ff;color:#6b21a8;font-weight:600;">Nutricionista</span>',
      observador: '<span class="badge" style="background:#f1f5f9;color:#475569;font-weight:600;">Observador</span>'
    };

    const html = `
      <div class="module-header fade-in">
        <div>
          <h1>👥 Administración de Usuarios</h1>
          <span>Control de accesos, credenciales, perfiles con fotografía y asignación de roles institucionales</span>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" onclick="UsersModule.openUserModal()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nuevo Usuario
          </button>
        </div>
      </div>

      <!-- Métricas Rápidas de Usuarios -->
      <div class="kpi-grid fade-in" style="margin-bottom:1.5rem;">
        <div class="card kpi-card">
          <div class="kpi-icon" style="background:rgba(232,115,74,0.15);color:#E8734A;">👥</div>
          <div>
            <div class="kpi-value">${allUsers.length}</div>
            <div class="kpi-label">Usuarios Registrados</div>
          </div>
        </div>
        <div class="card kpi-card">
          <div class="kpi-icon" style="background:rgba(16,185,129,0.15);color:#10b981;">✅</div>
          <div>
            <div class="kpi-value">${allUsers.filter(u => u.status === 'activo').length}</div>
            <div class="kpi-label">Cuentas Activas</div>
          </div>
        </div>
        <div class="card kpi-card">
          <div class="kpi-icon" style="background:rgba(59,130,246,0.15);color:#3b82f6;">📍</div>
          <div>
            <div class="kpi-value">San Andrés</div>
            <div class="kpi-label">Zona Principal de Campo</div>
          </div>
        </div>
        <div class="card kpi-card">
          <div class="kpi-icon" style="background:rgba(139,92,246,0.15);color:#8b5cf6;">🛡️</div>
          <div>
            <div class="kpi-value">RBAC 2.0</div>
            <div class="kpi-label">Control de Seguridad</div>
          </div>
        </div>
      </div>

      <!-- Filtros y Selector de Registros -->
      <div class="card fade-in" style="margin-bottom:1.25rem;padding:1rem;">
        <div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:center;justify-content:space-between;">
          <div style="display:flex;gap:0.75rem;flex-wrap:wrap;align-items:center;flex:1;min-width:280px;">
            <input type="text" id="users-search" class="search-input" placeholder="🔍 Buscar por nombre, correo o ID..." value="${this.searchQuery}" style="flex:1;min-width:200px;padding:0.55rem 0.85rem;background:var(--bg-tertiary);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text-primary);">
            
            <select id="users-filter-role" class="select-styled" style="padding:0.55rem 0.85rem;background:var(--bg-tertiary);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text-primary);">
              <option value="">Todos los roles</option>
              <option value="admin" ${this.roleFilter === 'admin' ? 'selected' : ''}>Administrador</option>
              <option value="supervisor" ${this.roleFilter === 'supervisor' ? 'selected' : ''}>Supervisor</option>
              <option value="encuestador" ${this.roleFilter === 'encuestador' ? 'selected' : ''}>Encuestador</option>
              <option value="nutricionista" ${this.roleFilter === 'nutricionista' ? 'selected' : ''}>Nutricionista</option>
              <option value="observador" ${this.roleFilter === 'observador' ? 'selected' : ''}>Observador</option>
            </select>

            <select id="users-filter-status" class="select-styled" style="padding:0.55rem 0.85rem;background:var(--bg-tertiary);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text-primary);">
              <option value="">Todos los estados</option>
              <option value="activo" ${this.statusFilter === 'activo' ? 'selected' : ''}>Activos</option>
              <option value="inactivo" ${this.statusFilter === 'inactivo' ? 'selected' : ''}>Inactivos</option>
            </select>
          </div>

          <div style="display:flex;gap:0.5rem;align-items:center;font-size:0.85rem;color:var(--text-secondary);">
            <span>Por página:</span>
            <select id="users-page-size" class="select-styled" style="padding:0.4rem 0.6rem;background:var(--bg-tertiary);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text-primary);font-weight:600;">
              <option value="10" ${this.pageSize === 10 ? 'selected' : ''}>10</option>
              <option value="20" ${this.pageSize === 20 ? 'selected' : ''}>20</option>
              <option value="30" ${this.pageSize === 30 ? 'selected' : ''}>30</option>
              <option value="50" ${this.pageSize === 50 ? 'selected' : ''}>50</option>
              <option value="100" ${this.pageSize === 100 ? 'selected' : ''}>100</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Tabla de Usuarios -->
      <div class="card fade-in" style="overflow-x:auto;">
        <table class="data-table" style="width:100%;">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Correo Electrónico</th>
              <th>Rol Institucional</th>
              <th>Organización / Zona</th>
              <th>Estado</th>
              <th>Último Acceso</th>
              <th style="text-align:right;">Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${paged.length === 0 ? `
              <tr>
                <td colspan="7" style="text-align:center;padding:2.5rem;color:var(--text-muted);">
                  No se encontraron usuarios con los filtros seleccionados.
                </td>
              </tr>
            ` : paged.map(u => `
              <tr>
                <td>
                  <div style="display:flex;align-items:center;gap:.75rem;">
                    <div style="width:36px;height:36px;border-radius:50%;background:${Auth._getRoleColor(u.role)};color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;overflow:hidden;flex-shrink:0;box-shadow:0 1px 4px rgba(0,0,0,0.15);">
                      ${u.photoUrl ? `<img src="${u.photoUrl}" alt="${u.name}" style="width:100%;height:100%;object-fit:cover;">` : (u.avatar || u.name.substring(0,2).toUpperCase())}
                    </div>
                    <div>
                      <div style="font-weight:600;color:var(--text-primary);">${u.name}</div>
                      <div style="font-size:.75rem;color:var(--text-secondary);font-family:monospace;">${u.id}</div>
                    </div>
                  </div>
                </td>
                <td style="font-family:monospace;font-size:.85rem;">${u.email}</td>
                <td>${roleLabels[u.role] || u.role}</td>
                <td>
                  <div style="font-size:.85rem;">${u.organization}</div>
                  <div style="font-size:.75rem;color:var(--text-secondary);">${u.territory}</div>
                </td>
                <td>
                  <span class="badge ${u.status === 'activo' ? 'badge-green' : 'badge-red'}">
                    ${u.status === 'activo' ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td style="font-size:.8rem;color:var(--text-secondary);">${u.lastLogin || 'Nunca'}</td>
                <td style="text-align:right;">
                  <div style="display:inline-flex;gap:.4rem;">
                    <button class="btn btn-secondary btn-sm" onclick="UsersModule.openUserModal('${u.id}')" title="Editar">✏️</button>
                    ${u.role !== 'admin' ? `
                      <button class="btn btn-secondary btn-sm" onclick="UsersModule.toggleStatus('${u.id}')" title="Suspender/Activar">
                        ${u.status === 'activo' ? '⏸️' : '▶️'}
                      </button>
                      <button class="btn btn-secondary btn-sm" onclick="UsersModule.deleteUser('${u.id}')" title="Eliminar" style="color:#ef4444;">🗑️</button>
                    ` : ''}
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Barra de Paginación -->
        <div style="display:flex;justify-content:space-between;align-items:center;padding:1rem;border-top:1px solid var(--border);flex-wrap:wrap;gap:1rem;">
          <div style="font-size:0.85rem;color:var(--text-secondary);">
            Mostrando <strong style="color:var(--text-primary);">${total === 0 ? 0 : start + 1} - ${Math.min(start + this.pageSize, total)}</strong> de <strong style="color:var(--text-primary);">${total}</strong> usuarios
          </div>
          <div style="display:flex;gap:0.5rem;align-items:center;">
            <button class="btn btn-secondary btn-sm" id="users-btn-prev" ${this.currentPage <= 1 ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>← Anterior</button>
            <span style="font-size:0.8rem;font-weight:600;padding:0.3rem 0.75rem;background:rgba(232,115,74,0.1);color:var(--accent);border-radius:4px;border:1px solid rgba(232,115,74,0.25);">Página ${this.currentPage} de ${totalPages}</span>
            <button class="btn btn-secondary btn-sm" id="users-btn-next" ${this.currentPage >= totalPages ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>Siguiente →</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('main-content').innerHTML = html;
    this._attachEventListeners();
  },

  _attachEventListeners() {
    const search = document.getElementById('users-search');
    const role = document.getElementById('users-filter-role');
    const status = document.getElementById('users-filter-status');
    const size = document.getElementById('users-page-size');
    const prev = document.getElementById('users-btn-prev');
    const next = document.getElementById('users-btn-next');

    if (search) {
      search.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.currentPage = 1;
        this.render();
      });
    }

    if (role) {
      role.addEventListener('change', (e) => {
        this.roleFilter = e.target.value;
        this.currentPage = 1;
        this.render();
      });
    }

    if (status) {
      status.addEventListener('change', (e) => {
        this.statusFilter = e.target.value;
        this.currentPage = 1;
        this.render();
      });
    }

    if (size) {
      size.addEventListener('change', (e) => {
        this.pageSize = parseInt(e.target.value, 10) || 20;
        this.currentPage = 1;
        this.render();
      });
    }

    if (prev) {
      prev.addEventListener('click', () => {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.render();
        }
      });
    }

    if (next) {
      next.addEventListener('click', () => {
        const total = Auth.getAllUsers().length;
        const totalPages = Math.max(1, Math.ceil(total / this.pageSize));
        if (this.currentPage < totalPages) {
          this.currentPage++;
          this.render();
        }
      });
    }
  },

  openUserModal(userId = null) {
    const users = Auth.getAllUsers();
    const user = userId ? users.find(u => u.id === userId) : null;
    const isEdit = !!user;

    this.currentUserPhoto = isEdit ? (user.photoUrl || null) : null;

    const existingModal = document.getElementById('user-modal-overlay');
    if (existingModal) existingModal.remove();

    const overlay = document.createElement('div');
    overlay.id = 'user-modal-overlay';
    overlay.className = 'auth-modal-overlay';
    overlay.innerHTML = `
      <div class="auth-modal-card" style="max-width:520px;text-align:left;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;">
          <h3 style="margin:0;">${isEdit ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h3>
          <button type="button" class="btn-close" onclick="document.getElementById('user-modal-overlay').remove()">✕</button>
        </div>

        <form id="user-edit-form" onsubmit="return false;">
          <!-- Foto de Perfil del Usuario con Canvas Compression -->
          <div style="background:var(--bg-tertiary);padding:0.85rem;border-radius:10px;border:1px solid var(--border);display:flex;align-items:center;gap:1rem;margin-bottom:1rem;">
            <div id="user-photo-preview" style="width:54px;height:54px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--brand-brown));color:white;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1.3rem;flex-shrink:0;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.2);">
              ${this.currentUserPhoto ? `<img src="${this.currentUserPhoto}" style="width:100%;height:100%;object-fit:cover;">` : (isEdit ? (user.avatar || '👤') : '📷')}
            </div>
            <div style="flex:1;">
              <label style="font-size:0.78rem;font-weight:600;color:var(--text-primary);display:block;margin-bottom:0.2rem;">Fotografía de Perfil</label>
              <input type="file" id="user-photo-file" accept="image/*" style="font-size:0.75rem;color:var(--text-secondary);">
              <small style="font-size:0.7rem;color:var(--text-muted);display:block;margin-top:2px;">JPG o PNG para gafete y avatar institucional</small>
            </div>
          </div>

          <div class="form-group">
            <label>Nombre Completo</label>
            <input type="text" id="usr-form-name" class="input-styled" value="${isEdit ? user.name : ''}" required placeholder="ej. María José Quishpe">
          </div>

          <div class="form-group">
            <label>Correo Electrónico (Login)</label>
            <input type="email" id="usr-form-email" class="input-styled" value="${isEdit ? user.email : ''}" required placeholder="ej. maria.quishpe@dci.ec">
          </div>

          <div class="form-group">
            <label>Contraseña ${isEdit ? '(dejar en blanco para conservar)' : ''}</label>
            <input type="password" id="usr-form-pass" class="input-styled" placeholder="${isEdit ? '••••••••' : 'Mínimo 6 caracteres'}" ${isEdit ? '' : 'required'}>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
            <div class="form-group">
              <label>Rol Asignado</label>
              <select id="usr-form-role" class="select-styled" style="width:100%;">
                <option value="supervisor" ${isEdit && user.role === 'supervisor' ? 'selected' : ''}>Supervisor de Campo</option>
                <option value="encuestador" ${isEdit && user.role === 'encuestador' ? 'selected' : ''}>Encuestador</option>
                <option value="nutricionista" ${isEdit && user.role === 'nutricionista' ? 'selected' : ''}>Nutricionista</option>
                <option value="observador" ${isEdit && user.role === 'observador' ? 'selected' : ''}>Observador</option>
                <option value="admin" ${isEdit && user.role === 'admin' ? 'selected' : ''}>Administrador</option>
              </select>
            </div>

            <div class="form-group">
              <label>Estado</label>
              <select id="usr-form-status" class="select-styled" style="width:100%;">
                <option value="activo" ${!isEdit || user.status === 'activo' ? 'selected' : ''}>Activo</option>
                <option value="inactivo" ${isEdit && user.status === 'inactivo' ? 'selected' : ''}>Inactivo / Suspendido</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Organización / Institución</label>
            <input type="text" id="usr-form-org" class="input-styled" value="${isEdit ? user.organization : 'Ayuda en Acción / ESPOCH'}" required>
          </div>

          <div class="form-group">
            <label>Zona o Parroquia Asignada</label>
            <input type="text" id="usr-form-zone" class="input-styled" value="${isEdit ? user.territory : 'San Andrés (Guano, Chimborazo)'}" required>
          </div>

          <div style="display:flex;justify-content:flex-end;gap:.75rem;margin-top:1.5rem;">
            <button type="button" class="btn btn-secondary" onclick="document.getElementById('user-modal-overlay').remove()">Cancelar</button>
            <button type="submit" class="btn btn-primary">${isEdit ? 'Guardar Cambios' : 'Crear Usuario'}</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(overlay);

    // Conectar carga y compresión canvas de foto
    const photoInput = document.getElementById('user-photo-file');
    const photoPreview = document.getElementById('user-photo-preview');
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
            this.currentUserPhoto = canvas.toDataURL('image/jpeg', 0.85);
            if (photoPreview) {
              photoPreview.innerHTML = `<img src="${this.currentUserPhoto}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
            }
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      });
    }

    document.getElementById('user-edit-form').addEventListener('submit', () => {
      const name = document.getElementById('usr-form-name').value.trim();
      const email = document.getElementById('usr-form-email').value.trim().toLowerCase();
      const pass = document.getElementById('usr-form-pass').value;
      const role = document.getElementById('usr-form-role').value;
      const status = document.getElementById('usr-form-status').value;
      const org = document.getElementById('usr-form-org').value.trim();
      const zone = document.getElementById('usr-form-zone').value.trim();

      const roleMap = {
        admin: 'Administrador / CIO',
        supervisor: 'Supervisor de Campo',
        encuestador: 'Encuestador de Terreno',
        nutricionista: 'Nutricionista de Campo',
        observador: 'Observador Institucional'
      };

      const allUsers = Auth.getAllUsers();

      if (isEdit) {
        const u = allUsers.find(x => x.id === userId);
        if (u) {
          u.name = name;
          u.email = email;
          if (pass) u.passwordHash = pass;
          u.role = role;
          u.roleLabel = roleMap[role] || role;
          u.status = status;
          u.organization = org;
          u.territory = zone;
          if (this.currentUserPhoto) u.photoUrl = this.currentUserPhoto;
        }
      } else {
        // Verificar correo duplicado
        if (allUsers.some(x => x.email.toLowerCase() === email)) {
          alert('Ya existe un usuario con ese correo electrónico.');
          return;
        }
        allUsers.push({
          id: 'usr-' + Date.now().toString(36),
          name,
          email,
          passwordHash: pass || 'dci2026',
          role,
          roleLabel: roleMap[role] || role,
          organization: org,
          territory: zone,
          status,
          avatar: name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
          photoUrl: this.currentUserPhoto || null,
          createdAt: new Date().toISOString().substring(0, 10),
          lastLogin: null
        });
      }

      Auth.saveUsers(allUsers);
      overlay.remove();
      this.render();
    });
  },

  toggleStatus(userId) {
    const users = Auth.getAllUsers();
    const u = users.find(x => x.id === userId);
    if (u) {
      u.status = u.status === 'activo' ? 'inactivo' : 'activo';
      Auth.saveUsers(users);
      this.render();
    }
  },

  deleteUser(userId) {
    if (!confirm('¿Está seguro de eliminar esta cuenta de usuario? Esta acción no se puede deshacer.')) return;
    let users = Auth.getAllUsers();
    users = users.filter(x => x.id !== userId);
    Auth.saveUsers(users);
    this.render();
  }
};
