#!/bin/sh
echo "INIT and START" \
&& mkdir -p /etc/nginx/ssl \
	&& ln -sf $(pwd)/setup/makeshift-data/ssl/* /etc/nginx/ssl/ \
	&& ln -sf $(pwd)/data/ssl/* /etc/nginx/ssl/ \
&& (cd /etc/nginx/sites && ./init.sh) \
&& /usr/sbin/nginx -g "daemon off;"
