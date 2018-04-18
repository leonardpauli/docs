FROM alpine:3.7 as internal-base

# install nginx
RUN apk add --update nginx \
	&& rm -rf /var/cache/apk/* \
	&& mkdir -p /run/nginx

COPY nginx /app/nginx-base

# set start
EXPOSE 80 443
WORKDIR /app
COPY entrypoint.sh ./
ENTRYPOINT ["./entrypoint.sh"]


VOLUME /data/ssl
ENV \
	server_prod_enable="true" \
	server_local_enable="true" \
	server_default_prod_domains="my-app.com" \
	server_default_local_domains="my-app.localhost,local.my-app.com" \
	server_default_redirect_from_www="true" \
	server_https_force="false" \
	ssl_acme_webroot="/data/ssl/acme/webroot"



# target: example-simple
FROM internal-base as example-simple
# COPY examples/simple/nginx /app/nginx
COPY examples/simple/public /app/public


# target: base
FROM internal-base as base
# VOLUME /app/nginx // though requires re-running ./endpoint on change
# VOLUME /app/public
