// =============================================================================
// PORTAL.JS - Panel de Operaciones de Campo para Estudiantes Encuestadores
// Proyecto DCI - Componente A.3.1 (Ayuda en Acción Ecuador / ESPOCH)
// Versión: v2.6.2 Oficial
// =============================================================================

const PortalModule = {
  render() {
    const user = Auth.currentUser || {
      name: 'Estudiante Encuestador',
      dupla: 'D01',
      posicion: 'Titular 1',
      zona_nombre: 'Sector A - Centralidades San Andrés',
      meta_encuestas: 18,
      encuestas_realizadas: 0
    };

    const duplaCode = (user.dupla || 'D01').toUpperCase();
    const sup = (typeof Auth !== 'undefined' && typeof Auth.getSupervisorForDupla === 'function')
      ? Auth.getSupervisorForDupla(duplaCode)
      : (user.supervisor || {
          name: 'ND. Verónica Carlina Delgado López',
          cargo: 'Docente Titular Auxiliar 1 / Inv. Principal CEISH (FSP - ESPOCH)',
          telefono: '0994645682',
          whatsapp: '593994645682',
          email: 'veronica.delgado@espoch.edu.ec'
        });

    // Identificar compañero de dupla
    const allBrigadistas = (typeof APP_DATA !== 'undefined' && Array.isArray(APP_DATA.surveyors)) ? APP_DATA.surveyors : [];
    const partner = allBrigadistas.find(b => b.dupla === duplaCode && (b.cedula !== user.cedula && b.fullName !== user.name && b.id !== user.id && b.brigadistaId !== user.id));

    // Conteo dinámico de encuestas de la dupla
    const koboSubmissions = (typeof KoboSyncModule !== 'undefined' && Array.isArray(KoboSyncModule.submissions)) ? KoboSyncModule.submissions : [];
    const duplaSubs = koboSubmissions.filter(s => s.dupla === duplaCode || (s.surveyor && s.surveyor.includes(duplaCode)));
    const current = duplaSubs.length > 0 ? duplaSubs.length : (user.encuestas_realizadas || 0);
    const total = user.meta_encuestas || 18;
    const pct = Math.min(100, Math.round((current / total) * 100));

    // Estado de calibración matutina SECA guardada hoy
    const today = new Date().toISOString().substring(0, 10);
    const savedCalib = localStorage.getItem(`cgpi_calib_${duplaCode}_${today}`);
    let calibStatus = savedCalib ? JSON.parse(savedCalib) : null;

    const html = `
      <div class="portal-brigadista-view fade-in">
        <!-- Banner de Bienvenida Institucional Google Clean -->
        <div class="card" style="background:#002B49;color:white;padding:1.75rem;border-radius:16px;margin-bottom:1.5rem;border-bottom:3px solid var(--accent);box-shadow:0 8px 24px rgba(0,43,73,0.2);">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;">
            <div style="display:flex;align-items:center;gap:1.25rem;">
              <div style="width:76px;height:76px;border-radius:50%;background:white;padding:3px;box-shadow:0 4px 15px rgba(0,0,0,0.25);flex-shrink:0;">
                ${user.photoUrl 
                  ? `<img src="${user.photoUrl}" alt="${user.name}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`
                  : `<div style="width:100%;height:100%;border-radius:50%;background:linear-gradient(135deg, #002B49, #004578);display:flex;align-items:center;justify-content:center;color:white;font-weight:800;font-size:1.6rem;">${user.avatar || 'ES'}</div>`
                }
              </div>
              <div>
                <div style="display:inline-flex;align-items:center;gap:0.5rem;background:rgba(232,115,74,0.2);padding:0.25rem 0.75rem;border-radius:20px;font-size:0.75rem;font-weight:700;color:#FFFFFF;margin-bottom:0.4rem;border:1px solid rgba(232,115,74,0.4);">
                  <span>🎓 BRIGADISTA ACREDITADO ESPOCH</span>
                  <span>•</span>
                  <span>DUPLA ${duplaCode} (${user.posicion || 'Titular 1'})</span>
                </div>
                <h1 style="font-size:1.5rem;font-weight:800;margin:0;color:white;">¡Hola, ${user.name || user.nombres || 'Estudiante Encuestador'}!</h1>
                <p style="margin:0.25rem 0 0 0;font-size:0.85rem;color:rgba(255,255,255,0.85);">
                  Carrera de Nutrición y Dietética • Operativo de Campo DCI San Andrés (0 a 5 años)
                </p>
                ${partner ? `
                  <div style="margin-top:0.4rem;font-size:0.8rem;color:#E0F2FE;">
                    👥 <strong>Compañero(a) de Dupla:</strong> ${partner.fullName || partner.name} (${partner.posicion || 'Titular 2'})
                  </div>
                ` : ''}
              </div>
            </div>

            <div style="text-align:right;">
              <div style="font-size:0.75rem;color:rgba(255,255,255,0.7);text-transform:uppercase;letter-spacing:0.5px;">Cédula Oficial</div>
              <strong style="font-size:1rem;color:white;font-family:monospace;">${user.cedula || '185094123-4'}</strong>
              <div style="font-size:0.72rem;color:rgba(255,255,255,0.8);margin-top:3px;">Sector: <strong>${sup.sector || 'Sector A'}</strong></div>
            </div>
          </div>
        </div>

        <!-- Grilla Operativa: Supervisor Asignado + Zona + Progreso -->
        <div class="grid-3" style="gap:1.5rem;margin-bottom:1.5rem;">
          
          <!-- TARJETA 1: SUPERVISOR ASIGNADO (COMUNICACIÓN DIRECTA) -->
          <div class="card" style="border:2px solid rgba(232,115,74,0.3);display:flex;flex-direction:column;justify-content:space-between;padding:1.5rem;">
            <div>
              <div style="display:flex;align-items:center;gap:0.5rem;color:var(--accent);font-weight:800;font-size:0.85rem;margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:0.5px;">
                <span style="font-size:1.2rem;">👨‍🏫</span> Tu Supervisor de Campo a Cargo
              </div>
              <h3 style="font-size:1.15rem;font-weight:800;color:var(--text-primary);margin:0 0 0.25rem 0;">
                ${sup.name}
              </h3>
              <div style="font-size:0.8rem;color:var(--text-secondary);line-height:1.4;margin-bottom:1rem;">
                ${sup.cargo}
              </div>
              <div style="background:var(--bg-tertiary);padding:0.75rem;border-radius:8px;border:1px solid var(--border);font-size:0.8rem;color:var(--text-muted);margin-bottom:1rem;">
                Comunícate con tu docente supervisor en caso de dudas metodológicas, reemplazo oficial de viviendas de reserva pre-sorteadas o cualquier incidente en campo.
              </div>
            </div>

            <div style="display:flex;flex-direction:column;gap:0.5rem;">
              <a href="https://wa.me/${sup.whatsapp}?text=${encodeURIComponent(`Hola ${sup.name}, soy el/la estudiante ${user.name} de la Dupla ${duplaCode} en San Andrés. Tengo la siguiente consulta de campo:`)}" 
                 target="_blank" 
                 class="btn" 
                 style="background:#25D366;color:white;font-weight:700;justify-content:center;display:flex;align-items:center;gap:0.5rem;text-decoration:none;padding:0.7rem;border-radius:var(--radius-sm);box-shadow:0 4px 12px rgba(37,211,102,0.25);">
                <i class="fa-brands fa-whatsapp" style="font-size:1.1rem;"></i> WhatsApp Directo al Supervisor
              </a>
              <a href="tel:${sup.telefono}" 
                 class="btn btn-secondary" 
                 style="justify-content:center;display:flex;align-items:center;gap:0.5rem;text-decoration:none;padding:0.65rem;border-radius:var(--radius-sm);font-weight:600;">
                <i class="fa-solid fa-phone"></i> Llamar al Celular (${sup.telefono})
              </a>
            </div>
          </div>

          <!-- TARJETA 2: ZONA Y COMUNIDAD ASIGNADA DE HOY -->
          <div class="card" style="display:flex;flex-direction:column;justify-content:space-between;padding:1.5rem;">
            <div>
              <div style="display:flex;align-items:center;gap:0.5rem;color:#3b82f6;font-weight:800;font-size:0.85rem;margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:0.5px;">
                <span style="font-size:1.2rem;">📍</span> Cuadrante de Barrido Asignado
              </div>
              <h3 style="font-size:1.15rem;font-weight:800;color:var(--text-primary);margin:0 0 0.25rem 0;">
                ${user.zona_nombre || 'Sector A - Centralidades San Andrés'}
              </h3>
              <div style="font-size:0.8rem;color:var(--text-secondary);line-height:1.4;margin-bottom:1rem;">
                Zona de cobertura: <strong>45 Asentamientos Humanos Oficiales PDOT Guano 2023–2027</strong> (5.486 techos dasimétricos). Operativo concentrado en <strong>5 jornadas de lunes (~4 a 5 niños por jornada)</strong>.
              </div>

              <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.6rem;background:var(--bg-tertiary);padding:0.75rem;border-radius:8px;border:1px solid var(--border);font-size:0.78rem;">
                <div>
                  <span style="color:var(--text-muted);display:block;">Población Meta:</span>
                  <strong style="color:var(--text-primary);">0 a 59 meses</strong>
                </div>
                <div>
                  <span style="color:var(--text-muted);display:block;">Tipo de Muestra:</span>
                  <strong style="color:var(--accent);">Titular + Reserva</strong>
                </div>
              </div>
            </div>

            <div style="margin-top:1rem;">
              <button class="btn btn-secondary btn-block" onclick="App.navigateTo('gis')" style="justify-content:center;gap:0.5rem;">
                🗺️ Abrir Mapa GIS de Mi Cuadrante
              </button>
            </div>
          </div>

          <!-- TARJETA 3: AVANCE Y META DE LA DUPLA -->
          <div class="card" style="display:flex;flex-direction:column;justify-content:space-between;padding:1.5rem;">
            <div>
              <div style="display:flex;align-items:center;gap:0.5rem;color:#10b981;font-weight:800;font-size:0.85rem;margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:0.5px;">
                <span style="font-size:1.2rem;">📊</span> Tu Meta de Levantamiento (Dupla ${duplaCode})
              </div>
              <div style="display:flex;align-items:baseline;gap:0.4rem;margin-bottom:0.5rem;">
                <span style="font-size:2.2rem;font-weight:800;color:var(--text-primary);">${current}</span>
                <span style="font-size:1.1rem;color:var(--text-muted);">/ ${total} niños</span>
              </div>

              <div style="background:var(--bg-tertiary);border-radius:10px;height:12px;overflow:hidden;margin-bottom:0.75rem;border:1px solid var(--border);">
                <div style="background:linear-gradient(90deg, #10b981, #059669);height:100%;width:${pct}%;border-radius:10px;transition:width 0.8s ease-in-out;"></div>
              </div>
              <div style="display:flex;justify-content:space-between;font-size:0.78rem;color:var(--text-secondary);margin-bottom:1rem;">
                <span>Progreso completado: <strong>${pct}%</strong></span>
                <span>Faltan: <strong>${Math.max(0, total - current)} niños</strong></span>
              </div>
            </div>

            <div>
              <button class="btn btn-secondary btn-block" onclick="App.navigateTo('credentials')" style="justify-content:center;gap:0.5rem;">
                🪪 Ver Mi Credencial Oficial QR
              </button>
            </div>
          </div>

        </div>

        <!-- MÓDULO DE CALIBRACIÓN DIARIA MATUTINA SECA 874 / 417 -->
        <div class="card" style="padding:1.5rem;margin-bottom:1.5rem;border-left:4px solid ${calibStatus?.passed ? '#10b981' : '#f59e0b'};">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;margin-bottom:1rem;">
            <div>
              <h3 style="font-size:1.1rem;font-weight:800;margin:0 0 0.2rem 0;color:var(--text-primary);display:flex;align-items:center;gap:0.5rem;">
                ⚖️ Protocolo Obligatorio de Calibración Matutina SECA 874 / 417
              </h3>
              <p style="margin:0;font-size:0.8rem;color:var(--text-secondary);">
                Verificación diaria antes de la salida a campo con la Pesa Patrón de 5.000 kg (Tolerancia máxima permitida: ±50 gramos).
              </p>
            </div>
            <div>
              ${calibStatus ? (
                calibStatus.passed
                  ? `<span class="badge" style="background:#10b981;color:white;font-weight:700;">✅ CALIBRADO HOY (${calibStatus.measuredKg} kg - Dif: ${calibStatus.diffG} g)</span>`
                  : `<span class="badge" style="background:#ef4444;color:white;font-weight:700;">❌ EQUIPO BLOQUEADO (${calibStatus.measuredKg} kg - Dif: ${calibStatus.diffG} g)</span>`
              ) : `
                <span class="badge" style="background:#f59e0b;color:white;font-weight:700;">⚠️ PENDIENTE DE CALIBRACIÓN HOY</span>
              `}
            </div>
          </div>

          <div style="display:flex;gap:1rem;align-items:center;flex-wrap:wrap;background:var(--bg-tertiary);padding:1rem;border-radius:10px;border:1px solid var(--border);">
            <div style="flex:1;min-width:200px;">
              <label style="font-size:0.8rem;color:var(--text-secondary);display:block;margin-bottom:0.3rem;">
                Peso registrado en Balanza SECA 874 con Pesa Patrón de 5.000 kg:
              </label>
              <div style="display:flex;gap:0.5rem;">
                <input type="number" id="input-seca-weight" step="0.001" min="4.500" max="5.500" placeholder="5.000" class="input-styled" style="width:140px;font-size:1.1rem;font-weight:700;text-align:center;" value="${calibStatus ? calibStatus.measuredKg : '5.000'}">
                <span style="display:flex;align-items:center;font-weight:700;color:var(--text-muted);">kg</span>
                <button type="button" class="btn btn-primary" onclick="PortalModule.registerSecaCalibration('${duplaCode}')" style="margin-left:auto;">
                  Registrar Calibración de Hoy
                </button>
              </div>
            </div>
            <div style="font-size:0.75rem;color:var(--text-muted);max-width:320px;line-height:1.3;">
              * Si la diferencia es &gt;50 g, la balanza se marcará NO APTA y se enviará notificación a Logística D00 y canal Teams <code>04 - Equipos SECA</code>.
            </div>
          </div>
        </div>

        <!-- Acceso Rápido a los Dos Formularios KoBoToolbox Oficiales -->
        <div class="card" style="padding:1.5rem;margin-bottom:1.5rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;flex-wrap:wrap;gap:0.5rem;">
            <div>
              <h2 style="font-size:1.2rem;font-weight:800;margin:0 0 0.2rem 0;color:var(--text-primary);display:flex;align-items:center;gap:0.5rem;">
                <span>📲</span> Instrumentos Oficiales en Terreno (Enketo, Móvil & QR)
              </h2>
              <p style="margin:0;font-size:0.82rem;color:var(--text-secondary);">
                Accede desde el navegador móvil (Enketo Web), mediante la app nativa KoBoCollect (Android Intent) o escaneando el código QR en alta resolución.
              </p>
            </div>
            <span class="badge" style="background:rgba(0,43,73,0.08);color:#002B49;font-weight:700;border:1px solid rgba(0,43,73,0.2);">
              KoBoToolbox Server v2.0 Oficial
            </span>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:1.25rem;">
            <!-- Formulario 1: Hogar -->
            <div style="border:1px solid var(--border);border-radius:12px;padding:1.25rem;background:var(--bg-tertiary);display:flex;flex-direction:column;justify-content:space-between;">
              <div>
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem;">
                  <span class="badge" style="background:#002B49;color:white;font-weight:800;">INSTRUMENTO 1</span>
                  <span style="font-size:0.75rem;color:var(--text-muted);font-family:monospace;">Asset: awxjbYsJnZZ4uUJZs4w2wF</span>
                </div>
                <h3 style="font-size:1.05rem;font-weight:700;color:var(--text-primary);margin:0 0 0.4rem 0;">
                  Caracterización del Hogar y Sociodemográfica
                </h3>
                <p style="font-size:0.8rem;color:var(--text-secondary);line-height:1.4;margin-bottom:1rem;">
                  Composición familiar, acceso a agua segura, saneamiento, vivienda y seguridad alimentaria (ELCSA). Genera el código <code>uid_hogar_hash</code>.
                </p>
              </div>

              <div style="display:flex;flex-direction:column;gap:0.5rem;">
                <a href="https://ee.kobotoolbox.org/rrNpxrAR" target="_blank" class="btn btn-primary" style="justify-content:center;text-decoration:none;gap:0.4rem;font-weight:700;">
                  🌐 Abrir en Enketo Web
                </a>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;">
                  <a href="intent://ee.kobotoolbox.org/rrNpxrAR#Intent;scheme=https;package=org.koboc.collect.android;action=android.intent.action.VIEW;end;" class="btn btn-secondary" style="justify-content:center;gap:0.35rem;font-size:0.8rem;padding:0.55rem;text-decoration:none;">
                    📱 KoBoCollect
                  </a>
                  <button type="button" class="btn btn-secondary" onclick="PortalModule.showFormQrModal('hogar')" style="justify-content:center;gap:0.35rem;font-size:0.8rem;padding:0.55rem;">
                    📷 Ver QR HD
                  </button>
                </div>
                <button class="btn btn-secondary btn-sm" onclick="App.navigateTo('protocols'); setTimeout(() => { ProtocolsModule.switchTab('formularios_tooltips'); ProtocolsModule.switchFormPreview('socio'); }, 120);" style="margin-top:0.2rem;justify-content:center;gap:0.4rem;font-size:0.78rem;">
                  💡 Ver Preguntas, Tooltips y Kichwa (Form 1)
                </button>
              </div>
            </div>

            <!-- Formulario 2: Antropometría -->
            <div style="border:1px solid var(--border);border-radius:12px;padding:1.25rem;background:var(--bg-tertiary);display:flex;flex-direction:column;justify-content:space-between;">
              <div>
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem;">
                  <span class="badge" style="background:#10b981;color:white;font-weight:800;">INSTRUMENTO 2</span>
                  <span style="font-size:0.75rem;color:var(--text-muted);font-family:monospace;">Asset: aqFmM2CfVF9N7PaUQeYVux</span>
                </div>
                <h3 style="font-size:1.05rem;font-weight:700;color:var(--text-primary);margin:0 0 0.4rem 0;">
                  Evaluación Antropométrica y Bioética (CEISH)
                </h3>
                <p style="font-size:0.8rem;color:var(--text-secondary);line-height:1.4;margin-bottom:1rem;">
                  Peso en balanza SECA 874 (±0.1 kg), talla/longitud en SECA 417 (±0.1 cm), descarte de edema bilateral (SAM) y Z-scores OMS.
                </p>
              </div>

              <div style="display:flex;flex-direction:column;gap:0.5rem;">
                <a href="https://ee.kobotoolbox.org/XnLSvL66" target="_blank" class="btn btn-primary" style="background:#10b981;border-color:#10b981;justify-content:center;text-decoration:none;gap:0.4rem;font-weight:700;">
                  📏 Abrir en Enketo Web
                </a>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;">
                  <a href="intent://ee.kobotoolbox.org/XnLSvL66#Intent;scheme=https;package=org.koboc.collect.android;action=android.intent.action.VIEW;end;" class="btn btn-secondary" style="justify-content:center;gap:0.35rem;font-size:0.8rem;padding:0.55rem;text-decoration:none;">
                    📱 KoBoCollect
                  </a>
                  <button type="button" class="btn btn-secondary" onclick="PortalModule.showFormQrModal('antro')" style="justify-content:center;gap:0.35rem;font-size:0.8rem;padding:0.55rem;">
                    📷 Ver QR HD
                  </button>
                </div>
                <button class="btn btn-secondary btn-sm" onclick="App.navigateTo('protocols'); setTimeout(() => { ProtocolsModule.switchTab('formularios_tooltips'); ProtocolsModule.switchFormPreview('antro'); }, 120);" style="margin-top:0.2rem;justify-content:center;gap:0.4rem;font-size:0.78rem;">
                  💡 Ver Preguntas, Tooltips y Kichwa (Form 2)
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Checklist Bioético y Protocolos de Campo -->
        <div class="card" style="padding:1.5rem;">
          <h3 style="font-size:1.05rem;font-weight:700;color:var(--text-primary);margin:0 0 0.75rem 0;display:flex;align-items:center;gap:0.5rem;">
            <span>🛡️</span> Checklist Bioético y Seguridad Operativa (CEISH-ESPOCH)
          </h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:0.85rem;font-size:0.82rem;color:var(--text-secondary);">
            <div style="background:var(--bg-tertiary);padding:0.75rem 1rem;border-radius:8px;border:1px solid var(--border);display:flex;align-items:center;gap:0.6rem;">
              <span style="color:#10b981;font-size:1.1rem;">✅</span>
              <span><strong>Identificación Visible:</strong> Chaleco institucional + Gafete con código QR portado en el pecho.</span>
            </div>
            <div style="background:var(--bg-tertiary);padding:0.75rem 1rem;border-radius:8px;border:1px solid var(--border);display:flex;align-items:center;gap:0.6rem;">
              <span style="color:#10b981;font-size:1.1rem;">✅</span>
              <span><strong>Consentimiento Informado:</strong> Firma física obligatoria del padre/tutor antes de cualquier medición.</span>
            </div>
            <div style="background:var(--bg-tertiary);padding:0.75rem 1rem;border-radius:8px;border:1px solid var(--border);display:flex;align-items:center;gap:0.6rem;">
              <span style="color:#10b981;font-size:1.1rem;">✅</span>
              <span><strong>Calibración Diaria:</strong> Tarar balanza SECA en superficie horizontal plana y verificar cero con peso patrón.</span>
            </div>
            <div style="background:var(--bg-tertiary);padding:0.75rem 1rem;border-radius:8px;border:1px solid var(--border);display:flex;align-items:center;gap:0.6rem;">
              <span style="color:#10b981;font-size:1.1rem;">✅</span>
              <span><strong>Trabajo en Parejas:</strong> Ningún encuestador se separa de su binomio durante el recorrido por el sector.</span>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('main-content').innerHTML = html;
  },

  showFormQrModal(formType) {
    const isHogar = formType === 'hogar';
    const formTitle = isHogar ? 'Instrumento 1: Caracterización del Hogar' : 'Instrumento 2: Evaluación Antropométrica';
    const formUrl = isHogar ? 'https://ee.kobotoolbox.org/rrNpxrAR' : 'https://ee.kobotoolbox.org/XnLSvL66';
    const assetId = isHogar ? 'awxjbYsJnZZ4uUJZs4w2wF' : 'aqFmM2CfVF9N7PaUQeYVux';
    const filename = isHogar ? 'QR_Formulario_1_Hogar_San_Andres.png' : 'QR_Formulario_2_Antropometria_San_Andres.png';

    // Eliminar modal previo si existe
    const existingModal = document.getElementById('modal-form-qr-container');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'modal-form-qr-container';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0, 0, 0, 0.65)';
    modal.style.backdropFilter = 'blur(4px)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '9999';
    modal.style.padding = '1rem';

    modal.innerHTML = `
      <div style="background:#FFFFFF;border-radius:20px;max-width:440px;width:100%;box-shadow:0 12px 36px rgba(0,0,0,0.25);overflow:hidden;animation:fadeInModal 0.2s ease-out;">
        <!-- Cabecera del Modal -->
        <div style="background:#F8F9FA;padding:1.25rem 1.5rem;border-bottom:1px solid #E0E2EC;display:flex;justify-content:space-between;align-items:center;">
          <div>
            <span style="font-size:0.75rem;font-weight:700;color:#002B49;background:#E8F0FE;padding:2px 8px;border-radius:12px;">KOBOTOOLBOX OFICIAL</span>
            <h3 style="margin:0.35rem 0 0 0;font-size:1.05rem;font-weight:700;color:#1F1F1F;">${formTitle}</h3>
          </div>
          <button id="btn-close-qr-modal" type="button" style="background:transparent;border:none;font-size:1.4rem;color:#747775;cursor:pointer;line-height:1;">&times;</button>
        </div>

        <!-- Cuerpo del Modal: Render del Código QR -->
        <div style="padding:1.5rem;text-align:center;">
          <p style="margin:0 0 1rem 0;font-size:0.82rem;color:#444746;line-height:1.4;">
            Escanea este código directamente con la cámara de tu smartphone o descárgalo para imprimirlo en tu credencial de campo.
          </p>
          
          <div style="display:inline-block;padding:12px;background:#FFFFFF;border-radius:12px;border:1px solid #E0E2EC;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
            <div id="qr-form-target" style="width:240px;height:240px;display:flex;align-items:center;justify-content:center;"></div>
          </div>

          <div style="margin-top:1rem;background:#F0F4F9;padding:0.6rem 0.8rem;border-radius:8px;font-size:0.78rem;color:#002B49;word-break:break-all;font-family:monospace;">
            ${formUrl}
          </div>
          <div style="margin-top:0.4rem;font-size:0.72rem;color:#747775;">
            Asset ID: <code>${assetId}</code>
          </div>
        </div>

        <!-- Acciones del Modal -->
        <div style="background:#F8F9FA;padding:1rem 1.5rem;border-top:1px solid #E0E2EC;display:flex;gap:0.75rem;justify-content:flex-end;">
          <button id="btn-download-qr-png" type="button" class="btn btn-primary" style="background:#002B49;color:#FFFFFF;border-radius:20px;font-weight:600;font-size:0.85rem;padding:0.55rem 1.1rem;border:none;cursor:pointer;display:inline-flex;align-items:center;gap:0.4rem;">
            📥 Descargar QR (PNG)
          </button>
          <button id="btn-close-qr-bottom" type="button" class="btn btn-secondary" style="border-radius:20px;font-size:0.85rem;padding:0.55rem 1rem;background:#FFFFFF;border:1px solid #C4C7C5;color:#1F1F1F;cursor:pointer;">
            Cerrar
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const closeFn = () => modal.remove();
    document.getElementById('btn-close-qr-modal').onclick = closeFn;
    document.getElementById('btn-close-qr-bottom').onclick = closeFn;
    modal.onclick = (e) => { if (e.target === modal) closeFn(); };

    // Generar el código QR
    const qrContainer = document.getElementById('qr-form-target');
    if (typeof QRCode !== 'undefined' && qrContainer) {
      try {
        new QRCode(qrContainer, {
          text: formUrl,
          width: 240,
          height: 240,
          colorDark: '#002B49',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H
        });
      } catch (err) {
        console.error('Error generando QR del formulario:', err);
        qrContainer.innerHTML = `<span style="color:#ef4444;font-size:0.8rem;">No se pudo renderizar el QR localmente.</span>`;
      }
    } else if (qrContainer) {
      qrContainer.innerHTML = `<span style="font-size:0.8rem;color:#747775;">Librería QRCode no disponible.</span>`;
    }

    // Listener para Descargar PNG
    document.getElementById('btn-download-qr-png').onclick = () => {
      const canvas = qrContainer.querySelector('canvas');
      const img = qrContainer.querySelector('img');
      let dataUrl = null;
      if (canvas) {
        dataUrl = canvas.toDataURL('image/png');
      } else if (img && img.src) {
        dataUrl = img.src;
      }

      if (dataUrl) {
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert('El código QR aún se está procesando. Por favor intente en un momento.');
      }
    };
  },

  registerSecaCalibration(duplaCode) {
    const input = document.getElementById('input-seca-weight');
    const val = parseFloat(input?.value);
    if (isNaN(val)) {
      alert('Por favor ingrese un valor de peso válido en kg.');
      return;
    }

    const diffKg = Math.abs(val - 5.000);
    const diffG = Math.round(diffKg * 1000);
    const passed = diffG <= 50;
    const today = new Date().toISOString().substring(0, 10);

    const record = {
      dupla: duplaCode,
      date: today,
      timestamp: new Date().toISOString(),
      measuredKg: val.toFixed(3),
      diffG,
      passed
    };

    localStorage.setItem(`cgpi_calib_${duplaCode}_${today}`, JSON.stringify(record));

    if (passed) {
      alert(`✅ Calibración SECA 874 Registrada con Éxito.\n\nPeso registrado: ${val.toFixed(3)} kg\nDesviación: ${diffG} gramos (Tolerancia permitida: ±50 g)\nEstado: EQUIPO APTO PARA SALIDA A CAMPO.`);
    } else {
      alert(`⚠️ ALERTA DE CALIBRACIÓN SECA 874: NO APTO.\n\nPeso registrado: ${val.toFixed(3)} kg\nDesviación: ${diffG} gramos (SUPERA los 50 g permitidos).\n\nEl equipo queda bloqueado preventivamente. Por favor contacte inmediatamente a la Dupla de Logística (D00 - Bryan Velasco) o al canal Teams 04 - Equipos SECA.`);
    }

    this.render();
  },

  destroy() {}
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PortalModule;
}
if (typeof window !== 'undefined') {
  window.PortalModule = PortalModule;
}
