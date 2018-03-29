FROM alpine:3.7

# install nginx
RUN apk add --update nginx \
	&& rm -rf /var/cache/apk/* \
	&& mkdir -p /run/nginx

# layer application source
WORKDIR /usr/src/app
COPY . /usr/src/app

# layer nginx config + set start
VOLUME /etc/nginx/ssl
COPY ./nginx/ /etc/nginx/
ENTRYPOINT ["/usr/sbin/nginx", "-g", "daemon off;"]
EXPOSE 80 443
