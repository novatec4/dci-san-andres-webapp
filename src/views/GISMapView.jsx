import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Layers, Filter, Compass, ZoomIn, ZoomOut } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export function GISMapView() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [activeLayer, setActiveLayer] = useState('all');

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Coordenadas centrales de San Andrés, Guano, Chimborazo
      const map = L.map(mapContainerRef.current, {
        center: [-1.5833, -78.7167],
        zoom: 13,
        zoomControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      // Control de zoom en esquina superior derecha
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Puntos de comunidades oficiales
      const communities = [
        { name: 'San Andrés Centro', lat: -1.5833, lng: -78.7167, sector: 'Sector A', children: 85 },
        { name: 'Pulinguí', lat: -1.5321, lng: -78.7543, sector: 'Sector C', children: 68 },
        { name: 'Trencilla', lat: -1.5642, lng: -78.6987, sector: 'Sector B', children: 45 },
        { name: 'Gualiqueme', lat: -1.5789, lng: -78.6854, sector: 'Sector B', children: 52 },
        { name: 'San Pablo', lat: -1.5954, lng: -78.7231, sector: 'Sector A', children: 40 },
        { name: 'Los Pinos', lat: -1.6021, lng: -78.7098, sector: 'Sector A', children: 36 },
        { name: 'Batzacón', lat: -1.5512, lng: -78.6743, sector: 'Sector B', children: 48 },
        { name: 'Calshi', lat: -1.5123, lng: -78.7654, sector: 'Sector C', children: 39 }
      ];

      communities.forEach(c => {
        const markerColor = c.sector === 'Sector A' ? '#002B49' : (c.sector === 'Sector B' ? '#10B981' : '#E8734A');
        
        const circle = L.circleMarker([c.lat, c.lng], {
          radius: 8,
          fillColor: markerColor,
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9
        }).addTo(map);

        circle.bindPopup(`
          <div style="font-family:Inter,sans-serif;font-size:12px;padding:4px;">
            <strong style="color:#002B49;font-size:13px;display:block;margin-bottom:2px;">${c.name}</strong>
            <span style="color:#64748b;display:block;">${c.sector} • Asentamiento PDOT</span>
            <div style="margin-top:6px;padding-top:6px;border-top:1px solid #e2e8f0;font-weight:bold;color:#0f172a;">
              Meta censal: ${c.children} niños
            </div>
          </div>
        `);
      });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Controles de Capa */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#002B49]" />
            Visor Cartográfico San Andrés — PDOT 2023–2027
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            45 Asentamientos Humanos Oficiales • 5.486 Techos Dasimétricos K-NN
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-500">Filtrar Macro-Sector:</span>
          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveLayer('all')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                activeLayer === 'all' ? 'bg-[#E8734A] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos (45)
            </button>
            <button
              onClick={() => setActiveLayer('A')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                activeLayer === 'A' ? 'bg-blue-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sector A (16)
            </button>
            <button
              onClick={() => setActiveLayer('B')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                activeLayer === 'B' ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sector B (14)
            </button>
            <button
              onClick={() => setActiveLayer('C')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                activeLayer === 'C' ? 'bg-[#E8734A] text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sector C (15)
            </button>
          </div>
        </div>
      </div>

      {/* Mapa Leaflet */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
        <div ref={mapContainerRef} className="w-full h-[600px] z-10" />

        {/* Leyenda Cartográfica Flotante */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-3.5 rounded-xl border border-slate-200 shadow-lg text-xs z-20 max-w-xs space-y-1.5">
          <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">
            Estratificación de Campo:
          </span>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#002B49]" />
            <span className="text-slate-700">Sector A (Cabecera y Bajas - 221 niños)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#10B981]" />
            <span className="text-slate-700">Sector B (Panamericana y Media - 230 niños)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#E8734A]" />
            <span className="text-slate-700">Sector C (Altas y Páramo - 196 niños)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
