import React, { useState } from 'react';
import { 
  BookOpen, 
  ShieldCheck, 
  Activity, 
  FileSpreadsheet, 
  AlertTriangle, 
  Languages, 
  CheckCircle2, 
  Printer 
} from 'lucide-react';

export function ProtocolsView() {
  const [activeTab, setActiveTab] = useState('bioetica');

  const kichwaTerms = [
    { kichwa: 'Allillachu mikupanki?', spanish: '¿Cómo está comiendo el/la niño(a)?', context: 'Apertura de la encuesta' },
    { kichwa: 'Wawata tupushun', spanish: 'Vamos a medir al niño/niña', context: 'Antes de colocar en el infantómetro' },
    { kichwa: 'Wawata llashashun', spanish: 'Vamos a pesar al niño/niña', context: 'Antes de colocar en la balanza SECA' },
    { kichwa: 'Chumpata llukchishun', spanish: 'Por favor, retire la ropa pesada o zapatos', context: 'Preparación para pesaje' },
    { kichwa: 'Ama manchaychu, allillami kan', spanish: 'No tenga miedo, todo estará bien', context: 'Calmar al infante si llora' },
    { kichwa: 'Yupaichani / Pagrachu', spanish: 'Muchas gracias por su colaboración', context: 'Cierre y despedida' }
  ];

  return (
    <div className="space-y-6">
      {/* Selector de Pestañas de Protocolo */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('bioetica')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'bioetica' ? 'bg-[#E8734A] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Ética y Consentimiento CEISH</span>
        </button>

        <button
          onClick={() => setActiveTab('antropometria')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'antropometria' ? 'bg-[#E8734A] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Estándares Antropométricos OMS</span>
        </button>

        <button
          onClick={() => setActiveTab('kobo')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'kobo' ? 'bg-[#E8734A] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Guía KoBoCollect en Campo</span>
        </button>

        <button
          onClick={() => setActiveTab('kichwa')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'kichwa' ? 'bg-[#E8734A] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Languages className="w-4 h-4" />
          <span>Glosario Kichwa Puruhá</span>
        </button>
      </div>

      {/* Contenido de Cada Pestaña */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        {activeTab === 'bioetica' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Protocolo Bioético CEISH-ESPOCH (Aprobación Oficial)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Código de Registro: CEISH-ESPOCH-2026-DCI-001 • Cumplimiento Ley Orgánica de Protección de Datos Personales (LOPDP)
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir Hoja de Consentimiento</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block text-sm">Pasos Obligatorios de Consentimiento:</span>
                <p className="text-slate-600">
                  1. <strong>Identificación Acreditada:</strong> El brigadista debe portar su credencial oficial con código QR y chaleco institucional visible.
                </p>
                <p className="text-slate-600">
                  2. <strong>Lectura Clara:</strong> Explicar al padre, madre o tutor legal el propósito del estudio y el carácter confidencial de los datos.
                </p>
                <p className="text-slate-600">
                  3. <strong>Firma o Huella:</strong> Registrar la firma en el Formulario 2 (KoBo) o en el formulario físico de respaldo antes de desvestir o tocar al menor.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block text-sm">Privacidad y Protección de Datos:</span>
                <p className="text-slate-600">
                  • <strong>Anonimización de Código:</strong> En todo reporte analítico el menor es identificado únicamente mediante su código alfanumérico (ej: SA-PUL-017).
                </p>
                <p className="text-slate-600">
                  • <strong>No Divulgación de Cédulas:</strong> La cédula de identidad nunca se comparte públicamente ni se expone en mapas abiertos.
                </p>
                <p className="text-slate-600">
                  • <strong>Derecho de Revocatoria:</strong> El tutor puede retirar su consentimiento en cualquier etapa del proceso.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'antropometria' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-3">
              Técnicas Oficiales de Medición Antropométrica OMS (LMS whoanthro)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-[#002B49] block text-sm mb-2">Longitud / Estatura</span>
                <p className="text-slate-600 mb-2">
                  • <strong>0 a 23 meses:</strong> Se mide en decúbito supino (recostado) con infantómetro SECA 417. Cabeza en plano de Frankfurt.
                </p>
                <p className="text-slate-600 mb-2">
                  • <strong>24 a 59 meses:</strong> Se mide de pie (estatura) con tallímetro vertical.
                </p>
                <p className="text-emerald-800 font-semibold bg-emerald-50 p-2 rounded">
                  Regla Canónica OMS: Si menor a 24 meses se mide de pie, se suman +0.7 cm. Si mayor a 24 meses se mide recostado, se restan -0.7 cm.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-[#002B49] block text-sm mb-2">Pesaje con Balanza SECA 874</span>
                <p className="text-slate-600 mb-2">
                  • Función 2 en 1 (Tara madre-hijo) para lactantes que no se sostienen de pie.
                </p>
                <p className="text-slate-600 mb-2">
                  • Superficie plana, nivelada y calibración obligatoria matutina con pesa de 5.000 kg.
                </p>
                <p className="text-slate-600">
                  • El menor debe estar con ropa mínima (pañal limpio y seco o camiseta delgada).
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-rose-700 block text-sm mb-2">Diagnóstico de Edema Bilateral</span>
                <p className="text-slate-600 mb-2">
                  • <strong>Técnica de Fóvea:</strong> Presión suave con ambos pulgares durante 3 segundos sobre el dorso de ambos pies.
                </p>
                <p className="text-slate-600 mb-2">
                  • Si queda huella visible en <strong>ambos pies</strong> simultáneamente, se clasifica como <strong>Kwashiorkor / SAM</strong>.
                </p>
                <p className="text-rose-800 font-bold bg-rose-50 p-2 rounded">
                  Invalida z-score de peso para la talla (WHZ) y exige derivación de emergencia al C.S. Tipo B.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'kobo' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-3">
              Guía de Operación y Sincronización en KoBoCollect
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block text-sm mb-2">Flujo de Trabajo Diario:</span>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-600">
                  <li>Verificar en el hotel/base la descarga de formularios en KoBoCollect.</li>
                  <li>Activar GPS de la tableta antes de iniciar la caminata.</li>
                  <li>Capturar coordenadas GPS con precisión &lt; 10 metros en la puerta del hogar.</li>
                  <li>Completar Instrumento 1 (Hogar) e Instrumento 2 (Antropometría).</li>
                  <li>Guardar formulario como finalizado.</li>
                  <li>Al retornar con conexión Wi-Fi, presionar "Enviar formularios finalizados".</li>
                </ol>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block text-sm mb-2">Protocolo ante Vivienda No Localizada:</span>
                <p className="text-slate-600 mb-2">
                  Si un predio titular sorteado se encuentra deshabitado, destruido o con rechazo explícito tras 3 visitas en horarios distintos:
                </p>
                <p className="text-slate-600 mb-2">
                  1. Registrar la novedad en la bitácora de campo.
                </p>
                <p className="text-slate-600">
                  2. Solicitar al Docente Supervisor la asignación del predio de reserva pre-sorteado del mismo clúster dasimétrico.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'kichwa' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-3">
              Glosario Kichwa Puruhá de Apoyo para Diálogo Comunitario
            </h3>
            <p className="text-xs text-slate-600">
              Frases recomendadas para estudiantes y nutricionistas en comunidades andinas de San Andrés (Pulinguí, Calshi, Santa Rosa, etc.):
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {kichwaTerms.map((t, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-[#002B49] text-sm block">{t.kichwa}</span>
                  <span className="text-slate-800 font-semibold block mt-0.5">{t.spanish}</span>
                  <span className="text-[10px] text-slate-400 mt-1 block uppercase tracking-wider">{t.context}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
