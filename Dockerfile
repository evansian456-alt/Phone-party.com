FROM nginx:alpine

# Install gettext for envsubst
RUN apk add --no-cache gettext

# Copy static files
COPY index.html style.css script.js /usr/share/nginx/html/

# Copy nginx config template and startup script
COPY nginx.conf.template /etc/nginx/conf.d/nginx.conf.template
COPY run.sh /run.sh

# Make startup script executable
RUN chmod +x /run.sh

# Expose port 8080 (though Cloud Run will use the value of $PORT)
EXPOSE 8080

# Run the startup script
CMD ["/run.sh"]
