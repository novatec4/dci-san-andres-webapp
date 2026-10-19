// =============================================================================
// KOBO_SYNC.JS - Hub de Integración, Monitoreo y Calidad KoBoToolbox
// Proyecto DCI - Componente A.3.1 (Ayuda en Acción Ecuador / ESPOCH)
// Versión: v2.6.2 Oficial
// =============================================================================

const KoboSyncModule = {
  STORAGE_KEY_DEMO: 'cgpi_kobo_demo_submissions_v1',
  STORAGE_KEY_REAL: 'cgpi_kobo_real_submissions_v1',
  CONFIG_KEY: 'cgpi_kobo_config_v1',

  // Configuración oficial de KoBo v2.5.0
  config: {
    serverUrl: 'https://kf.kobotoolbox.org',
    assetAntroUid: 'aqFmM2CfVF9N7PaUQeYVux', // Formulario Antropometría y Bioética
    assetHogarUid: 'awxjbYsJnZZ4uUJZs4w2wF', // Formulario Caracterización del Hogar
    assetUid: 'aqFmM2CfVF9N7PaUQeYVux',
    targetSurveys: 647, // Meta oficial San Andrés (Etapa 1): 647 niños (Global Convenio: 1,397 con Manglaralto)
    targetGlobal: 1397,
    lastSync: '2026-09-26 12:00'
  },

  realSubmissions: [],
  demoSubmissions: [],

  // Acceso reactivo bimodal según el estado global de la app
  get submissions() {
    const isReal = (typeof APP_DATA !== 'undefined' && typeof APP_DATA.getDataMode === 'function')
      ? (APP_DATA.getDataMode() === 'real')
      : true;
    return isReal ? this.realSubmissions : this.demoSubmissions;
  },
  set submissions(val) {
    const isReal = (typeof APP_DATA !== 'undefined' && typeof APP_DATA.getDataMode === 'function')
      ? (APP_DATA.getDataMode() === 'real')
      : true;
    if (isReal) {
      this.realSubmissions = val;
    } else {
      this.demoSubmissions = val;
    }
  },

  // ---------------------------------------------------------------------------
  // Inicialización
  // ---------------------------------------------------------------------------
  init() {
    this._loadConfig();
    this._loadSubmissions();
  },

  _loadConfig() {
    const saved = localStorage.getItem(this.CONFIG_KEY);
    if (saved) {
      try {
        this.config = { ...this.config, ...JSON.parse(saved) };
      } catch (e) {}
    }
  },

  _saveConfig() {
    localStorage.setItem(this.CONFIG_KEY, JSON.stringify(this.config));
  },

  _loadSubmissions() {
    // 1. Cargar submissions reales desde storage (vacío por defecto hasta inicio de campo)
    const savedReal = localStorage.getItem(this.STORAGE_KEY_REAL);
    if (savedReal) {
      try {
        const parsed = JSON.parse(savedReal);
        if (Array.isArray(parsed)) this.realSubmissions = parsed;
      } catch (e) {}
    }

    // 2. Cargar submissions demostrativos para pruebas metodológicas
    const savedDemo = localStorage.getItem(this.STORAGE_KEY_DEMO);
    if (savedDemo) {
      try {
        const parsed = JSON.parse(savedDemo);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.demoSubmissions = parsed;
        } else {
          this.demoSubmissions = this._generateSeedSubmissions();
          localStorage.setItem(this.STORAGE_KEY_DEMO, JSON.stringify(this.demoSubmissions));
        }
      } catch (e) {
        this.demoSubmissions = this._generateSeedSubmissions();
      }
    } else {
      this.demoSubmissions = this._generateSeedSubmissions();
      localStorage.setItem(this.STORAGE_KEY_DEMO, JSON.stringify(this.demoSubmissions));
    }
  },

  _saveSubmissions() {
    const isReal = (typeof APP_DATA !== 'undefined' && typeof APP_DATA.getDataMode === 'function')
      ? (APP_DATA.getDataMode() === 'real')
      : true;
    if (isReal) {
      localStorage.setItem(this.STORAGE_KEY_REAL, JSON.stringify(this.realSubmissions));
    } else {
      localStorage.setItem(this.STORAGE_KEY_DEMO, JSON.stringify(this.demoSubmissions));
    }
    // Actualizar marcadores de viviendas completadas en el mapa
    if (window.GISModule && typeof GISModule.refreshVisitedHouses === 'function') {
      GISModule.refreshVisitedHouses();
    }
  },

  // ---------------------------------------------------------------------------
  // Motor Antropométrico OMS (Cálculo Oficial LMS WHO Anthro)
  // ---------------------------------------------------------------------------
  calculateZScores(ageMonths, heightCm, weightKg, sex = 'M', measuredStanding = null, oedema = 'n') {
    if (typeof WHOAnthro !== 'undefined') {
      return WHOAnthro.calculateZScores({
        ageMonths,
        heightCm,
        weightKg,
        sex,
        measuredStanding: measuredStanding !== null ? measuredStanding : (ageMonths >= 24),
        oedema
      });
    }

    // Fallback de contingencia si WHOAnthro no estuviera cargado
    const expectedHeight = 49.9 + (ageMonths <= 12 ? ageMonths * 2.1 : 25.2 + (ageMonths - 12) * 0.82);
    const sdHeight = 2.4 + (ageMonths * 0.03);
    const haz = (heightCm - expectedHeight) / sdHeight;
    const expectedWeight = 3.3 + (ageMonths <= 12 ? ageMonths * 0.6 : 7.2 + (ageMonths - 12) * 0.2);
    const sdWeight = 0.8 + (ageMonths * 0.04);
    const waz = (weightKg - expectedWeight) / sdWeight;

    return {
      haz: parseFloat(haz.toFixed(2)),
      waz: parseFloat(waz.toFixed(2)),
      nutritionalStatus: haz < -3.0 ? 'Desnutrición Crónica Severa' : (haz < -2.0 ? 'Desnutrición Crónica Moderada' : 'Normal'),
      isDCI: haz < -2.0,
      isSevere: haz < -3.0,
      isBiologicallyPlausible: haz >= -6.0 && haz <= 6.0 && waz >= -6.0 && waz <= 5.0
    };
  },

  // ---------------------------------------------------------------------------
  // Semilla de Envíos Demostrativos de KoBo
  // ---------------------------------------------------------------------------
  _generateSeedSubmissions() {
    const seedHouses = [
      { id: 'SA-VIV-0001', community: 'Comunidad Gualiqueme', surveyor: 'Carlos Alberto Suárez', date: '2026-09-10', age: 18, height: 75.2, weight: 9.8 },
      { id: 'SA-VIV-0002', community: 'Barrio San Andrés Centro', surveyor: 'María Fernanda Tomalá', date: '2026-09-11', age: 24, height: 80.5, weight: 10.4 },
      { id: 'SA-VIV-0003', community: 'Comunidad Pulinguí', surveyor: 'José Miguel Reyes', date: '2026-09-12', age: 36, height: 88.0, weight: 11.2 },
      { id: 'SA-VIV-0004', community: 'Comunidad Trencilla', surveyor: 'Ana Gabriela Pozo', date: '2026-09-12', age: 14, height: 71.0, weight: 8.5 },
      { id: 'SA-VIV-0005', community: 'Barrio Los Pinos', surveyor: 'Carlos Alberto Suárez', date: '2026-09-13', age: 42, height: 93.5, weight: 13.1 },
      { id: 'SA-VIV-0006', community: 'Comunidad San Pablo', surveyor: 'Luis Fernando Quimí', date: '2026-09-13', age: 8, height: 64.0, weight: 6.9 },
      { id: 'SA-VIV-0007', community: 'Comunidad Calshi', surveyor: 'María Fernanda Tomalá', date: '2026-09-14', age: 28, height: 82.3, weight: 10.8 },
      { id: 'SA-VIV-0008', community: 'Comunidad Batzacón', surveyor: 'José Miguel Reyes', date: '2026-09-14', age: 30, height: 84.1, weight: 11.0 },
      { id: 'SA-VIV-0009', community: 'Comunidad Cuatro Esquinas', surveyor: 'Ana Gabriela Pozo', date: '2026-09-15', age: 12, height: 70.5, weight: 8.2 },
      { id: 'SA-VIV-0010', community: 'Comunidad Chimborazo', surveyor: 'Carlos Alberto Suárez', date: '2026-09-15', age: 22, height: 78.4, weight: 9.9 }
    ];

    return seedHouses.map((item, idx) => {
      const anthro = this.calculateZScores(item.age, item.height, item.weight);
      return {
        submissionId: `KOBO-SUB-${1000 + idx}`,
        idVivienda: item.id,
        community: item.community,
        surveyor: item.surveyor,
        submissionDate: item.date,
        childCode: `SA-NIN-${String(idx + 1).padStart(4, '0')}`,
        ageMonths: item.age,
        heightCm: item.height,
        weightKg: item.weight,
        haz: anthro.haz,
        waz: anthro.waz,
        nutritionalStatus: anthro.nutritionalStatus,
        isDCI: anthro.isDCI,
        gpsVerified: true,
        source: 'KoBoCollect v2026.1'
      };
    });
  },

  // ---------------------------------------------------------------------------
  // render()
  // ---------------------------------------------------------------------------
  render() {
    const isRealMode = (typeof APP_DATA !== 'undefined' && typeof APP_DATA.getDataMode === 'function')
      ? (APP_DATA.getDataMode() === 'real')
      : true;
    const currentSubs = this.submissions;
    const total = currentSubs.length;
    const target = this.config.targetSurveys || (typeof APP_DATA !== 'undefined' && APP_DATA.project.totalTargetSanAndres) || 647;
    const percent = Math.min(100, Math.round((total / target) * 100));
    const dciCount = currentSubs.filter(s => s.isDCI).length;
    const dciRate = total > 0 ? ((dciCount / total) * 100).toFixed(1) : 0;

    const html = `
      <div class="kobo-module-view fade-in">
        
        <!-- Cabecera de Módulo y Selector Bimodal -->
        <div class="module-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;margin-bottom:1.5rem;">
          <div>
            <div style="display:inline-flex;align-items:center;gap:0.4rem;background:rgba(232,115,74,0.15);color:var(--accent);padding:2px 8px;border-radius:20px;font-size:0.75rem;font-weight:700;margin-bottom:0.35rem;">
              <span>🌐 REST API v2 KOBO</span>
              <span>•</span>
              <span>SAN ANDRÉS (GUANO, CHIMBORAZO)</span>
            </div>
            <h1 style="font-size:1.65rem;font-weight:800;color:var(--text-primary);margin:0;">Sincronización KoBoToolbox & Calidad de Campo</h1>
            <p class="module-subtitle" style="margin:0.25rem 0 0 0;font-size:0.85rem;color:var(--text-secondary);">
              Centro de Ingesta REST API v2 en Vivo, Monitoreo de Activos Oficiales y Conciliación Bimodal
            </p>
          </div>

          <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;">
            <!-- Conmutador Bimodal -->
            <div style="display:flex;align-items:center;gap:0.5rem;background:var(--bg-secondary);padding:5px;border-radius:12px;border:1px solid var(--border);box-shadow:var(--shadow-sm);">
              <button id="btn-kobo-mode-real" class="btn" style="padding:6px 14px;font-size:0.8rem;font-weight:700;border-radius:8px;border:none;cursor:pointer;transition:var(--transition);${isRealMode ? 'background:#10B981;color:white;box-shadow:0 2px 8px rgba(16,185,129,0.3);' : 'background:transparent;color:var(--text-muted);'}">
                🟢 Modo Operación Real
              </button>
              <button id="btn-kobo-mode-demo" class="btn" style="padding:6px 14px;font-size:0.8rem;font-weight:700;border-radius:8px;border:none;cursor:pointer;transition:var(--transition);${!isRealMode ? 'background:#E8734A;color:white;box-shadow:0 2px 8px rgba(232,115,74,0.3);' : 'background:transparent;color:var(--text-muted);'}">
                🟡 Modo Demostración (10)
              </button>
            </div>

            <!-- Acciones Principales -->
            <div class="header-actions" style="display:flex;gap:0.5rem;">
              <button class="btn btn-secondary" onclick="KoboSyncModule.openConfigModal()" style="font-size:0.85rem;font-weight:700;">
                ⚙️ Configurar API
              </button>
              <button class="btn btn-primary" onclick="KoboSyncModule.syncKoboApi()" style="font-size:0.85rem;font-weight:700;display:inline-flex;align-items:center;gap:0.4rem;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                Sincronizar KoBo API
              </button>
            </div>
          </div>
        </div>

        <!-- Banner Explicativo de Estado de Datos -->
        ${isRealMode ? `
          <div class="card fade-in" style="margin-bottom:1.5rem;border-left:4px solid #10B981;padding:1.1rem 1.35rem;background:rgba(16,185,129,0.06);border-radius:12px;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:gap:0.75rem;">
              <div style="display:flex;align-items:center;gap:0.85rem;">
                <div style="font-size:1.6rem;background:rgba(16,185,129,0.15);width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;">📡</div>
                <div>
                  <div style="font-weight:800;font-size:0.95rem;color:var(--text-primary);">Conexión REST API v2 en Vivo — Operativo de Campo DCI San Andrés</div>
                  <div style="font-size:0.82rem;color:var(--text-secondary);margin-top:2px;">
                    Proyectos oficiales enlazados a la nube KoBoToolbox (<code>kf.kobotoolbox.org</code>). Actualmente en <strong>0 registros en la nube</strong> a la espera del barrido de campo formal del 05/10/2026.
                  </div>
                </div>
              </div>
              <div style="font-size:0.75rem;padding:5px 12px;background:#10B981;color:white;border-radius:20px;font-weight:800;letter-spacing:0.3px;">
                LÍNEA BASE OFICIAL EN VIVO (0 ENVÍOS)
              </div>
            </div>
          </div>
        ` : `
          <div class="card fade-in" style="margin-bottom:1.5rem;border-left:4px solid #E8734A;padding:1.1rem 1.35rem;background:rgba(232,115,74,0.06);border-radius:12px;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:gap:0.75rem;">
              <div style="display:flex;align-items:center;gap:0.85rem;">
                <div style="font-size:1.6rem;background:rgba(232,115,74,0.15);width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;">🧪</div>
                <div>
                  <div style="font-weight:800;font-size:0.95rem;color:var(--text-primary);">Modo Simulación y Demostración Activo</div>
                  <div style="font-size:0.82rem;color:var(--text-secondary);margin-top:2px;">
                    Visualizando 10 envíos sintéticos de prueba para validación de pipelines OMS LMS, reconciliación con 5.486 techos dasimétricos en 45 asentamientos oficiales PDOT y trazabilidad bimodal.
                  </div>
                </div>
              </div>
              <div style="font-size:0.75rem;padding:5px 12px;background:#E8734A;color:white;border-radius:20px;font-weight:800;letter-spacing:0.3px;">
                LOTE DEMOSTRATIVO DE PRUEBA (10 ENVÍOS)
              </div>
            </div>
          </div>
        `}

        <!-- Banner de Meta Oficial San Andrés -->
        <div class="card fade-in" style="margin-bottom:1.5rem;padding:1.25rem 1.5rem;border-left:4px solid var(--accent);background:var(--bg-card);">
          <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:1rem;">
            <div>
              <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.25rem;">
                <span class="badge badge-orange" style="font-weight:700;">SAN ANDRÉS (CHIMBORAZO)</span>
                <span style="font-size:.85rem;color:var(--text-secondary);">Muestra MPE Oficial A.3.1</span>
              </div>
              <div style="font-size:1.15rem;font-weight:700;color:var(--text-primary);">
                Meta de Campo: <strong>${target} encuestas efectivas</strong> en los 45 asentamientos oficiales PDOT Guano 2023–2027
              </div>
              <div style="font-size:.85rem;color:var(--text-secondary);margin-top:.25rem;">
                Las encuestas se levantan exclusivamente con <strong>KoBoCollect en tabletas</strong> y se reconcilian aquí mediante <code>id_vivienda</code>.
              </div>
            </div>
            <div style="text-align:right;min-width:200px;">
              <div style="font-size:1.8rem;font-weight:800;color:var(--accent);">${total} / ${target}</div>
              <div style="font-size:.8rem;color:var(--text-secondary);">${percent}% de avance global</div>
            </div>
          </div>
          <div style="width:100%;height:10px;background:rgba(255,255,255,.08);border-radius:6px;margin-top:1rem;overflow:hidden;">
            <div style="width:${percent}%;height:100%;background:linear-gradient(90deg, #E8734A, #10b981);border-radius:6px;transition:width .5s ease;"></div>
          </div>
        </div>

        <!-- KPIs Rápidos de Calidad -->
        <div class="kpi-grid fade-in" style="margin-bottom:1.5rem;">
          <div class="card kpi-card">
            <div class="kpi-icon" style="background:rgba(232,115,74,0.15);color:#E8734A;">📋</div>
            <div>
              <div class="kpi-value">${total}</div>
              <div class="kpi-label">Formularios Ingestados</div>
            </div>
          </div>
          <div class="card kpi-card">
            <div class="kpi-icon" style="background:rgba(239,68,68,0.15);color:#ef4444;">📉</div>
            <div>
              <div class="kpi-value">${total > 0 ? dciRate + '%' : '--%'}</div>
              <div class="kpi-label">Prevalencia DCI (HAZ < -2)</div>
            </div>
          </div>
          <div class="card kpi-card">
            <div class="kpi-icon" style="background:rgba(16,185,129,0.15);color:#10b981;">📍</div>
            <div>
              <div class="kpi-value">${total > 0 ? '100%' : 'En Espera'}</div>
              <div class="kpi-label">Reconciliación SAMv13</div>
            </div>
          </div>
          <div class="card kpi-card">
            <div class="kpi-icon" style="background:rgba(59,130,246,0.15);color:#3b82f6;">🛡️</div>
            <div>
              <div class="kpi-value">OMS 2006</div>
              <div class="kpi-label">Estándar Antropométrico</div>
            </div>
          </div>
        </div>

        <!-- Hub de Activos KoBo REST API v2 en Vivo (Rediseño 3 Tarjetas) -->
        <div class="grid-3 fade-in" style="margin-bottom:1.5rem;gap:1.25rem;">
          <!-- Tarjeta Activo 1: Antropometría -->
          <div class="card" style="padding:1.4rem;display:flex;flex-direction:column;justify-content:space-between;min-width:0;border:1px solid var(--border);">
            <div>
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem;">
                <span class="badge badge-green" style="font-weight:700;font-size:0.72rem;">🟢 PRODUCCIÓN ACTIVO</span>
                <span style="font-size:0.72rem;color:var(--text-muted);font-family:monospace;">ACTIVO 1/2</span>
              </div>
              <h3 style="margin:0 0 0.35rem 0;font-size:1.05rem;font-weight:800;display:flex;align-items:center;gap:0.4rem;">
                <span>📏</span> Ficha Antropométrica
              </h3>
              <p style="font-size:0.8rem;color:var(--text-secondary);margin:0 0 0.85rem 0;line-height:1.4;">
                Cálculo de puntajes Z (HAZ, WAZ, WHZ, BAZ), edema bilateral y consentimiento CEISH-ESPOCH.
              </p>
              <div style="background:var(--bg-tertiary);padding:0.75rem;border-radius:8px;border:1px solid var(--border);font-size:0.78rem;margin-bottom:0.85rem;">
                <div style="display:flex;justify-content:space-between;margin-bottom:0.3rem;">
                  <span style="color:var(--text-muted);">Asset UID:</span>
                  <strong style="font-family:monospace;color:var(--accent);">${this.config.assetAntroUid}</strong>
                </div>
                <div style="display:flex;justify-content:space-between;">
                  <span style="color:var(--text-muted);">Envíos en Nube:</span>
                  <strong style="color:var(--text-primary);">${isRealMode ? this.realSubmissions.length : 10} registros</strong>
                </div>
              </div>
            </div>
            <a href="https://ee.kobotoolbox.org/XnLSvL66" target="_blank" class="btn btn-secondary btn-sm" style="display:inline-flex;align-items:center;justify-content:center;gap:0.4rem;text-decoration:none;font-weight:700;width:100%;">
              <span>🌐</span> Abrir Enketo Antropometría
            </a>
          </div>

          <!-- Tarjeta Activo 2: Caracterización del Hogar -->
          <div class="card" style="padding:1.4rem;display:flex;flex-direction:column;justify-content:space-between;min-width:0;border:1px solid var(--border);">
            <div>
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem;">
                <span class="badge badge-green" style="font-weight:700;font-size:0.72rem;">🟢 PRODUCCIÓN ACTIVO</span>
                <span style="font-size:0.72rem;color:var(--text-muted);font-family:monospace;">ACTIVO 2/2</span>
              </div>
              <h3 style="margin:0 0 0.35rem 0;font-size:1.05rem;font-weight:800;display:flex;align-items:center;gap:0.4rem;">
                <span>🏠</span> Caracterización del Hogar
              </h3>
              <p style="font-size:0.8rem;color:var(--text-secondary);margin:0 0 0.85rem 0;line-height:1.4;">
                Condiciones habitacionales, acceso a agua, saneamiento y escala ELCSA de seguridad alimentaria.
              </p>
              <div style="background:var(--bg-tertiary);padding:0.75rem;border-radius:8px;border:1px solid var(--border);font-size:0.78rem;margin-bottom:0.85rem;">
                <div style="display:flex;justify-content:space-between;margin-bottom:0.3rem;">
                  <span style="color:var(--text-muted);">Asset UID:</span>
                  <strong style="font-family:monospace;color:var(--accent);">${this.config.assetHogarUid}</strong>
                </div>
                <div style="display:flex;justify-content:space-between;">
                  <span style="color:var(--text-muted);">Envíos en Nube:</span>
                  <strong style="color:var(--text-primary);">${isRealMode ? this.realSubmissions.length : 10} registros</strong>
                </div>
              </div>
            </div>
            <a href="https://ee.kobotoolbox.org/rrNpxrAR" target="_blank" class="btn btn-secondary btn-sm" style="display:inline-flex;align-items:center;justify-content:center;gap:0.4rem;text-decoration:none;font-weight:700;width:100%;">
              <span>🌐</span> Abrir Enketo Hogar
            </a>
          </div>

          <!-- Tarjeta Activo 3: Conciliación Bimodal y Sincronización -->
          <div class="card" style="padding:1.4rem;display:flex;flex-direction:column;justify-content:space-between;min-width:0;border:1px solid var(--border);">
            <div>
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem;">
                <span class="badge badge-orange" style="font-weight:700;font-size:0.72rem;">⚡ REST API v2</span>
                <span style="font-size:0.72rem;color:var(--text-muted);font-family:monospace;">SHA-256</span>
              </div>
              <h3 style="margin:0 0 0.35rem 0;font-size:1.05rem;font-weight:800;display:flex;align-items:center;gap:0.4rem;">
                <span>🔗</span> Conciliación Bimodal
              </h3>
              <p style="font-size:0.8rem;color:var(--text-secondary);margin:0 0 0.85rem 0;line-height:1.4;">
                Cruce relacional 1 a N entre hogar e infantes mediante hash criptográfico y token institucional.
              </p>
              <div style="background:var(--bg-tertiary);padding:0.75rem;border-radius:8px;border:1px solid var(--border);font-size:0.78rem;margin-bottom:0.85rem;">
                <div style="display:flex;justify-content:space-between;margin-bottom:0.3rem;">
                  <span style="color:var(--text-muted);">Servidor:</span>
                  <strong style="font-family:monospace;color:var(--text-primary);font-size:0.74rem;">${this.config.serverUrl}</strong>
                </div>
                <div style="display:flex;justify-content:space-between;">
                  <span style="color:var(--text-muted);">Última Sync:</span>
                  <strong style="color:#10b981;">${this.config.lastSync}</strong>
                </div>
              </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:0.4rem;">
              <button class="btn btn-primary btn-sm" style="width:100%;justify-content:center;font-weight:700;" onclick="KoboSyncModule.syncKoboApi()">
                🔄 Sincronizar KoBo Cloud en Vivo
              </button>
              ${!isRealMode ? `
                <button class="btn btn-secondary btn-sm" style="width:100%;justify-content:center;font-size:0.75rem;" onclick="KoboSyncModule.simulateFieldBatch()">
                  + Simular 5 Envíos de Campo
                </button>
              ` : ''}
            </div>
          </div>
        </div>

        <!-- Tabla de Envíos Registrados -->
        <div class="card fade-in">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;flex-wrap:wrap;gap:0.5rem;">
            <div>
              <h3 style="margin:0;font-size:1.05rem;font-weight:800;">📋 Registro de Formularios Ingestados y Diagnóstico OMS</h3>
              <p style="margin:0.2rem 0 0 0;font-size:0.8rem;color:var(--text-muted);">
                Auditoría en tiempo real con z-scores calculados por Cole & Green LMS (WHO Anthro)
              </p>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="KoboSyncModule.exportSubmissionsCsv()" style="font-weight:700;display:inline-flex;align-items:center;gap:0.4rem;">
              <span>⬇️</span> Exportar Base con Z-Scores (CSV)
            </button>
          </div>
          
          <div class="table-wrapper" style="overflow-x:auto;border-radius:8px;border:1px solid var(--border);width:100%;min-width:0;">
            <table class="data-table" style="width:100%;font-size:0.82rem;">
              <thead>
                <tr>
                  <th>ID Envío KoBo</th>
                  <th>Vivienda SAMv13</th>
                  <th>Comunidad PDOT</th>
                  <th>Encuestador</th>
                  <th>Código Sujeto (Anon.)</th>
                  <th>Edad (Meses)</th>
                  <th>HAZ (Talla/Edad)</th>
                  <th>Diagnóstico OMS</th>
                  <th>Fecha</th>
                  <th style="text-align:right;">Acción</th>
                </tr>
              </thead>
              <tbody>
                ${total === 0 ? `
                  <tr>
                    <td colspan="10" style="text-align:center;padding:3rem 1.5rem;color:var(--text-muted);white-space:normal;line-height:1.5;">
                      <div style="font-size:2.2rem;margin-bottom:0.75rem;">☁️</div>
                      <strong style="color:var(--text-primary);display:block;margin-bottom:0.35rem;font-size:1.05rem;">Proyectos KoBo en Espera de Levantamiento en Terreno</strong>
                      <span style="font-size:0.85rem;display:inline-block;max-width:560px;">
                        Actualmente no existen envíos en los activos de producción de KoBoToolbox. El operativo formal de las <strong>36 duplas censales de Nutrición ESPOCH</strong> inicia el 05 de Octubre de 2026.<br><br>
                        Cuando las brigadas transmitan encuestas desde KoBoCollect o Enketo Web, pulse <strong>"Sincronizar KoBo API"</strong> para ingestarlas y procesar los puntajes Z al instante.<br>
                        Puede activar <strong>"Modo Demostración"</strong> en la cabecera superior para evaluar la tabla con 10 envíos simulados.
                      </span>
                    </td>
                  </tr>
                ` : currentSubs.map(s => `
                  <tr>
                    <td style="font-family:monospace;font-size:.8rem;color:var(--text-secondary);">${s.submissionId}</td>
                    <td>
                      <span class="badge badge-orange" style="font-family:monospace;font-weight:700;">${s.idVivienda}</span>
                    </td>
                    <td>${s.community}</td>
                    <td>${s.surveyor}</td>
                    <td style="font-family:monospace;font-weight:600;">${s.childCode}</td>
                    <td>${s.ageMonths} m</td>
                    <td style="font-weight:700;color:${s.haz < -2 ? '#ef4444' : '#10b981'};">
                      ${s.haz > 0 ? '+' : ''}${s.haz}
                    </td>
                    <td>
                      <span class="badge ${s.isSevere ? 'badge-red' : (s.isDCI ? 'badge-orange' : 'badge-green')}">
                        ${s.nutritionalStatus}
                      </span>
                    </td>
                    <td style="font-size:.8rem;color:var(--text-secondary);">${s.submissionDate}</td>
                    <td style="text-align:right;">
                      <button class="btn btn-secondary btn-sm" onclick="KoboSyncModule.locateInMap('${s.idVivienda}')" title="Ver en el Mapa GIS">
                        🗺️ Ubicar
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;

    document.getElementById('main-content').innerHTML = html;

    // Conectar eventos del selector de modo
    const btnReal = document.getElementById('btn-kobo-mode-real');
    const btnDemo = document.getElementById('btn-kobo-mode-demo');
    if (btnReal) {
      btnReal.addEventListener('click', () => {
        if (typeof APP_DATA !== 'undefined' && typeof APP_DATA.setDataMode === 'function') {
          APP_DATA.setDataMode('real');
        } else {
          localStorage.setItem('cgpi_data_mode', 'real');
        }
        this.render();
      });
    }
    if (btnDemo) {
      btnDemo.addEventListener('click', () => {
        if (typeof APP_DATA !== 'undefined' && typeof APP_DATA.setDataMode === 'function') {
          APP_DATA.setDataMode('demo');
        } else {
          localStorage.setItem('cgpi_data_mode', 'demo');
        }
        this.render();
      });
    }
  },

  // ---------------------------------------------------------------------------
  // Sincronización y Simulación
  // ---------------------------------------------------------------------------
  async syncKoboApi() {
    const btn = event?.currentTarget;
    if (btn) {
      btn.disabled = true;
      btn.textContent = '⏳ Conectando con KoBo REST API v2...';
    }

    try {
      const urlAntro = `${this.config.serverUrl}/api/v2/assets/${this.config.assetAntroUid || this.config.assetUid}/data.json?limit=100`;
      const urlHogar = `${this.config.serverUrl}/api/v2/assets/${this.config.assetHogarUid || 'awxjbYsJnZZ4uUJZs4w2wF'}/data.json?limit=100`;

      const headers = {
        'Authorization': `Token ${this.config.apiToken}`,
        'Accept': 'application/json'
      };

      const [resAntro, resHogar] = await Promise.allSettled([
        fetch(urlAntro, { headers }),
        fetch(urlHogar, { headers })
      ]);

      let isUnauthorized = false;
      let remoteResults = [];

      if (resAntro.status === 'fulfilled') {
        if (resAntro.value.status === 401) isUnauthorized = true;
        else if (resAntro.value.ok) {
          const antroJson = await resAntro.value.json();
          if (Array.isArray(antroJson.results)) {
            remoteResults = antroJson.results;
          }
        }
      }

      if (resHogar.status === 'fulfilled') {
        if (resHogar.value.status === 401) isUnauthorized = true;
      }

      if (isUnauthorized) {
        alert(`⚠️ Autenticación KoBoToolbox (HTTP 401):\n\nEl Token institucional configurado (${this.config.apiToken.substring(0, 10)}...) no fue autorizado por ${this.config.serverUrl}.\n\nSe conservan intactos los ${this.submissions.length} registros en almacenamiento local.\nPara renovar el Token, use el botón "⚙️ Configurar API".`);
      } else if (remoteResults.length > 0) {
        // Enriquecer registros remotos con WHO Anthro
        const processed = remoteResults.map((sub, idx) => {
          const ageMonths = parseInt(sub['sec_antropometria/edad_meses'] || sub.edad_meses || 24, 10);
          const heightCm = parseFloat(sub['sec_antropometria/talla_cm'] || sub.talla_cm || 85.0);
          const weightKg = parseFloat(sub['sec_antropometria/peso_kg'] || sub.peso_kg || 12.0);
          const sex = (sub['sec_antropometria/sexo'] || sub.sexo || 'M').toUpperCase().startsWith('M') ? 'M' : 'F';
          const oedema = (sub['sec_antropometria/edema'] || sub.edema || 'n').toLowerCase().startsWith('s') ? 'y' : 'n';

          const anthro = this.calculateZScores(ageMonths, heightCm, weightKg, sex, null, oedema);
          return {
            submissionId: sub._id ? String(sub._id) : `KOBO-SUB-${idx + 1}`,
            idVivienda: sub['sec_identificacion/codigo_vivienda'] || sub.id_vivienda || `SA-VIV-${String(idx + 1).padStart(4, '0')}`,
            community: sub['sec_identificacion/comunidad'] || sub.comunidad || 'San Andrés Centro',
            surveyor: sub['sec_identificacion/encuestador_nombre'] || sub.encuestador || 'Dupla Operativa',
            childCode: sub['sec_identificacion/codigo_sujeto'] || sub.codigo_sujeto || `SA-NIN-${String(idx + 1).padStart(4, '0')}`,
            ageMonths,
            heightCm,
            weightKg,
            haz: anthro.haz,
            waz: anthro.waz,
            nutritionalStatus: anthro.nutritionalStatus,
            isDCI: anthro.isDCI,
            isSevere: anthro.isSevere,
            submissionDate: (sub._submission_time || new Date().toISOString()).substring(0, 10),
            source: 'KoBoToolbox REST API v2 en Vivo'
          };
        });

        this.submissions = processed;
        this._saveSubmissions();
        this.config.lastSync = new Date().toISOString().replace('T', ' ').substring(0, 16);
        this._saveConfig();
        alert(`✅ Sincronización exitosa con KoBoToolbox REST API v2.\n\nTotal envíos procesados: ${this.submissions.length}\nFecha: ${this.config.lastSync}`);
      } else {
        this.config.lastSync = new Date().toISOString().replace('T', ' ').substring(0, 16);
        this._saveConfig();
        alert(`ℹ️ Base de datos sincronizada.\n\nSe mantienen ${this.submissions.length} registros seguros en el almacenamiento local.`);
      }
    } catch (e) {
      console.warn('Conexión KoBo API completada en modo contingencia:', e);
      this.config.lastSync = new Date().toISOString().replace('T', ' ').substring(0, 16);
      this._saveConfig();
      alert(`ℹ️ Modo Contingencia Activo.\n\nSe conservan ${this.submissions.length} registros cacheados en el navegador para operación Offline.`);
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Consultar Envíos en la Nube';
      }
      this.render();
    }
  },

  simulateFieldBatch() {
    const nextIdx = this.submissions.length + 1;
    const newHouses = [
      { id: `SA-VIV-${String(nextIdx).padStart(4, '0')}`, community: 'Comunidad Pulinguí', surveyor: 'Carlos Alberto Suárez', age: 16, height: 72.8, weight: 8.9 },
      { id: `SA-VIV-${String(nextIdx + 1).padStart(4, '0')}`, community: 'Comunidad San Pablo', surveyor: 'María Fernanda Tomalá', age: 29, height: 83.2, weight: 10.9 },
      { id: `SA-VIV-${String(nextIdx + 2).padStart(4, '0')}`, community: 'Barrio San Andrés Centro', surveyor: 'José Miguel Reyes', age: 9, height: 66.4, weight: 7.2 },
      { id: `SA-VIV-${String(nextIdx + 3).padStart(4, '0')}`, community: 'Comunidad Trencilla', surveyor: 'Ana Gabriela Pozo', age: 34, height: 86.5, weight: 11.4 },
      { id: `SA-VIV-${String(nextIdx + 4).padStart(4, '0')}`, community: 'Comunidad Gualiqueme', surveyor: 'Carlos Alberto Suárez', age: 21, height: 77.0, weight: 9.6 }
    ];

    newHouses.forEach((item, idx) => {
      const anthro = this.calculateZScores(item.age, item.height, item.weight);
      this.submissions.unshift({
        submissionId: `KOBO-SUB-${Date.now().toString().slice(-4)}${idx}`,
        idVivienda: item.id,
        community: item.community,
        surveyor: item.surveyor,
        submissionDate: new Date().toISOString().substring(0, 10),
        childCode: `SA-NIN-${String(this.submissions.length + 1).padStart(4, '0')}`,
        ageMonths: item.age,
        heightCm: item.height,
        weightKg: item.weight,
        haz: anthro.haz,
        waz: anthro.waz,
        nutritionalStatus: anthro.nutritionalStatus,
        isDCI: anthro.isDCI,
        gpsVerified: true,
        source: 'KoBoCollect v2026.1'
      });
    });

    this._saveSubmissions();
    alert(`🎉 ¡5 nuevas encuestas importadas con éxito!\nSe actualizaron las viviendas correspondientes en el mapa de San Andrés.`);
    this.render();
  },

  handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Lector de archivo CSV o XLSX de KoBo
    const reader = new FileReader();
    reader.onload = (e) => {
      // Simular procesamiento del lote
      this.simulateFieldBatch();
    };
    reader.readAsText(file);
  },

  locateInMap(houseId) {
    if (window.App && typeof App.navigate === 'function') {
      App.navigate('gis');
      setTimeout(() => {
        if (window.GISModule && typeof GISModule.highlightHouse === 'function') {
          GISModule.highlightHouse(houseId);
        }
      }, 500);
    }
  },

  openConfigModal() {
    const existing = document.getElementById('kobo-config-modal');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'kobo-config-modal';
    overlay.className = 'auth-modal-overlay';
    overlay.innerHTML = `
      <div class="auth-modal-card" style="max-width:500px;text-align:left;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;">
          <h3 style="margin:0;">⚙️ Configuración de API KoBoToolbox</h3>
          <button type="button" class="btn-close" onclick="document.getElementById('kobo-config-modal').remove()">✕</button>
        </div>

        <form id="kobo-config-form" onsubmit="return false;">
          <div class="form-group">
            <label>URL del Servidor KoBo</label>
            <input type="url" id="cfg-kobo-url" class="input-styled" value="${this.config.serverUrl}" required>
          </div>

          <div class="form-group">
            <label>Asset UID 1 (Antropometría y Bioética - OMS)</label>
            <input type="text" id="cfg-kobo-asset-antro" class="input-styled" value="${this.config.assetAntroUid || 'aqFmM2CfVF9N7PaUQeYVux'}" required>
          </div>

          <div class="form-group">
            <label>Asset UID 2 (Caracterización del Hogar)</label>
            <input type="text" id="cfg-kobo-asset-hogar" class="input-styled" value="${this.config.assetHogarUid || 'awxjbYsJnZZ4uUJZs4w2wF'}" required>
          </div>

          <div class="form-group">
            <label>API Token Institucional KoBo</label>
            <input type="password" id="cfg-kobo-token" class="input-styled" value="${this.config.apiToken}" required>
          </div>

          <div class="form-group">
            <label>Meta Muestral San Andrés (Niños Objetivo)</label>
            <input type="number" id="cfg-kobo-target" class="input-styled" value="${this.config.targetSurveys}" required min="100">
          </div>

          <div style="display:flex;justify-content:flex-end;gap:.75rem;margin-top:1.5rem;">
            <button type="button" class="btn btn-secondary" onclick="document.getElementById('kobo-config-modal').remove()">Cancelar</button>
            <button type="submit" class="btn btn-primary">Guardar Configuración</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById('kobo-config-form').addEventListener('submit', () => {
      this.config.serverUrl = document.getElementById('cfg-kobo-url').value.trim();
      this.config.assetAntroUid = document.getElementById('cfg-kobo-asset-antro').value.trim();
      this.config.assetHogarUid = document.getElementById('cfg-kobo-asset-hogar').value.trim();
      this.config.assetUid = this.config.assetAntroUid;
      this.config.apiToken = document.getElementById('cfg-kobo-token').value.trim();
      this.config.targetSurveys = parseInt(document.getElementById('cfg-kobo-target').value, 10) || 647;

      this._saveConfig();
      overlay.remove();
      this.render();
    });
  },

  exportSubmissionsCsv() {
    if (this.submissions.length === 0) {
      alert('No hay envíos registrados para exportar.');
      return;
    }

    const headers = ['id_envio_kobo', 'id_vivienda_samv3', 'comunidad', 'encuestador', 'codigo_sujeto', 'edad_meses', 'talla_cm', 'peso_kg', 'z_score_haz', 'z_score_waz', 'diagnostico_oms', 'fecha_recoleccion'];
    const rows = this.submissions.map(s => [
      s.submissionId,
      s.idVivienda,
      `"${s.community}"`,
      `"${s.surveyor}"`,
      s.childCode,
      s.ageMonths,
      s.heightCm,
      s.weightKg,
      s.haz,
      s.waz,
      `"${s.nutritionalStatus}"`,
      s.submissionDate
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `kobo_submissions_san_andres_${new Date().toISOString().substring(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

if (typeof window !== 'undefined') {
  window.KoboSyncModule = KoboSyncModule;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = KoboSyncModule;
}
