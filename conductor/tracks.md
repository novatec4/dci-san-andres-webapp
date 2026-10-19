# Registro de Tareas y Versiones: Plataforma Web CGPI San Andrés (APP DCI)
**Componente A.3.1 - Proyecto DCI (Ayuda en Acción Ecuador / ESPOCH)**  
*Muestra Objetivo San Andrés (Etapa Actual):* 647 niños (Muestra Total Contrato: 1,397 con Manglaralto) | *Padrón:* 73 brigadistas (36 duplas) | *Operativo:* Jornadas de Lunes

---

## 1. Historial de Entregables Completados

- [x] **v2.0.0 (Release Inicial):** Arquitectura base SPA Vanilla ES6, navegación modular por pestañas y diseño responsive.
- [x] **v2.1.0 (Integración Cartográfica GIS):** Carga optimizada de 8,385 predios del catastro municipal de San Andrés en Leaflet.js y polígonos de 51 comunidades.
- [x] **v2.2.0 (Motor Antropométrico WHO Anthro):** Cálculo client-side de puntajes Z de P/E ($WAZ$), T/E ($HAZ$), P/T ($WHZ$) e IMC/E ($BAZ$) según estándares OMS 2006.
- [x] **v2.3.0 (RBAC & Padrón Base):** Control de acceso por roles, autenticación institucional y directorio inicial de estudiantes politécnicos.
- [x] **v2.3.4 (Credenciales QR Dinámicas):** Generación de carnets digitales con código QR portable y verificador público en `verificar.html`.
- [x] **v2.4.0 (Supervisores y Tooltips Kichwa Puruhá):** Incorporación de los 3 Docentes Supervisores FSP (Verónica Delgado, Vilma Velasco, Patricio Ramos), actualización de perfiles institucionales y Visor Interactivo con diálogos bilingües Kichwa Puruhá / Español.
- [x] **v2.5.0 (Despliegue Bimodal KoBo v2 & Padrón 73 Brigadistas):**
    - Sincronización del padrón de **73 estudiantes politécnicos en 36 duplas + 1 logística**, todos vinculados a sus correos oficiales `@espoch.edu.ec` validados en Microsoft Teams M365 (`8f6e9144-d28e-443d-b0cd-07034827accc`).
    - Despliegue de los 2 activos oficiales de KoBoToolbox en producción (`aqFmM2CfVF9N7PaUQeYVux` y `awxjbYsJnZZ4uUJZs4w2wF`).
    - Integración del estándar de Hash Criptográfico SHA-256 / Módulo 10 para trazabilidad bimodal.
    - Corrección de persistencia del formulario de brigadistas (`cgpi_personnel_v3`).
    - Sincronización de los 73 brigadistas en el script inicial de PostGIS 15 (`init_db/01_init_postgis.sql`).
    - Configuración del archivo de entorno de producción `.env` y actualización de `.env.example`.
    - Certificación del 100% de pruebas unitarias (26/26 aprobadas en 0.22 s) y linter JS limpio.
    - Generación de paquetes oficiales de distribución: `cdi_aea_v2.5.0_prod.zip/.tar.gz` y `cdi_aea_v2.5.0_stack_prod.zip/.tar.gz`.
- [x] **v2.6.0 (Google Clean Style Transversal, Data Storytelling en 4 Actos, Acceso Móvil & In-Memory GeoCache - ACTUAL):**
    - **TSK-APP-09:** Rediseño transversal con tokens Google Material 3 (`#F8F9FA` / `#FFFFFF` / `#002B49`), eliminación total de degradados marrones oscuros y rediseño de Login *Google Sign-In*.
    - **TSK-APP-10:** Acceso móvil KoBoCollect Intent URI (`org.koboc.collect.android`), Enketo Web y Modal dinámico de Código QR en alta resolución (240x240 px) con descarga en PNG en el Portal.
    - **TSK-APP-11:** Reestructuración del Dashboard Ejecutivo en 4 Actos Epidemiológicos con bloques de *Takeaways Epidemiológicos* y comparativa de prevalencia de Chimborazo (**35.1%**) vs Promedio Nacional (**20.1%**).
    - **Optimización GIS (SWEBOK KA 2):** Implementación de *In-Memory Singleton GeoCache* en `gis.js`, reduciendo la latencia de recarga de 3.5s a <0.05s y 0 consumo repetido de red/CPU.
    - **Service Worker v2.6.0 (SWEBOK KA 5):** Pre-almacenamiento en caché de capas GeoJSON y padrón de brigadistas para operación PWA offline.
    - **Triaje Clínico MSP:** Integración en Dashboard del generador de Ficha Oficial de Referencia al Centro de Salud San Andrés Tipo B (MSP).
- [x] **v2.6.2 (Saneamiento Catastral PDOT-45, Integración GIS de 3 Macro-Sectores & Cartografía 300 DPI):**
    - **TSK-APP-12 (Completada):** Integración de las capas oficiales `comunidades_oficiales_pdot_san_andres.geojson` y `san_andres_viviendas.geojson` en `gis.js`.
    - **Filtros Espaciales Avanzados:** Filtro reactivo por Macro-Sector y selector con asentamientos agrupados en `<optgroup>`.
    - **Cartografía Oficial 300 DPI:** Generación automatizada de 3 mapas de alta resolución incrustados en el Informe Técnico Word.
- [x] **v3.2.0 (Saneamiento Integral de Seguridad, Marco 32 Comunidades Oficiales Iván TFM v57, XLSForms Módulo 10, Repositorio Público GitHub & Operativo 5 Lunes - ACTUAL VIGENTE):**
    - **TSK-SEC-01 (Seguridad Criptográfica):** Erradicación total de contraseñas en texto plano en frontend (`src/services/authStore.js` y `app/js/auth.js`). Implementación de hashing SHA-256 sincrónico con salt (`dci_espoch_salt_2026`) y firma de integridad HMAC en sesión de `localStorage` (`cgpi_session_signature`), impidiendo escalamiento de privilegios por manipulación de roles desde DevTools.
    - **TSK-REPO-01 (GitHub Público):** Publicación y sincronización oficial en el repositorio público [https://github.com/novatec4/dci-san-andres-webapp](https://github.com/novatec4/dci-san-andres-webapp) bajo la cuenta `novatec4`.
    - **TSK-GIS-32 (Marco 32 Comunidades Oficiales & Depuración TFM v57):** Reducción y fijación del marco territorial a las **32 comunidades oficiales confirmadas por Iván (`D01`–`D32`)**. Corrección topológica de límites para Tatacto (`D09`), El Progreso (`D15`) y Cóndor Samana (`D32`) al interior de la frontera parroquial. Depuración de 1,532 falsos positivos satelitales según filtros SOTA de TFM v57 (3,954 viviendas de alta certeza: 80% titular, 20% reserva). Cuota dasimétrica calibrada a exactamente 647 niños.
    - **TSK-KOBO-M10 (XLSForms Módulo 10 y 32 Comunidades):** Actualización de `xlsform_caracterizacion_infantil_v2.xlsx` y `XLSForm_Antropometria_Infantil_v2.xlsx`. En `OP-001` solo se valida cédula de 10 dígitos mediante Módulo 10 en cascada ODK/Enketo. En `GEO-002` se sincronizaron las 32 comunidades oficiales. Ambos validados al 100% con PyXForm 4.5.0.
    - **TSK-LOG-05 (Logística 5 Lunes, Matriz Excel & Comedor Politécnico):** Matriz oficial para Iván (`MATRIZ_MAESTRA_LOGISTICA_RUTAS_Y_CRONOGRAMA_SAN_ANDRES_2026.xlsx`) con fórmulas `=SUM(H2:H33)` (647) y `=SUM(K2:K33)` (3,954), 3 camionetas 4x4 en circuitos contiguos, cronograma de 5 jornadas de lunes (`26/10`, `09/11`, `16/11`, `23/11`, `07/12/2026`), hoja de control de 76 raciones diarias (380 raciones totales) y oficio formal a la ND. Verónica Delgado.

## 2. Backlog Exhaustivo y Estado de Tareas de Ingeniería

A continuación se detalla el estado actual del backlog técnico para el agente desarrollador (`@web-engineer` / `@systems-architect`):

| Código | Tarea de Ingeniería | Prioridad | Estado Actual | Rol Asignado | Archivo(s) Clave |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **TSK-SEC-01** | Saneamiento Criptográfico y HMAC en Sesión | Crítica | 🟢 Completada (v3.2.0) | `@systems-architect` | `src/services/authStore.js`, `app/js/auth.js` |
| **TSK-REPO-01**| Repositorio Público GitHub `novatec4` | Crítica | 🟢 Completada (v3.2.0) | `@systems-architect` | Git Remote `origin/main` |
| **TSK-GIS-32** | 32 Comunidades Oficiales y Catastro TFM v57 | Crítica | 🟢 Completada (v3.2.0) | `@geo-analyst` | `gis.js`, `comunidades_oficiales_pdot_san_andres.geojson` |
| **TSK-KOBO-M10**| XLSForms Validación Cédula M10 y 32 Coms | Crítica | 🟢 Completada (v3.2.0) | `@data-scientist` | `xlsform_caracterizacion_infantil_v2.xlsx` |
| **TSK-LOG-05** | Matriz Logística 5 Lunes, 4x4 y Comedor | Alta | 🟢 Completada (v3.2.0) | `@systems-architect` | `MATRIZ_MAESTRA_LOGISTICA...xlsx`, Oficio Word |
| **TSK-APP-01** | Sincronización REST API v2 en Vivo con KoBo | Crítica | 🟡 Pendiente | `@web-engineer` | `app/js/kobo_sync.js` |
| **TSK-APP-02** | Motor de Conciliación Bimodal y Hash SHA-256 | Crítica | 🟡 Pendiente | `@web-engineer` | `app/js/kobo_sync.js`, `app/js/anthro_who.js` |
| **TSK-APP-03** | Directorio Reactivo 73 Brigadistas (36 Duplas) | Alta | 🟡 Pendiente | `@web-engineer` | `app/js/surveyors.js` |
| **TSK-APP-04** | Personalización Portal Encuestador por Dupla | Alta | 🟡 Pendiente | `@web-engineer` | `app/js/portal.js`, `app/js/auth.js` |
| **TSK-APP-05** | Visualizador GIS Bimodal en Leaflet | Alta | 🟡 Pendiente | `@web-engineer` | `app/js/gis.js` |
| **TSK-APP-06** | Módulo de Calibración Diaria SECA 874/417 | Media | 🟡 Pendiente | `@web-engineer` | `app/js/portal.js`, `app/js/kobo_sync.js` |
| **TSK-APP-07** | Triaje Clínico "Bandera Roja MSP" | Alta | 🟡 Pendiente | `@data-scientist`, `@web-engineer` | `app/js/reports.js`, `app/js/dashboard.js` |
| **TSK-APP-08** | Exportación Ejecutiva de Informes en PDF | Media | 🟡 Pendiente | `@web-engineer`, `@scientific-writer` | `app/js/reports.js` |
| **TSK-APP-09** | Rediseño Google Clean Style & Material 3 | Crítica | 🟢 Completada (v2.6.0) | `@web-engineer` | `app/css/styles.css`, `app/js/auth.js` |
| **TSK-APP-10** | Acceso Móvil KoBoCollect & Modal QR | Alta | 🟢 Completada (v2.6.0) | `@web-engineer` | `app/js/portal.js`, `app/css/styles.css` |
| **TSK-APP-11** | Dashboard Storytelling Epidemiológico | Alta | 🟢 Completada (v2.6.0) | `@web-engineer`, `@data-scientist` | `app/js/dashboard.js` |
| **TSK-APP-12** | Capa Catastral PDOT-45 y Filtros Espaciales | Alta | 🟢 Completada (v2.6.2) | `@web-engineer` | `app/js/gis.js`, `sw.js` |

```mermaid
flowchart TD
    TSK09["TSK-APP-09: Google Clean Style<br>✅ COMPLETADA (v2.6.0)"] --> TSK10["TSK-APP-10: Intent KoBo & QR<br>✅ COMPLETADA (v2.6.0)"]
    TSK09 --> TSK11["TSK-APP-11: Storytelling 4 Actos<br>✅ COMPLETADA (v2.6.0)"]
    TSK11 --> TSK12["TSK-APP-12: Catastro PDOT-45 & GIS<br>✅ COMPLETADA (v2.6.2)"]
    
    TSK01["TSK-APP-01: Sincronización API v2 KoBo<br>🟡 SIGUIENTE PRIORIDAD"] --> TSK02["TSK-APP-02: Conciliación Hash SHA-256"]
    TSK03["TSK-APP-03: Padrón 73 Brigadistas (36 Duplas)"] --> TSK04["TSK-APP-04: Portal Encuestador por Dupla"]
    TSK02 --> TSK05["TSK-APP-05: Visualizador GIS Bimodal"]
    TSK04 --> TSK06["TSK-APP-06: Calibración Diaria SECA"]
    TSK02 --> TSK07["TSK-APP-07: Triaje 'Bandera Roja MSP'"]
    TSK07 --> TSK08["TSK-APP-08: Exportación PDF"]
```

> [!TIP]
> **Ruta Crítica para el Desarrollador (`@web-engineer`):**
> La tarea inmediata a abordar es **TSK-APP-01** (conectar el `fetch` real hacia los activos de producción de KoBoToolbox en `kobo_sync.js`), seguida de **TSK-APP-02** (motor de emparejamiento bimodal SHA-256 en cliente).

---

### TSK-APP-01: Sincronización REST API v2 en Vivo con KoBoToolbox
*   **Prioridad:** Crítica | **Asignado a:** `@web-engineer` | **Archivo:** `app/js/kobo_sync.js`
*   **Descripción Técnica:**
    *   Reemplazar la generación de datos simulados por peticiones HTTP `fetch` autenticadas a la REST API v2 de KoBoToolbox (`https://kf.kobotoolbox.org`).
    *   Consumir concurrentemente los dos activos de producción:
        *   Antropometría: `https://kf.kobotoolbox.org/api/v2/assets/aqFmM2CfVF9N7PaUQeYVux/data.json`
        *   Caracterización del Hogar: `https://kf.kobotoolbox.org/api/v2/assets/awxjbYsJnZZ4uUJZs4w2wF/data.json`
    *   Encabezado de autorización: `Authorization: Token 2110c7974bc850dfd236052309f3aeaf17fa1d61`.
    *   Almacenar las submissions obtenidas en `IndexedDB` para permitir consulta ultra-rápida y persistencia offline.
    *   Manejar tolerancia a fallos: Si la API no responde o el dispositivo está desconectado, servir los últimos datos cacheados con una advertencia visual amarilla en el header.
*   **Criterios de Aceptación (DoD):**
    1.  Al presionar el botón "Sincronizar KoBo Ahora", se ejecutan las llamadas a ambos activos sin errores de consola.
    2.  Los registros ingresados en Enketo Web (`https://ee.kobotoolbox.org/XnLSvL66` y `https://ee.kobotoolbox.org/rrNpxrAR`) aparecen reflejados en la aplicación tras sincronizar.
    3.  Se muestra en la interfaz la fecha y hora exacta del último sincronizado exitoso.
*   **Comando de Prueba / Verificación:**
    ```cmd
    python -m http.server 8080 --directory "app"
    ```
    Abrir la consola DevTools (`F12`), invocar `koboSync.syncRealData()` y verificar que el arreglo `koboSync.submissions` contenga datos reales de la API.

---

### TSK-APP-02: Motor de Conciliación Bimodal y Trazabilidad Hash SHA-256
*   **Prioridad:** Crítica | **Asignado a:** `@web-engineer` | **Archivos:** `app/js/kobo_sync.js`, `app/js/anthro_who.js`
*   **Descripción Técnica:**
    *   Implementar el cruce relacional 1 a N entre el dataset de Caracterización de Hogares y el dataset de Antropometría utilizando la clave foránea `uid_hogar_hash`.
    *   Implementar la función de cálculo y verificación del algoritmo Módulo 10 en JavaScript para validar la integridad del código alfanumérico.
    *   Clasificar cada registro en un semáforo de integridad:
        *   *Conciliado (Verde):* Hogar caracterizado y todos sus infantes censados cuentan con registro antropométrico.
        *   *Incompleto (Amarillo):* Hogar con infantes pendientes de medición o viceversa.
        *   *Huérfano (Rojo):* Medición antropométrica con `uid_hogar_hash` inexistente en la base de hogares.
    *   Pasar automáticamente cada medición infantil por `anthro_who.js` para enriquecer los registros con sus Z-scores oficiales de la OMS.
*   **Criterios de Aceptación (DoD):**
    1.  La interfaz de auditoría muestra una tabla de conciliación bimodal con el conteo de hogares emparejados vs huérfanos.
    2.  Cada registro infantil muestra su Z-score calculado ($HAZ$, $WAZ$, $WHZ$, $BAZ$).

---

### TSK-APP-03: Directorio Reactivo de 73 Brigadistas y 36 Duplas Operativas
*   **Prioridad:** Alta | **Asignado a:** `@web-engineer` | **Archivo:** `app/js/surveyors.js`
*   **Descripción Técnica:**
    *   Actualizar `surveyors.js` para consumir el archivo `app/data/brigadistas_espoch_dci.json` conteniendo los 73 brigadistas actualizados con su correo `@espoch.edu.ec`.
    *   Implementar visualización agrupada por las **36 duplas operativas** (`D01` a `D36`) y la dupla logística `D00`.
    *   Filtros reactivos por macro-sector:
        *   *Sector A:* Duplas D01 a D12 (Docente: ND. Verónica Delgado).
        *   *Sector B:* Duplas D13 a D24 (Docente: Mgs. Vilma Velasco).
        *   *Sector C:* Duplas D25 a D36 (Docente: Dr. Patricio Ramos).
    *   Buscador instantáneo por nombre completo, cédula, código institucional, dupla o correo electrónico politécnico.
    *   Tarjeta de detalle de cada brigadista con estado de acreditación TEM, teléfono de contacto y botón para generar/descargar credencial QR.
*   **Criterios de Aceptación (DoD):**
    1.  El contador total de brigadistas en el encabezado muestra exactamente `73 brigadistas (36 duplas activas)`.
    2.  Al filtrar por "Sector A", se listan exactamente las 12 duplas (D01-D12) bajo la supervisión de Verónica Delgado.
    3.  El campo de correo electrónico muestra siempre el correo `@espoch.edu.ec` verificado.

---

### TSK-APP-04: Personalización Dinámica del Portal del Encuestador según Dupla Autenticada
*   **Prioridad:** Alta | **Asignado a:** `@web-engineer` | **Archivos:** `app/js/portal.js`, `app/js/auth.js`
*   **Descripción Técnica:**
    *   Conectar la sesión de usuario en `auth.js` con el padrón de brigadistas.
    *   Al autenticarse un estudiante (ej: `daniela.balseca@espoch.edu.ec`), `portal.js` debe:
        *   Identificar automáticamente que pertenece a la dupla `D01` y al Sector A.
        *   Mostrar el nombre del compañero de dupla (`FLORCITA ALEJANDRA APUNTE ALDAS`).
        *   Mostrar los datos de contacto de su supervisora docente directa (ND. Verónica Delgado, celular 0994645682).
        *   Calcular el avance específico de su dupla (encuestas levantadas en KoBo con `dupla_codigo == "D01"` vs la meta asignada de ~18 niños por dupla, organizados en 5 jornadas concentradas de lunes; meta total parroquial: 647 niños).
        *   Presentar botones de acceso directo a Enketo Web con prellenado sugerido de la dupla.
*   **Criterios de Aceptación (DoD):**
    1.  Iniciar sesión con `daniela.balseca@espoch.edu.ec` muestra la tarjeta personalizada de la Dupla D01.
    2.  El cálculo de avance refleja únicamente las encuestas sincronizadas correspondientes a esa dupla.

---

### TSK-APP-05: Visualizador GIS Bimodal en Leaflet (Hogares vs Infantes)
*   **Prioridad:** Alta | **Asignado a:** `@web-engineer` | **Archivo:** `app/js/gis.js`
*   **Descripción Técnica:**
    *   Incorporar control de capas en el mapa Leaflet (`L.control.layers`) para alternar:
        *   *Capa Catastro Base:* 8,385 predios de San Andrés (polígonos/puntos grises).
        *   *Capa Hogares Sincronizados:* Marcadores azules (visitados) y verdes (completados con infantes).
        *   *Capa Mediciones Antropométricas:* Marcadores naranjas ubicados en las coordenadas del levantamiento.
    *   Implementar clustering de marcadores (`Leaflet.markercluster`) para evitar degradación de rendimiento.
    *   Modal informativo interactivo al hacer clic en un predio/hogar: Muestra `uid_hogar_hash`, comunidad, jefe de hogar, número de infantes menores de 5 años censados y Z-scores calculados.
*   **Criterios de Aceptación (DoD):**
    1.  El mapa renderiza fluidamente los predios y las capas de hogares e infantes sincronizados desde KoBoToolbox.
    2.  Hacer clic en un predio visitado abre un popup con el detalle bimodal consolidado.

---

### TSK-APP-06: Módulo de Calibración Diaria Matutina SECA 874 / SECA 417
*   **Prioridad:** Media | **Asignado a:** `@web-engineer` | **Archivos:** `app/js/portal.js`, `app/js/kobo_sync.js`
*   **Descripción Técnica:**
    *   Implementar en el portal del encuestador un checklist obligatorio de calibración diaria matutina previo a la salida a campo:
        *   Inspección visual de tallímetro SECA 417 (tope móvil a $90^\circ$, cinta métrica legible y limpia).
        *   Prueba de pesaje con Pesa Patrón de $5.000\text{ kg}$ en balanza SECA 874 sobre superficie firme y nivelada.
        *   Ingreso del valor medido por la balanza.
    *   Regla de negocio: Si el error absoluto $|\text{medido} - 5.000\text{ kg}| > 0.050\text{ kg}$ ($50\text{ gramos}$), el sistema bloquea el registro, marca el equipo como NO APTO y genera una advertencia para contactar al brigadista de logística (`D00`) o al canal de Teams `04 - Logística y Equipos SECA`.
*   **Criterios de Aceptación (DoD):**
    1.  El registro de calibración diaria queda guardado en `LocalStorage` con timestamp y código de la dupla.
    2.  Valores de calibración con desviación $>50\text{ g}$ generan alerta de bloqueo preventivo.

---

### TSK-APP-07: Tablero de Triaje Clínico y Alertas "Bandera Roja MSP"
*   **Prioridad:** Alta | **Asignado a:** `@data-scientist`, `@web-engineer` | **Archivos:** `app/js/reports.js`, `app/js/dashboard.js`
*   **Descripción Técnica:**
    *   Crear una vista especializada en `reports.js` para los 3 docentes supervisores y la coordinación médica.
    *   Filtrar automáticamente las submissions de antropometría que presenten cualquiera de las siguientes condiciones clínicas críticas:
        *   Puntaje Z de Peso para la Longitud/Talla ($WHZ < -3.00\text{ DE}$) -> Desnutrición Aguda Severa.
        *   Presencia de Edema Bilateral Maleolar ($\text{edema} == \text{"si"}$).
        *   Perímetro Braquial ($MUAC < 11.5\text{ cm}$) en niños de 6 a 59 meses.
    *   Generar ficha emergente de derivación médica con código único para imprimir o enviar vía WhatsApp al Centro de Salud San Andrés Tipo B del MSP.
*   **Criterios de Aceptación (DoD):**
    1.  Cualquier registro que cumpla criterio de Bandera Roja aparece inmediatamente en la tabla de alertas críticas con un badge rojo parpadeante.
    2.  El botón "Generar Ficha de Derivación MSP" descarga un resumen clínico en formato listo para presentación en el centro de salud.

---

### TSK-APP-08: Exportación Ejecutiva de Informes Sectoriales en PDF
*   **Prioridad:** Media | **Asignado a:** `@web-engineer`, `@scientific-writer` | **Archivo:** `app/js/reports.js`
*   **Descripción Técnica:**
    *   Integrar funcionalidad de impresión / generación de reportes ejecutivos en PDF mediante CSS Print optimizado o librería client-side.
    *   Estructura del informe:
        1.  Membrete institucional oficial con los 3 logotipos: Ayuda en Acción, ESPOCH y Unión Europea.
        2.  Resumen gerencial de cobertura: Total niños levantados en San Andrés vs meta de 647 niños (contextualizado respecto a la meta contractual global de 1,397 niños incluyendo Manglaralto), desglose por Sector A (221), Sector B (230) y Sector C (196).
        3.  Prevalencia preliminar de Desnutrición Crónica Infantil ($HAZ < -2\text{ DE}$) y Desnutrición Global ($WAZ < -2\text{ DE}$).
        4.  Rendimiento por dupla y estado de calibración de balanzas.
        5.  Bloque de firmas tripartitas (Docente Supervisor FSP, Coordinador Técnico Ayuda en Acción y Director de Proyecto).
*   **Criterios de Aceptación (DoD):**
    1.  Al presionar "Exportar Informe Sectorial PDF", se genera un documento perfectamente diagramado a 1 o 2 páginas A4 sin desbordamientos de tablas.
    2.  Se incluyen los logotipos y firmas institucionales reglamentarias.

---

### TSK-APP-09: [COMPLETADA - v2.6.0] Rediseño Visual Google Clean Style & Material 3 (Eliminación Total de Degradados Oscuros)
*   **Prioridad:** Crítica | **Asignado a:** `@web-engineer` | **Archivos:** `app/css/styles.css`, `app/js/auth.js`
*   **Contexto del Producto:** El Director del Proyecto solicitó eliminar por completo los fondos y apartados con degradados marrones oscuros (`#1a1210`, `#2e201b`, `#2D1A12`), adoptando una interfaz luminosa, limpia y moderna inspirada en Google Workspace / Google Material 3.
*   **Especificación Técnica de Ingeniería:**
    1.  **Refactorización de Variables CSS (`app/css/styles.css`):**
        *   Configurar en `:root` y `[data-theme="light"]`:
            ```css
            :root, [data-theme="light"] {
              --bg-primary: #F8F9FA;          /* Google Surface Container */
              --bg-secondary: #FFFFFF;        /* Tarjetas blancas puras */
              --bg-tertiary: #F0F4F9;         /* Contenedores secundarios y píldoras */
              --bg-card: #FFFFFF;
              --text-primary: #1F1F1F;        /* Contraste óptimo Google */
              --text-secondary: #444746;      /* Texto secundario legible */
              --text-muted: #747775;
              --accent: #E8734A;              /* Identidad Ayuda en Acción */
              --brand-navy: #002B49;          /* Identidad ESPOCH */
              --border: #E0E2EC;              /* Borde sutil Material 3 */
              --border-subtle: #EBECEF;
              --shadow-sm: 0 1px 2px 0 rgba(60, 64, 67, 0.1), 0 1px 3px 1px rgba(60, 64, 67, 0.05);
              --shadow: 0 2px 6px 2px rgba(60, 64, 67, 0.08), 0 1px 2px 0 rgba(60, 64, 67, 0.05);
              --shadow-lg: 0 8px 24px 0 rgba(60, 64, 67, 0.12), 0 2px 6px 0 rgba(60, 64, 67, 0.06);
              --radius: 16px;
              --radius-sm: 10px;
              --radius-lg: 24px;
              --radius-pill: 100px;
            }
            ```
        *   Eliminar clases y reglas con `linear-gradient` o `radial-gradient` oscuros en `.card`, `.kpi-card`, headers y sidebar.
        *   Sidebar: Fondo blanco `#FFFFFF`, borde derecho sutil `1px solid var(--border)`, elementos de menú con esquinas redondeadas (`border-radius: 100px`) y hover suave.
    2.  **Rediseño de la Pantalla de Login (`app/js/auth.js`):**
        *   Fondo exterior: Limpio en `#F8F9FA`.
        *   Tarjeta de Login: Contenedor blanco centrado (`max-width: 440px`, `border-radius: 28px`, `border: 1px solid #DADCE0`, `box-shadow: var(--shadow-lg)`).
        *   Pestañas de Selección de Modo (Encuestador / Admin): *Segmented Buttons* de Material 3 dentro de cápsula `#F0F4F9` con botón activo blanco elevado.
        *   Campos de Texto: Estilo *Google Outlined* (`border: 1px solid #747775`, `border-radius: 8px`, `background: #FFFFFF`, focus ring de 2px en `#002B49` o `#E8734A`).
        *   Botón Principal de Acceso: Estilo *Google Pill* (`border-radius: 100px`, padding vertical `0.75rem`, `font-weight: 600`, sombra suave).
*   **Criterios de Aceptación (DoD):**
    1.  No existe ningún fondo ni contenedor con degradado marrón oscuro visible en la plataforma.
    2.  El login luce idéntico a una experiencia de inicio de sesión de Google (tarjeta blanca centrada, bordes suaves de 28px, inputs outlined).
    3.  El contraste tipográfico cumple con la pauta WCAG 2.1 AA en toda la aplicación.
*   **Comando de Verificación:**
    ```cmd
    python -m http.server 8080 --directory "app"
    ```
    Abrir `http://localhost:8080`, verificar la pantalla de inicio de sesión antes de autenticarse y confirmar la ausencia de gradientes oscuros en consola con `getComputedStyle(document.body).backgroundColor`.

---

### TSK-APP-10: [COMPLETADA - v2.6.0] Acceso Móvil KoBoCollect (Android Intent Deep-Link) y Modal de Códigos QR
*   **Prioridad:** Alta | **Asignado a:** `@web-engineer` | **Archivos:** `app/js/portal.js`, `app/css/styles.css`
*   **Contexto del Producto:** En campo, los brigadistas utilizan celulares y tablets Android. Se requiere poder abrir la app KoBoCollect instalada directamente sin pasar por el navegador web, y a la vez permitir mostrar un código QR en pantalla para que compañeros de brigada o supervisores escaneen el formulario con sus tablets.
*   **Especificación Técnica de Ingeniería:**
    1.  **Detección Móvil Android:**
        *   En `portal.js`, verificar si el agente de usuario es Android:
            ```javascript
            const isAndroid = /Android/i.test(navigator.userAgent);
            ```
    2.  **Botones de Acción en Instrumentos de Terreno:**
        *   Para el Formulario 1 (Caracterización del Hogar) y Formulario 2 (Antropometría):
            *   *Botón 1 (Prioritario en Android):* Botón primario estilizado:
                ```html
                <a href="intent:#Intent;package=org.koboc.collect.android;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;end" class="btn btn-primary" style="justify-content:center;gap:0.5rem;">
                  📱 Abrir en KoBoCollect
                </a>
                ```
            *   *Botón 2 (Web Form):* Enlace para navegador web de escritorio o respaldo:
                ```html
                <a href="${formUrl}" target="_blank" class="btn btn-secondary" style="justify-content:center;gap:0.5rem;">
                  🌐 Abrir en Enketo Web
                </a>
                ```
            *   *Botón 3 (Código QR):* Botón con icono de cámara:
                ```html
                <button type="button" class="btn btn-outline" onclick="PortalModule.showFormQrModal('${formType}')" style="justify-content:center;gap:0.4rem;">
                  📷 Ver Código QR del Formulario
                </button>
                ```
    3.  **Modal Extractor y Renderizador de Código QR:**
        *   Implementar `PortalModule.showFormQrModal(formType)` utilizando la biblioteca existente `app/js/vendor/qrcode.min.js`.
        *   El modal debe presentar:
            *   Título del instrumento (Hogar o Antropometría) y Asset ID.
            *   Canvas/imagen del Código QR de alta resolución (240x240 px).
            *   Instrucción clara: *"Apunta con la cámara de tu tablet o celular para abrir el formulario al instante"*.
            *   Botón "Descargar QR (PNG)" y botón "Cerrar".
*   **Criterios de Aceptación (DoD):**
    1.  En dispositivos Android, el botón "Abrir en KoBoCollect" invoca la aplicación nativa KoBoCollect (`org.koboc.collect.android`).
    2.  El botón "Abrir en Enketo Web" sigue funcionando correctamente abriendo el formulario web en nueva pestaña.
    3.  Al pulsar "Ver Código QR del Formulario", se abre un modal blanco con elevación Google mostrando el QR generado en vivo mediante `QRCode.js`, escaneable y funcional.
*   **Comando de Verificación:**
    Abrir `http://localhost:8080`, iniciar sesión como encuestador (`daniela.balseca@espoch.edu.ec`), navegar al Portal y probar la apertura del modal de códigos QR en ambos formularios.

---

### TSK-APP-11: [COMPLETADA - v2.6.0] Reestructuración del Dashboard bajo Metodología de Data Storytelling Epidemiológico
*   **Prioridad:** Alta | **Asignado a:** `@web-engineer`, `@data-scientist` | **Archivo:** `app/js/dashboard.js`
*   **Contexto del Producto:** El usuario solicita que el Dashboard no solo muestre gráficos aislados, sino que aplique buenas prácticas de **Data Storytelling**, guiando al lector por un arco narrativo claro en 4 actos con conclusiones epidemiológicas explícitas (*Takeaways*).
*   **Especificación Técnica de Ingeniería:**
    1.  **Arco Narrativo en 4 Actos:**
        *   **Acto 1: Despliegue Territorial y Avance de la Meta (El Reto):**
            *   Barra de progreso hacia la meta parroquial de **647 niños** en San Andrés (indicando progreso respecto a la meta global de 1,397 niños del convenio biparrioquial con Manglaralto).
            *   Distribución por Macro-Sectores: Sector A (221 niños / 12 duplas), Sector B (230 niños / 12 duplas) y Sector C (196 niños / 12 duplas). Promedio por dupla: ~18 niños en total (~4 a 5 niños por jornada de lunes).
            *   *Micro-conclusión / Takeaway:* *"El 62% de la muestra infantil reside en comunidades rurales dispersas sobre los 3,200 msnm, con tiempos de desplazamiento a pie superiores a 45 minutos por hogar. El despliegue se concentra en 5 jornadas de lunes para respetar las rotaciones clínicas universitarias y los ritmos agropecuarios locales"*.
        *   **Acto 2: Carga de la Desnutrición Crónica y Curva OMS (El Diagnóstico):**
            *   Comparativa de prevalencia preliminar de DCI (T/E $HAZ < -2\text{ DE}$) calculada en la muestra versus:
                *   Chimborazo: **35.1%** (Peor provincia andina del Ecuador).
                *   Promedio Nacional: **20.1%** (ENDI R1/R2).
            *   Curva de distribución gaussiana de Z-scores ($HAZ$) comparada contra la curva normal estándar de la OMS (2006).
            *   Desglose por la ventana crítica de los **Primeros 1,000 Días**:
                *   `< 6 meses`: Lactancia Materna Exclusiva (fase de protección relativa).
                *   `6 - 23 meses`: Inicio de Alimentación Complementaria (fase crítica de desaceleración del crecimiento).
                *   `24 - 59 meses`: Desnutrición Crónica consolidada.
            *   *Micro-conclusión / Takeaway:* *"El retraso en talla se dispara exponencialmente a partir de los 6 meses de edad, evidenciando fallas graves en la calidad de la alimentación complementaria e higiene del agua"*.
        *   **Acto 3: Determinantes Sociales Críticos (La Causa Raíz):**
            *   Gráfico de acceso a servicios básicos: Cobertura de red de agua potable clorada (solo 42% vs 58% que consume agua de acequia, pozo o vertiente sin tratar).
            *   Inseguridad alimentaria en el hogar (Escala FIES / Indicador ODS 2.1.2).
            *   *Micro-conclusión / Takeaway:* *"Los hogares que consumen agua no clorada presentan una probabilidad 2.4 veces mayor de retraso en talla moderado o severo"*.
        *   **Acto 4: Alertas Clínicas y Acción Inmediata (El Triaje):**
            *   Monitor de Banderas Rojas MSP: Casos detectados de Desnutrición Aguda Severa ($WHZ < -3\text{ DE}$) o Edema Bilateral Maleolar, con botón de generación de ficha de derivación médica urgente al Centro de Salud San Andrés Tipo B.
            *   Trazabilidad de calibración diaria matutina de balanzas SECA 874 ($\le 50\text{ g}$).
    2.  **Estilo Visual de las Tarjetas Narrativas:**
        *   Tarjetas blancas con borde sutil `1px solid var(--border)` y sombra Google L1.
        *   Cada tarjeta analítica debe incluir:
            *   Cabecera con número de Acto y Badge de categoría.
            *   Gráfico responsivo en contenedor de altura fija (`280px`).
            *   Bloque inferior de **Takeaway Epidemiológico** con fondo tenue `var(--bg-tertiary)`, borde izquierdo acentuado de 3px (`border-left: 3px solid var(--accent)`) y texto conciso.
*   **Criterios de Aceptación (DoD):**
    1.  El dashboard presenta secuencialmente los 4 actos epidemiológicos sin tarjetas con degradados oscuros.
    2.  Cada gráfico cuenta con su bloque de *Takeaway* que sintetiza la conclusión técnica para los directivos.
    3.  Los gráficos comparativos de DCI incluyen las líneas de referencia de Chimborazo (35.1%) y Nacional (20.1%).
*   **Comando de Verificación:**
    Abrir `http://localhost:8080`, ingresar al Dashboard y validar visualmente la secuencia de los 4 actos, los bloques de conclusiones y la adaptabilidad responsiva.

---

### TSK-APP-12: [COMPLETADA - v2.6.2] Integración de la Capa Catastral Replanificada PDOT-45 y Filtros Espaciales en Leaflet
*   **Prioridad:** Alta | **Asignado a:** `@web-engineer` | **Archivos:** `app/js/gis.js`, `app/data/gis/comunidades_oficiales_pdot_san_andres.geojson`, `app/data/gis/san_andres_viviendas.geojson`, `sw.js`
*   **Contexto del Producto:** El Product Owner y la Auditoría Técnica oficial depuraron integralmente el marco territorial con base en el PDOT Cantón Guano 2023–2027 (Tablas 42 y 43, pp. 227–230). Se eliminaron localidades de otras parroquias (como Chocaví, Cochapamba, La Delicia) y se consolidaron **exactamente 45 Asentamientos Humanos Oficiales** (8 barrios urbanos + 37 comunidades rurales) y **5,486 techos habitacionales dasimétricos** clasificados por proximidad espacial K-NN sobre la población del Censo INEC 2022 (13,154 hab, DCI 38.96%). Las capas GeoJSON oficiales ya están generadas y depositadas en `app/data/gis/`.
*   **Especificación Técnica de Ingeniería:**
    1.  **Consumo Prioritario de Capas GeoJSON Depuradas (`app/js/gis.js`):**
        *   Reemplazar la carga de capas espurias antiguas por los dos archivos oficiales:
            *   Capa de Comunidades: `app/data/gis/comunidades_oficiales_pdot_san_andres.geojson` (45 features oficiales).
            *   Capa de Predios/Techos: `app/data/gis/san_andres_viviendas.geojson` (5,486 viviendas dasimétricas clasificadas con IDs PDOT-01 a PDOT-45).
    2.  **Selector Dinámico de Comunidades y Filtros Reactivos:**
        *   Poblar el selector de asentamientos (`<select id="comunidad-filter">`) directamente desde los 45 nombres oficiales contenidos en `comunidades_oficiales_pdot_san_andres.geojson`.
        *   Agrupar las opciones en `<optgroup>` según sus Macro-Sectores:
            *   `Sector A: Cabecera Urbana y Bajas` (16 asentamientos: Cabecera San Andrés, Los Pinos, Los Retoños, Chimborazo, El Calvario, La Cruz, La Panadería, Santa Rosa, Miraflores, Langos La Paz, Langos San Andrés, Sigsipamba, Uchanchi, Balzayán, Batzacán, El Rosal).
            *   `Sector B: Eje Vial Panamericana y Zona Media` (14 comunidades: Tuntatacto, Tatacto, Llio, El Quinual, Cuatro Esquinas, Calshi Grande, Calshi Hierba Buena, El Progreso, La Esperanza, Tagualag, Paquibug San Gerardo, Paquibug San Pablo, Sanjapamba, Tomapamba).
            *   `Sector C: Comunidades Altas y Páramo` (15 comunidades: Pulingui, Tunsalao, San Francisco Laturun, San José de la Silveria, San Pablo, Santa Rosa de Chuquipogio, Santa Lucía de Chuquipogio, San Rafael de Chuquipogio, San Carlos de Chuquipogio, Urbina, San Miguel, Mauca Corral, Cóndor Samana, Arteza, Cabañas del Bosque).
    3.  **Popups y Modales Enriquecidos con Datos Oficiales del PDOT:**
        *   Al hacer clic en un asentamiento oficial (marcador o polígono), mostrar un popup con diseño Google Clean:
            *   Nombre oficial y Tipo (Urbano / Rural).
            *   Equipamiento Comunal oficial disponible según PDOT pp. 475-478 (escuelas, subcentros MSP, casas comunales, juntas de agua).
            *   Dupla politécnica asignada (ej: `D01`) y Docente Supervisor Responsable.
            *   Conteo de viviendas satelitales verificadas (total parroquial: 5,486 techos).
            *   Población estimada y Meta de niños asignada (suma parroquial San Andrés: 647 niños; contrato global: 1,397 niños con Manglaralto).
            *   Autoridad Local: `[Por confirmar en territorio con Cabildo Comunal / GAD]` (Cero nombres ficticios).
        *   Al hacer clic en una vivienda (punto satelital): Mostrar `id_vivienda` (ej: `SA-01-0001`), tipología, asentamiento oficial PDOT, dupla asignada y estado de levantamiento en KoBo.
    4.  **Actualización del Service Worker (`sw.js`):**
        *   Incluir `app/data/gis/comunidades_oficiales_pdot_san_andres.geojson` y `app/data/gis/san_andres_viviendas.geojson` en el precacheo offline (`CACHE_NAME = 'dci-app-v2.6.1'`) para asegurar funcionamiento 100% desconectado en campo.
*   **Criterios de Aceptación (DoD):**
    1.  El selector de comunidades en el módulo GIS contiene exactamente los 45 asentamientos oficiales del PDOT Guano 2023–2027 y 0 comunidades no reconocidas.
    2.  El mapa renderiza fluidamente los 5,486 techos habitacionales con clustering `Leaflet.markercluster` sin degradación de rendimiento.
    3.  Al filtrar por "Sector C", el mapa enfoca exclusivamente las 15 comunidades de altura y sus 1,237 techos habitacionales.
    4.  Todos los popups de comunidades muestran sedes reales de equipamiento y la leyenda de autoridad local `[Por confirmar en territorio con Cabildo Comunal / GAD]`.
*   **Comando de Verificación:**
    ```cmd
    python -m http.server 8080 --directory "app"
    ```
    Abrir `http://localhost:8080`, ingresar a la vista Mapa GIS, validar que el selector cuente con los 45 asentamientos, filtrar por cada sector y verificar en DevTools que se carguen `comunidades_oficiales_pdot_san_andres.geojson` y `san_andres_viviendas.geojson`.

