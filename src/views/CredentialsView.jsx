import React, { useEffect, useState } from 'react';
import { ShieldCheck, QrCode, Printer, CheckCircle2, Download, User, Phone, HeartPulse, AlertCircle } from 'lucide-react';
import QRCode from 'qrcode';
import { calculateAge } from '../services/authStore';

export function CredentialsView({ user }) {
  const [qrSrc, setQrSrc] = useState('');
  const brigadistaId = user?.dupla ? `ESPOCH-BRIG-${user.dupla}` : `ESPOCH-PROF-${user?.id || '01'}`;
  const verificationUrl = `${window.location.origin}/verificar.html?id=${brigadistaId}`;
  const userAge = user?.birthDate ? calculateAge(user.birthDate) : null;

  useEffect(() => {
    QRCode.toDataURL(verificationUrl, { width: 220, margin: 2 })
      .then(url => setQrSrc(url))
      .catch(err => console.error(err));
  }, [verificationUrl]);

  return (
    <div className="space-y-6">
      {/* Cabecera del Módulo */}
      <div className="bg-white p-6 rounded-2xl border border-[#E0E2EC] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-[#1F1F1F] tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#E8734A]" />
            Credencial Digital Acreditada con Código QR Criptográfico
          </h2>
          <p className="text-xs text-[#747775] mt-0.5">
            Gafete oficial de identificación para presentación ante autoridades comunitarias y familias de San Andrés
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="btn btn-primary rounded-xl text-xs font-bold shadow-md flex items-center gap-2 px-5 py-2.5"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir Carnet Oficial</span>
        </button>
      </div>

      {/* Carnet Digital Institucional (Estilo Google Clean & Ayuda en Acción) */}
      <div className="max-w-md mx-auto bg-white rounded-2xl border border-[#E0E2EC] shadow-lg overflow-hidden print:border-none print:shadow-none">
        {/* Cabecera del Gafete (Blanca con Imagotipo Oficial AeA y Borde Naranja) */}
        <div className="bg-white p-5 text-center border-b-2 border-[#E8734A]">
          <img 
            src="/AEA-Imagotipo-naranja-ayuda-pantalla-4000x.png" 
            alt="Ayuda en Acción" 
            className="h-10 mx-auto mb-2 object-contain"
          />
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#002B49]">
            ESPOCH &bull; FACULTAD DE SALUD PÚBLICA
          </div>
          <h3 className="font-extrabold text-sm tracking-tight text-[#1F1F1F] mt-0.5">
            OPERATIVO CENSAL DCI SAN ANDRÉS 2026
          </h3>
          <div className="text-[11px] text-[#747775] mt-0.5">
            Convenio de Cooperación con Ayuda en Acción Ecuador
          </div>
        </div>

        {/* Cuerpo del Carnet */}
        <div className="p-6 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#E8734A] to-[#C85A32] text-white mx-auto flex items-center justify-center font-extrabold text-2xl shadow-md border-2 border-white">
            {user?.avatar || 'AC'}
          </div>

          <div>
            <h4 className="text-base font-extrabold text-[#1F1F1F]">
              {user?.name || 'Personal Acreditado'}
            </h4>
            <span className="text-xs font-semibold text-[#E8734A] block mt-0.5">
              {user?.roleLabel || 'Personal Técnico de Campo'}
            </span>
            <span className="font-mono text-xs text-[#747775] block mt-1">
              C.I. {user?.cedula || '060412389-1'}
            </span>

            {/* Badges Médicos y de Edad */}
            <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
              {userAge !== null && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  🎂 {userAge} años
                </span>
              )}
              {user?.bloodType && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  🩸 {user.bloodType}
                </span>
              )}
              {user?.phone && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Phone className="w-3 h-3" /> {user.phone}
                </span>
              )}
            </div>

            {user?.emergencyContactPhone && (
              <div className="mt-2 text-[10px] text-slate-500 bg-slate-50 p-1.5 rounded-lg border border-slate-200 max-w-xs mx-auto">
                <span className="font-semibold text-slate-700">Emergencia:</span> {user.emergencyContactName ? `${user.emergencyContactName} - ` : ''}{user.emergencyContactPhone}
              </div>
            )}
          </div>

          {/* Código QR Oficial */}
          <div className="p-3 bg-[#F8F9FA] rounded-xl border border-[#E0E2EC] inline-block shadow-inner">
            {qrSrc ? (
              <img src={qrSrc} alt="QR Verificación" className="w-44 h-44 mx-auto rounded-lg" />
            ) : (
              <div className="w-44 h-44 flex items-center justify-center text-xs text-[#747775]">
                Generando código...
              </div>
            )}
            <span className="text-[10px] font-mono text-[#002B49] block mt-1 font-bold">
              ID: {brigadistaId}
            </span>
          </div>

          <div className="text-[11px] text-[#747775] leading-snug px-4">
            Este carnet acredita al portador para el ingreso a hogares y levantamiento de datos antropométricos bajo el protocolo CEISH-ESPOCH-2026-DCI-001.
          </div>
        </div>

        {/* Pie del Gafete */}
        <div className="bg-[#F8F9FA] p-3 border-t border-[#E0E2EC] text-center text-[10px] font-semibold text-[#747775]">
          Válido durante el operativo de campo Septiembre - Noviembre 2026
        </div>
      </div>
    </div>
  );
}
