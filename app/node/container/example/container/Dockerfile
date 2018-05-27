ARG imageWithSha=node:9.11-alpine@sha256:5149aec8f508d48998e6230cdc8e6832cba192088b442c8ef7e23df3c6892cd3

# // dev
FROM $imageWithSha as dev
VOLUME /app
VOLUME /app/node_modules
VOLUME /root/.npm
VOLUME /data
WORKDIR /app
CMD ["npm", "run", "dev"]

# // lib
# builder
FROM $imageWithSha as builder-installer
WORKDIR /app
COPY ./package.json ./package-lock.json /app/

ARG npm_config_registry
ENV npm_config_registry=$npm_config_registry
RUN npm install

FROM $imageWithSha as builder
COPY --from=builder-installer /app/node_modules /tmp/node_modules
COPY . /app
RUN cp -rf /tmp/node_modules /app/node_modules \
	&& (export NODE_ENV=production; cd /app && npm run build)

# runtime
FROM $imageWithSha as prod
COPY --from=builder /app/lib /app/lib
VOLUME /data
WORKDIR /app
CMD ["node", "lib/index.js"]


# # // alt for dist with prod deps
# # prod-deps-installer
# FROM $imageWithSha as prod-deps-installer
# WORKDIR /app
# COPY ./package.json ./package-lock.json /app/

# ARG npm_config_registry
# ENV npm_config_registry=$npm_config_registry
# RUN export NODE_ENV=production; npm install

# # server
# FROM $imageWithSha as prod
# WORKDIR /app
# COPY --from=prod-deps-installer /app/node_modules /app/node_modules
# COPY --from=builder /app/dist /app/dist
# ENV NODE_ENV=production
# CMD ["node", "lib/index.js"]


# # // alt for pure dist
# # server
# FROM ... as prod
# COPY --from=builder /app/dist /app/dist
# CMD ["simple-server", "/app/dist"]
