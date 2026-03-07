# Use official nginx image on Alpine for a minimal, production-safe image
FROM nginx:1.27-alpine

# Remove default nginx static content
RUN rm -rf /usr/share/nginx/html/*

# Copy the static site into the nginx html directory
COPY index.html style.css script.js /usr/share/nginx/html/

# Copy custom nginx config that respects Cloud Run's PORT env var
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Cloud Run sets the PORT env var (default 8080); nginx picks it up via envsubst
ENV PORT=8080

EXPOSE 8080

# Use the envsubst entrypoint so nginx.conf substitutes $PORT at startup
CMD ["/bin/sh", "-c", "envsubst '$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
