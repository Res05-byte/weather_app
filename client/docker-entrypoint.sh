#!/bin/sh
set -eu

# For local docker-compose, the backend service is named "server". Override
# BACKEND_HOST when deploying the frontend against a different backend.
BACKEND_HOST=${BACKEND_HOST:-server}

if [ -f /etc/nginx/conf.d/default.conf ]; then
  sed -i "s/__BACKEND_HOST__/${BACKEND_HOST}/g" /etc/nginx/conf.d/default.conf
fi

exec nginx -g 'daemon off;'
