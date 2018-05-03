FROM verdaccio/verdaccio:latest
USER root
RUN apk --no-cache add iptables
# see docker.Dockerfile."redirect port 80"
EXPOSE 80
USER verdaccio
