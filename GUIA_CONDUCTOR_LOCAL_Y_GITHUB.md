# 🚀 Guía de Desarrollo Local y Gestión de GitHub
## Plataforma CGPI San Andrés — Componente A.3.1
**Proyecto:** "San Andrés y Manglaralto: Territorios Libres de Desnutrición Infantil"  
**Entidades:** Ayuda en Acción Ecuador & Escuela Superior Politécnica de Chimborazo (ESPOCH)  
**Versión:** 2.3.4 (Edición de Producción y Desarrollo Local con Módulo de Credenciales QR)

---

## 1. Inicio Rápido en tu Computadora (En 1 Clic)

Este paquete incluye un **"conductor de arranque"** que detecta automáticamente las herramientas instaladas en tu computadora (Python 3, Node.js o PHP) y levanta el servidor web sin necesidad de configuraciones complejas:

### Si usas Windows:
* Haz doble clic sobre el archivo **`start_local.bat`**.
* Se abrirá automáticamente tu navegador Google Chrome en `http://localhost:8080`.

### Si usas macOS o Linux:
* Abre tu terminal en la carpeta del proyecto y ejecuta:
  ```bash
  ./start_local.sh
  ```
* Se abrirá automáticamente tu navegador en `http://localhost:8080`.

### Alternativa con Visual Studio Code:
* Abre la carpeta en VS Code y con la extensión **Live Server**, haz clic derecho en `app/index.html` -> *Open with Live Server*.

---

## 2. Credenciales Oficiales para Pruebas Locales

La plataforma cuenta con una pantalla de Login obligatorio y matriz de permisos por roles (RBAC 2.0). Puedes escribir las credenciales o usar los botones de **Acceso Rápido (Chips Demo)** en la pantalla de ingreso:

| Perfil / Rol | Correo Electrónico | Contraseña | Vistas y Módulos Habilitados |
| :--- | :--- | :--- | :--- |
| **Administrador / CIO** | `admin@dci.ec` | `admin123` | **Acceso Total (8 módulos)**: Dashboard, GIS, KoBo, Equipo, Protocolos, Población, Usuarios, Reportes. |
| **Supervisor de Campo** | `supervisor@dci.ec` | `supervisor123` | Dashboard, GIS, KoBo, Equipo, Protocolos, Población, Reportes. |
| **Encuestador de Terreno** | `encuestador@dci.ec` | `campo123` | **Modo Terreno**: Mapa GIS San Andrés, Protocolos de Campo, Directorio de Equipo. |
| **Nutricionista / Antropometría** | `nutricionista@dci.ec` | `nutri123` | Mapa GIS, Protocolos, Población Infantil (Z-scores OMS), Reportes. |
| **Observador Institucional** | `observador@dci.ec` | `visor123` | Dashboard Ejecutivo, Mapa GIS, Protocolos, Reportes (solo lectura). |

---

## 3. Depuración Profesional con Chrome DevTools (F12)

En tu navegador Google Chrome, presiona la tecla **F12** (o `Ctrl + Shift + I` en Windows/Linux, `Cmd + Option + I` en Mac):

1. **Pestaña Console**:
   - Aquí verás los mensajes de inicialización de módulos, carga de capas GeoJSON y cálculos de Z-scores OMS.
   - Ya no aparecen errores de sintaxis ni bloqueos de interfaz.
2. **Pestaña Application > Storage > Session Storage & Local Storage**:
   - `cgpi_auth_session_v2`: Contiene la sesión activa del usuario actual.
   - `cgpi_users_db_v2`: Base de datos de usuarios administrable.
   - `kobo_offline_submissions`: Envíos de encuestas y meta muestral.
3. **Simulador de Dispositivos Móviles (`Ctrl + Shift + M`)**:
   - Activa el modo responsivo para probar la vista en iPhone 14, Samsung Galaxy o Pixel 7.
   - Comprueba la **Mobile TopBar** superior y la **Mobile Bottom Nav** inferior con estilo de App Nativa.

---

## 4. Cómo Crear y Conectar el Repositorio Oficial en GitHub

Para llevar el control de versiones formal en tu cuenta de GitHub, sigue estos sencillos pasos desde la terminal de tu computadora:

### Paso 1: Crear el repositorio en GitHub
1. Entra a [GitHub](https://github.com/new).
2. Nombre sugerido: `dci-san-andres-webapp` (o el que defina la institución).
3. Selecciona **Private** (Privado) para resguardar la cartografía y datos del proyecto.
4. **NO** marques "Add a README file" ni "Add .gitignore" (este paquete ya los incluye configurados).
5. Haz clic en **Create repository**.

### Paso 2: Inicializar y subir el código desde tu computadora
Abre tu terminal en la carpeta raíz del proyecto descargado y ejecuta:

```bash
# 1. Inicializar git local
git init

# 2. Agregar todos los archivos (el .gitignore excluirá temporales)
git add .

# 3. Primer commit formal
git commit -m "feat: version base 2.3.0 funcional con soporte movil, RBAC y GIS San Andres"

# 4. Establecer la rama principal
git branch -M main

# 5. Conectar con tu repositorio de GitHub (reemplaza con tu URL)
git remote add origin https://github.com/<tu-usuario>/<nombre-del-repo>.git

# 6. Subir el código a GitHub
git push -u origin main
```

---

## 5. Protocolo de Re-Despliegue en el Servidor de Producción (`uprocach-01`)

Una vez que realices cambios, mejoras o ajustes en tu computadora local y hagas `git push`:

1. **Notificación al Agente:**
   Escribe en el chat del servidor:  
   > *"Listo, ya subí las mejoras a GitHub (o pasé la actualización). Por favor despliega los cambios en el servidor."*

2. **Acciones Automáticas del Servidor:**
   - Se creará un backup comprimido `.tar.gz` fechado en `/home/uprocach/backups/`.
   - Se sincronizarán los cambios (`git pull origin main`).
   - Se recargará Nginx en el contenedor (`docker exec cdi_aea_webapp nginx -s reload`) con **cero segundos de caída**.
   - Los cambios quedarán inmediatamente en vivo en:  
     🌐 **`https://info-dci.bidata.dev`**
