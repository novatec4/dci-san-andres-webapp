# Conductor Local: Plataforma Web CGPI San Andrés (APP DCI)
**Componente A.3.1: Caracterización Georreferenciada de la Población Infantil (0-4 años)**  
*Convenio de Cooperación:* Fundación Ayuda en Acción Ecuador & Escuela Superior Politécnica de Chimborazo (ESPOCH)  
*Versión Actual del Sistema:* **v2.5.0 Oficial (Producción, Despliegue Bimodal y Sincronización API v2)**

---

## 1. Contexto y Propósito del Sub-Proyecto

Este directorio contiene el código fuente completo, datos estructurados, módulos analíticos y configuración de despliegue de la **Plataforma Web de Operaciones y Monitoreo en Tiempo Real (APP DCI)**.

La plataforma resuelve el aseguramiento de la calidad técnica, trazabilidad bioética (Aprobación CEISH-ESPOCH), monitoreo georreferenciado y auditoría metodológica del levantamiento de la muestra probabilística de **647 niños menores de 5 años en San Andrés** (Etapa Actual, 45 Asentamientos Humanos Oficiales PDOT Guano 2023–2027, Chimborazo; de una muestra contractual global de **1,397 niños** que incluye 750 niños en la segunda etapa en Manglaralto, Santa Elena), bajo los estándares del Modelo de Producción Estadística (MPE 2.0 - INEC).

### Estructura Operativa del Personal de Campo (Septiembre - Noviembre 2026, Jornadas Concentradas de Lunes):
*   **73 Estudiantes Politécnicos:** Carrera de Nutrición y Dietética (FSP - ESPOCH), PAO 5 y PAO 6 (Internado / Nutrición Clínica I y II), todos certificados en Error Técnico de Medición (TEM) y acreditados ante la comunidad.
*   **36 Duplas Operativas + 1 Soporte Central (Meta Media: ~18 niños por dupla, ~4 a 5 por lunes):**
    *   **Sector A (Urbano y Centralidades Bajas - 16 Asentamientos):** 12 duplas (`D01` a `D12`, 24 brigadistas). **Meta: 221 niños.** Supervisora: ND. Verónica Carlina Delgado López (`veronica.delgado@espoch.edu.ec`).
    *   **Sector B (Eje Panamericana y Zona Media - 14 Comunidades):** 12 duplas (`D13` a `D24`, 24 brigadistas). **Meta: 230 niños.** Supervisora: Mgs. Vilma Lorena Velasco Castillo (`vilma.velasco@espoch.edu.ec`).
    *   **Sector C (Comunidades Altas y Páramo - 15 Comunidades):** 12 duplas (`D25` a `D36`, 24 brigadistas). **Meta: 196 niños.** Supervisor: Dr. Juan Patricio Ramos Rodríguez (`patricio.ramos@espoch.edu.ec`).
    *   **Soporte Logístico y Monitoreo Central:** Dupla `D00` / `LOG-01` (1 brigadista: Bryan Marcelo Velasco Ortiz, `bryan.velasco@espoch.edu.ec`).
*   **Comunicaciones y Colaboración M365:**
    *   **Microsoft Teams ESPOCH:** Equipo `8f6e9144-d28e-443d-b0cd-07034827accc` (*OPERATIVO DCI 2026 - BRIGADISTAS ESPOCH*) con 75 miembros y 5 canales sectoriales.
    *   **Capacitaciones Planificadas:** Taller Virtual por Teams para Formulario Socioeconómico y Estandarización Antropométrica presencial coordinada con los docentes tutores.

---

## 2. Documentos de Referencia del Conductor

Para guiar la ejecución de tareas de desarrollo mediante sub-agentes especializados (`@web-engineer`, `@systems-architect`, `@data-scientist`), consulte los siguientes documentos de la suite:

*   [`product.md`](file:///I:/Mi%20unidad/A31_CORE_TECNICO/APP%20DCI/conductor/product.md): Especificación funcional exhaustiva, matriz RBAC 2.0, arquitectura bimodal de captura, tokens Google Clean Style / Material 3, especificación de Deep Linking Android y arquitectura de Data Storytelling.
*   [`tech-stack.md`](file:///I:/Mi%20unidad/A31_CORE_TECNICO/APP%20DCI/conductor/tech-stack.md): Arquitectura de software Vanilla ES6, endpoints REST API v2 de KoBoToolbox, tokens, algoritmo de Hash Criptográfico SHA-256 / Módulo 10, Leaflet GIS, Android Intent Scheme, `qrcode.min.js`, PWA y Docker.
*   [`plan.md`](file:///I:/Mi%20unidad/A31_CORE_TECNICO/APP%20DCI/conductor/plan.md): Hoja de ruta técnica organizada en 6 fases (A a F: Saneamiento Catastral PDOT-45 y Replanificación Dasimétrica Espacial).
*   [`tracks.md`](file:///I:/Mi%20unidad/A31_CORE_TECNICO/APP%20DCI/conductor/tracks.md): Backlog granular de tareas de ingeniería (`TSK-APP-01` a `TSK-APP-12`) con criterios de aceptación (DoD), comandos de prueba y dependencias.

---

## 3. Arquitectura del Código Fuente (`app/`)

```
APP DCI/
├── app/
│   ├── index.html                   # Shell principal de la SPA (Single Page Application)
│   ├── verificar.html               # Endpoint público de validación de credenciales QR
│   ├── sw.js                        # Service Worker para funcionamiento Offline PWA
│   ├── manifest.json                # Manifiesto de aplicación web instalable
│   ├── css/
│   │   └── styles.css               # Sistema de diseño institucional (Paleta Ayuda en Acción / ESPOCH)
│   ├── js/
│   │   ├── app.js                   # Controlador central, enrutador modular y ciclo de vida RBAC
│   │   ├── auth.js                  # Manejo de sesiones, autenticación por email institucional y roles
│   │   ├── portal.js                # Panel del encuestador (metas de avance, enlaces Enketo y checklist)
│   │   ├── gis.js                   # Motor GIS interactivo Leaflet (5,486 techos dasimétricos, 45 asentamientos oficiales)
│   │   ├── kobo_sync.js             # Módulo de integración, ingesta REST API v2 y auditoría de envíos
│   │   ├── protocols.js             # Biblioteca de protocolos CEISH, OMS, Kichwa y visor interactivo
│   │   ├── anthro_who.js            # Motor de cálculo Z-Score OMS 2006 client-side (HAZ, WAZ, WHZ, BAZ)
│   │   ├── surveyors.js             # Directorio paginado y buscador de los 73 brigadistas (36 duplas)
│   │   ├── population.js            # Pirámide poblacional y metas por cuadrante/microcuenca
│   │   ├── reports.js               # Tableros ejecutivos y analítica para supervisores y coordinación
│   │   └── credentials.js           # Generador de credenciales con código QR criptográfico
│   └── data/
│       ├── brigadistas_espoch_dci.json  # Padrón oficial de 73 brigadistas y 3 docentes con emails @espoch.edu.ec
│       └── gis/                     # Capas vectoriales GeoJSON verificadas de San Andrés
│           ├── san_andres_viviendas.geojson              # 5,486 techos habitacionales clasificados por K-NN
│           ├── comunidades_oficiales_pdot_san_andres.geojson # 45 asentamientos oficiales del PDOT Guano
│           ├── red_vial_san_andres.geojson               # Ejes viales principales y secundarios
│           └── zonas_logisticas_san_andres.geojson       # Delimitación de Sectores A, B y C
├── docker-compose.yml               # Orquestación de contenedor Nginx local en puerto 8080
├── start_local.bat                  # Script de inicio rápido en 1-clic para Windows
├── start_local.sh                   # Script de inicio rápido para Linux / macOS
└── conductor/                       # Suite de orquestación y contexto para agentes de IA
```

---

## 4. Guía de Ejecución Rápida para Sub-Agentes

1.  **Ejecución Local Nativa (Windows PowerShell / CMD):**
    ```cmd
    python -m http.server 8080 --directory "app"
    ```
    Abrir en el navegador: `http://localhost:8080`

2.  **Ejecución mediante Docker:**
    ```bash
    docker-compose up -d --build
    ```

3.  **Credenciales de Acceso RBAC 2.0 (Entorno de Pruebas y Producción):**
    *   **Encuestador (Dupla D01):** `daniela.balseca@espoch.edu.ec` / `Dci2026*`
    *   **Encuestador (Dupla D13):** `marlon.cajamarca@espoch.edu.ec` / `Dci2026*`
    *   **Supervisor Sector A:** `veronica.delgado@espoch.edu.ec` / `Dci2026*`
    *   **Supervisor Sector B:** `vilma.velasco@espoch.edu.ec` / `Dci2026*`
    *   **Supervisor Sector C:** `patricio.ramos@espoch.edu.ec` / `Dci2026*`
    *   **Coordinador Técnico:** `coordinador@espoch.edu.ec` / `Dci2026*`
    *   **Administrador / CIO:** `admin@espoch.edu.ec` / `Dci2026*`
