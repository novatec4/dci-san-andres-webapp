// =============================================================================
// PROTOCOLS.JS - Módulo Informativo: Protocolos y Guía de Campo Oficial
// Proyecto DCI - Componente A.3.1 (Ayuda en Acción Ecuador / ESPOCH)
// =============================================================================

const ProtocolsModule = {
  currentTab: 'etica',

  render() {
    const html = `
      <div class="module-header fade-in">
        <div>
          <div style="display:flex;align-items:center;gap:.75rem;">
            <h1 style="margin:0;">📖 Protocolos y Guía de Campo Oficial</h1>
            <span class="badge badge-orange" style="font-weight:700;">Componente A.3.1</span>
          </div>
          <span>Manuales operativos estandarizados para encuestadores, nutricionistas y supervisores</span>
        </div>
      </div>

      <!-- Barra de Pestañas de Protocolos -->
      <div class="protocols-tab-bar fade-in">
        <button class="protocol-tab-btn ${this.currentTab === 'etica' ? 'active' : ''}" onclick="ProtocolsModule.switchTab('etica')">
          📋 Ética & CEISH
        </button>
        <button class="protocol-tab-btn ${this.currentTab === 'antropometria' ? 'active' : ''}" onclick="ProtocolsModule.switchTab('antropometria')">
          📏 Antropometría OMS
        </button>
        <button class="protocol-tab-btn ${this.currentTab === 'kobo' ? 'active' : ''}" onclick="ProtocolsModule.switchTab('kobo')">
          📱 Guía KoBoCollect
        </button>
        <button class="protocol-tab-btn ${this.currentTab === 'seguridad' ? 'active' : ''}" onclick="ProtocolsModule.switchTab('seguridad')">
          🚨 Seguridad & Emergencias
        </button>
        <button class="protocol-tab-btn ${this.currentTab === 'kichwa' ? 'active' : ''}" onclick="ProtocolsModule.switchTab('kichwa')">
          🗣️ Glosario Kichwa
        </button>
        <button class="protocol-tab-btn ${this.currentTab === 'formularios_tooltips' ? 'active' : ''}" onclick="ProtocolsModule.switchTab('formularios_tooltips')">
          💡 Visor de Formularios & Tooltips Kichwa
        </button>
      </div>

      <!-- Contenedor Dinámico de la Pestaña -->
      <div id="protocol-content-area" class="fade-in">
        ${this._getTabContent(this.currentTab)}
      </div>
    `;

    document.getElementById('main-content').innerHTML = html;
  },

  switchTab(tabKey) {
    this.currentTab = tabKey;
    document.querySelectorAll('.protocol-tab-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('onclick')?.includes(`'${tabKey}'`)) {
        btn.classList.add('active');
      }
    });

    const area = document.getElementById('protocol-content-area');
    if (area) {
      area.innerHTML = this._getTabContent(tabKey);
    }
  },

  _getTabContent(tabKey) {
    switch (tabKey) {
      case 'etica':
        return `
          <div class="card" style="padding:2rem;">
            <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:1.5rem;border-bottom:1px solid var(--border);padding-bottom:1rem;">
              <div style="font-size:2rem;">📋</div>
              <div>
                <h2 style="margin:0;font-size:1.35rem;">Protocolo Ético y Consentimiento Informado (CEISH)</h2>
                <span style="font-size:.85rem;color:var(--text-secondary);">Comité de Ética en Investigación en Seres Humanos & Normativa Unión Europea</span>
              </div>
            </div>

            <div class="protocol-step-box">
              <div class="protocol-step-num">1</div>
              <div>
                <h4 style="margin:0 0 .3rem 0;">Presentación Institucional Obligatoria</h4>
                <p style="font-size:.88rem;color:var(--text-secondary);margin:0;">
                  El encuestador y la nutricionista deben portar visiblemente la <strong>credencial oficial de Ayuda en Acción / ESPOCH</strong> y su chaleco institucional. Presentarse por su nombre indicando que forman parte del proyecto <em>"San Andrés y Manglaralto: Territorios Libres de Desnutrición"</em> financiado por la Unión Europea.
                </p>
              </div>
            </div>

            <div class="protocol-step-box">
              <div class="protocol-step-num">2</div>
              <div>
                <h4 style="margin:0 0 .3rem 0;">Lectura y Explicación del Consentimiento</h4>
                <p style="font-size:.88rem;color:var(--text-secondary);margin:0;">
                  Explicar con lenguaje sencillo y respetuoso a la madre, padre o tutor legal:
                  <ul style="margin:.4rem 0 0 1.25rem;padding:0;font-size:.85rem;color:var(--text-secondary);">
                    <li>El propósito del estudio es conocer la nutrición y salud de los niños entre 0 y 5 años (0 a 59 meses cumplidos) para dirigir programas de apoyo alimentario y agua segura.</li>
                    <li>La participación es <strong>100% voluntaria</strong>. Negarse no afecta ningún beneficio social ni atención en el centro de salud.</li>
                    <li>Los procedimientos físicos (peso y talla) son indoloros y seguros.</li>
                  </ul>
                </p>
              </div>
            </div>

            <div class="protocol-step-box">
              <div class="protocol-step-num">3</div>
              <div>
                <h4 style="margin:0 0 .3rem 0;">Firma o Huella Dactilar</h4>
                <p style="font-size:.88rem;color:var(--text-secondary);margin:0;">
                  Obtener la firma digital en la tableta (pregunta obligatoria en KoBoCollect) o huella digital entintada en la hoja de consentimiento físico. Si el tutor no sabe firmar, se solicita a un testigo comunitario (vecino o promotor).
                </p>
              </div>
            </div>

            <div class="protocol-step-box" style="border-left-color:#ef4444;">
              <div class="protocol-step-num" style="background:#ef4444;">4</div>
              <div>
                <h4 style="margin:0 0 .3rem 0;color:#ef4444;">Protección de Datos Personales (LOPDP)</h4>
                <p style="font-size:.88rem;color:var(--text-secondary);margin:0;">
                  <strong>Prohibición terminante:</strong> Queda estrictamente prohibido fotografiar rostros de niños, compartir nombres completos en chats de WhatsApp o publicar diagnósticos médicos en redes sociales. Cada registro se maneja mediante código de sujeto anonimizado (ej. <code>SA-NIN-0142</code>).
                </p>
              </div>
            </div>

            <!-- Acciones de Descarga e Impresión In Situ -->
            <div style="margin-top:1.75rem;padding:1.25rem;background:var(--bg-tertiary);border-radius:10px;border:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
              <div>
                <h4 style="margin:0 0 0.25rem;color:var(--text-primary);font-size:0.95rem;">📄 Materiales Físicos de Repuesto para Brigadistas</h4>
                <span style="font-size:0.8rem;color:var(--text-secondary);">En caso de agotamiento de formularios impresos durante la jornada de campo</span>
              </div>
              <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
                <button class="btn btn-primary" onclick="ProtocolsModule.printConsentSheet()" style="display:flex;align-items:center;gap:0.4rem;font-weight:600;font-size:0.82rem;">
                  🖨️ Consentimiento CEISH
                </button>
                <button class="btn btn-secondary" onclick="ProtocolsModule.printAnthroCheatSheet()" style="display:flex;align-items:center;gap:0.4rem;font-weight:600;font-size:0.82rem;">
                  📏 Guía de Bolsillo OMS
                </button>
              </div>
            </div>
          </div>
        `;

      case 'antropometria':
        return `
          <div class="card" style="padding:2rem;">
            <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:1.5rem;border-bottom:1px solid var(--border);padding-bottom:1rem;">
              <div style="font-size:2rem;">📏</div>
              <div>
                <h2 style="margin:0;font-size:1.35rem;">Manual Oficial de Medición Antropométrica (Estándar OMS / UNICEF)</h2>
                <span style="font-size:.85rem;color:var(--text-secondary);">Procedimientos técnicos para las 25 duplas de Nutrición ESPOCH en niños entre 0 y 5 años</span>
              </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:1.5rem;">
              <!-- Toma de Peso -->
              <div class="card" style="background:rgba(255,255,255,.02);padding:1.25rem;">
                <h3 style="margin-top:0;color:#10b981;">⚖️ Protocolo de Pesaje (Balanza SECA 874 / 878)</h3>
                <ul style="font-size:.85rem;color:var(--text-secondary);line-height:1.6;padding-left:1.25rem;">
                  <li><strong>Calibración:</strong> Colocar sobre superficie nivelada y dura (nivel de burbuja centrado). Calibrar diariamente con pesa patrón de 5.0 kg.</li>
                  <li><strong>Vestimenta:</strong> El niño debe estar con ropa mínima (solo pañal limpio o ropa interior muy ligera).</li>
                  <li><strong>Función 2 en 1 (Tara Madre-Hijo):</strong> Para bebés menores de 1 año o niños inquietos, pesar a la madre primero, activar botón TARA, y luego pasarle el niño en brazos para lectura exacta directa.</li>
                  <li><strong>Precisión:</strong> Registrar el peso en kilogramos con un decimal (ej. <code>9.4 kg</code>; resolución 100 g).</li>
                </ul>
              </div>

              <!-- Toma de Talla -->
              <div class="card" style="background:rgba(255,255,255,.02);padding:1.25rem;">
                <h3 style="margin-top:0;color:#3b82f6;">📐 Protocolo de Talla / Longitud (Infantómetro SECA 417 / Tallímetro)</h3>
                <ul style="font-size:.85rem;color:var(--text-secondary);line-height:1.6;padding-left:1.25rem;">
                  <li><strong>Menores de 2 años (< 24 meses o < 87 cm):</strong>
                    <br>Medir <strong>Longitud Acostado (Decúbito Supino)</strong> en infantómetro. Asistente sujeta la cabeza en plano de Frankfurt vertical. Nutricionista estira rodillas y presiona suavemente el tope móvil contra ambos talones.
                  </li>
                  <li><strong>Mayores de 2 años (≥ 24 meses / 2 a 4 años cumplidos):</strong>
                    <br>Medir <strong>Estatura de Pie (Bipedestación)</strong> en tallímetro. 5 puntos de apoyo: talones, pantorrillas, glúteos, escápulas y occipucio. Cabeza en <em>Plano de Frankfurt</em> horizontal.
                  </li>
                  <li><strong>Lectura:</strong> Registrar en centímetros con un decimal exacto (ej. <code>82.5 cm</code>).</li>
                </ul>
              </div>
            </div>

            <!-- Regla Canónica de Corrección OMS de ±0.7 cm -->
            <div style="background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.3);border-radius:10px;padding:1.25rem;margin-bottom:1.5rem;">
              <h4 style="margin:0 0 .5rem 0;color:#3b82f6;">⚙️ Regla Canónica OMS de Ajuste por Posición (±0.7 cm):</h4>
              <p style="font-size:.85rem;color:var(--text-secondary);margin:0;line-height:1.6;">
                • Si un niño <strong>menor de 24 meses</strong> fue medido <strong>de pie</strong>: el motor <code>WHOAnthro</code> añade automáticamente <strong>+0.7 cm</strong> para equiparar a longitud supina.<br>
                • Si un niño de <strong>24 meses o más</strong> fue medido <strong>acostado</strong>: el sistema resta automáticamente <strong>-0.7 cm</strong> para equiparar a estatura de pie.<br>
                <em>Esta corrección está automatizada en el cálculo de z-scores para garantizar comparabilidad internacional.</em>
              </p>
            </div>

            <!-- Semiología de Edema Bilateral Nutricional -->
            <div style="background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.3);border-radius:10px;padding:1.25rem;margin-bottom:1.5rem;">
              <h4 style="margin:0 0 .5rem 0;color:#ef4444;">🩺 Protocolo Clínico: Detección de Edema Bilateral Nutricional</h4>
              <p style="font-size:.85rem;color:var(--text-secondary);margin:0;line-height:1.6;">
                1. <strong>Técnica de Fóvea:</strong> Presione con ambos pulgares durante <strong>3 segundos</strong> sobre el dorso de ambos pies del niño.<br>
                2. <strong>Diagnóstico de Kwashiorkor:</strong> Si la fóvea (hendidura) persiste en <em>ambos</em> pies al retirar los dedos, existe edema nutricional bilateral.<br>
                3. <strong>Efecto en Indicadores:</strong> La presencia de edema clasifica automáticamente al niño como <strong>Desnutrición Aguda Severa (SAM)</strong>. Por protocolo OMS, los z-scores de peso (WAZ, WHZ, BAZ) se marcan como no calculables para no enmascarar la desnutrición debido a la retención de líquidos.
              </p>
            </div>

            <!-- Estandarización TEM y Banderas Biológicas -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;">
              <!-- Banderas Biológicas OMS -->
              <div style="background:rgba(232,115,74,.08);border:1px solid rgba(232,115,74,.3);border-radius:10px;padding:1.25rem;">
                <h4 style="margin:0 0 .5rem 0;color:#E8734A;">🛑 Banderas Biológicas OMS (Biological Flags):</h4>
                <p style="font-size:.83rem;color:var(--text-secondary);margin:0;line-height:1.5;">
                  • <strong>HAZ Flag:</strong> z < -6.0 o z > +6.0 (Talla inverosímil para la edad)<br>
                  • <strong>WAZ Flag:</strong> z < -6.0 o z > +5.0 (Peso inverosímil para la edad)<br>
                  • <strong>WHZ / BAZ Flag:</strong> z < -5.0 o z > +5.0 (Desproporción peso/talla)<br>
                  <em>Si una bandera se activa, KoBo emite advertencia de revisión antes del envío.</em>
                </p>
              </div>

              <!-- Error Técnico de Medición (TEM) -->
              <div style="background:rgba(16,185,129,.08);border:1px solid rgba(16,185,129,.3);border-radius:10px;padding:1.25rem;">
                <h4 style="margin:0 0 .5rem 0;color:#10b981;">🎯 Certificación de Duplas (Error Técnico TEM):</h4>
                <p style="font-size:.83rem;color:var(--text-secondary);margin:0;line-height:1.5;">
                  • <strong>Fórmula TEM:</strong> <code>√[ Σ(d²) / (2N) ]</code> donde d es la diferencia entre mediciones pareadas.<br>
                  • <strong>Criterio de Certificación ESPOCH:</strong> <code>%TEM ≤ 1.5%</code> para longitud/talla y <code>%TEM ≤ 2.0%</code> para peso.<br>
                  • Las 25 duplas deben aprobar el TEM previo al despliegue en campo.
                </p>
              </div>
            </div>
          </div>
        `;

      case 'kobo':
        return `
          <div class="card" style="padding:2rem;">
            <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:1.5rem;border-bottom:1px solid var(--border);padding-bottom:1rem;">
              <div style="font-size:2rem;">📱</div>
              <div>
                <h2 style="margin:0;font-size:1.35rem;">Guía Operativa KoBoCollect & Reconciliación de Viviendas</h2>
                <span style="font-size:.85rem;color:var(--text-secondary);">Flujo de trabajo para tabletas y smartphones en terreno</span>
              </div>
            </div>

            <div class="protocol-step-box">
              <div class="protocol-step-num">A</div>
              <div>
                <h4 style="margin:0 0 .3rem 0;">Apertura con Enlace Prellenado (Deeplink)</h4>
                <p style="font-size:.88rem;color:var(--text-secondary);margin:0;">
                  Al llegar a la vivienda, abra esta web, ubique el punto en el mapa y pulse <strong>"📋 Iniciar Encuesta en KoBoCollect"</strong>. El formulario se abrirá automáticamente con el <code>id_vivienda_ia</code> (ej. <code>SA-VIV-0042</code>) y el nombre de la comunidad ya completados, evitando errores de digitación.
                </p>
              </div>
            </div>

            <div class="protocol-step-box">
              <div class="protocol-step-num">B</div>
              <div>
                <h4 style="margin:0 0 .3rem 0;">Captura GPS en la Puerta del Domicilio</h4>
                <p style="font-size:.88rem;color:var(--text-secondary);margin:0;">
                  Active la ubicación GPS del móvil. En la pregunta de geolocalización de KoBoCollect, espere a que la precisión baje de <strong>10 metros</strong> antes de guardar el punto. Esto certifica la visita <em>in situ</em> para las auditorías de la Unión Europea.
                </p>
              </div>
            </div>

            <div class="protocol-step-box">
              <div class="protocol-step-num">C</div>
              <div>
                <h4 style="margin:0 0 .3rem 0;">Protocolo ante Vivienda Deshabitada o Rechazo</h4>
                <p style="font-size:.88rem;color:var(--text-secondary);margin:0;">
                  • <strong>Casa Vacía:</strong> Realizar un segundo intento en horario alterno (tarde o fin de semana). Si tras 2 visitas no hay respuesta, marcar como <em>"Deshabitada / No responde"</em>.<br>
                  • <strong>Rechazo:</strong> Respetar la decisión del hogar con amabilidad. No insistir. Registrar el motivo de rechazo en el formulario.<br>
                  • <strong>Reemplazo:</strong> Solicitar al supervisor la asignación de la vivienda de reserva oficial pre-sorteada. <strong>Nunca encuestar la casa vecina por cuenta propia</strong> para no sesgar la muestra.
                </p>
              </div>
            </div>

            <div class="protocol-step-box">
              <div class="protocol-step-num">D</div>
              <div>
                <h4 style="margin:0 0 .3rem 0;">Sincronización al Retornar al Punto Base</h4>
                <p style="font-size:.88rem;color:var(--text-secondary);margin:0;">
                  Al descender del páramo y recuperar cobertura WiFi o 4G, abrir KoBoCollect y pulsar <strong>"Enviar formularios finalizados"</strong>. Luego, el supervisor pulsará <em>"Sincronizar KoBo API"</em> en esta web para ver reflejado el avance en el mapa general.
                </p>
              </div>
            </div>
          </div>
        `;

      case 'seguridad':
        return `
          <div class="card" style="padding:2rem;">
            <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:1.5rem;border-bottom:1px solid var(--border);padding-bottom:1rem;">
              <div style="font-size:2rem;">🚨</div>
              <div>
                <h2 style="margin:0;font-size:1.35rem;">Seguridad en Páramo y Directorio de Emergencia</h2>
                <span style="font-size:.85rem;color:var(--text-secondary);">Protocolo de prevención en alturas andinas y canales de auxilio rápido</span>
              </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:1.5rem;">
              <div class="card" style="background:rgba(255,255,255,.02);padding:1.25rem;">
                <h3 style="margin-top:0;color:#f59e0b;">🏔️ Normas de Prevención en el Páramo</h3>
                <ul style="font-size:.85rem;color:var(--text-secondary);line-height:1.6;padding-left:1.25rem;">
                  <li><strong>Trabajo en Parejas:</strong> Ningún encuestador se desplaza solo. Siempre deben estar en binomio (1 encuestador + 1 nutricionista o promotor local).</li>
                  <li><strong>Ventana Horaria Segura:</strong> Las caminatas en comunidades altas (Pulinguí, Trencilla, San Pablo) deben realizarse entre <strong>08:30 y 16:00</strong> para evitar frío extremo, neblina densa y lluvias vespertinas.</li>
                  <li><strong>Equipamiento Personal:</strong> Ropa térmica abrigada, poncho impermeable, calzado de montaña con suela antideslizante, gorro para el frío y protector solar SPF 50+.</li>
                  <li><strong>Batería de Respaldo:</strong> Portar powerbank cargado al 100% para las tabletas y celulares.</li>
                </ul>
              </div>

              <!-- Directorio de Emergencias con Enlaces tel: -->
              <div class="card" style="background:rgba(255,255,255,.02);padding:1.25rem;">
                <h3 style="margin-top:0;color:#ef4444;">📞 Directorio Telefónico de Emergencia</h3>
                <div style="display:flex;flex-direction:column;gap:.6rem;font-size:.85rem;">
                  <div style="display:flex;justify-content:space-between;align-items:center;padding:.5rem;background:rgba(255,255,255,.04);border-radius:6px;">
                    <div>
                      <strong>Juan Diego Román</strong>
                      <div style="font-size:.75rem;color:var(--text-secondary);">Coordinador de Campo AeA</div>
                    </div>
                    <a href="tel:0998123456" class="btn btn-primary btn-sm" style="text-decoration:none;">📞 Llamar</a>
                  </div>

                  <div style="display:flex;justify-content:space-between;align-items:center;padding:.5rem;background:rgba(255,255,255,.04);border-radius:6px;">
                    <div>
                      <strong>Dennys Rojas / CIO</strong>
                      <div style="font-size:.75rem;color:var(--text-secondary);">Soporte Técnico y GIS</div>
                    </div>
                    <a href="tel:0987234567" class="btn btn-secondary btn-sm" style="text-decoration:none;">📞 Llamar</a>
                  </div>

                  <div style="display:flex;justify-content:space-between;align-items:center;padding:.5rem;background:rgba(255,255,255,.04);border-radius:6px;">
                    <div>
                      <strong>Centro de Salud San Andrés</strong>
                      <div style="font-size:.75rem;color:var(--text-secondary);">Atención Médica de Urgencia</div>
                    </div>
                    <a href="tel:032901234" class="btn btn-secondary btn-sm" style="text-decoration:none;">📞 Llamar</a>
                  </div>

                  <div style="display:flex;justify-content:space-between;align-items:center;padding:.5rem;background:rgba(255,255,255,.04);border-radius:6px;">
                    <div>
                      <strong>UPC Policía San Andrés</strong>
                      <div style="font-size:.75rem;color:var(--text-secondary);">Seguridad y Rescate</div>
                    </div>
                    <a href="tel:911" class="btn btn-secondary btn-sm" style="text-decoration:none;color:#ef4444;">🚨 911</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;

      case 'kichwa':
        return `
          <div class="card" style="padding:2rem;">
            <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:1.5rem;border-bottom:1px solid var(--border);padding-bottom:1rem;">
              <div style="font-size:2rem;">🗣️</div>
              <div>
                <h2 style="margin:0;font-size:1.35rem;">Glosario Kichwa Chimborazo para Diálogo Comunitario</h2>
                <span style="font-size:.85rem;color:var(--text-secondary);">Expresiones clave para facilitar el contacto empático con familias rurales</span>
              </div>
            </div>

            <p style="font-size:.88rem;color:var(--text-secondary);margin-bottom:1.5rem;">
              En las comunidades de la parte alta de San Andrés, iniciar el diálogo en la lengua materna genera confianza inmediata con las madres y abuelas cuidadoras.
            </p>

            <div style="overflow-x:auto;">
              <table class="data-table" style="width:100%;">
                <thead>
                  <tr>
                    <th>Expresión en Kichwa</th>
                    <th>Significado en Español</th>
                    <th>Contexto de Uso en Terreno</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="font-weight:700;color:#E8734A;">Allillachu mashikuna?</td>
                    <td>¿Cómo están, compañeros/familias?</td>
                    <td>Saludo inicial al llegar a la vivienda.</td>
                  </tr>
                  <tr>
                    <td style="font-weight:700;color:#E8734A;">Allillamari / Allillami</td>
                    <td>Estoy bien / Todo bien</td>
                    <td>Respuesta habitual de la familia.</td>
                  </tr>
                  <tr>
                    <td style="font-weight:700;color:#E8734A;">Imatak kamba shutika?</td>
                    <td>¿Cómo te llamas?</td>
                    <td>Pregunta para conocer el nombre de la madre.</td>
                  </tr>
                  <tr>
                    <td style="font-weight:700;color:#E8734A;">Wawata pishakrinchi</td>
                    <td>Vamos a pesar al niño/bebé</td>
                    <td>Para invitar a subir a la balanza.</td>
                  </tr>
                  <tr>
                    <td style="font-weight:700;color:#E8734A;">Wawata tupukrinchi</td>
                    <td>Vamos a medir al niño/bebé</td>
                    <td>Para acostar o parar al niño en el tallímetro.</td>
                  </tr>
                  <tr>
                    <td style="font-weight:700;color:#E8734A;">Ama mancharichu, allimi kan</td>
                    <td>No tenga miedo, está bien / no duele</td>
                    <td>Para calmar al niño o a la madre.</td>
                  </tr>
                  <tr>
                    <td style="font-weight:700;color:#E8734A;">Yaku tiyanchu?</td>
                    <td>¿Tienen agua?</td>
                    <td>Pregunta del cuestionario sobre acceso a agua.</td>
                  </tr>
                  <tr>
                    <td style="font-weight:700;color:#E8734A;">Yupaychani mama / tayta</td>
                    <td>Muchas gracias señora / señor</td>
                    <td>Agradecimiento al terminar la encuesta.</td>
                  </tr>
                  <tr>
                    <td style="font-weight:700;color:#E8734A;">Kayakaman</td>
                    <td>Hasta mañana / Hasta luego</td>
                    <td>Despedida cordial de la vivienda.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        `;

            case 'formularios_tooltips':
        return this._renderFormTooltipsTab();
      default:
        return '';
    }
  },

  printConsentSheet() {
    const w = window.open('', '_blank', 'width=900,height=950');
    if (!w) {
      alert('Habilite ventanas emergentes para imprimir la hoja de consentimiento informado.');
      return;
    }
    w.document.write(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Consentimiento y Asentimiento Informado CEISH-ESPOCH | Ayuda en Acción</title>
        <style>
          @page { size: A4 portrait; margin: 8mm 12mm; }
          * { box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Arial, sans-serif;
            font-size: 8.5pt;
            line-height: 1.35;
            color: #1e293b;
            padding: 10px 20px;
            margin: 0;
            background: #ffffff;
          }
          .inst-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 2.5px solid #E8734A;
            padding-bottom: 8px;
            margin-bottom: 8px;
          }
          .inst-logo {
            height: 48px;
            max-width: 190px;
            object-fit: contain;
          }
          .inst-titles {
            text-align: center;
            flex: 1;
            padding: 0 10px;
          }
          .inst-titles h1 {
            font-size: 11pt;
            margin: 0;
            color: #3C2415;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }
          .inst-titles h2 {
            font-size: 9pt;
            margin: 2px 0 0;
            color: #E8734A;
            font-weight: 700;
          }
          .inst-titles .sub {
            font-size: 7.5pt;
            color: #64748b;
            margin-top: 1px;
          }
          .ceish-badge {
            text-align: right;
            font-size: 7.2pt;
            color: #334155;
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            padding: 4px 8px;
            border-radius: 6px;
            line-height: 1.3;
          }
          .doc-title {
            text-align: center;
            background: #3C2415;
            color: #ffffff;
            font-size: 9pt;
            font-weight: 800;
            letter-spacing: 0.5px;
            padding: 4px 8px;
            border-radius: 4px;
            margin-bottom: 8px;
            text-transform: uppercase;
          }
          .table-trace {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 8px;
            font-size: 8pt;
          }
          .table-trace td {
            border: 1px solid #cbd5e1;
            padding: 4px 6px;
            background: #f8fafc;
          }
          .section-title {
            font-size: 8.5pt;
            font-weight: 800;
            color: #3C2415;
            border-left: 3px solid #E8734A;
            padding-left: 6px;
            margin: 6px 0 4px 0;
            text-transform: uppercase;
          }
          .info-block {
            font-size: 8pt;
            text-align: justify;
            margin-bottom: 6px;
            color: #1e293b;
          }
          .info-block p {
            margin: 0 0 4px 0;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6px;
            margin-bottom: 6px;
          }
          .info-card {
            border: 1px solid #e2e8f0;
            background: #fcfcfc;
            border-radius: 4px;
            padding: 5px 8px;
            font-size: 7.8pt;
          }
          .info-card strong {
            color: #E8734A;
          }
          .assent-box {
            border: 1px dashed #E8734A;
            background: rgba(232, 115, 74, 0.04);
            border-radius: 6px;
            padding: 5px 8px;
            margin-bottom: 6px;
            font-size: 8pt;
          }
          .tutor-data {
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            padding: 6px 8px;
            margin-bottom: 8px;
            background: #f8fafc;
            font-size: 8pt;
          }
          .sig-container {
            display: grid;
            grid-template-columns: 1.2fr 1fr;
            gap: 15px;
            margin-top: 8px;
          }
          .sig-card {
            border: 1px solid #94a3b8;
            border-radius: 6px;
            padding: 8px;
            text-align: center;
            font-size: 7.8pt;
            background: #ffffff;
          }
          .fingerprint-box {
            width: 44px;
            height: 52px;
            border: 1.5px dashed #94a3b8;
            border-radius: 4px;
            margin: 4px auto;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #94a3b8;
            font-size: 6.8pt;
            line-height: 1.1;
          }
          .sig-line {
            border-top: 1px solid #334155;
            margin-top: 28px;
            padding-top: 4px;
          }
          .footer-notes {
            margin-top: 8px;
            padding-top: 6px;
            border-top: 1px solid #e2e8f0;
            font-size: 7pt;
            color: #64748b;
            display: flex;
            justify-content: space-between;
          }
          .print-bar {
            margin-bottom: 12px;
            display: flex;
            justify-content: flex-end;
            gap: 10px;
          }
          @media print {
            .print-bar { display: none; }
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="print-bar">
          <button onclick="window.print()" style="background:#E8734A;color:white;border:none;padding:8px 18px;border-radius:6px;font-weight:800;font-size:0.9rem;cursor:pointer;display:inline-flex;align-items:center;gap:6px;box-shadow:0 2px 6px rgba(232,115,74,0.3);">
            <span>🖨️</span> Imprimir Formulario Oficial (A4)
          </button>
        </div>

        <!-- Encabezado Institucional -->
        <div class="inst-header">
          <img src="AEA-Imagotipo-naranja-ayuda-pantalla-4000x.png" alt="Ayuda en Acción" class="inst-logo" onerror="this.style.display='none';">
          <div class="inst-titles">
            <h1>Escuela Superior Politécnica de Chimborazo</h1>
            <h2>Facultad de Salud Pública • Carrera de Nutrición y Dietética</h2>
            <div class="sub">En Convenio con la Fundación Ayuda en Acción Ecuador & GAD Parroquial San Andrés</div>
          </div>
          <div class="ceish-badge">
            <strong>COMITÉ DE ÉTICA CEISH-ESPOCH</strong><br>
            Acreditación MSP / DIS / CONASA<br>
            <strong>Res. CEISH-ESPOCH-2026-DCI-001</strong>
          </div>
        </div>

        <div class="doc-title">
          Formulario Oficial de Consentimiento Informado y Asentimiento Bioético
        </div>

        <!-- Trazabilidad del Sujeto y Vivienda -->
        <table class="table-trace">
          <tr>
            <td style="width:25%;"><strong>Código de Vivienda:</strong> _________________</td>
            <td style="width:25%;"><strong>Código Niño/a (Anon.):</strong> SA-NIN-_______</td>
            <td style="width:25%;"><strong>Comunidad PDOT:</strong> ___________________</td>
            <td style="width:25%;"><strong>Fecha:</strong> _____ / _____ / 2026</td>
          </tr>
          <tr>
            <td colspan="2"><strong>Dupla Censal Responsable:</strong> Dupla N° ______</td>
            <td colspan="2"><strong>Equipo Antropométrico:</strong> Balanza SECA 874 / Tallímetro SECA 417 / Cinta MUAC UNICEF</td>
          </tr>
        </table>

        <!-- Sección 1: Información Bioética del Estudio -->
        <div class="section-title">1. Hoja de Información al Padre, Madre o Tutor Legal (Estándares OMS / UNICEF / MSP)</div>
        <div class="info-block">
          <p>
            Le invitamos a participar en el estudio científico y de salud pública: <em>"Caracterización Georreferenciada de la Población Infantil (0 a 5 años) para la Prevención y Reducción de la Desnutrición Crónica Infantil en San Andrés"</em> (Componente A.3.1). Su decisión de participar o no es enteramente libre y voluntaria.
          </p>
        </div>

        <div class="info-grid">
          <div class="info-card">
            <strong>• ¿En qué consiste el estudio?</strong> Consiste en una valoración nutricional no invasiva del niño(a) mediante medición de peso (balanza digital), talla/longitud (tallímetro de madera), circunferencia braquial (cinta MUAC) y descarte de edema bilateral, junto con preguntas sobre el hogar y alimentación.
          </div>
          <div class="info-card">
            <strong>• Riesgos y Molestias:</strong> Los procedimientos son 100% indoloros y seguros. No se extrae sangre ni se administran sustancias. Si el menor llora o siente temor, se respetará su estado pausando la medición de inmediato.
          </div>
          <div class="info-card">
            <strong>• Beneficios Directos:</strong> La familia recibirá al instante los resultados del estado nutricional de su hijo(a). Si se identifica desnutrición aguda o severa, la brigada gestionará la derivación médica prioritaria al Centro de Salud de San Andrés (MSP).
          </div>
          <div class="info-card">
            <strong>• Confidencialidad y LOPDP:</strong> Conforme a la Ley Orgánica de Protección de Datos Personales, la identidad del infante se mantendrá en estricta reserva bajo código alfanumérico. La negativa no afectará bonos ni atenciones públicas.
          </div>
        </div>

        <!-- Sección 2: Asentimiento Verbal del Infante -->
        <div class="section-title">2. Asentimiento Verbal del Infante (Aplica a niños entre 2 y 5 años)</div>
        <div class="assent-box">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span>
              <em>"Hola, queremos saber cuánto has crecido pesándote y midiéndote con tu mamita/papito. ¿Nos permites hacerlo?"</em> (Diálogo adaptado en Kichwa según pertinencia cultural).
            </span>
            <span style="font-weight:700;white-space:nowrap;margin-left:10px;">
              [ &nbsp; ] Asentimiento Obtenido &nbsp;&nbsp; [ &nbsp; ] Niño No Colaborador
            </span>
          </div>
        </div>

        <!-- Sección 3: Declaración de Consentimiento del Tutor -->
        <div class="section-title">3. Declaración de Consentimiento del Representante Legal</div>
        <div class="tutor-data">
          <div style="margin-bottom:4px;">
            Yo, ____________________________________________________________________, con Cédula/Identificación: ________________________,
            en calidad de: ( &nbsp; ) Madre &nbsp; ( &nbsp; ) Padre &nbsp; ( &nbsp; ) Tutor Legal &nbsp; | &nbsp; Celular / Contacto: ________________________
          </div>
          <div style="margin-bottom:4px;">
            del niño(a): ___________________________________________________________, nacido el: _____ / _____ / ________ (Edad: ____ meses),
          </div>
          <div style="font-style:italic;color:#334155;margin-top:4px;font-size:7.5pt;">
            Declaro haber leído (o me ha sido explicado en mi lengua materna) la naturaleza, procedimientos, beneficios y confidencialidad del proyecto DCI. He formulado preguntas y han sido absueltas satisfactoriamente. Otorgo mi consentimiento libre e informado para su valoración.
          </div>
        </div>

        <!-- Sección 4: Firmas y Huella Dactilar -->
        <div class="sig-container">
          <div class="sig-card">
            <div style="font-weight:700;margin-bottom:2px;">Representante Legal (Madre / Padre / Tutor)</div>
            <div style="display:flex;align-items:center;justify-content:space-around;">
              <div style="flex:1;">
                <div class="sig-line">
                  Firma del Representante Legal<br>
                  C.I.: __________________________
                </div>
              </div>
              <div style="margin-left:10px;">
                <div class="fingerprint-box">
                  Huella<br>Pulgar<br>Derecho
                </div>
              </div>
            </div>
          </div>

          <div class="sig-card">
            <div style="font-weight:700;margin-bottom:2px;">Brigadista Responsable / Certificado TEM</div>
            <div class="sig-line" style="margin-top:38px;">
              Firma del Encuestador / Antropometrista<br>
              C.I.: __________________________ | Dupla: D______
            </div>
          </div>
        </div>

        <!-- Contactos y Pie Institucional -->
        <div class="footer-notes">
          <div>
            <strong>Supervisión Docente CEISH:</strong> ND. Verónica Delgado López • Tel: 0994645682 • veronica.delgado@espoch.edu.ec
          </div>
          <div>
            <strong>Comité de Ética:</strong> CEISH - ESPOCH, Riobamba • Tel: (03) 2998-200 Ext. 2101
          </div>
          <div>
            Versión Oficial v2.5.1 (A.3.1 DCI)
          </div>
        </div>

      </body>
      </html>
    `);
    w.document.close();
  },

  printAnthroCheatSheet() {
    const w = window.open('', '_blank', 'width=850,height=800');
    if (!w) {
      alert('Habilite ventanas emergentes para imprimir la guía de bolsillo.');
      return;
    }
    w.document.write(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Guía de Bolsillo Antropometría OMS - Proyecto DCI</title>
        <style>
          @page { size: A4; margin: 15mm; }
          body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 9.5pt; color: #1e293b; padding: 20px; line-height: 1.4; }
          h1 { color: #3C2415; font-size: 13pt; margin: 0 0 4px; text-transform: uppercase; }
          h2 { color: #E8734A; font-size: 10.5pt; margin: 0 0 15px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
          th { background: #3C2415; color: white; padding: 6px; font-size: 8.5pt; text-align: left; }
          td { border: 1px solid #cbd5e1; padding: 6px; font-size: 8.5pt; }
          .rule { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 8px 12px; margin-bottom: 12px; font-size: 8.5pt; }
          .print-bar { margin-bottom: 15px; text-align: right; }
          @media print { .print-bar { display: none; } body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="print-bar">
          <button onclick="window.print()" style="background:#E8734A;color:white;border:none;padding:8px 16px;border-radius:4px;font-weight:700;cursor:pointer;">🖨️ Imprimir Guía de Bolsillo</button>
        </div>
        <h1>Guía Rápida de Medición Antropométrica (OMS / ESPOCH)</h1>
        <h2>Valores de Corte Z-Score y Semiología en Campo</h2>
        
        <div class="rule">
          <strong>Regla de Posición OMS:</strong> &lt; 24 meses o &lt; 87 cm: Longitud en <strong>Decúbito Supino</strong>. ≥ 24 meses: Estatura en <strong>Bipedestación</strong> (5 puntos de apoyo y plano de Frankfurt). Corrección de ±0.7 cm aplicada si no coincide posición con edad.
        </div>

        <table>
          <thead>
            <tr>
              <th>Indicador</th>
              <th>Punto de Corte Z</th>
              <th>Clasificación Clínica</th>
              <th>Acción Operativa</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Talla para la Edad (HAZ)</strong></td>
              <td>&lt; -2 DE (&lt; -3 DE severo)</td>
              <td>Retraso en Talla / Desnutrición Crónica</td>
              <td>Notificar a centro de salud local y tutor</td>
            </tr>
            <tr>
              <td><strong>Peso para la Talla (WHZ)</strong></td>
              <td>&lt; -2 DE (&lt; -3 DE severo)</td>
              <td>Emaciación / Desnutrición Aguda</td>
              <td>Alerta inmediata a supervisor de brigada</td>
            </tr>
            <tr>
              <td><strong>Peso para la Edad (WAZ)</strong></td>
              <td>&lt; -2 DE (&lt; -3 DE severo)</td>
              <td>Bajo Peso Global</td>
              <td>Registro y seguimiento en ficha clínica</td>
            </tr>
            <tr>
              <td><strong>Edema Bilateral</strong></td>
              <td>Presencia de fóvea en ambos pies</td>
              <td>Desnutrición Aguda Severa (Kwashiorkor)</td>
              <td>Derivación médica prioritaria al C.S. San Andrés</td>
            </tr>
          </tbody>
        </table>

        <div style="margin-top:20px;font-size:8pt;color:#64748b;border-top:1px solid #cbd5e1;padding-top:8px;">
          Proyecto DCI - Componente A.3.1 | Fundación Ayuda en Acción & ESPOCH | Versión Oficial v2.4.0
        </div>
      </body>
      </html>
    `);
    w.document.close();
  }
,


  // ---------------------------------------------------------------------------
  // VISOR INTERACTIVO DE FORMULARIOS, TOOLTIPS Y DIÁLOGOS KICHWA
  // ---------------------------------------------------------------------------
  selectedFormPreview: 'antro',

  switchFormPreview(formType) {
    this.selectedFormPreview = formType;
    const area = document.getElementById('form-tooltips-cards-container');
    if (area) {
      area.innerHTML = this._renderQuestionsCards(formType);
    }
    const btnAntro = document.getElementById('btn-select-form-antro');
    const btnSocio = document.getElementById('btn-select-form-socio');
    if (btnAntro && btnSocio) {
      if (formType === 'antro') {
        btnAntro.style.background = '#10b981';
        btnAntro.style.color = '#fff';
        btnSocio.style.background = 'var(--bg-tertiary)';
        btnSocio.style.color = 'var(--text-primary)';
      } else {
        btnSocio.style.background = '#3b82f6';
        btnSocio.style.color = '#fff';
        btnAntro.style.background = 'var(--bg-tertiary)';
        btnAntro.style.color = 'var(--text-primary)';
      }
    }
  },

  filterTooltipsQuestions(keyword) {
    const term = (keyword || '').toLowerCase().trim();
    const cards = document.querySelectorAll('.tooltip-question-card');
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      if (!term || text.includes(term)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  },

  _renderFormTooltipsTab() {
    const isAntro = this.selectedFormPreview === 'antro';
    return `
      <div class="card" style="padding:2rem;">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;margin-bottom:1.5rem;border-bottom:1px solid var(--border);padding-bottom:1rem;">
          <div style="display:flex;align-items:center;gap:.75rem;">
            <div style="font-size:2.2rem;">💡</div>
            <div>
              <h2 style="margin:0;font-size:1.35rem;color:var(--text-primary);">
                Visor Interactivo de Preguntas, Tooltips & Kichwa Puruhá
              </h2>
              <span style="font-size:.85rem;color:var(--text-secondary);">
                Instrumentos XLSForm v2.2 Oficiales (MPE-INEC 2.0 / OMS / CEISH-ESPOCH)
              </span>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:0.5rem;">
            <span class="badge" style="background:#10b981;color:white;font-weight:700;">54 Brigadistas con Cédula</span>
            <span class="badge" style="background:#8b5cf6;color:white;font-weight:700;">Kichwa Activo</span>
            <span class="badge" style="background:#ef4444;color:white;font-weight:700;">Banderas Rojas OMS</span>
          </div>
        </div>

        <div style="background:var(--bg-tertiary);border-left:4px solid var(--accent);border-radius:8px;padding:1rem 1.25rem;margin-bottom:1.5rem;font-size:0.86rem;line-height:1.5;color:var(--text-secondary);">
          <strong>🎯 Novedades de la Versión v2.2:</strong>
          <ul style="margin:0.4rem 0 0 1.2rem;padding:0;">
            <li><strong>Selección de Dupla por Cédula / Nombre:</strong> Los estudiantes ya no memorizan su código de dupla (D01-D25); seleccionan directamente su cédula o apellidos con autocompletado del padrón oficial ESPOCH.</li>
            <li><strong>Tooltips y Guiones Kichwa Visibles:</strong> Cada pregunta clave despliega su tooltip operativo en español y la formulación fonética en Kichwa Puruhá para diálogo respetuoso en comunidades rurales.</li>
            <li><strong>Universalización de Encuesta de Hogar:</strong> Se ejecuta completa en todos los hogares, registrando conteo numérico de integrantes y datos de jefatura de familia.</li>
          </ul>
        </div>

        <!-- Selector de Formulario -->
        <div style="display:flex;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap;align-items:center;justify-content:space-between;">
          <div style="display:flex;gap:0.75rem;">
            <button id="btn-select-form-antro" class="btn" onclick="ProtocolsModule.switchFormPreview('antro')" style="background:${isAntro ? '#10b981' : 'var(--bg-tertiary)'};color:${isAntro ? '#fff' : 'var(--text-primary)'};border:1px solid var(--border);font-weight:700;padding:0.6rem 1.2rem;display:flex;align-items:center;gap:0.5rem;border-radius:8px;cursor:pointer;">
              📏 Formulario 2: Antropometría y Nutrición OMS
            </button>
            <button id="btn-select-form-socio" class="btn" onclick="ProtocolsModule.switchFormPreview('socio')" style="background:${!isAntro ? '#3b82f6' : 'var(--bg-tertiary)'};color:${!isAntro ? '#fff' : 'var(--text-primary)'};border:1px solid var(--border);font-weight:700;padding:0.6rem 1.2rem;display:flex;align-items:center;gap:0.5rem;border-radius:8px;cursor:pointer;">
              🏡 Formulario 1: Caracterización y Sociodemográfico
            </button>
          </div>

          <div style="min-width:280px;">
            <input type="text" placeholder="🔍 Filtrar preguntas o Kichwa..." onkeyup="ProtocolsModule.filterTooltipsQuestions(this.value)" style="width:100%;padding:0.55rem 0.85rem;border-radius:8px;border:1px solid var(--border);background:var(--bg-primary);color:var(--text-primary);font-size:0.85rem;">
          </div>
        </div>

        <!-- Contenedor Dinámico de Preguntas -->
        <div id="form-tooltips-cards-container">
          ${this._renderQuestionsCards(this.selectedFormPreview)}
        </div>
      </div>
    `;
  },

  _renderQuestionsCards(formType) {
    if (formType === 'antro') {
      return `
        <div style="display:flex;flex-direction:column;gap:1.25rem;">
          
          <!-- Pregunta 1: Brigadistas con Cédula -->
          <div class="card tooltip-question-card" style="border:1px solid var(--border);border-radius:12px;padding:1.25rem;background:var(--bg-secondary);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
              <span class="badge" style="background:#10b981;color:white;font-weight:800;">OP-001a & OP-001b</span>
              <span style="font-size:0.75rem;font-family:monospace;color:var(--text-muted);">select_one lista_brigadistas (autocomplete)</span>
            </div>
            <h3 style="font-size:1.05rem;font-weight:700;color:var(--text-primary);margin:0 0 0.5rem 0;">
              Identificación de Brigadistas de la Dupla (Cédula y Nombre Oficial ESPOCH)
            </h3>
            <p style="font-size:0.83rem;color:var(--text-secondary);margin-bottom:1rem;">
              Sustituye la memorización obligatoria del código de dupla (D01-D25). Cada estudiante busca su cédula o apellidos en la lista oficial de 51 estudiantes politécnicos y 3 supervisores de campo.
            </p>

            <div style="background:var(--bg-tertiary);border-radius:8px;padding:0.85rem;border:1px dashed var(--border);margin-bottom:1rem;">
              <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;margin-bottom:0.3rem;">Simulación de Widget en Dispositivo:</div>
              <div style="display:flex;gap:1rem;flex-wrap:wrap;">
                <div style="flex:1;min-width:240px;">
                  <label style="font-size:0.78rem;font-weight:700;display:block;margin-bottom:0.25rem;">Brigadista 1 (Medidor Titular):</label>
                  <select style="width:100%;padding:0.45rem;border-radius:6px;border:1px solid var(--border);background:var(--bg-primary);color:var(--text-primary);font-size:0.82rem;">
                    <option>1850945054 - BALSECA QUESADA DANIELA ALEJANDRA (PAO 6)</option>
                    <option>0250042165 - APUNTE ALDAS FLORCITA ALEJANDRA (PAO 5)</option>
                    <option>0606049179 - BASANTES BUENAÑO MILENA ABIGAIL (PAO 6)</option>
                    <option>0605077312 - ASADOBAY ESCOBAR HEIDY ESTEFANIA (PAO 5)</option>
                    <option>1715013833 - ND. VERÓNICA DELGADO (SUPERVISORA SECTOR A)</option>
                    <option>0604073940 - ND. VILMA VELASCO (SUPERVISORA SECTOR B)</option>
                    <option>0603246414 - DR. PATRICIO RAMOS (SUPERVISOR SECTOR C)</option>
                  </select>
                </div>
                <div style="flex:1;min-width:240px;">
                  <label style="font-size:0.78rem;font-weight:700;display:block;margin-bottom:0.25rem;">Brigadista 2 (Anotador / Auxiliar):</label>
                  <select style="width:100%;padding:0.45rem;border-radius:6px;border:1px solid var(--border);background:var(--bg-primary);color:var(--text-primary);font-size:0.82rem;">
                    <option>0250042165 - APUNTE ALDAS FLORCITA ALEJANDRA (PAO 5)</option>
                    <option>1850945054 - BALSECA QUESADA DANIELA ALEJANDRA (PAO 6)</option>
                    <option>1314123744 - AVELLAN ESTEVEZ DARIANA NOELIA (PAO 5)</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Tooltip Operativo -->
            <div style="background:rgba(59,130,246,0.1);border-left:4px solid #3b82f6;padding:0.75rem 1rem;border-radius:6px;margin-bottom:0.6rem;font-size:0.84rem;color:var(--text-primary);">
              <strong>ℹ️ Tooltip Técnico Operativo:</strong> Seleccione su nombre o ingrese los primeros números de su cédula. El listado oficial se autocompletará. El sistema asigna automáticamente la dupla responsable y el supervisor asignado según la microcuenca.
            </div>
          </div>

          <!-- Pregunta 2: Equipos SECA y Calibración -->
          <div class="card tooltip-question-card" style="border:1px solid var(--border);border-radius:12px;padding:1.25rem;background:var(--bg-secondary);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
              <span class="badge" style="background:#10b981;color:white;font-weight:800;">OP-002 & OP-003</span>
              <span style="font-size:0.75rem;font-family:monospace;color:var(--text-muted);">text (números de serie oficiales)</span>
            </div>
            <h3 style="font-size:1.05rem;font-weight:700;color:var(--text-primary);margin:0 0 0.5rem 0;">
              Control de Seriales y Calibración Matutina (Balanza SECA 874 / Tallímetro SECA 417)
            </h3>
            <div style="background:rgba(59,130,246,0.1);border-left:4px solid #3b82f6;padding:0.75rem 1rem;border-radius:6px;font-size:0.84rem;color:var(--text-primary);">
              <strong>ℹ️ Tooltip Técnico Operativo:</strong> Verifique la etiqueta posterior del equipo (ej: SN-874-2026-001 para balanza; SN-417-2026-001 para infantómetro). Asegúrese de haber efectuado la calibración matutina previa con la pesa patrón de 5 kg (desviación máxima permitida: ≤ 50 g).
            </div>
          </div>

          <!-- Pregunta 3: Identificación del Cuidador y Consentimiento -->
          <div class="card tooltip-question-card" style="border:1px solid var(--border);border-radius:12px;padding:1.25rem;background:var(--bg-secondary);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
              <span class="badge" style="background:#8b5cf6;color:white;font-weight:800;">ID-001 & BIO-001</span>
              <span style="font-size:0.75rem;font-family:monospace;color:var(--text-muted);">text / image (consentimiento informado CEISH)</span>
            </div>
            <h3 style="font-size:1.05rem;font-weight:700;color:var(--text-primary);margin:0 0 0.5rem 0;">
              Identificación de la Madre / Cuidador y Consentimiento Informado
            </h3>
            <div style="background:rgba(59,130,246,0.1);border-left:4px solid #3b82f6;padding:0.75rem 1rem;border-radius:6px;margin-bottom:0.6rem;font-size:0.84rem;color:var(--text-primary);">
              <strong>ℹ️ Tooltip Técnico Operativo:</strong> Registre los dos nombres y dos apellidos de la madre, padre o tutor legal. Lea pausadamente el texto del consentimiento informado CEISH-ESPOCH. Si la madre no sabe firmar, capture fotografía de la huella dactilar sobre el documento físico.
            </div>
            <div style="background:rgba(139,92,246,0.1);border-left:4px solid #8b5cf6;padding:0.75rem 1rem;border-radius:6px;font-size:0.84rem;color:var(--text-primary);">
              <strong>🗣️ Guion Intercultural en Kichwa Puruhá:</strong><br>
              <em>"Allillachu kapani. ¿Wawapa mamatachu kanki? ¿Ima shutitaq kanki? Ñukanchikka wawakunapa alli kawsayta rikunkapakmi shamunchik. ¿Wawata tupunkapak kankuna saquiwankichikchu?"</em><br>
              <span style="font-size:0.78rem;color:var(--text-muted);">(Buenos días/tardes. ¿Es la madre del niño? ¿Cuál es su nombre? Venimos a evaluar la salud del menor. ¿Nos autoriza a medirlo?)</span>
            </div>
          </div>

          <!-- Pregunta 4: Fecha de Nacimiento -->
          <div class="card tooltip-question-card" style="border:1px solid var(--border);border-radius:12px;padding:1.25rem;background:var(--bg-secondary);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
              <span class="badge" style="background:#f59e0b;color:white;font-weight:800;">ID-005</span>
              <span style="font-size:0.75rem;font-family:monospace;color:var(--text-muted);">date (edad exacta en días para WHO Anthro)</span>
            </div>
            <h3 style="font-size:1.05rem;font-weight:700;color:var(--text-primary);margin:0 0 0.5rem 0;">
              Fecha Exacta de Nacimiento del Infante (Regla de Oro OMS)
            </h3>
            <div style="background:rgba(59,130,246,0.1);border-left:4px solid #3b82f6;padding:0.75rem 1rem;border-radius:6px;margin-bottom:0.6rem;font-size:0.84rem;color:var(--text-primary);">
              <strong>ℹ️ Tooltip Técnico Operativo:</strong> Verifique con el carné de vacunas MSP o cédula. El día, mes y año deben ser exactos para que el modelo WHO Anthro calcule sin distorsión los puntajes Z de P/E, T/E y P/T.
            </div>
            <div style="background:rgba(139,92,246,0.1);border-left:4px solid #8b5cf6;padding:0.75rem 1rem;border-radius:6px;font-size:0.84rem;color:var(--text-primary);">
              <strong>🗣️ Guion Intercultural en Kichwa Puruhá:</strong><br>
              <em>"¿Ima punchapi, ima killapi, ima watapitaq wawa wacharirka? ¿Vacuna pankata charinchu?"</em><br>
              <span style="font-size:0.78rem;color:var(--text-muted);">(¿En qué fecha exacta nació el niño? ¿Tiene a mano el carné de vacunación?)</span>
            </div>
          </div>

          <!-- Pregunta 5: Peso del Infante -->
          <div class="card tooltip-question-card" style="border:1px solid var(--border);border-radius:12px;padding:1.25rem;background:var(--bg-secondary);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
              <span class="badge" style="background:#10b981;color:white;font-weight:800;">ANTRO-001</span>
              <span style="font-size:0.75rem;font-family:monospace;color:var(--text-muted);">decimal (kg con 2 decimales - tolerancia ≤ 0.10 kg)</span>
            </div>
            <h3 style="font-size:1.05rem;font-weight:700;color:var(--text-primary);margin:0 0 0.5rem 0;">
              Peso Corporal con Ropa Mínima (Balanza SECA 874 / 878)
            </h3>
            <div style="background:rgba(59,130,246,0.1);border-left:4px solid #3b82f6;padding:0.75rem 1rem;border-radius:6px;margin-bottom:0.6rem;font-size:0.84rem;color:var(--text-primary);">
              <strong>ℹ️ Tooltip Técnico Operativo:</strong> Balanza en piso firme y nivelado. Infante con ropa interior mínima, sin calzado ni pañal pesado. Si llora o se resiste, active la función 2-en-1 Madre-Hijo (tara automática con la madre). Diferencia permitida entre Toma 1 y Toma 2: ≤ 100 g (0.10 kg).
            </div>
            <div style="background:rgba(139,92,246,0.1);border-left:4px solid #8b5cf6;padding:0.75rem 1rem;border-radius:6px;font-size:0.84rem;color:var(--text-primary);">
              <strong>🗣️ Guion Intercultural en Kichwa Puruhá:</strong><br>
              <em>"Wawata lluchulla llashanami kanchik, paypa llashayta yachankapak."</em><br>
              <span style="font-size:0.78rem;color:var(--text-muted);">(Vamos a pesar al niño con poca ropa para conocer su peso exacto).</span>
            </div>
          </div>

          <!-- Pregunta 6: Longitud / Talla -->
          <div class="card tooltip-question-card" style="border:1px solid var(--border);border-radius:12px;padding:1.25rem;background:var(--bg-secondary);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
              <span class="badge" style="background:#10b981;color:white;font-weight:800;">ANTRO-002 & ANTRO-003</span>
              <span style="font-size:0.75rem;font-family:monospace;color:var(--text-muted);">decimal & select_one (corrección automática ±0.7 cm)</span>
            </div>
            <h3 style="font-size:1.05rem;font-weight:700;color:var(--text-primary);margin:0 0 0.5rem 0;">
              Longitud Supina / Estatura Vertical (Tallímetro SECA 417)
            </h3>
            <div style="background:rgba(59,130,246,0.1);border-left:4px solid #3b82f6;padding:0.75rem 1rem;border-radius:6px;margin-bottom:0.6rem;font-size:0.84rem;color:var(--text-primary);">
              <strong>ℹ️ Tooltip Técnico Operativo:</strong> &lt; 24 meses (&lt; 87 cm): mida ACOSTADO. ≥ 24 meses (≥ 87 cm): mida DE PIE. 5 puntos de contacto con la tabla (cabeza en plano de Frankfurt, omóplatos, glúteos, pantorrillas y talones). Si un infante ≥ 24m se mide acostado o viceversa, el algoritmo aplica corrección automática de ±0.7 cm. Tolerancia entre tomas: ≤ 5 mm (0.5 cm).
            </div>
            <div style="background:rgba(139,92,246,0.1);border-left:4px solid #8b5cf6;padding:0.75rem 1rem;border-radius:6px;font-size:0.84rem;color:var(--text-primary);">
              <strong>🗣️ Guion Intercultural en Kichwa Puruhá:</strong><br>
              <em>"Wawata kay tupunapi churapashun, paypa sayayta yachankapak."</em><br>
              <span style="font-size:0.78rem;color:var(--text-muted);">(Vamos a colocar al niño en el medidor para registrar su estatura).</span>
            </div>
          </div>

          <!-- Pregunta 7: Cinta Braquial MUAC -->
          <div class="card tooltip-question-card" style="border:1px solid var(--border);border-radius:12px;padding:1.25rem;background:var(--bg-secondary);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
              <span class="badge" style="background:#10b981;color:white;font-weight:800;">ANTRO-004</span>
              <span style="font-size:0.75rem;font-family:monospace;color:var(--text-muted);">decimal (cm con 1 decimal - cinta tricolor OMS)</span>
            </div>
            <h3 style="font-size:1.05rem;font-weight:700;color:var(--text-primary);margin:0 0 0.5rem 0;">
              Circunferencia del Brazo Medio Izquierdo (MUAC)
            </h3>
            <div style="background:rgba(59,130,246,0.1);border-left:4px solid #3b82f6;padding:0.75rem 1rem;border-radius:6px;margin-bottom:0.6rem;font-size:0.84rem;color:var(--text-primary);">
              <strong>ℹ️ Tooltip Técnico Operativo:</strong> Brazo izquierdo doblado a 90°. Marque el punto medio entre acromion y olécranon. Extienda el brazo y ajuste la cinta sin comprimir la piel. Rojo (&lt; 11.5 cm) = Desnutrición Aguda Severa (SAM).
            </div>
            <div style="background:rgba(139,92,246,0.1);border-left:4px solid #8b5cf6;padding:0.75rem 1rem;border-radius:6px;font-size:0.84rem;color:var(--text-primary);">
              <strong>🗣️ Guion Intercultural en Kichwa Puruhá:</strong><br>
              <em>"Wawapa rikrata tullpuchishpa tupushun."</em><br>
              <span style="font-size:0.78rem;color:var(--text-muted);">(Vamos a medir el bracito del niño con la cinta).</span>
            </div>
          </div>

          <!-- Pregunta 8: Edema Bilateral - BANDERA ROJA -->
          <div class="card tooltip-question-card" style="border:2px solid #ef4444;border-radius:12px;padding:1.25rem;background:rgba(239,68,68,0.03);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
              <span class="badge" style="background:#ef4444;color:white;font-weight:800;">ANTRO-006 - BANDERA ROJA</span>
              <span style="font-size:0.75rem;font-family:monospace;color:#ef4444;font-weight:700;">ALERTA CLÍNICA OMS (SAM)</span>
            </div>
            <h3 style="font-size:1.05rem;font-weight:700;color:#b91c1c;margin:0 0 0.5rem 0;">
              Descarte Clínico de Edema Bilateral con Fóvea (Kwashiorkor)
            </h3>
            <div style="background:rgba(239,68,68,0.1);border-left:4px solid #ef4444;padding:0.75rem 1rem;border-radius:6px;margin-bottom:0.6rem;font-size:0.84rem;color:#7f1d1d;">
              <strong>⚠️ Alerta Clínica OMS / Bandera Roja:</strong> Presione con suavidad ambos pulgares durante 3 segundos sobre el dorso de ambos pies. Si la huella (fóvea) persiste en AMBOS pies, registre 'Sí'. ¡REQUIERE DERIVACIÓN URGENTE AL CENTRO DE SALUD MSP MÁS CERCANO!
            </div>
            <div style="background:rgba(139,92,246,0.1);border-left:4px solid #8b5cf6;padding:0.75rem 1rem;border-radius:6px;font-size:0.84rem;color:var(--text-primary);">
              <strong>🗣️ Guion Intercultural en Kichwa Puruhá:</strong><br>
              <em>"¿Wawapa chakikuna punkishkachu rikurin?"</em><br>
              <span style="font-size:0.78rem;color:var(--text-muted);">(¿Los pies del niño se observan hinchados?)</span>
            </div>
          </div>

        </div>
      `;
    } else {
      return `
        <div style="display:flex;flex-direction:column;gap:1.25rem;">
          
          <!-- Pregunta Socio 1: Brigadistas y Trazabilidad -->
          <div class="card tooltip-question-card" style="border:1px solid var(--border);border-radius:12px;padding:1.25rem;background:var(--bg-secondary);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
              <span class="badge" style="background:#3b82f6;color:white;font-weight:800;">OP-001a & OP-001b</span>
              <span style="font-size:0.75rem;font-family:monospace;color:var(--text-muted);">select_one lista_brigadistas (autocomplete)</span>
            </div>
            <h3 style="font-size:1.05rem;font-weight:700;color:var(--text-primary);margin:0 0 0.5rem 0;">
              Registro de Brigadistas por Cédula y Nombre Oficial ESPOCH
            </h3>
            <div style="background:rgba(59,130,246,0.1);border-left:4px solid #3b82f6;padding:0.75rem 1rem;border-radius:6px;font-size:0.84rem;color:var(--text-primary);">
              <strong>ℹ️ Tooltip Técnico Operativo:</strong> Seleccione su nombre o digite su cédula. El sistema valida automáticamente que el brigadista 2 sea diferente al brigadista 1 y calcula 'cedula_encuestador' y 'dupla_responsable' sin fricción en campo.
            </div>
          </div>

          <!-- Pregunta Socio 2: Composición del Hogar Universal -->
          <div class="card tooltip-question-card" style="border:1px solid var(--border);border-radius:12px;padding:1.25rem;background:var(--bg-secondary);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
              <span class="badge" style="background:#3b82f6;color:white;font-weight:800;">HOG-001 a HOG-003</span>
              <span style="font-size:0.75rem;font-family:monospace;color:var(--text-muted);">integer (levantamiento universal 100% de hogares)</span>
            </div>
            <h3 style="font-size:1.05rem;font-weight:700;color:var(--text-primary);margin:0 0 0.5rem 0;">
              Composición Familiar y Niños Menores de 5 Años (Encuesta Universal)
            </h3>
            <div style="background:rgba(59,130,246,0.1);border-left:4px solid #3b82f6;padding:0.75rem 1rem;border-radius:6px;margin-bottom:0.6rem;font-size:0.84rem;color:var(--text-primary);">
              <strong>ℹ️ Tooltip Técnico Operativo:</strong> Ingrese el número total de personas que habitan permanentemente y comparten la olla común. Si no hay niños menores de 5 años, registre 0. La encuesta sociodemográfica continúa de forma universal para levantar el perfil de pobreza y WASH del sector.
            </div>
            <div style="background:rgba(139,92,246,0.1);border-left:4px solid #8b5cf6;padding:0.75rem 1rem;border-radius:6px;font-size:0.84rem;color:var(--text-primary);">
              <strong>🗣️ Guion Intercultural en Kichwa Puruhá:</strong><br>
              <em>"¿Mashna runakunataq kay wasipi kawsankichik? ¿Mashna uchilla wawakunataq charinkichik (pichka watakaman)?"</em><br>
              <span style="font-size:0.78rem;color:var(--text-muted);">(¿Cuántas personas viven en esta casa? ¿Cuántos niños pequeños menores de 5 años tienen?)</span>
            </div>
          </div>

          <!-- Pregunta Socio 3: Representante del Hogar -->
          <div class="card tooltip-question-card" style="border:1px solid var(--border);border-radius:12px;padding:1.25rem;background:var(--bg-secondary);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
              <span class="badge" style="background:#3b82f6;color:white;font-weight:800;">REP-001 & REP-002</span>
              <span style="font-size:0.75rem;font-family:monospace;color:var(--text-muted);">text (jefatura del hogar y cédula)</span>
            </div>
            <h3 style="font-size:1.05rem;font-weight:700;color:var(--text-primary);margin:0 0 0.5rem 0;">
              Datos del Representante / Jefe de Hogar
            </h3>
            <div style="background:rgba(59,130,246,0.1);border-left:4px solid #3b82f6;padding:0.75rem 1rem;border-radius:6px;margin-bottom:0.6rem;font-size:0.84rem;color:var(--text-primary);">
              <strong>ℹ️ Tooltip Técnico Operativo:</strong> Nombres y apellidos completos de la persona reconocida como jefe/a de familia. Solicite su documento de identidad e ingrese los 10 dígitos.
            </div>
            <div style="background:rgba(139,92,246,0.1);border-left:4px solid #8b5cf6;padding:0.75rem 1rem;border-radius:6px;font-size:0.84rem;color:var(--text-primary);">
              <strong>🗣️ Guion Intercultural en Kichwa Puruhá:</strong><br>
              <em>"¿Pitaq wasipa yaya o mama kan? ¿Ima shutitaq kan? Ama shina kaypa, ¿kampa cédula pankata rikuchiwayta ushawañkichu?"</em><br>
              <span style="font-size:0.78rem;color:var(--text-muted);">(¿Quién es el jefe o representante de la casa? ¿Cómo se llama? ¿Puede mostrarme su cédula?)</span>
            </div>
          </div>

          <!-- Pregunta Socio 4: Agua y Saneamiento (WASH) -->
          <div class="card tooltip-question-card" style="border:1px solid var(--border);border-radius:12px;padding:1.25rem;background:var(--bg-secondary);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
              <span class="badge" style="background:#3b82f6;color:white;font-weight:800;">M01-Q01 & M01-Q03</span>
              <span style="font-size:0.75rem;font-family:monospace;color:var(--text-muted);">select_one (indicadores INEC / ODS 6)</span>
            </div>
            <h3 style="font-size:1.05rem;font-weight:700;color:var(--text-primary);margin:0 0 0.5rem 0;">
              Acceso a Agua Segura y Métodos de Desinfección en el Hogar
            </h3>
            <div style="background:rgba(59,130,246,0.1);border-left:4px solid #3b82f6;padding:0.75rem 1rem;border-radius:6px;margin-bottom:0.6rem;font-size:0.84rem;color:var(--text-primary);">
              <strong>ℹ️ Tooltip Técnico Operativo:</strong> Identifique si la procedencia es red pública tratada, entubada de vertiente, pozo, acequia o tanquero, y si antes de beberla aplican hervido, cloro o filtrado.
            </div>
            <div style="background:rgba(139,92,246,0.1);border-left:4px solid #8b5cf6;padding:0.75rem 1rem;border-radius:6px;font-size:0.84rem;color:var(--text-primary);">
              <strong>🗣️ Guion Intercultural en Kichwa Puruhá:</strong><br>
              <em>"¿Yakuta maymantataq upyankapak llukchinkichik? (tubumanta, pukyumanta, acequiamanta). ¿Yakuta timpuchinkichikchu upyankapak manara upyashpa?"</em><br>
              <span style="font-size:0.78rem;color:var(--text-muted);">(¿De dónde obtienen el agua para beber: tubería, vertiente, acequia? ¿Hierven el agua antes de tomarla?)</span>
            </div>
          </div>

          <!-- Pregunta Socio 5: Seguridad Alimentaria ELCSA -->
          <div class="card tooltip-question-card" style="border:1px solid var(--border);border-radius:12px;padding:1.25rem;background:var(--bg-secondary);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
              <span class="badge" style="background:#3b82f6;color:white;font-weight:800;">M03-Q01 a M03-Q06</span>
              <span style="font-size:0.75rem;font-family:monospace;color:var(--text-muted);">select_one si_no (Escala ELCSA FAO)</span>
            </div>
            <h3 style="font-size:1.05rem;font-weight:700;color:var(--text-primary);margin:0 0 0.5rem 0;">
              Escala de Experiencia de Inseguridad Alimentaria (ELCSA)
            </h3>
            <div style="background:rgba(59,130,246,0.1);border-left:4px solid #3b82f6;padding:0.75rem 1rem;border-radius:6px;margin-bottom:0.6rem;font-size:0.84rem;color:var(--text-primary);">
              <strong>ℹ️ Tooltip Técnico Operativo:</strong> Formule las preguntas con sensibilidad sobre si en los últimos 3 meses por falta de dinero u otros recursos se preocuparon por falta de alimentos o comieron menos.
            </div>
            <div style="background:rgba(139,92,246,0.1);border-left:4px solid #8b5cf6;padding:0.75rem 1rem;border-radius:6px;font-size:0.84rem;color:var(--text-primary);">
              <strong>🗣️ Guion Intercultural en Kichwa Puruhá:</strong><br>
              <em>"¿Kay kinsa killakunapi, kullki illaymanta mikuna illashkachu wasipi?"</em><br>
              <span style="font-size:0.78rem;color:var(--text-muted);">(¿En estos últimos tres meses ha faltado comida en el hogar por falta de dinero?)</span>
            </div>
          </div>

        </div>
      `;
    }
  },

};
