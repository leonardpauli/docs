# echo node_modules >> .dockerignore
# echo dist >> .dockerignore
# see docker-compose

ARG imageWithSha=node:10.15-alpine@sha256:0cbb2f7bbc8e7c3a519fa05263cea700324f627369bd44c0a42f8da275179e19

# project-dir/{dist, node_modules, package.json, package-lock.json, src, ...}
# cmd: npm i, npm test, npm build -> /app/dist, clean + cp -> /dist, echo dist updated

# nginx

# git commit -> git hook (or manual ssh command) -> do -> builder -> git pull -> docker run . --build --rm
# alt: simple sh to test + build locally + rsync dist to do

# builder
FROM $imageWithSha as builder
WORKDIR /app

ARG npm_config_registry
ENV npm_config_registry=$npm_config_registry

VOLUME /root/.npm
VOLUME /app/node_modules
VOLUME /dist

# dockerignore node_modules
COPY . /app-tmp

# clean dist, copy source (except dependencies),
# TODO: change npm install to npm ci (though its wasteful by rm:ing node_modules?)
CMD ["/bin/sh", "-c", "rm -rf /app-tmp/dist /app-tmp/node_modules && cp -rf /app-tmp/* /app/ && npm install && (export NODE_ENV=production; npm run build && rm -rf /dist/* && mv -f dist/* /dist && echo dist updated)"]
