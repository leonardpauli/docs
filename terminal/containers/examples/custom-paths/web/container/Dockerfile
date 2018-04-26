FROM alpine:3.7 as internal-base
VOLUME /data

FROM internal-base as dev
VOLUME /src

FROM internal-base as prod
# relative to context root
COPY ./web/src /src
