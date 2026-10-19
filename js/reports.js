/* ============================================================
   reports.js — Reports Module
   Statistical analysis, community comparisons, and alerts.
   ============================================================ */

const ReportsModule = {
  charts: [],
  currentTab: 'resumen',

  render() {
    const main = document.getElementById('main-content');

    main.innerHTML = `
      <div class="module-header fade-in">
        <h1>Reportes</h1>
        <p class="module-subtitle">Análisis estadístico y comparativas</p>
      </div>

      <div class="tabs fade-in">
        <button class="tab active" data-tab="resumen">Resumen General</button>
        <button class="tab" data-tab="comparativa">Comparativa por Comunidad</button>
        <button class="tab" data-tab="alertas">Alertas</button>
      </div>

      <div id="reports-tab-content" class="fade-in"></div>
    `;
  },

  init() {
    this._setupTabs();
    this._renderTab('resumen');
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
    const communityMap = {};
    data.communities.forEach(c => { communityMap[c.id] = c; });

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
            <span class="kpi-label">Total Encuestados</span>
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
          <h3 class="card-title" style="margin-bottom: 0;">Desglose por Comunidad</h3>
          <div class="filter-group">
            <button class="btn btn-primary" id="btn-export-csv">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Exportar CSV
            </button>
            <button class="btn btn-secondary" id="btn-export-pdf">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              Exportar PDF
            </button>
          </div>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Comunidad</th>
                <th>Niños</th>
                <th>% Desnutrición</th>
                <th>% Vacunados</th>
                <th>% Escolarizados</th>
                <th>% Acceso Agua</th>
              </tr>
            </thead>
            <tbody>
              ${communityStats.map(cs => `
                <tr>
                  <td>${cs.name}</td>
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

    // Export button handlers
    document.getElementById('btn-export-csv')?.addEventListener('click', () => {
      alert('Función de exportación CSV en desarrollo. Los datos se descargarán en formato .csv próximamente.');
    });
    document.getElementById('btn-export-pdf')?.addEventListener('click', () => {
      alert('Función de exportación PDF en desarrollo. El reporte se generará como documento PDF próximamente.');
    });
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

  destroy() {
    this.charts.forEach(c => {
      try { c.destroy(); } catch (e) { /* already destroyed */ }
    });
    this.charts = [];
  }
};
