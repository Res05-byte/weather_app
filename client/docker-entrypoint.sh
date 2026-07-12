#!/bin/sh
set -eu

# For local docker-compose: server=backend service name, empty path
# For shared ALB: set BACKEND_HOST and BASE_PREFIX via environment variables
BACKEND_HOST=${BACKEND_HOST:-server}
BASE_PREFIX=${BASE_PREFIX:-}

# Ensure BASE_PREFIX starts with / if not empty
if [ -n "$BASE_PREFIX" ]; then
  case "$BASE_PREFIX" in
    /*) ;;
    *) BASE_PREFIX="/$BASE_PREFIX" ;;
  esac
  BASE_PREFIX=$(printf '%s' "$BASE_PREFIX" | sed 's#/*$##')
fi

if [ -f /etc/nginx/conf.d/default.conf ]; then
  sed -i "s/__BACKEND_HOST__/${BACKEND_HOST}/g; s#__BASE_PREFIX__#${BASE_PREFIX}#g" /etc/nginx/conf.d/default.conf
fi

exec nginx -g 'daemon off;'
