#!/bin/sh
set -e

# Ensure PORT is set (Cloud Run always provides this)
if [ -z "${PORT}" ]; then
  echo "ERROR: PORT environment variable is not set" >&2
  exit 1
fi

# Substitute the PORT environment variable into the nginx config template
envsubst '${PORT}' < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/default.conf

# Start nginx in the foreground (required by Cloud Run)
exec nginx -g 'daemon off;'
