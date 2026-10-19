import React, { useState } from 'react';
import { 
  Users, 
  MapPin, 
  Scale, 
  ExternalLink, 
  Phone, 
  QrCode, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet,
  X
} from 'lucide-react';
import QRCode from 'qrcode';

export function StudentPortalView({ user, onNavigate }) {
  const dupla = user?.dupla || 'D01';
  const sector = user?.sector || 'Sector A';
  const meta = user?.meta_encuestas || 18;
  const currentCompleted = 0; // En real mode

  // Calibración matutina SECA
  const today = new Date().toISOString().substring(0, 10);
  const [calibWeight, setCalibWeight] = useState('5.000');
  const [calibPassed, setCalibPassed] = useState(true);
  const [calibratedToday, setCalibratedToday] = useState(false);
  const [activeQrModal, setActiveQrModal] = useState(null); // 'hogar' | 'antro' | null
  const [qrDataUrl, setQrDataUrl] = useState('');

  const supervisorInfo = {
    name: 'ND. Verónica Carlina Delgado López',
    cargo: 'Docente Tutora / Supervisora Sector A (FSP - ESPOCH)',
    phone: '0994645682',
    whatsapp: '593994645682'
  };

  const handleCalibrate = () => {
    const val = parseFloat(calibWeight);
    const diff = Math.abs(val - 5.000);
    const passed = diff <= 0.050; // Tolerancia de 50g
    setCalibPassed(passed);
    setCalibratedToday(true);
  };

  const handleOpenQr = async (formType) => {
    const url = formType === 'hogar' 
      ? 'https://ee.kobotoolbox.org/rrNpxrAR' 
      : 'https://ee.kobotoolbox.org/XnLSvL66';
    const dataUrl = await QRCode.toDataURL(url, { width: 260, margin: 2 });
    setQrDataUrl(dataUrl);
    setActiveQrModal(formType);
  };

  return (
    <div className="space-y-6">
      {/* Banner de Bienvenida del Brigadista (Estilo Google Clean Canónico) */}
      <div className="bg-white p-6 rounded-2xl border-l-4 border-l-[#E8734A] border border-[#E0E2EC] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#E8734A] mb-1">
            <Users className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">BRIGADISTA ACREDITADO ESPOCH &bull; DUPLA {dupla}</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#1F1F1F]">
            ¡Hola, {user?.name || 'Estudiante Encuestador'}!
          </h2>
          <p className="text-xs text-[#747775] mt-0.5">
            Carrera de Nutrición y Dietética &bull; Operativo de Campo San Andrés (5 Jornadas de Lunes)
          </p>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-[#747775] block uppercase tracking-wider">Cédula Oficial</span>
          <span className="font-mono text-sm font-bold text-[#1F1F1F]">{user?.cedula || '060412389-1'}</span>
          <span className="text-xs font-semibold text-[#E8734A] block mt-0.5">Asignación: {sector}</span>
        </div>
      </div>

      {/* Grilla Operativa: Supervisor, Cuadrante y Meta */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Supervisor */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-[#E8734A] uppercase tracking-wider mb-2">
              Docente Supervisor Asignado
            </div>
            <h3 className="text-sm font-bold text-slate-900">{supervisorInfo.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{supervisorInfo.cargo}</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
            <a
              href={`https://wa.me/${supervisorInfo.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded text-center transition-all shadow-sm"
            >
              WhatsApp Directo
            </a>
            <a
              href={`tel:${supervisorInfo.phone}`}
              className="py-1.5 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded flex items-center gap-1 transition-all"
            >
              <Phone className="w-3.5 h-3.5" />
              Llamar
            </a>
          </div>
        </div>

        {/* Cuadrante */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-[#002B49] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              Cuadrante Asignado
            </div>
            <h3 className="text-sm font-bold text-slate-900">Sector A - Cabecera y Bajas</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              45 Asentamientos Humanos Oficiales PDOT Guano (5.486 techos dasimétricos).
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => onNavigate('gis')}
              className="w-full py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded transition-all text-center"
            >
              Abrir Mapa GIS de Mi Cuadrante
            </button>
          </div>
        </div>

        {/* Meta Dupla */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Meta Operativa de la Dupla
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {currentCompleted} <span className="text-sm font-semibold text-slate-400">/ {meta} niños</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Barrido de ~4 a 5 infantes por cada una de las 5 jornadas de lunes
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-emerald-600 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(100, (currentCompleted / meta) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Protocolo de Calibración SECA 874 / 417 */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#002B49]" />
            <h3 className="text-sm font-bold text-slate-900">
              Protocolo Diario de Calibración Matutina SECA 874 / 417
            </h3>
          </div>
          {calibratedToday ? (
            calibPassed ? (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Calibrado Hoy (Apto para Campo)
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Equipo Bloqueado (&gt;50g Diferencia)
              </span>
            )
          ) : (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
              Pendiente de Calibración
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex-1 text-xs text-slate-600">
            Coloque la pesa patrón de 5.000 kg en la balanza SECA 874 y digite el valor exacto registrado:
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.001"
              value={calibWeight}
              onChange={(e) => setCalibWeight(e.target.value)}
              className="w-28 px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-mono font-bold text-center bg-white"
            />
            <span className="text-xs font-bold text-slate-500">kg</span>
            <button
              onClick={handleCalibrate}
              className="btn btn-primary rounded-lg text-xs"
            >
              Registrar Calibración
            </button>
          </div>
        </div>
      </div>

      {/* Acceso a Formularios Oficiales KoBoCollect */}
      <div className="bg-white p-6 rounded-xl border border-[#E0E2EC] shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-[#002B49]" />
          Instrumentos Oficiales KoBoCollect para la Dupla {dupla}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Formulario 1 */}
          <div className="p-4 rounded-xl border border-[#E0E2EC] bg-[#F8F9FA] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#747775] block">Instrumento 1</span>
              <strong className="text-xs text-[#1F1F1F] block mt-0.5">Caracterización del Hogar y Familia</strong>
              <span className="text-[11px] text-[#747775]">Formulario Socioeconómico y Vivienda</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenQr('hogar')}
                className="btn btn-secondary p-2 rounded-lg"
                title="Generar Código QR"
              >
                <QrCode className="w-4 h-4 text-[#444746]" />
              </button>
              <a
                href="https://ee.kobotoolbox.org/rrNpxrAR"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary rounded-lg text-xs flex items-center gap-1 shadow-sm"
              >
                <span>Enketo Web</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Formulario 2 */}
          <div className="p-4 rounded-xl border border-[#E0E2EC] bg-[#F8F9FA] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#747775] block">Instrumento 2</span>
              <strong className="text-xs text-[#1F1F1F] block mt-0.5">Antropometría y Bioética (CEISH)</strong>
              <span className="text-[11px] text-[#747775]">Medición de Peso, Talla y Consentimiento</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenQr('antro')}
                className="btn btn-secondary p-2 rounded-lg"
                title="Generar Código QR"
              >
                <QrCode className="w-4 h-4 text-[#444746]" />
              </button>
              <a
                href="https://ee.kobotoolbox.org/XnLSvL66"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary rounded-lg text-xs flex items-center gap-1 shadow-sm"
              >
                <span>Enketo Web</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Modal QR Descargable */}
      {activeQrModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-sm text-slate-900">
                Código QR — {activeQrModal === 'hogar' ? 'Instrumento 1: Hogar' : 'Instrumento 2: Antropometría'}
              </h4>
              <button onClick={() => setActiveQrModal(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            {qrDataUrl && (
              <img src={qrDataUrl} alt="QR Formulario" className="w-56 h-56 mx-auto border border-slate-200 rounded-xl p-2 mb-4" />
            )}
            <p className="text-xs text-slate-500 mb-4">
              Escanee con la cámara de la tableta o la app KoBoCollect para abrir el formulario oficial en campo.
            </p>
            <a
              href={qrDataUrl}
              download={`QR_${activeQrModal}_San_Andres.png`}
              className="btn btn-primary w-full py-2.5 text-white text-xs font-bold rounded-xl transition-all block text-center shadow-sm"
            >
              Descargar Imagen QR (PNG)
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
