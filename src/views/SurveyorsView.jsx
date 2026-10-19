import React, { useState, useEffect } from 'react';
import { AuthStore, calculateAge } from '../services/authStore';
import { Users, Search, Download, Upload, Plus, QrCode, Edit2, Trash2, CheckCircle2, MapPin, Mail, Phone, LayoutGrid, Table, Calendar, HeartPulse, Languages } from 'lucide-react';

const INITIAL_SURVEYORS = [
  { id: 1, dupla: 'D01', name: 'BALSECA QUESADA DANIELA ALEJANDRA', cedula: '060412389-1', role: 'encuestador', roleLabel: 'Encuestador(a)', sector: 'Sector A', community: 'Barrio San Andrés Centro', email: 'daniela.balseca@espoch.edu.ec', phone: '0987654321', birthDate: '2003-08-22', bloodType: 'A+', kichwaLevel: 'Básico', emergencyContactName: 'Mgs. Elena Quesada (Madre)', emergencyContactPhone: '0995123456', status: 'activo', progress: '0 / 39 (0%)' },
  { id: 2, dupla: 'D01', name: 'APUNTE ALDAS FLORCITA ALEJANDRA', cedula: '025004123-4', role: 'encuestador', roleLabel: 'Encuestador(a)', sector: 'Sector A', community: 'Barrio San Andrés Centro', email: 'florcita.apunte@espoch.edu.ec', phone: '0991238945', birthDate: '2002-11-14', bloodType: 'O+', kichwaLevel: 'Intermedio', emergencyContactName: 'Carlos Apunte (Padre)', emergencyContactPhone: '0984561230', status: 'activo', progress: '0 / 39 (0%)' },
  { id: 3, dupla: 'D02', name: 'BASANTES BUENAÑO MILENA ABIGAIL', cedula: '060604567-8', role: 'supervisor', roleLabel: 'Supervisor(a)', sector: 'Sector A', community: 'Barrio San Andrés Centro', email: 'milena.basantes@espoch.edu.ec', phone: '0992345671', birthDate: '2001-04-19', bloodType: 'O+', kichwaLevel: 'Fluido / Nativo', emergencyContactName: 'Rosa Buenaño (Madre)', emergencyContactPhone: '0997891234', status: 'activo', progress: '0 / 39 (0%)' },
  { id: 4, dupla: 'D02', name: 'ASADOBAY ESCOBAR HEIDY ESTEFANIA', cedula: '060507890-1', role: 'encuestador', roleLabel: 'Encuestador(a)', sector: 'Sector A', community: 'Barrio San Andrés Centro', email: 'heidy.asadobay@espoch.edu.ec', phone: '0993456782', birthDate: '2003-01-30', bloodType: 'B+', kichwaLevel: 'Básico', emergencyContactName: 'Jorge Asadobay (Padre)', emergencyContactPhone: '0981239874', status: 'activo', progress: '0 / 39 (0%)' },
  { id: 5, dupla: 'D03', name: 'CACHIMUEL DIAS ANA BELEN', cedula: '100440123-9', role: 'supervisor', roleLabel: 'Supervisor(a)', sector: 'Sector A', community: 'Barrio San Andrés Centro', email: 'ana.cachimuel@espoch.edu.ec', phone: '0994567893', birthDate: '2000-09-05', bloodType: 'A+', kichwaLevel: 'Fluido / Nativo', emergencyContactName: 'Manuel Cachimuel (Padre)', emergencyContactPhone: '0996541238', status: 'activo', progress: '0 / 39 (0%)' },
  { id: 6, dupla: 'D03', name: 'AVELLAN ESTEVEZ DARIANA NOELIA', cedula: '131412345-6', role: 'encuestador', roleLabel: 'Encuestador(a)', sector: 'Sector A', community: 'Barrio San Andrés Centro', email: 'dariana.avellan@espoch.edu.ec', phone: '0995678904', birthDate: '2003-06-17', bloodType: 'O+', kichwaLevel: 'Ninguno', emergencyContactName: 'Patricia Estevez (Madre)', emergencyContactPhone: '0997896541', status: 'activo', progress: '0 / 39 (0%)' },
  { id: 7, dupla: 'D13', name: 'CUENCA MEDINA EDINSON VICENTE', cedula: '115056789-0', role: 'supervisor', roleLabel: 'Supervisor(a)', sector: 'Sector B', community: 'Trencilla', email: 'edinson.cuenca@espoch.edu.ec', phone: '0996789015', birthDate: '2001-02-11', bloodType: 'O+', kichwaLevel: 'Intermedio', emergencyContactName: 'Vicente Cuenca (Padre)', emergencyContactPhone: '0983216549', status: 'activo', progress: '0 / 39 (0%)' },
  { id: 8, dupla: 'D13', name: 'BALSECA SANTIANA ROSA ISABEL', cedula: '185005678-1', role: 'encuestador', roleLabel: 'Encuestador(a)', sector: 'Sector B', community: 'Trencilla', email: 'rosa.balseca@espoch.edu.ec', phone: '0997890126', birthDate: '2002-12-08', bloodType: 'AB+', kichwaLevel: 'Básico', emergencyContactName: 'Isabel Santiana (Madre)', emergencyContactPhone: '0998521473', status: 'activo', progress: '0 / 39 (0%)' },
  { id: 9, dupla: 'D25', name: 'CUICHAN ESPINOZA DANIELA NICOLE', cedula: '172667890-2', role: 'supervisor', roleLabel: 'Supervisor(a)', sector: 'Sector C', community: 'Pulinguí', email: 'daniela.cuichan@espoch.edu.ec', phone: '0998901237', birthDate: '2001-07-25', bloodType: 'A+', kichwaLevel: 'Fluido / Nativo', emergencyContactName: 'Luis Cuichan (Padre)', emergencyContactPhone: '0987412589', status: 'activo', progress: '0 / 39 (0%)' },
  { id: 10, dupla: 'D25', name: 'CADENA CAMPOVERDE STEPHANY NICOLE', cedula: '235093456-7', role: 'encuestador', roleLabel: 'Encuestador(a)', sector: 'Sector C', community: 'Pulinguí', email: 'stephany.cadena@espoch.edu.ec', phone: '0999012348', birthDate: '2003-03-14', bloodType: 'O+', kichwaLevel: 'Intermedio', emergencyContactName: 'Nicole Campoverde (Madre)', emergencyContactPhone: '0993698521', status: 'activo', progress: '0 / 39 (0%)' },
  { id: 11, dupla: 'D26', name: 'GONZALEZ RIVADENEIRA DANIELA DOMENICA', cedula: '140118901-3', role: 'supervisor', roleLabel: 'Supervisor(a)', sector: 'Sector C', community: 'Pulinguí', email: 'daniela.gonzalez@espoch.edu.ec', phone: '0990123459', birthDate: '2000-10-29', bloodType: 'B+', kichwaLevel: 'Fluido / Nativo', emergencyContactName: 'Dra. Carmen Rivadeneira (Madre)', emergencyContactPhone: '0981472583', status: 'activo', progress: '0 / 39 (0%)' },
  { id: 12, dupla: 'D26', name: 'DOMINGUEZ JIRON ANAHI DAYANARA', cedula: '060596789-4', role: 'encuestador', roleLabel: 'Encuestador(a)', sector: 'Sector C', community: 'Pulinguí', email: 'anahi.dominguez@espoch.edu.ec', phone: '0991234560', birthDate: '2003-05-02', bloodType: 'O+', kichwaLevel: 'Básico', emergencyContactName: 'Raúl Domínguez (Padre)', emergencyContactPhone: '0992581470', status: 'activo', progress: '0 / 39 (0%)' }
];

export function SurveyorsView() {
  const currentUser = AuthStore.getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';

  const [surveyors, setSurveyors] = useState(() => {
    try {
      const saved = localStorage.getItem('cgpi_surveyors_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(s => {
            const init = INITIAL_SURVEYORS.find(is => is.id === s.id);
            return init ? { ...init, ...s } : s;
          });
        }
      }
    } catch {}
    return INITIAL_SURVEYORS;
  });

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [editingBrig, setEditingBrig] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    cedula: '',
    dupla: 'D01',
    role: 'encuestador',
    sector: 'Sector A',
    community: 'San Andrés Centro',
    email: '',
    phone: '',
    birthDate: '',
    bloodType: 'O+',
    kichwaLevel: 'Básico',
    emergencyContactName: '',
    emergencyContactPhone: '',
    status: 'activo'
  });

  useEffect(() => {
    try {
      localStorage.setItem('cgpi_surveyors_v3', JSON.stringify(surveyors));
    } catch {}
  }, [surveyors]);

  const filtered = surveyors.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = !q || 
      s.name.toLowerCase().includes(q) || 
      s.cedula.includes(q) || 
      s.dupla.toLowerCase().includes(q) || 
      (s.email && s.email.toLowerCase().includes(q)) ||
      (s.phone && s.phone.includes(q));
    const matchRole = !roleFilter || s.role === roleFilter;
    const matchSector = !sectorFilter || s.sector === sectorFilter;
    const matchStatus = !statusFilter || s.status === statusFilter;
    return matchSearch && matchRole && matchSector && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pagedList = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleStatusChange = (id, newStatus) => {
    setSurveyors(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const handleSaveBrigadista = (e) => {
    e.preventDefault();
    if (editingBrig) {
      setSurveyors(prev => prev.map(s => s.id === editingBrig.id ? { ...s, ...formData } : s));
    } else {
      const newB = {
        id: Date.now(),
        ...formData,
        roleLabel: formData.role === 'supervisor' ? 'Supervisor(a)' : 'Encuestador(a)',
        progress: '0 / 39 (0%)'
      };
      setSurveyors(prev => [newB, ...prev]);
    }
    setShowModal(false);
    setEditingBrig(null);
  };

  const openEdit = (b) => {
    setEditingBrig(b);
    setFormData({
      name: b.name || '',
      cedula: b.cedula || '',
      dupla: b.dupla || 'D01',
      role: b.role || 'encuestador',
      sector: b.sector || 'Sector A',
      community: b.community || 'San Andrés Centro',
      email: b.email || '',
      phone: b.phone || '',
      birthDate: b.birthDate || '',
      bloodType: b.bloodType || 'O+',
      kichwaLevel: b.kichwaLevel || 'Básico',
      emergencyContactName: b.emergencyContactName || '',
      emergencyContactPhone: b.emergencyContactPhone || '',
      status: b.status || 'activo'
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('¿Está seguro de eliminar este registro del padrón?')) {
      setSurveyors(prev => prev.filter(s => s.id !== id));
    }
  };

  const exportCSV = () => {
    const headers = 'ID,Dupla,Nombre,Cedula,Rol,Sector,Comunidad,Email,Telefono,Estado\n';
    const rows = surveyors.map(s => `"${s.id}","${s.dupla}","${s.name}","${s.cedula}","${s.role}","${s.sector}","${s.community}","${s.email}","${s.phone}","${s.status}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `padron_brigadistas_san_andres_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#002B49]" />
            <h1 className="text-xl font-bold text-[#1F1F1F] tracking-tight">
              Gestión de Equipo y Personal
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Control y seguimiento operativo de brigadistas, nutricionistas, promotores y supervisores
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={exportCSV}
            className="btn-secondary rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-[#002B49]" />
            <span>Exportar Planilla (CSV)</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => {
                setEditingBrig(null);
                setFormData({
                  name: '',
                  cedula: '',
                  dupla: 'D01',
                  role: 'encuestador',
                  sector: 'Sector A',
                  community: 'San Andrés Centro',
                  email: '',
                  phone: '',
                  birthDate: '',
                  bloodType: 'O+',
                  kichwaLevel: 'Básico',
                  emergencyContactName: '',
                  emergencyContactPhone: '',
                  status: 'activo'
                });
                setShowModal(true);
              }}
              className="btn-primary rounded-full text-xs font-semibold shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nuevo Integrante</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 KPIs de Equipo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-full bg-orange-100 text-[#E8734A]">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-[#1F1F1F]">73</div>
            <div className="text-xs text-slate-500">Total Personal Registrado</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-blue-600">0</div>
            <div className="text-xs text-slate-500">Desplegados en Campo Hoy</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-full bg-emerald-100 text-emerald-600">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-emerald-600">38</div>
            <div className="text-xs text-slate-500">Encuestadores &amp; Nutricionistas</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-purple-600">0</div>
            <div className="text-xs text-slate-500">Vigilantes / Promotores (C2)</div>
          </div>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Buscar por nombre, cédula o teléfono..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#002B49]"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:bg-white focus:outline-none"
        >
          <option value="">Todos los Roles</option>
          <option value="encuestador">Encuestador(a)</option>
          <option value="supervisor">Supervisor(a)</option>
          <option value="nutricionista">Nutricionista</option>
        </select>

        <select
          value={sectorFilter}
          onChange={(e) => { setSectorFilter(e.target.value); setCurrentPage(1); }}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:bg-white focus:outline-none"
        >
          <option value="">Todas las Zonas</option>
          <option value="Sector A">Sector A</option>
          <option value="Sector B">Sector B</option>
          <option value="Sector C">Sector C</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:bg-white focus:outline-none"
        >
          <option value="">Todos los Estados</option>
          <option value="activo">Activo</option>
          <option value="pausa">En pausa</option>
        </select>

        {/* Selector de Vista (Tarjetas vs Tabla) */}
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setViewMode('cards')}
            className={`p-1.5 rounded ${viewMode === 'cards' ? 'bg-white text-[#002B49] shadow-sm' : 'text-slate-500'}`}
            title="Vista de Tarjetas"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-white text-[#002B49] shadow-sm' : 'text-slate-500'}`}
            title="Vista de Tabla"
          >
            <Table className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-1 text-xs text-slate-500">
          <span>Mostrar:</span>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
            className="px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700"
          >
            <option value="12">12 por pág</option>
            <option value="20">20 por pág</option>
            <option value="50">50 por pág</option>
          </select>
        </div>
      </div>

      {/* Renderizado de Tarjetas */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pagedList.map(b => {
            const initials = b.name.split(' ').map(w => w[0]).join('').substring(0, 2);
            const isSup = b.role === 'supervisor';
            const avatarBg = isSup ? 'bg-blue-600' : 'bg-[#E8734A]';

            return (
              <div key={b.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition-all">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-full ${avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                        {initials}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-xs leading-tight line-clamp-1">{b.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">CI: {b.cedula}</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                      {b.status === 'activo' ? 'Activo' : b.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-[11px] text-slate-600 mb-3">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isSup ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'}`}>
                        {isSup ? 'Supervisor(a)' : 'Encuestador(a)'} • {b.dupla}
                      </span>
                      {b.bloodType && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
                          {b.bloodType}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[11px] pt-0.5">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-semibold text-[#1F1F1F]">
                          {calculateAge(b.birthDate) !== null ? `${calculateAge(b.birthDate)} años` : 'Edad no reg.'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        Kichwa: <strong className="text-slate-700">{b.kichwaLevel || 'Básico'}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="truncate">{b.community} ({b.sector})</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <a href={`tel:${b.phone}`} className="hover:text-emerald-700 font-mono text-[11px] font-medium text-slate-800">
                        {b.phone || 'Sin celular'}
                      </a>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate font-mono text-[10px]">{b.email}</span>
                    </div>
                  </div>

                  {/* Barra de Avance */}
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-3">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-500">Avance de Levantamiento:</span>
                      <strong className="text-slate-800">{b.progress}</strong>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#E8734A] h-full rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Footer de Tarjeta con Controles */}
                <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
                  <select
                    value={b.status}
                    onChange={(e) => handleStatusChange(b.id, e.target.value)}
                    className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-700"
                  >
                    <option value="activo">Activo</option>
                    <option value="pausa">En pausa</option>
                  </select>

                  <div className="flex items-center gap-1">
                    <button
                      className="px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-[11px] font-semibold text-slate-700 flex items-center gap-1"
                      title="Ver Credencial QR"
                    >
                      <QrCode className="w-3 h-3 text-blue-600" />
                      <span>QR</span>
                    </button>
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => openEdit(b)}
                          className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded"
                          title="Editar brigadista"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Vista de Tabla */
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9FA] text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Dupla</th>
                <th className="py-3 px-4">Nombre Completo</th>
                <th className="py-3 px-4">Cédula &amp; Edad</th>
                <th className="py-3 px-4">Rol &amp; Kichwa</th>
                <th className="py-3 px-4">Contacto Directo</th>
                <th className="py-3 px-4">Sector / Comunidad</th>
                <th className="py-3 px-4">Estado</th>
                {isAdmin && <th className="py-3 px-4 text-right">Acciones</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pagedList.map(b => {
                const bAge = calculateAge(b.birthDate);
                return (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-4 font-mono font-bold text-[#002B49]">{b.dupla}</td>
                    <td className="py-2.5 px-4 font-bold text-slate-900">{b.name}</td>
                    <td className="py-2.5 px-4 text-slate-600">
                      <div className="font-mono text-slate-500">{b.cedula}</div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="font-semibold text-[#1F1F1F]">
                          {bAge !== null ? `${bAge} años` : '--'}
                        </span>
                        {b.bloodType && (
                          <span className="px-1 py-0.2 rounded text-[9px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
                            {b.bloodType}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-slate-700">
                      <div className="font-medium">{b.roleLabel}</div>
                      <div className="text-[10px] text-slate-400">
                        Kichwa: <strong className="text-slate-600">{b.kichwaLevel || 'Básico'}</strong>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-slate-600">
                      <div className="flex items-center gap-1 font-mono text-[11px] font-medium text-emerald-700">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <a href={`tel:${b.phone}`} className="hover:underline">{b.phone || 'Sin celular'}</a>
                      </div>
                      <div className="font-mono text-[10px] text-slate-400 truncate max-w-[150px]">{b.email}</div>
                    </td>
                    <td className="py-2.5 px-4 text-slate-600">{b.community} ({b.sector})</td>
                    <td className="py-2.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {b.status}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="py-2.5 px-4 text-right">
                        <button
                          onClick={() => openEdit(b)}
                          className="p-1.5 text-slate-500 hover:text-[#E8734A] hover:bg-orange-50 rounded-lg transition-all"
                          title="Editar brigadista"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginación */}
      <div className="px-4 py-3 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between text-xs text-slate-600">
        <span>
          Mostrando <strong>{(currentPage - 1) * pageSize + 1}</strong> - <strong>{Math.min(currentPage * pageSize, filtered.length)}</strong> de <strong>{filtered.length}</strong> integrantes
        </span>
        <div className="flex items-center gap-1.5">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className="px-3 py-1 bg-white border border-slate-200 rounded-lg disabled:opacity-40 font-semibold"
          >
            ← Anterior
          </button>
          <span className="px-2 font-semibold">Página {currentPage} de {totalPages}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            className="px-3 py-1 bg-white border border-slate-200 rounded-lg disabled:opacity-40 font-semibold"
          >
            Siguiente →
          </button>
        </div>
      </div>

      {/* Modal Nuevo / Editar Brigadista */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-[#1F1F1F] flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-[#E8734A]" />
              <span>{editingBrig ? 'Editar Brigadista Oficial' : 'Registrar Nuevo Brigadista ESPOCH'}</span>
            </h3>
            <form onSubmit={handleSaveBrigadista} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
                  placeholder="ej: MARÍA BELÉN LÓPEZ MORALES"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#E8734A] focus:ring-1 focus:ring-[#E8734A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Cédula</label>
                  <input
                    type="text"
                    required
                    value={formData.cedula}
                    onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                    placeholder="060123456-7"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#E8734A] focus:ring-1 focus:ring-[#E8734A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Dupla Asignada</label>
                  <select
                    value={formData.dupla}
                    onChange={(e) => setFormData({ ...formData, dupla: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#E8734A]"
                  >
                    {Array.from({ length: 36 }, (_, i) => `D${String(i + 1).padStart(2, '0')}`).map(d => (
                      <option key={d} value={d}>Dupla {d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Fecha de Nacimiento con Cálculo Dinámico de Edad */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">Fecha de Nacimiento</label>
                    {calculateAge(formData.birthDate) !== null && (
                      <span className="text-[10px] font-bold text-[#E8734A] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                        🎂 {calculateAge(formData.birthDate)} años
                      </span>
                    )}
                  </div>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#E8734A] focus:ring-1 focus:ring-[#E8734A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfono Celular / WhatsApp</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="ej: 0998234512"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#E8734A] focus:ring-1 focus:ring-[#E8734A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Institucional</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="estudiante@espoch.edu.ec"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#E8734A] focus:ring-1 focus:ring-[#E8734A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Sector Operativo</label>
                  <select
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#E8734A]"
                  >
                    <option value="Sector A">Sector A (Cabecera y Bajas)</option>
                    <option value="Sector B">Sector B (Panamericana y Media)</option>
                    <option value="Sector C">Sector C (Altas y Páramo)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rol Operativo</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#E8734A]"
                  >
                    <option value="encuestador">Encuestador(a)</option>
                    <option value="supervisor">Supervisor(a)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo de Sangre</label>
                  <select
                    value={formData.bloodType}
                    onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-bold focus:outline-none focus:border-[#E8734A]"
                  >
                    <option value="O+">O+</option>
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="AB+">AB+</option>
                    <option value="O-">O-</option>
                    <option value="A-">A-</option>
                    <option value="B-">B-</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Dominio Kichwa</label>
                  <select
                    value={formData.kichwaLevel}
                    onChange={(e) => setFormData({ ...formData, kichwaLevel: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#E8734A]"
                  >
                    <option value="Ninguno">Ninguno</option>
                    <option value="Básico">Básico</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Fluido / Nativo">Fluido / Nativo</option>
                  </select>
                </div>
              </div>

              {/* Contacto de Emergencia */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contacto de Emergencia</label>
                  <input
                    type="text"
                    value={formData.emergencyContactName}
                    onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                    placeholder="ej: Rosa Morales (Madre)"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#E8734A] focus:ring-1 focus:ring-[#E8734A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfono de Emergencia</label>
                  <input
                    type="tel"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                    placeholder="ej: 0991234567"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#E8734A] focus:ring-1 focus:ring-[#E8734A]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E0E2EC]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary rounded-full text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary rounded-full text-xs shadow-sm"
                >
                  {editingBrig ? 'Guardar Cambios' : 'Registrar Brigadista'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
