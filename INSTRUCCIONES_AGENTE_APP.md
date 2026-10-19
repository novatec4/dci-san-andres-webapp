# 📘 GUÍA TÉCNICA E INSTRUCCIONES PARA EL AGENTE DE LA APLICACIÓN (APP DCI)
**Componente A.3.1 — Caracterización Georreferenciada de la Población Infantil (0-4 años)**  
**Proyecto DCI:** San Andrés y Manglaralto: Territorios Libres de Desnutrición Infantil  
**Entidades:** Fundación Ayuda en Acción Ecuador (AeA) & Escuela Superior Politécnica de Chimborazo (ESPOCH)  
**Versión de la Plataforma:** `v3.2.0` (Producción & Desarrollo Saneado)  
**Repositorio Oficial GitHub:** [https://github.com/novatec4/dci-san-andres-webapp](https://github.com/novatec4/dci-san-andres-webapp) (Público, cuenta `novatec4`)

---

## 1. Arquitectura y Stack Tecnológico
* **Frontend:** Vanilla JavaScript ES6 Modular (SPA) + Vite / HTML5 / CSS3 (Google Material 3 / Clean UI).
* **Cartografía & GIS:** Leaflet.js con clustering dinámico (`Leaflet.markercluster`), GeoJSON dasimétrico y KMZ OGC 2.2.
* **Motor Antropométrico:** WHO Anthro LMS 2006 client-side (Z-scores de Talla/Edad $HAZ$, Peso/Edad $WAZ$, Peso/Talla $WHZ$, IMC/Edad $BAZ$).
* **Seguridad & Sesiones:** Hashing criptográfico SHA-256 sincrónico con salt (`dci_espoch_salt_2026`) y firmas HMAC de integridad en `localStorage` (`cgpi_auth_session_v2`) para mitigar escalamiento de privilegios vía DevTools.
* **Captura Externa:** KoBoToolbox REST API v2 + KoBoCollect (Android Intent URI) + Enketo Web con XLSForms bimodales desacoplados (Módulo 10).

---

## 2. Marco Territorial Oficial: 32 Comunidades y 3,954 Viviendas (TFM v57/v58)
Tras la auditoría de campo con el equipo técnico de Iván Pulgar (AeA) y la aplicación de los algoritmos de detección satelital de alta certeza del Máster IA (TFM v57/v58), el marco territorial se fijó formalmente en:

* **Total Comunidades Oficiales:** **32 comunidades** (`D01` a `D32`).
* **Muestra Infantil Parroquial:** **647 niños** (de la muestra total contractual de 1,397 con Manglaralto).
* **Catastro Depurado:** **3,954 viviendas de alta certeza** (80% Muestra Titular = 3,163 techos; 20% Reserva Poka-Yoke = 791 techos). Erradicados 1,532 falsos positivos en páramo y suelo agrícola.
* **Correcciones Topológicas Aplicadas:**
  * **Tatacto (`D09`):** Centrada en `[-78.7195, -1.5335]` (100% dentro del límite de San Andrés).
  * **El Progreso (`D15`):** Centrada en `[-78.7225, -1.5968]` (100% dentro de San Andrés).
  * **Cóndor Samana (`D32`):** Centrada en `[-78.7745, -1.5550]` (100% dentro de San Andrés).

### Distribución por Macro-Sectores y Supervisores Docentes FSP-ESPOCH
| Macro-Sector | Rango Duplas / Coms. | Meta Niños | Viviendas TFM v57 | Docente Supervisor Responsable |
| :--- | :---: | :---: | :---: | :--- |
| **Sector A: Cabecera Urbana y Bajas** | `D01` – `D07` (7 coms) | 145 niños | 954 viviendas | **ND. Verónica Carlina Delgado López** |
| **Sector B: Eje Vial y Media** | `D08` – `D21` (14 coms) | 289 niños | 1,842 viviendas | **Mgs. Vilma Lorena Velasco Castillo** |
| **Sector C: Altas y Páramo** | `D22` – `D32` (11 coms) | 213 niños | 1,158 viviendas | **Dr. Juan Patricio Ramos Rodríguez** |
| **Central / Monitoreo & Logística** | `D-LOG` (`D33`–`D36`) | Supervisión | Apoyo técnico | **Bryan Marcelo Velasco Ortiz** |

---

## 3. Modelo de Seguridad y Credenciales Oficiales
Para cumplir con las normas de seguridad informática, **ninguna contraseña se almacena en texto plano**:
* **Algoritmo:** `SHA-256(password + "dci_espoch_salt_2026")`.
* **Firma de Sesión:** Cada login genera una firma HMAC (`user.id + role + email + salt`) almacenada en `localStorage.getItem('cgpi_session_signature')`. Al cargar cualquier vista protegida, `_loadSession()` recalcula y valida la firma. Si un usuario intenta alterar su rol a `admin` en DevTools, la firma se invalida y el sistema redirige automáticamente al login.
* **Archivos Clave:** `src/services/authStore.js` y `app/js/auth.js`.
* **Variables de Entorno:** `.env` está estrictamente ignorado en `.gitignore`. Utilizar siempre `.env.example` como plantilla.

### Credenciales de Acceso para Pruebas
| Perfil / Rol | Correo Electrónico | Contraseña en Claro | Hash SHA-256 con Salt |
| :--- | :--- | :--- | :--- |
| **Administrador / CIO** | `admin@dci.ec` | `admin123` | `a3901a18ae6188bb0039237db8751410d322ef5cbca2ec06f6e52dc791b8fbf4` |
| **Supervisor de Campo** | `supervisor@dci.ec` | `supervisor123` | `7be6b973ef0b04ff04f18db2ae99cf3eb87ee7d53b248a3f8fa3bdf08fceb4f6` |
| **Encuestador de Terreno** | `encuestador@dci.ec` | `campo123` | `dfd854eb4501a1d94be365538d39c0d38102377a06f3e12c1451b69352e85a6a` |
| **Nutricionista / Antropometría** | `nutricionista@dci.ec` | `nutri123` | `8fb6ca180808298dc1ca93bb4eb1ca53ff61d42bc4613ff124d45d36c28f6916` |
| **Observador Institucional** | `observador@dci.ec` | `visor123` | `b99525e985b9b8b3a03362095fa8087f97fb5ba5cf92b528a475a895c1a70471` |
| **Docente Coordinadora** | `veronica.delgado@espoch.edu.ec`| `Dci2026*` | `d72aa67dbce6a02c525c389ec1b7ba1bba69e16d47bfaadba926cfb4578b8a53` |

---

## 4. Cronograma Oficial de Despliegue en Campo: 5 Jornadas de Lunes
El operativo se ejecuta exclusivamente los días lunes para no interferir con las clases universitarias de los estudiantes ni con los días de feria agrícola (miércoles y sábados):

| Jornada | Fecha | Día | Tipo de Despliegue | Meta Niños | Raciones Comedor |
| :---: | :---: | :---: | :--- | :---: | :---: |
| **Jornada 1** | 26/10/2026 | Lunes | Barrido Simultáneo Parroquial — Tanda 1 | 130 niños | 76 raciones |
| **Jornada 2** | 09/11/2026 | Lunes | Barrido Simultáneo Parroquial — Tanda 2 | 130 niños | 76 raciones |
| **Jornada 3** | 16/11/2026 | Lunes | Barrido Simultáneo Parroquial — Tanda 3 | 130 niños | 76 raciones |
| **Jornada 4** | 23/11/2026 | Lunes | Cierre de Cuotas Parroquiales (Meta 100%) | 130 niños | 76 raciones |
| **Jornada 5** | 07/12/2026 | Lunes | Re-visitas, Auditoría TEM y Cierre Parroquial | 127 niños | 76 raciones |
| **TOTAL** | — | **5 Lunes** | **Meta Total San Andrés** | **647 niños** | **380 raciones** |

* **Logística Vehicular:** 3 camionetas 4x4 operando en circuitos continuos para transporte de brigadas y equipos antropométricos.
* **Comedor Politécnico ESPOCH:** Solicitadas 76 raciones diarias de refrigerio tipo lunch saludable (380 raciones totales) mediante oficio formal a la **ND. Verónica Delgado**.

---

## 5. Instrumentos XLSForm y Validación ODK / PyXForm
Los formularios oficiales fueron saneados y validados con `pyxform 4.5.0`:

1. **`xlsform_caracterizacion_infantil_v2.xlsx`**:
   * Campo `OP-001` (`encuestador`): Tipo `text` con apariencia `numbers`. Restricción: `regex(., '^[0-9]{10}$') and ${enc_validar_cedula} = 1`. Valida cédula ecuatoriana de 10 dígitos con Módulo 10 mediante cálculo en cascada Enketo/ODK.
   * Campo `GEO-002` (`comunidad`): Lista desplegable con las **32 comunidades oficiales** de Iván (`D01` a `D32`) + opción `otra`.
2. **`XLSForm_Antropometria_Infantil_v2.xlsx`**:
   * Campos `brigadista_1` y `brigadista_2`: Tipo `text` con apariencia `numbers` y validación Módulo 10 (`${b1_validar_cedula} = 1` y `${b2_validar_cedula} = 1`).
   * Campo `comunidad`: Sincronizado con las 32 comunidades oficiales.

> [!NOTE]
> Los archivos `.xlsx` y sus versiones XML compiladas residen en `F3_Construccion/03_instrumentos_kobo` y `F2_Diseno/01_INSTRUMENTOS_Y_XLSFORM`. Para subirlos al servidor KoBo (`https://kf.kobotoolbox.org`), ingresar con las credenciales institucionales o ejecutar el script de actualización al renovar el token API en `.env`.

---

## 6. Comandos de Desarrollo y Verificación Local
```bash
# Servidor local con Node / Vite:
pnpm run dev
# o con npm:
npm run dev

# Servidor estático alternativo (Python):
python -m http.server 8080 --directory "app"

# Verificación de compilación de producción:
pnpm run build

# Subir cambios al repositorio de GitHub:
git add .
git commit -m "feat: [descripción del cambio]"
git push origin main
```
