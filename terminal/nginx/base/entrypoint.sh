#!/bin/sh
echo "entrypoint" \
&& (cd /etc/nginx && ./init.sh) \
&& /usr/sbin/nginx -g "daemon off;"
