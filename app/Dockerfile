FROM nginx:alpine

# Install curl for container healthcheck
RUN apk add --no-cache curl

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy web application assets
COPY . /usr/share/nginx/html/

# Clean up build-only files from docroot
RUN rm -f /usr/share/nginx/html/Dockerfile /usr/share/nginx/html/nginx.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
