#!/bin/sh
sites="my-app" # "my-app other-app etc"

for site in $sites; do
	# [ $ENABLE_PROD = "true" ] && cat nginx/$site.prod.conf 2> /dev/null >> $site.conf
	# [ $ENABLE_LOCAL = "true" ] && cat nginx/$site.local.conf 2> /dev/null >> $site.conf
	
	if [ "$ENABLE_PROD" = "true" ]; then { echo "$(cat)" >> $site.conf ; } <<- EOF
		server {
			listen 443 ssl;
			listen [::]:443 ssl;
			server_name $(echo $(echo "$DOMAINS_PROD" | sed -e "s/,/ /g"));

			ssl_certificate ssl/prod.crt;
			ssl_certificate_key ssl/prod.key;

			include sites/$site.inner.conf;
		}
		EOF
	fi
	if [ "$ENABLE_LOCAL" = "true" ]; then { echo "$(cat)" >> $site.conf ; } <<- EOF
		server {
			listen 443 ssl;
			listen [::]:443 ssl;
			server_name $(echo $(echo "$DOMAINS_LOCAL" | sed -e "s/,/ /g"));

			ssl_certificate ssl/local.crt;
			ssl_certificate_key ssl/local.key;

			include sites/$site.inner.conf;
		}
		EOF
	fi
done
