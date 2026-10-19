// =============================================================================
// GIS Module – Web GIS Oficial San Andrés (Guano, Chimborazo)
// Proyecto DCI - Componente A.3.1 (Ayuda en Acción Ecuador / ESPOCH)
// =============================================================================

const GISModule = {
  map: null,
  baseLayers: {},
  layers: {
    parishBoundary: null,
    zones: null,
    visitRings: null,
    communities: null,
    pois: null,
    houses: null,
    roads: null
  },

  // Caché de datos GeoJSON cargados
  geoData: {
    boundary: null,
    zones: null,
    visitRings: null,
    communities: null,
    pois: null,
    houses: null,
    roads: null
  },

  selectedTerritory: 'san-andres',
  selectedZone: '',
  selectedCommunity: '',
  selectedSampleType: '',
  selectedStatus: '',

  // Colores oficiales por Macro-Sector y Zona Logística
  zoneColors: {
    'Sector A': '#2563eb',
    'Sector B': '#059669',
    'Sector C': '#dc2626',
    'Zona 1 - Cabecera Urbana': '#2563eb',
    'Zona 2 - Eje Panamericana Norte': '#10b981',
    'Zona 3 - Eje Panamericana Sur': '#f59e0b',
    'Zona 4 - Faldas del Chimborazo': '#8b5cf6',
    'Zona 5 - Eje Central Agrícola': '#06b6d4',
    'Zona 6 - Eje Calshi': '#ec4899',
    'Zona 7 - Eje Norte Chuquipogyo': '#f97316'
  },

  // ---------------------------------------------------------------------------
  // render()
  // ---------------------------------------------------------------------------
  render() {
    const html = `
      <div class="module-header fade-in">
        <div>
          <div style="display:flex;align-items:center;gap:.75rem;flex-wrap:wrap;">
            <h1 style="margin:0;font-size:1.65rem;font-weight:800;color:var(--text-primary);">🗺️ Web GIS Oficial — San Andrés</h1>
            <span class="badge badge-orange" style="font-weight:700;">5.486 Viviendas Dasimétricas</span>
            <span class="badge badge-blue" style="font-weight:700;">45 Asentamientos Oficiales PDOT</span>
            <span class="badge badge-green" style="font-weight:700;">3 Macro-Sectores Operativos</span>
          </div>
          <span style="color:var(--text-secondary);font-size:.85rem;">Cartografía Operativa Oficial: Delimitación Parroquial, Macro-Sectores A/B/C y Enlaces a Formularios KoBoToolbox</span>
        </div>

        <!-- Selector de Territorio -->
        <div class="header-actions">
          <div style="display:flex;background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:3px;">
            <button class="territory-tab active" id="tab-territory-sa" onclick="GISModule.setTerritory('san-andres')">
              🏔️ San Andrés (Activo)
            </button>
            <button class="territory-tab" id="tab-territory-mg" onclick="GISModule.setTerritory('manglaralto')">
              🌊 Manglaralto (Planificación)
            </button>
          </div>
        </div>
      </div>

      <!-- Panel de Control y Filtros Modulares WebGIS -->
      <div class="gis-controls-panel fade-in">
        
        <!-- Nivel 1: Toolbar de Filtros Primarios -->
        <div class="gis-filter-toolbar">
          <!-- Filtro Macro-Sector Operativo -->
          <div class="gis-filter-item">
            <label class="gis-filter-label"><span>🗺️</span> Macro-Sector Operativo</label>
            <select id="gis-filter-zone" class="select-styled" style="width:100%;">
              <option value="">Todos los Macro-Sectores</option>
              <option value="Sector A">Sector A: Cabecera Urbana y Bajas (16 asents. | 221 niños)</option>
              <option value="Sector B">Sector B: Panamericana y Media (14 coms. | 230 niños)</option>
              <option value="Sector C">Sector C: Comunidades Altas y Páramo (15 coms. | 196 niños)</option>
            </select>
          </div>

          <!-- Filtro Comunidad PDOT -->
          <div class="gis-filter-item">
            <label class="gis-filter-label"><span>📍</span> Asentamiento PDOT (45 Oficiales)</label>
            <select id="gis-filter-community" class="select-styled" style="width:100%;">
              <option value="">Todos los 45 Asentamientos</option>
            </select>
          </div>

          <!-- Filtro Tipo de Muestra -->
          <div class="gis-filter-item">
            <label class="gis-filter-label"><span>🏷️</span> Tipo de Muestra</label>
            <select id="gis-filter-sample" class="select-styled" style="width:100%;">
              <option value="">Todas las Viviendas (5.486)</option>
              <option value="titular">🟢 Muestra Titular (4.370)</option>
              <option value="reserva">🟠 Muestra Reserva (1.116)</option>
            </select>
          </div>

          <!-- Filtro Estado KoBo -->
          <div class="gis-filter-item">
            <label class="gis-filter-label"><span>📊</span> Estado de Visita KoBo</label>
            <select id="gis-filter-status" class="select-styled" style="width:100%;">
              <option value="">Todos los Estados</option>
              <option value="pendiente">⏳ Pendiente</option>
              <option value="completada">✅ Completada</option>
            </select>
          </div>

          <!-- Selector de Mapa Base -->
          <div class="gis-filter-item">
            <label class="gis-filter-label"><span>🌍</span> Mapa Base</label>
            <select id="gis-select-basemap" class="select-styled" style="width:100%;" onchange="GISModule.switchBasemap(this.value)">
              <option value="satellite">🛰️ Satélite Esri World</option>
              <option value="carto-light">🗺️ Carto Light</option>
              <option value="carto-dark">🌙 Carto Dark</option>
              <option value="osm">🌐 OpenStreetMap</option>
            </select>
          </div>
        </div>

        <!-- Nivel 2: Barra de KPIs de Cobertura en Vivo + Botón Reset -->
        <div class="gis-filter-kpi-bar">
          <div class="gis-kpi-group">
            <div class="gis-micro-kpi" title="Viviendas actualmente visibles en el mapa tras aplicar filtros">
              <span>🏠</span>
              <div>
                <span class="val" id="gis-kpi-houses">0</span>
                <span class="lbl">Visibles</span>
              </div>
            </div>
            <div class="gis-micro-kpi" title="Viviendas de Muestra Titular primaria">
              <span>🟢</span>
              <div>
                <span class="val" id="gis-kpi-titulares" style="color:#10b981;">0</span>
                <span class="lbl">Titulares</span>
              </div>
            </div>
            <div class="gis-micro-kpi" title="Viviendas de Muestra Reserva complementaria">
              <span>🟠</span>
              <div>
                <span class="val" id="gis-kpi-reserva" style="color:#ea580c;">0</span>
                <span class="lbl">Reserva</span>
              </div>
            </div>
            <div class="gis-micro-kpi" title="Encuestas completadas registradas en KoBo">
              <span>✅</span>
              <div>
                <span class="val" id="gis-kpi-completed" style="color:#3b82f6;">0</span>
                <span class="lbl">En KoBo</span>
              </div>
            </div>
          </div>

          <button id="btn-reset-gis-filters" class="btn btn-secondary btn-sm" style="font-size:0.78rem;font-weight:700;display:inline-flex;align-items:center;gap:0.35rem;padding:0.42rem 0.85rem;" title="Restablecer todos los filtros a su estado inicial">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            ↺ Restablecer Filtros
          </button>
        </div>

        <!-- Nivel 3: Selector Semántico de Capas Operativas -->
        <div class="gis-layer-section">
          <!-- Categoría 1: Viviendas -->
          <div class="gis-layer-category">
            <strong style="color:var(--text-secondary);font-size:.7rem;text-transform:uppercase;margin-right:2px;">Viviendas:</strong>
            <label class="gis-layer-chip">
              <input type="checkbox" id="toggle-houses-titular" checked> 🟢 Titulares (4.370)
            </label>
            <label class="gis-layer-chip">
              <input type="checkbox" id="toggle-houses-reserva" checked> 🟠 Reserva (1.116)
            </label>
          </div>

          <!-- Categoría 2: Delimitación & Zonificación -->
          <div class="gis-layer-category">
            <strong style="color:var(--text-secondary);font-size:.7rem;text-transform:uppercase;margin-right:2px;">Zonificación:</strong>
            <label class="gis-layer-chip">
              <input type="checkbox" id="toggle-boundary" checked> 🔲 Límite San Andrés
            </label>
            <label class="gis-layer-chip">
              <input type="checkbox" id="toggle-zones" checked> 🗺️ Zonas (7 Ejes)
            </label>
            <label class="gis-layer-chip">
              <input type="checkbox" id="toggle-rings" checked> 🎯 Radios (Anillos 1-3)
            </label>
          </div>

          <!-- Categoría 3: Infraestructura -->
          <div class="gis-layer-category">
            <strong style="color:var(--text-secondary);font-size:.7rem;text-transform:uppercase;margin-right:2px;">Infraestructura:</strong>
            <label class="gis-layer-chip">
              <input type="checkbox" id="toggle-communities" checked> 📍 Comunidades PDOT
            </label>
            <label class="gis-layer-chip">
              <input type="checkbox" id="toggle-pois" checked> 🏥 Salud / Escuelas
            </label>
            <label class="gis-layer-chip">
              <input type="checkbox" id="toggle-roads"> 🛣️ Red Vial
            </label>
          </div>
        </div>

      </div>

      <!-- Contenedor del Mapa -->
      <div class="card fade-in" style="padding:0;overflow:hidden;position:relative;">
        <div id="map-container" style="width:100%;height:700px;background:#1e293b;"></div>

        <!-- Leyenda Flotante Enriquecida y Minimizable -->
        <div id="gis-legend" class="gis-floating-legend">
          <div id="gis-legend-header" class="gis-legend-header" title="Clic para minimizar o expandir simbología">
            <div class="gis-legend-title">
              <span class="legend-icon">🗺️</span>
              <span>Simbología</span>
            </div>
            <button type="button" class="gis-legend-toggle-btn" id="btn-toggle-legend" aria-label="Alternar visibilidad de la leyenda">
              <svg id="legend-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>

          <div id="gis-legend-content" class="gis-legend-content">
            <div style="font-size:.7rem;font-weight:700;color:#cbd5e1;margin-bottom:.3rem;text-transform:uppercase;">Viviendas Dasimétricas:</div>
            <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.35rem;font-size:.8rem;">
              <span style="width:11px;height:11px;border-radius:50%;background:#10b981;border:1.5px solid white;display:inline-block;"></span>
              <span>Muestra Titular (Primaria - 4,370)</span>
            </div>
            <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.35rem;font-size:.8rem;">
              <span style="width:11px;height:11px;border-radius:50%;background:#ea580c;border:1.5px solid white;display:inline-block;"></span>
              <span>Muestra Reserva (Sustitución - 1,116)</span>
            </div>
            <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.6rem;font-size:.8rem;">
              <span style="width:11px;height:11px;border-radius:50%;background:#3b82f6;border:1.5px solid white;display:inline-block;"></span>
              <span>Encuesta Completada (KoBo)</span>
            </div>

            <div style="font-size:.7rem;font-weight:700;color:#cbd5e1;margin-bottom:.3rem;text-transform:uppercase;">Macro-Sectores Operativos:</div>
            <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.3rem;font-size:.78rem;">
              <span style="width:10px;height:10px;border-radius:50%;background:#2563eb;border:1.5px solid white;display:inline-block;"></span>
              <span>Sector A: Cabecera Urbana (16 asents. | 221 niños)</span>
            </div>
            <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.3rem;font-size:.78rem;">
              <span style="width:10px;height:10px;border-radius:50%;background:#059669;border:1.5px solid white;display:inline-block;"></span>
              <span>Sector B: Panamericana (14 coms. | 230 niños)</span>
            </div>
            <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.6rem;font-size:.78rem;">
              <span style="width:10px;height:10px;border-radius:50%;background:#dc2626;border:1.5px solid white;display:inline-block;"></span>
              <span>Sector C: Comunidades Altas (15 coms. | 196 niños)</span>
            </div>

            <div style="font-size:.7rem;font-weight:700;color:#cbd5e1;margin-bottom:.3rem;text-transform:uppercase;">Equipamiento Comunal:</div>
            <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.3rem;font-size:.78rem;">
              <span style="width:10px;height:10px;border-radius:50%;background:#8b5cf6;border:1.5px solid white;display:inline-block;"></span>
              <span>45 Asentamientos Oficiales PDOT</span>
            </div>
            <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.3rem;font-size:.78rem;">
              <span style="width:10px;height:10px;border-radius:50%;background:#ef4444;border:1.5px solid white;display:inline-block;"></span>
              <span>Centros de Salud MSP</span>
            </div>
            <div style="display:flex;align-items:center;gap:.5rem;font-size:.78rem;">
              <span style="width:10px;height:10px;border-radius:50%;background:#3b82f6;border:1.5px solid white;display:inline-block;"></span>
              <span>Escuelas (Puntos Fijos TEM)</span>
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
    // Inicializar mapa centrado en San Andrés con motor Canvas para alto rendimiento
    this.map = L.map('map-container', {
      center: [-1.595, -78.715],
      zoom: 13,
      zoomControl: true,
      maxZoom: 19,
      preferCanvas: true // Rápido para miles de puntos
    });

    // Definir capas base
    this.baseLayers.satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; Esri &copy; Maxar &copy; Earthstar Geographics',
      maxZoom: 19
    });

    this.baseLayers.cartoLight = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OSM &copy; CARTO',
      maxZoom: 19
    });

    this.baseLayers.cartoDark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OSM &copy; CARTO',
      maxZoom: 19
    });

    this.baseLayers.osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    });

    // Satélite por defecto
    this.baseLayers.satellite.addTo(this.map);
    this._currentBasemap = 'satellite';

    // Inicializar grupos de capas
    this.layers.parishBoundary = L.layerGroup().addTo(this.map);
    this.layers.zones = L.layerGroup().addTo(this.map);
    this.layers.visitRings = L.layerGroup().addTo(this.map);
    this.layers.communities = L.layerGroup().addTo(this.map);
    this.layers.pois = L.layerGroup().addTo(this.map);
    this.layers.houses = L.layerGroup().addTo(this.map);
    this.layers.roads = L.layerGroup(); // apagado por defecto

    // Cargar capas GeoJSON oficiales
    this._loadGeoData();

    // Configurar listeners de filtros y eventos
    this._setupListeners();

    setTimeout(() => {
      if (this.map) this.map.invalidateSize();
    }, 250);
  },

  switchBasemap(name) {
    if (this._currentBasemap && this.baseLayers[this._currentBasemap]) {
      this.map.removeLayer(this.baseLayers[this._currentBasemap]);
    }
    const layer = this.baseLayers[name === 'satellite' ? 'satellite' : (name === 'carto-dark' ? 'cartoDark' : (name === 'carto-light' ? 'cartoLight' : 'osm'))];
    if (layer) {
      layer.addTo(this.map);
      this._currentBasemap = name;
    }
  },

  // ---------------------------------------------------------------------------
  // Carga Asíncrona de Capas GeoJSON (con In-Memory Singleton GeoCache)
  // ---------------------------------------------------------------------------
  async _loadGeoData() {
    try {
      // ⚡ Optimización SWEBOK KA 2: Si los datos ya residen en memoria RAM, renderizar inmediatamente
      if (this.geoData.houses && this.geoData.boundary) {
        console.log('⚡ GISModule: Reutilizando In-Memory Singleton GeoCache (0 red / 0 re-parse)');
        this._renderBoundary();
        if (this.geoData.zones) this._renderZones();
        if (this.geoData.visitRings) this._renderVisitRings();
        if (this.geoData.communities) {
          this._populateCommunityFilter();
          this._renderCommunities();
        }
        if (this.geoData.pois) this._renderPOIs();
        this._renderHouses();
        if (this.geoData.roads) this._renderRoads();
        return;
      }

      // 1. Límite Parroquial San Andrés
      fetch('/data/gis/san_andres_limite.geojson')
        .then(r => r.json())
        .then(data => {
          this.geoData.boundary = data;
          this._renderBoundary();
        })
        .catch(e => console.warn('Error cargando límite parroquial', e));

      // 2. Zonas Logísticas (7 Ejes)
      fetch('/data/gis/zonas_logisticas_san_andres.geojson')
        .then(r => r.json())
        .then(data => {
          this.geoData.zones = data;
          this._renderZones();
        })
        .catch(e => console.warn('Error cargando zonas logísticas', e));

      // 3. Radios de Visita (Anillos Concéntricos)
      fetch('/data/gis/anillos_visita_san_andres.geojson')
        .then(r => r.json())
        .then(data => {
          this.geoData.visitRings = data;
          this._renderVisitRings();
        })
        .catch(e => console.warn('Error cargando anillos de visita', e));

      // 4. Comunidades Oficiales PDOT (45 asentamientos oficiales depurados)
      fetch('/data/gis/comunidades_oficiales_pdot_san_andres.geojson')
        .then(r => r.json())
        .then(data => {
          this.geoData.communities = data;
          this._populateCommunityFilter();
          this._renderCommunities();
        })
        .catch(e => console.warn('Error cargando comunidades oficiales', e));

      // 5. POIs (Salud y Educación)
      fetch('/data/gis/puntos_interes_pois_san_andres.geojson')
        .then(r => r.json())
        .then(data => {
          this.geoData.pois = data;
          this._renderPOIs();
        })
        .catch(e => console.warn('Error cargando POIs', e));

      // 6. Viviendas Oficiales (5,486 techos habitacionales dasimétricos clasificados K-NN)
      fetch('/data/gis/san_andres_viviendas.geojson')
        .then(r => r.json())
        .then(data => {
          this.geoData.houses = data;
          this._renderHouses();
        })
        .catch(e => console.warn('Error cargando viviendas dasimétricas', e));

      // 7. Red Vial
      fetch('/data/gis/red_vial_san_andres.geojson')
        .then(r => r.json())
        .then(data => {
          this.geoData.roads = data;
          this._renderRoads();
        })
        .catch(e => console.warn('Error cargando vías', e));

    } catch (err) {
      console.error('Error general cargando datos GIS', err);
    }
  },

  // ---------------------------------------------------------------------------
  // Renderizado de Capas Específicas
  // ---------------------------------------------------------------------------
  _renderBoundary() {
    if (!this.geoData.boundary) return;
    this.layers.parishBoundary.clearLayers();

    L.geoJSON(this.geoData.boundary, {
      style: {
        color: '#E8734A',
        weight: 3,
        opacity: 0.9,
        dashArray: '6, 6',
        fillColor: '#E8734A',
        fillOpacity: 0.04
      }
    }).addTo(this.layers.parishBoundary);
  },

  _renderZones() {
    if (!this.geoData.zones) return;
    this.layers.zones.clearLayers();

    const features = this.geoData.zones.features || [];
    features.forEach(f => {
      const p = f.properties || {};
      const zoneName = p.zona_logistica || '';
      const color = p.color || this.zoneColors[zoneName] || '#3b82f6';

      // Filtro de zona
      if (this.selectedZone && zoneName !== this.selectedZone) return;

      const layer = L.geoJSON(f, {
        style: {
          color: color,
          weight: 2,
          opacity: 0.85,
          fillColor: color,
          fillOpacity: 0.08,
          dashArray: '4, 4'
        }
      });

      layer.bindTooltip(`🗺️ <strong>${zoneName}</strong><br>Viviendas: ${p.total_viviendas} (${p.titulares} titulares / ${p.reserva} reserva)`, {
        sticky: true,
        className: 'gis-tooltip'
      });

      layer.addTo(this.layers.zones);
    });
  },

  _renderVisitRings() {
    if (!this.geoData.visitRings) return;
    this.layers.visitRings.clearLayers();

    const features = this.geoData.visitRings.features || [];
    features.forEach(f => {
      const p = f.properties || {};
      const anillo = p.anillo || 1;
      const color = p.color || (anillo === 1 ? '#10b981' : (anillo === 2 ? '#f59e0b' : '#ea580c'));

      // Filtros
      if (this.selectedZone && p.zona_logistica !== this.selectedZone) return;
      if (this.selectedCommunity && p.comunidad && !p.comunidad.toLowerCase().includes(this.selectedCommunity.toLowerCase())) return;

      const layer = L.geoJSON(f, {
        style: {
          color: color,
          weight: anillo === 1 ? 2 : 1.5,
          opacity: 0.8,
          fillColor: color,
          fillOpacity: anillo === 1 ? 0.06 : 0.03,
          dashArray: anillo === 1 ? null : (anillo === 2 ? '6, 4' : '3, 5')
        }
      });

      layer.bindTooltip(`🎯 <strong>${p.comunidad}</strong> — Anillo ${anillo}<br>Radio: ${p.radio_metros} m | ${p.radio_label}`, {
        sticky: true,
        className: 'gis-tooltip'
      });

      layer.addTo(this.layers.visitRings);
    });
  },

  _renderRoads() {
    if (!this.geoData.roads) return;
    this.layers.roads.clearLayers();

    L.geoJSON(this.geoData.roads, {
      style: {
        color: '#f59e0b',
        weight: 1.5,
        opacity: 0.65
      }
    }).addTo(this.layers.roads);
  },

  _renderCommunities() {
    if (!this.geoData.communities) return;
    this.layers.communities.clearLayers();

    const features = this.geoData.communities.features || [];

    features.forEach(f => {
      const p = f.properties || {};
      const coords = f.geometry.coordinates; // [lng, lat]
      const latLng = [coords[1], coords[0]];

      if (this.selectedZone && (p.macro_sector !== this.selectedZone && p.zona_logistica !== this.selectedZone)) return;
      if (this.selectedCommunity && p.nombre && !p.nombre.toLowerCase().includes(this.selectedCommunity.toLowerCase())) return;

      const sectorColor = this.zoneColors[p.macro_sector] || '#8b5cf6';

      const marker = L.circleMarker(latLng, {
        radius: 8,
        fillColor: sectorColor,
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.95
      });

      marker.bindPopup(`
        <div style="font-size:.85rem;min-width:245px;line-height:1.45;">
          <div style="font-weight:800;font-size:1.05rem;color:${sectorColor};margin-bottom:.3rem;border-bottom:1px solid var(--border);padding-bottom:.3rem;">
            📍 ${p.nombre || 'Comunidad'}
          </div>
          <div style="font-size:.78rem;color:var(--text-secondary);margin-bottom:.45rem;background:var(--bg-tertiary);padding:.4rem;border-radius:6px;">
            <div><strong>ID PDOT:</strong> ${p.id_pdot || 'N/A'} | <strong>Tipo:</strong> ${p.tipo || 'Comunidad Rural'}</div>
            <div><strong>Macro-Sector:</strong> <strong>${p.macro_sector || 'N/A'}</strong></div>
          </div>
          <div style="font-size:.8rem;line-height:1.45;margin-bottom:.4rem;">
            <strong>Dupla Asignada:</strong> <span class="badge badge-blue">${p.dupla_asignada || 'D01'}</span><br>
            <strong>Supervisor:</strong> ${p.supervisor || 'FSP ESPOCH'}<br>
            <strong>Viviendas Dasimétricas:</strong> <strong>${p.viviendas_satelitales || 0}</strong> techos<br>
            <strong>Meta Asignada:</strong> <strong style="color:#E8734A;">${p.ninos_meta_asignada || 0} niños</strong><br>
            <strong>Sede / Equipamiento:</strong> ${p.equipamiento || 'Casa Comunal / Escuela'}<br>
            <strong>Autoridad:</strong> <em style="font-size:.74rem;color:var(--text-muted);">${p.autoridad_local || '[Por confirmar en territorio con Cabildo Comunal / GAD]'}</em>
          </div>
          <div style="border-top:1px solid var(--border);padding-top:.4rem;">
            <a href="https://www.google.com/maps/dir/?api=1&destination=${latLng[0]},${latLng[1]}&travelmode=walking" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="display:flex;align-items:center;justify-content:center;gap:.3rem;font-size:.76rem;text-decoration:none;">
              🧭 Cómo llegar a la sede (Google Maps)
            </a>
          </div>
        </div>
      `);

      marker.bindTooltip(`📍 ${p.nombre} (${p.macro_sector || ''})`, {
        permanent: false,
        direction: 'top',
        className: 'gis-tooltip'
      });

      marker.addTo(this.layers.communities);
    });
  },

  _renderPOIs() {
    if (!this.geoData.pois) return;
    this.layers.pois.clearLayers();

    const features = this.geoData.pois.features || [];

    features.forEach(f => {
      const p = f.properties || {};
      const coords = f.geometry.coordinates;
      const latLng = [coords[1], coords[0]];
      const name = p.nombre || '';
      const isHealth = name.toLowerCase().includes('salud') || name.toLowerCase().includes('subcentro') || name.toLowerCase().includes('dispensario');
      const isSchool = name.toLowerCase().includes('escuela') || name.toLowerCase().includes('colegio') || name.toLowerCase().includes('unidad educativa');

      const color = isHealth ? '#ef4444' : (isSchool ? '#3b82f6' : '#10b981');
      const iconText = isHealth ? '🏥' : (isSchool ? '🏫' : '🏛️');

      const marker = L.circleMarker(latLng, {
        radius: 8,
        fillColor: color,
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.95
      });

      const gmapsPoiUrl = `https://www.google.com/maps/dir/?api=1&destination=${latLng[0]},${latLng[1]}&travelmode=walking`;

      marker.bindPopup(`
        <div style="font-size:.85rem;min-width:200px;">
          <div style="font-weight:700;font-size:1rem;color:${color};margin-bottom:.25rem;">
            ${iconText} ${p.nombre}
          </div>
          <div style="font-size:.75rem;color:var(--text-secondary);margin-bottom:.4rem;">
            ID: ${p.id_poi || 'N/A'} | ${p.categoria || 'Infraestructura'}
          </div>
          <div style="font-size:.8rem;margin-bottom:.5rem;">
            <strong>Coordenadas:</strong> ${latLng[0].toFixed(5)}, ${latLng[1].toFixed(5)}<br>
            <strong>Zona:</strong> San Andrés (Guano)
          </div>
          <div style="border-top:1px solid var(--border);padding-top:.4rem;">
            <a href="${gmapsPoiUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="display:flex;align-items:center;justify-content:center;gap:.4rem;text-decoration:none;font-size:.78rem;padding:.35rem;">
              🧭 Cómo llegar (Google Maps)
            </a>
          </div>
        </div>
      `);

      marker.addTo(this.layers.pois);
    });
  },

  _isPointInBoundary(coords) {
    if (!this.geoData.boundary || !this.geoData.boundary.features || !this.geoData.boundary.features[0]) {
      return true;
    }
    const geom = this.geoData.boundary.features[0].geometry;
    const multiPolyCoords = geom.type === 'MultiPolygon' ? geom.coordinates : [geom.coordinates];
    const x = coords[0], y = coords[1];

    for (const poly of multiPolyCoords) {
      const ring = poly[0];
      let inside = false;
      for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const xi = ring[i][0], yi = ring[i][1];
        const xj = ring[j][0], yj = ring[j][1];
        const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
      }
      if (inside) return true;
    }
    return false;
  },

  _renderHouses() {
    if (!this.geoData.houses) return;
    this.layers.houses.clearLayers();

    const features = this.geoData.houses.features || [];
    const completedSubs = (window.KoboSyncModule && KoboSyncModule.submissions) ? KoboSyncModule.submissions : [];
    const completedMap = new Set(completedSubs.map(s => s.idVivienda));

    // Estados de los toggles
    const showTitular = document.getElementById('toggle-houses-titular') ? document.getElementById('toggle-houses-titular').checked : true;
    const showReserva = document.getElementById('toggle-houses-reserva') ? document.getElementById('toggle-houses-reserva').checked : true;

    let visibleCount = 0;
    let titularCount = 0;
    let reservaCount = 0;
    let completedCount = 0;

    features.forEach(f => {
      const p = f.properties || {};
      const coords = f.geometry.coordinates;
      const latLng = [coords[1], coords[0]];
      const houseId = p.id_vivienda || 'VIV';
      const isTitular = (p.tipo_muestra === 'titular');
      const isCompleted = completedMap.has(houseId);
      const community = p.comunidad || 'San Andrés';
      const zona = p.zona_logistica || '';

      // Validación estricta con el polígono parroquial oficial de San Andrés
      if (!this._isPointInBoundary(coords)) return;

      // Filtro de checkboxes Titular / Reserva
      if (isTitular && !showTitular) return;
      if (!isTitular && !showReserva) return;

      // Filtro por Tipo de Muestra seleccionado en dropdown
      if (this.selectedSampleType && p.tipo_muestra !== this.selectedSampleType) return;

      // Filtro por Macro-Sector o Zona Logística
      if (this.selectedZone && (p.macro_sector !== this.selectedZone && zona !== this.selectedZone)) return;

      // Filtro por Comunidad
      if (this.selectedCommunity && !community.toLowerCase().includes(this.selectedCommunity.toLowerCase())) {
        return;
      }

      // Filtro por Estado KoBo
      if (this.selectedStatus === 'completada' && !isCompleted) return;
      if (this.selectedStatus === 'pendiente' && isCompleted) return;

      visibleCount++;
      if (isTitular) titularCount++; else reservaCount++;
      if (isCompleted) completedCount++;

      // Color oficial del KML:
      // Titular: Verde (#10b981)
      // Reserva / Complementaria: Naranja Ámbar (#ea580c)
      // Completada: Azul (#3b82f6)
      const markerColor = isCompleted ? '#3b82f6' : (isTitular ? '#10b981' : '#ea580c');

      const marker = L.circleMarker(latLng, {
        radius: isCompleted ? 6.5 : (isTitular ? 5 : 4.5),
        fillColor: markerColor,
        color: '#ffffff',
        weight: 1.2,
        opacity: 0.95,
        fillOpacity: isCompleted ? 0.95 : (isTitular ? 0.85 : 0.75)
      });

      const badgeClass = isCompleted ? 'badge-blue' : (isTitular ? 'badge-green' : 'badge-orange');
      const sampleBadgeText = isTitular ? '🟢 TITULAR (PRIMARIA)' : '🟠 RESERVA (COMPLEMENTARIA)';

      // Deeplinks oficiales hacia KoBoToolbox / Enketo con ID y comunidad prellenados
      const antroFormUrl = `https://ee.kobotoolbox.org/XnLSvL66?d[id_vivienda]=${encodeURIComponent(houseId)}&d[comunidad]=${encodeURIComponent(community)}`;
      const hogarFormUrl = `https://ee.kobotoolbox.org/rrNpxrAR?d[id_vivienda]=${encodeURIComponent(houseId)}&d[comunidad]=${encodeURIComponent(community)}`;
      // Enlace a Google Maps para navegación a pie
      const gmapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latLng[0]},${latLng[1]}&travelmode=walking`;

      marker.bindPopup(`
        <div style="font-size:.85rem;min-width:275px;line-height:1.45;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.45rem;border-bottom:1px solid var(--border);padding-bottom:.4rem;">
            <span class="badge ${badgeClass}" style="font-family:monospace;font-weight:800;font-size:.82rem;">
              ${houseId}
            </span>
            <span style="font-size:.72rem;font-weight:700;color:${markerColor};">
              ${isCompleted ? '✅ COMPLETADA KOBO' : sampleBadgeText}
            </span>
          </div>

          <div style="font-size:.95rem;font-weight:800;color:var(--text-primary);margin-bottom:.25rem;">
            📍 ${community}
          </div>

          <div style="font-size:.78rem;color:var(--text-secondary);margin-bottom:.55rem;background:var(--bg-tertiary);padding:.5rem;border-radius:6px;border:1px solid var(--border);">
            <div style="display:flex;justify-content:space-between;margin-bottom:2px;">
              <span>Muestra:</span>
              <strong style="color:var(--text-primary);">${p.tipo_muestra_label || (isTitular ? 'Titular Obligatoria' : 'Reserva de Sustitución')}</strong>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:2px;">
              <span>Macro-Sector:</span>
              <strong style="color:var(--text-primary);">${p.macro_sector || zona || 'San Andrés'}</strong>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:2px;">
              <span>Dupla Asignada:</span>
              <strong style="color:var(--text-primary);">${p.dupla_asignada || 'D01'}</strong>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:2px;">
              <span>Tipología / Techo:</span>
              <strong style="color:var(--text-primary);">${p.tipologia || 'Vivienda Rural'}</strong>
            </div>
            <div style="display:flex;justify-content:space-between;">
              <span>Coordenadas:</span>
              <strong style="font-family:monospace;color:var(--text-primary);">${latLng[0].toFixed(5)}, ${latLng[1].toFixed(5)}</strong>
            </div>
          </div>

          <div style="display:flex;flex-direction:column;gap:.35rem;">
            <a href="${antroFormUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="display:flex;align-items:center;justify-content:center;gap:.4rem;text-decoration:none;font-size:.78rem;padding:.42rem;background:#10b981;border-color:#10b981;font-weight:700;color:white;">
              📏 Ficha Antropométrica (Niños 0-59m)
            </a>
            <a href="${hogarFormUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="display:flex;align-items:center;justify-content:center;gap:.4rem;text-decoration:none;font-size:.78rem;padding:.42rem;background:#E8734A;border-color:#E8734A;font-weight:700;color:white;">
              🏠 Caracterización del Hogar & ELCSA
            </a>
            <a href="${gmapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="display:flex;align-items:center;justify-content:center;gap:.4rem;text-decoration:none;font-size:.76rem;padding:.38rem;border-color:var(--border);">
              🧭 Cómo llegar (Google Maps)
            </a>
          </div>
        </div>
      `);

      marker.addTo(this.layers.houses);
    });

    // Actualizar contadores del mapa
    const kpiHouses = document.getElementById('gis-kpi-houses');
    const kpiTitulares = document.getElementById('gis-kpi-titulares');
    const kpiReserva = document.getElementById('gis-kpi-reserva');
    const kpiCompleted = document.getElementById('gis-kpi-completed');

    if (kpiHouses) kpiHouses.textContent = visibleCount.toLocaleString();
    if (kpiTitulares) kpiTitulares.textContent = titularCount.toLocaleString();
    if (kpiReserva) kpiReserva.textContent = reservaCount.toLocaleString();
    if (kpiCompleted) kpiCompleted.textContent = completedCount.toLocaleString();
  },

  // ---------------------------------------------------------------------------
  // Filtros y Eventos
  // ---------------------------------------------------------------------------
  _populateCommunityFilter() {
    const sel = document.getElementById('gis-filter-community');
    if (!sel || !this.geoData.communities) return;

    // Limpiar options excepto el primero
    while (sel.options.length > 1) sel.remove(1);

    const features = this.geoData.communities.features || [];
    const sectors = {
      'Sector A (Cabecera y Bajas)': [],
      'Sector B (Panamericana y Media)': [],
      'Sector C (Comunidades Altas)': []
    };

    features.forEach(f => {
      const p = f.properties || {};
      const sec = p.macro_sector || 'Sector A';
      const key = sec === 'Sector A' ? 'Sector A (Cabecera y Bajas)' :
                 (sec === 'Sector B' ? 'Sector B (Panamericana y Media)' : 'Sector C (Comunidades Altas)');
      if (sectors[key]) {
        sectors[key].push({ nombre: p.nombre, meta: p.ninos_meta_asignada || 0, dupla: p.dupla_asignada || 'D01' });
      }
    });

    Object.keys(sectors).forEach(secName => {
      const grp = document.createElement('optgroup');
      grp.label = secName;
      sectors[secName].sort((a, b) => a.nombre.localeCompare(b.nombre)).forEach(item => {
        const opt = document.createElement('option');
        opt.value = item.nombre;
        opt.textContent = `${item.nombre} (${item.meta} niños | ${item.dupla})`;
        grp.appendChild(opt);
      });
      sel.appendChild(grp);
    });
  },

  _setupListeners() {
    const zoneFilter = document.getElementById('gis-filter-zone');
    const commFilter = document.getElementById('gis-filter-community');
    const sampleFilter = document.getElementById('gis-filter-sample');
    const statusFilter = document.getElementById('gis-filter-status');

    if (zoneFilter) {
      zoneFilter.addEventListener('change', (e) => {
        this.selectedZone = e.target.value;
        this._renderZones();
        this._renderVisitRings();
        this._renderCommunities();
        this._renderHouses();

        // Ajustar vista a la zona seleccionada
        if (this.selectedZone && this.geoData.zones) {
          const found = this.geoData.zones.features.find(f => f.properties.zona_logistica === this.selectedZone);
          if (found) {
            const bboxLayer = L.geoJSON(found);
            this.map.fitBounds(bboxLayer.getBounds(), { padding: [30, 30] });
          }
        }
      });
    }

    if (commFilter) {
      commFilter.addEventListener('change', (e) => {
        this.selectedCommunity = e.target.value;
        this._renderVisitRings();
        this._renderCommunities();
        this._renderHouses();

        // Si seleccionó una comunidad, centrar mapa en su coordenada
        if (this.selectedCommunity && this.geoData.communities) {
          const found = this.geoData.communities.features.find(f => f.properties.nombre === this.selectedCommunity);
          if (found) {
            const coords = found.geometry.coordinates;
            this.map.flyTo([coords[1], coords[0]], 15, { duration: 1 });
          }
        }
      });
    }

    if (sampleFilter) {
      sampleFilter.addEventListener('change', (e) => {
        this.selectedSampleType = e.target.value;
        this._renderHouses();
      });
    }

    if (statusFilter) {
      statusFilter.addEventListener('change', (e) => {
        this.selectedStatus = e.target.value;
        this._renderHouses();
      });
    }

    // Botón Restablecer Filtros
    const btnReset = document.getElementById('btn-reset-gis-filters');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        this.selectedZone = '';
        this.selectedCommunity = '';
        this.selectedSampleType = '';
        this.selectedStatus = '';
        if (zoneFilter) zoneFilter.value = '';
        if (commFilter) commFilter.value = '';
        if (sampleFilter) sampleFilter.value = '';
        if (statusFilter) statusFilter.value = '';
        this._renderZones();
        this._renderVisitRings();
        this._renderCommunities();
        this._renderHouses();
        if (this.map) {
          this.map.flyTo([-1.5916, -78.7015], 13, { duration: 1 });
        }
      });
    }

    // Toggles de Capas
    const toggleTitular = document.getElementById('toggle-houses-titular');
    const toggleReserva = document.getElementById('toggle-houses-reserva');
    const toggleRings = document.getElementById('toggle-rings');
    const toggleZones = document.getElementById('toggle-zones');
    const toggleComm = document.getElementById('toggle-communities');
    const togglePois = document.getElementById('toggle-pois');
    const toggleBoundary = document.getElementById('toggle-boundary');
    const toggleRoads = document.getElementById('toggle-roads');

    if (toggleTitular) toggleTitular.addEventListener('change', () => this._renderHouses());
    if (toggleReserva) toggleReserva.addEventListener('change', () => this._renderHouses());
    
    if (toggleRings) toggleRings.addEventListener('change', (e) => e.target.checked ? this.layers.visitRings.addTo(this.map) : this.map.removeLayer(this.layers.visitRings));
    if (toggleZones) toggleZones.addEventListener('change', (e) => e.target.checked ? this.layers.zones.addTo(this.map) : this.map.removeLayer(this.layers.zones));
    if (toggleComm) toggleComm.addEventListener('change', (e) => e.target.checked ? this.layers.communities.addTo(this.map) : this.map.removeLayer(this.layers.communities));
    if (togglePois) togglePois.addEventListener('change', (e) => e.target.checked ? this.layers.pois.addTo(this.map) : this.map.removeLayer(this.layers.pois));
    if (toggleBoundary) toggleBoundary.addEventListener('change', (e) => e.target.checked ? this.layers.parishBoundary.addTo(this.map) : this.map.removeLayer(this.layers.parishBoundary));
    if (toggleRoads) toggleRoads.addEventListener('change', (e) => e.target.checked ? this.layers.roads.addTo(this.map) : this.map.removeLayer(this.layers.roads));

    // Control de Colapso / Minimización de Leyenda Flotante
    const legendEl = document.getElementById('gis-legend');
    const legendHeader = document.getElementById('gis-legend-header');

    if (legendEl && legendHeader) {
      // Prevenir propagación de eventos al mapa Leaflet (evita drag/zoom al tocar la leyenda)
      if (typeof L !== 'undefined' && L.DomEvent) {
        L.DomEvent.disableClickPropagation(legendEl);
        L.DomEvent.disableScrollPropagation(legendEl);
      }

      // Inicializar estado: en pantallas móviles (<=768px) inicia minimizado por defecto
      const isMobile = window.innerWidth <= 768;
      const savedState = localStorage.getItem('gis_legend_collapsed');
      
      if (savedState === 'true' || (savedState === null && isMobile)) {
        legendEl.classList.add('collapsed');
      } else {
        legendEl.classList.remove('collapsed');
      }

      // Evento toggle al hacer clic en el encabezado
      legendHeader.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isCollapsed = legendEl.classList.toggle('collapsed');
        localStorage.setItem('gis_legend_collapsed', isCollapsed ? 'true' : 'false');
      });
    }
  },

  refreshVisitedHouses() {
    this._renderHouses();
  },

  highlightHouse(houseId) {
    if (!this.geoData.houses) return;
    const f = this.geoData.houses.features.find(x => x.properties.id_vivienda === houseId);
    if (f) {
      const coords = f.geometry.coordinates;
      this.map.flyTo([coords[1], coords[0]], 17, { duration: 1.2 });
    }
  },

  focusCoordinates(lat, lng, zoom = 16, label = null) {
    if (!this.map) return;
    this.map.flyTo([lat, lng], zoom, { duration: 1.2 });
    if (label) {
      L.popup({ autoClose: true, closeOnClick: true })
        .setLatLng([lat, lng])
        .setContent(`<div style="padding:4px 8px;font-family:Inter,sans-serif;font-weight:700;color:#E8734A;">📍 ${label}</div>`)
        .openOn(this.map);
    }
  },

  focusCommunityOrZone(name) {
    if (!name || !this.map) return;
    const cleanName = name.toLowerCase();
    
    // 1. Buscar en geoData.communities
    if (this.geoData && this.geoData.communities && this.geoData.communities.features) {
      const found = this.geoData.communities.features.find(f => {
        const nom = (f.properties?.nombre || '').toLowerCase();
        return nom.includes(cleanName) || cleanName.includes(nom);
      });
      if (found) {
        const coords = found.geometry.coordinates;
        this.map.flyTo([coords[1], coords[0]], 15, { duration: 1.2 });
        const commSelect = document.getElementById('gis-select-community');
        if (commSelect) {
          commSelect.value = found.properties.nombre;
          this.selectedCommunity = found.properties.nombre;
          this._renderHouses();
        }
        return;
      }
    }

    // 2. Fallback por coordenadas conocidas de comunidades
    const knownCoords = {
      'san andrés': [-1.5917, -78.7017],
      'san andres': [-1.5917, -78.7017],
      'pulingui': [-1.5645, -78.7420],
      'pulinguí': [-1.5645, -78.7420],
      'trencilla': [-1.5830, -78.7350],
      'gualiqueme': [-1.5598, -78.7232],
      'san pablo': [-1.5720, -78.7180],
      'los pinos': [-1.5950, -78.7080],
      'batzacon': [-1.6080, -78.6980],
      'batzacón': [-1.6080, -78.6980],
      'calshi': [-1.5680, -78.7120]
    };

    for (const [k, coords] of Object.entries(knownCoords)) {
      if (cleanName.includes(k)) {
        this.map.flyTo(coords, 15, { duration: 1.2 });
        break;
      }
    }
  },

  setTerritory(t) {
    if (t === 'manglaralto') {
      alert(
        "🌊 TERRITORIO MANGLARALTO (SANTA ELENA)\n\n" +
        "Estado del Componente A.3.1:\n" +
        "• La cartografía vectorial por IA (SAMv3) y la muestra de campo de Manglaralto están programadas para la siguiente fase operativa.\n" +
        "• No se muestran puntos ficticios para evitar confusiones de campo.\n" +
        "• El 100% de la cartografía y logística actual está activa en San Andrés (Chimborazo)."
      );
      return;
    }
    this.selectedTerritory = 'san-andres';
    document.getElementById('tab-territory-sa').classList.add('active');
    document.getElementById('tab-territory-mg').classList.remove('active');
  },

  destroy() {
    if (this.map) {
      try {
        this.map.remove();
      } catch (err) {
        console.warn('Error removing Leaflet map:', err);
      }
      this.map = null;
    }
  }
};

window.GISModule = GISModule;
