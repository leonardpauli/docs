# dev
FROM node:9.11-alpine as dev
VOLUME /app
VOLUME /app/node_modules
VOLUME /root/.npm
VOLUME /data
ENV \
	npm_config_prefer_offline=true \
	NODE_ENV=development
WORKDIR /app
CMD ["npm", "run", "dev"]

# builder
FROM node:9.11-alpine as builder-installer
RUN rm /usr/local/bin/yarn
# rel. caching of dependencies, see docker.build.caching-issue
WORKDIR /app
COPY ./package.json ./package-lock.json /app/
COPY ./container/data/node_modules-dev /app/node_modules
# CMD ["tail", "-f", "/dev/null"]
RUN export NODE_ENV=development; export npm_config_prefer_offline=true; npm install

FROM node:9.11-alpine as builder
COPY --from=builder-installer /app/node_modules /tmp/node_modules
COPY . /app
RUN cp -rf /tmp/node_modules /app/node_modules \
	&& (export NODE_ENV=production; cd /app && npm run build)

# for lib
FROM alpine:3.7 as prod
COPY --from=builder /usr/local/bin/node /usr/local/bin/
COPY --from=builder /usr/lib/ /usr/lib/
# FROM node:9.11-alpine as prod
COPY --from=builder /app/node_modules /app/node_modules
# TODO: possibly copy in node_modules as well, with dev-dependencies removed
COPY --from=builder /app/lib /app/lib
VOLUME /data
WORKDIR /app
CMD ["node", "lib/index.js"]

# alt for dist
# FROM ... as prod
# COPY --from=builder /app/dist /app/dist
# CMD ["simple-server", "/app/dist"]
