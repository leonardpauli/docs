FROM alpine:3.7

# install nginx
RUN apk add --update nginx \
	&& rm -rf /var/cache/apk/* \
	&& mkdir -p /run/nginx

# layer application source
WORKDIR /usr/src/app
COPY . /usr/src/app

# layer nginx config + set start
COPY ./nginx /etc/nginx/conf.d
ENTRYPOINT ["/usr/sbin/nginx", "-g", "daemon off;"]
EXPOSE 80
