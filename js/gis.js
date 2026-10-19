// =============================================================================
// GIS Module – Mapa GIS (Leaflet.js)
// =============================================================================
const GISModule = {
  map: null,
  layers: {
    children: null,
    healthCenters: null,
    schools: null
  },

  // ---------------------------------------------------------------------------
  // render()
  // ---------------------------------------------------------------------------
  render() {
    const communities = APP_DATA.communities;
    const statusOptions = [
      'Normal',
      'Desnutrición Leve',
      'Desnutrición Moderada',
      'Desnutrición Severa',
      'Sobrepeso',
      'Obesidad'
    ];

    const html = `
      <div class="module-header fade-in">
        <div>
          <h1>🗺️ Mapa GIS</h1>
          <span>Visualización georreferenciada</span>
        </div>
      </div>

      <!-- Control bar -->
      <div class="card fade-in" style="margin-bottom:1rem;padding:1rem 1.5rem;">
        <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center;">
          <div class="filter-group">
            <label style="font-size:.8rem;color:var(--text-secondary);margin-bottom:.25rem;display:block;">Comunidad</label>
            <select id="gis-filter-community" class="select-styled">
              <option value="">Todas</option>
              ${communities.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
            </select>
          </div>

          <div class="filter-group">
            <label style="font-size:.8rem;color:var(--text-secondary);margin-bottom:.25rem;display:block;">Estado Nutricional</label>
            <select id="gis-filter-status" class="select-styled">
              <option value="">Todos</option>
              ${statusOptions.map(s => `<option value="${s}">${s}</option>`).join('')}
            </select>
          </div>

          <div class="filter-group" style="display:flex;gap:1.25rem;align-items:center;padding-top:1.1rem;">
            <label style="display:flex;align-items:center;gap:.4rem;cursor:pointer;font-size:.85rem;">
              <input type="checkbox" id="gis-toggle-health" checked> Centros de Salud
            </label>
            <label style="display:flex;align-items:center;gap:.4rem;cursor:pointer;font-size:.85rem;">
              <input type="checkbox" id="gis-toggle-schools" checked> Escuelas
            </label>
          </div>

          <div style="margin-left:auto;display:flex;gap:.75rem;">
            <div class="kpi-card" style="padding:.6rem 1rem;min-width:auto;">
              <div class="kpi-icon">📍</div>
              <div>
                <div class="kpi-value" id="gis-kpi-points" style="font-size:1.1rem;">0</div>
                <div class="kpi-label" style="font-size:.7rem;">Puntos mostrados</div>
              </div>
            </div>
            <div class="kpi-card" style="padding:.6rem 1rem;min-width:auto;">
              <div class="kpi-icon">🏘️</div>
              <div>
                <div class="kpi-value" id="gis-kpi-communities" style="font-size:1.1rem;">0</div>
                <div class="kpi-label" style="font-size:.7rem;">Comunidades</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Map wrapper -->
      <div class="card fade-in" style="padding:0;overflow:hidden;position:relative;">
        <div id="map-container"></div>

        <!-- Legend -->
        <div id="gis-legend" style="
          position:absolute;bottom:24px;right:24px;z-index:1000;
          background:var(--bg-card);backdrop-filter:blur(12px);
          border:1px solid var(--border);border-radius:12px;
          padding:.85rem 1rem;min-width:160px;
        ">
          <div style="font-size:.75rem;font-weight:600;color:var(--text-secondary);margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.5px;">
            Comunidades
          </div>
          ${communities.map(c => `
            <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.35rem;font-size:.8rem;">
              <span style="width:12px;height:12px;border-radius:50%;background:${c.color};display:inline-block;border:1.5px solid rgba(255,255,255,.3);flex-shrink:0;"></span>
              ${c.name}
            </div>
          `).join('')}
          <div style="border-top:1px solid rgba(255,255,255,.1);margin-top:.5rem;padding-top:.5rem;">
            <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.35rem;font-size:.8rem;">
              <span style="width:12px;height:12px;border-radius:50%;background:#ef4444;display:inline-block;border:1.5px solid white;flex-shrink:0;"></span>
              Centro de Salud
            </div>
            <div style="display:flex;align-items:center;gap:.5rem;font-size:.8rem;">
              <span style="width:12px;height:12px;border-radius:50%;background:#3b82f6;display:inline-block;border:1.5px solid white;flex-shrink:0;"></span>
              Escuela
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('main-content').innerHTML = html;
  },

  // ---------------------------------------------------------------------------
  // init()
  // ---------------------------------------------------------------------------
  init() {
    // Create map
    this.map = L.map('map-container', {
      center: [-2.05, -80.73],
      zoom: 11,
      zoomControl: true
    });

    // Choose tile layer based on current theme
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const tileUrl = isLight
      ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

    this._tileLayer = L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(this.map);

    // Layer groups
    this.layers.children = L.layerGroup().addTo(this.map);
    this.layers.healthCenters = L.layerGroup().addTo(this.map);
    this.layers.schools = L.layerGroup().addTo(this.map);

    // Populate layers
    this._addHealthCenters();
    this._addSchools();
    this._applyFilters();

    // Fix map sizing
    setTimeout(() => { this.map.invalidateSize(); }, 100);

    // Event listeners
    const communityFilter = document.getElementById('gis-filter-community');
    const statusFilter = document.getElementById('gis-filter-status');
    const healthToggle = document.getElementById('gis-toggle-health');
    const schoolToggle = document.getElementById('gis-toggle-schools');

    if (communityFilter) communityFilter.addEventListener('change', () => this._applyFilters());
    if (statusFilter) statusFilter.addEventListener('change', () => this._applyFilters());

    if (healthToggle) {
      healthToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
          this.layers.healthCenters.addTo(this.map);
        } else {
          this.map.removeLayer(this.layers.healthCenters);
        }
      });
    }

    if (schoolToggle) {
      schoolToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
          this.layers.schools.addTo(this.map);
        } else {
          this.map.removeLayer(this.layers.schools);
        }
      });
    }
  },

  // ---------------------------------------------------------------------------
  // Internal helpers
  // ---------------------------------------------------------------------------
  _getNutritionalColor(status) {
    const map = {
      'Normal': '#22c55e',
      'Desnutrición Leve': '#f59e0b',
      'Desnutrición Moderada': '#f97316',
      'Desnutrición Severa': '#ef4444',
      'Sobrepeso': '#3b82f6',
      'Obesidad': '#a855f7'
    };
    return map[status] || '#94a3b8';
  },

  _applyFilters() {
    const communityVal = document.getElementById('gis-filter-community').value;
    const statusVal = document.getElementById('gis-filter-status').value;

    let filtered = APP_DATA.children;

    if (communityVal) {
      filtered = filtered.filter(c => c.communityId === communityVal);
    }
    if (statusVal) {
      filtered = filtered.filter(c => c.nutritionalStatus === statusVal);
    }

    // Clear existing child markers
    this.layers.children.clearLayers();

    // Track unique communities in results
    const communitiesSet = new Set();

    filtered.forEach(child => {
      const community = APP_DATA.getCommunityById(child.communityId);
      if (!community) return;
      communitiesSet.add(child.communityId);

      const marker = L.circleMarker([child.lat, child.lng], {
        radius: 6,
        fillColor: community.color,
        fillOpacity: 0.8,
        color: '#ffffff',
        weight: 1
      });

      const nutColor = this._getNutritionalColor(child.nutritionalStatus);
      marker.bindPopup(`
        <div style="font-family:'Inter',sans-serif;min-width:180px;">
          <div style="font-weight:600;font-size:.95rem;margin-bottom:.35rem;">
            ${child.name} ${child.lastName}
          </div>
          <div style="font-size:.8rem;color:#94a3b8;margin-bottom:.2rem;">
            <strong>Edad:</strong> ${child.age} años
          </div>
          <div style="font-size:.8rem;color:#94a3b8;margin-bottom:.2rem;">
            <strong>Comunidad:</strong> ${community.name}
          </div>
          <div style="font-size:.8rem;margin-bottom:.2rem;">
            <strong>Estado Nutricional:</strong>
            <span style="color:${nutColor};font-weight:600;">${child.nutritionalStatus}</span>
          </div>
          <div style="font-size:.8rem;color:#94a3b8;">
            <strong>Fecha Encuesta:</strong> ${child.surveyDate}
          </div>
        </div>
      `);

      marker.addTo(this.layers.children);
    });

    // Update KPIs
    const pointsEl = document.getElementById('gis-kpi-points');
    const communitiesEl = document.getElementById('gis-kpi-communities');
    if (pointsEl) pointsEl.textContent = filtered.length;
    if (communitiesEl) communitiesEl.textContent = communitiesSet.size;
  },

  _addHealthCenters() {
    APP_DATA.healthCenters.forEach(hc => {
      const community = APP_DATA.getCommunityById(hc.communityId);
      const icon = L.divIcon({
        className: '',
        html: '<div style="background:#ef4444;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;font-size:12px;color:white;font-weight:bold">+</div>',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([hc.lat, hc.lng], { icon });
      marker.bindPopup(`
        <div style="font-family:'Inter',sans-serif;min-width:160px;">
          <div style="font-weight:600;font-size:.95rem;margin-bottom:.35rem;">🏥 ${hc.name}</div>
          <div style="font-size:.8rem;color:#94a3b8;margin-bottom:.2rem;"><strong>Tipo:</strong> ${hc.type}</div>
          <div style="font-size:.8rem;color:#94a3b8;"><strong>Comunidad:</strong> ${community ? community.name : '—'}</div>
        </div>
      `);
      marker.addTo(this.layers.healthCenters);
    });
  },

  _addSchools() {
    APP_DATA.schools.forEach(sc => {
      const community = APP_DATA.getCommunityById(sc.communityId);
      const icon = L.divIcon({
        className: '',
        html: '<div style="background:#3b82f6;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;font-size:12px;color:white;font-weight:bold">📖</div>',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([sc.lat, sc.lng], { icon });
      marker.bindPopup(`
        <div style="font-family:'Inter',sans-serif;min-width:160px;">
          <div style="font-weight:600;font-size:.95rem;margin-bottom:.35rem;">🏫 ${sc.name}</div>
          <div style="font-size:.8rem;color:#94a3b8;margin-bottom:.2rem;"><strong>Tipo:</strong> ${sc.type}</div>
          <div style="font-size:.8rem;color:#94a3b8;margin-bottom:.2rem;"><strong>Comunidad:</strong> ${community ? community.name : '—'}</div>
          ${sc.students ? `<div style="font-size:.8rem;color:#94a3b8;"><strong>Estudiantes:</strong> ${sc.students}</div>` : ''}
        </div>
      `);
      marker.addTo(this.layers.schools);
    });
  },

  // ---------------------------------------------------------------------------
  // destroy()
  // ---------------------------------------------------------------------------
  destroy() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    this.layers = { children: null, healthCenters: null, schools: null };
  }
};
