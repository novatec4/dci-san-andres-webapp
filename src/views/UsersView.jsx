import React, { useState } from 'react';
import { AuthStore, calculateAge } from '../services/authStore';
import { Users, UserCheck, Shield, MapPin, Search, Plus, Edit2, X, Check, Phone, Calendar, HeartPulse, Languages } from 'lucide-react';

export default function UsersView() {
  const [users, setUsers] = useState(AuthStore.getUsers());
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Formulario nuevo / edición
  const [formData, setFormData] = useState({
    name: '',
    cedula: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: 'Femenino',
    bloodType: 'O+',
    kichwaLevel: 'Ninguno',
    emergencyContactName: '',
    emergencyContactPhone: '',
    password: '',
    role: 'encuestador',
    roleLabel: 'Brigadista Acreditada ESPOCH',
    organization: 'Carrera de Nutrición y Dietética (FSP)',
    territory: 'Sector A - Cabecera y Bajas',
    status: 'activo'
  });

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchQ = !q || 
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.cedula && u.cedula.includes(q)) ||
      (u.phone && u.phone.includes(q)) ||
      (u.id && u.id.toLowerCase().includes(q));
    const matchRole = !roleFilter || u.role === roleFilter;
    const matchStatus = !statusFilter || u.status === statusFilter;
    return matchQ && matchRole && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pagedUsers = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const activeCount = users.filter(u => u.status === 'activo').length;

  const handleSave = (e) => {
    e.preventDefault();
    if (editingUser) {
      AuthStore.updateUser(editingUser.id, {
        name: formData.name,
        cedula: formData.cedula,
        email: formData.email,
        phone: formData.phone,
        birthDate: formData.birthDate,
        gender: formData.gender,
        bloodType: formData.bloodType,
        kichwaLevel: formData.kichwaLevel,
        emergencyContactName: formData.emergencyContactName,
        emergencyContactPhone: formData.emergencyContactPhone,
        role: formData.role,
        roleLabel: formData.roleLabel,
        organization: formData.organization,
        territory: formData.territory,
        status: formData.status,
        ...(formData.password ? { passwordHash: formData.password } : {})
      });
    } else {
      AuthStore.addUser({
        name: formData.name,
        cedula: formData.cedula,
        email: formData.email,
        phone: formData.phone,
        birthDate: formData.birthDate,
        gender: formData.gender,
        bloodType: formData.bloodType,
        kichwaLevel: formData.kichwaLevel,
        emergencyContactName: formData.emergencyContactName,
        emergencyContactPhone: formData.emergencyContactPhone,
        passwordHash: formData.password || 'Dci2026*',
        role: formData.role,
        roleLabel: formData.roleLabel,
        organization: formData.organization,
        territory: formData.territory,
        status: formData.status
      });
    }
    setUsers(AuthStore.getUsers());
    setShowAddModal(false);
    setEditingUser(null);
  };

  const openEdit = (u) => {
    setEditingUser(u);
    setFormData({
      name: u.name || '',
      cedula: u.cedula || '',
      email: u.email || '',
      phone: u.phone || '',
      birthDate: u.birthDate || '',
      gender: u.gender || 'Femenino',
      bloodType: u.bloodType || 'O+',
      kichwaLevel: u.kichwaLevel || 'Ninguno',
      emergencyContactName: u.emergencyContactName || '',
      emergencyContactPhone: u.emergencyContactPhone || '',
      password: '',
      role: u.role || 'encuestador',
      roleLabel: u.roleLabel || '',
      organization: u.organization || '',
      territory: u.territory || '',
      status: u.status || 'activo'
    });
    setShowAddModal(true);
  };

  const roleBadges = {
    admin: { label: 'Administrador', bg: 'bg-rose-100', text: 'text-rose-800' },
    supervisor: { label: 'Supervisor', bg: 'bg-blue-100', text: 'text-blue-800' },
    encuestador: { label: 'Encuestador', bg: 'bg-emerald-100', text: 'text-emerald-800' },
    nutricionista: { label: 'Nutricionista', bg: 'bg-purple-100', text: 'text-purple-800' },
    observador: { label: 'Observador', bg: 'bg-slate-100', text: 'text-slate-800' }
  };

  const avatarColors = {
    admin: 'bg-[#E8734A]',
    supervisor: 'bg-blue-600',
    encuestador: 'bg-emerald-600',
    nutricionista: 'bg-purple-600',
    observador: 'bg-slate-600'
  };

  return (
    <div className="space-y-5">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#002B49]" />
            <h1 className="text-xl font-bold text-[#1F1F1F] tracking-tight">
              Administración de Usuarios
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Control de accesos, credenciales, perfiles y asignación de roles institucionales
          </p>
        </div>

        <button
          onClick={() => {
            setEditingUser(null);
            setFormData({
              name: '',
              cedula: '',
              email: '',
              password: '',
              role: 'encuestador',
              roleLabel: 'Brigadista Acreditada ESPOCH',
              organization: 'Carrera de Nutrición y Dietética (FSP)',
              territory: 'Sector A - Cabecera y Bajas',
              status: 'activo'
            });
            setShowAddModal(true);
          }}
          className="btn-primary rounded-full text-xs font-semibold shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      {/* 4 KPIs de Administración */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-full bg-orange-100 text-[#E8734A]">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-[#1F1F1F]">{users.length}</div>
            <div className="text-xs text-slate-500">Usuarios Registrados</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-full bg-emerald-100 text-emerald-700">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-emerald-700">{activeCount}</div>
            <div className="text-xs text-slate-500">Cuentas Activas</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-full bg-rose-100 text-rose-600">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base font-extrabold text-[#1F1F1F]">San Andrés</div>
            <div className="text-xs text-slate-500">Zona Principal de Campo</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-full bg-blue-100 text-blue-700">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base font-extrabold text-[#1F1F1F]">RBAC 2.0</div>
            <div className="text-xs text-slate-500">Control de Seguridad</div>
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
            placeholder="Buscar por nombre, correo o ID..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#002B49]"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:bg-white focus:outline-none"
        >
          <option value="">Todos los roles</option>
          <option value="admin">Administrador</option>
          <option value="supervisor">Supervisor</option>
          <option value="encuestador">Encuestador</option>
          <option value="nutricionista">Nutricionista</option>
          <option value="observador">Observador</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:bg-white focus:outline-none"
        >
          <option value="">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>

        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span>Por página:</span>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
            className="px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      {/* Tabla de Usuarios */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9FA] text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Usuario</th>
                <th className="py-3 px-4">Contacto Directo</th>
                <th className="py-3 px-4">Edad &amp; Perfil Clínico</th>
                <th className="py-3 px-4">Rol Institucional</th>
                <th className="py-3 px-4">Organización / Zona</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pagedUsers.map(u => {
                const b = roleBadges[u.role] || roleBadges.encuestador;
                const col = avatarColors[u.role] || 'bg-slate-600';
                const userAge = calculateAge(u.birthDate);

                return (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${col} text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-sm`}>
                          {u.avatar || 'US'}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{u.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">CI: {u.cedula}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-[11px]">
                      <div className="font-mono text-[10px] text-[#002B49] font-medium">{u.email || '--'}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{u.phone || 'Sin registrar'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#1F1F1F]">
                          {userAge !== null ? `${userAge} años` : '--'}
                        </span>
                        {u.bloodType && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
                            {u.bloodType}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Kichwa: <strong className="text-slate-600 font-semibold">{u.kichwaLevel || 'Ninguno'}</strong>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${b.bg} ${b.text}`}>
                        {b.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-[11px]">
                      <div>{u.organization || 'Ayuda en Acción / ESPOCH'}</div>
                      <div className="text-[10px] text-slate-400">{u.territory || 'San Andrés'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.status === 'activo' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {u.status === 'activo' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => openEdit(u)}
                        className="p-1.5 text-slate-500 hover:text-[#E8734A] hover:bg-orange-50 rounded-lg transition-all"
                        title="Editar usuario"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="px-4 py-3 bg-[#F8F9FA] border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span>
            Mostrando <strong>{filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong> - <strong>{Math.min(currentPage * pageSize, filtered.length)}</strong> de <strong>{filtered.length}</strong> usuarios
          </span>

          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="px-3 py-1 bg-white border border-slate-200 rounded-lg disabled:opacity-40 text-xs font-semibold hover:bg-slate-50"
            >
              ← Anterior
            </button>
            <span className="px-2 font-semibold">Página {currentPage} de {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="px-3 py-1 bg-white border border-slate-200 rounded-lg disabled:opacity-40 text-xs font-semibold hover:bg-slate-50"
            >
              Siguiente →
            </button>
          </div>
        </div>
      </div>

      {/* Modal Nuevo / Editar Usuario */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-[#1F1F1F] flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#E8734A]" />
                <span>{editingUser ? 'Editar Perfil de Usuario' : 'Registrar Nuevo Usuario Oficial'}</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre y Apellidos</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="ej: María Belén López Morales"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#E8734A] focus:ring-1 focus:ring-[#E8734A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Cédula de Identidad</label>
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Institucional</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="usuario@espoch.edu.ec"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#E8734A] focus:ring-1 focus:ring-[#E8734A]"
                  />
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

              {/* Datos Médicos y Lingüísticos */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Género</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#E8734A]"
                  >
                    <option value="Femenino">Femenino</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Otro">Otro</option>
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
                    placeholder="ej: María Morales (Madre)"
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rol Institucional</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#E8734A]"
                  >
                    <option value="admin">Administrador</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="encuestador">Encuestador</option>
                    <option value="nutricionista">Nutricionista</option>
                    <option value="observador">Observador</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Estado</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#E8734A]"
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contraseña {editingUser && '(Dejar en blanco para no modificar)'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={editingUser ? '••••••••' : 'Dci2026*'}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#E8734A] focus:ring-1 focus:ring-[#E8734A]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E0E2EC]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary rounded-full text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary rounded-full text-xs shadow-sm"
                >
                  {editingUser ? 'Guardar Cambios' : 'Registrar Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
