import React, { useState } from 'react';
import { AuthStore, calculateAge } from '../services/authStore';
import { Mail, Lock, UserCheck, Shield, AlertCircle, ArrowRight, UserPlus, Phone, Calendar, HeartPulse } from 'lucide-react';

export function LoginView({ onLoginSuccess }) {
  const [tab, setTab] = useState('student'); // 'student' | 'admin'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Registro dinámico de estudiante
  const [regData, setRegData] = useState({
    name: '',
    cedula: '',
    codigo: '',
    email: '',
    phone: '',
    birthDate: '',
    bloodType: 'O+',
    kichwaLevel: 'Básico',
    emergencyContactPhone: '',
    dupla: 'D01'
  });
  const [regSuccess, setRegSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = AuthStore.login(identifier, password);
    setLoading(false);

    if (result.success) {
      onLoginSuccess(result.user, result.defaultRoute);
    } else {
      setError(result.error || 'Credenciales no válidas.');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regData.name || !regData.cedula || !regData.codigo) {
      setError('Complete todos los campos del registro.');
      return;
    }
    const cleanPass = regData.codigo.trim();
    const dNum = parseInt(regData.dupla.replace('D', ''), 10) || 1;
    
    // Registrar usuario formal en AuthStore
    const createdUser = AuthStore.addUser({
      name: regData.name.trim(),
      cedula: regData.cedula.trim(),
      codigo_estudiante: cleanPass,
      email: regData.email.trim() || `estudiante.${regData.dupla.toLowerCase()}@espoch.edu.ec`,
      phone: regData.phone.trim() || '0987654321',
      birthDate: regData.birthDate || '2003-05-18',
      bloodType: regData.bloodType || 'O+',
      kichwaLevel: regData.kichwaLevel || 'Básico',
      emergencyContactPhone: regData.emergencyContactPhone || '',
      passwordHash: cleanPass,
      role: 'encuestador',
      roleLabel: 'Brigadista Acreditada ESPOCH',
      organization: 'Carrera de Nutrición y Dietética (FSP)',
      dupla: regData.dupla,
      posicion: 'Titular 1',
      sector: dNum <= 12 ? 'Sector A' : (dNum <= 24 ? 'Sector B' : 'Sector C'),
      territory: 'San Andrés',
      status: 'activo',
      defaultRoute: 'student'
    });

    setIdentifier(regData.cedula);
    setPassword(cleanPass);
    setShowRegisterModal(false);
    setRegSuccess('¡Registro completado! Procediendo con el ingreso...');

    setTimeout(() => {
      const res = AuthStore.login(regData.cedula, cleanPass);
      if (res.success) {
        onLoginSuccess(res.user, res.defaultRoute);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-center items-center p-4">
      {/* Contenedor Card Google Clean 440px */}
      <div className="max-w-[440px] w-full bg-white border border-[#DADCE0] rounded-[28px] shadow-[0_4px_24px_rgba(60,64,67,0.08)] p-8">
        
        {/* Imagotipo Institucional Centrado */}
        <div className="text-center mb-6">
          <img 
            src="/AEA-Imagotipo-naranja-ayuda-pantalla-4000x.png" 
            alt="Ayuda en Acción" 
            className="h-11 mx-auto mb-3 object-contain"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0F4F9] text-[#002B49] text-[11px] font-bold tracking-wider mb-2">
            <span>ESPOCH • AYUDA EN ACCIÓN</span>
          </div>
          <h1 className="text-xl font-bold text-[#1F1F1F] tracking-tight">
            Plataforma DCI San Andrés
          </h1>
          <p className="text-xs text-[#444746] mt-0.5">
            Caracterización Infantil (0 a 5 años) • <strong className="text-[#E8734A]">v3.1.3 Oficial</strong>
          </p>
        </div>

        {/* Pestañas Segmented Buttons Google Style */}
        <div className="flex bg-[#F0F4F9] p-1 rounded-full border border-[#E0E2EC] mb-5">
          <button
            type="button"
            onClick={() => { setTab('student'); setError(''); }}
            className={`flex-1 py-2 px-3 rounded-full text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              tab === 'student'
                ? 'btn-primary shadow-sm text-white'
                : 'text-[#444746] hover:text-[#1F1F1F]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Estudiante Encuestador</span>
          </button>
          <button
            type="button"
            onClick={() => { setTab('admin'); setError(''); }}
            className={`flex-1 py-2 px-3 rounded-full text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              tab === 'admin'
                ? 'btn-primary shadow-sm text-white'
                : 'text-[#444746] hover:text-[#1F1F1F]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Profesional / Admin</span>
          </button>
        </div>

        {/* Alerta de Error */}
        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Mensaje de Éxito de Registro */}
        {regSuccess && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs">
            {regSuccess}
          </div>
        )}

        {/* Formulario de Autenticación */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {tab === 'student' ? (
            <>
              {/* Indicación Oficial para Teams */}
              <div className="p-3 bg-[#F0F7FF] border border-[#C8E1FB] rounded-xl text-[11px] text-[#1E3A8A] leading-relaxed">
                <strong className="text-[#002B49] block mb-0.5">Indicación Oficial para la Brigada (Teams):</strong>
                Ingresa tu <strong>Cédula con guión</strong> (ej. <code className="bg-white/80 px-1 py-0.5 rounded text-[#002B49]">060412389-1</code>) como usuario y tu <strong>Código Estudiantil</strong> como contraseña (ej. <code className="bg-white/80 px-1 py-0.5 rounded text-[#002B49]">6501</code>).
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F1F1F] mb-1">
                  Cédula de Identidad (con guión)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="ej: 060412389-1"
                    required
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-[#DADCE0] rounded-xl text-sm text-[#1F1F1F] placeholder-slate-400 focus:outline-none focus:border-[#E8734A] focus:ring-1 focus:ring-[#E8734A] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F1F1F] mb-1">
                  Código Estudiantil ESPOCH
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="ej: 6501"
                    required
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-[#DADCE0] rounded-xl text-sm text-[#1F1F1F] placeholder-slate-400 focus:outline-none focus:border-[#E8734A] focus:ring-1 focus:ring-[#E8734A] transition-all"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-[#1F1F1F] mb-1">
                  Correo Electrónico Institucional
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="ej: nutricionista@dci.ec o admin@dci.ec"
                    required
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-[#DADCE0] rounded-xl text-sm text-[#1F1F1F] placeholder-slate-400 focus:outline-none focus:border-[#E8734A] focus:ring-1 focus:ring-[#E8734A] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F1F1F] mb-1">
                  Contraseña de Acceso
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-[#DADCE0] rounded-xl text-sm text-[#1F1F1F] placeholder-slate-400 focus:outline-none focus:border-[#E8734A] focus:ring-1 focus:ring-[#E8734A] transition-all"
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex items-center justify-between text-xs text-[#444746] pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#E8734A] focus:ring-[#E8734A]"
              />
              <span>Recordar mi sesión</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 btn-primary text-white font-semibold rounded-full text-sm transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <span>{loading ? 'Validando...' : 'Iniciar Sesión'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Registro Dinámico para Estudiantes */}
        <div className="mt-6 pt-5 border-t border-slate-200 text-center">
          <p className="text-xs text-slate-500 mb-2">
            ¿Eres estudiante de Nutrición y aún no estás registrado?
          </p>
          <button
            type="button"
            onClick={() => setShowRegisterModal(true)}
            className="w-full py-2.5 px-4 bg-white hover:bg-orange-50/50 border border-slate-300 hover:border-[#E8734A] rounded-full text-xs font-semibold text-[#1F1F1F] transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <UserPlus className="w-3.5 h-3.5 text-[#E8734A]" />
            <span>Registrarme como Encuestador(a) ESPOCH</span>
          </button>
        </div>

        {/* Notas Institucionales al Pie */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-[10px] text-slate-400 leading-normal">
          Cumplimiento LOPDP • Protocolo Bioético Aprobado CEISH-ESPOCH<br />
          Soporte Técnico de Campo: <strong>+593 99 823 4512</strong>
        </div>
      </div>

      {/* Modal de Registro de Estudiante */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-[#002B49] mb-1">
              Registro Oficial de Brigadista ESPOCH
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Ingrese sus datos acreditados para habilitar su acceso y credencial oficial al operativo de campo.
            </p>

            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nombres y Apellidos Completos *</label>
                <input
                  type="text"
                  required
                  value={regData.name}
                  onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                  placeholder="ej: María Belén López Morales"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Cédula con Guión *</label>
                  <input
                    type="text"
                    required
                    value={regData.cedula}
                    onChange={(e) => setRegData({ ...regData, cedula: e.target.value })}
                    placeholder="ej: 060123456-7"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Código Estudiantil *</label>
                  <input
                    type="text"
                    required
                    value={regData.codigo}
                    onChange={(e) => setRegData({ ...regData, codigo: e.target.value })}
                    placeholder="ej: 6512"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">F. Nacimiento</label>
                    {regData.birthDate && calculateAge(regData.birthDate) !== null && (
                      <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        🎂 {calculateAge(regData.birthDate)} años
                      </span>
                    )}
                  </div>
                  <input
                    type="date"
                    value={regData.birthDate}
                    onChange={(e) => setRegData({ ...regData, birthDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Celular / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={regData.phone}
                    onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                    placeholder="ej: 0987654321"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Institucional ESPOCH</label>
                <input
                  type="email"
                  value={regData.email}
                  onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                  placeholder="ej: maria.lopez@espoch.edu.ec"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Dupla</label>
                  <select
                    value={regData.dupla}
                    onChange={(e) => setRegData({ ...regData, dupla: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    {Array.from({ length: 36 }, (_, i) => `D${String(i + 1).padStart(2, '0')}`).map(d => (
                      <option key={d} value={d}>Dupla {d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo Sangre</label>
                  <select
                    value={regData.bloodType}
                    onChange={(e) => setRegData({ ...regData, bloodType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kichwa</label>
                  <select
                    value={regData.kichwaLevel}
                    onChange={(e) => setRegData({ ...regData, kichwaLevel: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    {['Ninguno', 'Básico', 'Intermedio', 'Fluido / Nativo'].map(k => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfono Familiar de Emergencia</label>
                <input
                  type="tel"
                  value={regData.emergencyContactPhone}
                  onChange={(e) => setRegData({ ...regData, emergencyContactPhone: e.target.value })}
                  placeholder="ej: 0991234567 (Mamá / Familiar directo)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-full text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 btn-primary text-white rounded-full text-xs font-semibold shadow-sm"
                >
                  Completar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginView;
