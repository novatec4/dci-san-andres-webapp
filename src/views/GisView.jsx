import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, Filter, RotateCcw, MapPin, Home, Compass, Eye, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

export default function GisView() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersRef = useRef({
    boundary: null,
    zones: null,
    rings: null,
    communities: null,
    pois: null,
    houses: null,
    roads: null
  });

  const geoDataRef = useRef({
    boundary: null,
    zones: null,
    rings: null,
    communities: null,
    pois: null,
    houses: null,
    roads: null
  });

  // Filtros
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState('');
  const [selectedSampleType, setSelectedSampleType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedBaseMap, setSelectedBaseMap] = useState('satellite');

  // Toggles de Capas
  const [showTitular, setShowTitular] = useState(true);
  const [showReserva, setShowReserva] = useState(true);
  const [showBoundary, setShowBoundary] = useState(true);
  const [showZones, setShowZones] = useState(true);
  const [showRings, setShowRings] = useState(true);
  const [showCommunities, setShowCommunities] = useState(true);
  const [showPois, setShowPois] = useState(true);
  const [showRoads, setShowRoads] = useState(false);

  // Contadores
  const [stats, setStats] = useState({
    visible: 5486,
    titulares: 4370,
    reserva: 1116,
    kobo: 0
  });

  // Panel de Simbología colapsable
  const [showLegend, setShowLegend] = useState(true);
  const [communitiesList, setCommunitiesList] = useState([]);

  // Base Maps
  const baseLayersRef = useRef({});

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Inicializar mapa centrado en San Andrés
      const map = L.map(mapContainerRef.current, {
        center: [-1.5850, -78.7200],
        zoom: 13,
        zoomControl: true,
        maxZoom: 19
      });

      // Definir Mapas Base
      const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Esri, Maxar, Earthstar Geographics',
        maxZoom: 19
      });

      const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      });

      const cartoLight = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© CartoDB',
        maxZoom: 19
      });

      baseLayersRef.current = { satellite, osm, cartoLight };
      satellite.addTo(map);

      // Grupos de capas
      layersRef.current.boundary = L.layerGroup().addTo(map);
      layersRef.current.zones = L.layerGroup().addTo(map);
      layersRef.current.rings = L.layerGroup().addTo(map);
      layersRef.current.roads = L.layerGroup().addTo(map);
      layersRef.current.houses = L.layerGroup().addTo(map);
      layersRef.current.communities = L.layerGroup().addTo(map);
      layersRef.current.pois = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;

      // Cargar GeoJSONs
      loadAllGeoData(map);
    }

    return () => {
      // Mantener instancia o limpiar si desmonta totalmente
    };
  }, []);

  // Cambiar Mapa Base
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    Object.values(baseLayersRef.current).forEach(layer => map.removeLayer(layer));
    if (baseLayersRef.current[selectedBaseMap]) {
      baseLayersRef.current[selectedBaseMap].addTo(map);
    }
  }, [selectedBaseMap]);

  // Recalcular y volver a pintar capas cuando cambian filtros o toggles
  useEffect(() => {
    renderAllLayers();
  }, [
    selectedZone,
    selectedCommunity,
    selectedSampleType,
    selectedStatus,
    showTitular,
    showReserva,
    showBoundary,
    showZones,
    showRings,
    showCommunities,
    showPois,
    showRoads
  ]);

  const loadAllGeoData = async (map) => {
    try {
      // 1. Límite
      const resB = await fetch('/data/gis/san_andres_limite.geojson').catch(() => null);
      if (resB && resB.ok) {
        geoDataRef.current.boundary = await resB.json();
      }

      // 2. Zonas
      const resZ = await fetch('/data/gis/zonas_logisticas_san_andres.geojson').catch(() => null);
      if (resZ && resZ.ok) {
        geoDataRef.current.zones = await resZ.json();
      }

      // 3. Anillos
      const resR = await fetch('/data/gis/anillos_visita_san_andres.geojson').catch(() => null);
      if (resR && resR.ok) {
        geoDataRef.current.rings = await resR.json();
      }

      // 4. Comunidades
      const resC = await fetch('/data/gis/comunidades_oficiales_pdot_san_andres.geojson').catch(() => null);
      if (resC && resC.ok) {
        const commData = await resC.json();
        geoDataRef.current.communities = commData;
        const list = (commData.features || [])
          .map(f => f.properties?.nombre)
          .filter(Boolean)
          .sort();
        setCommunitiesList([...new Set(list)]);
      }

      // 5. POIs
      const resP = await fetch('/data/gis/puntos_interes_pois_san_andres.geojson').catch(() => null);
      if (resP && resP.ok) {
        geoDataRef.current.pois = await resP.json();
      }

      // 6. Viviendas
      const resH = await fetch('/data/gis/san_andres_viviendas.geojson').catch(() => null);
      if (resH && resH.ok) {
        geoDataRef.current.houses = await resH.json();
      }

      // 7. Vías
      const resRd = await fetch('/data/gis/red_vial_san_andres.geojson').catch(() => null);
      if (resRd && resRd.ok) {
        geoDataRef.current.roads = await resRd.json();
      }

      renderAllLayers();
    } catch (e) {
      console.warn('Error cargando capas GIS:', e);
    }
  };

  const renderAllLayers = () => {
    if (!mapInstanceRef.current) return;

    // 1. Límite Parroquial
    const boundaryLayer = layersRef.current.boundary;
    boundaryLayer.clearLayers();
    if (showBoundary && geoDataRef.current.boundary) {
      L.geoJSON(geoDataRef.current.boundary, {
        style: {
          color: '#E8734A',
          weight: 3,
          opacity: 0.9,
          dashArray: '6, 6',
          fillColor: '#E8734A',
          fillOpacity: 0.03
        }
      }).addTo(boundaryLayer);
    }

    // 2. Zonas / Macro-Sectores
    const zonesLayer = layersRef.current.zones;
    zonesLayer.clearLayers();
    if (showZones && geoDataRef.current.zones) {
      const colors = {
        'Sector A': '#2563eb',
        'Sector B': '#059669',
        'Sector C': '#dc2626'
      };
      (geoDataRef.current.zones.features || []).forEach(f => {
        const p = f.properties || {};
        const zName = p.zona_logistica || p.macro_sector || '';
        if (selectedZone && !zName.toLowerCase().includes(selectedZone.toLowerCase())) return;

        const color = p.color || colors[p.macro_sector] || '#3b82f6';
        const lyr = L.geoJSON(f, {
          style: {
            color,
            weight: 2,
            opacity: 0.85,
            dashArray: '4, 4',
            fillColor: color,
            fillOpacity: 0.08
          }
        });
        lyr.bindTooltip(`<strong>${zName}</strong><br>Viviendas: ${p.total_viviendas || 'N/A'}`, { sticky: true });
        lyr.addTo(zonesLayer);
      });
    }

    // 3. Anillos de Proximidad
    const ringsLayer = layersRef.current.rings;
    ringsLayer.clearLayers();
    if (showRings && geoDataRef.current.rings) {
      L.geoJSON(geoDataRef.current.rings, {
        style: {
          color: '#f59e0b',
          weight: 1.5,
          dashArray: '3, 4',
          fillColor: '#f59e0b',
          fillOpacity: 0.04
        }
      }).addTo(ringsLayer);
    }

    // 4. Vías
    const roadsLayer = layersRef.current.roads;
    roadsLayer.clearLayers();
    if (showRoads && geoDataRef.current.roads) {
      L.geoJSON(geoDataRef.current.roads, {
        style: { color: '#ffffff', weight: 1.2, opacity: 0.6 }
      }).addTo(roadsLayer);
    }

    // 5. Comunidades PDOT (45 Asentamientos)
    const commLayer = layersRef.current.communities;
    commLayer.clearLayers();
    if (showCommunities && geoDataRef.current.communities) {
      (geoDataRef.current.communities.features || []).forEach(f => {
        const p = f.properties || {};
        const coords = f.geometry?.coordinates;
        if (!coords) return;
        const latLng = [coords[1], coords[0]];

        if (selectedZone && p.macro_sector !== selectedZone) return;
        if (selectedCommunity && p.nombre !== selectedCommunity) return;

        const sectorColor = p.macro_sector === 'Sector A' ? '#2563eb' : (p.macro_sector === 'Sector B' ? '#059669' : '#dc2626');

        const marker = L.circleMarker(latLng, {
          radius: 7,
          fillColor: sectorColor,
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.95
        });

        marker.bindPopup(`
          <div style="font-size:12px;min-width:220px;line-height:1.4;">
            <div style="font-weight:bold;font-size:13px;color:${sectorColor};margin-bottom:4px;border-bottom:1px solid #E2E8F0;padding-bottom:3px;">
              📍 ${p.nombre || 'Comunidad'}
            </div>
            <div style="color:#64748B;font-size:11px;margin-bottom:4px;">
              ID PDOT: ${p.id_pdot || 'N/A'} • Macro-Sector: <strong>${p.macro_sector || 'N/A'}</strong>
            </div>
            <div style="margin-bottom:6px;">
              <strong>Dupla:</strong> ${p.dupla_asignada || 'D01'}<br>
              <strong>Viviendas Dasimétricas:</strong> ${p.viviendas_satelitales || 0} techos<br>
              <strong>Meta Parroquial:</strong> <span style="color:#E8734A;font-weight:bold;">${p.ninos_meta_asignada || 0} niños</span>
            </div>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${latLng[0]},${latLng[1]}&travelmode=walking" target="_blank" rel="noopener noreferrer" style="color:#002B49;font-weight:bold;text-decoration:underline;">
              Cómo llegar a la sede (Google Maps)
            </a>
          </div>
        `);

        marker.addTo(commLayer);
      });
    }

    // 6. POIs (Salud y Escuelas)
    const poisLayer = layersRef.current.pois;
    poisLayer.clearLayers();
    if (showPois && geoDataRef.current.pois) {
      (geoDataRef.current.pois.features || []).forEach(f => {
        const p = f.properties || {};
        const coords = f.geometry?.coordinates;
        if (!coords) return;
        const latLng = [coords[1], coords[0]];
        const isHealth = (p.nombre || '').toLowerCase().includes('salud');
        const color = isHealth ? '#ef4444' : '#3b82f6';

        const marker = L.circleMarker(latLng, {
          radius: 7.5,
          fillColor: color,
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.95
        });

        marker.bindPopup(`
          <div style="font-size:12px;min-width:200px;">
            <strong style="color:${color};font-size:13px;display:block;margin-bottom:3px;">
              ${isHealth ? '🏥' : '🏫'} ${p.nombre}
            </strong>
            <div style="color:#64748B;font-size:11px;margin-bottom:4px;">
              ${p.categoria || 'Equipamiento Institucional'} • San Andrés
            </div>
            <div>Coordenadas: ${latLng[0].toFixed(5)}, ${latLng[1].toFixed(5)}</div>
          </div>
        `);

        marker.addTo(poisLayer);
      });
    }

    // 7. Viviendas Dasimétricas (5,486 techos)
    const housesLayer = layersRef.current.houses;
    housesLayer.clearLayers();

    if (geoDataRef.current.houses) {
      const features = geoDataRef.current.houses.features || [];
      let vis = 0;
      let tit = 0;
      let res = 0;
      let kob = 0;

      features.forEach(f => {
        const p = f.properties || {};
        const coords = f.geometry?.coordinates;
        if (!coords) return;
        const latLng = [coords[1], coords[0]];
        const isTitular = (p.tipo_muestra === 'titular');
        const houseId = p.id_vivienda || 'VIV';
        const comm = p.comunidad || '';

        // Toggles
        if (isTitular && !showTitular) return;
        if (!isTitular && !showReserva) return;

        // Filtros
        if (selectedSampleType && p.tipo_muestra !== selectedSampleType) return;
        if (selectedZone && p.macro_sector !== selectedZone) return;
        if (selectedCommunity && comm !== selectedCommunity) return;

        vis++;
        if (isTitular) tit++; else res++;

        const markerColor = isTitular ? '#10b981' : '#ea580c';

        const marker = L.circleMarker(latLng, {
          radius: isTitular ? 4.5 : 4.0,
          fillColor: markerColor,
          color: '#ffffff',
          weight: 1,
          opacity: 0.95,
          fillOpacity: 0.85
        });

        const antroUrl = `https://ee.kobotoolbox.org/XnLSvL66?d[id_vivienda]=${encodeURIComponent(houseId)}&d[comunidad]=${encodeURIComponent(comm)}`;
        const hogarUrl = `https://ee.kobotoolbox.org/rrNpxrAR?d[id_vivienda]=${encodeURIComponent(houseId)}&d[comunidad]=${encodeURIComponent(comm)}`;

        marker.bindPopup(`
          <div style="font-size:12px;min-width:230px;line-height:1.4;">
            <div style="font-weight:bold;font-size:13px;color:#1F1F1F;margin-bottom:3px;">
              🏠 Vivienda: ${houseId}
            </div>
            <div style="margin-bottom:5px;">
              <span style="background:${isTitular ? '#d1fae5' : '#ffedd5'};color:${isTitular ? '#065f46' : '#9a3412'};padding:2px 6px;border-radius:4px;font-size:10px;font-weight:bold;">
                ${isTitular ? '🟢 TITULAR (4.370)' : '🟠 RESERVA (1.116)'}
              </span>
            </div>
            <div style="color:#64748B;font-size:11px;margin-bottom:6px;">
              Comunidad: <strong>${comm || 'San Andrés'}</strong><br>
              Sector: <strong>${p.macro_sector || 'Sector A'}</strong> | Dupla: <strong>${p.dupla || 'D01'}</strong>
            </div>
            <div style="display:flex;flex-direction:column;gap:3px;">
              <a href="${antroUrl}" target="_blank" rel="noopener noreferrer" style="background:#10b981;color:white;padding:4px 8px;border-radius:4px;text-align:center;font-weight:bold;text-decoration:none;font-size:11px;">
                Ficha Antropométrica (Niños 0-59m)
              </a>
              <a href="${hogarUrl}" target="_blank" rel="noopener noreferrer" style="background:#E8734A;color:white;padding:4px 8px;border-radius:4px;text-align:center;font-weight:bold;text-decoration:none;font-size:11px;">
                Caracterización del Hogar
              </a>
            </div>
          </div>
        `);

        marker.addTo(housesLayer);
      });

      setStats({
        visible: vis,
        titulares: tit,
        reserva: res,
        kobo: kob
      });
    }
  };

  const resetFilters = () => {
    setSelectedZone('');
    setSelectedCommunity('');
    setSelectedSampleType('');
    setSelectedStatus('');
    setShowTitular(true);
    setShowReserva(true);
  };

  return (
    <div className="space-y-4">
      {/* Cabecera WebGIS Oficial */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold text-[#1F1F1F] tracking-tight">
              Web GIS Oficial — San Andrés
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[11px] font-bold">
              5.486 Viviendas Dasimétricas
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
              45 Asentamientos PDOT
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
              3 Macro-Sectores Operativos
            </span>
          </div>
          <p className="text-xs text-[#444746] mt-1">
            Cartografía Operativa Oficial: Delimitación Parroquial, Macro-Sectores A/B/C y Enlaces a Formularios KoBoToolbox
          </p>
        </div>

        {/* Selector de Territorio */}
        <div className="flex bg-[#F0F4F9] p-1 rounded-xl border border-[#E0E2EC] text-xs font-semibold">
          <button className="px-3 py-1.5 rounded-lg btn-primary shadow-sm">
            San Andrés (Activo)
          </button>
          <button className="px-3 py-1.5 rounded-lg text-[#444746] hover:text-[#1F1F1F]">
            Manglaralto (Planificación)
          </button>
        </div>
      </div>

      {/* Barra de Filtros en 4 Niveles */}
      <div className="bg-white p-4 rounded-2xl border border-[#E0E2EC] shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Macro-Sector */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#747775] mb-1">
              Macro-Sector Operativo
            </label>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8F9FA] border border-[#DADCE0] rounded-lg text-xs text-[#1F1F1F] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#E8734A]"
            >
              <option value="">Todos los Macro-Sectores</option>
              <option value="Sector A">Sector A: Cabecera Urbana y Bajas (221 niños)</option>
              <option value="Sector B">Sector B: Panamericana y Media (230 niños)</option>
              <option value="Sector C">Sector C: Comunidades Altas y Páramo (196 niños)</option>
            </select>
          </div>

          {/* Asentamiento PDOT */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#747775] mb-1">
              Asentamiento PDOT (45)
            </label>
            <select
              value={selectedCommunity}
              onChange={(e) => setSelectedCommunity(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8F9FA] border border-[#DADCE0] rounded-lg text-xs text-[#1F1F1F] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#E8734A]"
            >
              <option value="">Todos los 45 Asentamientos</option>
              {communitiesList.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Tipo de Muestra */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#747775] mb-1">
              Tipo de Muestra
            </label>
            <select
              value={selectedSampleType}
              onChange={(e) => setSelectedSampleType(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8F9FA] border border-[#DADCE0] rounded-lg text-xs text-[#1F1F1F] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#E8734A]"
            >
              <option value="">Todas las Viviendas (5.486)</option>
              <option value="titular">Muestra Titular (4.370)</option>
              <option value="reserva">Muestra Reserva (1.116)</option>
            </select>
          </div>

          {/* Estado de Visita */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#747775] mb-1">
              Estado de Visita KoBo
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8F9FA] border border-[#DADCE0] rounded-lg text-xs text-[#1F1F1F] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#E8734A]"
            >
              <option value="">Todos los Estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="completada">Completada</option>
            </select>
          </div>

          {/* Mapa Base */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#747775] mb-1">
              Mapa Base
            </label>
            <select
              value={selectedBaseMap}
              onChange={(e) => setSelectedBaseMap(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8F9FA] border border-[#DADCE0] rounded-lg text-xs text-[#1F1F1F] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#E8734A]"
            >
              <option value="satellite">Satélite Esri World</option>
              <option value="cartoLight">Carto Light (Google Style)</option>
              <option value="osm">OpenStreetMap</option>
            </select>
          </div>
        </div>

        {/* Contadores y Botón de Restablecer */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-[#E0E2EC] text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#1F1F1F]">
              🏠 {stats.visible.toLocaleString()} <span className="font-normal text-[#747775]">Visibles</span>
            </span>
            <span className="font-bold text-emerald-700">
              🟢 {stats.titulares.toLocaleString()} <span className="font-normal text-[#747775]">Titulares</span>
            </span>
            <span className="font-bold text-amber-700">
              🟠 {stats.reserva.toLocaleString()} <span className="font-normal text-[#747775]">Reserva</span>
            </span>
            <span className="font-bold text-blue-700">
              ☑️ {stats.kobo} <span className="font-normal text-[#747775]">En KoBo</span>
            </span>
          </div>

          <button
            onClick={resetFilters}
            className="btn-secondary rounded-lg text-xs flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer Filtros</span>
          </button>
        </div>

        {/* Checkboxes de Capas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-700">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-500 uppercase">Viviendas:</span>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={showTitular}
                onChange={(e) => setShowTitular(e.target.checked)}
                className="w-3.5 h-3.5 text-emerald-600 rounded"
              />
              <span>🟢 Titulares (4.370)</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={showReserva}
                onChange={(e) => setShowReserva(e.target.checked)}
                className="w-3.5 h-3.5 text-orange-600 rounded"
              />
              <span>🟠 Reserva (1.116)</span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-500 uppercase">Zonificación:</span>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={showBoundary}
                onChange={(e) => setShowBoundary(e.target.checked)}
                className="w-3.5 h-3.5 text-[#E8734A] rounded"
              />
              <span>Límite Parroquia</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={showZones}
                onChange={(e) => setShowZones(e.target.checked)}
                className="w-3.5 h-3.5 text-blue-600 rounded"
              />
              <span>Sectores A/B/C</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={showRings}
                onChange={(e) => setShowRings(e.target.checked)}
                className="w-3.5 h-3.5 text-amber-600 rounded"
              />
              <span>Radios</span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-500 uppercase">Infraestructura:</span>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={showCommunities}
                onChange={(e) => setShowCommunities(e.target.checked)}
                className="w-3.5 h-3.5 text-blue-600 rounded"
              />
              <span>45 Asentamientos</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={showPois}
                onChange={(e) => setShowPois(e.target.checked)}
                className="w-3.5 h-3.5 text-rose-600 rounded"
              />
              <span>Salud / Escuelas</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={showRoads}
                onChange={(e) => setShowRoads(e.target.checked)}
                className="w-3.5 h-3.5 text-slate-600 rounded"
              />
              <span>Red Vial</span>
            </label>
          </div>
        </div>
      </div>

      {/* Contenedor del Mapa Leaflet */}
      <div className="relative w-full h-[620px] rounded-2xl overflow-hidden border border-slate-200 shadow-md">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Panel Flotante de Simbología */}
        <div className="absolute top-4 right-4 z-20 w-64 bg-white/95 backdrop-blur-sm rounded-xl border border-slate-200 shadow-lg p-3 text-xs">
          <div 
            className="flex items-center justify-between cursor-pointer font-bold text-slate-900 mb-1"
            onClick={() => setShowLegend(!showLegend)}
          >
            <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Layers className="w-3.5 h-3.5 text-[#002B49]" />
              Simbología Cartográfica
            </span>
            {showLegend ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>

          {showLegend && (
            <div className="space-y-2.5 pt-2 border-t border-slate-100 text-[11px] leading-tight">
              <div>
                <strong className="text-slate-500 uppercase text-[10px] block mb-1">Viviendas Dasimétricas:</strong>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-3 h-3 rounded-full bg-[#10b981] inline-block shrink-0"></span>
                  <span>Muestra Titular (4.370)</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-3 h-3 rounded-full bg-[#ea580c] inline-block shrink-0"></span>
                  <span>Muestra Reserva (1.116)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#3b82f6] inline-block shrink-0"></span>
                  <span>Completada en KoBo</span>
                </div>
              </div>

              <div>
                <strong className="text-slate-500 uppercase text-[10px] block mb-1">Macro-Sectores:</strong>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-3 h-3 rounded-full bg-blue-600 inline-block shrink-0"></span>
                  <span>Sector A: Cabecera Urbana</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block shrink-0"></span>
                  <span>Sector B: Panamericana</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-600 inline-block shrink-0"></span>
                  <span>Sector C: Comunidades Altas</span>
                </div>
              </div>

              <div>
                <strong className="text-slate-500 uppercase text-[10px] block mb-1">Equipamiento:</strong>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-3 h-3 rounded-full bg-red-500 inline-block shrink-0"></span>
                  <span>Centro / Puestos de Salud</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500 inline-block shrink-0"></span>
                  <span>Escuelas (Calibración TEM)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
