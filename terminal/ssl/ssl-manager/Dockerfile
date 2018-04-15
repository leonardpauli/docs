FROM alpine:3.7

# install dependencies
RUN apk update -f && apk --no-cache add -f \
	openssl \
	curl \
	socat \
	&& rm -rf /var/cache/apk/*

COPY ./ /app/

# install acme.sh
ARG ssl_acme_data="/data/ssl/acme"
ARG ssl_acme_home="/app/acme"
RUN cd /app/acme.sh && ./acme.sh --install --nocron \
		--accountkey "$ssl_acme_data/accountkey" \
		--cert-home "$ssl_acme_data/certs" \
		--home "$ssl_acme_home" \
	&& rm -rf /app/acme.sh

WORKDIR /app
ENTRYPOINT ["./entrypoint.sh"]


# data
VOLUME /data/ca /data/ssl

ENV \
	ssl_data_makeshift_use="true" \
	ssl_dhparam_create="true" \
	ssl_dhparam_path="/data/ssl/dhparam.pem" \
	\
	ssl_local_ca_create="true" \
	ssl_local_ca_displayname="Local CA" \
	ssl_local_ca_key="/data/ca/ca.key" \
	ssl_local_ca_crt="/data/ca/ca.pem" \
	ssl_local_ca_signscript="/data/ca/sign-request.sh" \
	\
	ssl_local_create="true" \
	ssl_local_domains="my-app.localhost,local.my-app.com" \
	ssl_local_displayname="Some Name Local" \
	ssl_local_renew_schedule="10 0 */2 * *" \
	ssl_local_key="/data/ssl/local.key" \
	ssl_local_csr="/data/ssl/local.csr" \
	ssl_local_crt="/data/ssl/local.crt" \
	\
	ssl_prod_create="false" \
	ssl_prod_domains="my-app.com" \
	ssl_prod_displayname="My App" \
	ssl_prod_renew_schedule="40 0 */2 * *" \
	ssl_prod_key="/data/ssl/prod.key" \
	ssl_prod_csr="/data/ssl/prod.csr" \
	ssl_prod_crt="/data/ssl/prod.crt" \
	ssl_prod_stageing="true" \
	ssl_prod_notify_email="" \
	\
	ssl_acme_data="$ssl_acme_data" \
	ssl_acme_home="$ssl_acme_home" \
	ssl_acme_webroot="$ssl_acme_home/webroot" \
	\
	ssl_crt_created_log="/data/ssl/creation.log"

# ssl_acme_data and ssl_acme_home are non-changable after build
# ssl_crt_created_log: tail -f it for changes and restart/reload certs if necessary 
# tail -f -s 5 -n 0 "$ssl_crt_created_log" | while read line; do echo "restart $line"; done


# example:
# .env
# 	domain_base=my-app
# 	domain_prod=my-app.com
# 	production=false
# server:
# 	volumes: ["./data/ssl/acme/webroot/.well-known/acme-challenge":"/public/.well-known/acme-challenge"]
# ssl-manager:
# 	volumes: ["./data/ca:/data/ca", "./data/ssl:/data/ssl"]
# 	environment:
#			ssl_local_domains: "${domain_base}.localhost,local.$domain_prod"
#			ssl_local_displayname: "$domain_base (local)"
#			ssl_prod_create: "$production"
#			ssl_prod_domains: "$domain_prod"
#			ssl_prod_displayname: "$domain_base"
#			ssl_prod_notify_email: "webmaster@$domain_prod"
#			ssl_prod_stageing: "false"

# notes:
# regenerates on startup if crt is missing (for ca, local, and prod)
# key is optional (for this script)
