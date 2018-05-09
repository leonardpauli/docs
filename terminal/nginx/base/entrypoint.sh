#!/usr/bin/env sh

overlay_folder () {
	source_d="$1"; shift; target_d="$1"; shift; excludes="$1"
	cd "$source_d"
	for p in *; do
		echo "$excludes" | grep "$target_d/$p" && continue
		[ -d "$p" ] && (mkdir -p "$target_d/$p" && overlay_folder "$source_d/$p" "$target_d/$p")
		[ -f "$p" ] && cp -f "$source_d/$p" "$target_d/$p"
	done
	return 0
}

overlay_nginx () {
	echo 'overlay /nginx'
	mkdir -p /app/nginx \
	&& overlay_folder /app/nginx-base /etc/nginx \
	&& overlay_folder /app/nginx /etc/nginx # "/etc/nginx/init.sh"
}

reload_nginx_on_new_ssl_cert () {
	tail -f -s 5 -n 0 "$server_ssl_crt_created_log" \
	| while read line; do echo "reload on cert" && /usr/sbin/nginx -s reload; done
}

# background process
if [ ! -z "$server_ssl_crt_created_log" ]; then
	reload_nginx_on_new_ssl_cert & reload_pid=$!; trap "kill $reload_pid" EXIT
fi

echo "entrypoint" \
&& overlay_nginx \
&& cd /etc/nginx/ && ./init.sh && echo "init done" \
&& /usr/sbin/nginx -g "daemon off;"
