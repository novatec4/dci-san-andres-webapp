/* ============================================================
   reports.js — Reports Module
   Statistical analysis, community comparisons, and alerts.
   ============================================================ */

const ReportsModule = {
  charts: [],
  currentTab: 'resumen',
  dataMode: 'demo', // 'demo' o 'real'

  render() {
    const main = document.getElementById('main-content');

    main.innerHTML = `
      <div class="module-header fade-in">
        <div>
          <h1>📊 Reportes Institucionales & Analítica</h1>
          <p class="module-subtitle">Diagnóstico nutricional, cruces sociodemográficos y comparativas territoriales</p>
        </div>
        <div style="display:flex;gap:0.75rem;align-items:center;flex-wrap:wrap;">
          <!-- Conmutador Demo / Real -->
          <div style="display:inline-flex;background:var(--bg-tertiary);border:1px solid var(--border);border-radius:24px;padding:3px;">
            <button id="reports-toggle-demo" style="padding:0.35rem 0.85rem;font-size:0.78rem;font-weight:700;border:none;border-radius:20px;cursor:pointer;background:${this.dataMode === 'demo' ? 'var(--accent)' : 'transparent'};color:${this.dataMode === 'demo' ? 'white' : 'var(--text-secondary)'};">
              🧪 Modo Demo (150 N)
            </button>
            <button id="reports-toggle-real" style="padding:0.35rem 0.85rem;font-size:0.78rem;font-weight:700;border:none;border-radius:20px;cursor:pointer;background:${this.dataMode === 'real' ? '#10b981' : 'transparent'};color:${this.dataMode === 'real' ? 'white' : 'var(--text-secondary)'};">
              🛰️ Producción / Real (0 N)
            </button>
          </div>

          <!-- Botón de Reporte Ejecutivo Imprimible / PDF -->
          <button id="btn-print-executive-report" class="btn btn-primary" style="display:flex;align-items:center;gap:0.4rem;font-weight:600;padding:0.45rem 1rem;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            Imprimir Reporte Ejecutivo (PDF)
          </button>
        </div>
      </div>

      <div class="tabs fade-in">
        <button class="tab active" data-tab="resumen">Resumen General</button>
        <button class="tab" data-tab="comparativa">Comparativa por Comunidad</button>
        <button class="tab" data-tab="alertas">Alertas Tempranas</button>
      </div>

      <div id="reports-tab-content" class="fade-in"></div>
    `;

    this._setupHeaderEvents();
  },

  init() {
    this._setupTabs();
    this._renderTab(this.currentTab);
  },

  _setupHeaderEvents() {
    const demoBtn = document.getElementById('reports-toggle-demo');
    const realBtn = document.getElementById('reports-toggle-real');
    const printBtn = document.getElementById('btn-print-executive-report');

    if (demoBtn) {
      demoBtn.addEventListener('click', () => {
        this.dataMode = 'demo';
        this.render();
        this.init();
      });
    }

    if (realBtn) {
      realBtn.addEventListener('click', () => {
        this.dataMode = 'real';
        this.render();
        this.init();
      });
    }

    if (printBtn) {
      printBtn.addEventListener('click', () => {
        this._generatePrintableExecutiveReport();
      });
    }
  },

  _setupTabs() {
    document.querySelectorAll('.tabs .tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.tabs .tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const tabName = tab.dataset.tab;
        this.currentTab = tabName;

        // Destroy existing charts before switching
        this.charts.forEach(c => { try { c.destroy(); } catch (e) {} });
        this.charts = [];

        this._renderTab(tabName);
      });
    });
  },

  _renderTab(tabName) {
    const container = document.getElementById('reports-tab-content');
    if (!container) return;

    if (this.dataMode === 'real') {
      container.innerHTML = `
        <div class="card" style="padding:4rem 2rem;text-align:center;border-left:4px solid #10b981;">
          <div style="font-size:3.5rem;margin-bottom:1rem;">🛰️</div>
          <h2 style="color:var(--text-primary);margin-bottom:0.75rem;">Base de Producción en Espera de Captura en Campo</h2>
          <p style="color:var(--text-secondary);max-width:620px;margin:0 auto 1.5rem;line-height:1.6;font-size:0.95rem;">
            El entorno de producción oficial está vinculado al servidor KoBoToolbox y al clúster PostgreSQL/PostGIS. 
            Actualmente las 26 duplas se encuentran en fase de empadronamiento y calibración de antropómetros. 
            Tan pronto ingresen las primeras fichas verificadas por los supervisores ESPOCH, se generarán automáticamente 
            los gráficos y las alertas de este módulo.
          </p>
          <div style="display:inline-flex;gap:1rem;">
            <button class="btn btn-primary" onclick="ReportsModule.dataMode='demo';ReportsModule.render();ReportsModule.init();">
              Ver Analítica con Datos de Simulación (150 Niños)
            </button>
          </div>
        </div>
      `;
      return;
    }

    switch (tabName) {
      case 'resumen':
        this._renderResumen(container);
        break;
      case 'comparativa':
        this._renderComparativa(container);
        break;
      case 'alertas':
        this._renderAlertas(container);
        break;
    }
  },

  /* ──────────────────────────────────────────────
     Tab 1: Resumen General
     ────────────────────────────────────────────── */
  _renderResumen(container) {
    const data = APP_DATA;
    const children = data.children;
    const total = children.length;

    // Compute summary stats
    const avgAge = (children.reduce((sum, c) => sum + c.age, 0) / total).toFixed(1);
    const males = children.filter(c => c.gender === 'M').length;
    const females = children.filter(c => c.gender === 'F').length;
    const genderRatio = `${males}M / ${females}F`;
    const avgHousehold = (children.reduce((sum, c) => sum + (c.householdSize || 0), 0) / total).toFixed(1);

    // Build community breakdown
    const communityStats = data.communities.map(comm => {
      const commChildren = children.filter(c => c.communityId === comm.id);
      const count = commChildren.length;
      if (count === 0) return { name: comm.name, count: 0, desnut: '0.0', vacc: '0.0', school: '0.0', water: '0.0' };

      const desnut = ((commChildren.filter(c =>
        c.nutritionalStatus !== 'Normal'
      ).length / count) * 100).toFixed(1);

      const vacc = ((commChildren.filter(c => c.vaccinated).length / count) * 100).toFixed(1);
      const school = ((commChildren.filter(c => c.educationAccess).length / count) * 100).toFixed(1);
      const water = ((commChildren.filter(c => c.waterAccess).length / count) * 100).toFixed(1);

      return { name: comm.name, count, desnut, vacc, school, water };
    });

    container.innerHTML = `
      <!-- Summary Cards -->
      <div class="kpi-grid" style="margin-bottom: 1.5rem;">
        <div class="kpi-card">
          <div class="kpi-icon" style="background: rgba(6, 182, 212, 0.15); color: #06b6d4;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          </div>
          <div class="kpi-content">
            <span class="kpi-value">${total}</span>
            <span class="kpi-label">Total Muestra Simulada</span>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon" style="background: rgba(139, 92, 246, 0.15); color: #8b5cf6;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          </div>
          <div class="kpi-content">
            <span class="kpi-value">${avgAge}</span>
            <span class="kpi-label">Edad Promedio (años)</span>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon" style="background: rgba(236, 72, 153, 0.15); color: #ec4899;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div class="kpi-content">
            <span class="kpi-value">${genderRatio}</span>
            <span class="kpi-label">Ratio de Género</span>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <div class="kpi-content">
            <span class="kpi-value">${avgHousehold}</span>
            <span class="kpi-label">Tamaño Promedio Hogar</span>
          </div>
        </div>
      </div>

      <!-- Community Breakdown Table -->
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.75rem;">
          <h3 class="card-title" style="margin-bottom: 0;">Desglose por Centralidad y Comunidad (San Andrés)</h3>
          <div class="filter-group">
            <button class="btn btn-primary" id="btn-export-csv">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Exportar CSV
            </button>
          </div>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Comunidad</th>
                <th>Niños Registrados</th>
                <th>% Desnutrición Global</th>
                <th>% Vacunados</th>
                <th>% Escolarizados</th>
                <th>% Acceso a Agua</th>
              </tr>
            </thead>
            <tbody>
              ${communityStats.map(cs => `
                <tr>
                  <td style="font-weight:600;">${cs.name}</td>
                  <td>${cs.count}</td>
                  <td><span class="badge ${parseFloat(cs.desnut) > 20 ? 'badge-danger' : parseFloat(cs.desnut) > 10 ? 'badge-warning' : 'badge-success'}">${cs.desnut}%</span></td>
                  <td>${cs.vacc}%</td>
                  <td>${cs.school}%</td>
                  <td><span class="badge ${parseFloat(cs.water) < 60 ? 'badge-warning' : 'badge-success'}">${cs.water}%</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Export button handler
    const csvBtn = document.getElementById('btn-export-csv');
    if (csvBtn) {
      csvBtn.addEventListener('click', () => {
        this._exportCommunityCSV(communityStats);
      });
    }
  },

  /* ──────────────────────────────────────────────
     Tab 2: Comparativa por Comunidad
     ────────────────────────────────────────────── */
  _renderComparativa(container) {
    const data = APP_DATA;
    const children = data.children;

    // Compute per-community metrics
    const metrics = data.communities.map(comm => {
      const cc = children.filter(c => c.communityId === comm.id);
      const count = cc.length || 1;
      return {
        name: comm.name,
        color: comm.color,
        count: cc.length,
        nutricion: +((cc.filter(c => c.nutritionalStatus === 'Normal').length / count) * 100).toFixed(1),
        vacunacion: +((cc.filter(c => c.vaccinated).length / count) * 100).toFixed(1),
        escolaridad: +((cc.filter(c => c.educationAccess).length / count) * 100).toFixed(1),
        salud: +((cc.filter(c => c.healthAccess).length / count) * 100).toFixed(1),
        agua: +((cc.filter(c => c.waterAccess).length / count) * 100).toFixed(1),
        internet: +((cc.filter(c => c.internetAccess).length / count) * 100).toFixed(1)
      };
    });

    // Top 3 by child count for radar
    const top3 = [...metrics].sort((a, b) => b.count - a.count).slice(0, 3);

    container.innerHTML = `
      <div class="grid-2">
        <div class="card">
          <h3 class="card-title">Comparativa Radar — Top 3 Comunidades</h3>
          <div class="chart-container">
            <canvas id="chart-radar-compare"></canvas>
          </div>
        </div>
        <div class="card">
          <h3 class="card-title">Métricas por Comunidad</h3>
          <div class="chart-container">
            <canvas id="chart-bar-compare"></canvas>
          </div>
        </div>
      </div>
    `;

    requestAnimationFrame(() => {
      // Radar chart
      const radarLabels = ['Nutrición', 'Vacunación', 'Escolaridad', 'Acceso Salud', 'Acceso Agua', 'Acceso Internet'];
      const radarColors = ['#06b6d4', '#8b5cf6', '#f59e0b'];

      this.charts.push(new Chart(document.getElementById('chart-radar-compare'), {
        type: 'radar',
        data: {
          labels: radarLabels,
          datasets: top3.map((comm, i) => ({
            label: comm.name,
            data: [comm.nutricion, comm.vacunacion, comm.escolaridad, comm.salud, comm.agua, comm.internet],
            borderColor: radarColors[i],
            backgroundColor: radarColors[i] + '22',
            pointBackgroundColor: radarColors[i],
            pointBorderColor: '#0f172a',
            pointBorderWidth: 2,
            borderWidth: 2
          }))
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              beginAtZero: true,
              max: 100,
              grid: { color: 'rgba(148, 163, 184, 0.12)' },
              angleLines: { color: 'rgba(148, 163, 184, 0.12)' },
              pointLabels: { color: '#94a3b8', font: { size: 11 } },
              ticks: { color: '#64748b', backdropColor: 'transparent', stepSize: 25 }
            }
          },
          plugins: {
            legend: {
              position: 'bottom',
              labels: { padding: 16, font: { size: 12 } }
            }
          }
        }
      }));

      // Grouped bar chart — all communities
      const barMetricLabels = ['% Normal', '% Vacunados', '% Escolarizados', '% Agua'];
      const barColors = ['#22c55e', '#3b82f6', '#8b5cf6', '#06b6d4'];

      this.charts.push(new Chart(document.getElementById('chart-bar-compare'), {
        type: 'bar',
        data: {
          labels: metrics.map(m => m.name),
          datasets: barMetricLabels.map((label, i) => ({
            label,
            data: metrics.map(m => {
              switch (i) {
                case 0: return m.nutricion;
                case 1: return m.vacunacion;
                case 2: return m.escolaridad;
                case 3: return m.agua;
                default: return 0;
              }
            }),
            backgroundColor: barColors[i] + 'aa',
            borderColor: barColors[i],
            borderWidth: 0,
            borderRadius: 4
          }))
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { padding: 12, font: { size: 11 } }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              grid: { color: 'rgba(148, 163, 184, 0.08)' },
              ticks: { color: '#94a3b8', callback: v => v + '%' }
            },
            x: {
              grid: { display: false },
              ticks: { color: '#94a3b8', maxRotation: 45, minRotation: 0 }
            }
          }
        }
      }));
    });
  },

  /* ──────────────────────────────────────────────
     Tab 3: Alertas
     ────────────────────────────────────────────── */
  _renderAlertas(container) {
    const data = APP_DATA;
    const children = data.children;
    const alerts = [];

    // 1. Communities with >20% malnutrition → danger
    data.communities.forEach(comm => {
      const cc = children.filter(c => c.communityId === comm.id);
      if (cc.length === 0) return;
      const desnutPct = ((cc.filter(c => c.nutritionalStatus !== 'Normal').length / cc.length) * 100).toFixed(1);
      if (parseFloat(desnutPct) > 20) {
        alerts.push({
          type: 'danger',
          icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
          title: 'Alta tasa de desnutrición',
          description: `La comunidad <strong>${comm.name}</strong> presenta un <strong>${desnutPct}%</strong> de desnutrición, superando el umbral del 20%.`,
          entity: comm.name
        });
      }
    });

    // 2. Communities with <60% water access → warning
    data.communities.forEach(comm => {
      const cc = children.filter(c => c.communityId === comm.id);
      if (cc.length === 0) return;
      const waterPct = ((cc.filter(c => c.waterAccess).length / cc.length) * 100).toFixed(1);
      if (parseFloat(waterPct) < 60) {
        alerts.push({
          type: 'warning',
          icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>`,
          title: 'Bajo acceso a agua potable',
          description: `La comunidad <strong>${comm.name}</strong> tiene solo un <strong>${waterPct}%</strong> de acceso a agua potable (umbral: 60%).`,
          entity: comm.name
        });
      }
    });

    // 3. Surveyors with <50% target completion → info
    data.surveyors.forEach(surv => {
      if (surv.status === 'inactivo') return;
      const assigned = children.filter(c => c.surveyorId === surv.id).length;
      const completionPct = surv.target > 0 ? ((assigned / surv.target) * 100).toFixed(1) : '0.0';
      if (parseFloat(completionPct) < 50) {
        alerts.push({
          type: 'info',
          icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
          title: 'Bajo avance de encuestador',
          description: `El encuestador <strong>${surv.name}</strong> ha completado <strong>${completionPct}%</strong> de su meta asignada (${assigned}/${surv.target}).`,
          entity: surv.name
        });
      }
    });

    if (alerts.length === 0) {
      container.innerHTML = `
        <div class="card" style="padding: 3rem; text-align: center;">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" style="margin: 0 auto 1rem;">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <h2 style="color: var(--text-primary); margin-bottom: 0.5rem;">Sin alertas activas</h2>
          <p style="color: var(--text-muted);">Todos los indicadores se encuentran dentro de los rangos aceptables.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${alerts.map(a => `
          <div class="alert alert-${a.type}">
            <div class="alert-icon">${a.icon}</div>
            <div class="alert-body">
              <h4 class="alert-title">${a.title}</h4>
              <p class="alert-description">${a.description}</p>
              <span class="badge" style="margin-top: 0.5rem; font-size: 0.75rem;">${a.entity}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  _exportCommunityCSV(stats) {
    const headers = ['Comunidad', 'Total Niños', 'Desnutrición (%)', 'Vacunados (%)', 'Escolarizados (%)', 'Acceso Agua (%)'];
    const rows = stats.map(s => [
      `"${s.name}"`,
      s.count,
      s.desnut,
      s.vacc,
      s.school,
      s.water
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_comunidades_dci_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  _generatePrintableExecutiveReport() {
    const data = APP_DATA;
    const children = this.dataMode === 'real' ? [] : data.children;
    const total = children.length;
    const dateStr = new Date().toLocaleDateString('es-EC', { year: 'numeric', month: 'long', day: 'numeric' });

    const hazDeficit = children.filter(c => c.haz < -2).length;
    const hazPct = total > 0 ? ((hazDeficit / total) * 100).toFixed(1) : '0.0';
    const wazDeficit = children.filter(c => c.waz < -2).length;
    const wazPct = total > 0 ? ((wazDeficit / total) * 100).toFixed(1) : '0.0';
    const whzDeficit = children.filter(c => c.whz < -2).length;
    const whzPct = total > 0 ? ((whzDeficit / total) * 100).toFixed(1) : '0.0';
    const waterSafe = children.filter(c => c.waterAccess).length;
    const waterPct = total > 0 ? ((waterSafe / total) * 100).toFixed(1) : '0.0';
    const vaccOk = children.filter(c => c.vaccinated).length;
    const vaccPct = total > 0 ? ((vaccOk / total) * 100).toFixed(1) : '0.0';

    const printWin = window.open('', '_blank', 'width=900,height=800');
    if (!printWin) {
      alert('Por favor permita ventanas emergentes para generar el reporte impreso.');
      return;
    }

    printWin.document.write(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Reporte Ejecutivo DCI - Componente A.3.1 (v2.4.0)</title>
        <style>
          @page { size: A4; margin: 18mm 15mm; }
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; line-height: 1.5; padding: 20px; font-size: 11pt; }
          .header { border-bottom: 3px double #E8734A; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
          .title-area h1 { font-size: 15pt; margin: 0; color: #3C2415; text-transform: uppercase; }
          .title-area h2 { font-size: 11pt; margin: 4px 0 0; color: #E8734A; font-weight: 600; }
          .badge-mode { padding: 4px 10px; background: #fee2e2; color: #991b1b; font-weight: 700; border-radius: 4px; font-size: 9pt; }
          .meta-bar { display: flex; justify-content: space-between; background: #f8fafc; border: 1px solid #e2e8f0; padding: 8px 12px; border-radius: 6px; font-size: 9.5pt; margin-bottom: 20px; }
          .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
          .kpi-box { border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px; text-align: center; background: #ffffff; }
          .kpi-box .val { font-size: 16pt; font-weight: 800; color: #E8734A; }
          .kpi-box .lbl { font-size: 8.5pt; color: #64748b; font-weight: 600; text-transform: uppercase; margin-top: 2px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 9.5pt; }
          th { background: #3C2415; color: white; padding: 8px; text-align: left; font-size: 9pt; }
          td { padding: 7px 8px; border-bottom: 1px solid #e2e8f0; }
          tr:nth-child(even) { background: #f8fafc; }
          .signatures { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-top: 50px; text-align: center; font-size: 9pt; }
          .sig-line { border-top: 1px solid #334155; padding-top: 8px; font-weight: 600; }
          .print-btn-bar { margin-bottom: 20px; text-align: right; }
          @media print {
            .no-print { display: none !important; }
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="print-btn-bar no-print">
          <button onclick="window.print()" style="background:#E8734A;color:white;border:none;padding:8px 18px;font-weight:700;border-radius:4px;cursor:pointer;">🖨️ Mandar a Imprimir / Guardar como PDF</button>
        </div>

        <div class="header">
          <div class="title-area">
            <h1>Fundación Ayuda en Acción & ESPOCH</h1>
            <h2>Proyecto DCI — Componente A.3.1 | Reporte Ejecutivo de Situación</h2>
          </div>
          <div>
            <span class="badge-mode">${this.dataMode === 'real' ? 'ENTORNO DE PRODUCCIÓN OFICIAL' : 'ENTORNO DE SIMULACIÓN Y PRUEBAS'}</span>
          </div>
        </div>

        <div class="meta-bar">
          <div><strong>Fecha de Corte:</strong> ${dateStr}</div>
          <div><strong>Territorio Focalizado:</strong> San Andrés (Guano, Chimborazo)</div>
          <div><strong>Versión Sistema:</strong> v2.4.0 (Enterprise Field Ops)</div>
        </div>

        <h3 style="font-size:11pt;color:#3C2415;border-bottom:1px solid #cbd5e1;padding-bottom:4px;margin-bottom:12px;">1. Resumen de Indicadores Clave del Estudio</h3>
        <div class="kpi-row">
          <div class="kpi-box">
            <div class="val">${total}</div>
            <div class="lbl">Muestra Total Niños</div>
          </div>
          <div class="kpi-box">
            <div class="val" style="color:#ef4444;">${hazPct}%</div>
            <div class="lbl">Retraso Talla (HAZ &lt; -2)</div>
          </div>
          <div class="kpi-box">
            <div class="val" style="color:#f59e0b;">${whzPct}%</div>
            <div class="lbl">Emaciación (WHZ &lt; -2)</div>
          </div>
          <div class="kpi-box">
            <div class="val" style="color:#10b981;">${waterPct}%</div>
            <div class="lbl">Acceso a Agua Segura</div>
          </div>
        </div>

        <h3 style="font-size:11pt;color:#3C2415;border-bottom:1px solid #cbd5e1;padding-bottom:4px;margin-bottom:12px;margin-top:25px;">2. Desglose Nutricional y Epidemiológico por Comunidades</h3>
        <table>
          <thead>
            <tr>
              <th>Comunidad / Centralidad</th>
              <th>Muestra (N)</th>
              <th>% Retraso en Talla</th>
              <th>% Bajo Peso</th>
              <th>% Emaciación Aguda</th>
              <th>% Vacunación</th>
              <th>% Agua de Red</th>
            </tr>
          </thead>
          <tbody>
            ${data.communities.map(c => {
              const cList = children.filter(x => x.communityId === c.id);
              const cnt = cList.length;
              if (cnt === 0) return `<tr><td>${c.name}</td><td>0</td><td>0.0%</td><td>0.0%</td><td>0.0%</td><td>0.0%</td><td>0.0%</td></tr>`;
              const hPct = ((cList.filter(x => x.haz < -2).length / cnt) * 100).toFixed(1);
              const wPct = ((cList.filter(x => x.waz < -2).length / cnt) * 100).toFixed(1);
              const whPct = ((cList.filter(x => x.whz < -2).length / cnt) * 100).toFixed(1);
              const vPct = ((cList.filter(x => x.vaccinated).length / cnt) * 100).toFixed(1);
              const wtPct = ((cList.filter(x => x.waterAccess).length / cnt) * 100).toFixed(1);
              return `
                <tr>
                  <td><strong>${c.name}</strong></td>
                  <td>${cnt}</td>
                  <td>${hPct}%</td>
                  <td>${wPct}%</td>
                  <td>${whPct}%</td>
                  <td>${vPct}%</td>
                  <td>${wtPct}%</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <div class="signatures">
          <div>
            <div class="sig-line">Ing. Juan Diego Román</div>
            <div style="font-size:8pt;color:#64748b;">Coordinador General de Proyecto<br>Fundación Ayuda en Acción</div>
          </div>
          <div>
            <div class="sig-line">Dra. María Elena Ramos</div>
            <div style="font-size:8pt;color:#64748b;">Supervisión Nutrición & CEISH<br>Facultad de Salud Pública ESPOCH</div>
          </div>
          <div>
            <div class="sig-line">Ing. Cristian Román</div>
            <div style="font-size:8pt;color:#64748b;">Chief Information Officer (CIO)<br>Arquitectura Tecnológica & GIS</div>
          </div>
        </div>
      </body>
      </html>
    `);
    printWin.document.close();
  },

  destroy() {
    this.charts.forEach(c => {
      try { c.destroy(); } catch (e) { /* already destroyed */ }
    });
    this.charts = [];
  }
};
