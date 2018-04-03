#!/bin/sh
echo "INIT and START" \
&& cp -R setup/makeshift-data/ssl /etc/nginx && cp -R data/ssl /etc/nginx \
&& (cd /etc/nginx/sites && ./init.sh) \
&& /usr/sbin/nginx -g "daemon off;"
