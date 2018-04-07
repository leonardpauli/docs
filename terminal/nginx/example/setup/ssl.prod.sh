#!/bin/bash
# using letsencrypt
# OBS: not pure
# ./<program> renew
# ./<program> create output/cert-and-key-prefix-path "Some Name" "example.com,www.example.com" "true" "admin@example.com"
lepathrel="../data/letsencrypt"
lepath="$(pwd)/$lepathrel"

letsencrypt () {
	docker run --rm -it \
		-v $lepath/data:/etc/letsencrypt \
		-v $lepath/public:/var/www/public \
		certbot/certbot "$@"
}

if [ "$1" = "create" ]; then
	filename=$2; # path/to/file-prefix // $filename.{crt,key}
	# name=${3:-"Some Name"} # show to user
	domains=${4:-"localhost,my-app.localhost,local.my-app.com"}
	use_staging=${5:-"true"}
	email=$6
	
	# TODO: would $lepath work just as well?
	ln -sf $lepathrel/live/mycert/fullchain.pem $filename.crt
	ln -sf $lepathrel/live/mycert/privkey.pem $filename.key

	stagingFlag="--staging"; [ "$use_staging" = "false" ] && stagingFlag=""
	letsencrypt certonly --webroot \
		--non-interactive --agree-tos --no-eff-email \
		--webroot-path /var/www/public \
		--cert-name mycert \
		--domains $domains \
		$stagingFlag --email $email
else letsencrypt $@; fi

# TODO: use quiet flag on renew?
