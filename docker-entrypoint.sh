#!/bin/sh
set -eu

BACKEND_HOST=${BACKEND_HOST:-127.0.0.1}
BASE_PREFIX=${BASE_PREFIX:-/reshma}

case "$BASE_PREFIX" in
  /*) ;;
  *) BASE_PREFIX="/$BASE_PREFIX" ;;
esac
BASE_PREFIX=$(printf '%s' "$BASE_PREFIX" | sed 's#/*$##')

if [ -f /etc/nginx/conf.d/default.conf ]; then
  sed -i "s/__BACKEND_HOST__/${BACKEND_HOST}/g; s#__BASE_PREFIX__#${BASE_PREFIX}#g" /etc/nginx/conf.d/default.conf
fi

exec nginx -g 'daemon off;'
