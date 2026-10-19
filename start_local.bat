@echo off
REM ==============================================================================
REM start_local.bat — Conductor de Arranque Local (Windows 10 / 11)
REM Plataforma CGPI San Andrés — Componente A.3.1 (Ayuda en Acción / ESPOCH)
REM ==============================================================================

title Centro de Mando DCI San Andres - Modo Local
color 0A

echo ======================================================================
echo   INICIANDO CENTRO DE MANDO DCI SAN ANDRES (MODO LOCAL WINDOWS)
echo   Componente A.3.1 - Ayuda en Accion Ecuador & ESPOCH
echo ======================================================================
echo.

set PORT=8080
set APP_DIR=%~dp0app

if not exist "%APP_DIR%" (
    echo [ERROR] No se encontro la carpeta "app" en esta ubicacion.
    pause
    exit /b 1
)

start http://localhost:%PORT%

echo [INFO] Servidor web disponible en: http://localhost:%PORT%
echo [INFO] Presiona F12 en Google Chrome para abrir DevTools y depurar.
echo [INFO] Para detener el servidor, presiona Ctrl+C o cierra esta ventana.
echo ----------------------------------------------------------------------

REM 1. Probar Python
python --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [MOTOR] Ejecutando con Python 3 http.server en puerto %PORT%...
    python -m http.server %PORT% -d "%APP_DIR%"
    goto :eof
)

REM 2. Probar Node npx
npx --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [MOTOR] Ejecutando con Node.js npx serve en puerto %PORT%...
    npx serve "%APP_DIR%" -l %PORT%
    goto :eof
)

REM 3. Probar PHP
php --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [MOTOR] Ejecutando con PHP built-in server en puerto %PORT%...
    php -S localhost:%PORT% -t "%APP_DIR%"
    goto :eof
)

echo [ERROR] No se detecto Python, Node.js ni PHP instalados en Windows.
echo [CONSEJO] Puedes abrir esta carpeta en VS Code y usar la extension "Live Server".
echo.
pause
