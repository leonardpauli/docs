#!/bin/bash
# using letsencrypt
#
# envtoload="SSL_PROD_STAGEING DOMAINS_PROD SSL_PROD_EMAIL"
# [ -f .env ] && for a in $envtoload; do export $a="$(cat .env | grep $a= | sed -e "s/.*=//g")"; done
# or: export SSL_PROD_STAGEING=true; export DOMAINS_PROD='example.com'; export SSL_PROD_EMAIL='admin@example.com'
#
# ./<program> renew -q
# ./<program> create
lepath="$(pwd)/../data/letsencrypt"


letsencrypt () {
	docker run --rm -it \
		-v $lepath/data:/etc/letsencrypt \
		-v $lepath/data2:/var/lib/letsencrypt \
		-v $lepath/public:/var/www/public \
		certbot/certbot "$@"
}

if [ "$1" = "create" ]; then
	stagingFlag="--staging"; [ "$SSL_PROD_STAGEING" = "false" ] && stagingFlag=""
	letsencrypt certonly --webroot \
		--agree-tos --no-eff-email \
		--webroot-path /var/www/public \
		--cert-name mycert \
		--domains $DOMAINS_PROD \
		$stagingFlag --email $SSL_PROD_EMAIL
else letsencrypt $@; fi
