/* ============================================================
   dashboard.js — Dashboard Module
   Main overview screen with KPIs, charts, and recent surveys.
   ============================================================ */

const DashboardModule = {
  charts: [],

  render() {
    const main = document.getElementById('main-content');
    const data = APP_DATA;
    const totalChildren = data.children.length;
    const coveragePct = ((totalChildren / data.project.totalTarget) * 100).toFixed(1);
    const activeSurveyors = data.surveyors.filter(s => s.status !== 'inactivo').length;
    const totalCommunities = data.communities.length;

    main.innerHTML = `
      <div class="module-header fade-in">
        <h1>Dashboard</h1>
        <p class="module-subtitle">Vista general del proyecto</p>
      </div>

      <!-- KPI Row -->
      <div class="kpi-grid fade-in">
        <div class="kpi-card">
          <div class="kpi-icon" style="background: rgba(232, 115, 74, 0.15); color: #E8734A;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div class="kpi-content">
            <span class="kpi-value">${totalChildren}</span>
            <span class="kpi-label">Total Niños Encuestados</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon" style="background: rgba(34, 197, 94, 0.15); color: #22c55e;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <div class="kpi-content">
            <span class="kpi-value">${coveragePct}%</span>
            <span class="kpi-label">Cobertura</span>
            <div class="progress-bar" style="margin-top: 0.5rem;">
              <div class="progress-fill" style="width: ${coveragePct}%; background: linear-gradient(90deg, #22c55e, #16a34a);"></div>
            </div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon" style="background: rgba(139, 92, 246, 0.15); color: #8b5cf6;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <line x1="19" y1="8" x2="19" y2="14"/>
              <line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
          </div>
          <div class="kpi-content">
            <span class="kpi-value">${activeSurveyors}</span>
            <span class="kpi-label">Encuestadores Activos</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div class="kpi-content">
            <span class="kpi-value">${totalCommunities}</span>
            <span class="kpi-label">Comunidades</span>
          </div>
        </div>
      </div>

      <!-- Charts Row 1 -->
      <div class="grid-2 fade-in">
        <div class="card">
          <h3 class="card-title">Distribución por Comunidad</h3>
          <div class="chart-container">
            <canvas id="chart-community-dist"></canvas>
          </div>
        </div>
        <div class="card">
          <h3 class="card-title">Estado Nutricional</h3>
          <div class="chart-container">
            <canvas id="chart-nutritional"></canvas>
          </div>
        </div>
      </div>

      <!-- Charts Row 2 -->
      <div class="grid-2 fade-in">
        <div class="card">
          <h3 class="card-title">Progreso de Encuestas</h3>
          <div class="chart-container">
            <canvas id="chart-survey-progress"></canvas>
          </div>
        </div>
        <div class="card">
          <h3 class="card-title">Acceso a Servicios</h3>
          <div class="chart-container">
            <canvas id="chart-services"></canvas>
          </div>
        </div>
      </div>

      <!-- Charts Row 3 -->
      <div class="grid-2 fade-in">
        <div style="display:flex;flex-direction:column;gap:20px;">
          <div class="card">
            <h3 class="card-title">Distribución por Género</h3>
            <div class="chart-container" style="min-height:220px;">
              <canvas id="chart-gender"></canvas>
            </div>
          </div>
          <div class="card">
            <h3 class="card-title">Distribución por Edad</h3>
            <div class="chart-container" style="min-height:220px;">
              <canvas id="chart-age"></canvas>
            </div>
          </div>
        </div>
        <div class="card" style="display:flex;flex-direction:column;">
          <h3 class="card-title" style="margin-bottom:12px;">Encuestas Recientes</h3>
          <div class="table-wrapper" style="flex:1;overflow-y:auto;max-height:500px;">
            <table class="data-table" id="recent-surveys-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Edad</th>
                  <th>Comunidad</th>
                  <th>Estado Nutricional</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  init() {
    const data = APP_DATA;

    // ── Set Chart.js dark-theme defaults ──
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.borderColor = 'rgba(148, 163, 184, 0.1)';
    Chart.defaults.plugins.legend.labels.padding = 16;
    Chart.defaults.plugins.legend.labels.usePointStyle = true;

    // ── 1. Community Distribution (Bar) ──
    const communityNames = data.communities.map(c => c.name);
    const communityColors = data.communities.map(c => c.color);
    const communityChildCounts = data.communities.map(c => {
      return data.children.filter(ch => ch.communityId === c.id).length;
    });

    this.charts.push(new Chart(document.getElementById('chart-community-dist'), {
      type: 'bar',
      data: {
        labels: communityNames,
        datasets: [{
          label: 'Niños encuestados',
          data: communityChildCounts,
          backgroundColor: communityColors.map(c => c + 'cc'),
          borderColor: communityColors,
          borderWidth: 0,
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
            ticks: { color: '#94a3b8', maxRotation: 45, minRotation: 0 }
          }
        }
      }
    }));

    // ── 2. Nutritional Status (Doughnut) ──
    const nutStats = APP_DATA.getNutritionalStats();
    const nutColors = {
      'Normal': '#22c55e',
      'Desnutrición Leve': '#f59e0b',
      'Desnutrición Moderada': '#f97316',
      'Desnutrición Severa': '#ef4444',
      'Sobrepeso': '#8b5cf6',
      'Obesidad': '#ec4899'
    };

    this.charts.push(new Chart(document.getElementById('chart-nutritional'), {
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
        cutout: '65%',
        plugins: {
          legend: {
            position: 'right',
            labels: { padding: 12, font: { size: 12 } }
          }
        }
      }
    }));

    // ── 3. Survey Progress (Line) ──
    const surveysByMonth = APP_DATA.getSurveysByMonth();

    this.charts.push(new Chart(document.getElementById('chart-survey-progress'), {
      type: 'line',
      data: {
        labels: surveysByMonth.map(s => s.month),
        datasets: [{
          label: 'Encuestas realizadas',
          data: surveysByMonth.map(s => s.count),
          borderColor: '#E8734A',
          backgroundColor: 'rgba(232, 115, 74, 0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#E8734A',
          pointBorderColor: '#1a1210',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 7
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

    // ── 4. Service Access (Horizontal Bar) ──
    const serviceLabels = ['Salud', 'Educación', 'Agua Potable', 'Internet'];
    const totalCh = data.children.length;
    const servicePcts = [
      ((data.children.filter(c => c.accessHealth).length / totalCh) * 100).toFixed(1),
      ((data.children.filter(c => c.accessEducation).length / totalCh) * 100).toFixed(1),
      ((data.children.filter(c => c.accessWater).length / totalCh) * 100).toFixed(1),
      ((data.children.filter(c => c.accessInternet).length / totalCh) * 100).toFixed(1)
    ];
    const serviceColors = ['#22c55e', '#3b82f6', '#E8734A', '#8b5cf6'];

    this.charts.push(new Chart(document.getElementById('chart-services'), {
      type: 'bar',
      data: {
        labels: serviceLabels,
        datasets: [{
          label: '% Acceso',
          data: servicePcts,
          backgroundColor: serviceColors.map(c => c + 'cc'),
          borderColor: serviceColors,
          borderWidth: 0,
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
            ticks: { color: '#94a3b8' }
          }
        }
      }
    }));

    // ── 5. Gender Distribution (Pie) ──
    const males = data.children.filter(c => c.gender === 'M').length;
    const females = data.children.filter(c => c.gender === 'F').length;

    this.charts.push(new Chart(document.getElementById('chart-gender'), {
      type: 'pie',
      data: {
        labels: ['Masculino', 'Femenino'],
        datasets: [{
          data: [males, females],
          backgroundColor: ['#3b82f6cc', '#ec4899cc'],
          borderWidth: 0,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { padding: 12, font: { size: 12 } }
          }
        }
      }
    }));

    // ── 6. Age Distribution (Bar) ──
    const ageGroups = {};
    data.children.forEach(c => {
      const label = c.age + ' años';
      ageGroups[label] = (ageGroups[label] || 0) + 1;
    });
    const sortedAgeLabels = Object.keys(ageGroups).sort((a, b) => parseInt(a) - parseInt(b));

    this.charts.push(new Chart(document.getElementById('chart-age'), {
      type: 'bar',
      data: {
        labels: sortedAgeLabels,
        datasets: [{
          label: 'Niños',
          data: sortedAgeLabels.map(l => ageGroups[l]),
          backgroundColor: 'rgba(139, 92, 246, 0.6)',
          borderColor: '#8b5cf6',
          borderWidth: 0,
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
            ticks: { color: '#94a3b8' }
          }
        }
      }
    }));

    // ── 7. Recent Surveys Table ──
    this._renderRecentSurveys();
  },

  _renderRecentSurveys() {
    const tbody = document.querySelector('#recent-surveys-table tbody');
    if (!tbody) return;

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
        <td>${child.name}</td>
        <td>${child.age}</td>
        <td>${communityMap[child.communityId] || child.communityId}</td>
        <td><span class="badge ${nutBadgeClass(child.nutritionalStatus)}">${child.nutritionalStatus}</span></td>
        <td>${new Date(child.surveyDate).toLocaleDateString('es-EC')}</td>
      </tr>
    `).join('');
  },

  destroy() {
    this.charts.forEach(c => {
      try { c.destroy(); } catch (e) { /* already destroyed */ }
    });
    this.charts = [];
  }
};
