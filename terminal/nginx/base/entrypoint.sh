#!/usr/bin/env sh

overlay_folder () {
	source_d="$1"; target_d="$2"
	cd "$source_d"
	for p in *; do
		[ -d "$p" ] && (mkdir -p "$target_d/$p" && overlay_folder "$source_d/$p" "$target_d/$p")
		[ -f "$p" ] && cp -f "$source_d/$p" "$target_d/$p"
	done
	return 0
}

overlay_nginx () {
	echo 'overlay /nginx'
	mkdir -p /app/nginx \
	&& overlay_folder /app/nginx-base /etc/nginx \
	&& overlay_folder /app/nginx /etc/nginx
}

echo "entrypoint" \
&& overlay_nginx \
&& cd /etc/nginx/ && ./init.sh \
&& /usr/sbin/nginx -g "daemon off;"
