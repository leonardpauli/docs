FROM alpine:3.7

# install nginx
RUN apk add --update nginx \
	&& rm -rf /var/cache/apk/* \
	&& mkdir -p /run/nginx

# layer application source
WORKDIR /usr/src/app
COPY ./ /usr/src/app/

# layer env data
# COPY ./setup/makeshift-data /usr/src/app/setup/
VOLUME /usr/src/app/data

# layer nginx config + set start
COPY ./nginx/ /etc/nginx/
EXPOSE 80 443

ENTRYPOINT ["./init-and-start.sh"]
