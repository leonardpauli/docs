#!/usr/bin/env sh
nginx_conf_http_middle=""

main () {
	echo 'fix /nginx'
	sites_fix

	name="default"; envi="prod";
	nginx_conf_http_middle="$nginx_conf_http_middle""$([ "$server_https_force" = "true" ] \
		&& (cat snippets/ssl.force-https+acme.template.conf | eval_template) || echo '')"$'\n'
	
	(cat nginx.template.conf | eval_template) > nginx.conf
}

get_var () { eval echo "\$$1"; }

sites_wrap () {
	envi="$1" # prod/local
	innerContent="$2"
	name="$3"

	echo "{{&=name='$name'}}{{&=envi='$envi'}}"
	cat <<'EOF'
{{&=domains="$(get_var "server_${name}_${envi}_domains" | sed 's/,/ /g')"}}
{{&=port_part="$([ "$server_https_force" = "true" ] && echo "443 ssl" || echo "80")"}}


# site {{=$name}}, {{=$envi}}
server {
	listen {{=$port_part}};
	listen [::]:{{=$port_part}};
	server_name {{=$domains}};
	{{ if [ "$server_https_force" = "true" ]; then
		echo "ssl_certificate ssl/$envi.crt;"
		echo "ssl_certificate_key ssl/$envi.key;"
	fi }}
EOF
	echo "$innerContent"
	echo '}'
	
	# https://stackoverflow.com/questions/7947030/nginx-no-www-to-www-and-www-to-no-www
	cat <<'EOF'

{{ [ "$server_default_redirect_from_www" = "true" ] && cat <<EOwwwF

# server_default_redirect_from_www
server {
	listen $port_part;
	listen [::]:$port_part;
	server_name "~^www\.($(echo "$domains" | tr ' ' '|'))\$";
	$( if [ "$server_https_force" = "true" ]; then
		echo "ssl_certificate ssl/$envi.crt;"
		echo "ssl_certificate_key ssl/$envi.key;"
	fi )
	return 301 \$scheme://\$1\$request_uri;
}

EOwwwF
}}

EOF
}


# sites
# 	x.conf -> used
# 	x.inner.conf -> x.inner.prod.conf -> forces compilation of x.conf
# 	x.inner.local.conf -> overrides x.inner.conf for local in x.conf if exists
# 	x.prod.conf -> overrides whole prod part of x.conf
# 	x.local.conf -> overrides whole local part of x.conf
# 	
# 	x.conf
# 		x.prod.conf
# 			wrapper
# 			x.inner.conf
# 		x.local.conf
# 			wrapper
# 			x.inner.local.conf
# 				x.inner.conf
# 
# for f in *.inner.conf
# 	$site: f - .inner.conf
# 	"# compiled" > $site.conf
# 	# prod
# 	$site.prod.conf >> $site.conf if exists, else:
# 		$(wrapped prod $site.inner.conf) >> $site.conf
# 	$site.local.conf >> $site.conf if exists, else:
# 		inner: $site.inner.local.conf or $site.inner.conf
# 		$(wrapped local inner) >> $site.conf


sites_fix () {
	cd sites
	for site in *.inner.conf; do
		site="$(echo "$site" | sed 's/.inner.conf//')"
		
		echo "# compiled" > "$site.conf"
		
		# prod
		if [ "$server_prod_enable" = "true" ]; then
			# $site.conf += $site.prod.conf, if exists, else: wrapped prod $site.inner.conf
			([ -f "$site.prod.conf" ] && cat "$site.prod.conf" || sites_wrap prod "$(cat "$site.inner.conf")" "$site") >> "$site.conf"
		fi

		# local
		if [ "$server_local_enable" = "true" ]; then
			# inner: $site.inner.local.conf or $site.inner.conf
			inner="$([ -f "$site.inner.local.conf" ] && echo "$site.inner.local.conf" || echo "$site.inner.conf")"
			# $site.conf += $site.local.conf, if exists, else: wrapped local inner
			([ -f "$site.local.conf" ] && cat "$site.local.conf" || sites_wrap local "$(cat "$inner")" "$site") >> "$site.conf"
		fi

		# replace env + fns
		cat "$site.conf" | eval_template | sponge "$site.conf"

		nginx_conf_http_middle="$nginx_conf_http_middle""include sites/$site.conf;"$'\n'
	done
	cd ..
}


# helpers
sponge () { if [ -z "$1" ]; then cat; else mytmp="$(mktemp)"; cat > $mytmp; mv $mytmp "$1"; fi }

replace_with_multiline () {
	to_find="$1"
	to_repl="$2"

	tmp_file=$(mktemp)
	trap "rm -rf $tmp_file" EXIT
	echo "$to_repl" > $tmp_file

	cat - | sed "/$to_find/ r $tmp_file" | sed "/$to_find/d"
}

eval_template () { # not "safe" in terms of eval
	# echo 'a\na {{echo "b\nb"}} c {{echo d}} e' | eval_template # -> 'a\na b\nb c d e'
	# hello=hi; echo '{{=$hello}} there' | eval_template # -> {{echo "$hello"}} there -> 'hi there'
	# echo '{{&=b="hello"}} {{&:a="$(sleep 1 && date)"}} {{=$a}} {{=$a}} {{echo there $b}}!' | eval_template
	#  use {{&=varname="$(code)"}} if you only need varname (eval:ed once)
	#  use {{&:code}} if code sets multiple vars (though will be run for every {{}})
	varstore=$(mktemp); trap "rm -rf $varstore" EXIT; echo "# TMP" > "$varstore"
	fn () {
		middle="$(cat)"
		case "$middle" in
			'='*) eval "$(cat "$varstore")"$'\n'"echo \"${middle#=}\"" ;; # '=$a' -> 'echo "$a"'
			'&='*) echo "$(echo "${middle#&=}" | sed 's/=.*//')='$(eval "$(cat "$varstore")"$'\n'"$(echo "${middle#&=}" | sed 's/[^=]*=/echo /')")'" >> "$varstore";;
			'&:'*) echo "${middle#&:}" >> "$varstore";;
			*) eval "$(cat "$varstore")"$'\n'"$middle";;
		esac
	}
	cat | replace_multiline_enclosed '{{' fn '}}'
}

replace_multiline_enclosed () {
	sub_start="$1"; shift; fn_name="$1"; shift; sub_end="$1"; shift; left="$(cat)";
	# uppercase () { cat | tr 'a-z' 'A-Z'; }; echo 'Hello [there]!' | replace_multiline_enclosed '\[' uppercase '\]'

	# make single-line, sanitize input against _SUB(START|END)_, a\ra {{echo "b\rb"}} c {{echo d}} e
	left="$(echo "$left" | tr '\n' '\r' | sed 's/_SUB/_ASUB/g')"

	while [[ ! -z "$left" ]]; do
		left="$(echo "$left" | sed "s/$sub_start/_SUBSTART_/")" # a\ra _SUBSTART_echo "b\rb"}} c {{echo d}} e
		printf '%s' "$(echo "$left" | sed 's/_SUBSTART_.*//' | sed 's/_ASUB/_SUB/g' | tr '\r' '\n')" # a\na

		lefttmp="$(echo "$left" | sed 's/.*_SUBSTART_//' | sed "s/$sub_end/_SUBEND_/")" # echo "b\rb"_SUBEND_ c {{echo d}} e
		if [ "$lefttmp" = "$left" ]; then left=''; break; fi
		left="$lefttmp"

		middle="$(echo "$left" | sed 's/_SUBEND_.*//' | tr '\r' '\n')" # echo "b\nb"
		[ ! -z "$middle" ] && printf '%s' "$(echo "$middle" | $fn_name | sed 's/_ASUB/_SUB/g')" # b\nb
		left="$(echo "$left" | sed 's/.*_SUBEND_//')" # c {{echo d}} e
	done
}


# start
main
