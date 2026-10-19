#!/usr/bin/env bash
# ==============================================================================
# start_local.sh — Conductor de Arranque Local (Linux / macOS)
# Plataforma CGPI San Andrés — Componente A.3.1 (Ayuda en Acción / ESPOCH)
# ==============================================================================

set -euo pipefail

PORT=8080
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/app"

echo "======================================================================"
echo "  🚀 INICIANDO CENTRO DE MANDO DCI SAN ANDRÉS (MODO LOCAL)"
echo "  Componente A.3.1 — Ayuda en Acción Ecuador & ESPOCH"
echo "======================================================================"

if [ ! -d "${APP_DIR}" ]; then
    echo "❌ Error: No se encontró el directorio 'app/' en ${APP_DIR}."
    exit 1
fi

open_browser() {
    local url="http://localhost:${PORT}"
    sleep 1
    if command -v xdg-open >/dev/null 2>&1; then
        xdg-open "${url}" >/dev/null 2>&1 || true
    elif command -v open >/dev/null 2>&1; then
        open "${url}" >/dev/null 2>&1 || true
    fi
}

open_browser &

echo "🌐 Servidor disponible en: http://localhost:${PORT}"
echo "💡 Presiona F12 en Google Chrome para abrir DevTools y depurar."
echo "🛑 Presiona Ctrl+C para detener el servidor local."
echo "----------------------------------------------------------------------"

# 1. Intentar con Python 3
if command -v python3 >/dev/null 2>&1; then
    echo "⚡ Usando motor: Python 3 http.server..."
    python3 -m http.server "${PORT}" --directory "${APP_DIR}"
    exit 0
fi

# 2. Intentar con Python 2
if command -v python >/dev/null 2>&1; then
    echo "⚡ Usando motor: Python http.server..."
    (cd "${APP_DIR}" && python -m SimpleHTTPServer "${PORT}")
    exit 0
fi

# 3. Intentar con Node.js / npx serve
if command -v npx >/dev/null 2>&1; then
    echo "⚡ Usando motor: Node.js (npx serve)..."
    npx serve "${APP_DIR}" -l "${PORT}"
    exit 0
fi

# 4. Intentar con PHP built-in server
if command -v php >/dev/null 2>&1; then
    echo "⚡ Usando motor: PHP built-in server..."
    php -S "localhost:${PORT}" -t "${APP_DIR}"
    exit 0
fi

echo "❌ No se detectó Python, Node.js ni PHP para levantar el servidor web local."
echo "👉 Instala Python 3 o Node.js en tu equipo, o usa la extensión 'Live Server' de VS Code."
exit 1
