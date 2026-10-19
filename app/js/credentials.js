/* ============================================================
   credentials.js — Módulo SPA de Credenciales y Validación QR Oficial
   Operación DCI San Andrés (Componente A.3.1)
   Fundación Ayuda en Acción / ESPOCH (Escuela de Nutrición y Dietética)
   ============================================================ */

const CredentialsModule = {
  selectedBrigadistaId: 'ESPOCH-BRIG-01',
  brigadistasList: [],
  qrInstance: null,

  async render() {
    const main = document.getElementById('main-content');
    if (!main) return;

    // Asegurar carga de brigadistas
    await this._loadBrigadistas();

    const current = this.brigadistasList.find(b => b.id === this.selectedBrigadistaId) || this.brigadistasList[0] || {};

    main.innerHTML = `
      <div class="module-header fade-in" style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1rem;">
        <div>
          <h1>🪪 Credenciales Institucionales & Validación QR</h1>
          <p class="module-subtitle">Acreditación oficial para brigadistas y encuestadores de Nutrición ESPOCH • Cumplimiento CEISH y LOPDP</p>
        </div>
        <div style="display:flex;gap:0.6rem;flex-wrap:wrap;">
          <a href="verificar.html?id=${current.id || 'ESPOCH-BRIG-01'}" target="_blank" class="btn btn-secondary" style="padding:0.6rem 1rem;font-size:0.85rem;background:rgba(255,255,255,0.06);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text-primary);display:flex;align-items:center;gap:0.4rem;text-decoration:none;">
            🌐 Abrir Portal Público de Verificación
          </a>
          <button id="btn-print-credential" class="btn btn-primary" style="padding:0.6rem 1.2rem;font-size:0.85rem;background:var(--accent);color:white;border-radius:var(--radius-sm);font-weight:600;display:flex;align-items:center;gap:0.4rem;box-shadow:0 2px 10px rgba(232,115,74,0.3);">
            🖨️ Imprimir Credencial / Gafete
          </button>
        </div>
      </div>

      <!-- Control Bar: Selector de Brigadista y Filtro Rápido -->
      <div class="card fade-in" style="margin-bottom:1.5rem;padding:1.25rem;">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1rem;align-items:center;">
          <div>
            <label style="font-size:0.8rem;font-weight:600;color:var(--text-secondary);display:block;margin-bottom:0.4rem;">
              Seleccionar Brigadista (51 Estudiantes de Nutrición ESPOCH):
            </label>
            <select id="select-active-brigadista" class="select-styled" style="width:100%;padding:0.65rem 0.8rem;background:var(--bg-tertiary);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text-primary);font-weight:600;">
              ${this.brigadistasList.map(b => `
                <option value="${b.id}" ${b.id === this.selectedBrigadistaId ? 'selected' : ''}>
                  ${b.id} — ${b.nombres} (${b.dupla} • ${b.zona_codigo})
                </option>
              `).join('')}
            </select>
          </div>

          <div style="display:flex;gap:0.6rem;align-items:flex-end;">
            <div style="flex:1;">
              <label style="font-size:0.8rem;font-weight:600;color:var(--text-secondary);display:block;margin-bottom:0.4rem;">
                Filtrar por Dupla:
              </label>
              <select id="filter-dupla" class="select-styled" style="width:100%;padding:0.65rem 0.8rem;background:var(--bg-tertiary);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text-primary);">
                <option value="">Todas las Duplas (D01 a D25)</option>
                ${Array.from(new Set(this.brigadistasList.map(b => b.dupla))).sort().map(d => `
                  <option value="${d}">${d}</option>
                `).join('')}
              </select>
            </div>
            <button id="btn-copy-verify-url" class="btn btn-secondary" style="padding:0.65rem 1rem;background:rgba(255,255,255,0.06);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text-primary);white-space:nowrap;">
              📋 Copiar Enlace QR
            </button>
          </div>
        </div>
      </div>

      <!-- Credencial Container Layout -->
      <div class="grid-2 fade-in" style="align-items:start;">
        <!-- Tarjeta de Identificación Oficial -->
        <div class="card" id="credential-card-print" style="padding:0;overflow:hidden;border:2px solid rgba(232,115,74,0.4);border-radius:16px;background:var(--bg-secondary);box-shadow:0 12px 30px rgba(0,0,0,0.25);">
          <!-- Cabecera Institucional Gafete -->
          <div style="background:linear-gradient(135deg, #2D1A12 0%, #3C2415 50%, #C85A32 100%);color:white;padding:1.5rem;text-align:center;position:relative;border-bottom:2px solid var(--accent);">
            <div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:1px;color:#F09070;font-weight:800;margin-bottom:0.25rem;">
              OPERATIVO DE CAMPO DCI • COMPONENTE A.3.1
            </div>
            <div style="font-size:1.15rem;font-weight:800;letter-spacing:0.5px;color:white;">
              CREDENCIAL OFICIAL DE ACREDITACIÓN
            </div>
            <div style="font-size:0.8rem;color:rgba(255,255,255,0.85);margin-top:0.2rem;">
              Convenio de Cooperación ESPOCH & Fundación Ayuda en Acción
            </div>
          </div>

          <!-- Cuerpo de la Credencial -->
          <div style="padding:1.5rem;">
            <div style="display:flex;gap:1.25rem;align-items:center;margin-bottom:1.25rem;">
              <div style="width:72px;height:72px;border-radius:16px;background:linear-gradient(135deg, #E8734A, #C85A32);color:white;display:flex;align-items:center;justify-content:center;font-size:1.75rem;font-weight:800;box-shadow:0 4px 15px rgba(232,115,74,0.4);flex-shrink:0;" id="cred-avatar">
                ${this._getInitials(current.nombres)}
              </div>
              <div style="flex:1;">
                <div style="font-size:0.75rem;font-weight:700;color:var(--accent);letter-spacing:0.5px;" id="cred-id">
                  ${current.id || 'ESPOCH-BRIG-01'}
                </div>
                <h3 style="font-size:1.1rem;font-weight:800;color:var(--text-primary);margin:0.2rem 0;" id="cred-nombres">
                  ${current.nombres || 'BRIGADISTA'}
                </h3>
                <div style="font-size:0.85rem;color:var(--text-secondary);" id="cred-rol">
                  ${current.rol || 'Antropometrista Principal / Dupla'}
                </div>
              </div>
            </div>

            <!-- Grilla de Atributos Bioéticos y Operativos -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;background:var(--bg-tertiary);border:1px solid var(--border);padding:1rem;border-radius:10px;margin-bottom:1.25rem;font-size:0.85rem;">
              <div>
                <span style="color:var(--text-muted);font-size:0.75rem;display:block;">Cédula LOPDP:</span>
                <strong style="color:var(--text-primary);" id="cred-cedula">${current.cedula_ofuscada || '060******'}</strong>
              </div>
              <div>
                <span style="color:var(--text-muted);font-size:0.75rem;display:block;">Dupla Censal:</span>
                <strong style="color:var(--accent);" id="cred-dupla">${current.dupla || 'D01'} (${current.posicion || 'Titular'})</strong>
              </div>
              <div>
                <span style="color:var(--text-muted);font-size:0.75rem;display:block;">Carrera / Nivel:</span>
                <strong style="color:var(--text-primary);" id="cred-carrera">${current.pao || 'PAO 6 Nutrición'}</strong>
              </div>
              <div>
                <span style="color:var(--text-muted);font-size:0.75rem;display:block;">Vigencia Oficial:</span>
                <strong style="color:#10b981;" id="cred-vigencia">${current.vigencia || 'Sep - Nov 2026'}</strong>
              </div>
              <div>
                <span style="color:var(--text-muted);font-size:0.75rem;display:block;">Zona Asignada:</span>
                <strong style="color:var(--text-primary);" id="cred-zona">${current.zona_nombre || 'San Andrés Centro'}</strong>
              </div>
              <div>
                <span style="color:var(--text-muted);font-size:0.75rem;display:block;">Coordenadas Base:</span>
                <strong style="color:var(--accent);font-family:monospace;font-size:0.8rem;" id="cred-coords">-1.5917, -78.7017</strong>
              </div>
            </div>

            <!-- Código QR Interactivo Offline -->
            <div style="text-align:center;padding:1.25rem;background:#ffffff;border-radius:12px;border:1px solid var(--border);display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 4px 15px rgba(0,0,0,0.06);">
              <div id="qrcode-canvas-container" style="width:160px;height:160px;display:flex;align-items:center;justify-content:center;"></div>
              <div style="color:#2D1A12;font-weight:800;font-size:0.8rem;margin-top:0.6rem;letter-spacing:0.3px;">
                VALIDACIÓN EN LÍNEA / MPE INEC
              </div>
              <div style="color:#64748B;font-size:0.7rem;max-width:240px;line-height:1.2;margin-top:0.2rem;">
                Escanee para revalidar la identidad en el servidor seguro de Ayuda en Acción
              </div>
            </div>

            <!-- Pie Legal y Respaldo CEISH -->
            <div style="margin-top:1rem;text-align:center;font-size:0.72rem;color:var(--text-muted);line-height:1.3;">
              <p>🛡️ Dictamen Favorable de Bioética <strong>CEISH-ESPOCH</strong> • Protección de Datos Personales (LOPDP).</p>
              <p style="color:var(--accent);margin-top:0.2rem;">Soporte de Campo: <strong>+593 99 823 4512</strong></p>
            </div>
          </div>
        </div>

        <!-- Panel Lateral: Instrucciones y Acciones Operativas -->
        <div style="display:flex;flex-direction:column;gap:1.25rem;">
          <div class="card">
            <h3 style="margin-bottom:0.75rem;font-size:1.1rem;display:flex;align-items:center;gap:0.5rem;">
              <span>ℹ️</span> Protocolo de Portabilidad de Credencial
            </h3>
            <ul style="font-size:0.85rem;color:var(--text-secondary);line-height:1.6;padding-left:1.2rem;display:flex;flex-direction:column;gap:0.4rem;">
              <li>Todo brigadista debe portar su <strong>gafete impreso visible</strong> junto al chaleco institucional de Ayuda en Acción durante el barrido censal.</li>
              <li>Al llegar a cada predio en los <strong>153 anillos censales</strong>, se debe solicitar al tutor del infante (<strong>niños entre 0 y 5 años / 0 a 59 meses cumplidos</strong>) que escanee el código QR para verificar la autenticidad del personal.</li>
              <li>La lectura del código QR redirige al endpoint de validación <code>/verificar.html?id=...</code> que comprueba en tiempo real el registro activo en la base PostGIS del MPE.</li>
              <li>En zonas sin cobertura celular (páramos de Pulinguí o Trencilla), la credencial cuenta con datos completos legibles y firma de responsabilidad.</li>
            </ul>
          </div>

          <div class="card">
            <h3 style="margin-bottom:0.75rem;font-size:1.1rem;display:flex;align-items:center;gap:0.5rem;">
              <span>📍</span> Acciones Rápidas para la Dupla
            </h3>
            <div style="display:flex;flex-direction:column;gap:0.6rem;">
              <button id="btn-view-dupla-map" class="btn btn-secondary" style="justify-content:flex-start;padding:0.75rem 1rem;font-size:0.85rem;">
                🗺️ Localizar Coordenadas de la Dupla en el Mapa GIS
              </button>
              <button id="btn-open-kobo-survey" class="btn btn-secondary" style="justify-content:flex-start;padding:0.75rem 1rem;font-size:0.85rem;">
                📲 Formulario Digital KoBoToolbox (147 Variables)
              </button>
              <button id="btn-export-all-vcard" class="btn btn-secondary" style="justify-content:flex-start;padding:0.75rem 1rem;font-size:0.85rem;">
                📑 Descargar Padrón de Brigadistas (CSV Oficial)
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    this._generateQrForCurrent();
  },

  async init() {
    this._attachEventListeners();
    this._generateQrForCurrent();
  },

  destroy() {
    this.qrInstance = null;
  },

  async _loadBrigadistas() {
    if (this.brigadistasList.length > 0) return;

    try {
      const res = await fetch('data/brigadistas_espoch_dci.json');
      if (res.ok) {
        this.brigadistasList = await res.json();
      }
    } catch (e) {
      console.warn('Error cargando brigadistas_espoch_dci.json, usando APP_DATA', e);
    }

    if (!this.brigadistasList || this.brigadistasList.length === 0) {
      // Fallback a APP_DATA surveyors si existen
      if (window.APP_DATA && Array.isArray(APP_DATA.surveyors)) {
        this.brigadistasList = APP_DATA.surveyors.map((s, idx) => ({
          id: s.cedula ? `ESPOCH-BRIG-${String(idx + 1).padStart(2, '0')}` : `ESPOCH-BRIG-01`,
          nombres: `${s.name} ${s.lastName}`.toUpperCase(),
          cedula_ofuscada: s.cedula ? s.cedula.substring(0, 6) + '****' : '060000****',
          carrera: 'Nutrición y Dietética - ESPOCH',
          pao: 'PAO 6',
          rol: s.role === 'supervisor' ? 'Supervisor de Dupla' : 'Encuestador / Antropometrista',
          dupla: `D${String(Math.ceil((idx + 1) / 2)).padStart(2, '0')}`,
          posicion: (idx % 2 === 0) ? 'Titular 1' : 'Titular 2',
          zona_codigo: 'Zona A',
          zona_nombre: 'San Andrés Centro',
          estado: 'ACTIVO - CERTIFICADO TEM',
          vigencia: '21 Sep 2026 - 13 Nov 2026',
          convenio: 'ESPOCH / Fundación Ayuda en Acción',
          telefono_soporte: '+593 99 823 4512'
        }));
      }
    }
  },

  _attachEventListeners() {
    const select = document.getElementById('select-active-brigadista');
    if (select) {
      select.addEventListener('change', (e) => {
        this.showBrigadista(e.target.value);
      });
    }

    const duplaFilter = document.getElementById('filter-dupla');
    if (duplaFilter) {
      duplaFilter.addEventListener('change', (e) => {
        const val = e.target.value;
        const options = select.querySelectorAll('option');
        let firstVisible = null;
        options.forEach(opt => {
          const brig = this.brigadistasList.find(b => b.id === opt.value);
          if (!val || (brig && brig.dupla === val)) {
            opt.style.display = '';
            if (!firstVisible) firstVisible = opt.value;
          } else {
            opt.style.display = 'none';
          }
        });
        if (firstVisible) {
          select.value = firstVisible;
          this.showBrigadista(firstVisible);
        }
      });
    }

    const printBtn = document.getElementById('btn-print-credential');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    const copyBtn = document.getElementById('btn-copy-verify-url');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const url = `${window.location.origin}/verificar.html?id=${encodeURIComponent(this.selectedBrigadistaId)}`;
        navigator.clipboard.writeText(url).then(() => {
          copyBtn.textContent = '✅ Enlace Copiado!';
          setTimeout(() => { copyBtn.textContent = '📋 Copiar Enlace QR'; }, 2000);
        }).catch(() => {
          prompt('Copie el enlace de validación pública:', url);
        });
      });
    }

    const mapBtn = document.getElementById('btn-view-dupla-map');
    if (mapBtn) {
      mapBtn.addEventListener('click', () => {
        if (window.App && typeof App.navigateTo === 'function') {
          App.navigateTo('gis');
          const brig = this.brigadistasList.find(b => b.id === this.selectedBrigadistaId);
          if (brig && window.GISModule) {
            setTimeout(() => {
              if (typeof GISModule.focusCommunityOrZone === 'function') {
                GISModule.focusCommunityOrZone(brig.zona_nombre || brig.zona_codigo);
              }
            }, 350);
          }
        }
      });
    }

    const koboBtn = document.getElementById('btn-open-kobo-survey');
    if (koboBtn) {
      koboBtn.addEventListener('click', () => {
        if (window.App && typeof App.navigateTo === 'function') {
          App.navigateTo('kobo');
        }
      });
    }

    const exportBtn = document.getElementById('btn-export-all-vcard');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this._exportCsv();
      });
    }
  },

  showBrigadista(id) {
    this.selectedBrigadistaId = id;
    const b = this.brigadistasList.find(item => item.id === id);
    if (!b) return;

    const elId = document.getElementById('cred-id');
    const elNombres = document.getElementById('cred-nombres');
    const elRol = document.getElementById('cred-rol');
    const elCedula = document.getElementById('cred-cedula');
    const elDupla = document.getElementById('cred-dupla');
    const elCarrera = document.getElementById('cred-carrera');
    const elVigencia = document.getElementById('cred-vigencia');
    const elZona = document.getElementById('cred-zona');
    const elCoords = document.getElementById('cred-coords');
    const elAvatar = document.getElementById('cred-avatar');
    const select = document.getElementById('select-active-brigadista');

    if (select) select.value = b.id;
    if (elId) elId.textContent = b.id;
    if (elNombres) elNombres.textContent = b.nombres;
    if (elRol) elRol.textContent = b.rol;
    if (elCedula) elCedula.textContent = b.cedula_ofuscada;
    if (elDupla) elDupla.textContent = `${b.dupla} (${b.posicion})`;
    if (elCarrera) elCarrera.textContent = `${b.carrera} (${b.pao})`;
    if (elVigencia) elVigencia.textContent = b.vigencia;
    if (elZona) elZona.textContent = b.zona_nombre;
    if (elCoords) {
      // Coordenadas conocidas por sector o centro de San Andrés
      const coordsMap = {
        'pulinguí': '-1.5645, -78.7420',
        'pulingui': '-1.5645, -78.7420',
        'trencilla': '-1.5830, -78.7350',
        'gualiqueme': '-1.5598, -78.7232',
        'san pablo': '-1.5720, -78.7180',
        'los pinos': '-1.5950, -78.7080',
        'batzacón': '-1.6080, -78.6980',
        'batzacon': '-1.6080, -78.6980',
        'calshi': '-1.5680, -78.7120'
      };
      let foundCoord = '-1.5917, -78.7017';
      const zn = (b.zona_nombre || '').toLowerCase();
      for (const [k, v] of Object.entries(coordsMap)) {
        if (zn.includes(k)) { foundCoord = v; break; }
      }
      elCoords.textContent = foundCoord;
    }
    if (elAvatar) elAvatar.textContent = this._getInitials(b.nombres);

    this._generateQrForCurrent();
  },

  _generateQrForCurrent() {
    const container = document.getElementById('qrcode-canvas-container');
    if (!container) return;

    container.innerHTML = '';
    const verifyUrl = `${window.location.origin}/verificar.html?id=${encodeURIComponent(this.selectedBrigadistaId)}`;

    if (typeof QRCode !== 'undefined') {
      try {
        this.qrInstance = new QRCode(container, {
          text: verifyUrl,
          width: 140,
          height: 140,
          colorDark: '#2D1A12',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H
        });
      } catch (e) {
        console.error('Error generando QR offline:', e);
        this._renderQrFallback(container, verifyUrl);
      }
    } else {
      this._renderQrFallback(container, verifyUrl);
    }
  },

  _renderQrFallback(container, url) {
    // Si por alguna razón la librería no estuviera disponible, renderizamos un fallback visual
    container.innerHTML = `
      <div style="font-size:0.75rem;color:#002B49;text-align:center;padding:10px;border:1px dashed #CBD5E1;border-radius:8px;">
        <div style="font-weight:700;margin-bottom:4px;">ID: ${this.selectedBrigadistaId}</div>
        <div style="word-break:break-all;font-size:0.65rem;color:#64748B;">${url}</div>
      </div>
    `;
  },

  _getInitials(name) {
    if (!name) return 'ES';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  },

  _exportCsv() {
    if (!this.brigadistasList || this.brigadistasList.length === 0) return;
    const headers = ['ID', 'Nombres', 'Cedula', 'Carrera', 'PAO', 'Rol', 'Dupla', 'Posicion', 'Zona Codigo', 'Zona Nombre', 'Estado', 'Vigencia'];
    const rows = this.brigadistasList.map(b => [
      b.id,
      `"${b.nombres}"`,
      b.cedula_ofuscada,
      `"${b.carrera}"`,
      `"${b.pao}"`,
      `"${b.rol}"`,
      b.dupla,
      b.posicion,
      b.zona_codigo,
      `"${b.zona_nombre}"`,
      b.estado,
      b.vigencia
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Padron_51_Brigadistas_ESPOCH_DCI.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CredentialsModule;
}
if (typeof window !== 'undefined') {
  window.CredentialsModule = CredentialsModule;
}
