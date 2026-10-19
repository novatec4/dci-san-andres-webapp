# Guía de Integración Nginx en Producción — DCI San Andrés v3.0.0
**Destinatario:** Agente de Infraestructura / Sysadmin del Servidor de Producción  
**Proyecto:** Plataforma DCI San Andrés (Componente A.3.1 - Ayuda en Acción / ESPOCH)  
**Versión:** v3.0.0 Oficial (React 18 + Vite + Tailwind CSS)

---

## 1. Contexto de Infraestructura
- El servidor de producción ya cuenta con un contenedor **Nginx dedicado e independiente** que gestiona los dominios y la infraestructura global (`info-dci.bidata.dev`).
- La aplicación frontend ha sido compilada a archivos estáticos puros (HTML, JS, CSS y assets) ubicados en el directorio `dist/`.
- No requiere Node.js en tiempo de ejecución en producción; es 100% estático de altísimo rendimiento.

---

## 2. Métodos de Despliegue Disponibles

### Opción A: Montaje Directo del Directorio `dist/` en el Contenedor Nginx Global (Recomendado)
1. Subir o sincronizar la carpeta `dist/` al servidor (ej. `/var/www/dci-sanandres/dist/`).
2. En el docker-compose o configuración de volúmenes de su Nginx global, mapear:
   ```yaml
   volumes:
     - /var/www/dci-sanandres/dist:/var/www/dci-app:ro
   ```

### Opción B: Proxy Inverso hacia el Contenedor Web Local de DCI
Si prefiere correr el contenedor local `cdi_aea_webapp` expuesto en un puerto interno (ej. `127.0.0.1:8086`), su Nginx global simplemente hace un `proxy_pass http://127.0.0.1:8086;`.

---

## 3. Bloque de Configuración Nginx Recomendado (`nginx_prod.conf.example`)

```nginx
server {
    listen 80;
    server_name info-dci.bidata.dev;

    # Directorio raíz con el contenido de dist/
    root /var/www/dci-app;
    index index.html;

    # Compresión Gzip para alto rendimiento en zonas rurales
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json image/svg+xml;

    # Cabeceras de Seguridad y Bioética LOPDP
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Assets estáticos con hashing de Vite (Cache inmutable por 1 año)
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Capas GeoJSON y datos estáticos
    location ~* \.geojson$ {
        default_type application/json;
        add_header Access-Control-Allow-Origin "*";
        add_header Cache-Control "no-cache, must-revalidate" always;
    }

    # Endpoint de Monitoreo / Healthcheck
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    # Enrutamiento SPA (React Router / Hash / Vanity Routes)
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate" always;
    }

    # Página de error
    error_page 500 502 503 504 /50x.html;
}
```

---

## 4. Verificación de Funcionamiento
1. Ejecutar `nginx -t` en el contenedor para validar sintaxis.
2. Recargar configuración: `nginx -s reload` (o reiniciar contenedor).
3. Comprobar status HTTP:
   ```bash
   curl -I https://info-dci.bidata.dev/health
   # Retorna: HTTP/2 200 con "healthy"
   ```
4. Navegar a:
   - `https://info-dci.bidata.dev/` -> Carga el login clínico sin emojis.
   - Probar acceso con Nutricionista: `nutricionista@dci.ec` / `nutri123`.
