#!/usr/bin/env sh

domains_prod_spaced="$(echo "$server_default_prod_domains" | sed 's/,/ /g')"
domains_local_spaced="$(echo "$server_default_local_domains" | sed 's/,/ /g')"
nginx_conf_middle=""

main () {
	echo 'fix /nginx'
	fix_snippets
	fix_sites
	fix_nginx_conf
}

sed_escaped_path () { echo "$1" | sed "s/\//\\\\\//g"; }

fix_snippets () {
	cd snippets

	if [ "$server_https_force" = "true" ]; then
		cat ssl.force-https+acme.template.conf \
			| sed "s/SERVER_NAME/$domains_local_spaced $domains_prod_spaced/g" \
			| sed "s/ssl_acme_webroot/$(sed_escaped_path "$ssl_acme_webroot")/g" \
			> ssl.force-https+acme.conf
		nginx_conf_middle="$nginx_conf_middle""include snippets/ssl.force-https+acme.conf;"$'\n'
	fi

	cd ..
}


fix_default_site () {
	write_out_site () {
		port_part="80"; [ "$server_https_force" = "true" ] && port_part="443 ssl"
		ssl_comment="#"; [ "$server_https_force" = "true" ] && ssl_comment=""
		{ echo "$(cat)" >> "$site.conf"; } <<-EOF
			server {
				listen $port_part;
				listen [::]:$port_part;
				server_name $2;

				$ssl_comment ssl_certificate ssl/$1.crt;
				$ssl_comment ssl_certificate_key ssl/$1.key;

				include sites/$site.inner.conf;
			}
			EOF
		# https://stackoverflow.com/questions/7947030/nginx-no-www-to-www-and-www-to-no-www
		[ "$server_default_redirect_from_www" = "true" ] && { echo "$(cat)" >> "$site.conf"; } <<-EOF
			server {
				listen $port_part;
				listen [::]:$port_part;
				server_name "~^www\.($(echo "$2" | tr ' ' '|'))\$";

				$ssl_comment ssl_certificate ssl/$1.crt;
				$ssl_comment ssl_certificate_key ssl/$1.key;

				return 301 \$scheme://\$1\$request_uri;
			}
			EOF
	}
	[ "$server_prod_enable" = "true" ] && write_out_site prod "$domains_prod_spaced"
	[ "$server_local_enable" = "true" ] && write_out_site local "$domains_local_spaced"
}


fix_sites () {
	cd sites
	for site in *.inner.conf; do
		site="$(echo "$site" | sed 's/.inner.conf//')"
		
		echo "# compiled" > "$site.conf"
		if [ "$site" = "default" ]; then
			fix_default_site
		else
			[ "$server_prod_enable" = "true" ] && cat "$site.prod.conf" 2> /dev/null >> "$site.conf"
			[ "$server_local_enable" = "true" ] && cat "$site.local.conf" 2> /dev/null >> "$site.conf"
		fi

		nginx_conf_middle="$nginx_conf_middle""include sites/$site.conf;"$'\n'
	done
	cd ..
}


fix_nginx_conf () {
	cat nginx.template.conf \
		| replace_with_multiline "MIDDLE" "$nginx_conf_middle" \
		> nginx.conf
}


# helpers
replace_with_multiline () {
	to_find="$1"
	to_repl="$2"

	tmp_file=$(mktemp)
	trap "rm -rf $tmp_file" EXIT
	echo "$to_repl" > $tmp_file

	cat - | sed "/$to_find/ r $tmp_file" | sed "/$to_find/d"
}


# start
main
