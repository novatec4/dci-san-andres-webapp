# =============================================================================
# DOCKERFILE - Plataforma DCI San Andrés v3.0.0 (Producción / Local Nginx)
# Componente A.3.1 - Ayuda en Acción / ESPOCH
# =============================================================================

FROM nginx:alpine

# Herramientas mínimas para diagnóstico y healthcheck
RUN apk add --no-cache curl

# Limpieza del docroot por defecto
RUN rm -rf /usr/share/nginx/html/*

# Configuración Nginx optimizada para SPA y GeoJSON
COPY app/nginx.conf /etc/nginx/conf.d/default.conf

# Copia de la compilación estática generada por Vite
COPY dist/ /usr/share/nginx/html/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
