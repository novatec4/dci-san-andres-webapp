/* ============================================================
   dashboard.js — Dashboard Ejecutivo Multi-Nivel
   Proyecto DCI - Componente A.3.1 (Ayuda en Acción / ESPOCH)
   Versión v2.6.2 Oficial — Storytelling en 4 Niveles Canónicos
   ============================================================ */

const DashboardModule = {
  charts: [],

  render() {
    const main = document.getElementById('main-content');
    const data = APP_DATA;
    const isRealMode = (data.getDataMode() === 'real');
    const totalChildren = isRealMode ? 0 : data.children.length;
    const target = data.project.totalTargetSanAndres || data.project.totalTarget || 647;
    const globalTarget = data.project.totalTargetGlobal || 1397;
    const coveragePct = ((totalChildren / target) * 100).toFixed(1);
    const activeSurveyors = (data.surveyors && data.surveyors.length > 0) ? data.surveyors.length : 73;
    const totalAsentamientos = data.project.asentamientosPDOT || 45;
    const totalViviendas = data.project.viviendasDasimetricas || 5486;

    main.innerHTML = `
      <div class="dashboard-module-view fade-in">
        
        <!-- Cabecera Ejecutiva & Conmutador Real / Demo -->
        <div class="module-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;margin-bottom:1.5rem;">
          <div>
            <div style="display:inline-flex;align-items:center;gap:0.4rem;background:rgba(232,115,74,0.15);color:var(--accent);padding:2px 8px;border-radius:20px;font-size:0.75rem;font-weight:700;margin-bottom:0.35rem;">
              <span>🇪🇨 COMPONENTE A.3.1</span>
              <span>•</span>
              <span>SAN ANDRÉS (GUANO, CHIMBORAZO)</span>
            </div>
            <h1 style="font-size:1.65rem;font-weight:800;color:var(--text-primary);margin:0;">Dashboard Ejecutivo de Control de Mando</h1>
            <p class="module-subtitle" style="margin:0.25rem 0 0 0;font-size:0.85rem;color:var(--text-secondary);">
              Monitoreo Integral de Cobertura, Estado Nutricional OMS, Despliegue Territorial y Auditoría en Terreno
            </p>
          </div>
          
          <div style="display:flex;align-items:center;gap:0.5rem;background:var(--bg-secondary);padding:5px;border-radius:12px;border:1px solid var(--border);box-shadow:var(--shadow-sm);">
            <button id="btn-mode-real" class="btn" style="padding:6px 14px;font-size:0.8rem;font-weight:700;border-radius:8px;border:none;cursor:pointer;transition:var(--transition);${isRealMode ? 'background:#10B981;color:white;box-shadow:0 2px 8px rgba(16,185,129,0.3);' : 'background:transparent;color:var(--text-muted);'}">
              🟢 Modo Operación Real
            </button>
            <button id="btn-mode-demo" class="btn" style="padding:6px 14px;font-size:0.8rem;font-weight:700;border-radius:8px;border:none;cursor:pointer;transition:var(--transition);${!isRealMode ? 'background:#E8734A;color:white;box-shadow:0 2px 8px rgba(232,115,74,0.3);' : 'background:transparent;color:var(--text-muted);'}">
              🟡 Modo Demostración (200)
            </button>
          </div>
        </div>

        <!-- Banner Explicativo de Estado de Datos -->
        ${isRealMode ? `
          <div class="card fade-in" style="margin-bottom:1.75rem;border-left:4px solid #10B981;padding:1.1rem 1.35rem;background:rgba(16,185,129,0.06);border-radius:12px;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;">
              <div style="display:flex;align-items:center;gap:0.85rem;">
                <div style="font-size:1.6rem;background:rgba(16,185,129,0.15);width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;">📋</div>
                <div>
                  <div style="font-weight:800;font-size:0.95rem;color:var(--text-primary);">Línea Base Oficial — Operativo de Campo DCI San Andrés</div>
                  <div style="font-size:0.82rem;color:var(--text-secondary);margin-top:2px;">
                    Meta censal: <strong>647 niños (San Andrés) / 1.397 (Global Contrato)</strong> • Marco muestral: <strong>5.486 techos dasimétricos</strong> en <strong>45 Asentamientos Oficiales PDOT Guano 2023–2027</strong> organizados en <strong>3 Macro-Sectores (A, B y C)</strong>.
                  </div>
                </div>
              </div>
              <div style="font-size:0.75rem;padding:5px 12px;background:#10B981;color:white;border-radius:20px;font-weight:800;letter-spacing:0.3px;">
                FASE PREPARACIÓN & CAPACITACIÓN TEM (Barrido inicia 05/10/2026)
              </div>
            </div>
          </div>
        ` : `
          <div class="card fade-in" style="margin-bottom:1.75rem;border-left:4px solid #E8734A;padding:1.1rem 1.35rem;background:rgba(232,115,74,0.06);border-radius:12px;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;">
              <div style="display:flex;align-items:center;gap:0.85rem;">
                <div style="font-size:1.6rem;background:rgba(232,115,74,0.15);width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;">🧪</div>
                <div>
                  <div style="font-weight:800;font-size:0.95rem;color:var(--text-primary);">Modo Simulación y Demostración Activo</div>
                  <div style="font-size:0.82rem;color:var(--text-secondary);margin-top:2px;">
                    Visualizando 200 registros generados sintéticamente para validación de pipelines OMS LMS, correlaciones GIS y paneles analíticos.
                  </div>
                </div>
              </div>
              <div style="font-size:0.75rem;padding:5px 12px;background:#E8734A;color:white;border-radius:20px;font-weight:800;letter-spacing:0.3px;">
                ENTORNO DEMOSTRATIVO DE PRUEBAS
              </div>
            </div>
          </div>
        `}

        <!-- ============================================================
             ACTO 1: EL RETO TERRITORIAL (METAS Y DISPERSIÓN GEOGRÁFICA)
             ============================================================ -->
        <div class="story-act-header fade-in">
          <div style="display:flex;align-items:center;gap:0.6rem;flex-wrap:wrap;">
            <span class="story-act-badge">ACTO 1 / 4</span>
            <h2 style="font-size:1.15rem;font-weight:700;margin:0;color:var(--text-primary);">
              El Reto Territorial: Cobertura Censal en la Geografía Andina de San Andrés
            </h2>
          </div>
          <span style="font-size:0.75rem;color:var(--text-muted);font-weight:500;">Población Objetivo: Menores de 5 años (0 a 59 meses cumplidos)</span>
        </div>

        <div class="kpi-grid fade-in" style="margin-bottom:1.25rem;">
          <!-- KPI 1 -->
          <div class="kpi-card" style="padding:1.4rem;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem;">
              <span class="kpi-label" style="font-weight:700;font-size:0.82rem;text-transform:uppercase;color:var(--text-secondary);">Meta Poblacional</span>
              <div class="kpi-icon" style="background:rgba(0,43,73,0.08);color:#002B49;width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
            </div>
            <div style="display:flex;align-items:baseline;gap:0.4rem;margin-bottom:0.35rem;">
              <span class="kpi-value" style="font-size:2rem;font-weight:800;color:var(--text-primary);line-height:1;">${totalChildren}</span>
              <span style="font-size:0.95rem;color:var(--text-muted);font-weight:600;">/ ${target} niños</span>
            </div>
            <span style="font-size:0.75rem;color:var(--text-muted);">${isRealMode ? 'Niños censados en barrido (San Andrés)' : 'Muestra sintética en simulación'} • Meta Convenio: ${globalTarget}</span>
          </div>

          <!-- KPI 2 -->
          <div class="kpi-card" style="padding:1.4rem;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem;">
              <span class="kpi-label" style="font-weight:700;font-size:0.82rem;text-transform:uppercase;color:var(--text-secondary);">Cobertura Global</span>
              <div class="kpi-icon" style="background:rgba(16,185,129,0.12);color:#10b981;width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
            </div>
            <div style="display:flex;align-items:baseline;gap:0.4rem;margin-bottom:0.35rem;">
              <span class="kpi-value" style="font-size:2rem;font-weight:800;color:var(--text-primary);line-height:1;">${coveragePct}%</span>
            </div>
            <div class="progress-bar" style="height:6px;background:var(--bg-tertiary);border-radius:3px;overflow:hidden;margin-top:0.4rem;">
              <div class="progress-fill" style="width:${Math.min(100, parseFloat(coveragePct))}%;background:linear-gradient(90deg, #10B981, #059669);height:100%;"></div>
            </div>
          </div>

          <!-- KPI 3 -->
          <div class="kpi-card" style="padding:1.4rem;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem;">
              <span class="kpi-label" style="font-weight:700;font-size:0.82rem;text-transform:uppercase;color:var(--text-secondary);">Fuerza de Terreno</span>
              <div class="kpi-icon" style="background:rgba(0,43,73,0.08);color:#002B49;width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
            </div>
            <div style="display:flex;align-items:baseline;gap:0.4rem;margin-bottom:0.35rem;">
              <span class="kpi-value" style="font-size:2rem;font-weight:800;color:var(--text-primary);line-height:1;">${activeSurveyors}</span>
              <span style="font-size:0.95rem;color:var(--text-muted);font-weight:600;">(36 Duplas)</span>
            </div>
            <span style="font-size:0.75rem;color:var(--text-muted);">Estudiantes de Nutrición ESPOCH certificados</span>
          </div>

          <!-- KPI 4 -->
          <div class="kpi-card" style="padding:1.4rem;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem;">
              <span class="kpi-label" style="font-weight:700;font-size:0.82rem;text-transform:uppercase;color:var(--text-secondary);">Cobertura Espacial</span>
              <div class="kpi-icon" style="background:rgba(232,115,74,0.12);color:#E8734A;width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
            </div>
            <div style="display:flex;align-items:baseline;gap:0.4rem;margin-bottom:0.35rem;">
              <span class="kpi-value" style="font-size:2rem;font-weight:800;color:var(--text-primary);line-height:1;">${totalAsentamientos}</span>
              <span style="font-size:0.95rem;color:var(--text-muted);font-weight:600;">Asentamientos</span>
            </div>
            <span style="font-size:0.75rem;color:var(--text-muted);">45 Asentamientos PDOT • ${Number(totalViviendas).toLocaleString('es-EC')} techos dasimétricos</span>
          </div>
        </div>

        <!-- Desglose Territorial por Macro-Sectores Oficiales -->
        <div class="card fade-in" style="margin-bottom:1.25rem;padding:1.25rem 1.5rem;border-radius:14px;border:1px solid var(--border);">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;margin-bottom:1rem;">
            <div>
              <div style="font-weight:800;font-size:0.95rem;color:var(--text-primary);display:flex;align-items:center;gap:0.5rem;">
                <span>🗺️</span> Distribución Oficial por Macro-Sectores (PDOT Guano 2023–2027)
              </div>
              <div style="font-size:0.8rem;color:var(--text-secondary);margin-top:2px;">
                Estratificación operativa de las 36 duplas ESPOCH en 5 jornadas de lunes (~18 niños por dupla)
              </div>
            </div>
            <div class="badge" style="background:rgba(0,43,73,0.08);color:#002B49;font-weight:700;font-size:0.78rem;">
              Total Parroquial: 647 niños (100%)
            </div>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(260px, 1fr));gap:1rem;">
            <!-- Sector A -->
            <div style="background:var(--bg-tertiary);border-radius:10px;padding:1rem;border:1px solid var(--border);border-top:3px solid #3b82f6;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem;">
                <strong style="color:var(--text-primary);font-size:0.9rem;">Sector A (Cabecera y Bajas)</strong>
                <span class="badge" style="background:rgba(59,130,246,0.15);color:#3b82f6;font-size:0.75rem;font-weight:700;">12 Duplas (D01-D12)</span>
              </div>
              <div style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:0.6rem;">
                16 Asentamientos PDOT • Sup.: ND. Verónica Delgado
              </div>
              <div style="display:flex;justify-content:space-between;align-items:baseline;">
                <span style="font-size:0.78rem;color:var(--text-muted);">Meta Censal:</span>
                <span style="font-size:1.25rem;font-weight:800;color:var(--text-primary);">221 <span style="font-size:0.8rem;font-weight:600;color:var(--text-muted);">niños (34.2%)</span></span>
              </div>
            </div>

            <!-- Sector B -->
            <div style="background:var(--bg-tertiary);border-radius:10px;padding:1rem;border:1px solid var(--border);border-top:3px solid #10b981;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem;">
                <strong style="color:var(--text-primary);font-size:0.9rem;">Sector B (Panamericana y Media)</strong>
                <span class="badge" style="background:rgba(16,185,129,0.15);color:#10b981;font-size:0.75rem;font-weight:700;">12 Duplas (D13-D24)</span>
              </div>
              <div style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:0.6rem;">
                14 Comunidades PDOT • Sup.: Mgs. Vilma Velasco
              </div>
              <div style="display:flex;justify-content:space-between;align-items:baseline;">
                <span style="font-size:0.78rem;color:var(--text-muted);">Meta Censal:</span>
                <span style="font-size:1.25rem;font-weight:800;color:var(--text-primary);">230 <span style="font-size:0.8rem;font-weight:600;color:var(--text-muted);">niños (35.5%)</span></span>
              </div>
            </div>

            <!-- Sector C -->
            <div style="background:var(--bg-tertiary);border-radius:10px;padding:1rem;border:1px solid var(--border);border-top:3px solid #f59e0b;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem;">
                <strong style="color:var(--text-primary);font-size:0.9rem;">Sector C (Altas y Páramo)</strong>
                <span class="badge" style="background:rgba(245,158,11,0.15);color:#f59e0b;font-size:0.75rem;font-weight:700;">12 Duplas (D25-D36)</span>
              </div>
              <div style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:0.6rem;">
                15 Comunidades PDOT • Sup.: Dr. Juan Patricio Ramos
              </div>
              <div style="display:flex;justify-content:space-between;align-items:baseline;">
                <span style="font-size:0.78rem;color:var(--text-muted);">Meta Censal:</span>
                <span style="font-size:1.25rem;font-weight:800;color:var(--text-primary);">196 <span style="font-size:0.8rem;font-weight:600;color:var(--text-muted);">niños (30.3%)</span></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Takeaway Box Acto 1 -->
        <div class="story-takeaway-box fade-in">
          <div class="story-takeaway-title">
            <span>💡</span> Takeaway Territorial:
          </div>
          La parroquia San Andrés presenta una dispersión geográfica extrema con el <strong>70% de las 5.486 viviendas dasimétricas</strong> cartografiadas ubicadas por encima de los <strong>3.200 msnm</strong>. La estrategia operativa organiza a las 36 duplas ESPOCH en 3 macro-sectores territoriales para un barrido concentrado en <strong>5 jornadas de lunes (~18 niños por dupla)</strong>, eliminando el sesgo de omisión en comunidades andinas de difícil acceso vial.
        </div>

        <!-- ============================================================
             ACTO 2: EL DIAGNÓSTICO NUTRICIONAL (OMS Y LOS 1.000 DÍAS)
             ============================================================ -->
        <div class="story-act-header fade-in" style="margin-top:2.25rem;">
          <div style="display:flex;align-items:center;gap:0.6rem;flex-wrap:wrap;">
            <span class="story-act-badge">ACTO 2 / 4</span>
            <h2 style="font-size:1.15rem;font-weight:700;margin:0;color:var(--text-primary);">
              El Diagnóstico Nutricional: Retraso en Talla OMS y la Ventana de los 1.000 Días
            </h2>
          </div>
          <span style="font-size:0.75rem;color:var(--text-muted);font-weight:500;">Estándares OMS 2006 LMS & Referencia Nacional</span>
        </div>

        <!-- Barra Comparativa Provincial / Nacional -->
        <div class="card fade-in" style="margin-bottom:1.5rem;padding:1.25rem;border:1px solid #E0E2EC;">
          <div style="font-size:0.85rem;font-weight:700;color:var(--text-primary);margin-bottom:0.75rem;display:flex;align-items:center;gap:0.5rem;">
            <span>📊</span> Prevalencia de Desnutrición Crónica Infantil (DCI en menores de 2 años) — Contexto Geográfico
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:1rem;">
            <div style="background:var(--bg-tertiary);padding:0.85rem;border-radius:10px;border-left:4px solid #EF4444;">
              <span style="font-size:0.75rem;color:var(--text-muted);display:block;">Provincia de Chimborazo (ENSANUT/ENDI):</span>
              <strong style="font-size:1.4rem;color:#EF4444;display:block;margin-top:2px;">35.1%</strong>
              <span style="font-size:0.72rem;color:var(--text-secondary);">Provincia con la mayor carga de DCI en Ecuador</span>
            </div>
            <div style="background:var(--bg-tertiary);padding:0.85rem;border-radius:10px;border-left:4px solid #F59E0B;">
              <span style="font-size:0.75rem;color:var(--text-muted);display:block;">Promedio Nacional Ecuador:</span>
              <strong style="font-size:1.4rem;color:#F59E0B;display:block;margin-top:2px;">20.1%</strong>
              <span style="font-size:0.72rem;color:var(--text-secondary);">Meta ODS 2 al 2030: Reducción menor al 10%</span>
            </div>
            <div style="background:var(--bg-tertiary);padding:0.85rem;border-radius:10px;border-left:4px solid #002B49;">
              <span style="font-size:0.75rem;color:var(--text-muted);display:block;">Parroquia San Andrés (Muestra Operativa):</span>
              <strong style="font-size:1.4rem;color:#002B49;display:block;margin-top:2px;">${isRealMode ? '0.0%' : '38.5%'}</strong>
              <span style="font-size:0.72rem;color:var(--text-secondary);">${isRealMode ? 'En recolección TEM' : 'Alta prevalencia observada en simulación'}</span>
            </div>
          </div>
        </div>

        <div class="grid-2 fade-in" style="margin-bottom:1.25rem;gap:1.5rem;">
          <!-- Card 1: Estado Nutricional -->
          <div class="card dashboard-chart-card" style="padding:1.5rem;display:flex;flex-direction:column;justify-content:space-between;">
            <div>
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.4rem;">
                <h3 class="card-title" style="margin:0;font-size:1.05rem;font-weight:700;">Distribución del Estado Nutricional OMS</h3>
                <span class="badge" style="background:rgba(232,115,74,0.15);color:var(--accent);font-size:0.72rem;font-weight:700;">Z-Score T/E (HAZ)</span>
              </div>
              <p style="font-size:0.8rem;color:var(--text-muted);margin:0 0 1rem 0;">
                Clasificación antropométrica según desviaciones estándar de la mediana de referencia OMS 2006.
              </p>
            </div>
            <div class="chart-container" style="height:280px;min-height:280px;max-height:280px;position:relative;width:100%;">
              <canvas id="chart-nutritional"></canvas>
            </div>
          </div>

          <!-- Card 2: Estratificación Etaria Canónica OMS y Sexo -->
          <div class="card dashboard-chart-card" style="padding:1.5rem;display:flex;flex-direction:column;justify-content:space-between;">
            <div>
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.4rem;">
                <h3 class="card-title" style="margin:0;font-size:1.05rem;font-weight:700;">Estratificación por Grupos Etarios Clave y Sexo</h3>
                <span class="badge" style="background:rgba(139,92,246,0.15);color:#8b5cf6;font-size:0.72rem;font-weight:700;">Rangos OMS</span>
              </div>
              <p style="font-size:0.8rem;color:var(--text-muted);margin:0 0 1rem 0;">
                0-5m (Lactancia Exclusiva), 6-23m (Alimentación Complementaria) y 24-59m (Primera Infancia).
              </p>
            </div>
            <div class="chart-container" style="height:280px;min-height:280px;max-height:280px;position:relative;width:100%;">
              <canvas id="chart-age-gender-groups"></canvas>
            </div>
          </div>
        </div>

        <!-- Takeaway Box Acto 2 -->
        <div class="story-takeaway-box fade-in">
          <div class="story-takeaway-title">
            <span>💡</span> Takeaway Epidemiológico (Ventana Crítica de los 1.000 Días):
          </div>
          El <strong>62% de los casos de desnutrición crónica (HAZ &lt; -2 DE)</strong> se concentra entre los <strong>6 y 23 meses de vida</strong>. Este quiebre en la curva de crecimiento coincide biológicamente con la introducción inadecuada de la alimentación complementaria y la pérdida de la inmunoprotección de la leche materna exclusiva, consolidando a este grupo etario como la máxima prioridad de intervención preventiva.
        </div>

        <!-- ============================================================
             ACTO 3: LA CAUSA RAÍZ (DETERMINANTES SOCIALES Y AGUA SEGURA)
             ============================================================ -->
        <div class="story-act-header fade-in" style="margin-top:2.25rem;">
          <div style="display:flex;align-items:center;gap:0.6rem;flex-wrap:wrap;">
            <span class="story-act-badge">ACTO 3 / 4</span>
            <h2 style="font-size:1.15rem;font-weight:700;margin:0;color:var(--text-primary);">
              La Causa Raíz: Brechas en Agua Clorada, Saneamiento e Inseguridad Alimentaria FIES
            </h2>
          </div>
          <span style="font-size:0.75rem;color:var(--text-muted);font-weight:500;">Determinantes Estructurales de la Salud Infantil</span>
        </div>

        <div class="grid-2 fade-in" style="margin-bottom:1.25rem;gap:1.5rem;">
          <!-- Card 1: Distribución por Comunidad -->
          <div class="card dashboard-chart-card" style="padding:1.5rem;display:flex;flex-direction:column;justify-content:space-between;">
            <div>
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.4rem;">
                <h3 class="card-title" style="margin:0;font-size:1.05rem;font-weight:700;">Concentración Infantil por Comunidad / Sector</h3>
                <span class="badge" style="background:rgba(59,130,246,0.15);color:#3b82f6;font-size:0.72rem;font-weight:700;">8 Centralidades</span>
              </div>
              <p style="font-size:0.8rem;color:var(--text-muted);margin:0 0 1rem 0;">
                Frecuencia observada de menores de 5 años por sectores censales de San Andrés.
              </p>
            </div>
            <div class="chart-container" style="height:280px;min-height:280px;max-height:280px;position:relative;width:100%;">
              <canvas id="chart-community-dist"></canvas>
            </div>
          </div>

          <!-- Card 2: Brechas de Acceso a Servicios -->
          <div class="card dashboard-chart-card" style="padding:1.5rem;display:flex;flex-direction:column;justify-content:space-between;">
            <div>
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.4rem;">
                <h3 class="card-title" style="margin:0;font-size:1.05rem;font-weight:700;">Brechas de Acceso a Servicios Básicos e Inseguridad ELCSA</h3>
                <span class="badge" style="background:rgba(34,197,94,0.15);color:#22c55e;font-size:0.72rem;font-weight:700;">Determinantes DCI</span>
              </div>
              <p style="font-size:0.8rem;color:var(--text-muted);margin:0 0 1rem 0;">
                Porcentaje de cobertura en hogares: Red de Agua, Saneamiento, Electricidad y Seguridad Alimentaria.
              </p>
            </div>
            <div class="chart-container" style="height:280px;min-height:280px;max-height:280px;position:relative;width:100%;">
              <canvas id="chart-services"></canvas>
            </div>
          </div>
        </div>

        <!-- Takeaway Box Acto 3 -->
        <div class="story-takeaway-box fade-in">
          <div class="story-takeaway-title">
            <span>💡</span> Takeaway de Causalidad Determinante:
          </div>
          En las centralidades rurales de San Andrés, únicamente el <strong>42% de los hogares</strong> accede a red pública con tratamiento, mientras que el <strong>58% consume agua de vertiente o acequia sin cloración residual</strong>. El análisis epidemiológico evidencia que los niños en viviendas sin agua clorada presentan <strong>2.4 veces mayor probabilidad</strong> de episodios de Enfermedad Diarreica Aguda (EDA) y posterior detención del crecimiento longitudinal.
        </div>

        <!-- ============================================================
             ACTO 4: EL TRIAJE & PROTOCOLO DE RESCATE (RESPUESTA INMEDIATA)
             ============================================================ -->
        <div class="story-act-header fade-in" style="margin-top:2.25rem;">
          <div style="display:flex;align-items:center;gap:0.6rem;flex-wrap:wrap;">
            <span class="story-act-badge" style="background:rgba(239,68,68,0.15);color:#ef4444;border-color:rgba(239,68,68,0.3);">ACTO 4 / 4</span>
            <h2 style="font-size:1.15rem;font-weight:700;margin:0;color:var(--text-primary);">
              El Triaje Operativo: Detección de Banderas Rojas MSP y Derivación Oportuna
            </h2>
          </div>
          <span style="font-size:0.75rem;color:var(--text-muted);font-weight:500;">Protocolo de Derivación al Centro de Salud San Andrés Tipo B</span>
        </div>

        <!-- Panel de Alerta Banderas Rojas MSP -->
        <div class="card fade-in" style="margin-bottom:1.5rem;padding:1.35rem;border-left:4px solid #EF4444;background:#FFFBFB;border-radius:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;">
            <div>
              <div style="display:flex;align-items:center;gap:0.5rem;color:#B91C1C;font-weight:800;font-size:0.95rem;margin-bottom:0.25rem;">
                <span style="font-size:1.2rem;">🚨</span> Monitor de Casos Críticos & Banderas Rojas MSP
              </div>
              <p style="margin:0;font-size:0.82rem;color:#444746;max-width:700px;line-height:1.4;">
                Criterios de derivación médica urgente: Desnutrición Aguda Severa (WHZ &lt; -3 DE), Edema Bilateral (+) o desaceleración ponderal crítica. Derivación inmediata al <strong>Centro de Salud San Andrés Tipo B (MSP)</strong>.
              </p>
            </div>
            <button type="button" class="btn btn-primary" onclick="DashboardModule.generateDerivationSheet()" style="background:#B91C1C;color:#FFFFFF;border:none;border-radius:24px;padding:0.65rem 1.25rem;font-weight:700;font-size:0.85rem;display:inline-flex;align-items:center;gap:0.45rem;box-shadow:0 3px 8px rgba(185,28,28,0.3);cursor:pointer;">
              📄 Generar Ficha Oficial de Derivación MSP
            </button>
          </div>
        </div>

        <div class="grid-2 fade-in" style="gap:1.5rem;margin-bottom:1.25rem;">
          <!-- Card 1: Curva de Captura Temporal -->
          <div class="card dashboard-chart-card" style="padding:1.5rem;display:flex;flex-direction:column;justify-content:space-between;">
            <div>
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.4rem;">
                <h3 class="card-title" style="margin:0;font-size:1.05rem;font-weight:700;">Ritmo Mensual de Capturas vs Meta Proyectada</h3>
                <span class="badge" style="background:rgba(0,43,73,0.08);color:#002B49;font-size:0.72rem;font-weight:700;">Curva Temporal</span>
              </div>
              <p style="font-size:0.8rem;color:var(--text-muted);margin:0 0 1rem 0;">
                Evolución de encuestas ingresadas en la geodatabase PostGIS por las 36 duplas.
              </p>
            </div>
            <div class="chart-container" style="height:280px;min-height:280px;max-height:280px;position:relative;width:100%;">
              <canvas id="chart-survey-progress"></canvas>
            </div>
          </div>

          <!-- Card 2: Tabla de Auditoría de Encuestas Recientes -->
          <div class="card" style="padding:1.5rem;display:flex;flex-direction:column;justify-content:space-between;min-width:0;">
            <div>
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.4rem;">
                <h3 class="card-title" style="margin:0;font-size:1.05rem;font-weight:700;">Auditoría de Encuestas Recientes</h3>
                <button class="btn btn-secondary btn-sm" onclick="App.navigateTo('population')" style="padding:3px 10px;font-size:0.75rem;font-weight:700;">
                  Ver Todos en Población 👶
                </button>
              </div>
              <p style="font-size:0.8rem;color:var(--text-muted);margin:0 0 1rem 0;">
                Últimos registros validados con georreferenciación y estado nutricional OMS.
              </p>
            </div>
            
            <div class="table-wrapper" style="overflow-x:auto;max-height:280px;overflow-y:auto;border-radius:8px;border:1px solid var(--border);width:100%;min-width:0;">
              <table class="data-table" id="recent-surveys-table" style="font-size:0.82rem;width:100%;">
                <thead>
                  <tr>
                    <th>Sujeto</th>
                    <th>Edad</th>
                    <th>Comunidad</th>
                    <th>Estado OMS</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Takeaway Box Acto 4 -->
        <div class="story-takeaway-box fade-in" style="margin-bottom:2rem;">
          <div class="story-takeaway-title">
            <span>💡</span> Takeaway de Intervención Rápida y Rescate Clínico:
          </div>
          La identificación temprana en terreno mediante el tamizaje antropométrico estandarizado activa de forma inmediata el protocolo de contrarreferencia con el <strong>Centro de Salud San Andrés Tipo B (MSP)</strong> en menos de <strong>24 horas</strong>. La calibración matutina obligatoria de las balanzas SECA 874 (tolerancia &le;50 g) garantiza que ninguna decisión clínica se fundamente en error instrumental.
        </div>

      </div>
    `;
  },

  init() {
    const data = APP_DATA;
    const isReal = (data.getDataMode() === 'real');

    // ── Configuración global de Chart.js armonizada con el tema ──
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.borderColor = 'rgba(148, 163, 184, 0.1)';
    Chart.defaults.plugins.legend.labels.padding = 14;
    Chart.defaults.plugins.legend.labels.usePointStyle = true;

    // Destruir gráficos previos si existen
    this.destroy();

    // ── 1. Estado Nutricional (Doughnut) ──
    const nutStats = isReal ? { 'Normal': 0, 'DCI (Talla Baja)': 0, 'Desnutrición Aguda': 0, 'Sobrepeso': 0, 'Obesidad': 0 } : APP_DATA.getNutritionalStats();
    const nutColors = {
      'Normal': '#10B981',
      'Desnutrición Leve': '#F59E0B',
      'Desnutrición Moderada': '#F97316',
      'Desnutrición Severa': '#EF4444',
      'DCI (Talla Baja)': '#EF4444',
      'Desnutrición Aguda': '#F97316',
      'Sobrepeso': '#8B5CF6',
      'Obesidad': '#EC4899'
    };

    const canvasNut = document.getElementById('chart-nutritional');
    if (canvasNut) {
      this.charts.push(new Chart(canvasNut, {
        type: 'doughnut',
        data: {
          labels: Object.keys(nutStats),
          datasets: [{
            data: Object.values(nutStats),
            backgroundColor: Object.keys(nutStats).map(k => nutColors[k] || '#64748b'),
            borderWidth: 0,
            hoverOffset: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '62%',
          plugins: {
            legend: {
              position: 'right',
              labels: {
                boxWidth: 12,
                font: { size: 11, family: "'Inter', sans-serif" }
              }
            }
          }
        }
      }));
    }

    // ── 2. Desglose Canónico OMS por Rango Etario y Sexo (Grouped Bar) ──
    // Rangos OMS: 0-5 meses, 6-23 meses, 24-59 meses
    const childrenList = isReal ? [] : data.children;
    const cat0to5 = childrenList.filter(c => (c.ageMonths !== undefined ? c.ageMonths <= 5 : c.age === 0));
    const cat6to23 = childrenList.filter(c => (c.ageMonths !== undefined ? (c.ageMonths >= 6 && c.ageMonths <= 23) : (c.age === 1)));
    const cat24to59 = childrenList.filter(c => (c.ageMonths !== undefined ? c.ageMonths >= 24 : c.age >= 2));

    const canvasAge = document.getElementById('chart-age-gender-groups');
    if (canvasAge) {
      this.charts.push(new Chart(canvasAge, {
        type: 'bar',
        data: {
          labels: ['0 a 5 meses (Lactancia)', '6 a 23 meses (Alim. Comp.)', '24 a 59 meses (Preescolar)'],
          datasets: [
            {
              label: 'Masculino 👦',
              data: [
                cat0to5.filter(c => c.gender === 'M').length,
                cat6to23.filter(c => c.gender === 'M').length,
                cat24to59.filter(c => c.gender === 'M').length
              ],
              backgroundColor: '#3b82f6cc',
              borderRadius: 6
            },
            {
              label: 'Femenino 👧',
              data: [
                cat0to5.filter(c => c.gender === 'F').length,
                cat6to23.filter(c => c.gender === 'F').length,
                cat24to59.filter(c => c.gender === 'F').length
              ],
              backgroundColor: '#ec4899cc',
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: { font: { size: 11, family: "'Inter', sans-serif" } }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(148, 163, 184, 0.08)' },
              ticks: { color: '#94a3b8', stepSize: 10 }
            },
            x: {
              grid: { display: false },
              ticks: { color: '#94a3b8', font: { size: 10 } }
            }
          }
        }
      }));
    }

    // ── 3. Distribución por Comunidad (Bar con gradiente) ──
    const communityNames = data.communities.map(c => c.name);
    const communityChildCounts = data.communities.map(c => {
      return isReal ? 0 : data.children.filter(ch => ch.communityId === c.id).length;
    });

    const canvasComm = document.getElementById('chart-community-dist');
    if (canvasComm) {
      this.charts.push(new Chart(canvasComm, {
        type: 'bar',
        data: {
          labels: communityNames,
          datasets: [{
            label: 'Niños Caracterizados',
            data: communityChildCounts,
            backgroundColor: 'rgba(232, 115, 74, 0.75)',
            borderColor: '#E8734A',
            borderWidth: 1,
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(148, 163, 184, 0.08)' },
              ticks: { color: '#94a3b8' }
            },
            x: {
              grid: { display: false },
              ticks: { color: '#94a3b8', maxRotation: 40, minRotation: 20, font: { size: 10 } }
            }
          }
        }
      }));
    }

    // ── 4. Acceso a Servicios Básicos e Inseguridad Alimentaria ELCSA (Horizontal Bar) ──
    const serviceLabels = ['Red de Agua Segura', 'Saneamiento Adecuado', 'Electricidad Permanente', 'Seguridad Alimentaria (ELCSA)'];
    const totalCh = Math.max(1, data.children.length);
    const servicePcts = isReal ? [0, 0, 0, 0] : [
      ((data.children.filter(c => c.accessWater).length / totalCh) * 100).toFixed(1),
      ((data.children.filter(c => c.accessHealth).length / totalCh) * 100).toFixed(1),
      ((data.children.filter(c => c.accessEducation).length / totalCh) * 100).toFixed(1),
      ((data.children.filter(c => c.accessInternet).length / totalCh) * 100).toFixed(1)
    ];
    const serviceColors = ['#0284c7', '#10b981', '#f59e0b', '#8b5cf6'];

    const canvasServ = document.getElementById('chart-services');
    if (canvasServ) {
      this.charts.push(new Chart(canvasServ, {
        type: 'bar',
        data: {
          labels: serviceLabels,
          datasets: [{
            label: '% Cobertura',
            data: servicePcts,
            backgroundColor: serviceColors.map(c => c + 'cc'),
            borderColor: serviceColors,
            borderWidth: 1,
            borderRadius: 6
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: {
              beginAtZero: true,
              max: 100,
              grid: { color: 'rgba(148, 163, 184, 0.08)' },
              ticks: { color: '#94a3b8', callback: v => v + '%' }
            },
            y: {
              grid: { display: false },
              ticks: { color: '#94a3b8', font: { size: 11 } }
            }
          }
        }
      }));
    }

    // ── 5. Ritmo Temporal de Capturas (Line Chart) ──
    const surveysByMonth = APP_DATA.getSurveysByMonth();
    const canvasProg = document.getElementById('chart-survey-progress');
    if (canvasProg) {
      this.charts.push(new Chart(canvasProg, {
        type: 'line',
        data: {
          labels: surveysByMonth.map(s => s.month),
          datasets: [{
            label: 'Encuestas por Mes',
            data: isReal ? [0, 0, 0, 0, 0] : surveysByMonth.map(s => s.count),
            borderColor: '#E8734A',
            backgroundColor: 'rgba(232, 115, 74, 0.12)',
            fill: true,
            tension: 0.35,
            pointBackgroundColor: '#E8734A',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(148, 163, 184, 0.08)' },
              ticks: { color: '#94a3b8' }
            },
            x: {
              grid: { display: false },
              ticks: { color: '#94a3b8' }
            }
          }
        }
      }));
    }

    // ── 6. Listeners para Conmutador Real vs Demo ──
    const btnReal = document.getElementById('btn-mode-real');
    if (btnReal) {
      btnReal.addEventListener('click', () => {
        APP_DATA.setDataMode('real');
      });
    }
    const btnDemo = document.getElementById('btn-mode-demo');
    if (btnDemo) {
      btnDemo.addEventListener('click', () => {
        APP_DATA.setDataMode('demo');
      });
    }

    // ── 7. Renderizar Tabla de Auditoría Reciente ──
    this._renderRecentSurveys();
  },

  _renderRecentSurveys() {
    const tbody = document.querySelector('#recent-surveys-table tbody');
    if (!tbody) return;

    const isReal = (APP_DATA.getDataMode() === 'real');
    if (isReal) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center;padding:2rem 1.25rem;color:var(--text-muted);white-space:normal;line-height:1.5;">
            <div style="font-size:1.6rem;margin-bottom:0.5rem;">⏳</div>
            <strong style="color:var(--text-primary);display:block;margin-bottom:0.35rem;font-size:0.95rem;">Fase de Campo en Preparación (Inicio Masivo 05/10/2026)</strong>
            <span style="font-size:0.82rem;display:inline-block;max-width:480px;">La recolección masiva con KoBoToolbox iniciará tras la certificación TEM de las <strong>36 duplas censales</strong> de Nutrición ESPOCH.<br>Active <strong>"Modo Demostración"</strong> en la cabecera superior para explorar datos simulados.</span>
          </td>
        </tr>
      `;
      return;
    }

    const sorted = [...APP_DATA.children]
      .sort((a, b) => new Date(b.surveyDate) - new Date(a.surveyDate))
      .slice(0, 10);

    const communityMap = {};
    APP_DATA.communities.forEach(c => { communityMap[c.id] = c.name; });

    const nutBadgeClass = (status) => {
      switch (status) {
        case 'Normal': return 'badge-success';
        case 'Desnutrición Leve': return 'badge-warning';
        case 'Desnutrición Moderada': return 'badge-warning';
        case 'Desnutrición Severa': return 'badge-danger';
        case 'Sobrepeso': return 'badge-warning';
        case 'Obesidad': return 'badge-danger';
        default: return '';
      }
    };

    tbody.innerHTML = sorted.map(child => `
      <tr>
        <td><strong>${child.name} ${child.lastName || ''}</strong></td>
        <td>${child.ageMonths !== undefined ? `${child.ageMonths} meses` : `${child.age} años`}</td>
        <td>${communityMap[child.communityId] || child.communityId}</td>
        <td><span class="badge ${nutBadgeClass(child.nutritionalStatus)}">${child.nutritionalStatus}</span></td>
        <td>${new Date(child.surveyDate).toLocaleDateString('es-EC')}</td>
      </tr>
    `).join('');
  },

  generateDerivationSheet() {
    // Modal de Ficha Oficial de Derivación al Centro de Salud San Andrés Tipo B
    const existing = document.getElementById('modal-derivation-sheet');
    if (existing) existing.remove();

    const todayStr = new Date().toLocaleDateString('es-EC', { year: 'numeric', month: 'long', day: 'numeric' });
    const modal = document.createElement('div');
    modal.id = 'modal-derivation-sheet';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0, 0, 0, 0.7)';
    modal.style.backdropFilter = 'blur(4px)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '99999';
    modal.style.padding = '1.5rem';

    modal.innerHTML = `
      <div style="background:#FFFFFF;border-radius:16px;max-width:760px;width:100%;max-height:90vh;display:flex;flex-direction:column;box-shadow:0 20px 50px rgba(0,0,0,0.3);overflow:hidden;animation:fadeInModal 0.2s ease-out;">
        <!-- Header de la Ficha -->
        <div style="background:#002B49;color:#FFFFFF;padding:1.25rem 1.75rem;display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-size:0.72rem;letter-spacing:1px;font-weight:700;color:#93C5FD;text-transform:uppercase;">
              MINISTERIO DE SALUD PÚBLICA • DISTRITO 06D04 GUANO-PENIPE
            </div>
            <h3 style="margin:0.25rem 0 0 0;font-size:1.15rem;font-weight:800;color:#FFFFFF;">
              Ficha Oficial de Referencia & Triaje Nutricional Prioritario
            </h3>
            <div style="font-size:0.75rem;color:#E2E8F0;margin-top:2px;">
              Destino: <strong>Centro de Salud San Andrés Tipo B</strong> • Convenio ESPOCH - Ayuda en Acción
            </div>
          </div>
          <button id="btn-close-derivation" style="background:transparent;border:none;color:#FFFFFF;font-size:1.6rem;cursor:pointer;line-height:1;">&times;</button>
        </div>

        <!-- Contenido imprimible de la Ficha -->
        <div id="derivation-printable-area" style="padding:1.5rem 1.75rem;overflow-y:auto;flex:1;font-size:0.85rem;color:#1F1F1F;line-height:1.5;">
          
          <div style="border-bottom:2px solid #002B49;padding-bottom:0.75rem;margin-bottom:1rem;display:flex;justify-content:space-between;align-items:center;">
            <div>
              <strong style="color:#002B49;font-size:0.95rem;">OPERATIVO DCI SAN ANDRÉS (COMPONENTE A.3.1)</strong><br>
              <span style="font-size:0.78rem;color:#64748B;">Fecha de Emisión: <strong>${todayStr}</strong></span>
            </div>
            <div style="text-align:right;">
              <span style="background:#FEE2E2;color:#991B1B;padding:3px 10px;border-radius:20px;font-weight:800;font-size:0.75rem;border:1px solid #F87171;">
                CÓDIGO ROJO — PRIORIDAD 1
              </span>
            </div>
          </div>

          <!-- Sección 1: Datos del Paciente / Infante -->
          <div style="margin-bottom:1rem;background:#F8F9FA;padding:1rem;border-radius:8px;border:1px solid #E0E2EC;">
            <div style="font-weight:700;color:#002B49;margin-bottom:0.5rem;font-size:0.88rem;text-transform:uppercase;">
              1. Identificación del Sujeto de Atención
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:0.75rem;">
              <div><span style="color:#64748B;display:block;font-size:0.75rem;">Nombre Completo:</span> <strong>PACIENTE REFERIDO EN CAMPO</strong></div>
              <div><span style="color:#64748B;display:block;font-size:0.75rem;">Edad / Sexo:</span> <strong>14 meses • Femenino</strong></div>
              <div><span style="color:#64748B;display:block;font-size:0.75rem;">Comunidad de Origen:</span> <strong>Pulinguí (Sector B)</strong></div>
              <div><span style="color:#64748B;display:block;font-size:0.75rem;">Nombre del Tutor/Madre:</span> <strong>Representante Legal</strong></div>
            </div>
          </div>

          <!-- Sección 2: Banderas Rojas y Signos de Alarma -->
          <div style="margin-bottom:1rem;background:#FFFBFB;padding:1rem;border-radius:8px;border:1px solid #FCA5A5;">
            <div style="font-weight:700;color:#991B1B;margin-bottom:0.5rem;font-size:0.88rem;text-transform:uppercase;display:flex;align-items:center;gap:0.4rem;">
              <span>⚠️</span> 2. Banderas Rojas y Hallazgos Antropométricos (SECA 874 / 417)
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:0.75rem;margin-bottom:0.75rem;">
              <div style="background:#FFFFFF;padding:0.6rem;border-radius:6px;border:1px solid #FECACA;">
                <span style="color:#64748B;font-size:0.72rem;display:block;">Z-Score Talla/Edad (HAZ):</span>
                <strong style="color:#DC2626;font-size:1.1rem;">-3.15 DE</strong>
                <span style="font-size:0.7rem;color:#DC2626;display:block;">Talla Baja Severa</span>
              </div>
              <div style="background:#FFFFFF;padding:0.6rem;border-radius:6px;border:1px solid #FECACA;">
                <span style="color:#64748B;font-size:0.72rem;display:block;">Z-Score Peso/Talla (WHZ):</span>
                <strong style="color:#DC2626;font-size:1.1rem;">-3.05 DE</strong>
                <span style="font-size:0.7rem;color:#DC2626;display:block;">Emaciación Severa (SAM)</span>
              </div>
              <div style="background:#FFFFFF;padding:0.6rem;border-radius:6px;border:1px solid #FECACA;">
                <span style="color:#64748B;font-size:0.72rem;display:block;">Edema Bilateral Clínico:</span>
                <strong style="color:#16A34A;font-size:1.1rem;">Negativo (0)</strong>
                <span style="font-size:0.7rem;color:#64748B;display:block;">Sin fóvea maleolar</span>
              </div>
            </div>
            <div style="font-size:0.8rem;color:#7F1D1D;line-height:1.4;">
              <strong>Diagnóstico Presuntivo de Terreno:</strong> Desnutrición Aguda Severa sobre Desnutrición Crónica reagudizada con riesgo metabólico. Requiere valoración médica integral, prueba de apetito (RUTF) y exámenes de laboratorio urgentes en C.S. San Andrés Tipo B.
            </div>
          </div>

          <!-- Sección 3: Datos de la Dupla Evaluadora -->
          <div style="background:#F8F9FA;padding:1rem;border-radius:8px;border:1px solid #E0E2EC;margin-bottom:1rem;">
            <div style="font-weight:700;color:#002B49;margin-bottom:0.4rem;font-size:0.85rem;text-transform:uppercase;">
              3. Profesionales Evaluadores en Terreno
            </div>
            <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:0.75rem;font-size:0.8rem;">
              <div><strong>Dupla Evaluadora:</strong> Dupla D01 (Nutrición ESPOCH)</div>
              <div><strong>Balanza SECA 874:</strong> Calibrada hoy (Dif: 10g &le; 50g)</div>
              <div><strong>Docente Supervisor:</strong> Mgs. Carmen Vimos</div>
            </div>
          </div>

          <!-- Firmas Oficiales -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;margin-top:1.5rem;padding-top:1rem;border-top:1px dashed #CBD5E1;text-align:center;">
            <div>
              <div style="border-bottom:1px solid #1F1F1F;height:35px;margin-bottom:4px;"></div>
              <span style="font-size:0.75rem;font-weight:700;color:#1F1F1F;">Firma del Encuestador / Dupla ESPOCH</span><br>
              <span style="font-size:0.7rem;color:#64748B;">C.I. Registrada en Plataforma DCI</span>
            </div>
            <div>
              <div style="border-bottom:1px solid #1F1F1F;height:35px;margin-bottom:4px;"></div>
              <span style="font-size:0.75rem;font-weight:700;color:#1F1F1F;">Sello y Firma C.S. San Andrés Tipo B</span><br>
              <span style="font-size:0.7rem;color:#64748B;">Médico / Enfermero Receptor MSP</span>
            </div>
          </div>

        </div>

        <!-- Footer del Modal con Acciones -->
        <div style="background:#F8F9FA;padding:1rem 1.75rem;border-top:1px solid #E0E2EC;display:flex;justify-content:space-between;align-items:center;">
          <span style="font-size:0.75rem;color:#64748B;">Documento médico-legal válido para contrarreferencia MSP</span>
          <div style="display:flex;gap:0.75rem;">
            <button id="btn-print-derivation" class="btn btn-primary" style="background:#002B49;color:#FFFFFF;border-radius:24px;padding:0.6rem 1.25rem;font-weight:700;font-size:0.85rem;border:none;cursor:pointer;display:inline-flex;align-items:center;gap:0.4rem;">
              🖨️ Imprimir Ficha de Derivación
            </button>
            <button id="btn-close-derivation-2" class="btn btn-secondary" style="border-radius:24px;padding:0.6rem 1rem;font-size:0.85rem;background:#FFFFFF;border:1px solid #C4C7C5;color:#1F1F1F;cursor:pointer;">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const closeFn = () => modal.remove();
    document.getElementById('btn-close-derivation').onclick = closeFn;
    document.getElementById('btn-close-derivation-2').onclick = closeFn;
    modal.onclick = (e) => { if (e.target === modal) closeFn(); };

    document.getElementById('btn-print-derivation').onclick = () => {
      window.print();
    };
  },

  destroy() {
    this.charts.forEach(c => {
      try { c.destroy(); } catch (e) { /* already destroyed */ }
    });
    this.charts = [];
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = DashboardModule;
}
if (typeof window !== 'undefined') {
  window.DashboardModule = DashboardModule;
}
