FROM nginx:alpine

COPY index.html style.css script.js /usr/share/nginx/html/
COPY nginx.conf.template /etc/nginx/conf.d/nginx.conf.template
COPY run.sh /run.sh
RUN chmod +x /run.sh

EXPOSE 8080
# Note: PORT env var is always set by Cloud Run (defaults to 8080 per cloudbuild.yaml --port flag).
# EXPOSE is documentation-only and does not affect runtime behaviour.
CMD ["/run.sh"]
