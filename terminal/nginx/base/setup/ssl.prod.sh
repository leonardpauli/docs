#!/bin/bash
# using letsencrypt
# OBS: not pure
# ./<program> renew
# ./<program> create output-cert-and-key-prefix-name "Some Name" "example.com,www.example.com" "true" "admin@example.com"
data_path="$(pwd)/../data"
lepath="letsencrypt"
sslpath="ssl"
ssl_to_data_path=".."

letsencrypt () {
	mkdir -p $data_path/$lepath/{data,logs,public,lib}
	docker run --rm -it \
		-v $data_path/$lepath/data:/etc/letsencrypt \
		-v $data_path/$lepath/public:/var/www/public \
		-v $data_path/$lepath/logs:/var/log/letsencrypt \
		-v $data_path/$lepath/lib:/var/lib/letsencrypt \
		certbot/certbot "$@"
}

if [ "$1" = "create" ]; then
	filename=$2; # file-prefix // $filename.{crt,key}
	# name=${3:-"Some Name"} # show to user
	domains=${4:-"localhost,my-app.localhost,local.my-app.com"}
	email=$5
	use_staging=${6:-"true"}
	
	ln -sf $ssl_to_data_path/$lepath/data/live/mycert/fullchain.pem $data_path/$sslpath/$filename.crt
	ln -sf $ssl_to_data_path/$lepath/data/live/mycert/privkey.pem $data_path/$sslpath/$filename.key

	stagingFlag="--staging"; [ "$use_staging" = "false" ] && stagingFlag=""
	letsencrypt certonly --webroot \
		--non-interactive --agree-tos --no-eff-email \
		--webroot-path /var/www/public \
		--cert-name mycert \
		--domains $domains \
		$stagingFlag --email $email
else letsencrypt "$@"; fi

# TODO: use quiet flag on renew?
