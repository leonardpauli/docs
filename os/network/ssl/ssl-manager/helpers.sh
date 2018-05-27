#!/usr/bin/env sh
helpers_file='/app/helpers.sh'
ssl_crt_create_post_script="echo \"\$(date) new-cert \$name\" >> '$ssl_crt_created_log'"
ssl_crt_create_post_script_invoke () { echo "name='$1'; $ssl_crt_create_post_script" | sh; }

# subs

cleanup () {
	echo 'ssl.autorenew.clear'
	(crontab -l | sed -E "s/.* # $cron_prefix.*/ /g" | sed '/^ $/d') | crontab -
}

ssl_data_makeshift_use_fn () {
	cd "data-makeshift"

	if [ ! -f "$ssl_dhparam_path" ]; then
		echo "$ssl_dhparam_path.makeshift"
		touch "$ssl_dhparam_path.makeshift"
		cp ssl/dhparam.pem "$ssl_dhparam_path"
	fi
	if [ ! -f "$ssl_local_ca_key" ]; then
		echo "$ssl_local_ca_crt.makeshift"
		touch "$ssl_local_ca_crt.makeshift"
		cp ca/ca.key "$ssl_local_ca_key"
		cp ca/ca.pem "$ssl_local_ca_crt"
	fi
	if [ ! -f "$ssl_local_key" ]; then
		echo "$ssl_local_crt.makeshift"
		touch "$ssl_local_crt.makeshift"
		cp ssl/local.key "$ssl_local_key"
		cp ssl/local.csr "$ssl_local_csr"
		cp ssl/local.crt "$ssl_local_crt"
	fi
	if [ ! -f "$ssl_prod_key" ]; then
		echo "$ssl_prod_crt.makeshift"
		touch "$ssl_prod_crt.makeshift"
		cp ssl/prod.key "$ssl_prod_key"
		cp ssl/prod.csr "$ssl_prod_csr"
		cp ssl/prod.crt "$ssl_prod_crt"
	fi

	touch "$ssl_crt_created_log"

	cd ..
}

ssl_dhparam_create_fn () {
	openssl dhparam -out "$dhparam_path" 4096;
}

ssl_ca_create () {
	openssl genrsa -out "$ca_key" 2048
	openssl req -x509 -new -nodes -sha256 -days 365 \
		-subj "/CN=$ca_displayname" \
		-key "$ca_key" -out "$ca_crt"

	cp data-makeshift/ca/sign-request.sh "$ca_signscript"
	chmod u+x "$ca_signscript"
}


# ssl_crt_create
ssl_crt_key_create () {
	echo "ssl_crt_key_create $crt_key"
	openssl genrsa -out "$crt_key" 2048
}
ssl_crt_signscript_create () {
	echo "ssl_crt_signscript_create $ca_signscript"
	{ echo "$(cat)" > "$ca_signscript"; } <<-EOF
	#!/usr/bin/env sh
	crt_csr="\$1"; crt_crt="\$2"

	extracted_san="\$( \\
		openssl req -text -noout -in "\$crt_csr" | tr \$'\n' ';' \\
			| sed -e "s/.*X509v3 Subject Alternative Name: ; *\([^;]*\).*/\1/" \\
	)"

	extfile=\$(mktemp); trap "rm -f \$extfile" EXIT
	echo "keyUsage = nonRepudiation, digitalSignature, keyEncipherment" > "\$extfile"
	echo "subjectAltName = \$extracted_san" >> "\$extfile"

	openssl x509 -req -sha256 -days 30 \\
		-CAcreateserial \\
		-CA "$ca_crt" -CAkey "$ca_key" \\
		-extfile "\$extfile" \\
		-in "\$crt_csr" -out "\$crt_crt"
	EOF
	# -extfile $DIR/tmp.ext 
	# todo: logic to check domains / csr content
	chmod u+x "$ca_signscript"
}
ssl_crt_csr_create () {
	echo "ssl_crt_csr_create $crt_csr"
	# partly based on acme.sh
	# TODO: fix idn support or just use acme.sh's createcsr fn
	# oh, see acme.sh --createCSR

	{ echo "$(cat)" > "$crt_csr_conf"; } <<-EOF
		[ req_distinguished_name ]
		[ req ]
		distinguished_name = req_distinguished_name
		req_extensions = v3_req
		[ v3_req ]

	EOF
	echo "keyUsage = nonRepudiation, digitalSignature, keyEncipherment" >> "$crt_csr_conf"
	# keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
	# authorityKeyIdentifier=keyid,issuer
	# basicConstraints=CA:FALSE

	# domains="$(_idn "$domains")"
	# subjectAltName = DNS:example.com, DNS:*.other.com, IP:127.0.0.1
	alt="DNS:$(echo "$crt_domains" | sed "s/,,/,/g" | sed "s/,/,DNS:/g")"
	echo "subjectAltName = $alt" >> "$crt_csr_conf"

	# [ "$ocsp_use_letsencrypt" ] && printf -- "\nbasicConstraints = CA:FALSE\n1.3.6.1.5.5.7.1.24=DER:30:03:02:01:05" >> "$csrconf"
	# _csr_cn="$(_idn "$domain")"
	# csr_key, not crt_key?

	crt_displayname="$(first_domain_get "$crt_domains")" # has to be first domain name for letsencrypt
	openssl req -new -sha256 -key "$crt_key" -subj "/CN=$crt_displayname" -config "$crt_csr_conf" -out "$crt_csr"
}
ssl_crt_csr_sign () {
	echo "ssl_crt_csr_sign $crt_signscript '$crt_csr' '$crt_crt'"
	# crt_csr crt_crt crt_signscript
	$crt_signscript "$crt_csr" "$crt_crt"
}
ssl_crt_renewal_setup () {
	name=${1:-anon}
	cron_add "$crt_renew_schedule" "ssl-$name" \
		"$crt_signscript '$crt_csr' '$crt_crt' && (name='local'; $ssl_crt_create_post_script)"
	# echo "$(date): set-renew-needed triggered by '$sender'" >> $data/ssl/renew-needed
}


# ssl_acme
ssl_acme () {
	local stagingflag="--staging"; [ "$ssl_acme_staging" = "false" ] && stagingflag=""
	$ssl_acme_home/acme.sh --home "$ssl_acme_home" $stagingflag "$@"
}
ssl_acme_init () { ssl_acme --updateaccount --accountemail "$ssl_acme_notify_email"; }
ssl_acme_csr_sign () {
	ssl_acme --signcsr --csr "$crt_csr" -w "$ssl_acme_webroot" --fullchain-file "$crt_crt" "$@";
	# --force
	
	# --cert-file /path/to/real/cert/file After issue/renew, the cert will be copied to this path.
	# --key-file /path/to/real/key/file After issue/renew, the key will be copied to this path.
	# --ca-file /path/to/real/ca/file After issue/renew, the intermediate cert will be copied to this path.
	# --fullchain-file /path/to/fullchain/file After issue/renew, the fullchain cert will be copied to this path.
	# --reloadcmd "[command]" Command used after issue/renew, usually to reload the server.
	# --csr Specifies the input csr.
}
ssl_acme_crt_renewal_setup () {
	name=${1:-anon}
	crt_signscript="(source '$helpers_file'; crt_csr='$crt_csr' crt_crt='$crt_crt'; ssl_acme_csr_sign)"
	cron_add "$crt_renew_schedule" "ssl-$name" \
		"$crt_signscript && (name='prod'; $ssl_crt_create_post_script)"
	# todo: use --reloadcmd for ssl_crt_create_post_script
	# ie. ssl_acme_csr_sign --reloadcmd \"(name='prod'; $ssl_crt_create_post_script)\"
}
ssl_acme_await_online () {
	online_check_path=".well-known/acme-challenge/online"
	online_check_file="$ssl_acme_webroot/$online_check_path"
	endpoint="http://$(first_domain_get "$crt_domains")/$online_check_path"

	rm -rf "$online_check_file"; mkdir -p "$online_check_file"; rm -rf "$online_check_file"
	echo 'online' > "$online_check_file"

	echo "waiting for $endpoint to respond with 'online'..."
	while ! (res="$(curl -m 5 -sS "$endpoint")" && echo "$res" \
		&& echo "$res" | grep 'online' > /dev/null); do printf "."; sleep 5; done
	echo "$host responded"
	
	rm "$online_check_file"
}


# helpers
first_domain_get () { echo "$1" | sed 's/,.*//'; }
await_ping () {
	host="$1"
	while ! ping -w 1 -c 1 "$host" > /dev/null; do
		echo "waiting for $host to respond..."; sleep 1; done
	echo "$host responded"
}
cron_add () {
	echo "cron.add: $cron_prefix $2"
	(crontab -l && echo "$1 cd '$(pwd)' && $3 # $cron_prefix $2") | crontab -
}
isnt_created () { ([ ! -f "$1" ] || [ -f "$1.makeshift" ]) && return 0 || return 1; }
# isnt_created () { [ ! -f "$1" ] || [ -f "$1.makeshift" ]; } # enough? or $??
keep_alive () { tail -f /dev/null; }
