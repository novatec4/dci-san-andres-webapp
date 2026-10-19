# Stack Tecnológico: Plataforma Web CGPI San Andrés (APP DCI)
**Componente A.3.1 - Proyecto DCI (Ayuda en Acción Ecuador / ESPOCH)**  
*Arquitectura:* **Vanilla ES6 Modular + Offline-First PWA + KoBo REST API v2 + Docker Nginx**

---

## 1. Principios de Arquitectura de Software

1.  **Cero Dependencias de Compilación Pesadas (No-Build Pipeline):** La aplicación está construida en Vanilla JavaScript modular (ES6 Nativo). No requiere Node.js, Webpack, Vite ni procesos de transpilación para ejecutarse en producción. Esto garantiza máxima velocidad de carga, portabilidad en cualquier servidor web liviano (Nginx/Python) y despliegue instantáneo en tablets Android de campo sin conexión a internet.
2.  **Offline-First & PWA (Progressive Web App):** Equipado con un Service Worker (`sw.js`) que cachea en el navegador todos los activos estáticos (HTML, CSS, JS, GeoJSON y Padrón JSON). Permite a los brigadistas y supervisores consultar mapas de predios, protocolos y credenciales en comunidades de altura ($>3,200\text{ msnm}$) sin cobertura celular.
3.  **Seguridad y RBAC en Cliente con Enlace Institucional:** Autenticación y control de acceso administrado por `auth.js`, validando correos institucionales politécnicos (`@espoch.edu.ec`) cruzados contra el padrón oficial en `brigadistas_espoch_dci.json`.

---

## 2. Componentes del Stack

### A. Frontend & UI
*   **HTML5 Semántico:** SPA (`index.html`) con vistas modulares inyectadas reactivamente en el DOM.
*   **CSS3 Custom Design System — Google Clean Style / Material 3 (`styles.css`):**
    *   *Fondo Plataforma (Google Surface Container):* `#F8F9FA`
    *   *Tarjetas y Paneles (Pure White Surface):* `#FFFFFF` con esquinas redondeadas (`16px` a `28px`)
    *   *Bordes Sutiles Material 3:* `#E0E2EC` (1px solid)
    *   *Sombras de Elevación Google:* L1 (`0 1px 3px 0 rgba(60,64,67,0.1)`) y L2 (`0 4px 8px 3px rgba(60,64,67,0.05)`)
    *   *Acento Identitario Ayuda en Acción:* `#E8734A`
    *   *Azul Marino Institucional ESPOCH:* `#002B49`
    *   *Verde Éxito / Aprobado:* `#10B981`
    *   *Rojo Alerta Clínica (Bandera Roja):* `#EF4444`
*   **Motor GIS:** [Leaflet.js](https://leafletjs.com/) v1.9.4 con plugins de clustering de marcadores para renderizar los 5,486 techos habitacionales dasimétricos de San Andrés clasificados sobre los 45 Asentamientos Humanos Oficiales (PDOT Guano 2023–2027) con rendimiento fluido ($60\text{ fps}$).
*   **Generador Criptográfico y Form QR:** `qrcode.min.js` (Canvas/SVG client-side) para credenciales dinámicas y apertura de formularios en campo.
*   **Cálculo Antropométrico:** `anthro_who.js` con las tablas LMS de la Organización Mundial de la Salud (OMS 2006).

### B. Almacenamiento y Persistencia Local
*   **`LocalStorage`:** Gestión de tokens de sesión, credenciales del usuario autenticado, última fecha de sincronización y banderas de configuración.
*   **`IndexedDB`:** Almacenamiento estructurado de alta capacidad para los 5,486 techos habitacionales dasimétricos y las submissions sincronizadas de KoBoToolbox para consulta offline.

---

## 3. Especificación Técnica de Integración con KoBoToolbox REST API v2

La plataforma se conecta a los servidores oficiales de KoBoToolbox mediante la API v2 con autenticación por Token Bearer:

*   **URL Base del Servidor:** `https://kf.kobotoolbox.org`
*   **Token Institucional de Autorización:** `Token 2110c7974bc850dfd236052309f3aeaf17fa1d61`
*   **Headers Requeridos:**
    ```http
    Authorization: Token 2110c7974bc850dfd236052309f3aeaf17fa1d61
    Accept: application/json
    ```

### Activos Desplegados en Producción:

| Instrumento | Asset UID | Versión Activa | URL Enketo Web en Vivo | Endpoint API de Datos |
| :--- | :--- | :--- | :--- | :--- |
| **1. Antropometría y Bioética** | `aqFmM2CfVF9N7PaUQeYVux` | `v8JYE72ZLsJTZ3XdgauqPx` | [https://ee.kobotoolbox.org/XnLSvL66](https://ee.kobotoolbox.org/XnLSvL66) | `https://kf.kobotoolbox.org/api/v2/assets/aqFmM2CfVF9N7PaUQeYVux/data.json` |
| **2. Caracterización del Hogar** | `awxjbYsJnZZ4uUJZs4w2wF` | `vd5MbdkpmDdLkAaqK7J7tj` | [https://ee.kobotoolbox.org/rrNpxrAR](https://ee.kobotoolbox.org/rrNpxrAR) | `https://kf.kobotoolbox.org/api/v2/assets/awxjbYsJnZZ4uUJZs4w2wF/data.json` |

### Parámetros de Consulta Soportados (`kobo_sync.js`):
*   `limit`: Cantidad máxima de registros por lote (por defecto `100`).
*   `start`: Desplazamiento inicial (paginación incremental).
*   `query`: Filtro de consulta en formato JSON serializado (ej: `{"_submission_time": {"$gt": "2026-09-20T00:00:00"}}` o `{"sec_identificacion/dupla_codigo": "D01"}`).

---

## 4. Algoritmo de Trazabilidad Criptográfica (Hash SHA-256 / Módulo 10)

Para cumplir con el principio de desacoplamiento bioético aprobado por el CEISH-ESPOCH (anonimización de datos sensibles del menor sin romper el enlace con las condiciones socioeconómicas del hogar), la plataforma utiliza un estándar criptográfico determinista:

```mermaid
flowchart LR
    subgraph Generacion_Hogar["Generación en Hogar"]
        RawHogar["Código Territorial Puro<br>PROV06-CANT03-PARR04-A-COM01-0125-H1"]
        HashHogar["Hash SHA-256 (8 car.) + Módulo 10<br>uid_hogar_hash: 7F3A9C12-8"]
        RawHogar --> HashHogar
    end

    subgraph Generacion_Infante["Generación en Antropometría"]
        RawInfante["uid_hogar_raw + Orden + Año<br>...-0125-H1-INF01-2024"]
        HashInfante["Hash SHA-256 (10 car.) + Módulo 10<br>uid_infante_hash: 9E4B2D1A8F-4"]
        RawInfante --> HashInfante
    end

    subgraph App_Matching["Cruce Bimodal en APP DCI (kobo_sync.js)"]
        Match["Fusión Bimodal 1 a N<br>Hogar(7F3A9C12-8) ↔ Infante(9E4B2D1A8F-4)"]
        HashHogar --> Match
        HashInfante --> Match
    end
```

*   **Fórmula del Hash de Hogar:**
    $$\text{uid\_hogar\_raw} = \text{"PROV06-CANT03-PARR04-" + sector + "-" + comunidad\_id + "-" + predio\_id + "-" + hogar\_num}$$
    $$\text{uid\_hogar\_hash} = \text{SHA256}(\text{uid\_hogar\_raw})[0:8].\text{upper}() + \text{"-"} + \text{Modulo10}(\text{uid\_hogar\_raw})$$
*   **Fórmula del Hash de Infante:**
    $$\text{uid\_infante\_raw} = \text{uid\_hogar\_raw} + \text{"-INF"} + \text{str}(orden).\text{zfill}(2) + \text{"-"} + \text{str}(anio\_nacimiento)$$
    $$\text{uid\_infante\_hash} = \text{SHA256}(\text{uid\_infante\_raw})[0:10].\text{upper}() + \text{"-"} + \text{Modulo10}(\text{uid\_infante\_raw})$$

---

## 5. Integración con Microsoft Teams M365 ESPOCH

*   **Equipo Oficial:** `8f6e9144-d28e-443d-b0cd-07034827accc` (*OPERATIVO DCI 2026 - BRIGADISTAS ESPOCH*).
*   **Canales Sincronizados:**
    *   `19:general` (Comunicados oficiales y convocatorias).
    *   `19:sector_a` (Sector A: Urbano y Centralidades, 12 duplas).
    *   `19:sector_b` (Sector B: Eje Vial y Comunidades Bajas, 12 duplas).
    *   `19:sector_c` (Sector C: Comunidades Altas y Dispersas, 12 duplas).
    *   `19:logistica_seca` (Calibración, pesas patrón y novedades de equipos SECA).
    *   `19:soporte_kobo` (Sincronización, hashes y soporte técnico en campo).
*   **Padrón Validado:** `app/data/brigadistas_espoch_dci.json` con los 73 estudiantes y 3 docentes supervisores sincronizados contra Microsoft Entra ID.

---

## 6. Entorno de Ejecución y Servidores

*   **Producción (Docker):**
    *   Imagen: `nginx:1.25-alpine`
    *   Configuración: `nginx.conf` con compresión gzip para GeoJSON y JSON masivos, y encabezados de seguridad.
    *   Comando: `docker-compose up -d --build` (Mapeo de puerto `8080:80`).
*   **Desarrollo Local Rápido (Windows CMD / PowerShell):**
    *   Comando nativo: `python -m http.server 8080 --directory "app"` o ejecución de `start_local.bat`.

---

## 7. Especificación Técnica de Deep Linking Android y Códigos QR

### A. Android Intent Deep Linking para KoBoCollect
*   **Protocolo:** Android Intent Scheme
*   **Package Name:** `org.koboc.collect.android`
*   **Action:** `android.intent.action.MAIN`
*   **Category:** `android.intent.category.LAUNCHER`
*   **URI Canónica de Invocación:**
    ```text
    intent:#Intent;package=org.koboc.collect.android;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;end
    ```
*   **Comportamiento en Cliente:**
    *   En navegadores Android (Chrome Mobile, Samsung Internet), este enlace abre directamente la aplicación KoBoCollect instalada.
    *   En caso de que el brigadista no tenga la app instalada, el fallback configurado dirige a la ficha oficial de Google Play Store:
        `https://play.google.com/store/apps/details?id=org.koboc.collect.android`
    *   En sistemas de escritorio (Windows/macOS), la interfaz oculta o desprioriza el botón nativo, resaltando el botón `🌐 Abrir en Enketo Web`.

### B. Motor Client-Side de Renderizado QR (`qrcode.min.js`)
*   **Biblioteca:** `app/js/vendor/qrcode.min.js` (Zero dependencies, Vanilla JS).
*   **Configuración de Generación:**
    ```javascript
    new QRCode(containerElement, {
      text: targetUrl,
      width: 240,
      height: 240,
      colorDark: "#1F1F1F",
      colorLight: "#FFFFFF",
      correctLevel: QRCode.CorrectLevel.M
    });
    ```
*   **Casos de Uso en Campo:**
    1.  *QR del Formulario 1 (Hogar):* URL `https://ee.kobotoolbox.org/rrNpxrAR`.
    2.  *QR del Formulario 2 (Antropometría):* URL `https://ee.kobotoolbox.org/XnLSvL66`.
    3.  *Enrolamiento entre dispositivos:* Un brigadista abre el modal en su teléfono y el compañero escanea con la cámara de su tablet para abrir de inmediato el formulario.

